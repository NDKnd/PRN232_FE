/**
 * AI Feature Hooks
 * Custom React hooks for AI functionality
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  AiChatMessage,
  AiChatRequest,
  AiLessonPlanRequest,
  AiLessonPlanResponse,
  GeneratedLessonPlan,
  AiQuestionRequest,
  AiQuestionResponse,
  AiQuizRequest,
  AiQuizResponse,
  GeneratedQuiz,
  AiGenerateMode,
} from "@/types";
import * as aiApi from "./api";

/**
 * Hook for AI Chat
 */
export const useAiChat = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // Add user message
      const userMessage: AiChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const request: AiChatRequest = {
          message,
          conversationHistory: messages,
        };

        const response = await aiApi.chatWithAi(request);

        if (response.success && response.data) {
          const aiMessage: AiChatMessage = {
            role: "assistant",
            content: response.data.message,
            timestamp: new Date(response.data.timestamp),
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error(response.error?.message || "Failed to get response");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to send message",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
};

/**
 * Hook for Lesson Plan Generation
 */
export const useLessonPlanGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] =
    useState<AiLessonPlanResponse | null>(null);
  const [generatedPlan, setGeneratedPlan] =
    useState<GeneratedLessonPlan | null>(null);
  const { toast } = useToast();

  const preview = useCallback(
    async (request: AiLessonPlanRequest) => {
      setIsLoading(true);
      try {
        const response = await aiApi.previewLessonPlan(request);

        if (response.success && response.data) {
          setPreviewData(response.data);
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to preview lesson plan"
          );
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to preview lesson plan",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const generate = useCallback(
    async (request: AiLessonPlanRequest) => {
      setIsLoading(true);
      let historyId: number | null = null;

      try {
        // Create history entry
        const historyResponse = await aiApi.createAiRequestHistory({
          requestType: "LessonPlan",
          request: `Topic: ${request.topic}, Grade: ${request.gradeLevel}, Duration: ${request.duration} mins`,
          status: "Pending",
        });

        if (historyResponse.success && historyResponse.data) {
          historyId = historyResponse.data.requestId;
        }

        // Generate lesson plan
        const response = await aiApi.generateLessonPlan(request);

        if (response.success && response.data) {
          setGeneratedPlan(response.data);

          // Update history with success
          if (historyId) {
            await aiApi.updateAiRequestHistory(historyId, {
              status: "Completed",
              completedAt: new Date(),
              response: JSON.stringify(response.data),
              metadata: {
                lessonPlanId: response.data.lessonPlanId,
                lessonPlanTitle: response.data.title,
              },
            });
          }

          toast({
            title: "Success",
            description: "Lesson plan generated successfully",
          });
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to generate lesson plan"
          );
        }
      } catch (error) {
        // Update history with failure
        if (historyId) {
          await aiApi.updateAiRequestHistory(historyId, {
            status: "Failed",
            completedAt: new Date(),
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }

        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to generate lesson plan",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const downloadPlan = useCallback(
    async (lessonPlanId: number, title: string) => {
      try {
        const downloadUrl = await aiApi.downloadLessonPlan(lessonPlanId);
        
        window.open(downloadUrl, '_blank');

        toast({
          title: "Success",
          description: "Lesson plan download started",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to download lesson plan",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return {
    isLoading,
    previewData,
    generatedPlan,
    preview,
    generate,
    downloadPlan,
    clearPreview: () => setPreviewData(null),
    clearGenerated: () => setGeneratedPlan(null),
  };
};

/**
 * Hook for Question Generation
 */
export const useQuestionGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<AiQuestionResponse | null>(
    null
  );
  const { toast } = useToast();

  const preview = useCallback(
    async (request: AiQuestionRequest) => {
      setIsLoading(true);
      try {
        const response = await aiApi.previewQuestions(request);

        if (response.success && response.data) {
          setPreviewData(response.data);
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to preview questions"
          );
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to preview questions",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const generate = useCallback(
    async (request: AiQuestionRequest) => {
      setIsLoading(true);
      let historyId: number | null = null;

      try {
        // Create history entry
        const historyResponse = await aiApi.createAiRequestHistory({
          requestType: "Question",
          request: `Topic: ${request.topic}, Count: ${request.count}, Type: ${request.questionType || "Mixed"}`,
          status: "Pending",
        });

        if (historyResponse.success && historyResponse.data) {
          historyId = historyResponse.data.requestId;
        }

        // Generate questions
        const response = await aiApi.generateQuestions(request);

        if (response.success && response.data) {
          // Update history with success
          if (historyId) {
            await aiApi.updateAiRequestHistory(historyId, {
              status: "Completed",
              completedAt: new Date(),
              response: JSON.stringify(response.data),
              metadata: {
                questionCount: response.data.count,
                questionIds: response.data.questionIds,
              },
            });
          }

          toast({
            title: "Success",
            description: response.data.message,
          });
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to generate questions"
          );
        }
      } catch (error) {
        // Update history with failure
        if (historyId) {
          await aiApi.updateAiRequestHistory(historyId, {
            status: "Failed",
            completedAt: new Date(),
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }

        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to generate questions",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return {
    isLoading,
    previewData,
    preview,
    generate,
    clearPreview: () => setPreviewData(null),
  };
};

/**
 * Hook for Quiz Generation
 */
export const useQuizGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<AiQuizResponse | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(
    null
  );
  const { toast } = useToast();

  const preview = useCallback(
    async (request: AiQuizRequest) => {
      setIsLoading(true);
      try {
        const response = await aiApi.previewQuiz(request);

        if (response.success && response.data) {
          setPreviewData(response.data);
          return response.data;
        } else {
          throw new Error(response.error?.message || "Failed to preview quiz");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to preview quiz",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const generate = useCallback(
    async (request: AiQuizRequest) => {
      setIsLoading(true);
      let historyId: number | null = null;

      try {
        // Create history entry
        const historyResponse = await aiApi.createAiRequestHistory({
          requestType: "Quiz",
          request: `Title: ${request.title}, Topic: ${request.topic}, Questions: ${request.questionCount}`,
          status: "Pending",
        });

        if (historyResponse.success && historyResponse.data) {
          historyId = historyResponse.data.requestId;
        }

        // Generate quiz
        const response = await aiApi.generateQuiz(request);

        if (response.success && response.data) {
          setGeneratedQuiz(response.data);

          // Update history with success
          if (historyId) {
            await aiApi.updateAiRequestHistory(historyId, {
              status: "Completed",
              completedAt: new Date(),
              response: JSON.stringify(response.data),
              metadata: {
                quizId: response.data.quizId,
                quizTitle: response.data.title,
              },
            });
          }

          toast({
            title: "Success",
            description: "Quiz generated successfully",
          });
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Failed to generate quiz"
          );
        }
      } catch (error) {
        // Update history with failure
        if (historyId) {
          await aiApi.updateAiRequestHistory(historyId, {
            status: "Failed",
            completedAt: new Date(),
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }

        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to generate quiz",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return {
    isLoading,
    previewData,
    generatedQuiz,
    preview,
    generate,
    clearPreview: () => setPreviewData(null),
    clearGenerated: () => setGeneratedQuiz(null),
  };
};

/**
 * Hook for AI Health Check
 */
export const useAiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await aiApi.checkAiHealth();
      setIsHealthy(response.success && response.data?.status === "healthy");
    } catch (error) {
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    isHealthy,
    isChecking,
    checkHealth,
  };
};
