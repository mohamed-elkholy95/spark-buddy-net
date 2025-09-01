import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import snakeMascot from "@/assets/professional-snake.jpg";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isAI?: boolean;
  isLoading?: boolean;
}

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "Viper",
    content: "Hello! I'm Viper, your AI assistant. I'm here to help with your Python questions. What are you working on today?",
    time: "10:30 AM",
    isAI: true
  },
  {
    id: "2",
    sender: "You",
    content: "I'm having trouble with async/await patterns. Can you help?",
    time: "10:32 AM"
  },
  {
    id: "3",
    sender: "Viper",
    content: "Absolutely! Async/await is great for I/O operations. What specific challenge are you facing?",
    time: "10:32 AM",
    isAI: true
  }
];

export const ChatSidebar = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [activeTab, setActiveTab] = useState<"ai" | "community">("ai");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!session && activeTab === "ai") {
      toast.error("Please sign in to chat with Viper");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      content: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    if (activeTab === "ai") {
      // Add loading message
      const loadingMessage: ChatMessage = {
        id: `loading-${Date.now()}`,
        sender: "Viper",
        content: "Viper is thinking...",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
        isLoading: true,
      };

      setMessages(prev => [...prev, loadingMessage]);
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:3001/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationHistory: messages
              .filter(msg => !msg.isLoading)
              .map(msg => ({
                role: msg.isAI ? 'assistant' : 'user',
                content: msg.content
              }))
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Replace loading message with actual response
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                content: data.response,
                isLoading: false,
                id: `ai-${Date.now()}`
              }
            : msg
        ));

        if (data.isDemo) {
          toast.info("Demo mode - Add DEEPSEEK_API_KEY for real AI responses!");
        }

      } catch (error) {
        console.error('Chat error:', error);
        
        // Replace loading message with error message
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again later.",
                isLoading: false,
                id: `error-${Date.now()}`
              }
            : msg
        ));

        toast.error("Failed to get AI response");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Community chat - placeholder for now
      toast.info("Community chat coming soon!");
    }
  };

  return (
    <Card className="w-80 h-[calc(100vh-5rem)] flex flex-col python-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant={activeTab === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ai")}
            className="flex-1 gap-2"
          >
            <Bot className="h-4 w-4" />
            Viper
          </Button>
          <Button
            variant={activeTab === "community" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("community")}
            className="flex-1 gap-2"
          >
            <Users className="h-4 w-4" />
            Community
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 px-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === "You" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.isAI ? snakeMascot : undefined} />
                  <AvatarFallback className={msg.isAI ? "bg-gradient-snake text-accent-foreground" : "bg-primary text-primary-foreground"}>
                    {msg.isAI ? "🤖" : msg.sender[0]}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[80%] ${msg.sender === "You" ? "text-right" : ""}`}>
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      msg.sender === "You"
                        ? "bg-gradient-to-r from-python-blue to-python-blue/80 text-white ml-auto"
                        : msg.isAI
                        ? "bg-gradient-to-r from-secondary to-secondary/80 border border-python-blue/20"
                        : "bg-muted"
                    }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-3 w-3 border border-current border-r-transparent rounded-full" />
                        <span className="text-muted-foreground">Viper is thinking...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {activeTab === "ai" && (
              <div className="text-center py-4">
                <Badge variant="secondary" className="bg-python-blue/10 text-python-blue border-python-blue/30">
                  {session ? "Viper is online and ready to help! 🐍" : "Sign in to chat with Viper 🔒"}
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder={
              activeTab === "ai" 
                ? "Ask Viper..." 
                : "Message the community..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || (!session && activeTab === "ai")}
            size="icon"
            className="bg-gradient-to-r from-python-blue to-python-blue/80 hover:from-python-blue/90 hover:to-python-blue/70 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};