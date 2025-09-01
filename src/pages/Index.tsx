import { Header } from "@/components/Header";
import { Feed } from "@/components/Feed";
import { ChatSidebar } from "@/components/ChatSidebar";
import heroImage from "@/assets/python-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-4 bounce-in">
                Welcome to PyConnect
              </h1>
              <p className="text-lg lg:text-xl text-primary-foreground/90 mb-6">
                The friendliest Python community platform with AI-powered assistance, 
                code sharing, and real-time collaboration. 🐍✨
              </p>
            </div>
            <div className="flex-1 max-w-md lg:max-w-lg">
              <img 
                src={heroImage} 
                alt="Python Community Hero" 
                className="w-full h-auto rounded-xl shadow-2xl python-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            <Feed />
          </div>
          <div className="hidden lg:block">
            <ChatSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
