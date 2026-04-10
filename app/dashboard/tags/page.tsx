"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { getColumns, type Tag } from "./columns";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = getColumns();

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">NFC Tags</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered NFC tags linked to your products.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/tags/personalize">
            <PlusIcon className="size-4 mr-1.5" />
            Register Tag
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
        <DataTable columns={columns} data={tags} />
      )}
    </div>
  );
}
