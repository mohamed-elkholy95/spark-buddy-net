# 🔍 PyThoughts Diagnostics Guide

This document explains how to use the comprehensive diagnostic tools available in the PyThoughts project.

## 📋 Available Diagnostic Tools

### 1. GitHub Actions Diagnostic Workflow (`diagnose.yml`)

Automatically runs diagnostics on your repository through GitHub Actions.

**Triggers:**
- **Manual trigger**: Go to Actions tab → "Repository Diagnostics" → "Run workflow"
- **Automatic**: Triggers on changes to workflows, package.json, or config files
- **Pull requests**: Runs on PRs to main branch

**Diagnostic Levels:**
- `basic` - Quick health check (default)
- `full` - Comprehensive analysis including security audit
- `deep` - Complete analysis with performance metrics

**What it checks:**
- ✅ System information and repository structure
- ✅ Package dependencies and configuration files
- ✅ Code quality (linting, TypeScript)
- ✅ Test environment and test execution
- ✅ Security vulnerabilities
- ✅ Database schema and migrations
- ✅ Build system functionality
- ✅ Docker configuration (full/deep mode)
- ✅ Performance metrics (deep mode)

### 2. Local Diagnostic Script (`scripts/diagnose.sh`)

Run diagnostics locally on your development machine.

**Usage:**
```bash
# Quick diagnostic (basic level)
npm run diagnose

# Comprehensive diagnostic (full level)
npm run diagnose:full

# Or run directly
bash scripts/diagnose.sh [basic|full]
```

**What it checks locally:**
- 🏗️ Repository structure and required files
- 📦 Dependencies and node_modules status
- 🔍 Code quality (ESLint, TypeScript)
- 🧪 Test configuration and execution (full mode)
- 🏗️ Build process (full mode)
- 🗄️ Database schema and migrations
- 🔒 Security audit and sensitive file detection (full mode)

## 🚨 Common Issues and Solutions

### Repository Issues
```bash
❌ package.json (required)
```
**Solution**: Ensure you're in the correct project directory

```bash
⚠️  package-lock.json missing
```
**Solution**: Run `npm install` to generate lock file

```bash
❌ node_modules not found
```
**Solution**: Run `npm install` to install dependencies

### Code Quality Issues
```bash
❌ ESLint issues found
```
**Solution**: Run `npm run lint` to see and fix linting issues

```bash
❌ TypeScript errors found
```
**Solution**: Run `npx tsc --noEmit` to see type errors

### Test Issues
```bash
❌ Some tests failed
```
**Solution**: Run `npm run test:run` to see detailed test failures

### Build Issues
```bash
❌ Build failed
```
**Solution**: Run `npm run build` to see detailed build errors

### Database Issues
```bash
❌ Prisma client generation failed
```
**Solution**: 
1. Check `prisma/schema.prisma` syntax
2. Run `npx prisma generate` manually
3. Ensure database connection is available

### Security Issues
```bash
⚠️  Security vulnerabilities detected
```
**Solution**: 
1. Run `npm audit` to see details
2. Run `npm audit fix` to auto-fix issues
3. Update dependencies manually if needed

```bash
⚠️  Found potential sensitive files: .env
```
**Solution**: Ensure `.env` files contain no real secrets and are in `.gitignore`

## 📊 Understanding Diagnostic Output

### ✅ Green (Success)
- Feature is working correctly
- No issues found
- Configuration is proper

### ⚠️ Yellow (Warning)
- Non-critical issue
- Optional feature missing
- Potential improvement needed

### ❌ Red (Error)
- Critical issue that needs fixing
- Required feature missing
- System malfunction

### ℹ️ Blue (Info)
- Informational message
- Skipped check (due to diagnostic level)
- Additional context

## 🔧 Diagnostic Workflow Integration

The diagnostic workflow integrates with your development process:

1. **Pre-commit**: Run local diagnostics before committing
2. **CI/CD**: Automatic checks on push/PR
3. **Debugging**: Manual workflow dispatch for troubleshooting
4. **Monitoring**: Regular health checks in production

## 📈 Performance Metrics (Deep Mode Only)

Deep diagnostic mode includes:
- Bundle size analysis
- Build performance metrics
- Dependency audit
- Asset optimization checks

## 🛠️ Customizing Diagnostics

### Adding Custom Checks

Edit `scripts/diagnose.sh` to add project-specific checks:

```bash
# Add custom check
echo "🔍 CUSTOM CHECK"
echo "=============="

if [ -f "my-config.json" ]; then
    success "Custom configuration found"
else
    warning "Custom configuration missing"
fi
```

### Modifying GitHub Workflow

Edit `.github/workflows/diagnose.yml` to:
- Add new diagnostic jobs
- Modify triggers
- Change diagnostic levels
- Add custom artifacts

## 📚 Best Practices

1. **Run local diagnostics before committing**
   ```bash
   npm run diagnose:full
   ```

2. **Check GitHub Actions after pushing**
   - Go to Actions tab
   - Verify diagnostic workflow passes

3. **Use appropriate diagnostic levels**
   - `basic` for quick checks
   - `full` for thorough analysis
   - `deep` for performance debugging

4. **Review diagnostic artifacts**
   - Download reports from GitHub Actions
   - Check security audit results
   - Monitor performance trends

## 🔗 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Vite Configuration](https://vitejs.dev/config/)
- [Vitest Testing](https://vitest.dev/)
- [Prisma Database](https://www.prisma.io/docs)

---

💡 **Tip**: Bookmark this guide and run diagnostics regularly to maintain a healthy codebase!