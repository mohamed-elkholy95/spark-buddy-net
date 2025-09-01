import crypto from 'crypto'

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, expected: string): boolean {
  if (!token || !expected) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

// Content Security Policy
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Note: 'unsafe-inline' should be avoided in production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:3001",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Force HTTPS in production
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(),
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), location=()',
  }
}

// Input sanitization
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// SQL injection prevention (for raw queries)
export function sanitizeSqlInput(input: string): string {
  // Remove dangerous SQL keywords and characters
  return input
    .replace(/[';\\]/g, '') // Remove semicolons and backslashes
    .replace(/--.*$/gm, '') // Remove SQL comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|UNION|SELECT)\b/gi, '') // Remove dangerous keywords
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  // In production, use bcrypt or argon2
  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'))
}

// JWT utilities (for custom token handling)
export function generateSecureToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

export function generateApiKey(): string {
  return `pk_${crypto.randomBytes(32).toString('hex')}`
}

// File upload security
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? allowedTypes.includes(ext) : false
}

export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize
}

// Rate limiting storage (in-memory for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean up old entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k)
    }
  }
  
  const current = rateLimitStore.get(key)
  
  if (!current || current.resetTime < now) {
    // New window
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  // Increment count
  current.count++
  rateLimitStore.set(key, current)
  
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime,
  }
}

// Environment validation
export function validateEnvironmentVariables(): void {
  const required = [
    'BETTER_AUTH_SECRET',
    'DATABASE_URL',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  // Validate secret strength
  const secret = process.env.BETTER_AUTH_SECRET
  if (secret && secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long')
  }
}

// Audit logging
export interface AuditEvent {
  timestamp: Date
  userId?: string
  action: string
  resource?: string
  ip?: string
  userAgent?: string
  success: boolean
  error?: string
}

export function createAuditEvent(
  action: string,
  options: Partial<AuditEvent> = {}
): AuditEvent {
  return {
    timestamp: new Date(),
    action,
    success: true,
    ...options,
  }
}

// In production, this would write to a secure log service
export function logAuditEvent(event: AuditEvent): void {
  console.log(`[AUDIT] ${JSON.stringify(event)}`)
}