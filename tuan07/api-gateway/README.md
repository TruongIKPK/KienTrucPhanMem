# api-gateway (:8080)

Spring Cloud Gateway — single entry cho frontend.

## Routes

| Public path           | Forward tới                               |
| --------------------- | ----------------------------------------- |
| `/api/users/**`       | `user-service:8081/**` (StripPrefix=2)    |
| `/api/movies/**`      | `movie-service:8082/**` (StripPrefix=2)   |
| `/api/bookings/**`    | `booking-service:8083/**` (StripPrefix=2) |

`StripPrefix=2` xoá `/api/<service>` trước khi forward → service nhận `/register`,
`/movies`, `/bookings/{id}`.

Gateway **KHÔNG** validate JWT — mỗi service downstream tự decode (xem
[ai-agent/memory/decisions.md](../ai-agent/memory/decisions.md) ADR-004).

## Env

| Biến                 | Default                  | Mô tả                |
| -------------------- | ------------------------ | -------------------- |
| `USER_SERVICE_URL`   | `http://localhost:8081`  |                      |
| `MOVIE_SERVICE_URL`  | `http://localhost:8082`  |                      |
| `BOOKING_SERVICE_URL`| `http://localhost:8083`  |                      |

## Run local

```bash
./mvnw spring-boot:run
```

## Build & run docker

```bash
docker build -t mt/api-gateway .
docker run --rm -p 8080:8080 \
  -e USER_SERVICE_URL=http://host.docker.internal:8081 \
  -e MOVIE_SERVICE_URL=http://host.docker.internal:8082 \
  -e BOOKING_SERVICE_URL=http://host.docker.internal:8083 \
  mt/api-gateway
```

## Health

http://localhost:8080/actuator/health
