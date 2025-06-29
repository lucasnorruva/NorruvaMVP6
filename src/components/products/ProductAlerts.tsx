"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductNotification {
  id: string;
  type: "info" | "warning" | "error";
  message: string;
  date: string; // ISO String
}

interface ProductAlertsProps {
  notifications: ProductNotification[];
}

const ProductAlerts: React.FC<ProductAlertsProps> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return null; // Don't render anything if there are no notifications
  }

  const getIconAndClass = (type: ProductNotification["type"]) => {
    switch (type) {
      case "error":
        return {
          Icon: AlertTriangle,
          className: "text-destructive",
          alertVariant: "destructive" as const,
        };
      case "warning":
        return {
          Icon: BellRing,
          className: "text-orange-500",
          alertVariant: "default" as const,
          alertClass: "bg-orange-500/10 border-orange-500/50",
        };
      case "info":
      default:
        return {
          Icon: Info,
          className: "text-blue-500",
          alertVariant: "default" as const,
          alertClass: "bg-blue-500/10 border-blue-500/50",
        };
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-headline flex items-center">
          <BellRing className="mr-2 h-5 w-5 text-primary" />
          Product Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-60 overflow-y-auto">
        {notifications.map((notification) => {
          const { Icon, className, alertVariant, alertClass } = getIconAndClass(
            notification.type,
          );
          return (
            <Alert
              key={notification.id}
              variant={alertVariant}
              className={cn(
                alertClass,
                alertVariant === "destructive" && "border-2",
              )}
            >
              <Icon className={cn("h-5 w-5", className)} />
              <AlertTitle className={cn("font-semibold capitalize", className)}>
                {notification.type}
              </AlertTitle>
              <AlertDescription>
                {notification.message}
                <span className="block text-xs text-muted-foreground mt-1">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProductAlerts;
