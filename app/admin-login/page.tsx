"use client";

import { Shield, AlertCircle } from "lucide-react";
import { Suspense, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const { loginState, updateField, handleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("err");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(loginState.isLoading);
    await handleLogin("Admin");
    setLoading(loginState.isLoading);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-slate-700 bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-blue-100 rounded-full shadow-sm">
              <Shield className="w-8 h-8 text-blue-700" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Secure access for administrators only
          </CardDescription>
        </CardHeader>

        <CardContent>
          {(loginState.error || errorParam) && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {loginState.error || errorParam}
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={loginState.username}
                onChange={(e) => updateField("username", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginState.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-700/90 text-white py-2"
              disabled={loginState.isLoading || loading}
            >
              {loginState.isLoading || loading
                ? "Processing..."
                : "Sign in as Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
