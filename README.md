# Resume Builder

A production-ready, fully Dockerized Resume Builder web application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Backend | Java 21 + Spring Boot 3.2 |
| Database | PostgreSQL 15 |
| Containerization | Docker + Docker Compose |
| PDF Export | OpenPDF (backend) |
| API Docs | Swagger / SpringDoc OpenAPI |

## Quick Start

```bash
# 1. Clone / enter the directory
cd "Resume Builder"

# 2. Copy environment config
cp .env.example .env

# 3. Build and start all services
docker-compose up --build
```

The app will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs (JSON)**: http://localhost:8080/api-docs

## Features

### Resume Builder UI
- Create, edit, and delete resumes
- 6 professionally designed templates (Modern, Minimal, Corporate, Two-Column, Creative, Tech)
- Sections: Personal Info, Summary, Experience, Education, Skills, Projects
- Drag-and-drop section reordering
- Live preview (updates as you type)
- Instant template switching
- PDF export

### Backend API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | List all resumes |
| POST | `/api/resumes` | Create a resume |
| GET | `/api/resumes/{id}` | Get a resume |
| PUT | `/api/resumes/{id}` | Update a resume |
| DELETE | `/api/resumes/{id}` | Delete a resume |
| GET | `/api/resumes/{id}/export/pdf` | Export resume as PDF |
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/{id}` | Get a template |

## Project Structure

```
Resume Builder/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/resumebuilder/
│   │   ├── config/             # CORS, OpenAPI config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Global exception handler
│   │   ├── repository/         # Spring Data JPA repos
│   │   └── service/            # Business logic + PDF export
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── schema.sql          # DB schema
│   │   └── data.sql            # Template seed data
│   └── Dockerfile
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor/         # Form components per section
│   │   │   ├── Preview/        # Live preview + 6 templates
│   │   │   └── TemplateSelector/
│   │   ├── context/            # ResumeContext (state management)
│   │   ├── hooks/              # useResume hook
│   │   ├── pages/              # HomePage, BuilderPage
│   │   └── services/           # Axios API client
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Dev overrides (hot reload)
└── .env.example
```

## Development Mode (Hot Reload)

```bash
# Copy env
cp .env.example .env

# Start dev stack
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Frontend dev server: http://localhost:5173 (Vite HMR)
- Backend debug port: 5005 (attach remote debugger)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `postgres` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `resumebuilder` | Database name |
| `DB_USER` | `resumeuser` | Database user |
| `DB_PASSWORD` | `resumepass` | Database password |
| `SPRING_PROFILES_ACTIVE` | `prod` | Spring profile |
| `API_BASE_URL` | `http://localhost:8080` | Backend URL for frontend |

## Architecture Notes

- **Database schema**: Auto-created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`)
- **Template data**: Seeded via `data.sql` on startup
- **Resume content**: Stored as JSON text in the `sections_data` column
- **CORS**: Configured globally in `CorsConfig.java`
- **PDF**: Generated server-side using OpenPDF (iText fork)
- **Nginx**: Acts as reverse proxy — `/api/*` proxied to backend, everything else serves the SPA

## Health Checks

All services include Docker health checks:
- PostgreSQL: `pg_isready`
- Backend: `GET /actuator/health`
- Frontend: `GET /health`

Service startup order: postgres → backend → frontend (enforced via `depends_on` with condition `service_healthy`).
