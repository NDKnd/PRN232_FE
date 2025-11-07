"use client";

import type React from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, AlertCircle } from "lucide-react";
import { useRegister } from "@/features/auth";

function RegisterContent() {
  const { registerState, updateField, handleRegister } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">MathLearn</span>
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up to start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registerState.error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {registerState.error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={registerState.username}
                onChange={(e) => updateField("username", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={registerState.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={registerState.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={registerState.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={registerState.role}
                onValueChange={(value) => updateField("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="levelId">Level *</Label>
              <Select
                value={registerState.levelId.toString()}
                onValueChange={(value) => updateField("levelId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 - Elementary Level</SelectItem>
                  <SelectItem value="2">Level 2 - Secondary Level</SelectItem>
                  <SelectItem value="3">Level 3 - High Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level (From 1 to 12)</Label>
              <Input
                id="gradeLevel"
                type="text"
                placeholder="e.g., Grade 10"
                value={registerState.gradeLevel || ""}
                onChange={(e) => updateField("gradeLevel", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={registerState.isLoading}
            >
              {registerState.isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
