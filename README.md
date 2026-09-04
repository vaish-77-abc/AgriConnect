# 🌾 AgriConnect - Agricultural Employment Platform

> **Connecting Indian Farmers with Skilled Agricultural Workers**  
> Direct, fair, zero-commission hiring platform with GPS radius matching and multilingual support (English, हिंदी, मराठी).

---

## 🌟 Key Features

- **👨‍🌾 Farmer Dashboard**: Post seasonal farm jobs (Harvesting, Sowing, Irrigation, Tractor operation, etc.), view applicant profiles, accept/reject workers, direct chat, and leave post-completion ratings.
- **👷 Worker Marketplace**: Discover nearby farm jobs with GPS radius filtering, transparent daily wages, 1-click applications, and reputation building.
- **🌐 Multilingual by Design**: Complete end-to-end interface translated into **English 🇬🇧**, **Hindi (हिंदी) 🇮🇳**, and **Marathi (मराठी) 🇮🇳**.
- **📍 Real GPS Distance Calculation**: Backend calculates distance in kilometers using the Haversine formula for local village matching.
- **💬 Direct Communication**: Built-in chat and contact tools for farmers and workers.
- **⭐ Community Trust & Reviews**: 2-way 5-star rating system with verified feedback after job completion.

---

## 🏗️ Architecture & Tech Stack

```text
AgriConnect/
│
├── frontend/                     # React 19 + Tailwind CSS + Vite
│   ├── src/
│   │   ├── components/           # Navbar, Footer, JobCard, LanguageSelector, Modals
│   │   ├── context/              # AuthContext, NotificationContext
│   │   ├── i18n/                 # i18next configs & English, Hindi, Marathi dictionaries
│   │   ├── pages/
│   │   │   ├── public/           # Landing, How It Works, About, Contact, Login, Register
│   │   │   ├── farmer/           # FarmerDashboard, PostJob, MyJobs, JobApplications, Profile
│   │   │   └── worker/           # WorkerDashboard, FindJobs, MyApplications, Profile
│   │   └── services/             # Axios API client
│
├── backend/                      # FastAPI (Python 3.10+)
│   ├── app/
│   │   ├── core/                 # JWT authentication, security & configs
│   │   ├── database/             # SQLAlchemy engine & session setup
│   │   ├── middleware/           # Role-based route guards (require_farmer, require_worker)
│   │   ├── models/               # Database entities (User, Job, Application, Review, etc.)
│   │   ├── routes/               # Modular REST endpoints
│   │   ├── schemas/              # Pydantic validation models
│   │   └── services/             # Geolocation distance & Notification triggers
│   ├── main.py                   # ASGI entry point
│   └── seed.py                   # Database seeder with sample farm data
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # On Windows PowerShell
# source venv/bin/activate  # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed sample farm jobs and demo accounts
python seed.py

# Start FastAPI server
uvicorn main:app --reload
```
API server runs on **http://127.0.0.1:8000** (Interactive docs at `/docs`).

---

### 2. Frontend Setup

```bash
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **👨‍🌾 Demo Farmer** | `farmer.ramesh@agriconnect.com` | `farmer123` |
| **👷 Demo Worker** | `worker.santosh@agriconnect.com` | `worker123` |

*(Or click **"Quick Demo Auto-Fill"** on the Login screen).*

---

## 📜 License
MIT License. Built for empowerment of Indian farmers and rural workers.
