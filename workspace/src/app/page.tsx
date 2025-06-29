"use client"; // Add this because we'll use client-side hooks and state

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import React, { useState } from "react"; // Import useState for managing selected role
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // For styling the login section
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole, type UserRole } from "@/contexts/RoleContext"; // Import useRole context

const formatRoleNameForDisplay = (role: UserRole): string => {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function HomePage() {
  const router = useRouter();
  const { setCurrentRole, availableRoles } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(availableRoles[0]); // Default to the first role

  const handleLogin = () => {
    if (selectedRole) {
      setCurrentRole(selectedRole);
      router.push("/dashboard"); // Navigate to generic dashboard, which will redirect
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center">
      <div className="mb-12">
        <Logo className="h-16 w-auto text-primary" />
      </div>
      <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary">
        Norruva Digital Product Passport
      </h1>
      <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10">
        Securely manage your product data, ensure EU compliance, and harness the
        power of AI for streamlined operations.
      </p>

      <Card className="w-full max-w-md shadow-xl bg-card mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center justify-center text-primary">
            <LogIn className="mr-2 h-6 w-6" /> Access Your Dashboard
          </CardTitle>
          <CardDescription className="text-center">
            Select your role to proceed to your tailored dashboard experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role-select" className="text-left">
              Select Your Role
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger
                id="role-select"
                className="w-full"
                data-testid="role-select-trigger"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatRoleNameForDisplay(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            data-testid="login-button"
          >
            Login as {formatRoleNameForDisplay(selectedRole)}
          </Button>
        </CardContent>
      </Card>

      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Norruva. All rights reserved.
      </footer>
    </div>
  );
}
