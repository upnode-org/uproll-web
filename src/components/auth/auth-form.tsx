"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"

type AuthMode = "signin" | "signup"

interface AuthFormProps {
  initialMode: AuthMode
  onSubmit: (email: string, password: string) => void
}

export function AuthForm({ initialMode }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual authentication logic
    console.log(`${mode === "signin" ? "Signing in" : "Signing up"} with:`, email, password)
    router.push("/config/view")
  }

  const handleGithubAuth = () => {
    // TODO: Implement GitHub OAuth authentication
    console.log(`${mode === "signin" ? "Sign in" : "Sign up"} with GitHub`)
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={handleGithubAuth}>
        <GithubIcon className="mr-2 h-4 w-4" />
        {mode === "signin" ? "Sign In with GitHub" : "Sign Up with GitHub"}
      </Button>
      <div className="text-center">
        <Button type="button" variant="link" onClick={toggleMode}>
          {mode === "signin" ? "Need an account? Sign Up" : "Already have an account? Sign In"}
        </Button>
      </div>
    </form>
  )
}

