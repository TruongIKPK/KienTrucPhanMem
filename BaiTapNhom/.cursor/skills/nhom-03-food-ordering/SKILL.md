---
name: nhom-03-food-ordering
description: >-
  Develops and maintains the Mini Food Ordering System for nhom_03 using the repo's
  ai-agent bundle (system prompt, context, rules, workflows, templates, memory).
  Use when working in this repository, when the user mentions nhom_03, food ordering,
  or asks for features, bugs, reviews, deploy, or architecture aligned with team docs.
---

# nhom_03 Mini Food Ordering System - AI-Agent

## What this is

The folder `ai-agent/` is the **single source of truth** for how the coding assistant should behave on this project: product context, stack, API/DB reference, coding rules, workflows, and long-term memory.

**Do not improvise** stack or conventions when `ai-agent/` already defines them—read the relevant files first.

## Startup order (always)

1. **`ai-agent/core/system.prompt.md`** — Role, product areas, stack, architecture rules, persona pointers, language (Vietnamese comments/docs, English technical terms).
2. **`ai-agent/context/`** — Before designing or changing behavior:
   - `architecture.md` — Service-Based Architecture, service boundaries
   - `api.md` — All REST endpoints
   - `api-gateway.md` — Spring Cloud Gateway configuration
   - `database.md` — H2/JPA entity modeling
   - `stack.md` — Detailed tech stack (Backend Java/Spring Boot, Frontend React)
   - `deployment.md` — LAN deployment guide
3. **`ai-agent/core/rules/`** — `coding.md`, `naming.md`, `api-design.md`, `frontend-ui.md`, `service-communication.md` as the task requires.
4. **Persona** (pick one): `ai-agent/core/persona/architect.md`, `backend.md`, `frontend.md`.
5. **Task-specific**:
   - Structured output → **`ai-agent/core/templates/`** (`service.md`, `api-endpoint.md`, `react-component.md`, `gateway-route.md`)
   - Process → **`ai-agent/workflows/`** (`feature-flow.md`, `service-flow.md`, `integration-flow.md`)
   - User-invoked command docs → **`ai-agent/commands/`** (`create-service.md`, `create-endpoint.md`, `test-integration.md`)
6. **Long-term memory** — Check and update when appropriate:
   - `ai-agent/memory/conventions.md` — Team agreements
   - `ai-agent/memory/decisions.md` — ADRs / architectural decisions
   - `ai-agent/memory/known-issues.md` — Known bugs/limitations

## Non-negotiables (from system prompt)

- **Java 17+** / **Spring Boot 3.x** for all backend services
- **ReactJS 18.x** with functional components for frontend
- **REST API** for all communication (HTTP/JSON)
- **H2 In-Memory** database for each service
- **Spring Cloud Gateway** for API routing (optional but recommended)
- Follow Java naming conventions and Spring Boot patterns
- CORS configuration required for frontend access
- Error handling with GlobalExceptionHandler

## Project layout

```
project/
├── ai-agent/           # AI-agent bundle (this skill)
├── frontend/           # ReactJS application
├── user-service/       # Spring Boot - User management
├── food-service/       # Spring Boot - Food CRUD
├── order-service/      # Spring Boot - Order management
├── payment-service/    # Spring Boot - Payment + Notification
└── api-gateway/        # Spring Cloud Gateway (optional)
```

## Services Overview

| Service | Port | Responsibilities |
|---------|------|------------------|
| Frontend | 3000 | UI, API calls via Axios |
| API Gateway | 8080 | Routing, CORS |
| User Service | 8081 | Auth, User management |
| Food Service | 8082 | Food CRUD, seed data |
| Order Service | 8083 | Orders, calls User + Food |
| Payment Service | 8084 | Payment, calls Order, Notification |

## When the user references `@ai-agent`

Treat it as: follow this skill and load the paths above for the current task—do not skip `system.prompt.md` or relevant `context/` files.

## Demo Requirements

1. User đăng ký + login
2. Xem danh sách món
3. Thêm vào giỏ → tạo order
4. Thanh toán (COD/Banking)
5. Nhận thông báo

## Additional resources

- Folder map and quick stack table: [ai-agent/README.md](../../../ai-agent/README.md)
