import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, Zap, Leaf, PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Placeholder data for charts and reports
const emissionData = {
  scope1: 1200, // tCO2e
  scope2: 800,  // tCO2e
  scope3: 5500, // tCO2e
  total: 1200 + 800 + 5500,
};

const reports = [
  { id: "CSRD2023Q4", title: "CSRD Report - Q4 2023", date: "2024-01-15", status: "Published" },
  { id: "CSRD2024Q1", title: "CSRD Report - Q1 2024", date: "2024-04-15", status: "Published" },
  { id: "CSRD2024Q2", title: "CSRD Report - Q2 2024", date: "2024-07-15", status: "Draft" },
];

export default function SustainabilityPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Sustainability & CSRD Reporting</h1>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Generate New Report
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><BarChart3 className="mr-3 h-6 w-6 text-primary" /> Emissions Overview (Annual)</CardTitle>
          <CardDescription>Summary of Scope 1, 2, and 3 greenhouse gas emissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Scope 1 Emissions</span>
              <span className="text-sm text-muted-foreground">{emissionData.scope1.toLocaleString()} tCO₂e</span>
            </div>
            <Progress value={(emissionData.scope1 / emissionData.total) * 100} className="h-3 [&>div]:bg-red-500" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Scope 2 Emissions</span>
              <span className="text-sm text-muted-foreground">{emissionData.scope2.toLocaleString()} tCO₂e</span>
            </div>
            <Progress value={(emissionData.scope2 / emissionData.total) * 100} className="h-3 [&>div]:bg-orange-500" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Scope 3 Emissions</span>
              <span className="text-sm text-muted-foreground">{emissionData.scope3.toLocaleString()} tCO₂e</span>
            </div>
            <Progress value={(emissionData.scope3 / emissionData.total) * 100} className="h-3 [&>div]:bg-yellow-500" />
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Emissions</span>
              <span>{emissionData.total.toLocaleString()} tCO₂e</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Zap className="mr-3 h-6 w-6 text-yellow-500" /> Energy Consumption</CardTitle>
            <CardDescription>Overview of energy usage and efficiency metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for energy consumption chart or data */}
            <p className="text-muted-foreground">Energy consumption data for the last 12 months shows a 5% reduction in overall usage.</p>
            <div className="mt-4">
              <p><span className="font-semibold">Renewable Energy Mix:</span> 35%</p>
              <p><span className="font-semibold">EPREL Synced Products:</span> 850</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Leaf className="mr-3 h-6 w-6 text-green-500" /> Environmental Impact</CardTitle>
            <CardDescription>Other key environmental impact metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for other environmental metrics */}
            <p className="text-muted-foreground">Water usage reduced by 8% year-over-year. Waste recycling rate at 75%.</p>
             <div className="mt-4">
              <p><span className="font-semibold">Water Usage Intensity:</span> 0.5 m³/unit</p>
              <p><span className="font-semibold">Waste Diversion Rate:</span> 75%</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileText className="mr-3 h-6 w-6 text-primary" /> Generated Reports</CardTitle>
          <CardDescription>Access and download your CSRD and other sustainability reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {reports.map((report) => (
              <li key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">Date: {report.date} - Status: {report.status}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
