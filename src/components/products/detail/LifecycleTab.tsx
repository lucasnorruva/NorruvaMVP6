
// --- File: LifecycleTab.tsx ---
// Description: Displays product lifecycle events in a vertical timeline format.
"use client";

import type { SimpleProductDetail, SimpleLifecycleEvent } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react"; 
import React, { useState, useRef } from "react"; 
import { useToast } from "@/hooks/use-toast";
import { checkProductCompliance } from "@/ai/flows/check-product-compliance-flow";
import { suggestMaintenanceSchedule, type MaintenanceSuggestion } from "@/ai/flows/suggest-maintenance-schedule"; // Import AI flow
import { Loader2, AlertTriangle as AlertTriangleIcon, Bot, Wrench } from "lucide-react"; // Renamed AlertTriangle to AlertTriangleIcon
import {
  DppLifecycleStateMachine,
  DppLifecycleState,
  ALLOWED_TRANSITIONS,
} from '@/utils/dppLifecycleStateMachine';

interface LifecycleTabProps {
  product: SimpleProductDetail;
}

const getStatusBadgeVariant = (status: SimpleLifecycleEvent['status']): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case 'Completed':
      return "default";
    case 'In Progress':
      return "outline"; 
    case 'Upcoming':
      return "secondary";
    case 'Delayed':
      return "destructive"; 
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
  return LucideIcons.Circle; 
};

