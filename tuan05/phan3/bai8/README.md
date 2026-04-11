# Django + Celery + Redis Task Queue

A complete asynchronous task processing setup using Django, Celery, and Redis.

## Quick Start

```bash
cd d:\3_KTPM\KienTrucPhanMem\tuan05\phan3\bai8

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Django App** | http://localhost:8000 | Web interface & task submission |
| **Redis** | localhost:6379 | Message broker & result backend |
| **Celery Worker** | - | Processes tasks in background |
| **Celery Beat** | - | Schedules periodic tasks |

## Architecture

```
┌─────────────────────────────────────┐
│      Django Web App (port 8000)     │
│   - Task submission interface       │
│   - Task monitoring & results       │
└────────────────┬────────────────────┘
                 │ sends task to
                 ▼
        ┌────────────────┐
        │     Redis      │ (port 6379)
        │  Message Broker│
        └────────┬───────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌──────────────┐    ┌──────────────┐
│ Celery Worker│    │ Celery Beat  │
│  (processes  │    │  (schedules  │
│    tasks)    │    │   periodic   │
└──────────────┘    │    tasks)    │
                    └──────────────┘
```

## Services

| Service | Role | Container |
|---------|------|-----------|
| **redis** | Message broker & result backend | redis:7-alpine |
| **django** | Web server & task submission | Python 3.11 |
| **celery_worker** | Task processor | Python 3.11 + Celery |
| **celery_beat** | Periodic task scheduler | Python 3.11 + Celery Beat |

## Volumes

- `redis_data` - Redis data persistence

## Default Configuration

- **Django**: http://localhost:8000
- **Redis URL**: redis://redis:6379/0
- **Celery Broker**: redis://redis:6379/0
- **Celery Result Backend**: redis://redis:6379/0

## Available Tasks

### 1. Long Running Task
- Duration: Configurable (seconds)
- Shows progress updates
- Example: 10-second task

### 2. Add Numbers
- Simple calculation task
- Adds two numbers
- Demonstrates basic task queuing

### 3. Send Email
- Simulates async email sending
- 2-second delay
- Shows background job processing

### 4. Process Data
- Generates and processes random data
- Returns statistics (min, max, avg, sum)
- Demonstrates data processing tasks

## Usage Examples

### Submit Task via Web UI
1. Open http://localhost:8000
2. Select task type
3. Configure parameters
4. Click "Submit Task"
5. Get task ID for monitoring

### Monitor Task Progress
```bash
# Check with curl
curl http://localhost:8000/api/task/{task_id}/
```

## File Structure

```
bai8/
├── docker-compose.yml          # Service orchestration
├── Dockerfile                  # Django + Celery image
├── requirements.txt            # Python dependencies
└── django_app/
    ├── manage.py              # Django management
    ├── tasks/                 # Task app
    │   ├── models.py         # Task result model
    │   ├── tasks.py          # Celery tasks
    │   ├── views.py          # Views
    │   ├── urls.py           # URL routing
    ├── django_project/        # Django project config
    │   ├── settings.py       # Settings
    │   ├── celery.py         # Celery config
    │   ├── urls.py           # URLs
    │   ├── wsgi.py           # WSGI
    └── templates/             # HTML templates
        ├── index.html        # Main dashboard
        └── tasks_list.html   # Task list
```

## Development

### View Logs

```bash
# All services
docker-compose logs -f

# Django
docker-compose logs -f django

# Worker
docker-compose logs -f celery_worker

# Beat scheduler
docker-compose logs -f celery_beat

# Redis
docker-compose logs -f redis
```

### Scale Workers

Process tasks faster by scaling:
```bash
docker-compose up -d --scale celery_worker=3
```

### Access Django Shell

```bash
docker-compose exec django python manage.py shell
```

### Create Django Admin

```bash
docker-compose exec django python manage.py createsuperuser
```

### Run Migrations

```bash
docker-compose exec django python manage.py migrate
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | True | Django debug mode |
| `SECRET_KEY` | test-key | Django secret key |
| `REDIS_URL` | redis://redis:6379/1 | Redis cache connection |
| `CELERY_BROKER_URL` | redis://redis:6379/0 | Celery broker |
| `CELERY_RESULT_BACKEND` | redis://redis:6379/0 | Celery result storage |

## Task States

- **PENDING** - Task submitted, waiting to be processed
- **STARTED** - Task processing started
- **PROGRESS** - Task in progress (with progress info)
- **SUCCESS** - Task completed successfully
- **FAILURE** - Task failed with error

## Monitoring

### Redis CLI

```bash
docker-compose exec redis redis-cli
# In Redis CLI:
# KEYS *              # List all keys
# GET key_name        # Get value
# LLEN queue:celery   # Check queue length
```

### Celery Events (Monitor tasks in real-time)

```bash
docker-compose exec celery_worker celery -A django_project events
```

## Troubleshooting

**Worker not processing tasks:**
```bash
docker-compose logs -f celery_worker
docker-compose restart celery_worker
```

**Redis connection issue:**
```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

**Django migrations failed:**
```bash
docker-compose exec django python manage.py migrate --run-syncdb
```

**Rebuild everything:**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Performance Tips

1. **Scale workers** - Add more worker instances for higher throughput
2. **Tune memory** - Adjust Django and Redis memory allocation
3. **Use connection pooling** - Already configured in settings
4. **Monitor queue** - Use production monitoring tools

## Production Considerations

For production deployment:
1. Set `DEBUG=False`
2. Use strong `SECRET_KEY`
3. Configure email backend properly
4. Use persistent storage for Redis
5. Deploy with Gunicorn/uWSGI
6. Add monitoring (Prometheus, Grafana)
7. Configure task timeouts
8. Implement retry logic
