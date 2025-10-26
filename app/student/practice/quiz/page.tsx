"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronRight, ChevronLeft } from "lucide-react"

interface QuizQuestion {
  id: string
  text: string
  type: "multiple-choice" | "short-answer"
  options?: string[]
  answer?: string
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes

  const questions: QuizQuestion[] = [
    {
      id: "1",
      text: "What is the solution to x² - 5x + 6 = 0?",
      type: "multiple-choice",
      options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 0 or x = 5"],
    },
    {
      id: "2",
      text: "Solve for x: 2x + 5 = 13",
      type: "short-answer",
    },
    {
      id: "3",
      text: "What is the derivative of f(x) = 3x²?",
      type: "multiple-choice",
      options: ["6x", "3x", "6x²", "x"],
    },
  ]

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    alert("Quiz submitted! Your results will be calculated.")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Quadratic Equations Quiz</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === "multiple-choice" && question.options ? (
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[question.id] === option
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === option ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {answers[question.id] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter your answer..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                  i === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[q.id]
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
