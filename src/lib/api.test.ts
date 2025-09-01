import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getPosts', () => {
    it('fetches posts successfully', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          content: 'Test post',
          author: { name: 'Test User' },
          _count: { likes: 5, comments: 2 },
        },
      ]

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      } as Response)

      const posts = await api.getPosts()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/posts', {
        headers: { 'Content-Type': 'application/json' },
      })
      expect(posts).toEqual(mockPosts)
    })

    it('throws error when API fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      } as Response)

      await expect(api.getPosts()).rejects.toThrow('API Error: 500 - Internal Server Error')
    })
  })

  describe('createPost', () => {
    it('creates a post successfully', async () => {
      const newPost = {
        content: 'New test post',
        code: 'print("Hello")',
        language: 'python',
      }

      const mockResponse = {
        id: 'new-post',
        ...newPost,
        author: { name: 'Test User' },
        _count: { likes: 0, comments: 0 },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.createPost(newPost)

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('likePost', () => {
    it('likes a post successfully', async () => {
      const mockResponse = { liked: true }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.likePost('post-1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/posts/post-1/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('chatWithAI', () => {
    it('sends chat message successfully', async () => {
      const mockResponse = {
        response: 'AI response',
        timestamp: '2024-01-01T10:00:00Z',
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.chatWithAI({
        message: 'Hello AI',
        conversationHistory: [],
      })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello AI',
          conversationHistory: [],
        }),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('analyzeCode', () => {
    it('analyzes code successfully', async () => {
      const mockResponse = {
        analysis: 'Code analysis result',
        timestamp: '2024-01-01T10:00:00Z',
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.analyzeCode({
        code: 'print("Hello")',
        language: 'python',
      })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/ai/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'print("Hello")',
          language: 'python',
        }),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('generateCode', () => {
    it('generates code successfully', async () => {
      const mockResponse = {
        code: 'print("Generated code")',
        timestamp: '2024-01-01T10:00:00Z',
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.generateCode({
        description: 'Create a hello world function',
        language: 'python',
      })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'Create a hello world function',
          language: 'python',
        }),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('seedDemoData', () => {
    it('creates demo data successfully', async () => {
      const mockResponse = {
        message: 'Demo data created',
        userId: 'demo-user',
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.seedDemoData()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/demo/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('error handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(api.getPosts()).rejects.toThrow('Network error')
    })

    it('handles non-JSON responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      } as Response)

      await expect(api.getPosts()).rejects.toThrow('API Error: 404 - Not Found')
    })
  })
})