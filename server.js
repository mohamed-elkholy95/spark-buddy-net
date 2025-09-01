import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { betterAuth } from 'better-auth';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailVerification: {
    sendEmailVerification: async ({ user, token, url }) => {
      try {
        // Import Resend dynamically since we're in a .js file
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
          console.log("📧 Email verification (demo mode):", { user: user.email, token, url });
          console.log("⚠️  Add RESEND_API_KEY to .env to enable real email sending");
          return;
        }

        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'PyThoughts <noreply@pythoughts.dev>',
          to: [user.email],
          subject: 'Welcome to PyThoughts - Verify Your Email',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fafafa; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #3776ab 0%, #ffd43b 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">PyThoughts</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">The Python Community Platform</p>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #3776ab; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Welcome to the community! 🐍</h2>
                <p style="color: #a3a3a3; line-height: 1.6; margin: 0 0 24px; font-size: 16px;">
                  Thanks for joining PyThoughts. Please verify your email address to complete your registration.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${url}" 
                     style="display: inline-block; background: linear-gradient(135deg, #3776ab, #5094d4); 
                            color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; 
                            font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(55, 118, 171, 0.3);">
                    Verify Email Address
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0; line-height: 1.5;">
                  If you didn't create an account with PyThoughts, you can safely ignore this email.
                </p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error('❌ Error sending verification email:', error);
          throw new Error('Failed to send verification email');
        }

        console.log('✅ Verification email sent successfully:', data);
      } catch (error) {
        console.error('❌ Error in email verification:', error);
        console.log("📧 Fallback - Email verification:", { user: user.email, token, url });
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    cookiePrefix: "pythoughts",
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === "production" ? ".pythoughts.dev" : "localhost",
    },
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Note: unsafe-inline should be avoided in production
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:3001"],
      frameAncestors: ["'none'"],
    },
  },
}));

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limit
app.use(createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP'
));

// Auth rate limiting
app.use('/api/auth', createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 auth requests per windowMs
  'Too many authentication attempts'
));

// AI rate limiting
app.use('/api/ai', createRateLimit(
  60 * 1000, // 1 minute
  20, // limit each IP to 20 AI requests per minute
  'Too many AI requests'
));

// CORS configuration
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Input validation middleware
const validateInput = (schema) => (req, res, next) => {
  try {
    // Dynamically import validation (since it's a .ts file)
    req.validatedBody = req.body; // In production, use proper validation
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Better Auth routes
app.all('/api/auth/*', async (req, res) => {
  try {
    const response = await auth.handler(req);
    
    // Copy headers from the auth handler response
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    // Set status and send response
    res.status(response.status);
    
    if (response.body) {
      const text = await response.text();
      res.send(text);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Check if DeepSeek API key is configured
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
      // Return a mock response for demo purposes
      const mockResponses = [
        "🐍 Hello! I'm Viper, your AI Python assistant! I'd love to help you with your Python questions, but my API key isn't configured yet. Add your DEEPSEEK_API_KEY to the .env file to enable real AI responses!",
        "I'm here to help with Python code analysis, debugging, and best practices! Once configured with DeepSeek API, I can provide intelligent responses to your programming questions.",
        "Feel free to ask about Python syntax, libraries like Django, Flask, pandas, numpy, or any other Python-related topics. I'm excited to help you code better!",
        "I can help review your code, suggest improvements, explain concepts, and even generate code examples. Just need that API key to get started! 🚀"
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return res.json({
        response: randomResponse,
        isDemo: true
      });
    }

    // Import DeepSeek client dynamically
    const { getDeepSeekClient } = await import('./src/lib/deepseek.js');
    const deepseek = getDeepSeekClient();
    
    const response = await deepseek.chatWithViper(message, conversationHistory);
    
    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      message: error.message
    });
  }
});

// Code Analysis endpoint
app.post('/api/ai/analyze-code', async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required and must be a string' });
    }

    // Check if DeepSeek API key is configured
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
      return res.json({
        analysis: `🐍 **Code Analysis (Demo Mode)**

I'd love to analyze your ${language} code, but my DeepSeek API key isn't configured yet! 

**Your code:**
\`\`\`${language}
${code}
\`\`\`

**What I could help with once configured:**
- 🔍 Identify potential bugs and logic errors
- ⚡ Suggest performance improvements  
- 🐍 Recommend more Pythonic approaches
- 🔒 Highlight security concerns
- 📚 Explain complex concepts
- 💡 Provide refactoring suggestions

Add your DEEPSEEK_API_KEY to the .env file to enable real AI code analysis!`,
        isDemo: true
      });
    }

    // Import DeepSeek client dynamically
    const { getDeepSeekClient } = await import('./src/lib/deepseek.js');
    const deepseek = getDeepSeekClient();
    
    const analysis = await deepseek.analyzeCode(code, language);
    
    res.json({
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code',
      message: error.message
    });
  }
});

