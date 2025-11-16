"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { quizApi } from "@/lib/api/quiz"
import { QuizDetail, QuizStatus } from "@/types/quiz.type"
import { ArrowLeft, Clock, Users, Target, FileBarChart, Trophy } from "lucide-react"
import Link from "next/link"
import { MarkdownLatexRenderer } from "@/components/markdown-latex-renderer"

export default function AdminQuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const quizId = parseInt(params.id as string)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      const response = await quizApi.getQuizById(quizId)
      if (response.success && response.data) {
        setQuiz(response.data)
      } else {
        throw new Error(response.error?.message || "Failed to load quiz")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz details",
        variant: "destructive",
      })
      router.push("/admin/quizzes")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: QuizStatus) => {
    const variants = {
      Published: "default",
      Draft: "secondary",
      Deleted: "destructive",
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">
            Created by {quiz.teacherName} on {new Date(quiz.createdAt).toLocaleDateString()}
          </p>
        </div>
        {getStatusBadge(quiz.status as QuizStatus)}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Limit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.timeLimit}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.questions.length}</div>
            <p className="text-xs text-muted-foreground">total questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempt Limit</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.attemptLimit || "Unlimited"}</div>
            <p className="text-xs text-muted-foreground">attempts allowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grade Level</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.levelId}</div>
            <p className="text-xs text-muted-foreground">grade</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Link href={`/admin/quizzes/${quiz.quizId}/statistics`}>
          <Button>
            <FileBarChart className="w-4 h-4 mr-2" />
            View Statistics
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>{quiz.questions.length} questions in this quiz</CardDescription>
        </CardHeader>
        <CardContent>
          {quiz.questions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No questions added yet</p>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.questionId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      Q{index + 1}
                    </Badge>
                    <div className="flex-1 space-y-2">
                      <MarkdownLatexRenderer content={question.questionText} />
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">{question.topic}</Badge>
                        <Badge variant="outline">{question.difficultyName}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 ml-12">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.answerId}
                        className={`flex items-start gap-2 p-2 rounded ${
                          answer.isCorrect ? "bg-green-50 dark:bg-green-950" : ""
                        }`}
                      >
                        {answer.isCorrect && <Trophy className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />}
                        <MarkdownLatexRenderer content={answer.answerText} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
