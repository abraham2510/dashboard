"use client"

import * as React from "react"
import Image from "next/image"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: unknown;
  last_updated: string;
}

interface CryptoTableProps {
  cryptoData: CryptoData[];
}

export function CryptoTable({ cryptoData }: CryptoTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const columns: ColumnDef<CryptoData>[] = [
    {
      accessorKey: "market_cap_rank",
      header: "Rank",
      cell: ({ row }) => (
        <div className="font-medium">#{row.original.market_cap_rank}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
            <Image 
              src={row.original.image} 
              alt={row.original.name}
              width={32}
              height={32}
              className="object-cover"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3E{row.original.symbol}%3C/text%3E%3C/svg%3E"
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{row.original.name}</div>
            <div className="text-sm text-muted-foreground uppercase truncate">
              {row.original.symbol}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "current_price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.current_price)}
        </div>
      ),
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "24h Change",
      cell: ({ row }) => {
        const change = row.original.price_change_percentage_24h;
        const isPositive = change >= 0;
        return (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />}
            <span className="font-medium">{formatPercentage(change)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "market_cap",
      header: "Market Cap",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.market_cap)}
        </div>
      ),
    },
    {
      accessorKey: "total_volume",
      header: "Volume (24h)",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.total_volume)}
        </div>
      ),
    },
    {
      accessorKey: "circulating_supply",
      header: "Circulating Supply",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.circulating_supply.toLocaleString()} {row.original.symbol.toUpperCase()}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: cryptoData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cryptocurrency Market</h2>
        <Input
          placeholder="Search cryptocurrencies..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} cryptocurrencies
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 