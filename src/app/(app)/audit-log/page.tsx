
// --- File: page.tsx (Audit Log Page) ---
// Description: Displays a mock table of system and user audit logs with filtering and pagination.
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListChecks, ShieldAlert, UserCircle, Info, Filter as FilterIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO date string
  actor: string;
  actionType: string;
  details: string;
  ipAddress?: string;
  status?: 'Success' | 'Failure' | 'Info' | 'Pending';
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: "log001", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), actor: "admin@norruva.com", actionType: "User Login", details: "Admin user logged in successfully.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log002", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), actor: "System", actionType: "DPP Generation", details: "DPP for PROD005 (Solar Powered Garden Light) generated.", status: "Success" },
  { id: "log003", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), actor: "manufacturer@acme.com", actionType: "Product Update", details: "Product PROD001 (EcoFriendly Refrigerator) description updated.", ipAddress: "203.0.113.45", status: "Success" },
  { id: "log004", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), actor: "System", actionType: "Compliance Check", details: "Automated EPREL sync for PROD001: Data Matched.", status: "Info" },
  { id: "log005", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), actor: "supplier@greenparts.co", actionType: "Document Upload", details: "Uploaded new material spec sheet 'GPS-Material-X.pdf'.", ipAddress: "198.51.100.22", status: "Success" },
  { id: "log006", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), actor: "verifier@certify.org", actionType: "DPP Verification", details: "EBSI verification for PROD002 (Smart LED Bulb) initiated.", ipAddress: "203.0.113.110", status: "Pending" },
  { id: "log007", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), actor: "retailer@shopmart.com", actionType: "API Access", details: "Accessed DPP data for PROD001 via API.", ipAddress: "192.0.2.88", status: "Success" },
  { id: "log008", timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), actor: "System", actionType: "Security Alert", details: "Failed login attempt for user 'unknown@example.com'.", ipAddress: "10.0.0.5", status: "Failure" },
  { id: "log009", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), actor: "admin@norruva.com", actionType: "User Role Change", details: "User 'bob@example.com' role changed from Supplier to Manufacturer.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log010", timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), actor: "System", actionType: "System Maintenance", details: "Scheduled database optimization completed.", status: "Info" },
  // Add 15 more diverse logs
  { id: "log011", timestamp: new Date(Date.now() - 1000 * 60 * 270).toISOString(), actor: "manufacturer@acme.com", actionType: "Product Create", details: "New product 'Smart Toaster v2' created in draft.", ipAddress: "203.0.113.45", status: "Success" },
  { id: "log012", timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), actor: "System", actionType: "Webhook Failure", details: "Webhook to 'https://partner.com/hook' failed for event 'dpp.updated'.", status: "Failure" },
  { id: "log013", timestamp: new Date(Date.now() - 1000 * 60 * 330).toISOString(), actor: "admin@norruva.com", actionType: "API Key Generated", details: "New production API key generated for 'RetailPartnerX'.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log014", timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), actor: "supplier@greenparts.co", actionType: "Data Request Response", details: "Responded to data request for 'Component Y' from 'Acme Corp'.", ipAddress: "198.51.100.22", status: "Success" },
  { id: "log015", timestamp: new Date(Date.now() - 1000 * 60 * 390).toISOString(), actor: "System", actionType: "Data Export", details: "User 'admin@norruva.com' exported compliance data for 'Appliances' category.", status: "Info" },
  { id: "log016", timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(), actor: "verifier@certify.org", actionType: "Audit Trail Accessed", details: "Accessed audit trail for product PROD001.", ipAddress: "203.0.113.110", status: "Info" },
  { id: "log017", timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(), actor: "retailer@shopmart.com", actionType: "Report Generation", details: "Generated 'Top Viewed DPPs' report for last month.", ipAddress: "192.0.2.88", status: "Success" },
  { id: "log018", timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(), actor: "System", actionType: "Backup Completed", details: "Daily platform data backup completed successfully.", status: "Success" },
  { id: "log019", timestamp: new Date(Date.now() - 1000 * 60 * 510).toISOString(), actor: "admin@norruva.com", actionType: "Configuration Change", details: "Updated GDPR consent options in platform settings.", ipAddress: "192.168.1.10", status: "Success" },
  { id: "log020", timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(), actor: "manufacturer@acme.com", actionType: "Product Archive", details: "Product 'Old Model Toaster' (PROD-OLD-001) archived.", ipAddress: "203.0.113.45", status: "Success" },
  { id: "log021", timestamp: new Date(Date.now() - 1000 * 60 * 570).toISOString(), actor: "System", actionType: "Compliance Alert", details: "Product PROD004 flagged for non-compliance review (REACH).", status: "Failure" },
  { id: "log022", timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), actor: "supplier@greenparts.co", actionType: "Password Change", details: "User changed their account password.", ipAddress: "198.51.100.22", status: "Success" },
  { id: "log023", timestamp: new Date(Date.now() - 1000 * 60 * 630).toISOString(), actor: "System", actionType: "User Invitation Sent", details: "Invitation sent to 'new.user@example.com' for 'Retailer' role.", status: "Info" },
  { id: "log024", timestamp: new Date(Date.now() - 1000 * 60 * 660).toISOString(), actor: "verifier@certify.org", actionType: "DPP Verification Rejected", details: "EBSI verification for PROD-TEST-007 rejected due to data mismatch.", ipAddress: "203.0.113.110", status: "Failure" },
  { id: "log025", timestamp: new Date(Date.now() - 1000 * 60 * 690).toISOString(), actor: "admin@norruva.com", actionType: "User Login", details: "Admin user logged in successfully from a new device.", ipAddress: "192.168.1.15", status: "Success" },
  { id: "log026", timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), actor: "System", actionType: "AI Model Update", details: "AI model for product data extraction updated to v1.2.", status: "Info" },
  { id: "log027", timestamp: new Date(Date.now() - 1000 * 60 * 750).toISOString(), actor: "manufacturer@acme.com", actionType: "Product Update", details: "Updated sustainability claims for 'EcoFriendly Refrigerator X2000'.", ipAddress: "203.0.113.45", status: "Success" },
];


