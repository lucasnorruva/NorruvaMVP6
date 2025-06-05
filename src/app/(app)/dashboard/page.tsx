
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ScanLine, ShieldCheck, FileText, PlusCircle, Users, Layers, ShoppingBag, Recycle as RecycleIcon, BadgeCheck, Building, FileWarning } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";

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
    { label: "Manage Users", href: "/settings/users", icon: Users, description: "Add, edit, or remove users." },
    { label: "View All Products", href: "/products", icon: Package, description: "Oversee all product entries." },
    { label: "System Health Check", href: "#", icon: ShieldCheck, description: "Monitor platform status." }, // Placeholder
    { label: "Regulation Management", href: "/copilot", icon: FileText, description: "Access compliance tools." }, // Pointing to copilot as a compliance tool area
  ];
  return (
     <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Admin Quick Actions</CardTitle>
          <CardDescription>Access key administrative functions quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
  )
}

// Placeholder for Manufacturer Dashboard
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
    <Link href="/products/new" passHref>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
        <PlusCircle className="mr-2 h-5 w-5" />
        Add New Product / Create DPP
      </Button>
    </Link>
    <Card>
      <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Product 'EcoBoiler X1' updated. New batch data for 'SolarPanel ZP' added.</p></CardContent>
    </Card>
  </div>
);

// Placeholder for Supplier Dashboard
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
    <Button variant="outline" className="w-full sm:w-auto">
      <ScanLine className="mr-2 h-5 w-5" />
      Upload Compliance Document
    </Button>
     <Card>
      <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Manufacturer 'GreenTech' requests updated specs for 'Component X'.</p></CardContent>
    </Card>
  </div>
);

// Placeholder for Retailer Dashboard
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
     <Button variant="outline" className="w-full sm:w-auto">
      <FileText className="mr-2 h-5 w-5" />
      Download Product Data Sheets
    </Button>
    <Card>
      <CardHeader><CardTitle>Market Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">New sustainability claim verified for 'Eco T-Shirt'.</p></CardContent>
    </Card>
  </div>
);

// Placeholder for Recycler Dashboard
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
    <Button variant="outline" className="w-full sm:w-auto">
      <ScanLine className="mr-2 h-5 w-5" />
      Scan Product for Disassembly Info
    </Button>
     <Card>
      <CardHeader><CardTitle>Material Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">High volume of 'Recycled PET' available from recent batch.</p></CardContent>
    </Card>
  </div>
);

// Placeholder for Verifier/Authenticator Dashboard
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
     <Button variant="outline" className="w-full sm:w-auto">
      <FileText className="mr-2 h-5 w-5" />
      Access Audit Trail Database
    </Button>
    <Card>
      <CardHeader><CardTitle>System Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">New regulation update requires re-verification for 'Textile' category.</p></CardContent>
    </Card>
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
            <div className="grid gap-6 md:grid-cols-2">
              <AdminQuickActions/>
              <Card className="shadow-lg">
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
                    ].map(activity => (
                      <li key={activity.text} className="flex items-center justify-between text-sm">
                        <span>{activity.text}</span>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
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
           <Link href="/products/new" passHref>
             <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
               <PlusCircle className="mr-2 h-5 w-5" />
               Add New Product
             </Button>
           </Link>
        )}
         {currentRole === 'admin' && (
           <Link href="/products/new" passHref>
             <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
               <PlusCircle className="mr-2 h-5 w-5" />
               Platform Product Setup
             </Button>
           </Link>
        )}
      </div>
      {renderDashboardContent()}
    </div>
  );
}

    