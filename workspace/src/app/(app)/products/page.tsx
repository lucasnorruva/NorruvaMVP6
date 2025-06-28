
// --- File: page.tsx (Product Management List) ---
// Description: Main page for listing and managing all products.
"use client";

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useDeleteProduct } from '@/hooks/products/useProduct';
import { ProductList } from '@/components/products/features/ProductList';
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
import { useState } from 'react';

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    onSuccess: (deletedProductId) => {
      toast({
        title: 'Product Deleted',
        description: `Product ${productToDelete?.name || deletedProductId} has been successfully deleted.`,
      });
      setProductToDelete(null);
    },
    // onError is handled by useErrorHandler in the hook
  });

  const handleEdit = (productId: string) => {
    router.push(`/products/${productId}/edit`);
  };

  const handleView = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleDeleteRequest = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
  };

  const handleCreateNew = () => {
    router.push('/products/new');
  };

  return (
    <>
      <ProductList
        onProductSelect={handleView}
        onProductEdit={handleEdit}
        onProductDelete={(id, name) => handleDeleteRequest(id, name || id)}
        onCreateNew={handleCreateNew}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.name || productToDelete?.id}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
