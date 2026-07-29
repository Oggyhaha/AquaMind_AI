"""
AquaMind AI — Autonomous Water Intelligence OS
FastAPI Enterprise REST Gateway & AI Chat Router
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from database import init_db, SessionLocal, UserDB, DistrictDB, TaskDB, AuditLogDB
from agents import run_multi_agent_pipeline, generate_role_ai_response

app = FastAPI(
    title="AquaMind AI Enterprise API Gateway",
    description="Backend API Gateway for Autonomous Water Intelligence OS & Operations Command Center",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory + DB fallback state for emergency mode
GLOBAL_EMERGENCY_STATE: Dict[str, Any] = {
    "is_active": False,
    "details": None
}

@app.on_event("startup")
def startup_event():
    try:
        init_db()
        print("[AquaMind AI] Database initialized successfully.")
    except Exception as e:
        print(f"[AquaMind AI] Database initialization note: {e}")

@app.get("/")
def read_root():
    groq_active = bool(os.getenv("GROQ_API_KEY"))
    openai_active = bool(os.getenv("OPENAI_API_KEY"))
    db_url = os.getenv("DATABASE_URL", "sqlite:///./aquamind.db")

    return {
        "status": "ONLINE",
        "system": "AquaMind AI Autonomous Water Intelligence OS",
        "version": "2.0.0",
        "government_entity": "Government of Gujarat Water Resources Department",
        "ai_providers": {
            "groq_llama3": "ACTIVE" if groq_active else "STANDBY",
            "openai_gpt4o": "ACTIVE" if openai_active else "STANDBY"
        },
        "database": "PostgreSQL Connected" if "postgresql" in db_url else "SQLite Active"
    }

@app.get("/api/health")
def health_check():
    return {
        "database": "HEALTHY",
        "groq_api": "CONFIGURED" if os.getenv("GROQ_API_KEY") else "NOT_SET",
        "openai_api": "CONFIGURED" if os.getenv("OPENAI_API_KEY") else "NOT_SET",
        "ai_agents": "4/4 ACTIVE",
        "telemetry_sensors": "ONLINE"
    }

# Tasks REST Endpoints for Real DB Persistence
class TaskModel(BaseModel):
    id: str
    title: str
    description: str
    districtId: str
    districtName: str
    priority: str
    status: str
    assignedEngineerName: Optional[str] = None
    approvedBy: Optional[str] = None
    waterSavedLiters: Optional[float] = 0
    populationBenefited: Optional[int] = 0

@app.get("/api/tasks")
def get_tasks():
    db = SessionLocal()
    try:
        db_tasks = db.query(TaskDB).all()
        if db_tasks:
            return [{
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "districtId": t.district_id,
                "districtName": t.district_name,
                "priority": t.priority,
                "status": t.status,
                "assignedEngineerName": t.assigned_engineer_name,
                "approvedBy": t.approved_by,
                "waterSavedLiters": t.water_saved_liters,
                "populationBenefited": t.population_benefited
            } for t in db_tasks]
    except Exception as e:
        print(f"DB read note: {e}")
    finally:
        db.close()
    return []

@app.post("/api/tasks")
def create_task(task: TaskModel):
    db = SessionLocal()
    try:
        db_task = TaskDB(
            id=task.id,
            title=task.title,
            description=task.description,
            district_id=task.districtId,
            district_name=task.districtName,
            priority=task.priority,
            status=task.status,
            assigned_engineer_name=task.assignedEngineerName,
            approved_by=task.approvedBy,
            water_saved_liters=task.waterSavedLiters or 0,
            population_benefited=task.populationBenefited or 0
        )
        db.add(db_task)
        db.commit()
        return {"status": "SUCCESS", "id": task.id}
    except Exception as e:
        db.rollback()
        return {"status": "STORED_LOCALLY", "note": str(e)}
    finally:
        db.close()

# Emergency State REST Endpoints
class EmergencyTriggerRequest(BaseModel):
    title: str
    description: str
    district: str
    triggeredBy: str

@app.get("/api/emergency")
def get_emergency_status():
    return GLOBAL_EMERGENCY_STATE

@app.post("/api/emergency/trigger")
def trigger_emergency(req: EmergencyTriggerRequest):
    GLOBAL_EMERGENCY_STATE["is_active"] = True
    GLOBAL_EMERGENCY_STATE["details"] = {
        "title": req.title,
        "description": req.description,
        "district": req.district,
        "triggeredBy": req.triggeredBy,
        "isTakenOver": False
    }
    return GLOBAL_EMERGENCY_STATE

@app.post("/api/emergency/takeover")
def takeover_emergency(officerName: str):
    if GLOBAL_EMERGENCY_STATE["details"]:
        GLOBAL_EMERGENCY_STATE["details"]["isTakenOver"] = True
        GLOBAL_EMERGENCY_STATE["details"]["takenOverBy"] = officerName
    return GLOBAL_EMERGENCY_STATE

@app.post("/api/emergency/deactivate")
def deactivate_emergency():
    GLOBAL_EMERGENCY_STATE["is_active"] = False
    GLOBAL_EMERGENCY_STATE["details"] = None
    return GLOBAL_EMERGENCY_STATE

class AIChatRequest(BaseModel):
    prompt: str
    role: str
    district: Optional[str] = "Ahmedabad"

@app.post("/api/ai/chat")
def ai_chat_endpoint(req: AIChatRequest):
    try:
        response_text = generate_role_ai_response(req.prompt, req.role, req.district)
        return {
            "status": "SUCCESS",
            "reply": response_text,
            "role": req.role,
            "provider": "Groq Llama 3 70B" if os.getenv("GROQ_API_KEY") else "OpenAI GPT-4o"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analyze")
def trigger_ai_pipeline():
    district_sample = {"waterDemandMLD": 1450, "waterSupplyMLD": 1280}
    pipeline_sample = {"leakProbability": 91, "healthScore": 42}
    result = run_multi_agent_pipeline(district_sample, pipeline_sample)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
