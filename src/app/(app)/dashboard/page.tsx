"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ScanLine, ShieldCheck, FileText, PlusCircle, Users, Layers, ShoppingBag, Recycle as RecycleIcon, BadgeCheck, Building, FileWarning, Eye, Database, SearchCheck, BarChart2, AlertTriangle, MessageSquare, Inbox, History, Settings, ListChecks, Info, SlidersHorizontal, Activity, UploadCloud, FileSearch, DownloadCloud, Leaf, ClipboardCheck, Cpu, HardDrive, FileClock } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";

// Mock Data for Regulation Updates
interface RegulationUpdate {
  id: string;
  title: string;
  summary: string;
  date: string;
  source?: string;
  link?: string;
}

const mockRegulationUpdates: RegulationUpdate[] = [
  { id: "reg001", title: "EU ESPR - New Draft v1.3 Published", summary: "Key changes focus on enhanced durability requirements for electronics and mandatory recycled content in packaging.", date: "July 28, 2024", source: "European Commission", link: "#"},
  { id: "reg002", title: "Updated Guidance on EU Battery Regulation Reporting", summary: "Clarifications on carbon footprint calculation methodologies and data submission for battery passports.", date: "July 22, 2024", source: "ECHA", link: "#"},
  { id: "reg003", title: "US Scope 3 Emissions - New Industry Sector Benchmarks", summary: "EPA releases updated benchmarks for Scope 3 reporting, impacting supply chain data collection for certain industries.", date: "July 15, 2024", source: "US EPA", link: "#"},
];

