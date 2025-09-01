import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from './PostCard'
import { render, mockSession } from '@/test/utils'

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(() => ({ data: null })),
}))

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    likePost: vi.fn(() => Promise.resolve({ liked: true })),
    analyzeCode: vi.fn(() => Promise.resolve({ 
      analysis: 'Mock analysis result', 
      isDemo: true 
    })),
  },
}))

const mockPost = {
  id: 'test-post-1',
  author: 'John Doe',
  handle: 'johndoe',
  time: '2 hours ago',
  content: 'This is a test post about Python programming',
  code: 'print("Hello, World!")',
  language: 'python',
  likes: 5,
  comments: 2,
  isLiked: false,
}

describe('PostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders post content correctly', () => {
    render(<PostCard {...mockPost} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('@johndoe • 2 hours ago')).toBeInTheDocument()
    expect(screen.getByText(/This is a test post about Python programming/)).toBeInTheDocument()
    expect(screen.getByText('print("Hello, World!")')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // likes count
    expect(screen.getByText('2')).toBeInTheDocument() // comments count
  })

  it('displays language badge when code is present', () => {
    render(<PostCard {...mockPost} />)
    
    expect(screen.getByText('python')).toBeInTheDocument()
  })

  it('shows "Analyze with Viper" button for code blocks', () => {
    render(<PostCard {...mockPost} />)
    
    expect(screen.getByText('Analyze with Viper')).toBeInTheDocument()
  })

  it('does not show code block when no code is provided', () => {
    const postWithoutCode = { ...mockPost, code: undefined, language: undefined }
    render(<PostCard {...postWithoutCode} />)
    
    expect(screen.queryByText('python')).not.toBeInTheDocument()
    expect(screen.queryByText('Analyze with Viper')).not.toBeInTheDocument()
  })

  it('handles like button click when user is authenticated', async () => {
    const { api } = await import('@/lib/api')
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    const user = userEvent.setup()
    render(<PostCard {...mockPost} />)
    
    const likeButton = screen.getByRole('button', { name: /5/ }) // Button with likes count
    await user.click(likeButton)
    
    await waitFor(() => {
      expect(api.likePost).toHaveBeenCalledWith('test-post-1')
    })
  })

  it('handles code analysis click', async () => {
    const { api } = await import('@/lib/api')
    const user = userEvent.setup()
    render(<PostCard {...mockPost} />)
    
    const analyzeButton = screen.getByText('Analyze with Viper')
    await user.click(analyzeButton)
    
    await waitFor(() => {
      expect(api.analyzeCode).toHaveBeenCalledWith({
        code: 'print("Hello, World!")',
        language: 'python'
      })
    })
  })

  it('updates likes count after successful like', async () => {
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    const user = userEvent.setup()
    render(<PostCard {...mockPost} />)
    
    const likeButton = screen.getByRole('button', { name: /5/ })
    await user.click(likeButton)
    
    // Should increment likes count
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument()
    })
  })

  it('shows correct visual state for liked posts', () => {
    const likedPost = { ...mockPost, isLiked: true }
    render(<PostCard {...likedPost} />)
    
    const heartIcon = screen.getByRole('button', { name: /5/ }).querySelector('svg')
    expect(heartIcon).toHaveClass('fill-current')
  })

  it('displays user avatar when provided', () => {
    const postWithAvatar = { ...mockPost, avatar: 'https://example.com/avatar.jpg' }
    render(<PostCard {...postWithAvatar} />)
    
    const avatar = screen.getByRole('img', { name: 'John Doe' })
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })
})