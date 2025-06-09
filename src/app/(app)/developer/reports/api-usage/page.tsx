
// --- File: page.tsx (API Usage Dashboard - Conceptual) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BarChart3, AlertTriangle, Users, Clock, FileJson, Info, ListFilter } from "lucide-react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const mockApiCallData = [
  { date: "2024-07-01", calls: 1200 }, { date: "2024-07-02", calls: 1500 },
  { date: "2024-07-03", calls: 1300 }, { date: "2024-07-04", calls: 1700 },
  { date: "2024-07-05", calls: 1600 }, { date: "2024-07-06", calls: 1900 },
  { date: "2024-07-07", calls: 2100 },
];

const mockEndpointUsageData = [
  { endpoint: "GET /dpp/{id}", calls: 6500, errors: 12 },
  { endpoint: "POST /dpp", calls: 850, errors: 5 },
  { endpoint: "PUT /dpp/{id}", calls: 320, errors: 2 },
  { endpoint: "POST /qr/validate", calls: 2800, errors: 30 },
  { endpoint: "GET /dpp", calls: 1500, errors: 8 },
];


export default function ApiUsageDashboardPage() {
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/>Total API Calls (Last 7 Days)</CardTitle>
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
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }}/>
                    <Bar dataKey="calls" fill="hsl(var(--chart-2))" name="Total Calls" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Error Rate Trend (Conceptual)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
            <p className="text-center">A line chart showing error rate (e.g., 4xx, 5xx) over time would appear here.</p>
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
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground tracking-wider">Timestamp</th>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground tracking-wider">Method</th>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground tracking-wider">Endpoint</th>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground tracking-wider">User/Key (Conceptual)</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {[
                  { ts: "2024-08-01 10:05:15", method: "GET", endpoint: "/dpp/DPP001", status: 200, user: "sand_sk_...ABCD" },
                  { ts: "2024-08-01 10:05:10", method: "POST", endpoint: "/qr/validate", status: 200, user: "sand_sk_...ABCD" },
                  { ts: "2024-08-01 10:04:50", method: "GET", endpoint: "/dpp/DPP005", status: 404, user: "sand_sk_...WXYZ" },
                  { ts: "2024-08-01 10:03:00", method: "PUT", endpoint: "/dpp/DPP002", status: 200, user: "sand_sk_...ABCD" },
                  { ts: "2024-08-01 10:02:30", method: "POST", endpoint: "/dpp", status: 201, user: "sand_sk_...EFGH" },
                ].map((log, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">{log.ts}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs"><span className={`font-semibold ${log.method === 'GET' ? 'text-blue-600' : log.method === 'POST' ? 'text-green-600' : 'text-orange-600'}`}>{log.method}</span></td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs font-mono text-foreground/90">{log.endpoint}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${log.status >= 400 ? 'bg-red-100 text-red-800' : log.status >= 300 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground font-mono">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Top API Consumers (Conceptual)</CardTitle>
            <CardDescription>Identify applications or services making the most API requests.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p className="text-center">A bar chart or table listing API keys/clients by request volume would appear here.</p>
          </CardContent>
        </Card>
    </div>
  );
}

