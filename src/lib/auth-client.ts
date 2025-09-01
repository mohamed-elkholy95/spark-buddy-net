import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // Our Express server
})

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession
} = authClient