# 🌊 AquaMind AI — Autonomous Water Intelligence & Operations OS
> **Enterprise Decision Support & Closed-Loop Operations Command Center for Government of Gujarat Water Resources Department**

[![Tech Stack](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Tailwind-0ea5e9?style=for-the-badge)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%20%7C%20PostgreSQL-3b82f6?style=for-the-badge)](https://fastapi.tiangolo.com)
[![GIS Engine](https://img.shields.io/badge/GIS-Leaflet%20%7C%20OpenStreetMap%20%7C%20CartoDB-10b981?style=for-the-badge)](https://leafletjs.com)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Groq%20Llama--3.3%2070B%20%7C%20OpenAI%20GPT--4o-8b5cf6?style=for-the-badge)](https://groq.com)

---

## 🎯 Executive Summary & Vision

Traditional government water management tools suffer from a **broken operational loop**: AI models predict shortages or pipeline leaks, but recommendations sit unread in static PDFs, spreadsheets, and manual meeting minutes.

**AquaMind AI closes the loop**. It transforms predictive AI insights into audited, digitally signed, and verified government field execution across all 33 Gujarat districts:

$$\mathbf{Predict} \longrightarrow \mathbf{Explain} \longrightarrow \mathbf{Recommend} \longrightarrow \mathbf{Digital\ Approval} \longrightarrow \mathbf{Assign\ Engineer} \longrightarrow \mathbf{Field\ Execution} \longrightarrow \mathbf{Verify} \longrightarrow \mathbf{Measure\ Impact}$$

---

## 🚀 Key Features & Capabilities

- **🗺️ Real Leaflet GIS Hydrological Map**:
  - Live OpenStreetMap & CartoDB tiles (Voyager light / Dark Matter dark mode).
  - Accurate GPS placement of all 33 Gujarat districts, reservoirs, and trunk canal lines.
  - Interactive risk-colored markers, live telemetry feeds, and district inspection sidepanel.
- **🚨 Statewide Emergency Crisis Lifecycle**:
  - State Secretary can trigger a statewide emergency alert with custom crisis scope.
  - District Water Officers can perform real-time emergency takeover of local operations.
  - Deactivation restricted to Secretary post-takeover, broadcasted across all active browser tabs in real time.
- **📊 Real-Time Cross-Tab Synchronization**:
  - Built-in HTML5 `BroadcastChannel` & `localStorage` event sync.
  - Changes in task assignments, emergency state, or audit logs update instantaneously across open browser windows.
- **🌗 Centralized Dark / Light Theme Engine**:
  - ThemeContext provider with instant switching across maps, Recharts graphs, toast alerts, and modals.
- **📱 Animated KPIs & Sparklines**:
  - Real-time 60fps count-up number transitions with inline 7-day trend sparkline charts.
- **🔔 Toast Notification System**:
  - Glassmorphic animated toast popups for task assignments, emergency alerts, and system events.
- **🖨️ Government Print-Ready Dashboard Export**:
  - One-click export of clean, official print-formatted HTML/PDF reports with audit signatures.

---

## 🏗️ System Architecture

```
                                  PUBLIC INTERNET
                                         │
                                         ▼
                            Frontend (React 19 / Vite)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
      Public Entrance Portal                           Authentication Layer
    & Govt Command Workstation                         (JWT + LocalStorage RBAC)
                                                                 │
                                                                 ▼
                                                  Role-Based Access Control (RBAC)
                                                                 │
 ┌──────────────┬──────────────┬─────────────────┼───────────────┼──────────────┐
 ▼              ▼              ▼                 ▼               ▼              ▼
State Sec.    District Off   Lead Eng       Emergency Off     Super Admin    Researcher
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
  (LangGraph)            (Jira + Govt Workflow)    (Audits, Telemetry)
      │                                                 │
  ┌───┴──────────┬──────────────┬──────────────┐        ▼
  ▼              ▼              ▼              ▼     Vector DB (Qdrant)
Forecast      Infra        Intelligence  Recommendation (Policy RAG)
Agent         Agent           Agent         Agent
(XGBoost)   (Acoustics)     (Policy RAG)   (Impact)
```

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite** | High-performance SPA command center application |
| **Styling & UI** | **Tailwind CSS + Glassmorphism** | Fully responsive dark/light theme design system |
| **Mapping & GIS** | **Leaflet.js + OpenStreetMap** | CartoDB Voyager & Dark Matter tile layers for 33 Gujarat districts |
| **Data Visualizations** | **Recharts + Custom Sparklines** | Dynamic theme-aware supply-demand bar charts & KPI sparklines |
| **Backend API Gateway** | **FastAPI (Python 3.11)** | REST API with CORS middleware & state persistence endpoints |
| **Database** | **PostgreSQL (Supabase) / SQLite** | SQLAlchemy ORM for task lifecycles, emergency state, and audit trails |
| **Primary LLM Engine** | **Groq API (Llama-3.3 70B)** | Sub-second high-reasoning AI chat & multi-agent synthesis |
| **Fallback LLM Engine** | **OpenAI API (GPT-4o)** | Backup policy reasoning and executive summary generation |
| **State Sync** | **BroadcastChannel API** | Real-time cross-tab state synchronization without WebSocket overhead |

---

## 🔐 Role-Based Workstation Matrix

AquaMind AI includes 6 pre-seeded Demo Accounts on the login portal:

| Role Icon & Title | User | Primary Workspace | Core Capabilities | Demo Login Email |
| :--- | :--- | :--- | :--- | :--- |
| 🏛️ **Secretary, Water Resources** | Dr. Vikram Shah | Statewide Command Dashboard | Declare/deactivate statewide emergency, approve AI recommendations, create work orders | `state@aquamind.ai` |
| 🏙️ **District Water Officer** | Amitabh Joshi | District Operational Hub | Monitor local MLD supply/demand, execute emergency takeover, assign work orders | `district@aquamind.ai` |
| 🔧 **Lead Infrastructure Engineer**| Priya Desai | Field Maintenance Board | Work on assigned repair orders, update status (Assigned $\rightarrow$ In Progress $\rightarrow$ Completed) | `engineer@aquamind.ai` |
| 🚨 **Disaster Response Officer** | Sanjay Varma | Emergency Grid Portal | Monitor high-risk TDS/drought alerts, request mobile tanker & purification dispatch | `emergency@aquamind.ai` |
| 👑 **Super Administrator** | Rajesh Patel | System Governance | User account management, AI model router configuration, security audit logs | `admin@aquamind.ai` |
| 📊 **Hydrology Researcher** | Prof. Ananya Mehta | GTU Research Lab | Read-only hydrology trends, 10-year groundwater depth curves, export reports | `research@aquamind.ai` |

*Default Demo Password for all accounts*: `Demo@123`

---

## 🤖 Multi-Agent AI Engine

1. **Forecast Agent**: Uses time-series ML models to predict 30-day reservoir drawdown curves and municipal demand spikes.
2. **Infrastructure Agent**: Analyzes acoustic vibration telemetry (420 Hz leak signature) to score trunk pipeline health.
3. **Intelligence Agent**: Performs RAG policy compliance checks over the *Gujarat Water Allocation Policy 2024*.
4. **Recommendation Agent**: Synthesizes inputs into prioritized action drafts with estimated water savings ($M$ Liters) and population impact metrics.

---

## 📂 Project Directory Structure

```
aquamind-ai/
├── frontend/                  # React 19 SPA Frontend
│   ├── package.json           # Dependencies (leaflet, recharts, tailwindcss)
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Dark mode & color palette tokens
│   └── src/
│       ├── components/
│       │   ├── admin/         # AdminPanel.tsx (Audit logs & user management)
│       │   ├── ai/            # MultiAgentMissionControl.tsx & AIChatDrawer.tsx
│       │   ├── auth/          # LoginScreen.tsx (Enterprise auth portal)
│       │   ├── chat/          # InterDeptChat.tsx (Inter-department command channel)
│       │   ├── dashboard/     # GujaratMap.tsx (Leaflet GIS) & 5 Role Dashboards
│       │   ├── layout/        # Navbar.tsx & Sidebar.tsx
│       │   ├── operations/    # TaskBoard.tsx, CreateTaskModal.tsx, EmergencyModal.tsx
│       │   ├── reports/       # ReportsView.tsx (HTML/PDF executive exporter)
│       │   └── ui/            # Toast.tsx, AnimatedKPI.tsx, SplashScreen.tsx, PrintDashboard.tsx
│       ├── context/
│       │   └── ThemeContext.tsx # Centralized dark/light theme context provider
│       ├── utils/
│       │   └── storage.ts     # HTML5 BroadcastChannel & localStorage persistence
│       ├── App.tsx            # Main state orchestrator & router
│       └── main.tsx           # React DOM root entry
├── backend/                   # FastAPI Python Server
│   ├── main.py                # REST API endpoints & CORS setup
│   ├── database.py            # SQLAlchemy database models
│   └── .env                   # Environment API keys (GROQ_API_KEY)
└── README.md                  # System Documentation
```

---

## ⚡ Local Development Setup

### 1. Start Python FastAPI Backend
```bash
cd backend
python main.py
```
*(Runs on `http://localhost:8000`)*

### 2. Start React SPA Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

Open `http://localhost:3000` in your browser to launch **AquaMind AI**!