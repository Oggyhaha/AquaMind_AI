"""
AquaMind AI — Database Architecture & Configuration
SQLAlchemy ORM Data Models for PostgreSQL / SQLite
"""
import os
import urllib.parse
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

# Retrieve DATABASE_URL from environment or .env
RAW_DB_URL = os.getenv("DATABASE_URL", "sqlite:///./aquamind.db").strip('"\'')

# Handle PostgreSQL URL driver scheme if needed
if RAW_DB_URL.startswith("postgres://"):
    RAW_DB_URL = RAW_DB_URL.replace("postgres://", "postgresql://", 1)

try:
    if "postgresql" in RAW_DB_URL:
        engine = create_engine(RAW_DB_URL, pool_pre_ping=True)
        print(f"[AquaMind Database] Connected to PostgreSQL Database.")
    else:
        engine = create_engine(RAW_DB_URL, connect_args={"check_same_thread": False})
        print(f"[AquaMind Database] Connected to SQLite Database (aquamind.db).")
except Exception as e:
    print(f"[AquaMind Database] Connection warning: {e}. Falling back to SQLite.")
    engine = create_engine("sqlite:///./aquamind.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    district = Column(String, nullable=True)
    department = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DistrictDB(Base):
    __tablename__ = "districts"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    population = Column(Integer, nullable=False)
    water_demand_mld = Column(Float, nullable=False)
    water_supply_mld = Column(Float, nullable=False)
    groundwater_level_m = Column(Float, nullable=False)
    reservoir_count = Column(Integer, default=0)
    active_alerts_count = Column(Integer, default=0)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

class TaskDB(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    recommendation_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    district_id = Column(String, nullable=False)
    district_name = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, nullable=False)
    assigned_engineer_id = Column(String, nullable=True)
    assigned_engineer_name = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    approval_comment = Column(Text, nullable=True)
    digital_signature = Column(String, nullable=True)
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
