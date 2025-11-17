"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Sparkles,
  Download,
  Eye,
  Save,
  Loader2,
  MessageSquare,
  Send,
  History,
  ExternalLink,
} from "lucide-react";
import {
  useAiChat,
  useLessonPlanGenerator,
  useQuestionGenerator,
  useQuizGenerator,
} from "@/features/ai/hooks";
import { useLevels } from "@/features/levels";
import type {
  AiLessonPlanRequest,
  AiQuestionRequest,
  AiQuizRequest,
} from "@/types";
import { MarkdownLatexRenderer } from "@/components/markdown-latex-renderer";

const deriveGradeFromLevel = (level: { order: number; levelName: string }) => {
  if (typeof level.order === "number" && Number.isFinite(level.order)) {
    return level.order;
  }
  const digits = level.levelName.match(/\d+/);
  const parsed = digits ? parseInt(digits[0], 10) : NaN;
  return Number.isNaN(parsed) ? 1 : parsed;
};

export default function AiWorkspacePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            AI Workspace
          </h1>
          <p className="text-muted-foreground mt-2">
            Chat with AI and generate lesson plans, questions, and quizzes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/teacher/ai-history")}
          >
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Badge variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="lesson-plan" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lesson Plan
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <ChatTab />
        </TabsContent>

        <TabsContent value="lesson-plan" className="mt-6">
          <LessonPlanTab />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <QuestionsTab />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuizTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Chat Tab Component
