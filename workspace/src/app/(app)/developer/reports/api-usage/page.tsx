

// --- File: src/app/(app)/developer/reports/api-usage/page.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BarChart3, AlertTriangle, Users, Clock, FileJson, Info, ListFilter, Filter as FilterIcon } from "lucide-react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockApiCallData = [
  { date: "2024-07-01", calls: 1200, errors: 5 }, { date: "2024-07-02", calls: 1500, errors: 8 },
  { date: "2024-07-03", calls: 1300, errors: 2 }, { date: "2024-07-04", calls: 1700, errors: 15 },
  { date: "2024-07-05", calls: 1600, errors: 7 }, { date: "2024-07-06", calls: 1900, errors: 3 },
  { date: "2024-07-07", calls: 2100, errors: 10 },
];

const mockEndpointUsageData = [
  { endpoint: "GET /dpp/{id}", calls: 6500, errors: 12, avgLatency: 85 },
  { endpoint: "POST /dpp", calls: 850, errors: 5, avgLatency: 120 },
  { endpoint: "PUT /dpp/{id}", calls: 320, errors: 2, avgLatency: 150 },
  { endpoint: "POST /qr/validate", calls: 2800, errors: 30, avgLatency: 60 },
  { endpoint: "GET /dpp", calls: 1500, errors: 8, avgLatency: 100 },
  { endpoint: "POST /token/mint/{id}", calls: 50, errors: 1, avgLatency: 300 },
];

const mockApiKeys = ["sand_sk_...ABCD", "prod_sk_...EFGH", "sand_sk_...1234"];


export default function ApiUsageDashboardPage() {
  const [selectedApiKey, setSelectedApiKey] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BarChart3 className="mr-3 h-7 w-7 text-primary" />
          API Usage Dashboard (Conceptual)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/developer#settings_usage">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developer Portal
          </Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Dashboard</AlertTitle>
        <AlertDescription>
          This page represents a conceptual dashboard for detailed API usage analytics. In a real application, these charts and data would be dynamic and interactive.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
             <FilterIcon className="mr-2 h-5 w-5 text-primary"/> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <Label htmlFor="apiKeyFilter" className="text-xs font-medium">API Key</Label>
                <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                    <SelectTrigger id="apiKeyFilter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All API Keys</SelectItem>
                        {mockApiKeys.map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="dateFrom" className="text-xs font-medium">Date From</Label>
                <DatePicker date={dateRange.from} setDate={(date) => setDateRange(prev => ({ ...prev, from: date }))} placeholder="Start date"/>
            </div>
            <div>
                <Label htmlFor="dateTo" className="text-xs font-medium">Date To</Label>
                <DatePicker date={dateRange.to} setDate={(date) => setDateRange(prev => ({ ...prev, to: date }))} placeholder="End date"/>
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/>Total API Calls</CardTitle>
            <CardDescription>Total calls over selected period.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] text-xs">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockApiCallData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} style={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis style={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        itemStyle={{ color: 'hsl(var(--chart-1))' }}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }}/>
                    <Line type="monotone" dataKey="calls" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-1))' }} activeDot={{ r: 6 }} name="API Calls"/>
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary"/>Top 5 Endpoints by Usage</CardTitle>
            <CardDescription>Most frequently called endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={mockEndpointUsageData.slice(0,5)} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis type="number" style={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <YAxis dataKey="endpoint" type="category" width={120} tickFormatter={(val) => val.length > 15 ? val.substring(0,15) + '...' : val} style={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        itemStyle={{ color: 'hsl(var(--chart-2))' }}
                         formatter={(value: number, name: string) => [`${value.toLocaleString()}`, name === 'calls' ? 'Total Calls' : name]}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }}/>
                    <Bar dataKey="calls" fill="hsl(var(--chart-2))" name="Total Calls" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Error Rate Trend</CardTitle>
            <CardDescription>Percentage of failed requests.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockApiCallData.map(d => ({...d, errorRate: (d.errors / d.calls * 100).toFixed(1) }))} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} style={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis unit="%" style={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        itemStyle={{ color: 'hsl(var(--destructive))' }}
                        formatter={(value: number) => [`${value}%`, "Error Rate"]}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }}/>
                    <Line type="monotone" dataKey="errorRate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--destructive))' }} activeDot={{ r: 6 }} name="Error Rate"/>
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><FileJson className="mr-2 h-5 w-5 text-primary"/>API Call Log (Last 10 Calls - Mock)</CardTitle>
          <CardDescription>A conceptual view of recent API interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>API Key (Partial)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEndpointUsageData.slice(0,10).map((log, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(Date.now() - idx * 60000 * 5).toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs"><span className={`font-semibold ${log.endpoint.startsWith('GET') ? 'text-blue-600' : log.endpoint.startsWith('POST') ? 'text-green-600' : 'text-orange-600'}`}>{log.endpoint.split(' ')[0]}</span></TableCell>
                    <TableCell className="whitespace-nowrap text-xs font-mono text-foreground/90">{log.endpoint.split(' ')[1]}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${log.errors > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {log.errors > 0 ? (log.errors > 5 ? '500' : '400') : '200'}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{log.avgLatency}ms</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground font-mono">{mockApiKeys[idx % mockApiKeys.length].substring(0,15)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
