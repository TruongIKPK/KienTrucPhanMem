# Nextcloud with MariaDB + Redis Caching Setup

## Quick Start

```bash
cd d:\3_KTPM\KienTrucPhanMem\tuan05\phan3\bai9

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

## Access Points

| Service | URL/Port | Purpose |
|---------|----------|---------|
| **Nextcloud** | http://localhost:80 | Web UI & file sharing |
| **MariaDB** | localhost:3306 | Database |
| **Redis** | localhost:6379 | Cache |

## Default Credentials

### Nextcloud Admin
```
Username: admin
Password: admin123456
```

### MariaDB
```
Root Password: rootpassword123
Database: nextcloud_db
User: nextcloud_user
Password: nextcloud_password123
```

## Services

### Nextcloud
- **Port**: 80
- **Image**: nextcloud:latest
- **Volumes**:
  - `nextcloud_data:/var/www/html` - App & user files
  - `nextcloud_config:/var/www/html/config` - Configuration

### MariaDB
- **Port**: 3306
- **Image**: mariadb:10.6-alpine
- **Volume**: `mariadb_data:/var/lib/mysql`
- **Database**: nextcloud_db with READ-COMMITTED isolation
- **Health check**: Monitors database availability

### Redis
- **Port**: 6379
- **Image**: redis:7-alpine
- **Volume**: `redis_data:/data`
- **Purpose**: Caching for performance improvement

## Network

All services connected via `nextcloud_network` bridge:
- Nextcloud → MariaDB: `mariadb:3306`
- Nextcloud → Redis: `redis:6379`

## Volumes

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `mariadb_data` | /var/lib/mysql | Database persistence |
| `redis_data` | /data | Cache persistence |
| `nextcloud_data` | /var/www/html | Nextcloud application & files |
| `nextcloud_config` | /var/www/html/config | Nextcloud configuration |

## First Time Setup

1. Start services:
```bash
docker-compose up -d
```

2. Wait 30-40 seconds for services to fully initialize

3. Access Nextcloud: http://localhost
   - Admin username: `admin`
   - Admin password: `admin123456`

4. (Optional) Configure Redis caching in Nextcloud UI:
   - Settings → Admin → Configuration
   - Enable Redis caching

## Development

### View Logs

```bash
# All services
docker-compose logs -f

# Nextcloud only
docker-compose logs -f nextcloud

# MariaDB only
docker-compose logs -f mariadb

# Redis only
docker-compose logs -f redis
```

### Access Nextcloud Container

```bash
docker-compose exec nextcloud bash
```

### Execute MySQL Commands

```bash
docker-compose exec mariadb mysql -u nextcloud_user -pnextcloud_password123 nextcloud_db
```

### Redis CLI

```bash
docker-compose exec redis redis-cli
# In Redis:
# KEYS *           # List all keys
# INFO stats       # Check stats
# FLUSHALL         # Clear cache
```

## Performance Tuning

### Enable Redis in Nextcloud Config

1. SSH into Nextcloud container
2. Edit `/var/www/html/config/config.php`
3. Add or uncomment:

```php
'memcache.local' => '\OC\Memcache\APCu',
'memcache.locking' => '\OC\Memcache\Redis',
'redis' => array(
    'host' => 'redis',
    'port' => 6379,
),
```

### Increase File Upload Size

Edit `docker-compose.yml` and add to Nextcloud environment:
```yaml
NEXTCLOUD_UPLOAD_MAX_FILESIZE: 512M
NEXTCLOUD_MAX_FILE_SIZE: 512M
```

### Adjust PHP Memory

Add to Nextcloud environment:
```yaml
PHP_MEMORY_LIMIT: 512M
```

## Backup & Restore

### Backup Database

```bash
docker-compose exec mariadb mysqldump -u nextcloud_user -pnextcloud_password123 nextcloud_db > backup.sql
```

### Backup Nextcloud Files

```bash
docker-compose exec nextcloud tar -czf /tmp/nextcloud-backup.tar.gz /var/www/html
docker cp nextcloud_app:/tmp/nextcloud-backup.tar.gz ./nextcloud-backup.tar.gz
```

### Restore Database

```bash
docker-compose exec -T mariadb mysql -u nextcloud_user -pnextcloud_password123 nextcloud_db < backup.sql
```

## Troubleshooting

**Can't access Nextcloud:**
- Wait 40 seconds for full initialization
- Check logs: `docker-compose logs nextcloud`

**Database connection error:**
```bash
docker-compose logs mariadb
docker-compose restart mariadb
```

**Redis not caching:**
- Verify Redis is running: `docker-compose exec redis redis-cli ping`
- Configure Redis in Nextcloud admin settings

**Port 80 already in use:**
- Change in docker-compose.yml:
```yaml
ports:
  - "8080:80"  # Access via http://localhost:8080
```

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
```

## Security Recommendations

For production:

1. **Change default passwords** in docker-compose.yml
2. **Use HTTPS** - Configure nginx reverse proxy with SSL
3. **Set strong admin password**
4. **Enable 2FA** in Nextcloud settings
5. **Configure SMTP** for email notifications
6. **Set trusted domains** properly in config.php
7. **Regular backups** using backup commands above
8. **Update regularly** to latest images

## Architecture

```
┌──────────────────┐
│  User Browser    │
│  http://localhost│
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│   Nextcloud (port 80)    │
│  - File sharing          │
│  - Collaboration         │
│  - Admin panel           │
└──┬──────────────────┬───┘
   │                  │
   ▼                  ▼
┌──────────────┐  ┌──────────────┐
│  MariaDB     │  │   Redis      │
│  (port 3306) │  │  (port 6379) │
│  Database    │  │  Cache       │
└──────────────┘  └──────────────┘
   ▲                  ▲
   │                  │
   └──────────────────┘
      Persistent Volumes
```

## Advanced: Docker Compose Override

Create `docker-compose.override.yml` for local development:

```yaml
version: '3.8'

services:
  nextcloud:
    environment:
      DEBUG: 1
      NEXTCLOUD_LOGLEVEL: debug
    volumes:
      - ./config/php.ini:/usr/local/etc/php/conf.d/nextcloud.ini
```

## References

- [Nextcloud Documentation](https://docs.nextcloud.com/)
- [MariaDB Documentation](https://mariadb.com/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
