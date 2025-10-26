"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Quiz {
  id: string
  title: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  questions: number
  timeLimit: number
  completed: boolean
  score?: number
}

export default function Practice() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Algebra Basics",
      topic: "Algebra",
      difficulty: "easy",
      questions: 10,
      timeLimit: 15,
      completed: true,
      score: 85,
    },
    {
      id: "2",
      title: "Quadratic Equations",
      topic: "Algebra",
      difficulty: "medium",
      questions: 15,
      timeLimit: 30,
      completed: false,
    },
    {
      id: "3",
      title: "Geometry Proofs",
      topic: "Geometry",
      difficulty: "hard",
      questions: 12,
      timeLimit: 45,
      completed: false,
    },
    {
      id: "4",
      title: "Calculus Limits",
      topic: "Calculus",
      difficulty: "hard",
      questions: 10,
      timeLimit: 40,
      completed: true,
      score: 72,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDifficulty, setFilterDifficulty] = useState("")

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterDifficulty || q.difficulty === filterDifficulty),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practice Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge with AI-powered quizzes</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <CardDescription>{quiz.topic}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Questions: {quiz.questions}</p>
                <p>Time Limit: {quiz.timeLimit} minutes</p>
              </div>

              {quiz.completed && quiz.score !== undefined && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">Score: {quiz.score}%</p>
                </div>
              )}

              <Button
                className={`w-full ${quiz.completed ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"}`}
              >
                {quiz.completed ? "Retake Quiz" : "Start Quiz"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground">No quizzes found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
