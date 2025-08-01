"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import api from "@/lib/api";

export default function Page() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/coins/list", {
          params: {
            include_platform: false,
          },
        });
        setCryptoData(res.data);
        console.log("Fetched coins:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch coins:", err);
        setError("Failed to fetch cryptocurrency list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoins = filteredCoins.slice(startIndex, endIndex);

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-lg">Loading cryptocurrency list...</span>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">Cryptocurrency List</h1>
                  <p className="text-muted-foreground">
                    Complete list of all available cryptocurrencies
                  </p>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search cryptocurrencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Table className="mt-6">
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCoins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No cryptocurrencies found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentCoins.map((coin) => (
                          <TableRow key={coin.id}>
                            <TableCell className="font-medium">
                              {coin.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {coin.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {coin.symbol.toUpperCase()}
                            </TableCell>
                            <TableCell className="text-right">
                              <a
                                href={`/coins/${coin.id}`}
                                className="text-primary hover:underline"
                              >
                                View Details
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                                     <div className="flex items-center justify-between space-x-2 py-4">
                     <div className="flex-1 text-sm text-muted-foreground">
                       Showing {startIndex + 1} to {Math.min(endIndex, filteredCoins.length)} of {filteredCoins.length} cryptocurrencies
                     </div>
                     <div className="space-x-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setCurrentPage(currentPage - 1)}
                         disabled={currentPage <= 1}
                       >
                         Previous
                       </Button>
                       <span className="text-sm text-muted-foreground">
                         Page {currentPage} of {totalPages}
                       </span>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setCurrentPage(currentPage + 1)}
                         disabled={currentPage >= totalPages}
                       >
                         Next
                       </Button>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}