export default function AuditLogPage() {
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", actor: "", actionType: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const uniqueActionTypes = useMemo(() => {
    const types = new Set(mockAuditLogs.map(log => log.actionType));
    return ["all", ...Array.from(types).sort()];
  }, []);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter(log => {
      if (filters.actor && !log.actor.toLowerCase().includes(filters.actor.toLowerCase())) {
        return false;
      }
      if (filters.actionType !== "all" && log.actionType !== filters.actionType) {
        return false;
      }
      const logDate = new Date(log.timestamp);
      if (filters.dateFrom) {
        const dateFromParts = filters.dateFrom.split('-').map(Number);
        let filterDateFrom = new Date(dateFromParts[0], (dateFromParts[1] || 1) -1, dateFromParts[2] || 1);
        filterDateFrom.setHours(0,0,0,0);
        if (logDate < filterDateFrom) return false;
      }
      if (filters.dateTo) {
        const dateToParts = filters.dateTo.split('-').map(Number);
        let filterDateTo = new Date(dateToParts[0], (dateToParts[1] || 12) -1, dateToParts[2] || 31);
        filterDateTo.setHours(23,59,59,999);
        if (dateToParts.length === 2) { 
            filterDateTo = new Date(dateToParts[0], dateToParts[1], 0); 
            filterDateTo.setHours(23,59,59,999);
        } else if (dateToParts.length === 1) { 
            filterDateTo = new Date(dateToParts[0], 11, 31); 
            filterDateTo.setHours(23,59,59,999);
        }
        if (logDate > filterDateTo) return false;
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const getStatusBadge = (status?: 'Success' | 'Failure' | 'Info' | 'Pending') => {
    if (!status) return null;
    let variant: "default" | "destructive" | "outline" | "secondary" = "secondary";
    let className = "bg-muted text-muted-foreground";
    let IconCmpt = Info;

    switch (status) {
      case 'Success':
        variant = "default";
        className = "bg-green-100 text-green-700 border-green-300";
        IconCmpt = ListChecks;
        break;
      case 'Failure':
        variant = "destructive";
        className = "bg-red-100 text-red-700 border-red-300";
        IconCmpt = ShieldAlert;
        break;
      case 'Pending':
        variant = "outline";
        className = "bg-yellow-100 text-yellow-700 border-yellow-300";
        IconCmpt = Info;
        break;
      case 'Info':
      default:
        variant = "outline";
        className = "bg-blue-100 text-blue-700 border-blue-300";
        IconCmpt = UserCircle; 
        break;
    }
    return <Badge variant={variant} className={cn("capitalize text-xs", className)}><IconCmpt className="mr-1 h-3 w-3"/>{status}</Badge>;
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
          <CardDescription>Refine the list of audit logs using the filters below. Date format: YYYY-MM-DD, YYYY-MM, or YYYY.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="dateFrom">Date From</Label>
            <Input id="dateFrom" type="text" placeholder="YYYY-MM-DD" value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dateTo">Date To</Label>
            <Input id="dateTo" type="text" placeholder="YYYY-MM-DD" value={filters.dateTo} onChange={(e) => handleFilterChange('dateTo', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="actor">Actor</Label>
            <Input id="actor" placeholder="e.g., admin@norruva.com" value={filters.actor} onChange={(e) => handleFilterChange('actor', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="actionType">Action Type</Label>
            <Select value={filters.actionType} onValueChange={(value) => handleFilterChange('actionType', value)}>
              <SelectTrigger id="actionType"><SelectValue placeholder="Select action type" /></SelectTrigger>
              <SelectContent>
                {uniqueActionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type === "all" ? "All Action Types" : type}</SelectItem>
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
            Page {currentPage} of {totalPages}. Displaying {paginatedLogs.length} records (filtered from {mockAuditLogs.length} total).
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
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{log.actor}</TableCell>
                  <TableCell>{log.actionType}</TableCell>
                  <TableCell className="text-sm">{log.details}</TableCell>
                  <TableCell className="text-xs font-mono">{log.ipAddress || "N/A"}</TableCell>
                  <TableCell className="text-right">{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}
              {paginatedLogs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No audit logs match your current filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-xs text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <Select
                onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}
                defaultValue={String(itemsPerPage)}
            >
                <SelectTrigger className="w-[75px] h-8 text-xs">
                    <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                    {[10, 20, 50].map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
                </SelectContent>
            </Select>
             <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
