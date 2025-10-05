"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ShieldAlert } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-lg">
            <ShieldAlert className="h-12 w-12" />
          </div>
        </div>
        <div>
          <CardTitle className="text-3xl font-bold">OpenVAS</CardTitle>
          <CardDescription className="text-base mt-2">Vulnerability Assessment System</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            <strong>Warning: Connection unencrypted</strong>
            <p className="mt-1">
              Please configure a TLS certificate for the HTTPS service or ask your administrator to do so as soon as
              possible.
            </p>
          </AlertDescription>
        </Alert>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Enter your username" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Link href="/dashboard">
            <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700">
              Sign in
            </Button>
          </Link>
        </form>

        <div className="flex justify-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-sm font-medium text-emerald-700">Community Edition</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
