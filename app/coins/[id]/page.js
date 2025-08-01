"use client";

import api from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/coins/${id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoinData(res.data);
        console.log("Fetched coin data:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch coin data:", err);
        setError("Failed to fetch cryptocurrency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinData();
    }
  }, [id]);

    

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
                <span className="text-lg">Loading cryptocurrency data...</span>
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
                 <div className="flex items-center gap-6 mb-2">
                    <img src={coinData?.image?.large} alt={coinData?.name} className="w-16 h-16 mb-4"/>
                    <span className="text-3xl font-bold mb-2">
                    {coinData?.name || "Cryptocurrency"}
                  </span>
                 </div>
                 <div>
                    <p className="text-muted-foreground mb-2.5">
                    Detailed information about {coinData?.name || "this cryptocurrency"}
                    </p>
                    <h2 className="text-muted-foreground">{coinData.description.en}</h2>
                 </div>
                </div>
                {coinData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Current Price</h3>
                        <p className="text-2xl font-bold">
                          ${coinData.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Market Cap</h3>
                        <p className="text-2xl font-bold">
                          ${coinData.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">24h Change</h3>
                        <p className={`text-2xl font-bold ${
                          coinData.market_data?.price_change_percentage_24h > 0 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {coinData.market_data?.price_change_percentage_24h?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
