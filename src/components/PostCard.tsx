import { useState } from "react";
import { Heart, MessageCircle, Share, MoreVertical, Bot } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import snakeMascot from "@/assets/professional-snake.jpg";

interface PostCardProps {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  code?: string;
  language?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  avatar?: string;
}

export const PostCard = ({ 
  id,
  author, 
  handle, 
  time, 
  content, 
  code,
  language,
  likes: initialLikes, 
  comments, 
  isLiked = false,
  avatar
}: PostCardProps) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!session) {
      toast.error("Please sign in to like posts");
      return;
    }

    setIsLiking(true);
    try {
      const result = await api.likePost(id);
      setLiked(result.liked);
      setLikes(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code) return;
    
    try {
      toast.info("Analyzing code with Viper...");
      const result = await api.analyzeCode({ code, language });
      
      // For now, just show a toast with truncated analysis
      const preview = result.analysis.substring(0, 100) + (result.analysis.length > 100 ? "..." : "");
      toast.success(`Code analysis ready: ${preview}`);
      
      if (result.isDemo) {
        toast.info("Demo mode - Add DEEPSEEK_API_KEY for full AI analysis!");
      }
    } catch (error) {
      console.error("Failed to analyze code:", error);
      toast.error("Failed to analyze code");
    }
  };

  return (
    <Card className="w-full bounce-in python-glow hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-python-blue/20">
              <AvatarImage src={avatar || snakeMascot} alt={author} />
              <AvatarFallback className="bg-gradient-to-r from-python-blue to-python-blue/80 text-white">
                {author[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{author}</h3>
              <p className="text-xs text-muted-foreground">@{handle} • {time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">&gt;_ {content} &lt;</p>
        
        {code && (
          <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-python-blue">
            <div className="flex items-center justify-between mb-2">
              {language && (
                <Badge variant="secondary" className="text-xs bg-python-blue/10 text-python-blue border-python-blue/20">
                  {language}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAnalyzeCode}
                className="h-6 px-2 text-xs text-python-blue hover:text-python-blue/80 hover:bg-python-blue/10"
              >
                <Bot className="h-3 w-3 mr-1" />
                Analyze with Viper
              </Button>
            </div>
            <pre className="text-xs font-mono text-foreground overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              disabled={isLiking || !session}
              className={`gap-2 hover:text-red-500 transition-bounce ${
                liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likes}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 hover:text-python-blue transition-bounce">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="hover:text-python-gold transition-bounce">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};