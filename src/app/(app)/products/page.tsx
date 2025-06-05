
"use client"; 

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRole } from "@/contexts/RoleContext"; 
import { useToast } from "@/hooks/use-toast";
import type { ProductFormData } from "@/components/products/ProductForm"; // Import ProductFormData

// This interface now reflects more of what's stored, aligning with ProductFormData + metadata
export interface ListedProduct extends Partial<ProductFormData> { // Make ProductFormData fields optional for listing
  id: string;
  name: string; // Maintained for direct display, though productName is in ProductFormData
  productCategory: string; // Consistent with ProductFormData
  status: string;
  compliance: string;
  lastUpdated: string;
}

const initialMockProducts: ListedProduct[] = [
  { id: "PROD001", name: "EcoFriendly Refrigerator X2000", productCategory: "Appliances", status: "Active", compliance: "Compliant", lastUpdated: "2024-07-20" },
  { id: "PROD002", name: "Smart LED Bulb Pack (4-pack)", productCategory: "Electronics", status: "Active", compliance: "Pending", lastUpdated: "2024-07-18" },
  { id: "PROD003", name: "Organic Cotton T-Shirt", productCategory: "Apparel", status: "Archived", compliance: "Compliant", lastUpdated: "2024-06-10" },
  { id: "PROD004", name: "Recycled Plastic Water Bottle", productCategory: "Homeware", status: "Active", compliance: "Non-Compliant", lastUpdated: "2024-07-21" },
  { id: "PROD005", name: "Solar Powered Garden Light", productCategory: "Outdoor", status: "Draft", compliance: "N/A", lastUpdated: "2024-07-22" },
];

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

// StoredProduct should match what's saved in products/new/page.tsx
interface StoredUserProduct extends ProductFormData {
  id: string;
  status: string;
  compliance: string;
  lastUpdated: string;
}


export default function ProductsPage() {
  const { currentRole } = useRole(); 
  const [displayedProducts, setDisplayedProducts] = useState<ListedProduct[]>([]);
  const [productToDelete, setProductToDelete] = useState<ListedProduct | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    // Ensure stored products are cast to StoredUserProduct for full type, then map to ListedProduct for display
    const userAddedStoredProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
    
    const userAddedListedProducts: ListedProduct[] = userAddedStoredProducts.map(p => ({
      ...p, // Spread all fields from StoredUserProduct
      name: p.productName || "Unnamed Product", // Ensure 'name' for ListedProduct is from productName
      productCategory: p.productCategory || "General", // Ensure 'productCategory' is set
    }));

    const combinedProducts = [
      ...initialMockProducts.filter(mock => !userAddedListedProducts.find(userProd => userProd.id === mock.id)),
      ...userAddedListedProducts
    ];
    
    setDisplayedProducts(combinedProducts.sort((a, b) => a.id.localeCompare(b.id)));
  }, []);

  const openDeleteConfirmDialog = (product: ListedProduct) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    if (productToDelete.id.startsWith("USER_PROD")) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userAddedProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      userAddedProducts = userAddedProducts.filter(p => p.id !== productToDelete.id);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userAddedProducts));
    }

    setDisplayedProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
    
    toast({
      title: "Product Deleted",
      description: `Product "${productToDelete.name}" has been deleted.`,
    });

    setIsAlertOpen(false);
    setProductToDelete(null);
  };

  const canAddProducts = currentRole === 'admin' || currentRole === 'manufacturer';
  const canEditProducts = (currentRole === 'admin' || currentRole === 'manufacturer');
  const canDeleteProducts = currentRole === 'admin' || currentRole === 'manufacturer';


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
                  <TableCell>{product.productCategory}</TableCell>
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
                  <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
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
                        {canEditProducts && product.id.startsWith("USER_PROD") && ( // Only allow editing user-added products for now
                            <DropdownMenuItem asChild>
                                <Link href={`/products/new?edit=${product.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDeleteProducts && (
                            <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                                onClick={() => openDeleteConfirmDialog(product)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            </>
                        )}
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

