"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<
    "teacher" | "student" | null
  >(null);

  const handleRoleSelect = (role: "teacher" | "student") => {
    setSelectedRole(role);
    // Navigate to login with role
    window.location.href = `/login?role=${role}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">MathLearn</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-Powered Math Education Platform
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Teacher Card */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
            onClick={() => handleRoleSelect("teacher")}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Teacher</CardTitle>
              </div>
              <CardDescription>Create and manage lessons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Create and edit lesson plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Manage question bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>View student analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Export lesson plans</span>
                </li>
              </ul>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:border-accent"
            onClick={() => handleRoleSelect("student")}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Student</CardTitle>
              </div>
              <CardDescription>Practice and learn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Access practice quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Get AI-powered feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Track your progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>View personalized recommendations</span>
                </li>
              </ul>
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure • AI-Powered • Educational</p>
        </div>
      </div>
    </div>
  );
}
