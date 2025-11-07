"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  HelpCircle,
  ClipboardList,
  MessageSquare,
  Download,
  ExternalLink,
} from "lucide-react";
import { MarkdownLatexRenderer } from "@/components/markdown-latex-renderer";

interface AiRequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AiRequestDetail | null;
}

export interface AiRequestDetail {
  requestId: number;
  userId: number;
  userName?: string;
  requestType: "LessonPlan" | "Question" | "Quiz" | "Chat" | "GenerateLessonPlan" | "GenerateQuestions" | "GenerateQuiz";
  prompt?: string; // Backend field
  request?: string; // Display field (mapped from prompt)
  response?: string;
  status: "Pending" | "Completed" | "Failed" | "Success";
  cost?: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  levelId?: number;
  levelName?: string;
  // Backend returns these
  lessonPlanIds?: number[];
  questionIds?: number[];
  // Additional metadata for display
  metadata?: {
    lessonPlanId?: number;
    lessonPlanTitle?: string;
    questionIds?: number[];
    questionCount?: number;
    quizId?: number;
    quizTitle?: string;
    conversationId?: string;
  };
}

export function AiRequestDetailDialog({
  open,
  onOpenChange,
  request,
}: AiRequestDetailDialogProps) {
  if (!request) return null;

  const getTypeIcon = (type: string) => {
    // Normalize type
    const normalizedType = type.replace("Generate", "");
    
    switch (normalizedType) {
      case "LessonPlan":
        return <BookOpen className="h-5 w-5" />;
      case "Question":
      case "Questions":
        return <HelpCircle className="h-5 w-5" />;
      case "Quiz":
        return <ClipboardList className="h-5 w-5" />;
      case "Chat":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    // Normalize status
    const normalizedStatus = status === "Success" ? "Completed" : status;
    
    switch (normalizedStatus) {
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleViewLesson = () => {
    // Check both metadata and direct lessonPlanIds field
    const lessonPlanId = request.metadata?.lessonPlanId || 
                        (request.lessonPlanIds && request.lessonPlanIds[0]);
    if (lessonPlanId) {
      window.open(`/teacher/lessons/${lessonPlanId}`, "_blank");
    }
  };

  const handleViewQuestions = () => {
    window.open("/teacher/questions", "_blank");
  };

  const handleDownloadLesson = async () => {
    const lessonPlanId = request.metadata?.lessonPlanId || 
                        (request.lessonPlanIds && request.lessonPlanIds[0]);
    if (lessonPlanId) {
      try {
        const { downloadLessonPlan } = await import("@/features/ai/api");
        const downloadUrl = await downloadLessonPlan(lessonPlanId);
        window.open(downloadUrl, "_blank");
      } catch (error) {
        console.error("Failed to download:", error);
      }
    }
  };

  // Parse JSON data if needed
  const parseJsonIfNeeded = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch {
      return null;
    }
  };

  const requestData = typeof request.request === 'string' 
    ? parseJsonIfNeeded(request.request) 
    : null;

  const responseData = typeof request.response === 'string' 
    ? parseJsonIfNeeded(request.response) 
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTypeIcon(request.requestType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {request.requestType.replace("Generate", "")} Request
                </span>
                <Badge variant={getStatusColor(request.status)}>
                  {request.status === "Success" ? "Completed" : request.status}
                </Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Request ID: {request.requestId}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Metadata Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {request.completedAt && (
                    <div>
                      <p className="text-muted-foreground">Completed At</p>
                      <p className="font-medium">
                        {new Date(request.completedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons based on type */}
                {(request.status === "Completed" || request.status === "Success") && (
                  <div className="flex gap-2 pt-3 border-t">
                    {request.requestType.includes("LessonPlan") &&
                      (request.metadata?.lessonPlanId || (request.lessonPlanIds && request.lessonPlanIds.length > 0)) && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleViewLesson}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Lesson Plan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownloadLesson}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}

                    {request.requestType.includes("Question") &&
                      (request.metadata?.questionCount || (request.questionIds && request.questionIds.length > 0)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleViewQuestions}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Questions ({request.metadata?.questionCount || request.questionIds?.length})
                        </Button>
                      )}

                    {request.requestType.includes("Quiz") &&
                      request.metadata?.quizId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `/teacher/lessons?tab=quizzes`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Quiz
                        </Button>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                {requestData ? (
                  <div className="space-y-3">
                    {requestData.Topic && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Topic</p>
                        <p className="text-base">{requestData.Topic}</p>
                      </div>
                    )}
                    {requestData.GradeLevel && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Grade Level</p>
                        <p className="text-base capitalize">{requestData.GradeLevel}</p>
                      </div>
                    )}
                    {requestData.Duration && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Duration</p>
                        <p className="text-base">{requestData.Duration} minutes</p>
                      </div>
                    )}
                    {requestData.Objectives && Array.isArray(requestData.Objectives) && requestData.Objectives.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Learning Objectives</p>
                        <ul className="list-disc list-inside space-y-1">
                          {requestData.Objectives.map((obj: string, idx: number) => (
                            <li key={idx} className="text-sm">{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {requestData.AdditionalRequirements && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Additional Requirements</p>
                        <p className="text-sm">{requestData.AdditionalRequirements}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {request.request || request.prompt || "No request details"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Content */}
            {(request.status === "Completed" || request.status === "Success") && request.response && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Generated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {responseData ? (
                    <div className="space-y-4">
                      {responseData.Topic && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{responseData.Topic}</h3>
                        </div>
                      )}
                      
                      {responseData.grade_level && (
                        <div className="flex gap-4 text-sm">
                          <Badge variant="outline">{responseData.grade_level}</Badge>
                          {responseData.Duration && (
                            <Badge variant="outline">{responseData.Duration} minutes</Badge>
                          )}
                        </div>
                      )}

                      {responseData.Objectives && Array.isArray(responseData.Objectives) && (
                        <div>
                          <h4 className="font-semibold mb-2">Learning Objectives</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {responseData.Objectives.map((obj: any, idx: number) => (
                              <li key={idx} className="text-sm">{typeof obj === 'string' ? obj : JSON.stringify(obj)}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {responseData.Activities && Array.isArray(responseData.Activities) && (
                        <div>
                          <h4 className="font-semibold mb-2">Activities</h4>
                          <div className="space-y-2">
                            {responseData.Activities.map((activity: any, idx: number) => (
                              <div key={idx} className="p-3 bg-muted rounded-md">
                                {typeof activity === 'string' ? (
                                  <p className="text-sm">{activity}</p>
                                ) : (
                                  <>
                                    {activity.Title && (
                                      <p className="font-medium text-sm mb-1">{activity.Title}</p>
                                    )}
                                    {activity.Description && (
                                      <p className="text-sm text-muted-foreground">{activity.Description}</p>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {responseData.Materials && Array.isArray(responseData.Materials) && (
                        <div>
                          <h4 className="font-semibold mb-2">Materials</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {responseData.Materials.map((material: any, idx: number) => (
                              <li key={idx} className="text-sm">{typeof material === 'string' ? material : JSON.stringify(material)}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {responseData.Assessment && (
                        <div>
                          <h4 className="font-semibold mb-2">Assessment</h4>
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm">{typeof responseData.Assessment === 'string' ? responseData.Assessment : JSON.stringify(responseData.Assessment)}</p>
                          </div>
                        </div>
                      )}

                      {/* Fallback for other fields */}
                      {Object.keys(responseData).filter(key => 
                        !['Topic', 'grade_level', 'Duration', 'Objectives', 'Activities', 'Materials', 'Assessment'].includes(key)
                      ).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Additional Information</h4>
                          <div className="p-3 bg-muted rounded-md text-sm">
                            <MarkdownLatexRenderer content={JSON.stringify(responseData, null, 2)} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <MarkdownLatexRenderer content={request.response} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Generated Items Summary */}
            {(request.status === "Completed" || request.status === "Success") && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Generated Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.requestType.includes("LessonPlan") &&
                    (request.lessonPlanIds && request.lessonPlanIds.length > 0) && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {request.metadata?.lessonPlanTitle || "Lesson Plan"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {request.lessonPlanIds[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {request.requestType.includes("Question") &&
                    (request.questionIds && request.questionIds.length > 0) && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {request.questionIds.length} Questions Generated
                            </p>
                            <p className="text-xs text-muted-foreground">
                              IDs: {request.questionIds.slice(0, 5).join(", ")}
                              {request.questionIds.length > 5 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {request.requestType.includes("Quiz") && request.metadata?.quizTitle && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {request.metadata.quizTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {request.metadata.quizId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {request.status === "Failed" && request.error && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">
                    Error Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-destructive">{request.error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
