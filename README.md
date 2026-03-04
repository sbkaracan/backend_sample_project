# RecipeHub — Backend Learning Project

A recipe management platform built to learn the fundamentals of backend development. Users can register, log in, and manage their personal recipe collection through a REST API.

The stack is **FastAPI + PostgreSQL + Docker**, with a minimal React frontend to interact with the API visually.

---

## What this project covers

- Building a REST API with **FastAPI**
- Connecting to a **PostgreSQL** database with **SQLAlchemy** ORM
- **JWT authentication** (register, login, protected routes)
- **Password hashing** with bcrypt
- **Data validation** with Pydantic schemas
- Organizing a Python project into a proper package structure
- Containerizing everything with **Docker & docker-compose**

---

## Project Structure

```
backend_sample_project/
├── backend/
│   ├── app/
│   │   ├── main.py          # App entry point — creates FastAPI app, registers routers
│   │   ├── database.py      # SQLAlchemy engine and session setup
│   │   ├── models.py        # Database table definitions (ORM models)
│   │   ├── schemas.py       # Pydantic schemas for request/response validation
│   │   ├── auth.py          # JWT logic, password hashing, get_current_user dependency
│   │   └── routers/
│   │       ├── auth.py      # Endpoints: /register, /token, /users/me
│   │       └── recipes.py   # Endpoints: /recipes (CRUD)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # Simple React app (bonus)
├── docker-compose.yml       # Orchestrates db, api, and frontend
└── .env                     # Environment variables (credentials, secrets) — not committed
```

---

## Backend Files Explained

### `app/main.py`
The entry point of the application. Creates the `FastAPI` instance, registers CORS middleware, and plugs in the two routers. No business logic lives here — it only wires things together.

### `app/database.py`
Configures the SQLAlchemy connection to PostgreSQL. Defines the `Base` class that all ORM models inherit from, and provides the `get_db()` function — a FastAPI dependency that opens a database session per request and closes it when done.

### `app/models.py`
Defines the actual database tables as Python classes using SQLAlchemy's ORM.

| Model | Table | Key Fields |
|-------|-------|------------|
| `UserModel` | `users` | id, email, username, hashed_password, created_at |
| `RecipeModel` | `recipes` | id, title, ingredients (array), instructions, prep_time_minutes, rating, owner_id |

The two models are linked: a user *owns* many recipes (`owner_id` is a foreign key).

### `app/schemas.py`
Pydantic models that validate data coming **in** from requests and shape data going **out** in responses. Keeps the API contract strict — if a field is missing or the wrong type, FastAPI automatically returns a 422 error before any code runs.

Key schemas: `UserCreate`, `User`, `RecipeCreate`, `Recipe`, `Token`.

### `app/auth.py`
All authentication logic in one place:

- `get_password_hash()` — hashes a plain password with bcrypt before storing it
- `verify_password()` — checks a plain password against a stored hash
- `create_access_token()` — creates a signed JWT token with an expiry
- `get_current_user()` — a FastAPI **dependency** that reads the `Authorization: Bearer` header, decodes the JWT, and returns the logged-in user. Any route that needs authentication just declares `Depends(get_current_user)`.

### `app/routers/auth.py`
Three auth-related endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/register` | Create a new user account |
| `POST` | `/token` | Log in — returns a JWT access token |
| `GET` | `/users/me` | Get the currently logged-in user's info |

### `app/routers/recipes.py`
Recipe CRUD endpoints. All are protected — a valid JWT is required.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/recipes` | Create a new recipe |
| `GET` | `/recipes` | List all your recipes |
| `GET` | `/recipes/{id}` | Get a single recipe |
| `DELETE` | `/recipes/{id}` | Delete a recipe |

---

## Authentication Flow

```
1. POST /register      →  account created, password hashed and stored
2. POST /token         →  credentials verified, JWT token returned
3. GET  /recipes       →  token sent in header, server validates it, data returned
```

The JWT token is signed with a secret key. When it arrives with a request, FastAPI decodes it, extracts the username, fetches that user from the database, and passes the user object into the route function. If the token is missing, expired, or tampered with, the server returns `401 Unauthorized`.

---

## Setup & Running

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose

That's it. No Python or Node.js installation needed locally.

### 1. Clone the repo

```bash
git clone <repo-url>
```

### 2. Configure environment

Create a `.env` file at the project root:

```env
POSTGRES_USER=[POSTGRES_USER]
POSTGRES_PASSWORD=[POSTGRES_PASSWORD]
POSTGRES_DB=[POSTGRES_DB]
DATABASE_URL=postgresql://postgres:[POSTGRES_PASSWORD]@localhost:5432/[POSTGRES_DB]
SECRET_KEY=[SECRET_KEY]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a strong `SECRET_KEY` with:
```bash
openssl rand -hex 32
```

### 3. Start everything

For the first time (or after any code change), build the images and start:

```bash
docker-compose up --build
```

If the images are already built and you haven't changed any code, skip the build step:

```bash
docker-compose up
```

> **Rule of thumb:** use `--build` when you change code, skip it when you just want to start the already-built containers.

This starts three containers:
- `db` — PostgreSQL 15
- `api` — FastAPI on port 8000
- `frontend` — React app on port 3000

| Service | URL |
|---------|-----|
| API | http://localhost:8000 |
| Interactive API docs | http://localhost:8000/docs |
| Frontend | http://localhost:3000 |

### 4. Stop

```bash
docker-compose down
```

To also delete the database volume (wipes all data):

```bash
docker-compose down -v
```

---

## Exploring the API

FastAPI generates interactive documentation automatically. Open **http://localhost:8000/docs** in your browser to see all endpoints, their expected inputs, and try them out directly.

You can also use curl

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Framework | FastAPI |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic v2 |
| Authentication | JWT (python-jose) + bcrypt (passlib) |
| Server | Uvicorn |
| Containerization | Docker + docker-compose |
| Frontend | React + Vite + nginx |
