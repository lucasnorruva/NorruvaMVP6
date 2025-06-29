"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Layers,
  Inbox,
  FileText,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { SupplierQuickActionsCard } from "./SupplierQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";

export const SupplierDashboard = () => {
  const keyMetrics = [
    {
      title: "Active Data Requests",
      value: "5",
      icon: Inbox,
      color: "text-info",
      description: "From Manufacturers",
    },
    {
      title: "Submitted Compliance Declarations",
      value: "87",
      icon: FileText,
      color: "text-green-600",
      description: "Total Submitted",
    },
    {
      title: "Materials Awaiting Update",
      value: "3",
      icon: AlertTriangle,
      color: "text-orange-500",
      description: "Spec Update Needed",
    },
  ];

  const notifications = [
    {
      id: "n1",
      text: "Manufacturer 'GreenTech' requests updated specs for 'Component X'.",
      time: "2h ago",
    },
    {
      id: "n2",
      text: "Reminder: 'Polymer Z' safety data sheet due next week.",
      time: "1d ago",
    },
    {
      id: "n3",
      text: "New compliance standard for 'Recycled Plastics' published. Review impact.",
      time: "3d ago",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Layers className="mr-2 text-primary" />
            Supplier Data Hub
          </CardTitle>
          <CardDescription>
            Provide and manage critical data for the products you supply.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyMetrics.map((metric) => (
            <Card key={metric.title} className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <metric.icon className={`mr-2 h-5 w-5 ${metric.color}`} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metric.value}</p>
                {metric.description && (
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <SupplierQuickActionsCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Notifications & Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className="flex items-start justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30"
                >
                  <p className="text-sm text-foreground/90 flex-grow pr-2">
                    {notif.text}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notif.time}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No new notifications or recent activity.
            </p>
          )}
        </CardContent>
      </Card>

      <RegulationUpdatesCard />
    </div>
  );
};
