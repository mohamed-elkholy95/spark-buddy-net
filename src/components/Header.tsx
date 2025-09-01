import { MessageCircle, Plus, Bot, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import snakeMascot from "@/assets/snake-mascot.jpg";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src={snakeMascot} 
            alt="Python Community Snake Mascot" 
            className="h-8 w-8 rounded-full snake-wiggle"
          />
          <h1 className="text-xl font-bold gradient-python bg-clip-text text-transparent">
            PyConnect
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, users, or get AI help..."
              className="pl-9 bg-muted/50 border-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-bounce"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/20 hover:text-accent transition-bounce"
          >
            <Bot className="h-5 w-5" />
          </Button>
          <Button 
            size="sm"
            className="bg-gradient-python text-primary-foreground python-glow border-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Post
          </Button>
        </div>
      </div>
    </header>
  );
};