export default function LifecycleTab({ product }: LifecycleTabProps) {
  const { toast } = useToast();
  const [isLoadingComplianceCheck, setIsLoadingComplianceCheck] = useState<string | null>(null);
  const lifecycleMachineRef = useRef<DppLifecycleStateMachine>(
    new DppLifecycleStateMachine(DppLifecycleState.DESIGN)
  );

  const [maintenanceSuggestion, setMaintenanceSuggestion] = useState<MaintenanceSuggestion | null>(null);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null);


  const handleAdvanceStage = async (targetEvent: SimpleLifecycleEvent, currentIndex: number) => {
    if (!product.lifecycleEvents) return;

    setIsLoadingComplianceCheck(targetEvent.id);
    
    let currentLifecycleStageName = "Initial Product Phase"; 
    if (currentIndex > 0) {
        let foundPreviousStage = false;
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (product.lifecycleEvents[i].status === 'Completed' || product.lifecycleEvents[i].status === 'In Progress') {
                currentLifecycleStageName = product.lifecycleEvents[i].eventName;
                foundPreviousStage = true;
                break;
            }
        }
        if (!foundPreviousStage) {
           currentLifecycleStageName = product.lifecycleEvents[currentIndex - 1]?.eventName || "Pre-Production / Design";
        }
    } else if (currentIndex === 0 && (targetEvent.status === 'Upcoming' || targetEvent.status === 'In Progress')) {
        currentLifecycleStageName = "Pre-Production / Design";
    }


    try {
      const complianceResult = await checkProductCompliance({
        productId: product.id,
        productCategory: product.category,
        currentLifecycleStageName: currentLifecycleStageName,
        newLifecycleStageName: targetEvent.eventName,
      });

      const machine = lifecycleMachineRef.current;
      const nextStates = ALLOWED_TRANSITIONS[machine.getCurrentState()];
      if (nextStates.length > 0) {
        try {
          machine.transition(nextStates[0]);
        } catch (err) {
          console.error('Lifecycle transition failed:', err);
        }
      }

      toast({
        title: `Compliance Check: Advancing to ${targetEvent.eventName}`,
        description: (
          <div className="text-sm space-y-2">
            <p className="font-semibold">New Simulated Status: <span className="text-primary">{complianceResult.simulatedOverallStatus}</span></p>
            <div>
              <p className="text-sm font-semibold mb-1">Simulated Report:</p>
              <p className="text-xs bg-muted p-2 rounded-md whitespace-pre-line max-h-40 overflow-y-auto">{complianceResult.simulatedReport}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">(This is a mock advancement. In a real app, product status would update.)</p>
          </div>
        ),
        duration: 15000, 
      });

    } catch (error) {
      console.error("Compliance check failed:", error);
      toast({
        variant: "destructive",
        title: "Compliance Check Error",
        description: `Could not simulate compliance re-check for ${targetEvent.eventName}. ${error instanceof Error ? error.message : ''}`,
      });
    } finally {
      setIsLoadingComplianceCheck(null);
    }
  };

  const handleGetMaintenanceSuggestions = async () => {
    setIsLoadingMaintenance(true);
    setMaintenanceSuggestion(null);
    setMaintenanceError(null);

    let ageInfo = "Age unknown";
    let referenceDateStr = product.lastUpdated; 
    const creationEvent = product.lifecycleEvents?.find(e => e.eventName.toLowerCase().includes("manufactured") || e.eventName.toLowerCase().includes("created"));
    const soldEvent = product.lifecycleEvents?.find(e => e.eventName.toLowerCase().includes("sold") || e.eventName.toLowerCase().includes("purchase"));

    if (creationEvent?.date) referenceDateStr = creationEvent.date;
    else if (soldEvent?.date) referenceDateStr = soldEvent.date;

    if (referenceDateStr) {
        const refDate = new Date(referenceDateStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - refDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30) ageInfo = `${diffDays} days old`;
        else if (diffDays < 365) ageInfo = `${Math.round(diffDays / 30)} months old`;
        else ageInfo = `${Math.round(diffDays / 365)} years old`;
    }
    const usageData = `Product Usage Context: Moderate typical usage. Approximately ${ageInfo}. Last known service: Not specified in DPP events.`;

    try {
        const suggestion = await suggestMaintenanceSchedule({
            productId: product.id,
            productName: product.productName,
            productCategory: product.category,
            usageData: usageData,
        });
        setMaintenanceSuggestion(suggestion);
        toast({
            title: "AI Maintenance Suggestions Received",
            description: "Review the suggestions below.",
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setMaintenanceError(errorMessage);
        toast({
            variant: "destructive",
            title: "Error Getting Maintenance Suggestions",
            description: errorMessage,
        });
    } finally {
        setIsLoadingMaintenance(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <LucideIcons.History className="mr-2 h-5 w-5 text-primary" /> Product Lifecycle Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!product.lifecycleEvents || product.lifecycleEvents.length === 0) ? (
            <p className="text-muted-foreground">No lifecycle events recorded for this product.</p>
          ) : (
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[calc(0.75rem-1px)] top-2 bottom-2 w-0.5 bg-border rounded-full -translate-x-1/2"></div>
              {product.lifecycleEvents.map((event, index) => {
                const IconComponent = getIconComponent(event.iconName);
                const canAdvance = (event.status === 'Upcoming' || event.status === 'In Progress');
                
                return (
                  <div key={event.id} className="relative flex items-start">
                    <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 bg-card border-2 border-primary rounded-full -translate-x-1/2 z-10">
                      <IconComponent className="h-3 w-3 text-primary" />
                    </div>
                    <div className={cn(
                      "ml-8 w-full p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow"
                    )}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5">
                        <h4 className="font-semibold text-md text-foreground">{event.eventName}</h4>
                        <Badge 
                          variant={getStatusBadgeVariant(event.status)} 
                          className={cn("text-xs capitalize mt-1 sm:mt-0", getStatusBadgeClasses(event.status))}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-x-3 gap-y-1">
                        <span className="flex items-center">
                          <LucideIcons.CalendarDays className="h-3.5 w-3.5 mr-1 text-muted-foreground/80" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <LucideIcons.MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/80" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.notes && <p className="text-sm text-foreground/80 mb-3">{event.notes}</p>}
                      {canAdvance && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 text-xs"
                          onClick={() => handleAdvanceStage(event, index)}
                          disabled={isLoadingComplianceCheck === event.id}
                        >
                          {isLoadingComplianceCheck === event.id ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <LucideIcons.ChevronsRight className="mr-1.5 h-3.5 w-3.5 text-primary" />
                          )}
                          {isLoadingComplianceCheck === event.id ? "Simulating..." : "Simulate Advance & Compliance"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" /> AI Predictive Maintenance Advisor
          </CardTitle>
          <CardDescription>Get AI-powered suggestions for product maintenance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGetMaintenanceSuggestions} disabled={isLoadingMaintenance}>
            {isLoadingMaintenance ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
            {isLoadingMaintenance ? "Getting Suggestions..." : "Get AI Maintenance Suggestions"}
          </Button>
          {isLoadingMaintenance && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching maintenance advice...
            </div>
          )}
          {maintenanceError && (
             <div className="text-sm text-destructive p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2"/> {maintenanceError}
            </div>
          )}
          {maintenanceSuggestion && !isLoadingMaintenance && (
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <div>
                <h5 className="font-semibold text-primary">Next Recommended Checkup:</h5>
                <p className="text-sm text-foreground">{maintenanceSuggestion.nextCheckupDate}</p>
              </div>
              <div>
                <h5 className="font-semibold text-primary">Suggested Actions:</h5>
                <ul className="list-disc list-inside text-sm text-foreground space-y-1 pl-4">
                  {maintenanceSuggestion.suggestedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-primary">Reasoning:</h5>
                <p className="text-sm text-foreground italic">{maintenanceSuggestion.reasoning}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    