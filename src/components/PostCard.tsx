import { Heart, MessageCircle, Share, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import snakeMascot from "@/assets/professional-snake.jpg";

interface PostCardProps {
  author: string;
  handle: string;
  time: string;
  content: string;
  code?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const PostCard = ({ 
  author, 
  handle, 
  time, 
  content, 
  code, 
  likes, 
  comments, 
  isLiked = false 
}: PostCardProps) => {
  return (
    <Card className="w-full bounce-in python-glow hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={snakeMascot} alt={author} />
              <AvatarFallback className="bg-gradient-python text-primary-foreground">
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
          <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
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
              className={`gap-2 hover:text-red-500 transition-bounce ${
                isLiked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likes}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 hover:text-primary transition-bounce">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="hover:text-accent transition-bounce">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};