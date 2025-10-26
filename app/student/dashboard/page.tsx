"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Flame, Target, BookOpen, Award } from "lucide-react"

const practiceData = [
  { day: "Mon", completed: 3 },
  { day: "Tue", completed: 5 },
  { day: "Wed", completed: 2 },
  { day: "Thu", completed: 4 },
  { day: "Fri", completed: 6 },
  { day: "Sat", completed: 3 },
  { day: "Sun", completed: 4 },
]

const topicScores = [
  { name: "Algebra", value: 85 },
  { name: "Geometry", value: 72 },
  { name: "Calculus", value: 68 },
  { name: "Statistics", value: 79 },
]

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-chart-3)", "var(--color-chart-4)"]

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Learning Dashboard</h1>
        <p className="text-muted-foreground">Keep up your practice streak and improve your skills!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Practice Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">7</div>
              <Flame className="w-8 h-8 text-orange-500/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">days in a row</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">78%</div>
              <Award className="w-8 h-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weak Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">2</div>
              <BookOpen className="w-8 h-8 text-accent/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">need focus</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Practice</CardTitle>
            <CardDescription>Quizzes completed this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={practiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topic Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Scores</CardTitle>
            <CardDescription>Your performance by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicScores}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { topic: "Algebra Basics", score: 85, date: "Today" },
              { topic: "Geometry Proofs", score: 72, date: "Yesterday" },
              { topic: "Calculus Limits", score: 68, date: "2 days ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{activity.topic}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <div className="text-lg font-bold text-primary">{activity.score}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Practice?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary/90">Start New Quiz</Button>
          <Button variant="outline">View Weak Topics</Button>
          <Button variant="outline">Get AI Recommendations</Button>
        </CardContent>
      </Card>
    </div>
  )
}
