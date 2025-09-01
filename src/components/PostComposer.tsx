import { useState } from "react";
import { Code, Image, Smile, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api, Post } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import snakeMascot from "@/assets/professional-snake.jpg";

interface PostComposerProps {
  onPostCreated?: (post: Post) => void;
}

export const PostComposer = ({ onPostCreated }: PostComposerProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [codeContent, setCodeContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() && !codeContent.trim()) {
      toast.error("Please write something to share!");
      return;
    }

    if (!session) {
      toast.error("Please sign in to create a post");
      return;
    }

    setIsPosting(true);

    try {
      const newPost = await api.createPost({
        content: content.trim(),
        code: codeContent.trim() || undefined,
        language: codeContent.trim() ? codeLanguage : undefined,
      });

      // Reset form
      setContent("");
      setCodeContent("");
      setShowCodeBlock(false);
      setCodeLanguage("python");

      // Notify parent component
      onPostCreated?.(newPost);

      toast.success("Post shared successfully! 🐍");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="w-full python-glow">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-python-blue/20">
            <AvatarImage src={session?.user?.image || snakeMascot} alt="Your avatar" />
            <AvatarFallback className="bg-gradient-to-r from-python-blue to-python-blue/80 text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
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
              <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-python-blue">
                <div className="flex items-center gap-2 mb-2">
                  <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="bash">Bash</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="# Your code here..."
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
              disabled={isPosting}
              className={`gap-2 transition-bounce ${
                showCodeBlock ? 'text-python-blue bg-python-blue/10' : 'text-muted-foreground'
              }`}
            >
              <Code className="h-4 w-4" />
              Code
            </Button>
            <Button variant="ghost" size="sm" disabled className="gap-2 text-muted-foreground/50 transition-bounce">
              <Image className="h-4 w-4" />
              Image
            </Button>
            <Button variant="ghost" size="sm" disabled className="gap-2 text-muted-foreground/50 transition-bounce">
              <Smile className="h-4 w-4" />
              Emoji
            </Button>
          </div>
          
          <Button
            onClick={handlePost}
            disabled={(!content.trim() && !codeContent.trim()) || isPosting || !session}
            className="bg-gradient-to-r from-python-blue to-python-blue/80 hover:from-python-blue/90 hover:to-python-blue/70 text-white gap-2"
          >
            {isPosting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isPosting ? "Posting..." : !session ? "Sign in to post" : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};