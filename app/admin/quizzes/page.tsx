"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { quizApi } from "@/lib/api/quiz"
import { levelApi } from "@/lib/api/level"
import { Quiz, QuizStatus, Level } from "@/types/quiz.type"
import { Search, Eye, FileBarChart } from "lucide-react"
import Link from "next/link"

export default function AdminQuizzesPage() {
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => {
    loadLevels()
    loadQuizzes()
  }, [currentPage, selectedLevel, selectedStatus])

  const loadLevels = async () => {
    try {
      const response = await levelApi.getAll()
      if (response.success && response.data) {
        setLevels(response.data)
      }
    } catch (error) {
      // Silent fail for levels
    }
  }

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const params = {
        pageNumber: currentPage,
        pageSize,
        levelId: selectedLevel !== "all" ? parseInt(selectedLevel) : undefined,
        status: selectedStatus !== "all" ? (selectedStatus as QuizStatus) : undefined,
      }
      const response = await quizApi.searchQuizzes(params)
      if (response.success && response.data) {
        setQuizzes(response.data)
        if (response.pagination) {
          const totalPages = Math.ceil(response.pagination.total / pageSize)
          setTotalPages(totalPages)
        }
      } else {
        throw new Error(response.error?.message || "Failed to load quizzes")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadQuizzes()
  }

  const getStatusBadge = (status: QuizStatus) => {
    const variants = {
      Published: "default",
      Draft: "secondary",
      Deleted: "destructive",
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <p className="text-muted-foreground">View all quizzes and statistics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.levelId} value={level.levelId.toString()}>
                    {level.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Quizzes</CardTitle>
          <CardDescription>Total: {quizzes.length} quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No quizzes found</p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Time Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.quizId}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.teacherName}</TableCell>
                        <TableCell>Grade {quiz.levelId}</TableCell>
                        <TableCell>{quiz.questionCount}</TableCell>
                        <TableCell>{quiz.timeLimit} min</TableCell>
                        <TableCell>{getStatusBadge(quiz.status as QuizStatus)}</TableCell>
                        <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/quizzes/${quiz.quizId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/quizzes/${quiz.quizId}/statistics`}>
                              <Button variant="ghost" size="sm">
                                <FileBarChart className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
