import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API responses for testing
export const handlers = [
  // Auth API mocks
  http.post('http://localhost:3001/api/auth/sign-in', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'mock-token'
    })
  }),

  // Posts API mocks
  http.get('http://localhost:3001/api/posts', () => {
    return HttpResponse.json([
      {
        id: 'test-post-1',
        content: 'Test post content',
        code: 'print("Hello, World!")',
        language: 'python',
        createdAt: '2024-01-01T10:00:00Z',
        author: {
          id: 'test-user-id',
          name: 'Test User',
          username: 'testuser',
          image: null
        },
        _count: {
          likes: 5,
          comments: 2
        }
      }
    ])
  }),

  http.post('http://localhost:3001/api/posts', async ({ request }) => {
    const body = await request.json() as { content: string; code?: string; language?: string }
    return HttpResponse.json({
      id: 'new-post-id',
      content: body.content,
      code: body.code,
      language: body.language,
      createdAt: new Date().toISOString(),
      author: {
        id: 'test-user-id',
        name: 'Test User',
        username: 'testuser',
        image: null
      },
      _count: {
        likes: 0,
        comments: 0
      }
    })
  }),

  http.post('http://localhost:3001/api/posts/:id/like', ({ params }) => {
    return HttpResponse.json({ liked: true })
  }),

  // AI API mocks
  http.post('http://localhost:3001/api/ai/chat', async ({ request }) => {
    const body = await request.json() as { message: string }
    return HttpResponse.json({
      response: `Mock AI response to: ${body.message}`,
      isDemo: true,
      timestamp: new Date().toISOString()
    })
  }),

  http.post('http://localhost:3001/api/ai/analyze-code', async ({ request }) => {
    const body = await request.json() as { code: string }
    return HttpResponse.json({
      analysis: `Mock code analysis for: ${body.code.substring(0, 50)}...`,
      isDemo: true,
      timestamp: new Date().toISOString()
    })
  }),

  // Generate code endpoint
  http.post('http://localhost:3001/api/ai/generate-code', async ({ request }) => {
    const body = await request.json() as { description: string; language: string }
    return HttpResponse.json({
      code: `# Generated code for: ${body.description}\nprint("Hello World!")`,
      isDemo: true,
      timestamp: new Date().toISOString()
    })
  }),

  // Auth session endpoint
  http.get('http://localhost:3001/api/auth/get-session', () => {
    return HttpResponse.json({
      user: null,
      session: null
    })
  }),

  // Demo data endpoint
  http.post('http://localhost:3001/api/demo/seed', () => {
    return HttpResponse.json({
      message: 'Demo data created successfully',
      userId: 'demo-user-id'
    })
  }),
]

export const server = setupServer(...handlers)