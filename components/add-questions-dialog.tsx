"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"
import { quizApi } from "@/lib/api/quiz"
import { questionApi, type QuestionResponseDto } from "@/lib/api/question"
import { MarkdownLatexRenderer } from "./markdown-latex-renderer"

interface AddQuestionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizId: number
  levelId?: number
  onQuestionsAdded: () => void
}

export function AddQuestionsDialog({
  open,
  onOpenChange,
  quizId,
  levelId,
  onQuestionsAdded,
}: AddQuestionsDialogProps) {
  const [questions, setQuestions] = useState<QuestionResponseDto[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (open) {
      loadQuestions()
    } else {
      setSelectedQuestions(new Set())
      setSearchTerm("")
    }
  }, [open, levelId])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const response = await questionApi.getAvailableQuestions({
        levelId: levelId,
      })

      if (response.success && response.data) {
        setQuestions(response.data)
      } else {
        toast.error(response.error?.message || "Failed to load questions")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      toast.error("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleQuestion = (questionId: number) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId)
    } else {
      newSelected.add(questionId)
    }
    setSelectedQuestions(newSelected)
  }

  const handleAddQuestions = async () => {
    if (selectedQuestions.size === 0) {
      toast.error("Please select at least one question")
      return
    }

    try {
      setAdding(true)
      const response = await quizApi.addQuestionsToQuiz(
        quizId,
        Array.from(selectedQuestions)
      )

      if (response.success) {
        toast.success(response.data?.message || "Questions added successfully")
        setSelectedQuestions(new Set())
        onQuestionsAdded()
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || "Failed to add questions")
      }
    } catch (error) {
      toast.error("An error occurred while adding questions")
    } finally {
      setAdding(false)
    }
  }

  const filteredQuestions = questions.filter((q) =>
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Questions to Quiz</DialogTitle>
          <DialogDescription>
            Select questions from your question bank to add to this quiz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions available</p>
                  <p className="text-sm">Create questions in your question bank first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.questionId}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedQuestions.has(question.questionId)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleToggleQuestion(question.questionId)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedQuestions.has(question.questionId)}
                          onCheckedChange={() => handleToggleQuestion(question.questionId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 space-y-2">
                          <MarkdownLatexRenderer content={question.questionText} />
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{question.topic}</Badge>
                            <Badge variant="outline">{question.questionType}</Badge>
                            {question.difficultyName && (
                              <Badge variant="outline">{question.difficultyName}</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {question.answers.length} answers
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {selectedQuestions.size} question(s) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddQuestions}
                disabled={adding || selectedQuestions.size === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedQuestions.size > 0 ? `(${selectedQuestions.size})` : ""}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
