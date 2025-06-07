// --- File: LifecycleTab.tsx ---
// Description: Displays product lifecycle events in a vertical timeline format.
"use client";

import type { SimpleProductDetail, SimpleLifecycleEvent } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react"; // Import all icons

interface LifecycleTabProps {
  product: SimpleProductDetail;
}

const getStatusBadgeVariant = (status: SimpleLifecycleEvent['status']): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case 'Completed':
      return "default";
    case 'In Progress':
      return "outline"; // Use outline for in-progress, often styled with blue/yellow
    case 'Upcoming':
      return "secondary";
    case 'Delayed':
      return "destructive"; // Use destructive for delayed
    case 'Cancelled':
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusBadgeClasses = (status: SimpleLifecycleEvent['status']) => {
    switch (status) {
        case 'Completed': return "bg-green-100 text-green-700 border-green-300";
        case 'In Progress': return "bg-blue-100 text-blue-700 border-blue-300";
        case 'Upcoming': return "bg-gray-100 text-gray-700 border-gray-300";
        case 'Delayed': return "bg-orange-100 text-orange-700 border-orange-300";
        case 'Cancelled': return "bg-red-100 text-red-700 border-red-300";
        default: return "bg-muted text-muted-foreground";
    }
};

const getIconComponent = (iconName?: keyof typeof LucideIcons): React.ElementType => {
  if (iconName && LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  return LucideIcons.Circle; // Default icon
};

export default function LifecycleTab({ product }: LifecycleTabProps) {
  if (!product.lifecycleEvents || product.lifecycleEvents.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <LucideIcons.History className="mr-2 h-5 w-5 text-primary" /> Product Lifecycle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No lifecycle events recorded for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <LucideIcons.History className="mr-2 h-5 w-5 text-primary" /> Product Lifecycle Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-6">
          {/* Vertical timeline line */}
          <div className="absolute left-[calc(0.75rem-1px)] top-2 bottom-2 w-0.5 bg-border rounded-full -translate-x-1/2"></div>

          {product.lifecycleEvents.map((event, index) => {
            const IconComponent = getIconComponent(event.iconName);
            const isLastEvent = index === product.lifecycleEvents!.length - 1;
            return (
              <div key={event.id} className="relative flex items-start">
                {/* Icon and circle for the timeline point */}
                <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 bg-card border-2 border-primary rounded-full -translate-x-1/2 z-10">
                  <IconComponent className="h-3 w-3 text-primary" />
                </div>
                
                {/* Event details card */}
                <div className={cn("ml-8 w-full p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow", isLastEvent ? "mb-0" : "mb-4")}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-md text-foreground">{event.eventName}</h4>
                    <Badge variant={getStatusBadgeVariant(event.status)} className={cn("text-xs", getStatusBadgeClasses(event.status))}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(event.date).toLocaleDateString()} {event.location && ` - ${event.location}`}
                  </p>
                  {event.notes && <p className="text-sm text-foreground/80">{event.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
