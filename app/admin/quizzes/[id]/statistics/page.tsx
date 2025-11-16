"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { quizApi } from "@/lib/api/quiz"
import { QuizStatistics } from "@/types/quiz.type"
import { ArrowLeft, Users, CheckCircle, Award, Clock, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function AdminQuizStatisticsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<QuizStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  const quizId = parseInt(params.id as string)

  useEffect(() => {
    loadStatistics()
  }, [quizId])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const response = await quizApi.getQuizStatistics(quizId)
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        throw new Error(response.error?.message || "Failed to load statistics")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz statistics",
        variant: "destructive",
      })
      router.push("/admin/quizzes")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const completionRate = stats.totalStudents > 0 ? (stats.completedSubmissions / stats.totalStudents) * 100 : 0
  const inProgressRate = stats.totalStudents > 0 ? (stats.inProgressSubmissions / stats.totalStudents) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Quiz Statistics</h1>
          <p className="text-muted-foreground">Performance metrics for this quiz</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">students attempted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.completedSubmissions} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">mean performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDuration.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Highest Score</span>
                </div>
                <span className="font-bold">{stats.highestScore.toFixed(1)}%</span>
              </div>
              <Progress value={stats.highestScore} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Average Score</span>
                </div>
                <span className="font-bold">{stats.averageScore.toFixed(1)}%</span>
              </div>
              <Progress value={stats.averageScore} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span>Lowest Score</span>
                </div>
                <span className="font-bold">{stats.lowestScore.toFixed(1)}%</span>
              </div>
              <Progress value={stats.lowestScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Student progress overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Completed</span>
                <span className="font-bold">
                  {stats.completedSubmissions} ({completionRate.toFixed(1)}%)
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">In Progress</span>
                <span className="font-bold">
                  {stats.inProgressSubmissions} ({inProgressRate.toFixed(1)}%)
                </span>
              </div>
              <Progress value={inProgressRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Not Started</span>
                <span className="font-bold">
                  {stats.totalStudents - stats.completedSubmissions - stats.inProgressSubmissions} (
                  {(100 - completionRate - inProgressRate).toFixed(1)}%)
                </span>
              </div>
              <Progress value={100 - completionRate - inProgressRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>Additional statistics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pass Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalSubmissions > 0
                  ? ((stats.completedSubmissions / stats.totalSubmissions) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalStudents > 0
                  ? (((stats.completedSubmissions + stats.inProgressSubmissions) / stats.totalStudents) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