// Code Generation endpoint
app.post('/api/ai/generate-code', async (req, res) => {
  try {
    const { description, language = 'python' } = req.body;
    
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required and must be a string' });
    }

    // Check if DeepSeek API key is configured
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
      return res.json({
        code: `# 🐍 Generated ${language.charAt(0).toUpperCase() + language.slice(1)} Code (Demo Mode)
# Request: ${description}

def demo_function():
    """
    This is a demo response! To get real AI-generated code:
    1. Sign up for DeepSeek API
    2. Add your API key to .env file as DEEPSEEK_API_KEY
    3. Restart the server
    
    Then I can generate production-ready code for: ${description}
    """
    print("Hello from Viper! Configure my API key to generate real code! 🚀")
    return "Demo mode active"

if __name__ == "__main__":
    demo_function()`,
        isDemo: true
      });
    }

    // Import DeepSeek client dynamically
    const { getDeepSeekClient } = await import('./src/lib/deepseek.js');
    const deepseek = getDeepSeekClient();
    
    const code = await deepseek.generateCodeSuggestion(description, language);
    
    res.json({
      code,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate code',
      message: error.message
    });
  }
});

// Posts API endpoints
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    // TODO: Get user ID from session
    const { content, code, language } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' });
    }

    // For now, create posts without user authentication
    // In a real app, you'd get the user ID from the authenticated session
    const post = await prisma.post.create({
      data: {
        content,
        code: code || null,
        language: language || null,
        authorId: 'demo-user-id' // TODO: Replace with actual user ID
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Comments API endpoints
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const comments = await prisma.comment.findMany({
      where: {
        postId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId: parentId || null,
        authorId: 'demo-user-id' // TODO: Replace with actual user ID
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Likes API endpoints
app.post('/api/posts/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = 'demo-user-id'; // TODO: Get from session
    
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
      res.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Users API endpoints
app.get('/api/users/me', async (req, res) => {
  try {
    // TODO: Get user from session
    res.json({
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@pythoughts.dev',
      username: 'demo_user',
      bio: 'Python enthusiast and community member',
      skills: '["Python", "JavaScript", "React", "FastAPI"]'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Create demo data endpoint for development
app.post('/api/demo/seed', async (req, res) => {
  try {
    // Create demo user
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@pythoughts.dev' },
      update: {},
      create: {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@pythoughts.dev',
        username: 'demo_user',
        bio: 'Python enthusiast and community member',
        skills: '["Python", "JavaScript", "React", "FastAPI"]',
        emailVerified: new Date()
      }
    });

    // Create demo posts
    const demoPosts = [
      {
        content: "Just discovered this amazing Python trick for list comprehensions! 🐍",
        code: `# Instead of this:
result = []
for item in items:
    if condition(item):
        result.append(transform(item))

# Use this:
result = [transform(item) for item in items if condition(item)]`,
        language: "python"
      },
      {
        content: "Working on a new FastAPI project and loving the automatic API documentation! The developer experience is incredible.",
        code: null,
        language: null
      },
      {
        content: "Quick tip: Use f-strings for better performance and readability in Python 3.6+",
        code: `# Old way
name = "Python"
message = "Hello, {}! You are {} years old.".format(name, age)

# New way (faster and cleaner)
message = f"Hello, {name}! You are {age} years old."`,
        language: "python"
      }
    ];

    for (const postData of demoPosts) {
      await prisma.post.upsert({
        where: { id: `demo-post-${demoPosts.indexOf(postData)}` },
        update: {},
        create: {
          id: `demo-post-${demoPosts.indexOf(postData)}`,
          ...postData,
          authorId: demoUser.id
        }
      });
    }

    res.json({ message: 'Demo data created successfully', userId: demoUser.id });
  } catch (error) {
    console.error('Seed demo data error:', error);
    res.status(500).json({ error: 'Failed to create demo data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Auth endpoints available at http://localhost:${PORT}/api/auth/*`);
  console.log(`🤖 AI endpoints available at http://localhost:${PORT}/api/ai/*`);
  console.log(`📝 Posts API available at http://localhost:${PORT}/api/posts`);
  console.log(`👤 Users API available at http://localhost:${PORT}/api/users/*`);
  console.log(`🌱 Seed demo data: POST http://localhost:${PORT}/api/demo/seed`);
});