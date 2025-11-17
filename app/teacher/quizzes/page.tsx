    "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { quizApi } from "@/lib/api/quiz";
import type { Quiz, QuizSearchParams } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  BarChart3,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const loadQuizzes = async (params?: QuizSearchParams) => {
    try {
      setLoading(true);
      const response = await quizApi.getMyQuizzes(
        params?.page || pagination.page,
        params?.limit || pagination.limit
      );

      if (response.success && response.data) {
        setQuizzes(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        toast.error(response.error?.message || "Failed to load quizzes");
      }
    } catch (error) {
      toast.error("An error occurred while loading quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleSearch = () => {
    loadQuizzes({ keyword: searchKeyword, page: 1 });
  };

  const handlePublish = async (quizId: number) => {
    try {
      const response = await quizApi.publishQuiz(quizId);
      if (response.success) {
        toast.success("Quiz published successfully");
        loadQuizzes();
      } else {
        toast.error(response.error?.message || "Failed to publish quiz");
      }
    } catch (error) {
      toast.error("An error occurred while publishing quiz");
    }
  };

  const handleUnpublish = async (quizId: number) => {
    try {
      const response = await quizApi.unpublishQuiz(quizId);
      if (response.success) {
        toast.success("Quiz unpublished successfully");
        loadQuizzes();
      } else {
        toast.error(response.error?.message || "Failed to unpublish quiz");
      }
    } catch (error) {
      toast.error("An error occurred while unpublishing quiz");
    }
  };

  const handleDelete = async () => {
    if (!selectedQuizId) return;

    try {
      const response = await quizApi.deleteQuiz(selectedQuizId);
      if (response.success) {
        toast.success("Quiz deleted successfully");
        setDeleteDialogOpen(false);
        loadQuizzes();
      } else {
        toast.error(response.error?.message || "Failed to delete quiz");
      }
    } catch (error) {
      toast.error("An error occurred while deleting quiz");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge variant="default">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Deleted":
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground">
            Manage your quizzes and track student performance
          </p>
        </div>
        <Button onClick={() => router.push("/teacher/quizzes/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Quizzes</CardTitle>
          <CardDescription>
            Find quizzes by title or filter by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz List</CardTitle>
          <CardDescription>
            {pagination.total} total quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No quizzes found</p>
              <Button
                variant="link"
                onClick={() => router.push("/teacher/quizzes/create")}
              >
                Create your first quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.quizId}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.levelName}</TableCell>
                    <TableCell>{quiz.questionCount}</TableCell>
                    <TableCell>{quiz.timeLimit} min</TableCell>
                    <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                    <TableCell>{quiz.submissionCount}</TableCell>
                    <TableCell>
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/teacher/quizzes/${quiz.quizId}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {quiz.status === "Draft" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/teacher/quizzes/${quiz.quizId}/edit`
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handlePublish(quiz.quizId)}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            </>
                          )}
                          {quiz.status === "Published" && (
                            <DropdownMenuItem
                              onClick={() => handleUnpublish(quiz.quizId)}
                            >
                              <PauseCircle className="mr-2 h-4 w-4" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/teacher/quizzes/${quiz.quizId}/statistics`
                              )
                            }
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Statistics
                          </DropdownMenuItem>
                          {quiz.status !== "Deleted" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedQuizId(quiz.quizId);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
