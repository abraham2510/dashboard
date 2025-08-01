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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MarketChartPage() {
  const params = useParams();
  const id = params.id;
  const [chartData, setChartData] = useState(null);
  const [coinInfo, setCoinInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("7"); // Default to 7 days

  useEffect(() => {
    const fetchMarketChart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch coin info
        const coinRes = await api.get(`/coins/${id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoinInfo(coinRes.data);

        // Fetch market chart data
        const chartRes = await api.get(`/coins/${id}/market_chart`, {
          params: {
            vs_currency: "usd",
            days: timeframe,
            interval: timeframe === "1" ? "hourly" : "daily",
          },
        });
        setChartData(chartRes.data);
        console.log("Fetched market chart data:", chartRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch market chart data:", err);
        setError("Failed to fetch market chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMarketChart();
    }
  }, [id, timeframe]);

  const timeframes = [
    { value: "1", label: "24 Hours" },
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "3 Months" },
    { value: "365", label: "1 Year" },
  ];

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
                <span className="text-lg">Loading market chart data...</span>
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
                  <h1 className="text-3xl font-bold mb-2">
                    {coinInfo?.name || "Cryptocurrency"} Market Chart
                  </h1>
                  <p className="text-muted-foreground">
                    Price history and market data for {coinInfo?.name || "this cryptocurrency"}
                  </p>
                </div>

                {/* Timeframe Selector */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {timeframes.map((tf) => (
                      <Button
                        key={tf.value}
                        variant={timeframe === tf.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(tf.value)}
                      >
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {chartData && (
                  <div className="space-y-6">
                    {/* Price Chart Data */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Price Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-semibold mb-2">Current Price</h3>
                              <p className="text-2xl font-bold">
                                ${coinInfo?.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-semibold mb-2">Price Change (24h)</h3>
                              <p className={`text-2xl font-bold ${
                                coinInfo?.market_data?.price_change_percentage_24h > 0 
                                  ? "text-green-600" 
                                  : "text-red-600"
                              }`}>
                                {coinInfo?.market_data?.price_change_percentage_24h?.toFixed(2)}%
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-semibold mb-2">Market Cap</h3>
                              <p className="text-2xl font-bold">
                                ${coinInfo?.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chart Data Points */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Chart Data Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {chartData.prices?.length || 0} data points for the selected timeframe.
                          </div>
                          
                          {/* Sample of first few data points */}
                          <div className="max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {chartData.prices?.slice(0, 6).map((price, index) => {
                                const date = new Date(price[0]);
                                const formattedDate = date.toLocaleDateString();
                                const formattedTime = date.toLocaleTimeString();
                                return (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                      {formattedDate} {formattedTime}
                                    </div>
                                    <div className="font-semibold">
                                      ${price[1].toLocaleString()}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Volume Data */}
                    {chartData.total_volumes && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Volume Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              Showing {chartData.total_volumes?.length || 0} volume data points.
                            </div>
                            
                            <div className="max-h-60 overflow-y-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chartData.total_volumes?.slice(0, 6).map((volume, index) => {
                                  const date = new Date(volume[0]);
                                  const formattedDate = date.toLocaleDateString();
                                  return (
                                    <div key={index} className="p-3 border rounded-lg">
                                      <div className="text-sm text-muted-foreground">
                                        {formattedDate}
                                      </div>
                                      <div className="font-semibold">
                                        ${volume[1].toLocaleString()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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