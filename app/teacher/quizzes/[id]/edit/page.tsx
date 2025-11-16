"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { quizApi } from "@/lib/api/quiz";
import type { QuizDetail, UpdateQuizRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { MarkdownLatexRenderer } from "@/components/markdown-latex-renderer";
import { AddQuestionsDialog } from "@/components/add-questions-dialog";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = parseInt(params.id as string);

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateQuizRequest>({
    title: "",
    timeLimit: 60,
    attemptLimit: 1,
    questionIds: [],
  });
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuizById(quizId);

      if (response.success && response.data) {
        setQuiz(response.data);
        setFormData({
          title: response.data.title,
          timeLimit: response.data.timeLimit,
          attemptLimit: response.data.attemptLimit,
          questionIds: response.data.questions.map((q) => q.questionId),
        });
      } else {
        toast.error(response.error?.message || "Failed to load quiz");
      }
    } catch (error) {
      toast.error("An error occurred while loading quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    try {
      const response = await quizApi.removeQuestionFromQuiz(quizId, questionId);
      if (response.success) {
        toast.success("Question removed from quiz");
        setRemoveDialogOpen(false);
        loadQuiz();
      } else {
        toast.error(response.error?.message || "Failed to remove question");
      }
    } catch (error) {
      toast.error("An error occurred while removing question");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    try {
      setSaving(true);
      const response = await quizApi.updateQuiz(quizId, formData);

      if (response.success) {
        toast.success("Quiz updated successfully");
        router.push(`/teacher/quizzes/${quizId}`);
      } else {
        toast.error(response.error?.message || "Failed to update quiz");
      }
    } catch (error) {
      toast.error("An error occurred while updating quiz");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
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

  if (quiz.status !== "Draft") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Cannot edit a published or deleted quiz
        </p>
        <Button variant="link" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
          <p className="text-muted-foreground">{quiz.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>
                Update the basic information for your quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    max="300"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeLimit: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attemptLimit">Attempt Limit *</Label>
                  <Input
                    id="attemptLimit"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.attemptLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attemptLimit: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Questions ({formData.questionIds?.length || 0})</CardTitle>
                  <CardDescription>
                    Manage questions in this quiz
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Questions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!formData.questionIds || formData.questionIds.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No questions added yet</p>
                  <Button variant="link" onClick={() => toast.info("Feature coming soon!")}>
                    Add your first question
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {quiz.questions
                    .filter((q) => formData.questionIds?.includes(q.questionId))
                    .map((question, index) => (
                      <div key={question.questionId} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{question.topic}</Badge>
                              <Badge variant="outline">
                                {question.questionType}
                              </Badge>
                              {question.difficultyName && (
                                <Badge>{question.difficultyName}</Badge>
                              )}
                            </div>
                            <MarkdownLatexRenderer
                              content={question.questionText}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedQuestionId(question.questionId);
                              setRemoveDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        {index < (formData.questionIds?.length || 0) - 1 && <Separator />}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this question from the quiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedQuestionId && handleRemoveQuestion(selectedQuestionId)
              }
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddQuestionsDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        quizId={quizId}
        levelId={quiz?.levelId}
        onQuestionsAdded={loadQuiz}
      />
    </div>
  );
}
