"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Tag = {
  id: string;
  uid: string;
  productId: string;
  productName: string;
  manufacturerPda: string;
  registrationTx: string;
  registeredAt: string;
};

const CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";
const explorerSuffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;

function explorerTx(sig: string) {
  return `https://explorer.solana.com/tx/${sig}${explorerSuffix}`;
}

export function getColumns(): ColumnDef<Tag>[] {
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
  ];
}
