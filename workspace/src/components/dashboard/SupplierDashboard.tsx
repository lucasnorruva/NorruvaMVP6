
// --- File: src/components/dashboard/SupplierDashboard.tsx ---
"use client";

import React, { useState } from 'react'; // Added useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Layers, Inbox, FileText, AlertTriangle, MessageSquare, CheckCircle, Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupplierQuickActionsCard } from "./SupplierQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface DataRequest {
  id: string;
  manufacturer: string;
  productId: string;
  component: string;
  requestedData: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
}

interface SubmittedDoc {
  id: string;
  docName: string;
  productId?: string;
  component?: string;
  submittedDate: string;
}

const mockDataRequests: DataRequest[] = [
  { id: "REQ001", manufacturer: "GreenTech Appliances", productId: "PROD001", component: "Compressor Unit XJ-500", requestedData: "Updated RoHS Declaration", dueDate: "2024-08-15", status: "Pending" },
  { id: "REQ002", manufacturer: "PowerVolt", productId: "PROD005", component: "Battery Cells Series B", requestedData: "Recycled Content Verification (Cobalt)", dueDate: "2024-08-10", status: "Overdue" },
  { id: "REQ003", manufacturer: "BrightSpark Electronics", productId: "PROD002", component: "LED Driver Module v3", requestedData: "Conflict Minerals Report Update", dueDate: "2024-07-30", status: "Submitted" },
];

const mockSubmittedDocs: SubmittedDoc[] = [
  { id: "SUB001", docName: "RoHS Declaration - Compressor XJ-500 Rev2.pdf", productId: "PROD001", submittedDate: "2024-07-28" },
  { id: "SUB002", docName: "Material Spec - Polymer Grade XYZ.docx", component: "Phone Case Housing Material", submittedDate: "2024-07-25" },
  { id: "SUB003", docName: "Organic Cotton GOTS Cert 2024.pdf", productId: "PROD002", submittedDate: "2024-07-20" },
];


export const SupplierDashboard = () => {
  const { toast } = useToast(); // Initialize toast
  const keyMetrics = [
    { title: "Active Data Requests", value: mockDataRequests.filter(r => r.status === 'Pending' || r.status === 'Overdue').length, icon: Inbox, color: "text-info", description: "From Manufacturers" },
    { title: "Submitted Compliance Declarations", value: mockSubmittedDocs.length + 84, icon: FileText, color: "text-green-600", description: "Total Submitted (Mock)" },
    { title: "Materials Awaiting Update", value: "3", icon: AlertTriangle, color: "text-orange-500", description: "Spec Update Needed (Mock)" },
  ];

  const notifications = [
    { id: "n1", text: "Manufacturer 'GreenTech' requests updated specs for 'Component X'.", time: "2h ago" },
    { id: "n2", text: "Reminder: 'Polymer Z' safety data sheet due next week.", time: "1d ago" },
    { id: "n3", text: "New compliance standard for 'Recycled Plastics' published. Review impact.", time: "3d ago" },
  ];

  const handleRespondToRequest = (requestId: string) => {
    toast({
      title: "Respond to Data Request (Mock)",
      description: `Opening response form for Request ID: ${requestId}. This is a conceptual action.`,
    });
    // In a real app, this would open a dialog or navigate to a response page.
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Layers className="mr-2 text-primary"/>Supplier Data Hub</CardTitle>
          <CardDescription>Provide and manage critical data for the products you supply.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyMetrics.map(metric => (
            <Card key={metric.title} className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <metric.icon className={`mr-2 h-5 w-5 ${metric.color}`} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metric.value}</p>
                {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <SupplierQuickActionsCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Inbox className="mr-2 h-5 w-5 text-primary" />Incoming Data Requests</CardTitle>
          <CardDescription>Respond to requests for information from manufacturers.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockDataRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Product/Component</TableHead>
                  <TableHead>Requested Data</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDataRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.id}</TableCell>
                    <TableCell>{req.manufacturer}</TableCell>
                    <TableCell className="text-xs">{req.productId ? `Product: ${req.productId}` : ''}{req.productId && req.component ? ' - ' : ''}{req.component || ''}</TableCell>
                    <TableCell className="text-xs">{req.requestedData}</TableCell>
                    <TableCell>{new Date(req.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        req.status === 'Submitted' ? 'default' : 
                        req.status === 'Pending' ? 'outline' : 'destructive'
                      } className={
                        req.status === 'Submitted' ? 'bg-green-100 text-green-700 border-green-300' :
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                        'bg-red-100 text-red-700 border-red-300'
                      }>
                        {req.status === 'Submitted' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {req.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                        {req.status === 'Overdue' && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => handleRespondToRequest(req.id)}>
                          Respond
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No active data requests.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Recently Submitted Documents</CardTitle>
 <CardDescription>A log of your recent data submissions.</CardDescription>
        </CardContent>
        <CardContent>
          {mockSubmittedDocs.length > 0 ? (
            <ul className="space-y-3">
              {mockSubmittedDocs.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.docName}</p>
                    <p className="text-xs text-muted-foreground">
                      For: {doc.productId ? `Product ID ${doc.productId}` : ''}{doc.productId && doc.component ? ' - ' : ''}{doc.component || 'General'} | Submitted: {new Date(doc.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                   <Badge variant="secondary">Processed</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No documents submitted recently.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Notifications & Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map(notif => (
                <li key={notif.id} className="flex items-start justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30">
                  <p className="text-sm text-foreground/90 flex-grow pr-2">{notif.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No new notifications or recent activity.</p>
          )}
        </CardContent>
      </Card>

      <RegulationUpdatesCard />
    </div>
  );
};
