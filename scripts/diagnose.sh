#!/bin/bash

# PyThoughts Local Diagnostics Script
# Run with: bash scripts/diagnose.sh [basic|full]

DIAGNOSTIC_LEVEL=${1:-basic}
echo "🔍 Running PyThoughts Diagnostics (Level: $DIAGNOSTIC_LEVEL)"
echo "=============================================="
echo

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo "📅 Date: $(date)"
echo "🖥️  OS: $(uname -s)"
echo "📦 Node: $(node --version 2>/dev/null || echo 'Not installed')"
echo "📦 npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo

# Check repository structure
echo "📁 REPOSITORY STRUCTURE CHECK"
echo "=============================="

required_files=("package.json" "tsconfig.json" "vite.config.ts" "src/main.tsx" "src/App.tsx")
optional_files=("docker-compose.yml" "Dockerfile" "nginx.conf" "prisma/schema.prisma")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "$file"
    else
        error "$file (required)"
    fi
done

echo
info "Optional files:"
for file in "${optional_files[@]}"; do
    if [ -f "$file" ]; then
        success "$file"
    else
        warning "$file (optional)"
    fi
done

echo

# Check dependencies
echo "📦 DEPENDENCY CHECK"
echo "==================="

if [ -f "package.json" ]; then
    success "package.json found"
    
    if command -v jq &> /dev/null; then
        echo "📊 Dependencies: $(jq '.dependencies | length' package.json)"
        echo "📊 DevDependencies: $(jq '.devDependencies | length' package.json)"
    fi
    
    if [ -f "package-lock.json" ]; then
        success "package-lock.json found"
    else
        warning "package-lock.json missing"
    fi
    
    if [ ! -d "node_modules" ]; then
        warning "node_modules not found - run 'npm install'"
        
        if [ "$DIAGNOSTIC_LEVEL" = "full" ]; then
            info "Installing dependencies..."
            npm install
        fi
    else
        success "node_modules directory found"
    fi
else
    error "package.json not found - not a Node.js project?"
    exit 1
fi

echo

# Code quality checks
echo "🔍 CODE QUALITY CHECKS"
echo "======================="

if npm run lint &> /dev/null; then
    success "ESLint check passed"
else
    error "ESLint issues found - run 'npm run lint' for details"
fi

if npx tsc --noEmit &> /dev/null; then
    success "TypeScript check passed"
else
    error "TypeScript errors found - run 'npx tsc --noEmit' for details"
fi

echo

# Test checks
echo "🧪 TEST CHECKS"
echo "==============="

test_files=$(find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | wc -l)
echo "📊 Test files found: $test_files"

if [ -f "vitest.config.ts" ]; then
    success "Vitest configuration found"
    
    if [ "$DIAGNOSTIC_LEVEL" = "full" ]; then
        info "Running tests..."
        if npm run test:run &> /dev/null; then
            success "All tests passed"
        else
            error "Some tests failed - run 'npm run test:run' for details"
        fi
    fi
else
    warning "No test configuration found"
fi

echo

# Build check
echo "🏗️  BUILD CHECK"
echo "==============="

if [ "$DIAGNOSTIC_LEVEL" = "full" ]; then
    info "Testing build process..."
    if npm run build &> /dev/null; then
        success "Build successful"
        if [ -d "dist" ]; then
            echo "📊 Build output size: $(du -sh dist 2>/dev/null | cut -f1)"
        fi
    else
        error "Build failed - run 'npm run build' for details"
    fi
else
    info "Skipping build test (use 'full' level to test)"
fi

echo

# Database check
echo "🗄️  DATABASE CHECK"
echo "=================="

if [ -f "prisma/schema.prisma" ]; then
    success "Prisma schema found"
    
    models=$(grep -c "^model " prisma/schema.prisma 2>/dev/null || echo "0")
    echo "📊 Database models: $models"
    
    if [ -d "prisma/migrations" ]; then
        migrations=$(find prisma/migrations -name "*.sql" 2>/dev/null | wc -l)
        echo "📊 Migrations: $migrations"
        success "Database migrations found"
    else
        warning "No migrations directory found"
    fi
    
    if [ "$DIAGNOSTIC_LEVEL" = "full" ]; then
        if npx prisma generate &> /dev/null; then
            success "Prisma client generation successful"
        else
            error "Prisma client generation failed"
        fi
    fi
else
    info "No database configuration found"
fi

echo

# Security check
echo "🔒 SECURITY CHECK"
echo "=================="

if [ "$DIAGNOSTIC_LEVEL" = "full" ]; then
    info "Running security audit..."
    if npm audit --audit-level=moderate &> /dev/null; then
        success "No security vulnerabilities found"
    else
        warning "Security vulnerabilities detected - run 'npm audit' for details"
    fi
else
    info "Skipping security audit (use 'full' level to check)"
fi

# Check for sensitive files
sensitive_patterns=(".env" "*.key" "*.pem" "secret*")
found_sensitive=false

for pattern in "${sensitive_patterns[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" 2>/dev/null | grep -q .; then
        warning "Found potential sensitive files: $pattern"
        found_sensitive=true
    fi
done

if [ "$found_sensitive" = false ]; then
    success "No obvious sensitive files found"
fi

echo

# Summary
echo "📋 DIAGNOSTIC SUMMARY"
echo "====================="
echo "✅ Diagnostic scan completed"
echo "📅 $(date)"
echo
echo "💡 Tips:"
echo "  - Run with 'full' parameter for comprehensive checks"
echo "  - Use 'npm run lint' to fix code style issues"
echo "  - Use 'npm run test' to run the test suite"
echo "  - Check the GitHub Actions workflow for CI/CD status"
echo

if [ "$DIAGNOSTIC_LEVEL" = "basic" ]; then
    info "For more detailed analysis, run: bash scripts/diagnose.sh full"
fi