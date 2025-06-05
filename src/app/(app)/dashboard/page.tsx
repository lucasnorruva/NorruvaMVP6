import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ScanLine, ShieldCheck, FileText, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const overviewStats = [
    { title: "Total Products", value: "1,234", icon: Package, color: "text-primary" },
    { title: "Compliance Rate", value: "98.7%", icon: ShieldCheck, color: "text-green-500" },
    { title: "Pending Extractions", value: "12", icon: ScanLine, color: "text-orange-500" },
    { title: "Sustainability Reports", value: "5", icon: FileText, color: "text-blue-500" },
  ];

  const quickActions = [
    { label: "Add New Product", href: "/products/new", icon: PlusCircle },
    { label: "Upload Document", href: "/products/new", icon: ScanLine },
    { label: "View All Products", href: "/products", icon: Package },
    { label: "Generate Report", href: "/sustainability", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Dashboard</h1>
        <Link href="/products/new" passHref>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Access common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} passHref>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                  <action.icon className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{action.label}</p>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Overview of recent product updates and compliance checks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {text: "Product 'EcoBoiler X1' updated.", time: "2 hours ago"},
                {text: "GDPR consent for 'User #123' processed.", time: "5 hours ago"},
                {text: "New CSRD report generated for Q2.", time: "1 day ago"},
                {text: "Data extracted from 'Invoice_Supplier_ABC.pdf'.", time: "2 days ago"},
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
}
