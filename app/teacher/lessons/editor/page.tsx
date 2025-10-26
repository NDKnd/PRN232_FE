"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Save, Eye } from "lucide-react"

export default function LessonEditor() {
  const [title, setTitle] = useState("Introduction to Algebra")
  const [topic, setTopic] = useState("Algebra")
  const [grade, setGrade] = useState("9")
  const [content, setContent] = useState("# Lesson Content\n\nStart typing your lesson content here...")
  const [aiSuggestions, setAiSuggestions] = useState([
    "Add more real-world examples",
    "Include practice problems",
    "Simplify complex explanations",
  ])

  const handleAiSuggest = () => {
    // In production, this would call an AI API
    alert("AI suggestion feature would generate content improvements")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lesson Editor</h1>
          <p className="text-muted-foreground">Create and edit your lesson content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Lesson
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Algebra"
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade Level</Label>
                  <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., 9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>Write your lesson content in markdown format</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your lesson content..."
                className="min-h-96 font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - AI Suggestions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                AI Suggestions
              </CardTitle>
              <CardDescription>Improve your lesson with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((suggestion, i) => (
                <div key={i} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground">{suggestion}</p>
                </div>
              ))}
              <Button className="w-full bg-primary hover:bg-primary/90 mt-4" onClick={handleAiSuggest}>
                <Sparkles className="w-4 h-4 mr-2" />
                Get More Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Add Practice Questions
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Add Examples
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Add Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
