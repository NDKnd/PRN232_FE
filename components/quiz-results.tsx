"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Download, Share2 } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  feedback: string[];
}

export function QuizResults({
  score,
  totalQuestions,
  timeSpent,
  feedback,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getResultColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>Here's how you performed</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div
              className={`text-6xl font-bold ${getResultColor(
                percentage
              )} mb-2`}
            >
              {percentage}%
            </div>
            <p className="text-lg text-muted-foreground">
              You got {score} out of {totalQuestions} questions correct
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
              <p className="text-2xl font-bold text-foreground">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-foreground">
                {percentage}%
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Results
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>AI Feedback</CardTitle>
          <CardDescription>
            Personalized insights on your performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedback.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              {i % 2 === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Review Weak Topics
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Get Personalized Recommendations
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
