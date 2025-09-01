import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostComposer } from './PostComposer'
import { render, mockSession } from '@/test/utils'

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(() => ({ data: null })),
}))

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    createPost: vi.fn(() => Promise.resolve({
      id: 'new-post',
      content: 'Test content',
      author: { name: 'Test User' },
      _count: { likes: 0, comments: 0 },
      createdAt: new Date().toISOString(),
    })),
  },
}))

describe('PostComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders composer interface correctly', () => {
    render(<PostComposer />)
    
    expect(screen.getByPlaceholderText(/What's on your Python mind/)).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
    expect(screen.getByText('Emoji')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in to post/ })).toBeInTheDocument()
  })

  it('shows code block when code button is clicked', async () => {
    render(<PostComposer />)
    
    const codeButton = screen.getByText('Code')
    await userEvent.click(codeButton)
    
    expect(screen.getByPlaceholderText(/Your code here/)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument() // Language selector
  })

  it('disables post button when not signed in', () => {
    render(<PostComposer />)
    
    const postButton = screen.getByRole('button', { name: /Sign in to post/ })
    expect(postButton).toBeDisabled()
  })

  it('enables post button when user is signed in and has content', async () => {
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    render(<PostComposer />)
    
    const textarea = screen.getByPlaceholderText(/What's on your Python mind/)
    await userEvent.type(textarea, 'Test post content')
    
    const postButton = screen.getByRole('button', { name: /Post/ })
    expect(postButton).not.toBeDisabled()
  })

  it('creates post when form is submitted', async () => {
    const { api } = await import('@/lib/api')
    const onPostCreated = vi.fn()
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    render(<PostComposer onPostCreated={onPostCreated} />)
    
    const textarea = screen.getByPlaceholderText(/What's on your Python mind/)
    await userEvent.type(textarea, 'Test post content')
    
    const postButton = screen.getByRole('button', { name: /Post/ })
    await userEvent.click(postButton)
    
    await waitFor(() => {
      expect(api.createPost).toHaveBeenCalledWith({
        content: 'Test post content',
        code: undefined,
        language: undefined,
      })
    })
    
    expect(onPostCreated).toHaveBeenCalled()
  })

  it('creates post with code when code block is filled', async () => {
    const { api } = await import('@/lib/api')
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    render(<PostComposer />)
    
    // Add content
    const textarea = screen.getByPlaceholderText(/What's on your Python mind/)
    await userEvent.type(textarea, 'Check out this code!')
    
    // Open code block
    const codeButton = screen.getByText('Code')
    await userEvent.click(codeButton)
    
    // Add code
    const codeTextarea = screen.getByPlaceholderText(/Your code here/)
    await userEvent.type(codeTextarea, 'print("Hello, World!")')
    
    // Submit
    const postButton = screen.getByRole('button', { name: /Post/ })
    await userEvent.click(postButton)
    
    await waitFor(() => {
      expect(api.createPost).toHaveBeenCalledWith({
        content: 'Check out this code!',
        code: 'print("Hello, World!")',
        language: 'python',
      })
    })
  })

  it('clears form after successful post creation', async () => {
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    render(<PostComposer />)
    
    const textarea = screen.getByPlaceholderText(/What's on your Python mind/)
    await userEvent.type(textarea, 'Test content')
    
    const postButton = screen.getByRole('button', { name: /Post/ })
    await userEvent.click(postButton)
    
    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })

  it('shows loading state while posting', async () => {
    const mockUseSession = mockSession({
      id: 'user-1',
      name: 'Test User',
    })
    
    vi.mocked(vi.importActual('@/lib/auth-client')).useSession = mockUseSession
    
    render(<PostComposer />)
    
    const textarea = screen.getByPlaceholderText(/What's on your Python mind/)
    await userEvent.type(textarea, 'Test content')
    
    const postButton = screen.getByRole('button', { name: /Post/ })
    await userEvent.click(postButton)
    
    expect(screen.getByText('Posting...')).toBeInTheDocument()
  })

  it('allows changing code language', async () => {
    render(<PostComposer />)
    
    // Open code block
    const codeButton = screen.getByText('Code')
    await userEvent.click(codeButton)
    
    // Click language selector
    const languageSelect = screen.getByRole('combobox')
    await userEvent.click(languageSelect)
    
    // Select JavaScript
    const jsOption = screen.getByText('JavaScript')
    await userEvent.click(jsOption)
    
    // Verify selection
    expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument()
  })
})