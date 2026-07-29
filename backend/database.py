"""
AquaMind AI — Database Architecture
SQLAlchemy ORM Data Models for PostgreSQL / SQLite
"""
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# Database connection URL (Defaults to SQLite for local zero-dependency run, supports PostgreSQL via env)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aquamind.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False) # super_admin, state_authority, district_officer, engineer, emergency_officer, researcher
    role_title = Column(String, nullable=False)
    district = Column(String, nullable=True)
    department = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DistrictDB(Base):
    __tablename__ = "districts"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    risk_level = Column(String, nullable=False) # critical, high, moderate, safe
    population = Column(Integer, nullable=False)
    water_demand_mld = Column(Float, nullable=False)
    water_supply_mld = Column(Float, nullable=False)
    groundwater_level_m = Column(Float, nullable=False)
    reservoir_count = Column(Integer, default=0)
    active_alerts_count = Column(Integer, default=0)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

class ReservoirDB(Base):
    __tablename__ = "reservoirs"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    capacity_mcm = Column(Float, nullable=False)
    current_level_mcm = Column(Float, nullable=False)
    fill_percentage = Column(Float, nullable=False)
    inflow_cusecs = Column(Float, nullable=False)
    outflow_cusecs = Column(Float, nullable=False)
    status = Column(String, nullable=False)

class PipelineDB(Base):
    __tablename__ = "pipelines"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    length_km = Column(Float, nullable=False)
    pressure_bar = Column(Float, nullable=False)
    flow_lps = Column(Float, nullable=False)
    leak_probability = Column(Float, nullable=False)
    health_score = Column(Float, nullable=False)
    status = Column(String, nullable=False)

class TaskDB(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    recommendation_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    district_id = Column(String, nullable=False)
    district_name = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, nullable=False) # draft, ai_suggested, approved, assigned, in_progress, completed, verified, closed
    assigned_engineer_id = Column(String, nullable=True)
    assigned_engineer_name = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    evidence_photo_url = Column(String, nullable=True)
    evidence_notes = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    water_saved_liters = Column(Float, default=0)
    population_benefited = Column(Integer, default=0)

class AuditLogDB(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    ip_address = Column(String, default="127.0.0.1")
    status = Column(String, default="SUCCESS")

def init_db():
    Base.metadata.create_all(bind=engine)
