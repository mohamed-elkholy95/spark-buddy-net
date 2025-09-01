interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepSeekClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.deepseek.com') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async chat(messages: DeepSeekMessage[], options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  } = {}): Promise<DeepSeekResponse> {
    const {
      model = 'deepseek-coder',
      temperature = 0.7,
      max_tokens = 2048,
      stream = false
    } = options;

    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  async analyzeCode(code: string, language: string = 'python'): Promise<string> {
    const systemPrompt = `You are Viper, an expert Python developer and code reviewer for PyThoughts, a Python community platform. 

Your role:
- Analyze Python code for best practices, performance, and potential issues
- Provide constructive feedback with specific suggestions
- Explain concepts in a friendly, educational manner
- Focus on Pythonic solutions and modern best practices
- Always be helpful and encouraging

Code analysis guidelines:
- Point out potential bugs or logic errors
- Suggest performance improvements
- Recommend more Pythonic approaches
- Highlight security concerns if any
- Explain complex concepts clearly
- Provide examples when helpful

Keep responses concise but thorough. Use a friendly, professional tone.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Please analyze this ${language} code and provide feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ];

    const response = await this.chat(messages, {
      temperature: 0.3, // Lower temperature for more consistent code analysis
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not analyze the code at this time.';
  }

  async chatWithViper(userMessage: string, conversationHistory: DeepSeekMessage[] = []): Promise<string> {
    const systemPrompt = `You are Viper, the friendly AI assistant for PyThoughts, a Python community platform.

Your personality:
- Expert Python developer with deep knowledge of the ecosystem
- Helpful, encouraging, and patient teacher
- Enthusiastic about Python and programming best practices
- Professional yet approachable in tone
- Quick to provide practical examples and solutions

Your capabilities:
- Answer Python programming questions
- Provide code examples and explanations
- Review and suggest improvements to code
- Help with debugging and problem-solving
- Discuss Python libraries, frameworks, and tools
- Share best practices and design patterns
- Explain complex concepts simply

Guidelines:
- Keep responses helpful and on-topic
- Use code examples when appropriate
- Be encouraging to learners at all levels
- If unsure, acknowledge limitations honestly
- Focus on practical, actionable advice
- Use markdown formatting for code snippets

Remember: You're here to help the Python community learn and grow!`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, {
      temperature: 0.8, // Higher temperature for more conversational responses
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Sorry, I encountered an error. Please try again.';
  }

  async generateCodeSuggestion(description: string, language: string = 'python'): Promise<string> {
    const systemPrompt = `You are Viper, an expert Python developer. Generate clean, well-documented Python code based on user descriptions.

Guidelines:
- Write production-ready, Pythonic code
- Include proper error handling where appropriate
- Add clear comments and docstrings
- Follow PEP 8 style guidelines
- Use type hints when beneficial
- Provide complete, runnable examples
- Explain key concepts in comments

Format your response with:
1. Brief explanation of the approach
2. Complete code example
3. Usage example if applicable
4. Any important notes or considerations`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Please generate ${language} code for: ${description}`
      }
    ];

    const response = await this.chat(messages, {
      temperature: 0.4, // Lower temperature for more consistent code generation
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate code for this request.';
  }
}

// Singleton instance
let deepSeekClient: DeepSeekClient | null = null;

export function getDeepSeekClient(): DeepSeekClient {
  if (!deepSeekClient) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    
    if (!apiKey || apiKey === 'your-deepseek-api-key') {
      throw new Error('DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to your environment variables.');
    }
    
    deepSeekClient = new DeepSeekClient(apiKey, baseURL);
  }
  
  return deepSeekClient;
}

export type { DeepSeekMessage, DeepSeekResponse };