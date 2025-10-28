# Deployment Guide

Complete guide for deploying the OCR Document Search system.

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Providers](#cloud-providers)
- [Monitoring](#monitoring)
- [Backup & Recovery](#backup--recovery)

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB 6+
- Redis 7+
- Poppler utils (for PDF processing)

### Setup

1. **Install MongoDB**
```bash
# macOS
brew install mongodb-community@6

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data
```

2. **Install Redis**
```bash
# macOS
brew install redis
redis-server

# Ubuntu
sudo apt-get install redis-server
sudo service redis-server start
```

3. **Install Poppler**
```bash
# macOS
brew install poppler

# Ubuntu
sudo apt-get install poppler-utils
```

4. **Install Backend Dependencies**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
```

5. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

6. **Run Services**
```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: OCR Worker
cd backend
npm run worker

# Terminal 3: Frontend
cd frontend
npm start
```

## Docker Deployment

### Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Custom Configuration

Create `docker-compose.override.yml` for local overrides:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - WORKER_CONCURRENCY=4
      - MAX_FILE_SIZE=209715200  # 200MB
    ports:
      - "4001:4000"  # Custom port
  
  frontend:
    ports:
      - "3001:3000"
```

### Scaling Workers

```bash
# Scale to 3 worker instances
docker-compose up -d --scale worker=3
```

## Production Deployment

### Environment Variables

Create `backend/.env.production`:

```env
NODE_ENV=production
PORT=4000

# Database - Use managed MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ocr-prod

# Redis - Use managed Redis
REDIS_URL=redis://username:password@redis-host:6379

# Security - Generate strong secret
JWT_SECRET=your-very-long-random-secret-key-here

# Storage - Use cloud storage
UPLOAD_DIR=/var/lib/ocr/uploads
MAX_FILE_SIZE=104857600

# Worker
WORKER_CONCURRENCY=4

# Monitoring
LOG_LEVEL=info
```

### Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Use bcrypt for passwords (update auth.js)
- [ ] Set up CORS whitelist
- [ ] Enable CSP headers
- [ ] Regular security updates
- [ ] Implement API authentication

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: npm start
    environment:
      - NODE_ENV=production
    restart: always
    volumes:
      - uploads:/data/uploads
    networks:
      - app-network
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G

  worker:
    build:
      context: ./backend
    command: npm run worker
    environment:
      - NODE_ENV=production
    restart: always
    volumes:
      - uploads:/data/uploads
    networks:
      - app-network
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - app-network

volumes:
  uploads:

networks:
  app-network:
    driver: bridge
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        least_conn;
        server backend:4000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name your-domain.com;
        
        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            
            # WebSocket support
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # File upload limits
        client_max_body_size 100M;
    }
}
```

## Cloud Providers

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name ocr-backend
aws ecr create-repository --repository-name ocr-frontend
aws ecr create-repository --repository-name ocr-worker

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t ocr-backend ./backend
docker tag ocr-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ocr-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ocr-backend:latest
```

2. **Use managed services**
- MongoDB: MongoDB Atlas
- Redis: Amazon ElastiCache
- Storage: Amazon S3
- Load Balancer: Application Load Balancer

### Google Cloud Platform

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/ocr-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/ocr-worker ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/ocr-frontend ./frontend

# Deploy to Cloud Run
gcloud run deploy ocr-backend \
  --image gcr.io/PROJECT-ID/ocr-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

Create `.do/app.yaml`:

```yaml
name: ocr-document-search
services:
  - name: backend
    github:
      repo: your-username/ocr-document-search
      branch: main
      deploy_on_push: true
    source_dir: backend
    http_port: 4000
    instance_count: 2
    instance_size_slug: professional-xs
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        value: ${db.DATABASE_URL}

  - name: worker
    github:
      repo: your-username/ocr-document-search
      branch: main
    source_dir: backend
    run_command: npm run worker
    instance_count: 2

  - name: frontend
    github:
      repo: your-username/ocr-document-search
      branch: main
    source_dir: frontend
    http_port: 3000

databases:
  - name: db
    engine: MONGODB
    version: "6"

  - name: redis
    engine: REDIS
    version: "7"
```

## Monitoring

### Health Checks

```javascript
// Add to backend/src/app.js
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    mongodb: 'disconnected',
    redis: 'disconnected'
  };

  try {
    await mongoose.connection.db.admin().ping();
    health.mongodb = 'connected';
  } catch (err) {
    health.mongodb = 'error';
  }

  try {
    const { connection } = require('./queue');
    await connection.ping();
    health.redis = 'connected';
  } catch (err) {
    health.redis = 'error';
  }

  const status = (health.mongodb === 'connected' && health.redis === 'connected') ? 200 : 503;
  res.status(status).json(health);
});
```

### Logging

Use structured logging with Pino:

```javascript
const logger = require('pino')({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

logger.info({ documentId }, 'OCR processing started');
logger.error({ err, documentId }, 'OCR processing failed');
```

### Metrics with Prometheus

```javascript
const promClient = require('prom-client');
const register = new promClient.Registry();

const ocrDuration = new promClient.Histogram({
  name: 'ocr_processing_duration_seconds',
  help: 'OCR processing duration',
  labelNames: ['status']
});

register.registerMetric(ocrDuration);
register.registerMetric(documentsProcessed);

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

### Error Tracking with Sentry

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

## Backup & Recovery

### MongoDB Backup

**Automated Daily Backup Script**:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="ocr-db"

# Create backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# Compress
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/$DATE.tar.gz" "s3://your-bucket/backups/mongodb/"
```

**Restore from Backup**:

```bash
# Extract backup
tar -xzf backup.tar.gz

# Restore
mongorestore --uri="$MONGO_URI" --drop ./backup_directory
```

### Redis Backup

Redis automatically creates snapshots. To backup manually:

```bash
# Save snapshot
redis-cli SAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backups/redis/dump_$(date +%Y%m%d).rdb
```

### File Storage Backup

**For local storage**:

```bash
#!/bin/bash
# backup-uploads.sh

rsync -av --delete /data/uploads/ /backups/uploads/
```

**For S3 storage**:

```bash
aws s3 sync /data/uploads/ s3://your-bucket/uploads/ --delete
```

### Automated Backup with Cron

```bash
# Edit crontab
crontab -e

# Add these lines
0 2 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1
0 3 * * * /scripts/backup-uploads.sh >> /var/log/backup-uploads.log 2>&1
```

## Performance Optimization

### Database Indexing

```javascript
// Ensure indexes are created
DocumentSchema.index({ 'pages.text': 'text', title: 'text', tags: 'text' });
DocumentSchema.index({ uploadedAt: -1 });
DocumentSchema.index({ ocrState: 1 });
DocumentSchema.index({ fileHash: 1 });

// Check indexes
db.documents.getIndexes();
```

### Caching Strategy

```javascript
const redis = require('redis');
const client = redis.createClient({ url: config.REDIS_URL });

// Cache search results
async function searchWithCache(query) {
  const cacheKey = `search:${JSON.stringify(query)}`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const results = await performSearch(query);
  
  // Cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(results));
  
  return results;
}
```

### Load Balancing

Use PM2 for clustering:

```bash
npm install pm2 -g

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ocr-backend',
    script: './src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'ocr-worker',
    script: './src/worker/ocrWorker.js',
    instances: 2,
    env: {
      NODE_ENV: 'production'
    }
  }]
};

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## SSL/TLS Certificates

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Docker with Let's Encrypt

Use `nginx-proxy` and `letsencrypt-nginx-proxy-companion`:

```yaml
version: '3.8'
services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html

  letsencrypt:
    image: jrcs/letsencrypt-nginx-proxy-companion
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html

  backend:
    environment:
      - VIRTUAL_HOST=api.your-domain.com
      - LETSENCRYPT_HOST=api.your-domain.com
      - LETSENCRYPT_EMAIL=your-email@example.com

volumes:
  certs:
  vhost:
  html:
```

## Troubleshooting Production Issues

### High Memory Usage

```bash
# Check process memory
docker stats

# Limit container memory
docker run -m 512m ocr-worker
```

### Slow OCR Processing

1. Increase worker concurrency
2. Add more worker instances
3. Optimize preprocessing settings
4. Use GPU acceleration (if available)

### Database Performance

```bash
# Check slow queries
db.setProfilingLevel(2)
db.system.profile.find().sort({ts:-1}).limit(10)

# Analyze query performance
db.documents.find({...}).explain("executionStats")
```

### Redis Memory Issues

```bash
# Check memory usage
redis-cli INFO memory

# Set max memory policy
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG SET maxmemory 256mb
```

## Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Security audit
npm audit
npm audit fix
```

### Database Maintenance

```javascript
// MongoDB maintenance script
// Compact collections
db.runCommand({ compact: 'documents' });

// Rebuild indexes
db.documents.reIndex();

// Check database stats
db.stats();
```

### Log Rotation

```bash
# /etc/logrotate.d/ocr-app
/var/log/ocr-app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        docker-compose restart backend worker
    endscript
}
```

## Disaster Recovery Plan

### 1. System Failure

- Monitor uptime with tools like UptimeRobot
- Auto-restart containers: `restart: always`
- Keep recent backups (daily for 7 days, weekly for 4 weeks)

### 2. Data Corruption

- Restore from latest backup
- Verify data integrity after restoration
- Re-process failed OCR jobs

### 3. Security Breach

- Change all secrets immediately
- Review access logs
- Restore from clean backup
- Update all dependencies

### Recovery Steps

```bash
# 1. Stop services
docker-compose down

# 2. Restore database
mongorestore --uri="$MONGO_URI" --drop ./backup

# 3. Restore files
rsync -av /backups/uploads/ /data/uploads/

# 4. Restart services
docker-compose up -d

# 5. Verify health
curl http://localhost:4000/health
```

## Checklist for Production

- [ ] All secrets changed from defaults
- [ ] HTTPS/SSL enabled
- [ ] MongoDB authentication enabled
- [ ] Redis password set
- [ ] Firewall configured
- [ ] Backups automated and tested
- [ ] Monitoring setup (health checks, logs, metrics)
- [ ] Error tracking configured (Sentry)
- [ ] Rate limiting enabled
- [ ] CORS whitelist configured
- [ ] File upload limits set
- [ ] Worker concurrency optimized
- [ ] Database indexes created
- [ ] Log rotation configured
- [ ] Update strategy defined
- [ ] Disaster recovery plan documented
- [ ] Team has access to credentials
- [ ] Documentation updated

## Support

For production issues:
- Check logs: `docker-compose logs -f`
- Monitor metrics: `/metrics` endpoint
- Review error tracking dashboard
- Consult troubleshooting section above

---

**Important**: Test your deployment in a staging environment before going to production!

});

const documentsProcessed = new promClient.Counter({
  name: 'documents_processed_total',
  help: 'Total documents processed',
  labelNames: ['status
