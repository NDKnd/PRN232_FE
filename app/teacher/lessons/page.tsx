"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  topic: string;
  grade: string;
  createdDate: string;
  status: "draft" | "published";
}

export default function LessonPlans() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Introduction to Algebra",
      topic: "Algebra",
      grade: "9",
      createdDate: "2024-01-15",
      status: "published",
    },
    {
      id: "2",
      title: "Quadratic Equations",
      topic: "Algebra",
      grade: "10",
      createdDate: "2024-01-10",
      status: "published",
    },
    {
      id: "3",
      title: "Geometry Basics",
      topic: "Geometry",
      grade: "9",
      createdDate: "2024-01-05",
      status: "draft",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setLessons(lessons.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lesson Plans</h1>
          <p className="text-muted-foreground">
            Create and manage your lesson plans
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          onClick={() => {
            router.push("/teacher/lessons/editor");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Lesson
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">No lessons found</p>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {lesson.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          lesson.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {lesson.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Topic: {lesson.topic}</span>
                      <span>Grade: {lesson.grade}</span>
                      <span>Created: {lesson.createdDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
