import type React from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { AuthCheck } from "@/components/auth-check";
import { AiChatBox } from "@/components/ai-chat-box";
import { redirect } from "next/dist/client/components/navigation";
import { authStorage } from "@/features/auth/storage";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck requiredRole="student">
      <div className="flex h-screen">
        <SidebarNav role="student" />
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
        <AiChatBox />
      </div>
    </AuthCheck>
  );
}
