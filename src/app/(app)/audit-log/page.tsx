
// --- File: page.tsx (Audit Log Page) ---
// Description: Displays a mock table of system and user audit logs with filtering UI.
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListChecks, ShieldAlert, UserCircle, Info, Filter as FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO date string
  actor: string;
  actionType: string;
  details: string;
  ipAddress?: string;
  status?: 'Success' | 'Failure' | 'Info';
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: "log001", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), actor: "admin@norruva.com", actionType: "User Login", details: "Admin user logged in successfully.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log002", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), actor: "System", actionType: "DPP Generation", details: "DPP for PROD005 (Solar Powered Garden Light) generated.", status: "Success" },
  { id: "log003", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), actor: "manufacturer@acme.com", actionType: "Product Update", details: "Product PROD001 (EcoFriendly Refrigerator) description updated.", ipAddress: "203.0.113.45", status: "Success" },
  { id: "log004", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), actor: "System", actionType: "Compliance Check", details: "Automated EPREL sync for PROD001: Data Matched.", status: "Info" },
  { id: "log005", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), actor: "supplier@greenparts.co", actionType: "Document Upload", details: "Uploaded new material spec sheet 'GPS-Material-X.pdf'.", ipAddress: "198.51.100.22", status: "Success" },
  { id: "log006", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), actor: "verifier@certify.org", actionType: "DPP Verification", details: "EBSI verification for PROD002 (Smart LED Bulb) initiated.", ipAddress: "203.0.113.110", status: "Pending" as any }, // Example of a pending status not in the type
  { id: "log007", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), actor: "retailer@shopmart.com", actionType: "API Access", details: "Accessed DPP data for PROD001 via API.", ipAddress: "192.0.2.88", status: "Success" },
  { id: "log008", timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), actor: "System", actionType: "Security Alert", details: "Failed login attempt for user 'unknown@example.com'.", ipAddress: "10.0.0.5", status: "Failure" },
  { id: "log009", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), actor: "admin@norruva.com", actionType: "User Role Change", details: "User 'bob@example.com' role changed from Supplier to Manufacturer.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log010", timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), actor: "System", actionType: "System Maintenance", details: "Scheduled database optimization completed.", status: "Info" },
];


export default function AuditLogPage() {
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", actor: "", actionType: "all" });

  const uniqueActionTypes = useMemo(() => {
    const types = new Set(mockAuditLogs.map(log => log.actionType));
    return ["all", ...Array.from(types).sort()];
  }, []);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // In a real app, you would re-fetch or re-filter data here
  };

  const getStatusBadge = (status?: 'Success' | 'Failure' | 'Info' | 'Pending') => {
    if (!status) return null;
    let variant: "default" | "destructive" | "outline" | "secondary" = "secondary";
    let className = "bg-muted text-muted-foreground";
    let Icon = Info;

    switch (status) {
      case 'Success':
        variant = "default";
        className = "bg-green-100 text-green-700 border-green-300";
        Icon = ListChecks;
        break;
      case 'Failure':
        variant = "destructive";
        className = "bg-red-100 text-red-700 border-red-300";
        Icon = ShieldAlert;
        break;
      case 'Pending':
        variant = "outline";
        className = "bg-yellow-100 text-yellow-700 border-yellow-300";
        Icon = Info;
        break;
      case 'Info':
      default:
        variant = "outline";
        className = "bg-blue-100 text-blue-700 border-blue-300";
        Icon = UserCircle; 
        break;
    }
    return <Badge variant={variant} className={cn("capitalize text-xs", className)}><Icon className="mr-1 h-3 w-3"/>{status}</Badge>;
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">System Audit Log</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <FilterIcon className="mr-3 h-5 w-5 text-primary" />
            Filter Audit Logs
          </CardTitle>
          <CardDescription>Refine the list of audit logs using the filters below. (Mock UI - filters are not functional)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="dateFrom">Date From</Label>
            <Input 
              id="dateFrom" 
              type="text" 
              placeholder="YYYY-MM-DD" 
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dateTo">Date To</Label>
            <Input 
              id="dateTo" 
              type="text" 
              placeholder="YYYY-MM-DD" 
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="actor">Actor</Label>
            <Input 
              id="actor" 
              placeholder="e.g., admin@norruva.com" 
              value={filters.actor}
              onChange={(e) => handleFilterChange('actor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="actionType">Action Type</Label>
            <Select value={filters.actionType} onValueChange={(value) => handleFilterChange('actionType', value)}>
              <SelectTrigger id="actionType">
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {uniqueActionTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Action Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <ListChecks className="mr-3 h-6 w-6 text-primary" />
            Activity Records
          </CardTitle>
          <CardDescription>
            A chronological record of system events and user actions within the Norruva platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Actor</TableHead>
                <TableHead className="w-[150px]">Action Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[120px]">IP Address</TableHead>
                <TableHead className="w-[120px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.actor}</TableCell>
                  <TableCell>{log.actionType}</TableCell>
                  <TableCell className="text-sm">{log.details}</TableCell>
                  <TableCell className="text-xs font-mono">{log.ipAddress || "N/A"}</TableCell>
                  <TableCell className="text-right">{getStatusBadge(log.status as any)}</TableCell>
                </TableRow>
              ))}
              {mockAuditLogs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No audit logs available.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
