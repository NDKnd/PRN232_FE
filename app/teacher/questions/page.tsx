"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

interface Question {
  id: string
  text: string
  topic: string
  grade: string
  difficulty: "easy" | "medium" | "hard"
  type: "multiple-choice" | "short-answer"
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "What is 2 + 2?", topic: "Arithmetic", grade: "1", difficulty: "easy", type: "multiple-choice" },
    {
      id: "2",
      text: "Solve: x² - 5x + 6 = 0",
      topic: "Algebra",
      grade: "9",
      difficulty: "medium",
      type: "short-answer",
    },
    {
      id: "3",
      text: "Find the area of a circle with radius 5",
      topic: "Geometry",
      grade: "10",
      difficulty: "medium",
      type: "short-answer",
    },
    {
      id: "4",
      text: "Prove that the sum of angles in a triangle is 180°",
      topic: "Geometry",
      grade: "10",
      difficulty: "hard",
      type: "short-answer",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTopic, setFilterTopic] = useState("")

  const filteredQuestions = questions.filter(
    (q) => q.text.toLowerCase().includes(searchTerm.toLowerCase()) && (!filterTopic || q.topic === filterTopic),
  )

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const topics = [...new Set(questions.map((q) => q.topic))]

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
          <p className="text-muted-foreground">Manage your question library</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-xs">
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="topic" className="text-xs">
                Topic
              </Label>
              <select
                id="topic"
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">No questions found</p>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-2">{question.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded">Topic: {question.topic}</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">Grade: {question.grade}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(question.difficulty)}`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">{question.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(question.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Easy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {questions.filter((q) => q.difficulty === "easy").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {questions.filter((q) => q.difficulty === "hard").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
