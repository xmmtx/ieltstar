FROM node:20-alpine AS builder

WORKDIR /app

# ---- Build Next.js frontend ----
COPY ieltstar/package.json ieltstar/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY ieltstar/ ./
RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app

# Frontend (Next.js production build)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Backend (Express API)
COPY server/package.json server/package-lock.json ./server/
RUN cd /app/server && npm install
COPY server/ ./server/

# Startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
