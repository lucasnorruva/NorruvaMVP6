
```tsx

// --- File: src/components/dashboard/ServiceProviderDashboard.tsx ---
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { ServiceProviderQuickActionsCard } from "./ServiceProviderQuickActionsCard";
import { 
    Wrench, CheckCircle, AlertTriangle, Clock, Search, MoreHorizontal, Eye, MessageSquare, ListChecks, BarChart3,
    UserCircle, Tool, ArrowUp, ArrowDown, ChevronsUpDown, Filter as FilterIcon, Settings, PackageSearch, FileText as FileTextIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface ServiceJob {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  location: string;
  issue: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  scheduledDate: string; // ISO string
  assignedTechnician?: string;
  notes?: string;
}

const mockServiceJobs: ServiceJob[] = [
  { id: "JOB001", productId: "PROD001", productName: "EcoFriendly Refrigerator X2000", customerName: "Alice Smith", location: "123 Main St, Anytown", issue: "Cooling unit malfunction, not cooling below 10°C.", status: "Scheduled", priority: "High", scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "John Doe", notes: "Customer reports loud humming noise." },
  { id: "JOB002", productId: "DPP005", productName: "High-Performance EV Battery", customerName: "Bob Johnson Motors", location: "456 Industrial Rd, Techville", issue: "Requires full diagnostic check and State of Health (SoH) report.", status: "In Progress", priority: "Medium", scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "Jane Roe", notes: "Vehicle is on-site. Follow Protocol 7-B for diagnostics." },
  { id: "JOB003", productId: "USER_PROD123456", productName: "Custom Craft Wooden Chair", customerName: "Charlie Brown Furnishings", location: "789 Artisan Way, Craftburg", issue: "One leg attachment loose, requires re-securing.", status: "Completed", priority: "Low", scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "John Doe", notes: "Reinforced with L-bracket. Customer satisfied." },
  { id: "JOB004", productId: "PROD002", productName: "Smart LED Bulb (4-Pack)", customerName: "Diana Prince Home", location: "101 Century Ave, Metrocity", issue: "Connectivity issues with smart home hub.", status: "On Hold", priority: "Medium", scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), notes: "Waiting for customer to provide hub details. Followed up on 2024-08-09." },
  { id: "JOB005", productId: "PROD001", productName: "EcoFriendly Refrigerator X2000", customerName: "Edward Green", location: "22 Park Lane, Greenside", issue: "Annual maintenance check.", status: "Scheduled", priority: "Low", scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "Sarah Lee" },
  { id: "JOB006", productId: "DPP006", productName: "EcoSmart Insulation Panel R50", customerName: "BuildIt Construction", location: "Site Alpha, New Development Zone", issue: "Post-installation inspection and thermal performance check.", status: "Scheduled", priority: "High", scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "Jane Roe", notes: "Bring thermal camera." },
  { id: "JOB007", productId: "DPP001", productName: "EcoFriendly Refrigerator X2000", customerName: "Retro Coolers Ltd.", location: "Vintage Appliance Expo", issue: "Display model setup and calibration.", status: "Completed", priority: "Medium", scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), assignedTechnician: "John Doe" },
  { id: "JOB008", productId: "DPP005", productName: "High-Performance EV Battery", customerName: "Future Auto R&D", location: "Tech Park, Suite 300", issue: "Investigate reported BMS error code P0A80.", status: "In Progress", priority: "High", scheduledDate: new Date().toISOString(), assignedTechnician: "Mike Brown", notes: "Error intermittent. Check diagnostic logs on arrival." },
];


interface JobFilters {
  search: string;
  status: 'All' | ServiceJob['status'];
  priority: 'All' | ServiceJob['priority'];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

type SortableJobKeys = keyof Pick<ServiceJob, 'id' | 'productName' | 'customerName' | 'status' | 'priority' | 'scheduledDate' | 'assignedTechnician'>;

interface JobSortConfig {
  key: SortableJobKeys | null;
  direction: 'ascending' | 'descending' | null;
}

const SortableJobHeader: React.FC<{ columnKey: SortableJobKeys, title: string, onSort: (key: SortableJobKeys) => void, sortConfig: JobSortConfig, className?: string }> = 
  ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const Icon = isSorted ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={() => onSort(columnKey)}>
      <div className="flex items-center gap-1">
        {title}
        <Icon className={cn("h-3.5 w-3.5", isSorted ? "text-primary" : "text-muted-foreground/70")} />
      </div>
    </TableHead>
  );
};


export const ServiceProviderDashboard = () => {
  const { toast } = useToast(); // Initialize toast
  const [filters, setFilters] = useState<JobFilters>({ search: '', status: 'All', priority: 'All', dateFrom: undefined, dateTo: undefined });
  const [sortConfig, setSortConfig] = useState<JobSortConfig>({ key: 'scheduledDate', direction: 'ascending' });

  const handleSort = (key: SortableJobKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getStatusBadgeStyle = (status: ServiceJob['status']) => {
    switch (status) {
      case 'Scheduled': return "bg-blue-100 text-blue-700 border-blue-300";
      case 'In Progress': return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 'Completed': return "bg-green-100 text-green-700 border-green-300";
      case 'On Hold': return "bg-orange-100 text-orange-700 border-orange-300";
      case 'Cancelled': return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityBadgeStyle = (priority: ServiceJob['priority']) => {
    switch (priority) {
      case 'High': return "bg-destructive/20 text-destructive border-destructive/30";
      case 'Medium': return "bg-warning/20 text-orange-600 border-orange-500/30";
      case 'Low': return "bg-accent/20 text-accent-foreground border-accent/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let tempJobs = [...mockServiceJobs];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tempJobs = tempJobs.filter(job =>
        job.productName.toLowerCase().includes(searchLower) ||
        job.customerName.toLowerCase().includes(searchLower) ||
        job.issue.toLowerCase().includes(searchLower) ||
        job.id.toLowerCase().includes(searchLower) ||
        (job.assignedTechnician && job.assignedTechnician.toLowerCase().includes(searchLower))
      );
    }
    if (filters.status !== 'All') {
      tempJobs = tempJobs.filter(job => job.status === filters.status);
    }
    if (filters.priority !== 'All') {
      tempJobs = tempJobs.filter(job => job.priority === filters.priority);
    }
    if (filters.dateFrom) {
        const from = new Date(filters.dateFrom); from.setHours(0,0,0,0);
        tempJobs = tempJobs.filter(job => new Date(job.scheduledDate) >= from);
    }
    if (filters.dateTo) {
        const to = new Date(filters.dateTo); to.setHours(23,59,59,999);
        tempJobs = tempJobs.filter(job => new Date(job.scheduledDate) <= to);
    }
    
    if (sortConfig.key && sortConfig.direction) {
        tempJobs.sort((a,b) => {
            let valA = a[sortConfig.key!];
            let valB = b[sortConfig.key!];

            if (valA === undefined || valA === null) valA = ""; // Handle undefined/null for sorting
            if (valB === undefined || valB === null) valB = "";

            if (sortConfig.key === 'scheduledDate') {
                valA = new Date(valA as string).getTime();
                valB = new Date(valB as string).getTime();
            } else if (typeof valA === 'string' && typeof valB === 'string') {
                 valA = valA.toLowerCase();
                 valB = valB.toLowerCase();
            }
            
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    return tempJobs;
  }, [filters, sortConfig]);

  const jobsOverdue = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return mockServiceJobs.filter(j => new Date(j.scheduledDate) < today && j.status !== 'Completed' && j.status !== 'Cancelled').length;
  }, []);

  const performanceKPIs = [
    { title: "Avg. Completion Time", value: "4.2h", icon: Clock, trend: "-0.3h", trendDirection: "down" as const, description: "Past 30 days" },
    { title: "First-Time Fix Rate", value: "92%", icon: CheckCircle, trend: "+1.5%", trendDirection: "up" as const, description: "Target: 90%" },
    { title: "Customer Satisfaction (CSAT)", value: "4.8/5", icon: UserCircle, trend: "+0.1", trendDirection: "up" as const, description: "Based on recent surveys" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"> {/* Adjusted grid for 5 items */}
        <MetricCard title="Active Jobs" value={mockServiceJobs.filter(j => j.status === 'In Progress' || j.status === 'Scheduled').length} icon={Wrench} />
        <MetricCard title="Jobs Due Today" value={mockServiceJobs.filter(j => new Date(j.scheduledDate).toDateString() === new Date().toDateString() && j.status !== 'Completed' && j.status !== 'Cancelled').length} icon={CalendarDays} trendDirection="neutral" />
        <MetricCard title="High Priority Open" value={mockServiceJobs.filter(j => j.priority === 'High' && (j.status === 'Scheduled' || j.status === 'In Progress')).length} icon={AlertTriangle} trendDirection="up" />
        <MetricCard title="Jobs Overdue" value={jobsOverdue} icon={AlertTriangle} trendDirection={jobsOverdue > 0 ? "up" : "neutral"} className={jobsOverdue > 0 ? "border-destructive" : ""} />
        <MetricCard title="Completed This Month" value={mockServiceJobs.filter(j => j.status === 'Completed' && new Date(j.scheduledDate).getMonth() === new Date().getMonth()).length} icon={CheckCircle} />
      </div>
      
      <ServiceProviderQuickActionsCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Service Jobs Overview</CardTitle>
          <CardDescription>Manage and track all assigned service jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-md bg-muted/50 items-end">
            <div className="lg:col-span-2">
              <Label htmlFor="jobSearch" className="text-xs">Search (Product, Customer, Issue, ID, Technician)</Label>
              <Input id="jobSearch" placeholder="Type to search..." value={filters.search} onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}/>
            </div>
            <div>
              <Label htmlFor="jobStatusFilter" className="text-xs">Status</Label>
              <Select value={filters.status} onValueChange={value => setFilters(prev => ({...prev, status: value as JobFilters['status']}))}>
                <SelectTrigger id="jobStatusFilter"><SelectValue /></SelectTrigger>
                <SelectContent>{['All', 'Scheduled', 'In Progress', 'Completed', 'On Hold', 'Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jobPriorityFilter" className="text-xs">Priority</Label>
              <Select value={filters.priority} onValueChange={value => setFilters(prev => ({...prev, priority: value as JobFilters['priority']}))}>
                <SelectTrigger id="jobPriorityFilter"><SelectValue /></SelectTrigger>
                <SelectContent>{['All', 'High', 'Medium', 'Low'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2 lg:col-span-1 items-end">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="jobDateFrom" className="text-xs">Date From</Label>
                <DatePicker date={filters.dateFrom} setDate={(date) => setFilters(prev => ({...prev, dateFrom: date}))} placeholder="Start date"/>
              </div>
              <div className="w-full sm:w-1/2 mt-2 sm:mt-0">
                <Label htmlFor="jobDateTo" className="text-xs">Date To</Label>
                <DatePicker date={filters.dateTo} setDate={(date) => setFilters(prev => ({...prev, dateTo: date}))} placeholder="End date"/>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <SortableJobHeader columnKey="id" title="Job ID" onSort={handleSort} sortConfig={sortConfig} />
                <SortableJobHeader columnKey="productName" title="Product" onSort={handleSort} sortConfig={sortConfig} />
                <SortableJobHeader columnKey="customerName" title="Customer" onSort={handleSort} sortConfig={sortConfig} />
                <TableHead>Location</TableHead>
                <TableHead className="min-w-[150px]">Issue</TableHead>
                <SortableJobHeader columnKey="priority" title="Priority" onSort={handleSort} sortConfig={sortConfig} />
                <SortableJobHeader columnKey="status" title="Status" onSort={handleSort} sortConfig={sortConfig} />
                <SortableJobHeader columnKey="assignedTechnician" title="Technician" onSort={handleSort} sortConfig={sortConfig} />
                <SortableJobHeader columnKey="scheduledDate" title="Scheduled" onSort={handleSort} sortConfig={sortConfig} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-xs">{job.id}</TableCell>
                  <TableCell className="font-medium hover:underline">
                    <Link href={`/products/${job.productId}`} title={`View DPP for ${job.productName}`}>
                      {job.productName}
                    </Link>
                  </TableCell>
                  <TableCell>{job.customerName}</TableCell>
                  <TableCell className="text-xs">{job.location}</TableCell>
                  <TableCell className="text-xs max-w-[150px] truncate" title={job.issue}>{job.issue}</TableCell>
                  <TableCell><Badge className={cn("text-xs", getPriorityBadgeStyle(job.priority))}>{job.priority}</Badge></TableCell>
                  <TableCell><Badge className={cn("text-xs", getStatusBadgeStyle(job.status))}>{job.status}</Badge></TableCell>
                  <TableCell className="text-xs">{job.assignedTechnician || "Unassigned"}</TableCell>
                  <TableCell className="text-xs">{new Date(job.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({title: "View Job Details (Mock)", description: `Viewing details for Job ID: ${job.id}`})}><Eye className="mr-2 h-4 w-4"/>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/products/${job.productId}`, '_blank')}><PackageSearch className="mr-2 h-4 w-4"/>View Product DPP</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({title: "Update Job Status (Mock)", description: `Opening status update for Job ID: ${job.id}`})}><Settings className="mr-2 h-4 w-4"/>Update Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({title: "Add Note (Mock)", description: `Adding note to Job ID: ${job.id}`})}><MessageSquare className="mr-2 h-4 w-4"/>Add Notes</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedJobs.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-6 text-muted-foreground">No service jobs match current filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>My Performance (Mock)</CardTitle>
            <CardDescription>Overview of your service performance metrics.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceKPIs.map(kpi => (
                <Card key={kpi.title} className="bg-muted/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium flex items-center">
                            <kpi.icon className={`mr-2 h-4 w-4 ${kpi.color || 'text-primary'}`} />
                            {kpi.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{kpi.value}</p>
                        {kpi.description && <p className="text-xs text-muted-foreground">{kpi.description}</p>}
                        {kpi.trend && (
                            <p className={cn("text-xs mt-1 flex items-center", kpi.trendDirection === 'up' ? 'text-green-600' : 'text-red-600')}>
                                {kpi.trendDirection === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                                {kpi.trend}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
          </CardContent>
      </Card>
    </div>
  );
};

```
