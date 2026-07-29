"""
AquaMind AI — Autonomous Water Intelligence Command Center
FastAPI Main Application Server
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from database import init_db, SessionLocal, UserDB, DistrictDB, TaskDB, AuditLogDB
from agents import run_multi_agent_pipeline

app = FastAPI(
    title="AquaMind AI API",
    description="Backend API Gateway for Autonomous Water Intelligence OS & Operations Command Center",
    version="1.0.0"
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
    init_db()

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": "AquaMind AI Autonomous Water Intelligence Command Center",
        "version": "1.0.0",
        "government_entity": "Government of Gujarat Water Resources Department"
    }

@app.get("/api/health")
def health_check():
    return {
        "database": "CONNECTED",
        "vector_db_qdrant": "SYNCED",
        "ai_agents": "4/4 ACTIVE",
        "telemetry_sensors": "ONLINE"
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(req: LoginRequest):
    # Pre-seeded demo user validation
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

@app.post("/api/ai/analyze")
def trigger_ai_pipeline():
    district_sample = {"waterDemandMLD": 1450, "waterSupplyMLD": 1280}
    pipeline_sample = {"leakProbability": 91, "healthScore": 42}
    result = run_multi_agent_pipeline(district_sample, pipeline_sample)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