function ChatTab() {
  const { messages, isLoading, sendMessage, clearChat } = useAiChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chat with AI Assistant</span>
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear Chat
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[500px] w-full border rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with AI</p>
                <p className="text-sm mt-2">
                  Ask anything about math education, teaching strategies, or get
                  help with content creation
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.timestamp && (
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Lesson Plan Tab Component
function LessonPlanTab() {
  const router = useRouter();
  const {
    isLoading,
    previewData,
    generatedPlan,
    preview,
    generate,
    downloadPlan,
    clearPreview,
    clearGenerated,
  } = useLessonPlanGenerator();

  // Get user info from localStorage
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.userId || 0;
      }
    }
    return 0;
  };

  const [formData, setFormData] = useState<AiLessonPlanRequest>({
    topic: "",
    gradeLevel: "",
    duration: 45,
    learningObjectives: [],
    additionalNotes: "",
    teacherId: getUserId(),
    levelId: 1, // Default to level 1
    grade: 1, // Default to grade 1
  });

  const [objectiveInput, setObjectiveInput] = useState("");

  const handleAddObjective = () => {
    if (objectiveInput.trim()) {
      setFormData({
        ...formData,
        learningObjectives: [
          ...(formData.learningObjectives || []),
          objectiveInput.trim(),
        ],
      });
      setObjectiveInput("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setFormData({
      ...formData,
      learningObjectives: formData.learningObjectives?.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handlePreview = () => {
    preview(formData);
  };

  const handleGenerate = async () => {
    const result = await generate(formData);
    if (result) {
      // Success - generated plan will be set in the hook
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Plan Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Linear Equations"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level *</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) => {
                // Auto-set grade and levelId based on grade level
                let grade = 1;
                let levelId = 1;
                if (value === "elementary") {
                  grade = 3; // Default to grade 3
                  levelId = 1;
                } else if (value === "middle") {
                  grade = 7; // Default to grade 7
                  levelId = 2;
                } else if (value === "high") {
                  grade = 10; // Default to grade 10
                  levelId = 3;
                }
                setFormData({ 
                  ...formData, 
                  gradeLevel: value,
                  grade,
                  levelId
                });
              }}
            >
              <SelectTrigger id="gradeLevel">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary (Grades 1-5)</SelectItem>
                <SelectItem value="middle">Middle School (Grades 6-9)</SelectItem>
                <SelectItem value="high">High School (Grades 10-12)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Specific Grade *</Label>
            <Select
              value={formData.grade.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, grade: parseInt(value) })
              }
            >
              <SelectTrigger id="grade">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {formData.gradeLevel === "elementary" && [1, 2, 3, 4, 5].map(g => (
                  <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                ))}
                {formData.gradeLevel === "middle" && [6, 7, 8, 9].map(g => (
                  <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                ))}
                {formData.gradeLevel === "high" && [10, 11, 12].map(g => (
                  <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                ))}
                {!formData.gradeLevel && (
                  <SelectItem value="1" disabled>Select grade level first</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="30"
              max="90"
              value={formData.duration || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 45 : parseInt(e.target.value);
                setFormData({ ...formData, duration: isNaN(value) ? 45 : value });
              }}
            />
            <p className="text-xs text-muted-foreground">Between 30-90 minutes</p>
          </div>

          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add learning objective"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddObjective();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddObjective}
              >
                Add
              </Button>
            </div>
            <div className="space-y-1 mt-2">
              {formData.learningObjectives?.map((obj, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="mr-2 mb-2 cursor-pointer"
                  onClick={() => handleRemoveObjective(index)}
                >
                  {obj} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements or focus areas..."
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData({ ...formData, additionalNotes: e.target.value })
              }
              rows={3}
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={isLoading || !formData.topic || !formData.gradeLevel}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !formData.topic || !formData.gradeLevel}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Generate & Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview/Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {generatedPlan ? "Generated Lesson Plan" : "Preview"}
            </span>
            {generatedPlan && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadPlan(generatedPlan.lessonPlanId, generatedPlan.title)
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Generating lesson plan...</p>
                    <p className="text-sm">
                      AI is creating a customized lesson plan for your topic.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This may take up to 2-3 minutes depending on complexity.
                    </p>
                  </div>
                </div>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-4">
                <div>
                  <Badge variant="default" className="mb-2">
                    {generatedPlan.status}
                  </Badge>
                  <h3 className="text-xl font-semibold">
                    {generatedPlan.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Topic: {generatedPlan.topic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {generatedPlan.duration} minutes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(generatedPlan.createdAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    Lesson plan ID: {generatedPlan.lessonPlanId}
                  </p>
                  <p className="mt-2">
                    The lesson plan has been saved to the database. You can
                    download it as a document or view it in the lessons section.
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/teacher/ai-history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View in History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/teacher/lessons/${generatedPlan.lessonPlanId}`
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Lesson
                  </Button>
                  <Button variant="outline" onClick={() => clearGenerated()}>
                    Generate Another
                  </Button>
                </div>
              </div>
            ) : previewData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{previewData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {previewData.gradeLevel} | {previewData.duration} minutes
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Learning Objectives</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {previewData.learningObjectives?.map((obj, index) => (
                      <li key={index} className="text-sm">
                        <MarkdownLatexRenderer content={obj} />
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Materials</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {previewData.materials?.map((material, index) => (
                      <li key={index} className="text-sm">
                        <MarkdownLatexRenderer content={material} />
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Activities</h4>
                  {previewData.activities?.map((activity, index) => (
                    <div key={index} className="mb-3 p-4 bg-muted rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-base">{activity.title}</h5>
                        <Badge variant="outline">{activity.duration} min</Badge>
                      </div>
                      <div className="text-sm mt-2">
                        <MarkdownLatexRenderer content={activity.description} />
                      </div>
                      {activity.teacherNotes && (
                        <div className="text-xs text-muted-foreground mt-3 p-2 bg-background/50 rounded border-l-2 border-primary/30">
                          <span className="font-semibold">Teacher Note:</span>{" "}
                          <MarkdownLatexRenderer content={activity.teacherNotes} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <div className="text-sm">
                    <MarkdownLatexRenderer content={previewData.assessment} />
                  </div>
                </div>

                {previewData.homework && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Homework</h4>
                      <div className="text-sm">
                        <MarkdownLatexRenderer content={previewData.homework} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available</p>
                  <p className="text-sm mt-2">
                    Fill in the form and click Preview to see the generated
                    lesson plan
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Questions Tab Component
function QuestionsTab() {
  const router = useRouter();
  const { isLoading, previewData, generatedQuestions, preview, generate, clearPreview, clearGenerated } =
    useQuestionGenerator();
  const { levels, isLoading: isLoadingLevels } = useLevels();

  // Get user info from localStorage
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.userId || 0;
      }
    }
    return 0;
  };

  const [formData, setFormData] = useState<AiQuestionRequest>({
    topic: "",
    gradeLevel: 1, // Default to grade 1
    questionType: "multiple_choice",
    difficulty: "medium",
    count: 5,
    includeSolution: true,
    levelId: undefined,
    userId: getUserId(),
  });

  useEffect(() => {
    if (isLoadingLevels || levels.length === 0) {
      return;
    }
    setFormData((current) => {
      if (current.levelId) {
        return current;
      }
      const defaultLevel = levels[0];
      return {
        ...current,
        levelId: defaultLevel.levelId,
        gradeLevel: deriveGradeFromLevel(defaultLevel),
      };
    });
  }, [isLoadingLevels, levels]);

  const handlePreview = () => {
    preview(formData);
  };

  const handleGenerate = async () => {
    const result = await generate(formData);
    if (result) {
      // Success - generated questions will be shown in toast
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Question Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-topic">Topic *</Label>
            <Input
              id="q-topic"
              placeholder="e.g., Quadratic Equations"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-count">Number of Questions *</Label>
            <Input
              id="q-count"
              type="number"
              min="1"
              max="20"
              value={formData.count || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 1 : parseInt(e.target.value);
                setFormData({ ...formData, count: isNaN(value) ? 1 : value });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-type">Question Type *</Label>
            <Select
              value={formData.questionType}
              onValueChange={(value) =>
                setFormData({ ...formData, questionType: value })
              }
            >
              <SelectTrigger id="q-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
                <SelectItem value="essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-difficulty">Difficulty *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) =>
                setFormData({ ...formData, difficulty: value })
              }
            >
              <SelectTrigger id="q-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-grade">Grade Level *</Label>
            <Select
              value={formData.levelId ? formData.levelId.toString() : ""}
              onValueChange={(value) => {
                const selectedLevel = levels.find(
                  (level) => level.levelId.toString() === value
                );
                if (selectedLevel) {
                  setFormData({
                    ...formData,
                    levelId: selectedLevel.levelId,
                    gradeLevel: deriveGradeFromLevel(selectedLevel),
                  });
                }
              }}
              disabled={isLoadingLevels}
            >
              <SelectTrigger id="q-grade" className="w-full">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingLevels ? (
                  <SelectItem value="loading" disabled>
                    Loading levels...
                  </SelectItem>
                ) : levels.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No levels available
                  </SelectItem>
                ) : (
                  levels.map((level) => {
                    return (
                      <SelectItem
                        key={level.levelId}
                        value={level.levelId.toString()}
                      >
                        Grade {level.levelName} - {level.educationLevel}
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={isLoading || !formData.topic || !formData.gradeLevel}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !formData.topic || !formData.gradeLevel}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Generate & Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>
            {generatedQuestions ? "Generated Questions" : "Preview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Generating questions...</p>
                    <p className="text-sm">
                      AI is creating {formData.count} questions for your topic.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This may take 1-2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            ) : generatedQuestions ? (
              <div className="space-y-4">
                <div>
                  <Badge variant="default" className="mb-2">
                    Successfully Generated
                  </Badge>
                  <h3 className="text-xl font-semibold">
                    {generatedQuestions.count} Questions Created
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Topic: {formData.topic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Difficulty: {formData.difficulty}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: {formData.questionType}
                  </p>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="font-medium mb-2">Question IDs:</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedQuestions.questionIds.map((id) => (
                      <Badge key={id} variant="outline">
                        #{id}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="mt-2">
                    The questions have been saved to the database. You can
                    view and manage them in the Question Bank section.
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/teacher/ai-history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View in History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/teacher/questions")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Questions
                  </Button>
                  <Button variant="outline" onClick={() => clearGenerated()}>
                    Generate More
                  </Button>
                </div>
              </div>
            ) : previewData && previewData.questions ? (
              <div className="space-y-4">
                {previewData.questions.map((question, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          Question {index + 1}
                        </CardTitle>
                        <Badge>{question.questionType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="font-medium">
                        <MarkdownLatexRenderer content={question.questionText} />
                      </div>

                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded border ${
                                option === question.correctAnswer
                                  ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-800"
                                  : "bg-muted"
                              }`}
                            >
                              <MarkdownLatexRenderer content={option} />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <div className="text-sm">
                          <span className="font-semibold">Correct Answer:</span>{" "}
                          <MarkdownLatexRenderer content={question.correctAnswer} className="inline" />
                        </div>
                        {question.explanation && (
                          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            <span className="font-semibold">Explanation:</span>{" "}
                            <MarkdownLatexRenderer content={question.explanation} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available</p>
                  <p className="text-sm mt-2">
                    Fill in the form and click Preview to see the generated
                    questions
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Quiz Tab Component
function QuizTab() {
  const router = useRouter();
  const { isLoading, previewData, generatedQuiz, preview, generate, clearGenerated } =
    useQuizGenerator();
  const { levels, isLoading: isLoadingLevels } = useLevels();

  // Get user info from localStorage
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.userId || 0;
      }
    }
    return 0;
  };

  const [formData, setFormData] = useState<AiQuizRequest>({
    title: "",
    topic: "",
    gradeLevel: 1, // Default to grade 1
    questionCount: 10,
    duration: 30,
    includeEssay: false,
    levelId: undefined,
    userId: getUserId(),
  });

  useEffect(() => {
    if (isLoadingLevels || levels.length === 0) {
      return;
    }
    setFormData((current) => {
      if (current.levelId) {
        return current;
      }
      const defaultLevel = levels[0];
      return {
        ...current,
        levelId: defaultLevel.levelId,
        gradeLevel: deriveGradeFromLevel(defaultLevel),
      };
    });
  }, [isLoadingLevels, levels]);

  const handlePreview = () => {
    preview(formData);
  };

  const handleGenerate = async () => {
    const result = await generate(formData);
    if (result) {
      // Success - generated quiz will be set in the hook
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title *</Label>
            <Input
              id="quiz-title"
              placeholder="e.g., Algebra Fundamentals Quiz"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-topic">Topic *</Label>
            <Input
              id="quiz-topic"
              placeholder="e.g., Basic Algebra"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-count">Number of Questions *</Label>
            <Input
              id="quiz-count"
              type="number"
              min="5"
              max="50"
              value={formData.questionCount || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 10 : parseInt(e.target.value);
                setFormData({
                  ...formData,
                  questionCount: isNaN(value) ? 10 : value,
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-time">Time Limit (minutes)</Label>
            <Input
              id="quiz-time"
              type="number"
              min="5"
              max="180"
              value={formData.duration || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 30 : parseInt(e.target.value);
                setFormData({
                  ...formData,
                  duration: isNaN(value) ? 30 : value,
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-grade">Grade Level *</Label>
            <Select
              value={formData.levelId ? formData.levelId.toString() : ""}
              onValueChange={(value) => {
                const selectedLevel = levels.find(
                  (level) => level.levelId.toString() === value
                );
                if (selectedLevel) {
                  setFormData({
                    ...formData,
                    levelId: selectedLevel.levelId,
                    gradeLevel: deriveGradeFromLevel(selectedLevel),
                  });
                }
              }}
              disabled={isLoadingLevels}
            >
              <SelectTrigger id="quiz-grade" className="w-full">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingLevels ? (
                  <SelectItem value="loading" disabled>
                    Loading levels...
                  </SelectItem>
                ) : levels.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No levels available
                  </SelectItem>
                ) : (
                  levels.map((level) => {
                    return (
                      <SelectItem
                        key={level.levelId}
                        value={level.levelId.toString()}
                      >
                        Grade {level.levelName} - {level.educationLevel}
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={isLoading || !formData.title || !formData.topic || !formData.gradeLevel}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !formData.title || !formData.topic || !formData.gradeLevel}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Generate & Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview/Result */}
      <Card>
        <CardHeader>
          <CardTitle>
            {generatedQuiz ? "Generated Quiz" : "Preview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Generating quiz...</p>
                    <p className="text-sm">
                      AI is creating a quiz with {formData.questionCount} questions.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This may take 2-3 minutes depending on complexity.
                    </p>
                  </div>
                </div>
              </div>
            ) : generatedQuiz ? (
              <div className="space-y-4">
                <div>
                  <Badge variant="default" className="mb-2">
                    Successfully Generated
                  </Badge>
                  <h3 className="text-xl font-semibold">
                    {generatedQuiz.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Topic: {formData.topic}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Questions:</span>{" "}
                      {generatedQuiz.questionCount}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total Score:</span>{" "}
                      {generatedQuiz.totalScore}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time Limit:</span>{" "}
                      {generatedQuiz.timeLimit} minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(generatedQuiz.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="font-medium mb-1">Quiz ID:</p>
                  <Badge variant="outline">#{generatedQuiz.quizId}</Badge>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="mt-2">
                    The quiz has been saved to the database. You can view and
                    manage it in the Quizzes section.
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/teacher/ai-history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View in History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/teacher/quizzes")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Quiz
                  </Button>
                  <Button variant="outline" onClick={() => clearGenerated()}>
                    Generate Another
                  </Button>
                </div>
              </div>
            ) : previewData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{previewData.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {previewData.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Time Limit:</span>{" "}
                      {previewData.timeLimit} minutes
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total Score:</span>{" "}
                      {previewData.totalScore}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Questions</h4>
                  <div className="space-y-4">
                    {previewData.questions?.map((question, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">
                              Question {index + 1}
                            </CardTitle>
                            <Badge>{question.questionType}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="font-medium">
                            <MarkdownLatexRenderer content={question.questionText} />
                          </div>

                          {question.options && question.options.length > 0 && (
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded border text-sm ${
                                    option === question.correctAnswer
                                      ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-800"
                                      : "bg-muted"
                                  }`}
                                >
                                  <MarkdownLatexRenderer content={option} />
                                </div>
                              ))}
                            </div>
                          )}

                          {question.explanation && (
                            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              <span className="font-semibold">Explanation:</span>{" "}
                              <MarkdownLatexRenderer content={question.explanation} />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available</p>
                  <p className="text-sm mt-2">
                    Fill in the form and click Preview to see the generated quiz
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
