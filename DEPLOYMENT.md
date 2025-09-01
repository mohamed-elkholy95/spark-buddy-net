# PyThoughts - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

1. **Server Requirements**
   - Node.js 18+ 
   - PostgreSQL 15+
   - Redis 7+
   - Nginx (for reverse proxy)
   - SSL certificate
   - Minimum 2GB RAM, 1 CPU core

2. **Required Environment Variables**
   ```bash
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/pythoughts
   
   # Authentication
   BETTER_AUTH_SECRET=your-super-secure-secret-key-32chars-min
   BETTER_AUTH_URL=https://your-domain.com
   
   # Email Service
   RESEND_API_KEY=your-resend-api-key
   RESEND_FROM_EMAIL=noreply@your-domain.com
   
   # AI Service
   DEEPSEEK_API_KEY=your-deepseek-api-key
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   
   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Application
   NODE_ENV=production
   PORT=3000
   APP_URL=https://your-domain.com
   ```

### Docker Deployment (Recommended)

1. **Clone and setup**
   ```bash
   git clone https://github.com/your-org/pythoughts.git
   cd pythoughts
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

4. **Create initial data (optional)**
   ```bash
   docker-compose exec app node -e "
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   // Add your seed data here
   "
   ```

### Manual Deployment

1. **Server Setup**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt-get install postgresql postgresql-contrib
   
   # Install Redis
   sudo apt-get install redis-server
   
   # Install Nginx
   sudo apt-get install nginx
   ```

2. **Application Setup**
   ```bash
   git clone https://github.com/your-org/pythoughts.git
   cd pythoughts
   npm ci --only=production
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```

3. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name pythoughts
   pm2 startup
   pm2 save
   ```

4. **Nginx Configuration**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/pythoughts
   sudo ln -s /etc/nginx/sites-available/pythoughts /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### SSL Certificate Setup

```bash
# Using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Monitoring and Logging

1. **Application Monitoring**
   ```bash
   # Start monitoring stack
   docker-compose --profile monitoring up -d
   
   # Access Grafana: http://localhost:3001 (admin/admin)
   # Access Prometheus: http://localhost:9090
   ```

2. **Log Management**
   ```bash
   # View application logs
   docker-compose logs -f app
   
   # View specific service logs
   docker-compose logs -f db
   docker-compose logs -f nginx
   ```

### Database Maintenance

1. **Backups**
   ```bash
   # Create backup
   docker-compose exec db pg_dump -U postgres pythoughts > backup.sql
   
   # Restore backup
   docker-compose exec -T db psql -U postgres pythoughts < backup.sql
   ```

2. **Performance Tuning**
   ```sql
   -- Add database indexes for performance
   CREATE INDEX CONCURRENTLY idx_posts_created_at ON posts(created_at DESC);
   CREATE INDEX CONCURRENTLY idx_posts_author_id ON posts(author_id);
   CREATE INDEX CONCURRENTLY idx_comments_post_id ON comments(post_id);
   CREATE INDEX CONCURRENTLY idx_likes_user_post ON likes(user_id, post_id);
   ```

### Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured (only allow ports 80, 443, 22)
- [ ] Database not accessible from external network
- [ ] Strong passwords for all accounts
- [ ] Regular security updates applied
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Environment variables secured

### Performance Optimization

1. **Database Connection Pooling**
   ```javascript
   // prisma/client.js
   const { PrismaClient } = require('@prisma/client')
   
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
   }).$extends({
     query: {
       $allOperations({ args, query }) {
         const start = Date.now()
         const result = query(args)
         const end = Date.now()
         console.log(`Query took ${end - start}ms`)
         return result
       },
     },
   })
   ```

2. **Caching Strategy**
   ```javascript
   // Add Redis caching
   const redis = require('redis')
   const client = redis.createClient({
     url: process.env.REDIS_URL
   })
   
   // Cache posts for 5 minutes
   app.get('/api/posts', async (req, res) => {
     const cached = await client.get('posts')
     if (cached) {
       return res.json(JSON.parse(cached))
     }
     
     const posts = await prisma.post.findMany()
     await client.setex('posts', 300, JSON.stringify(posts))
     res.json(posts)
   })
   ```

3. **CDN Configuration**
   ```nginx
   # Add to Nginx config for static assets
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
     add_header Vary "Accept-Encoding";
   }
   ```

### Troubleshooting

#### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database status
   docker-compose exec db pg_isready -U postgres
   
   # Check connection string
   echo $DATABASE_URL
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats
   
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" node server.js
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew --dry-run
   ```

### Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer (HAProxy, AWS ALB)
   - Session storage in Redis
   - Database read replicas
   - CDN for static assets

2. **Vertical Scaling**
   - Monitor CPU/Memory usage
   - Optimize database queries
   - Enable gzip compression
   - Use HTTP/2

### Backup and Recovery

1. **Automated Backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

2. **Disaster Recovery Plan**
   - Regular backup testing
   - Database failover setup
   - Application health checks
   - Monitoring and alerting

### Maintenance Tasks

- Daily: Monitor logs and metrics
- Weekly: Review security alerts, update dependencies
- Monthly: Database maintenance, backup testing
- Quarterly: Security audit, performance review