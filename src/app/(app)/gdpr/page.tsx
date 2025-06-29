"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  FileCog,
  Trash2,
  DownloadCloud,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function GdprPage() {
  const { toast } = useToast();
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    analytics: true, // Default analytics to true
    marketing: false,
    personalization: false,
  });

  const consentItems = [
    {
      id: "analytics" as keyof ConsentSettings,
      label: "Analytics Cookies",
      description: "Allow collection of anonymized usage data.",
    },
    {
      id: "marketing" as keyof ConsentSettings,
      label: "Marketing Communications",
      description: "Receive promotional emails and offers.",
    },
    {
      id: "personalization" as keyof ConsentSettings,
      label: "Content Personalization",
      description: "Allow personalized content recommendations.",
    },
  ];

  const handleConsentChange = (
    consentId: keyof ConsentSettings,
    checked: boolean,
  ) => {
    setConsentSettings((prev) => ({ ...prev, [consentId]: checked }));
  };

  const handleSaveConsent = () => {
    // Simulate saving settings
    if (process.env.NODE_ENV !== "production") {
      console.log("Saving consent settings:", consentSettings);
    }
    toast({
      title: "Consent Settings Saved",
      description: "Your consent preferences have been updated successfully.",
      action: <CheckCircle className="text-success" />,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          GDPR Compliance Management
        </h1>
        <Button variant="outline">
          <FileCog className="mr-2 h-5 w-5" />
          View Audit Log
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <ShieldCheck className="mr-3 h-6 w-6 text-primary" /> Consent
            Management
          </CardTitle>
          <CardDescription>
            Manage user consent preferences for data processing activities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {consentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-background"
            >
              <div>
                <Label htmlFor={item.id} className="text-base font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch
                id={item.id}
                checked={consentSettings[item.id]}
                onCheckedChange={(checked) =>
                  handleConsentChange(item.id, checked)
                }
                aria-label={item.label}
              />
            </div>
          ))}
          <Button
            onClick={handleSaveConsent}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Consent Settings
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Trash2 className="mr-3 h-6 w-6 text-destructive" /> Data Deletion
              Requests
            </CardTitle>
            <CardDescription>
              Process and manage user requests for data deletion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="userIdDeletion">User ID for Deletion</Label>
            <Input id="userIdDeletion" placeholder="Enter User ID or Email" />
            <Button variant="destructive" className="w-full">
              Request Data Deletion
            </Button>
            <p className="text-xs text-muted-foreground">
              All data associated with the user ID will be permanently deleted
              in accordance with GDPR.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <DownloadCloud className="mr-3 h-6 w-6 text-accent" /> Data
              Portability
            </CardTitle>
            <CardDescription>
              Provide users with their data in a portable format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="userIdPortability">User ID for Data Export</Label>
            <Input
              id="userIdPortability"
              placeholder="Enter User ID or Email"
            />
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Export User Data
            </Button>
            <p className="text-xs text-muted-foreground">
              User data will be compiled and made available for download in a
              common machine-readable format.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">
            Data Processing Register
          </CardTitle>
          <CardDescription>
            Maintain a record of all data processing activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Data Processing Register is maintained internally and regularly
            audited. Contact the DPO for access.
          </p>
          <Button variant="link" className="p-0 h-auto mt-2">
            Contact Data Protection Officer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
