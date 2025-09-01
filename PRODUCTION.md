# 🚀 PyThoughts Production Deployment Guide

This guide covers the complete production deployment process for PyThoughts, including security, performance optimization, and monitoring.

## 📋 Prerequisites

- **Server**: Ubuntu 20.04+ or CentOS 8+ with at least 2GB RAM
- **Docker**: Version 20.10+ with Docker Compose
- **Domain**: Configured with DNS pointing to your server
- **SSL Certificate**: Valid SSL certificate for your domain
- **API Keys**: DeepSeek, Resend, and social login providers configured

## 🔧 Environment Configuration

### 1. Copy Environment Template

```bash
cp env.example .env
```

### 2. Configure Required Variables

```bash
# Application
NODE_ENV=production
PORT=3001
APP_URL=https://yourdomain.com

# Database
DATABASE_URL="file:./prisma/prod.db"

# Authentication
AUTH_SECRET=your-super-secret-auth-key-here-min-32-chars
AUTH_URL=https://yourdomain.com

# Email (Required)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI Integration
DEEPSEEK_API_KEY=your-deepseek-api-key

# Social Login (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Generate Secure Secrets

```bash
# Generate AUTH_SECRET
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 16
```

## 🐳 Docker Deployment

### 1. Build and Deploy

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### 2. Deployment Commands

```bash
# Check status
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Restart services
./scripts/deploy.sh restart

# Stop services
./scripts/deploy.sh stop

# Cleanup (removes containers and volumes)
./scripts/deploy.sh cleanup
```

### 3. Manual Docker Commands

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. SSL Certificate Setup

```bash
# Create SSL directory
mkdir -p ssl

# Copy your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Set proper permissions
chmod 600 ssl/*
```

### 3. Environment Security

- Never commit `.env` files to version control
- Use strong, unique passwords for all services
- Rotate API keys regularly
- Monitor access logs for suspicious activity

## 📊 Monitoring and Logging

### 1. Health Checks

The application includes built-in health checks:

- **Application**: `https://yourdomain.com/api/health`
- **Nginx**: `https://yourdomain.com/health`
- **Docker**: Health checks configured in docker-compose

### 2. Log Management

```bash
# View application logs
docker logs -f pythoughts-app

# View Nginx logs
docker logs -f pythoughts-nginx

# View all logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Performance Monitoring

```bash
# Check resource usage
docker stats

# Monitor disk usage
df -h

# Check memory usage
free -h
```

## 🚀 Performance Optimization

### 1. Nginx Configuration

- Gzip compression enabled
- Static file caching configured
- Rate limiting implemented
- Security headers configured

### 2. Database Optimization

```bash
# Run database migrations
docker exec pythoughts-app npx prisma migrate deploy

# Generate Prisma client
docker exec pythoughts-app npx prisma generate
```

### 3. Caching Strategy

- Redis for session storage
- Static asset caching
- API response caching (configurable)

## 🔄 Backup and Recovery

### 1. Automated Backups

The deployment script creates automatic backups:

```bash
# Manual backup
./scripts/deploy.sh backup
```

### 2. Database Backup

```bash
# Backup database
docker run --rm -v pythoughts_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### 3. Recovery Process

```bash
# Stop services
./scripts/deploy.sh stop

# Restore database
docker run --rm -v pythoughts_data:/data -v $(pwd):/backup alpine tar xzf /backup/db_backup_YYYYMMDD_HHMMSS.tar.gz -C /data

# Restart services
./scripts/deploy.sh
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
sudo netstat -tulpn | grep :3001

# Kill the process
sudo kill -9 <PID>
```

#### 2. Database Connection Issues

```bash
# Check database status
docker exec pythoughts-app npx prisma db push

# Reset database (WARNING: Data loss)
docker exec pythoughts-app npx prisma migrate reset
```

#### 3. Memory Issues

```bash
# Check memory usage
docker stats --no-stream

# Restart services
./scripts/deploy.sh restart
```

### Debug Mode

```bash
# Enable debug logging
export DEBUG=*

# Run with verbose output
docker-compose -f docker-compose.prod.yml up --verbose
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling

```bash
# Scale application instances
docker-compose -f docker-compose.prod.yml up -d --scale pythoughts=3
```

### 2. Load Balancer

Consider using a load balancer (HAProxy, Traefik) for multiple instances.

### 3. Database Scaling

For production use, consider:
- PostgreSQL instead of SQLite
- Database clustering
- Read replicas

## 🔄 Updates and Maintenance

### 1. Application Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
./scripts/deploy.sh
```

### 2. Security Updates

```bash
# Update base images
docker-compose -f docker-compose.prod.yml pull

# Rebuild with latest images
./scripts/deploy.sh
```

### 3. Scheduled Maintenance

```bash
# Create maintenance script
crontab -e

# Add maintenance schedule (example: daily at 2 AM)
0 2 * * * /path/to/pythoughts/scripts/deploy.sh maintenance
```

## 📞 Support and Resources

### 1. Documentation
- [PyThoughts Project Documentation](./README.md)
- [API Documentation](./API.md)
- [Development Guide](./DEVELOPMENT.md)

### 2. Monitoring Tools
- Application logs: Docker logs
- System monitoring: htop, iotop
- Network monitoring: netstat, ss

### 3. Emergency Contacts
- DevOps Team: [Contact Information]
- Database Administrator: [Contact Information]
- Security Team: [Contact Information]

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Database migrations run
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated

---

**🚀 Your PyThoughts application is now production-ready!**

For additional support or questions, please refer to the project documentation or contact the development team.