// Reusable Regulation Updates Card Component
const RegulationUpdatesCard = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="font-headline flex items-center">
        <Info className="mr-2 h-5 w-5 text-info" />
        Recent Regulation Changes
      </CardTitle>
      <CardDescription>Stay informed on the latest regulatory developments.</CardDescription>
    </CardHeader>
    <CardContent>
      {mockRegulationUpdates.length > 0 ? (
        <ul className="space-y-4">
          {mockRegulationUpdates.map((update) => (
            <li key={update.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-sm">{update.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {update.date} {update.source && ` - ${update.source}`}
              </p>
              <p className="text-sm text-foreground/90 mt-1.5">{update.summary}</p>
              {update.link && (
                <Link href={update.link} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary">
                      Learn More
                    </Button>
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No recent regulation updates.</p>
      )}
    </CardContent>
  </Card>
);


// General Stats (can be shown to admin or as an overview)
const AdminDashboardOverview = () => {
  const overviewStats = [
    { title: "Total Products Managed", value: "1,234", icon: Package, color: "text-primary" },
    { title: "Registered Companies", value: "78", icon: Building, color: "text-accent" },
    { title: "DPPs Awaiting Verification", value: "42", icon: FileWarning, color: "text-orange-500" },
    { title: "Active Data Extractions", value: "12", icon: ScanLine, color: "text-info" },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat) => (
        <Card key={stat.title} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">Updated recently</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminQuickActions = () => {
   const quickActions = [
    { label: "Manage Users", href: "/settings/users", icon: Users, description: "Add, edit, or remove platform users." },
    { label: "View All Products", href: "/products", icon: Package, description: "Oversee all product entries and DPPs." },
    { label: "Platform Configuration", href: "/settings", icon: Settings, description: "Adjust global platform settings and integrations." },
    { label: "Compliance Copilot", href: "/copilot", icon: FileText, description: "Access AI assistant for regulation queries." },
    { label: "System Health", href: "#", icon: ShieldCheck, description: "Monitor platform status and performance." },
    { label: "Audit Logs", href: "/audit-log", icon: ListChecks, description: "Review system and user activity logs." },
  ];
  return (
     <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
            Admin Quick Actions
          </CardTitle>
          <CardDescription>Access key administrative functions quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} passHref legacyBehavior>
              <a className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                  <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                  <div>
                    <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </a>
            </Link>
          ))}
        </CardContent>
      </Card>
  )
}

const PlatformHealthStatsCard = () => {
  const healthStats = [
    { title: "API Call Volume (24h)", value: "1.2M", icon: Activity, trend: "+5%", trendDirection: "up" as const },
    { title: "Active User Sessions", value: "345", icon: Users, trend: "-2%", trendDirection: "down" as const },
    { title: "DPP Verification Queue", value: "17", icon: FileClock, trend: "+3", trendDirection: "up" as const },
    { title: "Database Performance", value: "Optimal", icon: Database, statusColor: "text-green-500" },
    { title: "AI Model Requests (24h)", value: "5,670", icon: Cpu, trend: "+10%", trendDirection: "up" as const },
    { title: "Storage Utilization", value: "65%", icon: HardDrive, trend: "+1%", trendDirection: "up" as const },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          Platform Health & Stats
        </CardTitle>
        <CardDescription>Overview of key operational metrics for the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
            <div className="flex items-center">
              <stat.icon className={`h-5 w-5 mr-3 ${stat.statusColor || 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{stat.title}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-semibold ${stat.statusColor || ''}`}>{stat.value}</span>
              {stat.trend && (
                <span className={`ml-2 text-xs ${stat.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  ({stat.trend})
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


const ManufacturerQuickActionsCard = () => {
  const actions = [
    { label: "Add New Product", href: "/products/new", icon: PlusCircle, description: "Create a new DPP for your product." },
    { label: "View My Products", href: "/products", icon: Eye, description: "See all your managed products." },
    { label: "Manage Supply Chain Data", href: "/suppliers", icon: Layers, description: "Input or update supplier information." },
    { label: "Sustainability Insights", href: "/sustainability", icon: Leaf, description: "View your sustainability reports." },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Key actions for managing your products and sustainability data.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const SupplierQuickActionsCard = () => {
  const actions = [
    { label: "Upload Compliance Document", href: "/products/new", icon: UploadCloud, description: "Submit new or updated documents." },
    { label: "View Data Requests", href: "#", icon: Inbox, description: "Check requests from manufacturers (mock)." },
    { label: "Manage Material Specs", href: "#", icon: FileText, description: "Update your material specifications (mock)." },
    { label: "Respond to Queries", href: "#", icon: MessageSquare, description: "Answer manufacturer questions (mock)." },
  ];
   return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Key tasks for suppliers.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const RetailerQuickActionsCard = () => {
  const actions = [
    { label: "Access Public DPPs", href: "/dpp-live-dashboard", icon: ScanLine, description: "View DPPs for products you sell." },
    { label: "Download Product Data", href: "#", icon: DownloadCloud, description: "Get data sheets for marketing (mock)." },
    { label: "View Consumer Insights", href: "#", icon: Users, description: "See consumer interaction data (mock)." },
    { label: "Manage Point-of-Sale Info", href: "#", icon: ShoppingBag, description: "Update POS display information (mock)." },
  ];
   return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Essential tools for retailers.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const RecyclerQuickActionsCard = () => {
  const actions = [
    { label: "Scan for Disassembly Info", href: "#", icon: ScanLine, description: "Access EOL data via product scan (mock)." },
    { label: "View Material Composition DB", href: "#", icon: Database, description: "Check material details for recovery (mock)." },
    { label: "Report Recovered Materials", href: "#", icon: RecycleIcon, description: "Log recovered materials and quantities (mock)." },
    { label: "Check EOL Instructions", href: "/products/PROD001", icon: ListChecks, description: "Review end-of-life procedures." },
  ];
   return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Tools for efficient material recovery.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const VerifierQuickActionsCard = () => {
  const actions = [
    { label: "Review Pending Verifications", href: "/products", icon: FileWarning, description: "Access DPPs awaiting verification." },
    { label: "Access Audit Trails", href: "#", icon: History, description: "Review historical verification data (mock)." },
    { label: "Submit Verification Report", href: "#", icon: ClipboardCheck, description: "File new verification outcomes (mock)." },
    { label: "Query Compliance Standards", href: "/copilot", icon: SearchCheck, description: "Use AI to check regulations." },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Key functions for verifiers and auditors.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
             <a className="block">
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};


const ManufacturerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Package className="mr-2 text-primary"/>My Products Overview</CardTitle>
        <CardDescription>Manage your product portfolio and Digital Product Passports.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Active Products</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">150</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Compliance Issues</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-destructive">3</p></CardContent>
        </Card>
         <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Pending DPPs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-500">7</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <ManufacturerQuickActionsCard />
    <Card>
      <CardHeader><CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Recent Activity</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Product 'EcoBoiler X1' updated. New batch data for 'SolarPanel ZP' added. Supplier 'GreenParts Co' confirmed new material specs.</p></CardContent>
    </Card>
    <RegulationUpdatesCard /> 
  </div>
);

const SupplierDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Layers className="mr-2 text-primary"/>Material & Component Data</CardTitle>
        <CardDescription>Provide and manage data for products you supply.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Data Requests</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-info">5</p><p className="text-xs text-muted-foreground">From Manufacturers</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Submitted Declarations</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">87</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <SupplierQuickActionsCard />
     <Card>
      <CardHeader><CardTitle className="flex items-center"><Inbox className="mr-2 h-5 w-5"/>Notifications</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Manufacturer 'GreenTech' requests updated specs for 'Component X'. Reminder: 'Polymer Z' safety data sheet due next week.</p></CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);

const RetailerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><ShoppingBag className="mr-2 text-primary"/>Product Information Access</CardTitle>
        <CardDescription>Access DPPs for products you sell and manage consumer information.</CardDescription>
      </CardHeader>
       <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Products in Inventory</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">1,200</p><p className="text-xs text-muted-foreground">DPPs accessible</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Consumer Inquiries</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-500">15</p><p className="text-xs text-muted-foreground">Related to product sustainability</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <RetailerQuickActionsCard />
    <Card>
      <CardHeader><CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Market Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">New sustainability claim verified for 'Eco T-Shirt'. Upcoming regulation update for 'Electronics' category.</p></CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);

const RecyclerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><RecycleIcon className="mr-2 text-primary"/>End-of-Life & Material Recovery</CardTitle>
        <CardDescription>Access DPP information for disassembly and material recovery.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Products Processed</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">450</p><p className="text-xs text-muted-foreground">This month</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Material Recovery Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-accent">85%</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <RecyclerQuickActionsCard />
     <Card>
      <CardHeader><CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5"/>Material Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">High volume of 'Recycled PET' available from recent batch. Low stock of 'Lithium Carbonate' for battery recycling.</p></CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);

const VerifierDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><BadgeCheck className="mr-2 text-primary"/>Verification & Audit</CardTitle>
        <CardDescription>Verify product claims and audit Digital Product Passports.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Pending Verifications</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-500">23</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Completed Audits</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">157</p><p className="text-xs text-muted-foreground">This quarter</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <VerifierQuickActionsCard />
    <Card>
      <CardHeader><CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>System Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">New regulation update requires re-verification for 'Textile' category. Multiple DPPs flagged for potential data mismatch.</p></CardContent>
    </Card>
    <RegulationUpdatesCard /> 
  </div>
);


export default function DashboardPage() {
  const { currentRole } = useRole();

  const renderDashboardContent = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <div className="space-y-8">
            <AdminDashboardOverview />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AdminQuickActions />
              <Card className="shadow-lg lg:col-span-1">
                <CardHeader>
                  <CardTitle className="font-headline">Recent Platform Activity</CardTitle>
                  <CardDescription>Overview of system-wide updates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      {text: "New Manufacturer 'EcoGoods Inc.' onboarded.", time: "1 hour ago"},
                      {text: "Regulation Module 'EU Battery Reg v1.1' deployed.", time: "3 hours ago"},
                      {text: "System maintenance scheduled for Sunday 2 AM.", time: "1 day ago"},
                      {text: "Product PROD002 updated with new battery data.", time: "2 days ago"},
                      {text: "Verifier 'CertifyAll' completed 5 audits.", time: "3 days ago"} 
                    ].map(activity => (
                      <li key={activity.text} className="flex items-center justify-between text-sm">
                        <span>{activity.text}</span>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <PlatformHealthStatsCard />
            </div>
            <RegulationUpdatesCard /> 
          </div>
        );
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'supplier':
        return <SupplierDashboard />;
      case 'retailer':
        return <RetailerDashboard />;
      case 'recycler':
        return <RecyclerDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      default:
        return <p>No specific dashboard for this role yet.</p>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
        </h1>
        {currentRole === 'manufacturer' && (
           <Link href="/products/new" passHref legacyBehavior>
            <a>
             <Button variant="secondary">
               <PlusCircle className="mr-2 h-5 w-5" />
               Add New Product
             </Button>
            </a>
           </Link>
        )}
         {currentRole === 'admin' && (
           <Link href="/products/new" passHref legacyBehavior>
             <a>
             <Button variant="default">
               <PlusCircle className="mr-2 h-5 w-5" />
               Platform Product Setup
             </Button>
            </a>
           </Link>
        )}
      </div>
      {renderDashboardContent()}
    </div>
  );
}

