# Prometheus + Grafana Monitoring Setup

## Quick Start

```bash
cd d:\3_KTPM\KienTrucPhanMem\tuan05\phan3\bai4
docker-compose up -d
```

## Access Points

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)

## Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| Grafana | admin | admin123 |

## Services

### Prometheus
- **Port**: 9090
- **Volume**: `prometheus_data:/prometheus`
- **Config**: `prometheus.yml`
- **Function**: Collects and stores time-series metrics

### Grafana
- **Port**: 3000
- **Volume**: `grafana_data:/var/lib/grafana`
- **Function**: Visualizes metrics from Prometheus

## Metrics Collection

The `prometheus.yml` is configured to scrape:
1. **Prometheus** itself (localhost:9090)
2. **cAdvisor** (cadvisor:8080) - Container metrics
3. **Node Exporter** (node-exporter:9100) - Host metrics

> Note: To monitor Docker containers, you need to add cAdvisor and Node Exporter services to docker-compose.yml

## Next Steps

1. **View Prometheus Targets**: Visit http://localhost:9090/targets to check scrape status
2. **Create Grafana Dashboard**: Connect Prometheus datasource and create custom dashboards
3. **Add Alerts**: Configure alerting rules in `prometheus.yml`

## Extended Setup with cAdvisor and Node Exporter

To monitor Docker containers, add these services to docker-compose.yml:

```yaml
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring
```

Then rebuild:
```bash
docker-compose down
docker-compose up -d
```
