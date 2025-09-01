import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./LoginForm"
import { SignUpForm } from "./SignUpForm"

interface AuthDialogProps {
  children: React.ReactNode
  defaultTab?: "login" | "signup"
}

export function AuthDialog({ children, defaultTab = "login" }: AuthDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header with Python theme */}
        <div className="bg-gradient-to-r from-python-blue to-python-gold p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C8.5 0 5.5 1.5 5.5 4v4h7v1H4c-2.2 0-4 1.8-4 4s1.8 4 4 4h2v-3c0-2.2 1.8-4 4-4h7c2.2 0 4-1.8 4-4V4c0-2.5-3-4-6.5-4H12z" fill="#3776ab"/>
                <path d="M12 24c3.5 0 6.5-1.5 6.5-4v-4h-7v-1h8.5c2.2 0 4-1.8 4-4s-1.8-4-4-4H18v3c0 2.2-1.8 4-4 4H7c-2.2 0-4 1.8-4 4v4c0 2.5 3 4 6.5 4H12z" fill="#ffd43b"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">PyThoughts</h2>
          </div>
          <p className="text-white/90 text-sm">Join the Python community</p>
        </div>

        {/* Auth Forms */}
        <div className="p-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-python-blue data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-python-blue data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <LoginForm onSuccess={() => setOpen(false)} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignUpForm onSuccess={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}