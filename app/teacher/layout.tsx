import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { AuthCheck } from "@/components/auth-check"
import { AiChatBox } from "@/components/ai-chat-box"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck requiredRole="teacher">
      <div className="flex h-screen">
        <SidebarNav role="teacher" />
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
        <AiChatBox />
      </div>
    </AuthCheck>
  )
}
