"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { BookOpen, Users, TrendingUp, Zap } from "lucide-react"

const studentProgressData = [
  { name: "Week 1", students: 24, avgScore: 65 },
  { name: "Week 2", students: 28, avgScore: 72 },
  { name: "Week 3", students: 32, avgScore: 78 },
  { name: "Week 4", students: 35, avgScore: 82 },
]

const topicPerformance = [
  { topic: "Algebra", score: 85 },
  { topic: "Geometry", score: 72 },
  { topic: "Calculus", score: 68 },
  { topic: "Statistics", score: 79 },
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">35</div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lesson Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">12</div>
              <BookOpen className="w-8 h-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">82%</div>
              <TrendingUp className="w-8 h-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">8</div>
              <Zap className="w-8 h-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Weekly enrollment and average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="var(--color-primary)" />
                <Bar dataKey="avgScore" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Student performance by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary/90">Create New Lesson</Button>
          <Button variant="outline">View All Students</Button>
          <Button variant="outline">Export Report</Button>
          <Button variant="outline">View AI Suggestions</Button>
        </CardContent>
      </Card>
    </div>
  )
}
