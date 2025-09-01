interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class DeepSeekClient {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  private async makeRequest(messages: DeepSeekMessage[], model: string = 'deepseek-chat'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 4000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
      console.error('DeepSeek API request failed:', error);
      throw new Error(`AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async chatWithViper(message: string, conversationHistory: DeepSeekMessage[] = []): Promise<string> {
    const systemPrompt = `You are Viper, a friendly and knowledgeable Python programming assistant. You help developers with:

- Code analysis and debugging
- Best practices and design patterns
- Performance optimization
- Security considerations
- Learning and explanations

Always be helpful, encouraging, and provide practical examples. Use Python code examples when relevant.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    return this.makeRequest(messages);
  }

  async analyzeCode(code: string, language: string = 'python'): Promise<string> {
    const systemPrompt = `You are Viper, an expert code analyzer. Analyze the provided ${language} code and provide:

1. **Code Quality Assessment**: Identify potential issues, bugs, or improvements
2. **Performance Analysis**: Suggest optimizations and best practices
3. **Security Review**: Highlight any security concerns
4. **Style & Readability**: Suggest improvements for maintainability
5. **Alternative Approaches**: Show better ways to achieve the same result

Be specific, constructive, and provide code examples when helpful.`;

    const userPrompt = `Please analyze this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive analysis with actionable recommendations.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.makeRequest(messages);
  }

  async generateCodeSuggestion(description: string, language: string = 'python'): Promise<string> {
    const systemPrompt = `You are Viper, an expert ${language} developer. Generate high-quality, production-ready code based on user descriptions.

Requirements:
- Write clean, well-documented code
- Follow ${language} best practices and PEP standards
- Include proper error handling
- Add type hints where appropriate
- Provide usage examples
- Consider edge cases and performance

Always explain your approach and any important design decisions.`;

    const userPrompt = `Please generate ${language} code for: ${description}

Make sure the code is production-ready with proper documentation and error handling.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.makeRequest(messages);
  }

  async explainConcept(concept: string, language: string = 'python'): Promise<string> {
    const systemPrompt = `You are Viper, an expert programming educator. Explain ${language} concepts in a clear, engaging way.

Your explanations should:
- Start with simple, clear definitions
- Provide practical examples
- Show common use cases
- Address common misconceptions
- Include code snippets when helpful
- Be suitable for developers of all levels

Make complex topics accessible and interesting!`;

    const userPrompt = `Please explain the concept of "${concept}" in ${language}. Make it easy to understand with examples.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.makeRequest(messages);
  }
}

// Export singleton instance
let deepseekClient: DeepSeekClient | null = null;

export const getDeepSeekClient = (): DeepSeekClient => {
  if (!deepseekClient) {
    deepseekClient = new DeepSeekClient();
  }
  return deepseekClient;
};

export default DeepSeekClient;