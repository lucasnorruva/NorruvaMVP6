
// --- File: src/components/developer/dashboard/PlatformNewsCard.tsx ---
// Description: Component for displaying platform news and announcements.

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  date: string;
  title: string;
  summary: string;
  link: string;
}

interface PlatformNewsCardProps {
  announcements: Announcement[];
}

export default function PlatformNewsCard({ announcements }: PlatformNewsCardProps) {
  return (
    <Card className="shadow-md lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Megaphone className="mr-2 h-5 w-5 text-primary" /> Platform News &amp; Announcements
        </CardTitle>
        <CardDescription>Stay updated with the latest from Norruva.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm max-h-72 overflow-y-auto">
        {announcements.map(ann => (
          <div key={ann.id} className="p-2.5 border-b last:border-b-0">
            <h4 className="font-semibold text-foreground">{ann.title} <span className="text-xs text-muted-foreground font-normal">- {ann.date}</span></h4>
            <p className="text-xs text-muted-foreground mt-0.5">{ann.summary}</p>
            {ann.link !== "#" ? (
              <Link href={ann.link} passHref>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs mt-1">
                  Learn More <ExternalLinkIcon className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs mt-1" disabled>
                Learn More
              </Button>
            )}
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No recent announcements.</p>
        )}
      </CardContent>
    </Card>
  );
}

