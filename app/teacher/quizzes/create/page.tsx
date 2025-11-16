"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { quizApi } from "@/lib/api/quiz";
import { levelApi } from "@/lib/api/level";
import type { CreateQuizRequest, Level } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function CreateQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [formData, setFormData] = useState<CreateQuizRequest>({
    title: "",
    levelId: 0,
    timeLimit: 60,
    attemptLimit: 1,
    questionIds: [],
  });

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const response = await levelApi.getAll();
      if (response.success && response.data) {
        setLevels(response.data);
      }
    } catch (error) {
      toast.error("Failed to load levels");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (formData.levelId === 0) {
      toast.error("Please select a level");
      return;
    }

    try {
      setLoading(true);
      const response = await quizApi.createQuiz(formData);

      if (response.success && response.data) {
        toast.success("Quiz created successfully");
        router.push(`/teacher/quizzes/${response.data.quizId}/edit`);
      } else {
        toast.error(response.error?.message || "Failed to create quiz");
      }
    } catch (error) {
      toast.error("An error occurred while creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
          <p className="text-muted-foreground">
            Set up basic quiz information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
            <CardDescription>
              Enter the basic information for your quiz
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
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.levelId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, levelId: parseInt(value) })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem
                        key={level.levelId}
                        value={level.levelId.toString()}
                      >
                        {level.levelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
              <p className="text-sm text-muted-foreground">
                Maximum number of attempts students can make (1-10)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Quizz
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
