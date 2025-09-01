const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  username?: string;
  image?: string;
  bio?: string;
  skills?: string;
}

export interface Post {
  id: string;
  content: string;
  code?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  _count: {
    likes: number;
    replies: number;
  };
}

// API client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Posts API
  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts');
  }

  async createPost(data: { 
    content: string; 
    code?: string; 
    language?: string; 
  }): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string): Promise<{ liked: boolean }> {
    return this.request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // Comments API
  async getComments(postId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, data: { 
    content: string; 
    parentId?: string; 
  }): Promise<Comment> {
    return this.request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users API
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // AI API
  async chatWithAI(data: {
    message: string;
    conversationHistory?: Array<{ role: string; content: string }>;
  }): Promise<{ response: string; isDemo?: boolean; timestamp: string }> {
    return this.request<{ response: string; isDemo?: boolean; timestamp: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeCode(data: {
    code: string;
    language?: string;
  }): Promise<{ analysis: string; isDemo?: boolean; timestamp: string }> {
    return this.request<{ analysis: string; isDemo?: boolean; timestamp: string }>('/ai/analyze-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCode(data: {
    description: string;
    language?: string;
  }): Promise<{ code: string; isDemo?: boolean; timestamp: string }> {
    return this.request<{ code: string; isDemo?: boolean; timestamp: string }>('/ai/generate-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Demo API
  async seedDemoData(): Promise<{ message: string; userId: string }> {
    return this.request<{ message: string; userId: string }>('/demo/seed', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// React Query hooks for common operations
export const queryKeys = {
  posts: ['posts'] as const,
  comments: (postId: string) => ['comments', postId] as const,
  currentUser: ['users', 'me'] as const,
} as const;