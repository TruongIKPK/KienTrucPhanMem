# Multi-Tier Voting Application

A complete microservices voting application demonstrating Docker Compose with multiple services.

## Architecture

```
┌─────────────────────────────────┐
│      Vote Frontend (Python)     │ Port 5000
│      Flask Web App              │
└────────────────────┬────────────┘
                     │ (stores vote)
                     ▼
            ┌────────────────┐
            │     Redis      │ Port 6379
            │  (vote queue)  │
            └────────┬───────┘
                     │ (worker processes)
                     ▼
┌────────────────────────────────────┐
│ Worker (Java)                      │
│ - Reads from Redis                 │
│ - Writes to PostgreSQL             │
└────────────────────┬───────────────┘
                     │
                     ▼
┌──────────────────────────────────────┐
│  PostgreSQL Database                 │ Port 5432
│  (stores voting results)             │
└──────────────────────┬───────────────┘
                       │ (reads results)
                       ▼
         ┌──────────────────────────┐
         │ Result Backend (Node.js) │ Port 5001
         │ REST API & Dashboard     │
         └──────────────────────────┘
```

## Services

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **vote** | Python (Flask) | 5000 | Frontend voting interface |
| **result** | Node.js (Express) | 5001 | Results backend & dashboard |
| **redis** | Redis Alpine | 6379 | Temporary vote queue |
| **worker** | Java | - | Vote processor (votes → DB) |
| **postgres** | PostgreSQL 13 | 5432 | Results database |

## Quick Start

```bash
cd d:\3_KTPM\KienTrucPhanMem\tuan05\phan3\bai5

# Build and start all services
docker-compose up -d

# Check status
docker-compose ps
```

## Access Points

- **Voting Frontend**: http://localhost:5000 - Cast your votes
- **Results Dashboard**: http://localhost:5001 - View live results

## Default Access

| Service | Host | Port |
|---------|------|------|
| PostgreSQL | localhost | 5432 |
| Redis | localhost | 6379 |

Database credentials:
- User: `postgres`
- Password: `postgres123`
- Database: `voting_db`

## Workflow

1. **User votes** at http://localhost:5000
2. **Vote stored** in Redis queue
3. **Worker** processes votes from Redis queue every 1 second
4. **Vote count updated** in PostgreSQL database
5. **Results displayed** at http://localhost:5001 (auto-refreshes every 2s)

## Volumes

- `postgres_data` - PostgreSQL database persistence
- `redis_data` - Redis data persistence

## Development

### Scale Worker Service

To handle more votes faster, scale the worker:

```bash
docker-compose up -d --scale worker=3
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f worker
docker-compose logs -f vote
```

### Stop Services

```bash
docker-compose down
```

### Reset Data

```bash
docker-compose down -v  # Remove volumes to reset data
docker-compose up -d
```

## Database

Connected to PostgreSQL with auto-initialized schema:

```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  vote VARCHAR(255) NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
  option VARCHAR(255) PRIMARY KEY,
  count INTEGER DEFAULT 0
);
```

Initial options: `java`, `python`, `node.js`

## Networking

All services connected via custom bridge network `voting_network` for internal communication.

Service discovery names:
- `redis` → Redis
- `postgres` → PostgreSQL
- `vote` → Frontend
- `result` → Backend
- `worker` → Worker

## Troubleshooting

**Worker not processing votes:**
```bash
docker-compose logs -f worker
```

**Can't connect to database:**
```bash
docker-compose logs -f postgres
```

**Redis connection issues:**
```bash
docker-compose logs -f redis
```

**Rebuild everything:**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
