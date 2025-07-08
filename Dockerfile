# Multi-stage build for ConstructPune Application

# Frontend Build Stage
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build

# Backend Base
FROM python:3.11-slim AS backend-base
WORKDIR /app
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Backend Dependencies
FROM backend-base AS backend-deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production Stage
FROM python:3.11-slim AS production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd --create-home --shell /bin/bash app

# Set working directory
WORKDIR /app

# Copy Python dependencies
COPY --from=backend-deps /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=backend-deps /usr/local/bin/ /usr/local/bin/

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build/

# Copy configuration files
COPY docker/ ./docker/

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Configure Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions
RUN chown -R app:app /app
RUN chmod +x /app/docker/entrypoint.sh

# Create logs directory
RUN mkdir -p /var/log/supervisor /var/log/nginx
RUN chown -R app:app /var/log/supervisor

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/api/ || exit 1

# Set entrypoint
ENTRYPOINT ["/app/docker/entrypoint.sh"]