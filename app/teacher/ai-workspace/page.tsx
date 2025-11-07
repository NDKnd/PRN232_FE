"use client";

import { useState } from "react";
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
import type {
  AiLessonPlanRequest,
  AiQuestionRequest,
  AiQuizRequest,
} from "@/types";

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
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
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
            {generatedPlan ? (
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
                  <ul className="list-disc list-inside space-y-1">
                    {previewData.learningObjectives?.map((obj, index) => (
                      <li key={index} className="text-sm">
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Materials</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {previewData.materials?.map((material, index) => (
                      <li key={index} className="text-sm">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Activities</h4>
                  {previewData.activities?.map((activity, index) => (
                    <div key={index} className="mb-3 p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{activity.title}</h5>
                        <Badge variant="outline">{activity.duration} min</Badge>
                      </div>
                      <p className="text-sm mt-2">{activity.description}</p>
                      {activity.teacherNotes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Note: {activity.teacherNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <p className="text-sm">{previewData.assessment}</p>
                </div>

                {previewData.homework && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Homework</h4>
                      <p className="text-sm">{previewData.homework}</p>
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
  const { isLoading, previewData, preview, generate, clearPreview } =
    useQuestionGenerator();

  const [formData, setFormData] = useState<AiQuestionRequest>({
    topic: "",
    count: 5,
    questionType: "MultipleChoice",
    gradeLevel: "",
  });

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
              value={formData.count}
              onChange={(e) =>
                setFormData({ ...formData, count: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-type">Question Type</Label>
            <Select
              value={formData.questionType}
              onValueChange={(value: any) =>
                setFormData({ ...formData, questionType: value })
              }
            >
              <SelectTrigger id="q-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                <SelectItem value="TrueFalse">True/False</SelectItem>
                <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-grade">Grade Level</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, gradeLevel: value })
              }
            >
              <SelectTrigger id="q-grade">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Middle School">Middle School</SelectItem>
                <SelectItem value="High School">High School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={isLoading || !formData.topic}
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
              disabled={isLoading || !formData.topic}
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
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {previewData && previewData.questions ? (
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
                      <p className="font-medium">{question.questionText}</p>

                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded border ${
                                option === question.correctAnswer
                                  ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-800"
                                  : "bg-muted"
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-semibold">Correct Answer:</span>{" "}
                          {question.correctAnswer}
                        </p>
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Explanation:</span>{" "}
                            {question.explanation}
                          </p>
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

  const [formData, setFormData] = useState<AiQuizRequest>({
    title: "",
    topic: "",
    questionCount: 10,
    timeLimit: 30,
    gradeLevel: "",
  });

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
              value={formData.questionCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  questionCount: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-time">Time Limit (minutes)</Label>
            <Input
              id="quiz-time"
              type="number"
              min="5"
              max="180"
              value={formData.timeLimit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  timeLimit: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-grade">Grade Level</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, gradeLevel: value })
              }
            >
              <SelectTrigger id="quiz-grade">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Middle School">Middle School</SelectItem>
                <SelectItem value="High School">High School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={isLoading || !formData.title || !formData.topic}
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
              disabled={isLoading || !formData.title || !formData.topic}
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
            {generatedQuiz ? (
              <div className="space-y-4">
                <div>
                  <Badge variant="default" className="mb-2">
                    {generatedQuiz.status}
                  </Badge>
                  <h3 className="text-xl font-semibold">
                    {generatedQuiz.title}
                  </h3>
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
                  <p className="text-muted-foreground">
                    Quiz ID: {generatedQuiz.quizId}
                  </p>
                  <p className="mt-2">
                    The quiz has been saved to the database. You can view and
                    manage it in the lessons section.
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
                    onClick={() => router.push("/teacher/lessons?tab=quizzes")}
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
                          <p className="font-medium">{question.questionText}</p>

                          {question.options && question.options.length > 0 && (
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded border text-sm ${
                                    option === question.correctAnswer
                                      ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-800"
                                      : "bg-muted"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}

                          {question.explanation && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Explanation:</span>{" "}
                              {question.explanation}
                            </p>
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
