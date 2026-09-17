# Tutee: AI-Powered Tutor Recommendation System

Tutee is a comprehensive tutor recommendation platform that integrates a deterministic rule-based engine with a Generative AI (RAG) pipeline. The system is designed to provide highly accurate, explainable, and auditable tutor matches for students based on their specific requirements.

## Key Features

- **Hybrid Recommendation Engine:** Combines a rule-based scoring system (evaluating subject match, budget, availability, and ratings) with semantic search to ensure high precision in tutor matching.
- **Explainable AI (XAI) & Batching:** Rather than providing opaque recommendations, the system generates transparent, data-grounded explanations detailing exactly why a specific tutor is a good fit. To optimize API quotas and latency, the system utilizes prompt batching to evaluate multiple tutors in a single LLM request.
- **AI Vector Synchronization:** An automated syncing mechanism where Admin updates to tutor profiles are embedded via SentenceTransformers (`paraphrase-multilingual-MiniLM-L12-v2`) and directly synced to PostgreSQL `pgvector` for instant semantic search capability.
- **API Gateway Architecture:** Utilizes a Node.js API Gateway to handle routing, JWT-based authentication, error management, and non-AI business logic, ensuring the backend AI service (FastAPI) remains isolated and performant.
- **Role-based Admin Dashboard:** A comprehensive React frontend for Admins to manage Tutors, trigger AI syncing, and oversee the platform.
- **Built-in Evaluation Framework:** Includes custom evaluation scripts to continuously monitor system performance, including Top-K accuracy, latency, and LLM-as-a-judge groundedness metrics.

## System Architecture

The project is structured into distinct microservices to maintain separation of concerns:

1. **Frontend (React/Vite):** Client-facing user interface including Auth, Landing Page, Tutor Search (Rule-based), AI Chat (RAG), and a comprehensive Admin Management Dashboard.
2. **API Gateway (Node.js/Express):** Implements the Route-Controller-Service (R-C-S) pattern for request handling, JWT validation, and routing.
3. **AI Service (Python/FastAPI):** Contains the core recommendation logic, SentenceTransformers embeddings, the RAG pipeline powered by Gemini, and LLM Batch Explanation services.
4. **Database (PostgreSQL + pgvector):** Persistent relational storage for Users, Tutors, and high-dimensional Vector Embeddings for semantic search capabilities. (Running on port `5435`).

## Performance Metrics

The recommendation engine has been rigorously evaluated against a comprehensive dataset covering clear matches, ambiguous queries, and edge cases. Current benchmarks indicate:

- **Rule-based Top-3 Accuracy:** 100%
- **Rule-based Top-1 Accuracy:** 94.7%
- **P95 Latency:** < 0.1 ms (Optimized rule-based execution)
- **RAG Groundedness:** Validated via an LLM-as-a-judge framework to ensure all generated explanations are strictly grounded in retrieved context.
- **API Optimization:** 3x quota efficiency achieved via Explainer Prompt Batching.

## Project Structure

```text
Tutee/
├── frontend/                # React Vite Application
│   ├── src/                 # Pages, Components, API Clients, Contexts
│   └── tailwind.config.js   # Custom brand design system
├── ai-service/              # Core AI and recommendation engine
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # PostgreSQL schema and pgvector init
│   ├── models.py            # Pydantic data models
│   ├── scorer.py            # Deterministic scoring algorithm
│   ├── rag.py               # RAG pipeline implementation
│   ├── explainer.py         # Explainable AI logic & Batching
│   ├── vector_search.py     # pgvector Cosine Similarity integration
│   ├── evaluator.py         # Rule-based evaluation framework
│   └── routers/             # API Endpoints (ask, recommend, admin)
├── backend/                 # Node.js API Gateway
│   ├── index.js             # Express application entry point
│   └── src/
│       ├── routes/          # API route definitions
│       ├── controllers/     # Request handlers
│       ├── models/          # Database Queries (userModel, tutorModel)
│       └── middlewares/     # JWT Auth and Role Checking
├── docker-compose.yml       # Multi-container orchestration (Postgres/Pgvector)
└── Tutee_Workflow_Antigravity.md  # Development workflow and documentation
```

## Setup and Installation

### 1. Database Setup (Docker)

The application requires PostgreSQL with the `pgvector` extension.
```bash
docker compose up -d
```
*Note: The database is mapped to host port `5435` to avoid conflicts.*

### 2. AI Service (FastAPI)

```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a `.env` file in the `ai-service` directory:
```env
GEMINI_API_KEY=your_api_key_here
```

Run the AI server:
```bash
uvicorn main:app --reload
```
*API documentation is available at http://127.0.0.1:8000/docs*

### 3. API Gateway (Node.js)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your_super_secret_key
```

Run the Backend server:
```bash
node index.js
```
*The gateway is available at http://localhost:5000*

### 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
*The web application is available at http://localhost:5173*

## Future Development

- Configure cloud deployment pipelines (e.g., AWS ECS, Vercel, and Cloud SQL).
- Setup automated CI/CD for unit testing and AI evaluation.
- Implement Student Profiles and booking histories.
