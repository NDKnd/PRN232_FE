"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  BookOpen,
  HelpCircle,
  ClipboardList,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { AiRequestHistory } from "@/types";
import {
  AiRequestDetailDialog,
  type AiRequestDetail,
} from "@/components/ai-request-detail-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AiHistoryPage() {
  const [requests, setRequests] = useState<AiRequestHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedRequest, setSelectedRequest] =
    useState<AiRequestDetail | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();

  // Debug: Check user info on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      console.log("Token exists:", !!token);
      console.log("User info:", userStr ? JSON.parse(userStr) : null);
    }
  }, []);

  // Fetch AI request history from backend
  useEffect(() => {
    fetchAiRequestHistory();
  }, [filter, searchQuery, page]);

  const fetchAiRequestHistory = async () => {
    setIsLoading(true);
    try {
      const { getAiRequestHistory } = await import("@/features/ai/api");
      
      // Debug: log filter value
      console.log("Current filter:", filter);
      
      const response = await getAiRequestHistory({
        type: filter !== "All" ? filter : undefined,
        search: searchQuery || undefined,
        page,
        limit,
      });

      console.log("API Response:", response); // Debug log

      if (response.success && response.data) {
        // Map prompt to request for display
        const mappedData = response.data.map((item: any) => ({
          ...item,
          request: item.prompt || item.request, // Use prompt from backend, fallback to request
        }));
        console.log("Mapped history data:", mappedData); // Debug log
        setRequests(mappedData);
        setTotal(response.pagination?.total || 0);
      } else {
        console.error("Response not successful:", response);
      }
    } catch (error) {
      console.error("Failed to fetch AI history:", error);
      toast({
        title: "Error",
        description: "Failed to load AI request history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (requestId: number) => {
    try {
      const { getAiRequestDetails } = await import("@/features/ai/api");
      console.log("Fetching details for requestId:", requestId); // Debug
      const response = await getAiRequestDetails(requestId);
      console.log("Detail response:", response); // Debug

      if (response.success && response.data) {
        // Map backend fields to frontend expectations
        const mappedDetail = {
          ...response.data,
          request: response.data.prompt || response.data.request,
          requestType: (response.data.requestType || "").replace("Generate", ""),
        };
        console.log("Mapped detail:", mappedDetail); // Debug
        setSelectedRequest(mappedDetail as AiRequestDetail);
        setShowDetailDialog(true);
      } else {
        throw new Error("Failed to fetch request details");
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    // Normalize type to handle both formats
    const normalizedType = type.replace('Generate', '');
    
    switch (normalizedType) {
      case "LessonPlan":
        return <BookOpen className="h-4 w-4" />;
      case "Question":
      case "Questions":
        return <HelpCircle className="h-4 w-4" />;
      case "Quiz":
        return <ClipboardList className="h-4 w-4" />;
      case "Chat":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    // Normalize status to match backend
    const normalizedStatus = status === 'Success' ? 'Completed' : status;
    
    switch (normalizedStatus) {
      case "Completed":
        return <Badge variant="default">Completed</Badge>;
      case "Pending":
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Pending
          </Badge>
        );
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRequests = requests.filter((request) => {
    // Normalize request type for filtering
    const normalizedRequestType = request.requestType.replace('Generate', '');
    const normalizedFilter = filter.replace('Generate', '');
    
    const matchesFilter = filter === "All" || normalizedRequestType === normalizedFilter;
    const matchesSearch =
      searchQuery === "" ||
      (request.request || request.prompt || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8 text-primary" />
            AI Request History
          </h1>
          <p className="text-muted-foreground mt-2">
            View all your AI-generated content requests
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchAiRequestHistory}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Request History</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="GenerateLessonPlan">Lesson Plans</SelectItem>
                  <SelectItem value="GenerateQuestions">Questions</SelectItem>
                  <SelectItem value="GenerateQuiz">Quizzes</SelectItem>
                  <SelectItem value="Chat">Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No requests found</p>
              <p className="text-sm mt-2">
                {requests.length === 0
                  ? "Start generating content in the AI Workspace"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.requestId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(request.requestType)}
                          <span className="font-medium">
                            {request.requestType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{request.request}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {request.completedAt
                          ? new Date(request.completedAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(request.requestId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Lesson Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests.filter((r) => r.requestType.includes("LessonPlan")).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests.filter((r) => r.requestType.includes("Question")).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests.filter((r) => r.requestType.includes("Quiz")).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Request History</h3>
              <p className="text-sm text-muted-foreground">
                All your AI-generated content is saved here. You can view
                details, download lesson plans, and access generated questions
                and quizzes at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <AiRequestDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        request={selectedRequest}
      />
    </div>
  );
}
