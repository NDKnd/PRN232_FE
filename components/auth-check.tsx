"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/features/auth";
import type { AuthUser } from "@/features/auth";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function AuthCheck({ 
  children, 
  requiredRole,
  redirectTo = "/login" 
}: AuthCheckProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = authStorage.getToken();
      const user = authStorage.getUser();

      // Not logged in
      if (!token || !user) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const userRole = user.role.toLowerCase();
        const required = requiredRole.toLowerCase();
        
        if (userRole !== required) {
          // Redirect to appropriate dashboard
          router.push(`/${userRole}/dashboard`);
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const currentUser = authStorage.getUser();
    setUser(currentUser);
  }, []);

  return user;
}

export function useIsAuthenticated(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    setIsAuthenticated(!!token && !!user);
  }, []);

  return isAuthenticated;
}
