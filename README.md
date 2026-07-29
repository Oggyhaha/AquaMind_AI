# 🌊 AquaMind AI — Autonomous Water Intelligence OS
> **Enterprise Decision Support & Closed-Loop Operations Command Center for Government of Gujarat Water Resources Department**

[![Maverick Effect AI Challenge](https://img.shields.io/badge/Hackathon-Maverick%20Effect%20AI%20Challenge-0284c7?style=for-the-badge)](https://aquamind.ai)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Tailwind-0ea5e9?style=for-the-badge)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%20%7C%20PostgreSQL-3b82f6?style=for-the-badge)](https://fastapi.tiangolo.com)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Groq%20Llama--3.3%2070B%20%7C%20OpenAI%20GPT--4o-8b5cf6?style=for-the-badge)](https://groq.com)

---

## 🎯 Executive Summary & Vision

Traditional government water management tools suffer from a **broken operational loop**: AI models predict shortages or pipeline leaks, but reports sit unread in PDFs, WhatsApp groups, and manual meetings.

**AquaMind AI closes the loop**. It transforms predictive AI insights into audited, verified government field execution:

$$\mathbf{Predict} \longrightarrow \mathbf{Explain} \longrightarrow \mathbf{Recommend} \longrightarrow \mathbf{Digital\ Approval} \longrightarrow \mathbf{Assign\ Engineer} \longrightarrow \mathbf{Field\ Execution} \longrightarrow \mathbf{Verify} \longrightarrow \mathbf{Measure\ Impact}$$

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

## 🛠️ Complete Technology Stack

| Layer | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite** | High-performance, type-safe command center UI |
| **Styling & Design System** | **Tailwind CSS + Glassmorphic UI** | Custom 20% typography scaling, responsive grid layouts |
| **Mapping & GIS** | **Interactive SVG GIS Engine** | Zero-overlap node rendering for all 33 Gujarat districts |
| **Backend API Gateway** | **FastAPI (Python 3.11)** | High-throughput REST API with CORS & JWT middleware |
| **Relational Database** | **PostgreSQL (Supabase) / SQLite** | SQLAlchemy ORM for tasks, digital signatures, and audit logs |
| **Primary LLM Engine** | **Groq API (Llama-3.3 70B Versatile)** | Sub-second high-reasoning AI chat & multi-agent synthesis |
| **Fallback LLM Engine** | **OpenAI API (GPT-4o / GPT-4o-mini)** | Enterprise policy reasoning and executive summary backup |
| **Time-Series Predictive ML** | **XGBoost + Meta Prophet** | 30-day reservoir depletion & municipal demand spike forecasting |
| **Vector Database (RAG)** | **Qdrant Cloud** | Embeddings store for Gujarat Water Allocation Policy 2024 |

---

## 🔐 5-Layer Authentication & RBAC Matrix

To evaluate different user permissions, AquaMind AI provides 6 pre-seeded Demo Accounts on the login portal:

| Role Icon & Title | User | Primary Dashboard | Accessible Capabilities | Demo Login Email |
| :--- | :--- | :--- | :--- | :--- |
| 🏛️ **State Water Authority** | Dr. Vikram Shah | Statewide Command Center | Approve AI recommendations, sign digital approvals, view statewide heatmaps | `state@aquamind.ai` |
| 🏙️ **District Water Officer** | Amitabh Joshi | Ahmedabad District Hub | Monitor local MLD supply/demand, assign field engineers, verify completed repairs | `district@aquamind.ai` |
| 🔧 **Lead Infrastructure Engineer**| Priya Desai | Field Maintenance Workstation| View work orders, acoustic telemetry, upload field repair photo evidence & notes | `engineer@aquamind.ai` |
| 🚨 **Emergency Response Officer** | Sanjay Varma | Disaster Emergency Grid | Monitor high-risk TDS alerts, request mobile water tanker & purification dispatch | `emergency@aquamind.ai` |
| 👑 **Super Administrator** | Rajesh Patel | Root Governance Panel | Manage user accounts, tune AI model routers (Groq/OpenAI), view audit logs | `admin@aquamind.ai` |
| 📊 **Hydrology Researcher** | Prof. Ananya Mehta | GTU Innovation Lab | Read-only analytics, 10-year groundwater depth trends, export research CSVs | `research@aquamind.ai` |

*Default Demo Password for all accounts*: `Demo@123`

---

## 🤖 Multi-Agent AI Engine (4 Specialized Agents)

1. **Forecast Agent**: Uses time-series models to predict 30-day reservoir drawdown and municipal demand spikes.
2. **Infrastructure Agent**: Processes acoustic vibration telemetry (420 Hz leak signature) to score trunk pipeline health.
3. **Intelligence Agent**: Performs RAG policy compliance search over the *Gujarat Water Allocation Policy 2024*.
4. **Recommendation Agent**: Synthesizes inputs into prioritized action drafts with estimated water savings ($M$ Liters) and population impact metrics.

---

## 📊 Database Schema & Backend Data Engineering

AquaMind AI models real-world Gujarat hydrology data across 6 primary ORM tables:

- `users`: User profiles, bcrypt password hashes, assigned role IDs, and district scopes.
- `districts`: 33 Gujarat districts with population, MLD demand/supply, groundwater depth, and alert counts.
- `reservoirs`: Major dams (*Sardar Sarovar, Ukai, Dharoi, Kadana, Shetrunji, Aaji-1*) with capacity MCM and inflow/outflow Cusecs.
- `pipelines`: Acoustic health scores, pressure Bar ratings, and leak probabilities across trunk feeder lines.
- `tasks`: Closed-loop operational task lifecycle (`approved` $\rightarrow$ `assigned` $\rightarrow$ `in_progress` $\rightarrow$ `completed` $\rightarrow$ `verified`).
- `audit_logs`: Immutable security audit log storing digital signature stamps (`#DIG-SIG-STATE-2026-XXXX`), user IDs, timestamps, and IP addresses.

---

## 📂 Project Directory Structure

```
aquamind-ai/
├── frontend/                  # React 19 Frontend Web Application
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts         # Vite bundler configuration
│   ├── tailwind.config.js     # Design system tokens & typography
│   └── src/
│       ├── components/
│       │   ├── auth/          # LoginScreen.tsx (Public entrance & demo switcher)
│       │   ├── dashboard/     # GujaratMap.tsx & 6 Role dashboards
│       │   ├── ai/            # MultiAgentMissionControl.tsx & AIChatDrawer.tsx
│       │   ├── operations/    # TaskBoard.tsx & DigitalApprovalModal.tsx
│       │   └── admin/         # AdminPanel.tsx (User management & audit trail)
│       ├── App.tsx            # Auth state manager & Role router
│       └── main.tsx
├── backend/                   # FastAPI Python Enterprise Server
│   ├── main.py                # REST API gateway & Groq/OpenAI chat router
│   ├── database.py            # SQLAlchemy ORM (PostgreSQL & SQLite)
│   ├── agents.py              # Multi-agent orchestration engine
│   └── .env                   # Environment API keys (GROQ_API_KEY, DATABASE_URL)
├── package.json               # Root proxy package runner
├── documentation.md           # Technical manual & PRD
└── README.md                  # Hackathon Jury README
```

---

## ⚡ Quick Start Guide

### 1. Start Python FastAPI Backend Server
```bash
cd backend
python main.py
```
*(Runs on `http://localhost:8000` with PostgreSQL / SQLite database connection)*

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

Open `http://localhost:3000` in your browser to launch **AquaMind AI**!

---


