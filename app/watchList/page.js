"use client";

import { WatchlistTable } from "@/components/watchlistTable";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import api from "@/lib/api";
import Loading from "@/components/loading";

export default function WatchlistPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const watchlist = getWatchlist();
        
        if (watchlist.length === 0) {
          setCoins([]);
          setLoading(false);
          return;
        }

        // Fetch each coin individually to handle errors gracefully
        const coinPromises = watchlist.map(async (id) => {
          try {
            const response = await api.get(`/coins/${id}`, {
              params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false,
              }
            });
            return response.data;
          } catch (err) {
            console.warn(`Failed to fetch coin ${id}:`, err.message);
            // Remove invalid coin from watchlist
            removeFromWatchlist(id);
            return null;
          }
        });

        const responses = await Promise.all(coinPromises);
        const validCoins = responses.filter(coin => coin !== null);
        
        // Transform the data to match the WatchlistTable component's expected structure
        const transformedCoins = validCoins.map(coin => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image?.large || coin.image?.thumb || '',
          current_price: coin.market_data?.current_price?.usd || 0,
          market_cap_rank: coin.market_cap_rank || 0,
          price_change_percentage_24h: coin.market_data?.price_change_percentage_24h || 0,
          market_cap: coin.market_data?.market_cap?.usd || 0,
          total_volume: coin.market_data?.total_volume?.usd || 0,
          circulating_supply: coin.market_data?.circulating_supply || 0,
        }));
        
        console.log("Transformed coins:", transformedCoins);
        setCoins(transformedCoins);
        
        // If no valid coins found, show empty state
        if (transformedCoins.length === 0) {
          setCoins([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch watchlist coins:", err);
        setError("Failed to fetch watchlist data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistCoins();
  }, []);



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
                  <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
                  <p className="text-muted-foreground">
                    Your saved cryptocurrencies
                  </p>
                </div>

                {coins.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">⭐</div>
                      <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                      <p className="text-muted-foreground text-sm">
                        Add cryptocurrencies to your watchlist to see them here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Found {coins.length} coins in watchlist
                      </p>
                    </div>
                    <WatchlistTable cryptoData={coins} />
                    
                    {/* Fallback display if table doesn't work */}
                    {/* <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
                      <div className="space-y-2">
                        {coins.map((coin, index) => (
                          <div key={coin.id} className="p-3 border rounded">
                            <p><strong>{coin.name}</strong> ({coin.symbol})</p>
                            <p>Price: ${coin.current_price}</p>
                            <p>24h Change: {coin.price_change_percentage_24h}%</p>
                          </div>
                        ))}
                      </div>
                    </div> */}
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
