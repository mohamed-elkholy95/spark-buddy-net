import { useState } from "react";
import { Code, Image, Smile, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import snakeMascot from "@/assets/professional-snake.jpg";

export const PostComposer = () => {
  const [content, setContent] = useState("");
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [codeContent, setCodeContent] = useState("");

  const handlePost = () => {
    if (content.trim() || codeContent.trim()) {
      toast.success("Post shared successfully! 🐍");
      setContent("");
      setCodeContent("");
      setShowCodeBlock(false);
    }
  };

  return (
    <Card className="w-full python-glow">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={snakeMascot} alt="Your avatar" />
            <AvatarFallback className="bg-gradient-python text-primary-foreground">
              You
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your Python mind? Share code, ask questions, or help others!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 placeholder:text-muted-foreground/70"
              rows={3}
            />
            
            {showCodeBlock && (
              <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                <Textarea
                  placeholder="# Your Python code here..."
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="font-mono text-sm bg-transparent border-0 resize-none focus-visible:ring-0"
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeBlock(!showCodeBlock)}
              className={`gap-2 transition-bounce ${
                showCodeBlock ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Code className="h-4 w-4" />
              Code
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-accent transition-bounce">
              <Image className="h-4 w-4" />
              Image
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-secondary transition-bounce">
              <Smile className="h-4 w-4" />
              Emoji
            </Button>
          </div>
          
          <Button
            onClick={handlePost}
            disabled={!content.trim() && !codeContent.trim()}
            className="bg-gradient-python text-primary-foreground gap-2 python-glow"
          >
            <Send className="h-4 w-4" />
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};