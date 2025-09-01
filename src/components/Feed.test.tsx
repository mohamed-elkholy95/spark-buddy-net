import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Feed } from './Feed'
import { render } from '@/test/utils'

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    getPosts: vi.fn(),
    seedDemoData: vi.fn(() => Promise.resolve({ message: 'Success', userId: 'demo' })),
  },
  queryKeys: {
    posts: ['posts'],
  },
}))

describe('Feed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.getPosts).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<Feed />)
    
    expect(screen.getByText('Loading posts...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays posts when data is loaded', async () => {
    const { api } = await import('@/lib/api')
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Test post content',
        code: 'print("Hello")',
        language: 'python',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        author: {
          id: 'user-1',
          name: 'Test User',
          username: 'testuser',
        },
        _count: { likes: 5, comments: 2 },
      },
    ]
    
    vi.mocked(api.getPosts).mockResolvedValue(mockPosts)
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('Test post content')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
  })

  it('shows empty state when no posts exist', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.getPosts).mockResolvedValue([])
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('No posts yet')).toBeInTheDocument()
      expect(screen.getByText('Create Demo Posts')).toBeInTheDocument()
    })
  })

  it('shows error state when API fails', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.getPosts).mockRejectedValue(new Error('API Error'))
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('creates demo data when button is clicked', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.getPosts).mockResolvedValue([])
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('Create Demo Posts')).toBeInTheDocument()
    })
    
    const createDemoButton = screen.getByText('Create Demo Posts')
    await userEvent.click(createDemoButton)
    
    await waitFor(() => {
      expect(api.seedDemoData).toHaveBeenCalled()
    })
  })

  it('refreshes posts when refresh button is clicked', async () => {
    const { api } = await import('@/lib/api')
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Test post',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        author: { id: 'user-1', name: 'Test User', username: 'testuser' },
        _count: { likes: 0, comments: 0 },
      },
    ]
    vi.mocked(api.getPosts).mockResolvedValue(mockPosts)
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })
    
    const refreshButton = screen.getByText('Refresh')
    await userEvent.click(refreshButton)
    
    // getPosts should be called again (initially + refresh)
    expect(api.getPosts).toHaveBeenCalledTimes(2)
  })

  it('displays post count correctly', async () => {
    const { api } = await import('@/lib/api')
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Post 1',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        author: { id: 'user-1', name: 'User 1', username: 'user1' },
        _count: { likes: 0, comments: 0 },
      },
      {
        id: 'post-2',
        content: 'Post 2',
        createdAt: '2024-01-01T11:00:00Z',
        updatedAt: '2024-01-01T11:00:00Z',
        author: { id: 'user-2', name: 'User 2', username: 'user2' },
        _count: { likes: 0, comments: 0 },
      },
    ]
    vi.mocked(api.getPosts).mockResolvedValue(mockPosts)
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('2 posts')).toBeInTheDocument()
    })
  })

  it('shows singular post count for one post', async () => {
    const { api } = await import('@/lib/api')
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Single post',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        author: { id: 'user-1', name: 'User 1', username: 'user1' },
        _count: { likes: 0, comments: 0 },
      },
    ]
    vi.mocked(api.getPosts).mockResolvedValue(mockPosts)
    
    render(<Feed />)
    
    await waitFor(() => {
      expect(screen.getByText('1 post')).toBeInTheDocument()
    })
  })
})