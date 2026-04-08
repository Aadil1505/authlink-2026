"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { getColumns, type Product } from "./columns";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (updated: Product) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const handleDelete = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const columns = getColumns(handleUpdate, handleDelete);

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-1.5" />
            Register Product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={products} />
      )}
    </div>
  );
}
