# syntax=docker/dockerfile:1.6

# ----- Build stage -----
FROM node:20-alpine AS build
WORKDIR /app

# Cấu hình npm cho môi trường CI/Docker:
# - registry rõ ràng tránh phải resolve mặc định
# - tăng retry & timeout khi mạng chập chờn
# - tắt audit & fund cho bớt log nhiễu (và nhanh hơn)
ENV NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_LOGLEVEL=http \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_FETCH_TIMEOUT=600000

COPY package.json package-lock.json* ./

# Dùng BuildKit cache mount cho ~/.npm -> các lần build sau cực nhanh.
# Có lockfile -> npm ci (deterministic). Không có -> fallback npm install.
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
      npm ci --prefer-offline; \
    else \
      echo ">>> WARNING: package-lock.json không tồn tại, đang chạy npm install (chậm hơn nhiều)." && \
      npm install --prefer-offline; \
    fi

COPY . .

# Build với baseURL rỗng -> axios dùng URL tương đối, nginx sẽ proxy /api/* sang api-gateway.
ENV VITE_API_GATEWAY_URL=""
RUN npm run build

# ----- Runtime stage -----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
