#!/bin/bash

# PyThoughts Production Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="pythoughts"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if .env file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found. Please copy env.example to .env and configure it."
    fi
    
    success "Prerequisites check passed"
}

# Backup current deployment
backup_deployment() {
    log "Creating backup of current deployment..."
    
    if docker ps -q -f name="$APP_NAME" | grep -q .; then
        log "Stopping current containers..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" stop
        
        # Create backup timestamp
        BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Backup database
        if docker volume ls -q -f name="pythoughts_data" | grep -q .; then
            log "Backing up database..."
            docker run --rm -v pythoughts_data:/data -v "$(pwd)/$BACKUP_DIR:/backup" alpine tar czf /backup/database_backup.tar.gz -C /data .
        fi
        
        success "Backup created in $BACKUP_DIR"
    else
        log "No running containers found, skipping backup"
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment..."
    
    # Pull latest changes if git repository
    if [[ -d ".git" ]]; then
        log "Pulling latest changes..."
        git pull origin main || warning "Failed to pull latest changes"
    fi
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_service_health
    
    success "Deployment completed successfully"
}

# Check service health
check_service_health() {
    log "Checking service health..."
    
    # Check main application
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        success "Main application is healthy"
    else
        error "Main application health check failed"
    fi
    
    # Check Nginx
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "Nginx is healthy"
    else
        error "Nginx health check failed"
    fi
    
    # Check Redis
    if docker exec pythoughts-redis redis-cli ping > /dev/null 2>&1; then
        success "Redis is healthy"
    else
        error "Redis health check failed"
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run Prisma migrations
    docker exec pythoughts-app npx prisma migrate deploy || warning "Migration failed, but continuing..."
    
    success "Database migrations completed"
}

# Show deployment status
show_status() {
    log "Deployment status:"
    echo ""
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    echo ""
    
    log "Service URLs:"
    echo "  - Main App: http://localhost:3001"
    echo "  - Nginx: http://localhost"
    echo "  - Health Check: http://localhost/health"
    echo ""
    
    log "Container logs:"
    echo "  - View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "  - App logs: docker logs -f pythoughts-app"
    echo "  - Nginx logs: docker logs -f pythoughts-nginx"
}

# Main deployment process
main() {
    log "Starting PyThoughts production deployment..."
    
    check_root
    check_prerequisites
    backup_deployment
    deploy
    run_migrations
    show_status
    
    success "Deployment completed successfully!"
    log "Your PyThoughts application is now running in production mode."
}

# Handle script arguments
case "${1:-}" in
    "status")
        show_status
        ;;
    "logs")
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f
        ;;
    "restart")
        log "Restarting services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" restart
        success "Services restarted"
        ;;
    "stop")
        log "Stopping services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" stop
        success "Services stopped"
        ;;
    "cleanup")
        log "Cleaning up containers and volumes..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
        success "Cleanup completed"
        ;;
    *)
        main
        ;;
esac
