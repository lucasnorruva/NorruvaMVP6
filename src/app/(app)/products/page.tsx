
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  { id: "PROD001", name: "EcoFriendly Refrigerator X2000", category: "Appliances", status: "Active", compliance: "Compliant", lastUpdated: "2024-07-20" },
  { id: "PROD002", name: "Smart LED Bulb Pack (4-pack)", category: "Electronics", status: "Active", compliance: "Pending", lastUpdated: "2024-07-18" },
  { id: "PROD003", name: "Organic Cotton T-Shirt", category: "Apparel", status: "Archived", compliance: "Compliant", lastUpdated: "2024-06-10" },
  { id: "PROD004", name: "Recycled Plastic Water Bottle", category: "Homeware", status: "Active", compliance: "Non-Compliant", lastUpdated: "2024-07-21" },
  { id: "PROD005", name: "Solar Powered Garden Light", category: "Outdoor", status: "Draft", compliance: "N/A", lastUpdated: "2024-07-22" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Products</h1>
        <Link href="/products/new" passHref>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Product Inventory</CardTitle>
          <CardDescription>Manage and track all products in your system and their Digital Product Passports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                     <Link href={`/products/${product.id}`} className="hover:underline text-primary">
                        {product.id}
                     </Link>
                  </TableCell>
                  <TableCell>
                     <Link href={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                     </Link>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === "Active" ? "default" : 
                      product.status === "Archived" ? "secondary" : "outline"
                    } className={
                      product.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                      product.status === "Archived" ? "bg-muted text-muted-foreground border-border" : // Adjusted archived style
                      "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" // Draft style
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={
                        product.compliance === "Compliant" ? "default" :
                        product.compliance === "Pending" ? "outline" : "destructive"
                      } className={
                        product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        product.compliance === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                        product.compliance === "N/A" ? "bg-muted text-muted-foreground border-border" : // N/A style
                        "bg-red-500/20 text-red-700 border-red-500/30" // Non-Compliant
                      }>
                       {product.compliance}
                     </Badge>
                  </TableCell>
                  <TableCell>{product.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                           <span className="sr-only">Product Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem> {/* Consider linking to an edit page /products/[id]/edit later */}
                          <Edit className="mr-2 h-4 w-4" />
                          Edit (Not Implemented)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete (Not Implemented)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

