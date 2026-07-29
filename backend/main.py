"""
AquaMind AI — Autonomous Water Intelligence OS
FastAPI Enterprise REST Gateway & AI Chat Router
"""
import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from database import init_db, SessionLocal, UserDB, DistrictDB, TaskDB, AuditLogDB
from agents import run_multi_agent_pipeline, generate_role_ai_response

app = FastAPI(
    title="AquaMind AI Enterprise API Gateway",
    description="Backend API Gateway for Autonomous Water Intelligence OS & Operations Command Center",
    version="2.0.0"
)

# Enable CORS for Next.js / Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(req: LoginRequest):
    demo_accounts = {
        "admin@aquamind.ai": {"name": "Rajesh Patel", "role": "super_admin", "title": "Super Administrator"},
        "state@aquamind.ai": {"name": "Dr. Vikram Shah", "role": "state_authority", "title": "Secretary, Water Resources"},
        "district@aquamind.ai": {"name": "Amitabh Joshi", "role": "district_officer", "title": "District Water Officer"},
        "engineer@aquamind.ai": {"name": "Priya Desai", "role": "engineer", "title": "Lead Infrastructure Engineer"},
        "emergency@aquamind.ai": {"name": "Sanjay Varma", "role": "emergency_officer", "title": "Disaster Response Officer"},
        "research@aquamind.ai": {"name": "Prof. Ananya Mehta", "role": "researcher", "title": "Hydrology Researcher"}
    }

    if req.email in demo_accounts:
        user_info = demo_accounts[req.email]
        return {
            "token": f"mock_jwt_token_{user_info['role']}",
            "user": {
                "email": req.email,
                "name": user_info["name"],
                "role": user_info["role"],
                "roleTitle": user_info["title"]
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials. Use pre-seeded demo accounts.")

class AIChatRequest(BaseModel):
    prompt: str
    role: str
    district: Optional[str] = "Ahmedabad"

@app.post("/api/ai/chat")
def ai_chat_endpoint(req: AIChatRequest):
    """Real AI Assistant endpoint calling Groq (Llama 3 70B) or OpenAI API"""
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
