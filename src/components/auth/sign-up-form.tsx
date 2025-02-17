"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement sign up logic
    console.log("Sign up with:", email, password)
    router.push("/config/view")
  }

  const handleGitHubSignUp = () => {
    // TODO: Implement GitHub OAuth sign up
    console.log("Sign up with GitHub")
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
        Sign Up
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={handleGitHubSignUp}>
        <GithubIcon className="mr-2 h-4 w-4" />
        Sign Up with GitHub
      </Button>
    </form>
  )
}

