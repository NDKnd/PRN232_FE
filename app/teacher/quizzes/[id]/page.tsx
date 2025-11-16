"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { quizApi } from "@/lib/api/quiz";
import type { QuizDetail } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Clock,
  Users,
  FileQuestion,
  Trophy,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MarkdownLatexRenderer } from "@/components/markdown-latex-renderer";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string);

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuizById(quizId);

      if (response.success && response.data) {
        setQuiz(response.data);
      } else {
        toast.error(response.error?.message || "Failed to load quiz");
      }
    } catch (error) {
      toast.error("An error occurred while loading quiz");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await quizApi.publishQuiz(quizId);
      if (response.success) {
        toast.success("Quiz published successfully");
        loadQuiz();
      } else {
        toast.error(response.error?.message || "Failed to publish quiz");
      }
    } catch (error) {
      toast.error("An error occurred while publishing quiz");
    }
  };

  const handleUnpublish = async () => {
    try {
      const response = await quizApi.unpublishQuiz(quizId);
      if (response.success) {
        toast.success("Quiz unpublished successfully");
        loadQuiz();
      } else {
        toast.error(response.error?.message || "Failed to unpublish quiz");
      }
    } catch (error) {
      toast.error("An error occurred while unpublishing quiz");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quiz not found</p>
        <Button variant="link" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge variant="default">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Deleted":
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground">Quiz Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {quiz.status === "Draft" && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push(`/teacher/quizzes/${quizId}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handlePublish}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </>
          )}
          {quiz.status === "Published" && (
            <Button variant="outline" onClick={handleUnpublish}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/teacher/quizzes/${quizId}/statistics`)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistics
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getStatusBadge(quiz.status)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.questionCount}</div>
            <p className="text-xs text-muted-foreground">
              Total Score: {quiz.totalScore}
            </p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.submissionCount}</div>
            <p className="text-xs text-muted-foreground">
              Attempt Limit: {quiz.attemptLimit}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-lg">{quiz.levelName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Teacher
              </p>
              <p className="text-lg">{quiz.teacherName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-lg">
                {new Date(quiz.createdAt).toLocaleString()}
              </p>
            </div>
            {quiz.publishedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Published At
                </p>
                <p className="text-lg">
                  {new Date(quiz.publishedAt).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                AI Generated
              </p>
              <p className="text-lg">{quiz.isAIGenerated ? "Yes" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions ({quiz.questions.length})</CardTitle>
          <CardDescription>
            Review all questions in this quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quiz.questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions added yet</p>
              {quiz.status === "Draft" && (
                <Button
                  variant="link"
                  onClick={() => router.push(`/teacher/quizzes/${quizId}/edit`)}
                >
                  Add questions
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.questionId} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Q{index + 1}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{question.topic}</Badge>
                        <Badge variant="outline">{question.questionType}</Badge>
                        {question.difficultyName && (
                          <Badge>{question.difficultyName}</Badge>
                        )}
                      </div>
                      <MarkdownLatexRenderer content={question.questionText} />
                      
                      {question.answers.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {question.answers.map((answer) => (
                            <div
                              key={answer.answerId}
                              className={`p-3 rounded-lg border ${
                                answer.isCorrect
                                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {answer.isCorrect && (
                                  <Trophy className="h-4 w-4 text-green-600" />
                                )}
                                <MarkdownLatexRenderer content={answer.answerText} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <MarkdownLatexRenderer content={question.explanation} />
                        </div>
                      )}
                    </div>
                  </div>
                  {index < quiz.questions.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
