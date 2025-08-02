"use client";

import Image from "next/image";
import { addToWatchlist, removeFromWatchlist, isCoinInWatchlist } from "@/lib/watchlist";
import { CircleChevronLeft } from "lucide-react";
import {
  Line,
  LineChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
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

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [coinData, setCoinData] = useState(null);
  const [marketChartData, setMarketChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const goToCoinDetails = () => {
    router.push(`/coins/${id}/market_chart`);
  };

  // Chart configuration
  const chartConfig = {
    type: "line",
    data: marketChartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
  };

  // StarButton component
  const StarButton = ({ coinId }) => {
    const [isStarred, setIsStarred] = useState(false);

    useEffect(() => {
      setIsStarred(isCoinInWatchlist(coinId));
    }, [coinId]);

    const toggleStar = () => {
      if (isStarred) {
        removeFromWatchlist(coinId);
      } else {
        addToWatchlist(coinId);
      }
      setIsStarred(!isStarred);
    };

    return (
      <Button 
        onClick={toggleStar}
        variant={isStarred ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-2"
      >
        {isStarred ? "⭐" : "☆"} {isStarred ? "Remove from Watchlist" : "Add to Watchlist"}
      </Button>
    );
  };

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

    const fetchMarketChartData = async () => {
      try {
        const res = await api.get(`/coins/${id}/market_chart`, {
          params: {
            vs_currency: "usd",
            days: 7,
          },
        });
        
        const chartData = res.data.prices.map(([timestamp, price], index) => ({
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
        
        setMarketChartData(chartData);
      } catch (err) {
        console.error("❌ Failed to fetch market chart data:", err);
        // Don't set error for chart data, just log it
      }
    };

    if (id) {
      fetchCoinData();
      fetchMarketChartData();
    }
  }, [id]);

  // Calculate price change for color
  const getPriceChangeColor = () => {
    if (marketChartData.length < 2) return "#3b82f6";
    const firstPrice = marketChartData[0]?.price;
    const lastPrice = marketChartData[marketChartData.length - 1]?.price;
    return lastPrice >= firstPrice ? "#10b981" : "#ef4444";
  };

  if (loading) {
    return <Loading />;
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                        <Image 
                          src={coinData?.image?.large || coinData?.image} 
                          alt={coinData?.name} 
                          width={64}
                          height={64}
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3E{coinData?.symbol || 'COIN'}%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl sm:text-3xl font-bold">
                            {coinData?.name || "Cryptocurrency"}
                          </h1>
                          <span className="text-muted-foreground text-lg">
                            ({coinData?.symbol?.toUpperCase() || "SYM"})
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          Detailed information about {coinData?.name || "this cryptocurrency"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => router.back()}
                      className="self-start sm:self-auto"
                    >
                      <CircleChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={goToCoinDetails}>Go To Market Chart</Button>
                    <StarButton coinId={id} />
                  </div>
                </div>
                
                {coinData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Current Price</h3>
                          <p className="text-2xl font-bold">
                            ${coinData.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Market Cap</h3>
                          <p className="text-2xl font-bold">
                            ${coinData.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">24h Change</h3>
                          <p className={`text-2xl font-bold ${
                            coinData.market_data?.price_change_percentage_24h > 0 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {coinData.market_data?.price_change_percentage_24h?.toFixed(2)}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {marketChartData.length > 0 && (
                      <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-normal">Price Chart (7 Days)</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPriceChangeColor() }}></div>
                            <span className="text-xs text-muted-foreground">
                              {marketChartData.length > 1 && (
                                marketChartData[marketChartData.length - 1].price >= marketChartData[0].price 
                                  ? "↗ Up" 
                                  : "↘ Down"
                              )}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-0">
                          <div className="text-2xl font-bold mb-2">
                            ${marketChartData[marketChartData.length - 1]?.price?.toFixed(2) || "N/A"}
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">Current price</p>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={marketChartData}
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