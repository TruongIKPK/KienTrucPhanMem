# Elasticsearch + Kibana (ELK Stack) Setup

## Quick Start

```bash
cd d:\3_KTPM\KienTrucPhanMem\tuan05\phan3\bai7

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Elasticsearch** | http://localhost:9200 | Search & analytics engine |
| **Kibana** | http://localhost:5601 | Visualization & management UI |

## Default Credentials

```
Username: elastic
Password: elastic123
```

## Services

### Elasticsearch
- **Port**: 9200 (HTTP API), 9300 (node communication)
- **Version**: 8.10.0
- **Volume**: `elasticsearch_data:/usr/share/elasticsearch/data`
- **Security**: Enabled with authentication
- **Memory**: 512MB (adjustable via `ES_JAVA_OPTS`)

### Kibana
- **Port**: 5601
- **Version**: 8.10.0
- **Function**: Visualize logs, create dashboards, manage indices

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `ELASTIC_PASSWORD` | elastic123 | Elasticsearch admin password |
| `ELASTICSEARCH_USERNAME` | elastic | Kibana authentication user |
| `ELASTICSEARCH_PASSWORD` | elastic123 | Kibana authentication password |
| `discovery.type` | single-node | Single-node cluster mode |
| `xpack.security.enabled` | true | Enable X-Pack security |

## Common Operations

### Check Elasticsearch Health
```bash
curl -u elastic:elastic123 http://localhost:9200/_cluster/health
```

### List Indices
```bash
curl -u elastic:elastic123 http://localhost:9200/_cat/indices
```

### Create Test Index
```bash
curl -X POST -u elastic:elastic123 -H "Content-Type: application/json" \
  http://localhost:9200/test/_doc \
  -d '{"message":"Hello from Elasticsearch"}'
```

### View in Kibana
1. Open http://localhost:5601
2. Go to **Analytics > Discover**
3. Create data view for the index

## Networking

Services connected via `elk_network` bridge for inter-service communication.
- Elasticsearch accessible as `elasticsearch:9200` from Kibana

## Volumes

- `elasticsearch_data` - Persists Elasticsearch indices and data

## Development

### Change Credentials

Edit `docker-compose.yml` and update:
- `ELASTIC_PASSWORD`
- `ELASTICSEARCH_PASSWORD`

Then rebuild:
```bash
docker-compose down -v
docker-compose up -d
```

### Increase Memory (for indexing large datasets)

Update `ES_JAVA_OPTS` in docker-compose.yml:
```yaml
- "ES_JAVA_OPTS=-Xms1g -Xmx1g"  # 1GB RAM
```

### View Logs

```bash
# All services
docker-compose logs -f

# Elasticsearch only
docker-compose logs -f elasticsearch

# Kibana only
docker-compose logs -f kibana
```

### Stop Services
```bash
docker-compose down
```

### Reset Data
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d
```

## Troubleshooting

**Can't connect to Kibana:**
- Wait 30-40 seconds for Elasticsearch to be fully ready
- Check logs: `docker-compose logs elasticsearch`

**Elasticsearch won't start:**
```bash
docker-compose logs elasticsearch
# If memory issue, increase `ES_JAVA_OPTS` or Docker Desktop memory allocation
```

**Authentication failed:**
- Verify credentials match in both services
- Default: elastic / elastic123

**Port already in use:**
```bash
# Change ports in docker-compose.yml
ports:
  - "9201:9200"  # New port
  - "5602:5601"
```

## Next Steps

1. **Index data** - Use REST API or log shippers (Filebeat, Logstash)
2. **Create dashboards** - In Kibana UI
3. **Set up alerting** - Configure alerts in Kibana
4. **Add more data** - Ingest logs or metrics

## Architecture

```
┌──────────────────────────────────────┐
│         Kibana (port 5601)           │
│    Visualization & Management UI     │
└────────────────┬─────────────────────┘
                 │ connects to
                 ▼
┌──────────────────────────────────────┐
│    Elasticsearch (port 9200)         │
│  Search, Index & Analytics Engine    │
│  (port 9300: node communication)     │
└──────────────────────────────────────┘
         ▲
         │
    ┌────┴─────────────────────┐
    │  Persistent Storage       │
    │  elasticsearch_data vol   │
    └──────────────────────────┘
```
