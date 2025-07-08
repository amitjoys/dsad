# ConstructPune Deployment Guide

This guide covers deployment of the ConstructPune application in various environments.

## 🚀 Quick Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured (optional)
- SSL certificates (for HTTPS)

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd constructpune

# Copy and configure environment file
cp docker/production.env .env

# Edit environment variables
nano .env
```

### 2. Configure Environment Variables

Update `.env` file with your production settings:

```env
# Database Configuration
MONGO_URL=mongodb://admin:YOUR_SECURE_PASSWORD@mongodb:27017/constructpune_db?authSource=admin

# Security (IMPORTANT: Change these!)
SECRET_KEY=your-super-secure-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
ENVIRONMENT=production
DOMAIN_NAME=your-domain.com
PROTOCOL=https

# Email Configuration (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@constructpune.in
```

### 3. Deploy Application

```bash
# Start all services
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f constructpune_app
```

### 4. Access Application

- **Website**: http://your-domain.com (or http://localhost if local)
- **API Docs**: http://your-domain.com/api/docs
- **Health Check**: http://your-domain.com/health

## 🔒 SSL/HTTPS Configuration

### Using Let's Encrypt (Recommended)

1. **Install Certbot**:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

2. **Obtain SSL Certificate**:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

3. **Update Docker Configuration**:

Create `docker/ssl.conf`:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Include main configuration
    include /etc/nginx/sites-available/default;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

4. **Update docker-compose.yml**:
```yaml
constructpune_app:
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
    - ./docker/ssl.conf:/etc/nginx/sites-available/ssl.conf:ro
```

5. **Restart Services**:
```bash
docker-compose down
docker-compose up -d
```

## 🏗️ Different Deployment Options

### 1. Single Server Deployment (Recommended for Small-Medium Scale)

```yaml
# docker-compose.yml (current configuration)
# All services on one server
# Good for: 1-10k users, simple setup
```

### 2. Multi-Server Deployment

#### Load Balancer + App Servers
```yaml
# docker-compose.lb.yml
version: '3.8'
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - app1
      - app2
      
  app1:
    build: .
    environment:
      - MONGO_URL=mongodb://admin:password@db-server:27017/constructpune_db
    
  app2:
    build: .
    environment:
      - MONGO_URL=mongodb://admin:password@db-server:27017/constructpune_db
```

#### Separate Database Server
```yaml
# On database server
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
    volumes:
      - mongodb_data:/data/db
      - ./docker/mongo-replica.conf:/etc/mongod.conf
    command: --config /etc/mongod.conf
    ports:
      - "27017:27017"
```

### 3. Cloud Deployment

#### AWS ECS
```yaml
# ecs-task-definition.json
{
  "family": "constructpune",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "constructpune-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/constructpune:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "MONGO_URL",
          "value": "mongodb://admin:password@docdb-cluster.cluster-xyz.region.docdb.amazonaws.com:27017/constructpune_db"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/constructpune",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Google Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/constructpune', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/constructpune']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'constructpune'
      - '--image'
      - 'gcr.io/$PROJECT_ID/constructpune'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

#### Digital Ocean App Platform
```yaml
# .do/app.yaml
name: constructpune
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/constructpune
      branch: main
    run_command: docker-entrypoint.sh
    environment_slug: node-js
    instance_count: 2
    instance_size_slug: basic-xxs
    http_port: 80
    env:
      - key: MONGO_URL
        value: ${db.MONGO_URL}
        type: SECRET
      - key: SECRET_KEY
        value: ${SECRET_KEY}
        type: SECRET
databases:
  - name: db
    engine: MONGODB
    version: "5"
    size_slug: db-s-1vcpu-1gb
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

#### Health Checks
```bash
# Add to crontab for automated monitoring
*/5 * * * * curl -f http://localhost/health || echo "Application down" | mail -s "Alert" admin@constructpune.in
```

#### Log Management
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
      
  kibana:
    image: kibana:7.14.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
      
  logstash:
    image: logstash:7.14.0
    volumes:
      - ./docker/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
```

### 2. Performance Monitoring

#### Prometheus + Grafana
```yaml
# docker-compose.metrics.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/constructpune
            git pull origin main
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - docker-compose -f docker-compose.test.yml up --abort-on-container-exit

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - ssh user@server "cd /opt/constructpune && docker-compose pull && docker-compose up -d"
  only:
    - main
```

## 💾 Backup & Recovery

### Automated Backups
```bash
# Add to crontab
0 2 * * * cd /opt/constructpune && docker-compose run --rm backup

# Weekly backup cleanup
0 3 * * 0 find /opt/constructpune/backups -name "*.tar.gz" -mtime +30 -delete
```

### Manual Backup
```bash
# Create manual backup
docker-compose run --rm backup

# Restore from backup
docker-compose exec mongodb mongorestore --drop /backups/backup_file.tar.gz
```

### Disaster Recovery
```bash
# Complete system recovery
git clone <repository-url>
cd constructpune
cp backup/.env .env
docker-compose up -d
docker-compose exec mongodb mongorestore --drop /backups/latest_backup.tar.gz
```

## 🔧 Troubleshooting

### Common Issues

1. **Application won't start**:
```bash
# Check logs
docker-compose logs constructpune_app

# Check environment variables
docker-compose exec constructpune_app env

# Restart services
docker-compose restart
```

2. **Database connection issues**:
```bash
# Check MongoDB status
docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"

# Check network connectivity
docker-compose exec constructpune_app ping mongodb
```

3. **High resource usage**:
```bash
# Monitor resource usage
docker stats

# Check disk space
df -h

# Clean up unused containers/images
docker system prune -f
```

4. **SSL certificate issues**:
```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/domain/fullchain.pem -text -noout

# Renew certificate
certbot renew --dry-run
```

### Performance Tuning

1. **Database Optimization**:
```javascript
// MongoDB indexes
db.contacts.createIndex({ "created_at": 1 })
db.projects.createIndex({ "category": 1, "created_at": 1 })
db.calculations.createIndex({ "location": 1, "created_at": 1 })
```

2. **Application Scaling**:
```yaml
# Scale application containers
docker-compose up -d --scale constructpune_app=3

# Use load balancer
# Update nginx configuration for load balancing
```

3. **Caching**:
```yaml
# Add Redis for caching
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

## 📧 Support

For deployment support:
- 📧 Email: devops@constructpune.in
- 📱 Phone: +91-1234567890
- 💬 Slack: #constructpune-deployment

---

**Happy Deploying! 🚀**