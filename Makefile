# ConstructPune Makefile for Production Management

.PHONY: help build start stop restart logs clean backup deploy test

# Default target
help:
	@echo "ConstructPune Production Management"
	@echo "=================================="
	@echo ""
	@echo "Available targets:"
	@echo "  help     - Show this help message"
	@echo "  build    - Build Docker images"
	@echo "  start    - Start all services"
	@echo "  stop     - Stop all services"
	@echo "  restart  - Restart all services"
	@echo "  logs     - Show logs"
	@echo "  clean    - Clean up containers and images"
	@echo "  backup   - Create database backup"
	@echo "  deploy   - Deploy to production"
	@echo "  test     - Run tests"
	@echo ""
	@echo "Production targets:"
	@echo "  prod-start   - Start production cluster"
	@echo "  prod-stop    - Stop production cluster"
	@echo "  prod-scale   - Scale production services"
	@echo "  prod-backup  - Production backup"

# Development commands
build:
	@echo "Building ConstructPune application..."
	docker-compose build --no-cache

start:
	@echo "Starting ConstructPune services..."
	docker-compose up -d

stop:
	@echo "Stopping ConstructPune services..."
	docker-compose down

restart: stop start

logs:
	@echo "Showing ConstructPune logs..."
	docker-compose logs -f

clean:
	@echo "Cleaning up ConstructPune containers and images..."
	docker-compose down --volumes --rmi all
	docker system prune -f

backup:
	@echo "Creating database backup..."
	docker-compose run --rm backup

test:
	@echo "Running ConstructPune tests..."
	python backend_test.py

# Production commands
prod-start:
	@echo "Starting production ConstructPune cluster..."
	docker-compose -f docker/docker-compose.prod.yml up -d

prod-stop:
	@echo "Stopping production ConstructPune cluster..."
	docker-compose -f docker/docker-compose.prod.yml down

prod-scale:
	@echo "Scaling production services..."
	docker-compose -f docker/docker-compose.prod.yml up -d --scale app1=2 --scale app2=2

prod-backup:
	@echo "Creating production backup..."
	docker-compose -f docker/docker-compose.prod.yml run --rm backup

deploy:
	@echo "Deploying ConstructPune to production..."
	@if [ ! -f .env ]; then \
		echo "Error: .env file not found. Copy docker/production.env to .env and configure it."; \
		exit 1; \
	fi
	docker-compose -f docker/docker-compose.prod.yml build --no-cache
	docker-compose -f docker/docker-compose.prod.yml up -d
	@echo "Deployment complete!"

# SSL setup
ssl-setup:
	@echo "Setting up SSL certificates..."
	docker run --rm -v $(PWD)/ssl:/ssl alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout /ssl/default.key -out /ssl/default.crt \
		-subj "/C=IN/ST=Maharashtra/L=Pune/O=ConstructPune/CN=constructpune.in"

# Database operations
db-shell:
	@echo "Opening MongoDB shell..."
	docker-compose exec mongodb mongosh -u admin -p

db-backup:
	@echo "Creating manual database backup..."
	mkdir -p backups
	docker-compose exec mongodb mongodump --authenticationDatabase admin -u admin -p --out /tmp/backup
	docker cp $$(docker-compose ps -q mongodb):/tmp/backup ./backups/manual_backup_$$(date +%Y%m%d_%H%M%S)

db-restore:
	@echo "Restoring database from backup..."
	@read -p "Enter backup directory name: " backup_dir; \
	docker cp ./backups/$$backup_dir $$(docker-compose ps -q mongodb):/tmp/restore; \
	docker-compose exec mongodb mongorestore --authenticationDatabase admin -u admin -p --drop /tmp/restore

# Monitoring
status:
	@echo "ConstructPune Service Status:"
	@echo "============================"
	docker-compose ps

health:
	@echo "Checking service health..."
	@curl -s http://localhost/health || echo "❌ Application health check failed"
	@curl -s http://localhost/api/ || echo "❌ API health check failed"

monitor:
	@echo "Opening monitoring dashboard..."
	@echo "Grafana: http://localhost:3001 (admin/admin)"
	@echo "Prometheus: http://localhost:9090"

# Development helpers
dev-setup:
	@echo "Setting up development environment..."
	cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
	cd frontend && yarn install

dev-start:
	@echo "Starting development servers..."
	cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001 &
	cd frontend && yarn start &

# Security
security-scan:
	@echo "Running security scan..."
	docker run --rm -v $(PWD):/code \
		returntocorp/semgrep --config=auto /code

# Performance testing
perf-test:
	@echo "Running performance tests..."
	docker run --rm -i loadimpact/k6 run - < tests/performance.js

# Quick commands
quick-start: build start
	@echo "ConstructPune is now running!"
	@echo "Frontend: http://localhost"
	@echo "API Docs: http://localhost/api/docs"

quick-deploy: deploy
	@echo "Production deployment complete!"
	@echo "Don't forget to:"
	@echo "1. Configure SSL certificates"
	@echo "2. Set up domain DNS"
	@echo "3. Configure monitoring alerts"
	@echo "4. Schedule backups"