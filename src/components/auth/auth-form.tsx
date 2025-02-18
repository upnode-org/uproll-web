"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

type AuthMode = "signin" | "signup"

interface AuthFormProps {
  initialMode: AuthMode,
}

export function AuthForm({ initialMode }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      // Use NextAuth's signIn method for the credentials provider
      const res = await signIn("credentials", {
        redirect: true,
        email,
        password,
      });
      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
      }
    } else {
      // Send signup request to the server
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        router.push("/auth/signin");
      }
    }
  }

  const handleGithubAuth = () => {
    // TODO: Implement GitHub OAuth authentication
    console.log(`${mode === "signin" ? "Sign in" : "Sign up"} with GitHub`)
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">{mode === "signin" ? "Sign In" : "Sign Up"}</h1>
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
    </>
  )
}

