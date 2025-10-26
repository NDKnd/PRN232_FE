"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Download, Filter } from "lucide-react"

export default function TeacherAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Monitor your class performance and student progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">35</div>
            <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Class Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground mt-1">+4% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">100% completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">students below 60%</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <AnalyticsDashboard role="teacher" />

      {/* Student Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Students with highest average scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Alice Johnson", score: 95, quizzes: 12 },
              { name: "Bob Smith", score: 92, quizzes: 11 },
              { name: "Carol White", score: 88, quizzes: 10 },
            ].map((student, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.quizzes} quizzes completed</p>
                </div>
                <div className="text-lg font-bold text-green-600">{student.score}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Needing Support */}
      <Card>
        <CardHeader>
          <CardTitle>Students Needing Support</CardTitle>
          <CardDescription>Below average performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "David Brown", score: 62, topic: "Calculus" },
              { name: "Eve Davis", score: 65, topic: "Geometry" },
              { name: "Frank Miller", score: 58, topic: "Algebra" },
            ].map((student, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">Struggling with {student.topic}</p>
                </div>
                <div className="text-lg font-bold text-red-600">{student.score}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
