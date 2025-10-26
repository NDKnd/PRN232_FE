"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

interface AISuggestionPanelProps {
  type: "lesson" | "question" | "feedback"
  onApply?: (suggestion: string) => void
}

export function AISuggestionPanel({ type, onApply }: AISuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateSuggestions = async () => {
    setIsLoading(true)
    try {
      // In production, this would call the appropriate API endpoint
      const mockSuggestions = {
        lesson: [
          "Add more real-world examples to engage students",
          "Include interactive practice problems",
          "Simplify complex explanations",
          "Add visual diagrams and illustrations",
        ],
        question: [
          "Make the question more specific",
          "Add multiple difficulty levels",
          "Include common misconceptions",
          "Provide detailed answer explanations",
        ],
        feedback: [
          "Highlight the key concept",
          "Provide step-by-step solution",
          "Suggest related practice problems",
          "Offer personalized learning resources",
        ],
      }

      setSuggestions(mockSuggestions[type])
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Get AI-powered recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length === 0 ? (
          <Button onClick={generateSuggestions} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Suggestions
              </>
            )}
          </Button>
        ) : (
          <>
            {suggestions.map((suggestion, i) => (
              <div key={i} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-foreground mb-2">{suggestion}</p>
                {onApply && (
                  <Button size="sm" variant="outline" onClick={() => onApply(suggestion)} className="bg-transparent">
                    Apply
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={generateSuggestions}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isLoading ? "Generating..." : "Get More Suggestions"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
