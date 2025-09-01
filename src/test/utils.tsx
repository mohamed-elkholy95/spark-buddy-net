import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          {children}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Mock session hook for testing
export const mockSession = (user?: Record<string, unknown>) => {
  const useSessionMock = () => ({
    data: user ? {
      user,
      expires: '2024-12-31',
    } : null,
    isLoading: false,
  })
  
  return useSessionMock
}

// Mock API responses
export const mockApiSuccess = (data: Record<string, unknown>) => {
  return Promise.resolve({ json: () => Promise.resolve(data), ok: true })
}

export const mockApiError = (error: string) => {
  return Promise.reject(new Error(error))
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }