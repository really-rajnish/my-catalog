# Nexus Intelligent Product Catalog Platform

Nexus is a production-grade, API-driven intelligent product discovery and catalog platform. The project utilizes a microservices architecture to segregate Core Gateway Business logic (Spring Boot) from AI Semantic Retrieval and Vector Space computations (FastAPI).

---

## Technical Stack & Architecture

```
                               ┌────────────────────────┐
                               │ React + Vite Client    │
                               │   (Port 5173 / SPA)    │
                               └───────────┬────────────┘
                                           │
                                  REST APIs (JWT Auth)
                                           │
                               ┌───────────▼────────────┐
                               │  Spring Boot Core API  │
                               │      (Port 8085)       │
                               └─────┬────────────┬─────┘
                                     │            │
                                  SQL Sync    HTTP Client
                                     │            │
                         ┌───────────▼────┐   ┌───▼────────────────┐
                         │   PostgreSQL   │   │  FastAPI AI Agent  │
                         │  (H2 Fallback) │   │     (Port 8000)    │
                         └────────────────┘   └───────────┬────────┘
                                                          │
                                                     Vector Search
                                                          │
                                              ┌───────────▼────────┐
                                              │   MongoDB Atlas    │
                                              │  (JSON DB Fallback)│
                                              └────────────────────┘
```

1. **Frontend (React + Vite)**: Single Page App (JavaScript) with Tailwind CSS v4 styling, Framer Motion transitions, Zustand global stores, React Router DOM for routing, and TanStack query client caching.
2. **Gateway Backend (Spring Boot 3)**: Manages authentication (Spring Security, BCrypt, and stateless JWT tokens), core transactional SQL datasets, average reviews computation, wishlist tracking, and routes semantic search queries to the AI microservice.
3. **AI Backend (FastAPI)**: Translates text strings into 384-dimensional dense vectors using the `all-MiniLM-L6-v2` HuggingFace SentenceTransformer, storing vectors in MongoDB and evaluating cosine similarity lists.

---

## Database Schemas & Data Synchronization

- **PostgreSQL**: Stores relational transactional entities (`users`, `categories`, `products`, `pricing`, `inventory`, `wishlist`, `reviews`).
- **MongoDB**: Stores unstructured detailed specifications (`product_descriptions`), dense floating point search vectors (`product_embeddings`), and query audit metadata (`user_search_logs`).

### Robust Local Fallback Architecture
To ensure the catalog runs immediately out-of-the-box on local dev machines without needing local servers or cloud installations:
- **SQL Fallback**: If connection to the designated PostgreSQL instance times out on startup, the Spring Boot application automatically instantiates a local SQLite file database (`backend/sqlite.db`) to enable catalogs, checkouts, and reviews.
- **MongoDB Fallback**: If connection to MongoDB Atlas fails, the FastAPI service spins up a thread-safe local JSON database file (`mongo_mock.json`) and runs mathematical cosine similarity computations on NumPy, retaining full semantic query matches.
- **Neural Model Fallback**: If loading model weights fails or torch/transformers imports are blocked, the FastAPI service maps tokens to deterministic unit-length hashed vectors (size 384), retaining word-overlap cosine matching functionality.

---

## Getting Started: Local Running Instructions

Follow these steps to run the microservices locally.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Java JDK 17 (needed to compile Java; if no compiler is available, the pre-built fallback SQLite and FastAPI seed will populate databases)

### Step 1: Seed the Databases
Run the database seed script to populate products, categories, reviews, user profiles, and precompute vector embeddings:
```bash
# Install seeder dependencies
pip install psycopg2-binary pymongo numpy

# Run seeder
python seed_db.py
```
*This will seed PostgreSQL and MongoDB if online, otherwise it creates `backend/sqlite.db` and `mongo_mock.json` fallbacks.*

### Step 2: Start the Python AI Microservice
Since Windows Python 3.14 lacks pre-compiled wheels for heavy ML libraries, we use a standalone mock server that performs vector math using the Python standard library.
```bash
cd ai_service
python standalone_server.py
```
*The mock AI server runs on `http://127.0.0.1:8000`.*

### Step 3: Start the Spring Boot Core Service
Verify configuration settings inside `backend/src/main/resources/application.properties`, then start:
```bash
cd backend
./mvnw spring-boot:run
```
*Spring Boot runs on `http://localhost:8085`.*

### Step 4: Run the React + Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*React + Vite SPA runs on `http://localhost:5173`.*

---

## Running with Docker Compose
If you have Docker installed, you can spin up the entire cluster (PostgreSQL, MongoDB, FastAPI, Spring Boot) in one command:
```bash
docker-compose up --build
```

---

## Core API Endpoints

### Spring Boot APIs
- `POST /api/auth/register` - Create user profile
- `POST /api/auth/login` - Obtain JWT Token
- `GET /api/products` - SQL product list with filters
- `GET /api/products/{id}` - Details merging SQL prices with MongoDB specifications
- `POST /api/search` - Triggers AI search vector evaluation
- `GET /api/recommendations/related/{productId}` - Semantic related products matching
- `POST /api/recommendations/chat` - Interactive chatbot recommendation sandbox

### FastAPI AI APIs (Internal)
- `POST /semantic-search` - Performs cosine similarity comparison
- `POST /generate-embeddings` - Generates vector representation of text block
- `POST /recommendations` - Computes top similar vectors
