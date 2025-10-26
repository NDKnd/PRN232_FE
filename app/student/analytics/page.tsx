"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Download, Share2 } from "lucide-react"

export default function StudentAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Analytics</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">7 day streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topics Mastered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Algebra, Statistics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <AnalyticsDashboard role="student" />

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges and milestones you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🔥", label: "7-Day Streak", earned: true },
              { icon: "⭐", label: "Perfect Score", earned: true },
              { icon: "🎯", label: "100 Quizzes", earned: false },
              { icon: "🏆", label: "Top Performer", earned: false },
            ].map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center ${
                  achievement.earned
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-muted/50 border border-border opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium text-foreground">{achievement.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Personalized suggestions for improvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Focus on Calculus - your weakest topic with 62% average",
            "You're doing great in Algebra! Try harder problems",
            "Increase study time to 15 hours per week for faster progress",
            "Review Geometry Proofs - common mistakes detected",
          ].map((rec, i) => (
            <div key={i} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-foreground">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
