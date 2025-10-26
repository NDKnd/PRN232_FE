"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"

export default function ExportCenter() {
  const exports = [
    { id: "1", name: "Algebra Lesson Plan", type: "DOCX", size: "2.4 MB", date: "2024-01-15" },
    { id: "2", name: "Q1 Student Report", type: "PDF", size: "1.8 MB", date: "2024-01-10" },
    { id: "3", name: "Question Bank Backup", type: "CSV", size: "512 KB", date: "2024-01-05" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Export Center</h1>
        <p className="text-muted-foreground">Export and download your lesson plans and reports</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Export Lesson Plan
            </CardTitle>
            <CardDescription>Download as DOCX or PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export Now
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Export Question Bank
            </CardTitle>
            <CardDescription>Download as CSV or Excel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-accent hover:bg-accent/90">
              <Download className="w-4 h-4 mr-2" />
              Export Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Your recently exported files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exports.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{exp.name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{exp.type}</span>
                      <span>•</span>
                      <span>{exp.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.date}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
