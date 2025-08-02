"use client";

import { useRouter } from "next/navigation";
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
import {
  Line,
  LineChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Loading from "@/components/loading";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function MarketChartPage() {
  const params = useParams();
  const id = params.id;
  const [chartData, setChartData] = useState(null);
  const [coinInfo, setCoinInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("7"); // Default to 7 days
  const [formattedChartData, setFormattedChartData] = useState([]);

  const router = useRouter();
  
  const backtoMarketChart = () => {
    router.push(`/coins/${id}`);
  }

  // Calculate price change for color
  const getPriceChangeColor = () => {
    if (formattedChartData.length < 2) return "#3b82f6";
    const firstPrice = formattedChartData[0]?.price;
    const lastPrice = formattedChartData[formattedChartData.length - 1]?.price;
    return lastPrice >= firstPrice ? "#10b981" : "#ef4444";
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "1": return "24 Hours";
      case "7": return "7 Days";
      case "14": return "14 Days";
      case "30": return "30 Days";
      case "90": return "3 Months";
      case "365": return "1 Year";
      default: return "7 Days";
    }
  };

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
            ...(timeframe !== "1" && { interval: "daily" }),
          },
        });
        setChartData(chartRes.data);

        // Format chart data for the line chart
        const formattedData = chartRes.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          price: price,
          time: new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }));
        setFormattedChartData(formattedData);

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
    return <Loading />;
  }

  if (error) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-muted-foreground">{error}</p>
                <div>
                  <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
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
                <div className="mb-4">
                  <Button onClick={backtoMarketChart} variant="outline" size="sm" className="flex items-center gap-2">View Coin Details</Button>
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
                    {/* Enhanced Price Chart */}
                    {formattedChartData.length > 0 && (
                      <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div className="flex items-center gap-4">
                            <CardTitle className="text-sm font-normal">Price Chart ({getTimeframeLabel()})</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPriceChangeColor() }}></div>
                            <span className="text-xs text-muted-foreground">
                              {formattedChartData.length > 1 && (
                                formattedChartData[formattedChartData.length - 1].price >= formattedChartData[0].price 
                                  ? "↗ Up" 
                                  : "↘ Down"
                              )}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-0">
                          <div className="text-2xl font-bold mb-2">
                            ${formattedChartData[formattedChartData.length - 1]?.price?.toFixed(2) || "N/A"}
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">Current price</p>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={formattedChartData}
                                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                              >
                                <defs>
                                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={getPriceChangeColor()} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={getPriceChangeColor()} stopOpacity={0.05}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#6b7280" 
                                  fontSize={12}
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <YAxis 
                                  stroke="#6b7280" 
                                  fontSize={12}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                  type="monotone"
                                  dataKey="price"
                                  stroke={getPriceChangeColor()}
                                  strokeWidth={3}
                                  dot={false}
                                  fill="url(#priceGradient)"
                                  fillOpacity={0.3}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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