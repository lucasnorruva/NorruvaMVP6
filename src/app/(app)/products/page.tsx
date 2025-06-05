
"use client"; 

import Link from "next/link";
import React, { useEffect, useState } from "react"; // Added useEffect and useState
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
import { useRole } from "@/contexts/RoleContext"; 

// Define the structure for products listed on this page
interface ListedProduct {
  id: string;
  name: string;
  category: string;
  status: string;
  compliance: string;
  lastUpdated: string;
}

const initialMockProducts: ListedProduct[] = [
  { id: "PROD001", name: "EcoFriendly Refrigerator X2000", category: "Appliances", status: "Active", compliance: "Compliant", lastUpdated: "2024-07-20" },
  { id: "PROD002", name: "Smart LED Bulb Pack (4-pack)", category: "Electronics", status: "Active", compliance: "Pending", lastUpdated: "2024-07-18" },
  { id: "PROD003", name: "Organic Cotton T-Shirt", category: "Apparel", status: "Archived", compliance: "Compliant", lastUpdated: "2024-06-10" },
  { id: "PROD004", name: "Recycled Plastic Water Bottle", category: "Homeware", status: "Active", compliance: "Non-Compliant", lastUpdated: "2024-07-21" },
  { id: "PROD005", name: "Solar Powered Garden Light", category: "Outdoor", status: "Draft", compliance: "N/A", lastUpdated: "2024-07-22" },
];

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

export default function ProductsPage() {
  const { currentRole } = useRole(); 
  const [displayedProducts, setDisplayedProducts] = useState<ListedProduct[]>(initialMockProducts);

  useEffect(() => {
    // Load user-added products from localStorage
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedProducts: ListedProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

    // Combine mock products with user-added products
    // Simple approach: User-added products take precedence if IDs were to clash (unlikely with current ID generation)
    // More robust: Filter out mocks if their IDs are present in userAddedProducts
    const combinedProducts = [
      ...initialMockProducts.filter(mock => !userAddedProducts.find(userProd => userProd.id === mock.id)),
      ...userAddedProducts
    ];
    
    // Or a simpler merge if you want user products appended:
    // const combinedProducts = [...initialMockProducts, ...userAddedProducts];

    setDisplayedProducts(combinedProducts.sort((a, b) => a.id.localeCompare(b.id))); // Sort for consistency

  }, []);


  const canAddProducts = currentRole === 'admin' || currentRole === 'manufacturer';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Products</h1>
        {canAddProducts && ( 
          <Link href="/products/new" passHref>
            <Button variant="secondary">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
          </Link>
        )}
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
              {displayedProducts.map((product) => (
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
                      product.status === "Archived" ? "bg-muted text-muted-foreground border-border" : 
                      "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" 
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={
                        product.compliance === "Compliant" ? "default" :
                        product.compliance === "Pending" ? "outline" : 
                        product.compliance === "N/A" ? "secondary" : "destructive"
                      } className={
                        product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        product.compliance === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                        product.compliance === "N/A" ? "bg-muted text-muted-foreground border-border" : 
                        "bg-red-500/20 text-red-700 border-red-500/30" 
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
                        <DropdownMenuItem onClick={() => alert(`Edit action for ${product.id} (Not Implemented)`)}> 
                          <Edit className="mr-2 h-4 w-4" />
                          Edit (Not Implemented)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Delete action for ${product.id} (Not Implemented)`)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete (Not Implemented)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {displayedProducts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No products found. Start by adding a new product.
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

