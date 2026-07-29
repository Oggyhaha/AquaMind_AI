# 🌊 AquaMind AI — Autonomous Water Intelligence Command OS
### Complete Enterprise Documentation & System Manual
**Developed for Maverick Effect AI Challenge (Gujarat Hackathon)**  
**Problem Category:** Water Intelligence Platform  

---

## 1. Executive Summary & Vision

**AquaMind AI** is an enterprise AI-powered Decision Support & Operations Management Platform built specifically for the **Water Resources Department, Government of Gujarat**.

Unlike traditional dashboards that only show static graphs, AquaMind AI **closes the operational loop** from AI anomaly prediction to verified government field execution:

$$\text{Predict} \longrightarrow \text{Explain} \longrightarrow \text{Recommend} \longrightarrow \text{Digital Approval} \longrightarrow \text{Assign Engineer} \longrightarrow \text{Execute & Upload Proof} \longrightarrow \text{Verify & Close}$$

---

## 2. Enterprise System Architecture

```
                                  PUBLIC INTERNET
                                         │
                                         ▼
                             https://aquamind.ai
                                         │
                                         ▼
                            Frontend (Next.js / Vite)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
      Public Landing Page                                Authentication Layer
    & Govt Command Entrance                              (JWT + Session Token)
                                                                 │
                                                                 ▼
                                                  Role-Based Access Control (RBAC)
                                                                 │
 ┌──────────────┬──────────────┬─────────────────┼───────────────┼──────────────┐
 ▼              ▼              ▼                 ▼               ▼              ▼
State Auth   District Off   Lead Eng       Emergency Off     Super Admin    Researcher
🏛️             🏙️             🔧                🚨              👑             📊
 │              │              │                 │               │              │
 └──────────────┴──────────────┼─────────────────┴───────────────┴──────────────┘
                               │
                               ▼
                    FastAPI Backend Gateway
                               │
      ┌────────────────────────┼────────────────────────┐
      ▼                        ▼                        ▼
4-Agent AI Engine     Closed-Loop Task Engine   PostgreSQL / SQLite DB
  (LangGraph)            (Jira + Govt Workflow)    (Audits, Sensors)
      │                                                 │
  ┌───┴──────────┬──────────────┬──────────────┐        ▼
  ▼              ▼              ▼              ▼     Qdrant Vector DB
Forecast      Infra        Intelligence  Recommendation (Policy RAG)
Agent         Agent           Agent         Agent
(XGBoost)   (Acoustics)     (Policy RAG)   (Impact)
```

---

## 3. Project Directory Architecture

The repository is organized into distinct frontend and backend micro-services:

```
c:\Aquamind_AI\
├── frontend\                  # Next.js / React 19 Frontend Web Application
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.ts         # Vite bundler configuration
│   ├── tailwind.config.js     # Tailwind CSS design system with 20% font scaling
│   ├── index.html             # HTML5 Entry point
│   └── src\
│       ├── types\             # TypeScript interfaces (User, Task, Recommendation)
│       ├── data\              # Gujarat districts dataset & demo credentials
│       ├── components\
│       │   ├── auth\          # LoginScreen.tsx (Public portal & Jury demo switcher)
│       │   ├── layout\        # Navbar.tsx & Sidebar.tsx
│       │   ├── dashboard\     # GujaratMap.tsx (Re-scaled GIS map) & Role dashboards
│       │   ├── ai\            # MultiAgentMissionControl.tsx & AIChatDrawer.tsx
│       │   ├── operations\    # TaskBoard.tsx & DigitalApprovalModal.tsx
│       │   └── admin\         # AdminPanel.tsx (User management & audit trail)
│       ├── App.tsx            # Auth state manager & Role router
│       └── main.tsx           # React DOM root
├── backend\                   # FastAPI Python Enterprise Server
│   ├── main.py                # REST API router & JWT auth endpoints
│   ├── database.py            # SQLAlchemy ORM models (PostgreSQL & SQLite)
│   └── agents.py              # LangGraph multi-agent orchestration logic
├── package.json               # Root proxy package runner
└── documentation.md           # System documentation & manual
```

---

## 4. 5-Layer Authentication & Authorization Architecture

1. **Layer 1 — Public Entrance & Identity**:
   - User accesses `https://aquamind.ai`. Unauthenticated visitors see the **Public Portal & Command Login Screen**.
2. **Layer 2 — Credentials Authentication**:
   - Accepts email/password or 1-Click Demo Account selection for hackathon evaluation.
3. **Layer 3 — Session & JWT Token**:
   - Returns encrypted access token stored securely in session context.
4. **Layer 4 — Role-Based Access Control (RBAC)**:
   - System validates user role (*Super Admin, State Water Authority, District Water Officer, Lead Engineer, Emergency Response Officer, Researcher*).
5. **Layer 5 — Permission Guard Layer**:
   - Dynamically restricts UI views, actions, and API endpoints based on permission claims.

---

## 5. Role-Specific Tailored Experiences

| Role | Primary Interface | Accessible Modules | AI Persona | Demo Credential |
| :--- | :--- | :--- | :--- | :--- |
| **🏛️ State Authority** | Statewide Executive Dashboard | State Overview, Gujarat GIS Heatmap, Approval Queue, AI Control, Impact Reports | Strategic Policy & Allocation Advisor | `state@aquamind.ai` |
| **🏙️ District Officer** | District Command (Ahmedabad) | District KPIs, Local Reservoirs, Engineer Task Assignment, Work Verification | Local Hydrology & Demand Deficit Advisor | `district@aquamind.ai` |
| **🔧 Lead Engineer** | Hydraulic Field Dispatch | My Assigned Work Orders, Acoustic Leak Telemetry, Evidence Photo Upload | Technical Maintenance Assistant | `engineer@aquamind.ai` |
| **🚨 Emergency Officer** | Disaster Response Grid | High-Risk Red Alerts, Mobile Tanker Dispatch Requests, Crisis Protocol | Disaster Management Coordinator | `emergency@aquamind.ai` |
| **👑 Super Admin** | Root Control Center | User & Role Management, AI Model Router, System Telemetry, Audit Trail | System Governance Assistant | `admin@aquamind.ai` |
| **📊 Researcher** | Hydrology Innovation Lab | Read-Only Analytics, 10-Year Groundwater Trends, Dataset CSV Exporter | Historical Hydrology Analyst | `research@aquamind.ai` |

---

## 6. Digital Approval Chain with Signatures

When the State Water Authority approves an AI Recommendation:
- Requires a mandatory **Approval Comment** (e.g. *"Reservoir release approved due to predicted 12-day shortage in Rajkot urban area"*).
- Generates an immutable **Digital Signature Stamp** (e.g. `#DIG-SIG-STATE-2026-9904`).
- Logs the action into the system audit trail.

---

## 7. Gujarat GIS Map Visual Improvements

- Re-scaled SVG Viewport (`0 0 950 680`) and optimized coordinate transformation math:
  - Latitude bounds: 20.0°N to 24.8°N
  - Longitude bounds: 68.2°E to 74.8°E
- Ensures **100% of Gujarat's 33 districts and major reservoirs** (including southern coastal districts like Surat, Bharuch, and Valsad) render completely without any bottom clipping or edge truncation.

---

## 8. How to Run Locally

### Start Frontend Application
```bash
cd c:\Aquamind_AI\frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Start Backend API Gateway (Optional Python FastAPI Server)
```bash
cd c:\Aquamind_AI\backend
pip install fastapi uvicorn sqlalchemy pydantic
python main.py
```
Open API Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs).
