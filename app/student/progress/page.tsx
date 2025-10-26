"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Target, BookOpen } from "lucide-react"

const progressData = [
  { week: "Week 1", score: 65 },
  { week: "Week 2", score: 72 },
  { week: "Week 3", score: 78 },
  { week: "Week 4", score: 82 },
]

const topicProgress = [
  { topic: "Algebra", completed: 8, total: 10 },
  { topic: "Geometry", completed: 5, total: 10 },
  { topic: "Calculus", completed: 3, total: 10 },
  { topic: "Statistics", completed: 7, total: 10 },
]

export default function Progress() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">78%</div>
              <TrendingUp className="w-8 h-8 text-green-500/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">24</div>
              <Target className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topics Mastered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">2</div>
              <BookOpen className="w-8 h-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
          <CardDescription>Your average score over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Topic Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress</CardTitle>
          <CardDescription>Lessons completed by topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicProgress.map((topic) => (
            <div key={topic.topic}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{topic.topic}</span>
                <span className="text-sm text-muted-foreground">
                  {topic.completed}/{topic.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(topic.completed / topic.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weak Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
          <CardDescription>Topics where you need more practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { topic: "Calculus Limits", avgScore: 62, recommendation: "Review limit definition and properties" },
              { topic: "Geometry Proofs", avgScore: 68, recommendation: "Practice more proof techniques" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{item.topic}</p>
                  <span className="text-sm font-semibold text-yellow-700">{item.avgScore}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
