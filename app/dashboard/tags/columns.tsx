"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  ShieldOffIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export type Tag = {
  id: string;
  uid: string;
  productId: string;
  productName: string;
  manufacturerPda: string;
  registrationTx: string;
  revocationTx: string | null;
  active: boolean;
  registeredAt: string;
};

const CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";
const explorerSuffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;

function explorerTx(sig: string) {
  return `https://explorer.solana.com/tx/${sig}${explorerSuffix}`;
}

function RevokeDialog({
  tag,
  open,
  onOpenChange,
  onRevoked,
}: {
  tag: Tag;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRevoked: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRevoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Revocation failed");
        return;
      }
      onRevoked(tag.id);
      onOpenChange(false);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revoke Tag</DialogTitle>
          <DialogDescription>
            This will emit a <code className="text-xs bg-muted px-1 py-0.5 rounded">ProductRevoked</code> event
            on Solana and permanently deactivate this tag. Customers who scan it will
            see &quot;recalled or deactivated&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">UID</span> <code className="ml-2 font-mono text-xs">{tag.uid}</code></p>
          <p><span className="text-muted-foreground">Product</span> <span className="ml-2 font-medium">{tag.productName}</span></p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRevoke} disabled={loading}>
            {loading ? "Revoking…" : "Revoke Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RowActions({
  row,
  onRevoke,
}: {
  row: Tag;
  onRevoke: (id: string) => void;
}) {
  const [revokeOpen, setRevokeOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={explorerTx(row.registrationTx)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="size-3.5 mr-2" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          {row.active && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setRevokeOpen(true)}
            >
              <ShieldOffIcon className="size-3.5 mr-2" />
              Revoke Tag
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RevokeDialog
        tag={row}
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        onRevoked={onRevoke}
      />
    </>
  );
}

export function getColumns(
  onRevoke: (id: string) => void
): ColumnDef<Tag>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "uid",
      header: "UID",
      cell: ({ row }) => (
        <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
          {(row.getValue("uid") as string).slice(0, 8)}…
        </code>
      ),
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Product
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) =>
        row.getValue("active") ? (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-destructive border-destructive/40">
            Revoked
          </Badge>
        ),
    },
    {
      accessorKey: "registrationTx",
      header: "Tx",
      cell: ({ row }) => {
        const sig = row.getValue("registrationTx") as string;
        return (
          <a
            href={explorerTx(sig)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline underline-offset-2"
          >
            <code className="text-xs font-mono">
              {sig.slice(0, 6)}…{sig.slice(-4)}
            </code>
            <ExternalLinkIcon className="size-3" />
          </a>
        );
      },
    },
    {
      accessorKey: "registeredAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Registered
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.getValue("registeredAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActions row={row.original} onRevoke={onRevoke} />
      ),
    },
  ];
}
