"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

export default function StudentSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and learning preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Jane" defaultValue="Jane" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Smith" defaultValue="Smith" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" />
          </div>
          <div>
            <Label htmlFor="grade">Grade Level</Label>
            <Input id="grade" placeholder="10" defaultValue="10" />
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Preferences</CardTitle>
          <CardDescription>Customize your learning experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="difficulty">Preferred Difficulty</Label>
            <select
              id="difficulty"
              defaultValue="medium"
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Email Notifications</Label>
            <input type="checkbox" id="notifications" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-feedback">AI Feedback</Label>
            <input type="checkbox" id="ai-feedback" defaultChecked className="w-4 h-4" />
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
