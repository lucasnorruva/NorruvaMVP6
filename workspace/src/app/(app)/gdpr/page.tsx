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
  Mail,
  UserCircle as UserCircleIcon,
} from "lucide-react"; // Renamed UserCircle to UserCircleIcon
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link"; // Added Link import

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function GdprPage() {
  const { toast } = useToast();
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    analytics: true,
    marketing: false,
    personalization: false,
  });
  const [deletionUserId, setDeletionUserId] = useState("");
  const [exportUserId, setExportUserId] = useState("");

  const consentItems = [
    {
      id: "analytics" as keyof ConsentSettings,
      label: "Analytics Cookies",
      description:
        "Allow collection of anonymized usage data to improve our services.",
    },
    {
      id: "marketing" as keyof ConsentSettings,
      label: "Marketing Communications",
      description:
        "Receive promotional emails, newsletters, and special offers.",
    },
    {
      id: "personalization" as keyof ConsentSettings,
      label: "Content Personalization",
      description:
        "Allow us to tailor content and recommendations based on your activity.",
    },
  ];

  const handleConsentChange = (
    consentId: keyof ConsentSettings,
    checked: boolean,
  ) => {
    setConsentSettings((prev) => ({ ...prev, [consentId]: checked }));
  };

  const handleSaveConsent = () => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("Saving consent settings (mock):", consentSettings);
    }
    toast({
      title: "Consent Settings Saved",
      description:
        "Your consent preferences have been updated successfully (mock).",
      action: <CheckCircle className="text-success" />,
    });
  };

  const handleRequestDeletion = () => {
    if (!deletionUserId.trim()) {
      toast({
        title: "User ID Required",
        description: "Please enter a User ID or Email for data deletion.",
        variant: "destructive",
      });
      return;
    }
    // Simulate request
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`Data deletion requested for user: ${deletionUserId}`);
    }
    toast({
      title: "Data Deletion Request Submitted",
      description: `Your request to delete data for user "${deletionUserId}" has been received (mock).`,
      action: <CheckCircle className="text-success" />,
    });
    setDeletionUserId(""); // Clear input
  };

  const handleRequestExport = () => {
    if (!exportUserId.trim()) {
      toast({
        title: "User ID Required",
        description: "Please enter a User ID or Email for data export.",
        variant: "destructive",
      });
      return;
    }
    // Simulate request
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`Data export requested for user: ${exportUserId}`);
    }
    toast({
      title: "Data Export Initiated",
      description: `Data export for user "${exportUserId}" has been initiated (mock). You will be notified when it's ready.`,
      action: <CheckCircle className="text-success" />,
    });
    setExportUserId(""); // Clear input
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          GDPR Compliance Management
        </h1>
        <Button variant="outline" asChild>
          <Link href="/audit-log">
            <FileCog className="mr-2 h-5 w-5" />
            View Audit Log (Conceptual)
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <ShieldCheck className="mr-3 h-6 w-6 text-primary" /> Consent
            Management
          </CardTitle>
          <CardDescription>
            Manage user consent preferences for data processing activities. Your
            choices here are simulated and will not affect actual platform
            behavior.
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
              Process and manage user requests for data deletion (mock
              functionality).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="userIdDeletion">
              User ID or Email for Deletion
            </Label>
            <Input
              id="userIdDeletion"
              placeholder="Enter User ID or Email"
              value={deletionUserId}
              onChange={(e) => setDeletionUserId(e.target.value)}
            />
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRequestDeletion}
            >
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
              Provide users with their data in a portable format (mock
              functionality).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="userIdPortability">
              User ID or Email for Export
            </Label>
            <Input
              id="userIdPortability"
              placeholder="Enter User ID or Email"
              value={exportUserId}
              onChange={(e) => setExportUserId(e.target.value)}
            />
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleRequestExport}
            >
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
          <CardTitle className="font-headline flex items-center">
            <UserCircleIcon className="mr-3 h-6 w-6 text-primary" />
            Data Protection Officer (DPO)
          </CardTitle>
          <CardDescription>
            Contact our DPO for any data protection inquiries or concerns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Data Processing Register is maintained internally and regularly
            audited.
          </p>
          <Button variant="link" className="p-0 h-auto mt-2" asChild>
            <a href="mailto:dpo@norruva-mock.com">
              <Mail className="mr-2 h-4 w-4" /> Contact Data Protection Officer
              (dpo@norruva-mock.com)
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
