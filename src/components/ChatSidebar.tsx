import { useState } from "react";
import { MessageCircle, Send, Bot, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import snakeMascot from "@/assets/professional-snake.jpg";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isAI?: boolean;
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
  const [message, setMessage] = useState("");
  const [messages] = useState<ChatMessage[]>(sampleMessages);
  const [activeTab, setActiveTab] = useState<"ai" | "community">("ai");

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage("");
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
        <ScrollArea className="flex-1 pr-4">
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
                        ? "bg-primary text-primary-foreground ml-auto"
                        : msg.isAI
                        ? "bg-accent/20 text-accent-foreground border border-accent/30"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {activeTab === "ai" && (
              <div className="text-center py-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/30">
                  Viper is online and ready to help! 🐍
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
            disabled={!message.trim()}
            size="icon"
            className="bg-gradient-python text-primary-foreground python-glow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};