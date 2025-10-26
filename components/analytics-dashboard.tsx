"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsDashboardProps {
  role: "teacher" | "student"
}

export function AnalyticsDashboard({ role }: AnalyticsDashboardProps) {
  const studentProgressData = [
    { week: "Week 1", score: 65, completed: 3 },
    { week: "Week 2", score: 72, completed: 5 },
    { week: "Week 3", score: 78, completed: 7 },
    { week: "Week 4", score: 82, completed: 9 },
  ]

  const topicPerformance = [
    { topic: "Algebra", score: 85 },
    { topic: "Geometry", score: 72 },
    { topic: "Calculus", score: 68 },
    { topic: "Statistics", score: 79 },
  ]

  if (role === "teacher") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Overview</CardTitle>
            <CardDescription>Weekly class average and enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="var(--color-primary)" name="Avg Score" />
                <Bar dataKey="completed" fill="var(--color-accent)" name="Quizzes Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Class average by topic</CardDescription>
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
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>Score trend and quiz completion</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="var(--color-primary)" name="Score" />
              <Bar dataKey="completed" fill="var(--color-accent)" name="Quizzes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Breakdown</CardTitle>
          <CardDescription>Your performance by topic</CardDescription>
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
  )
}
