import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Post validation schemas
export const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be less than 2000 characters')
    .refine((content) => content.trim().length > 0, 'Content cannot be empty'),
  code: z.string()
    .max(5000, 'Code must be less than 5000 characters')
    .optional(),
  language: z.string()
    .max(20, 'Language name too long')
    .regex(/^[a-zA-Z0-9\-_+#]*$/, 'Invalid language format')
    .optional(),
})

export const updatePostSchema = createPostSchema.partial()

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(1000, 'Comment must be less than 1000 characters')
    .refine((content) => content.trim().length > 0, 'Content cannot be empty'),
  parentId: z.string().cuid().optional(),
})

// AI validation schemas
export const aiChatSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters')
    .refine((message) => message.trim().length > 0, 'Message cannot be empty'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(2000)
  })).max(50, 'Conversation history too long').optional(),
})

export const analyzeCodeSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(5000, 'Code must be less than 5000 characters'),
  language: z.string()
    .max(20, 'Language name too long')
    .regex(/^[a-zA-Z0-9\-_+#]*$/, 'Invalid language format')
    .optional(),
})

export const generateCodeSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .refine((desc) => desc.trim().length > 0, 'Description cannot be empty'),
  language: z.string()
    .max(20, 'Language name too long')
    .regex(/^[a-zA-Z0-9\-_+#]*$/, 'Invalid language format')
    .optional(),
})

// Utility function to validate request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// Sanitization functions
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .substring(0, 255)
}

// Rate limiting helpers
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  posts: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 posts per minute
  ai: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 AI requests per minute
  general: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
} as const