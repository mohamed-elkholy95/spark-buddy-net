import { MessageCircle, Plus, Bot, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSession, signOut } from "@/lib/auth-client";
import snakeMascot from "@/assets/professional-snake.jpg";

export const Header = () => {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src={snakeMascot} 
            alt="PyThoughts Professional Snake Mascot" 
            className="h-8 w-8 rounded-full snake-wiggle"
          />
          <h1 className="text-xl font-bold gradient-python bg-clip-text text-transparent">
            PyThoughts
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, users, or get Viper's help..."
              className="pl-9 bg-muted/50 border-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
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
                className="bg-gradient-to-r from-python-blue to-python-blue/80 hover:from-python-blue/90 hover:to-python-blue/70"
              >
                <Plus className="h-4 w-4 mr-1" />
                Post
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-python-blue text-white">
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-python-blue text-white">
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user?.email || ""}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bot className="mr-2 h-4 w-4" />
                    <span>AI Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <AuthDialog defaultTab="login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </AuthDialog>
              <AuthDialog defaultTab="signup">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-python-gold to-python-gold/80 hover:from-python-gold/90 hover:to-python-gold/70 text-black font-semibold"
                >
                  Sign Up
                </Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
};