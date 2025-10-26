"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart3, Settings, LogOut, Menu, X, FileText, HelpCircle, Zap } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarNavProps {
  role: "teacher" | "student"
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const teacherNav: NavItem[] = [
    { label: "Dashboard", href: "/teacher/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Lesson Plans", href: "/teacher/lessons", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Question Bank", href: "/teacher/questions", icon: <HelpCircle className="w-5 h-5" /> },
    { label: "Export Center", href: "/teacher/export", icon: <FileText className="w-5 h-5" /> },
    { label: "Settings", href: "/teacher/settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Practice", href: "/student/practice", icon: <Zap className="w-5 h-5" /> },
    { label: "Progress", href: "/student/progress", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Settings", href: "/student/settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const navItems = role === "teacher" ? teacherNav : studentNav

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sidebar-primary" />
            <span className="font-bold text-lg text-sidebar-foreground">MathLearn</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent bg-transparent"
            onClick={() => (window.location.href = "/")}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
