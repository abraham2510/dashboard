import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

interface SectionCardsProps {
  cryptoData: CryptoData[];
  loading: boolean;
}

export function SectionCards({ cryptoData, loading }: SectionCardsProps) {
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

  const getTopCrypto = () => {
    if (!cryptoData || cryptoData.length === 0) return null;
    return cryptoData[0]; // First one is Bitcoin (highest market cap)
  };

  const getTotalMarketCap = () => {
    if (!cryptoData) return 0;
    return cryptoData.reduce((sum, crypto) => sum + crypto.market_cap, 0);
  };

  const getTotalVolume = () => {
    if (!cryptoData) return 0;
    return cryptoData.reduce((sum, crypto) => sum + crypto.total_volume, 0);
  };

  const getAveragePriceChange = () => {
    if (!cryptoData || cryptoData.length === 0) return 0;
    const sum = cryptoData.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0);
    return sum / cryptoData.length;
  };

  const topCrypto = getTopCrypto();
  const totalMarketCap = getTotalMarketCap();
  const totalVolume = getTotalVolume();
  const avgPriceChange = getAveragePriceChange();

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Market Cap</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalMarketCap)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              <span className="hidden sm:inline">{formatPercentage(avgPriceChange)}</span>
              <span className="sm:hidden">{avgPriceChange >= 0 ? '+' : ''}{avgPriceChange.toFixed(1)}%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Global cryptocurrency market {avgPriceChange >= 0 ? 'trending up' : 'trending down'} 
            {avgPriceChange >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Top {cryptoData.length} cryptocurrencies tracked
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>24h Trading Volume</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalVolume)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              <span className="hidden sm:inline">Active trading</span>
              <span className="sm:hidden">Live</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High liquidity across markets <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total volume across all tracked assets
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Asset: {topCrypto?.name}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {topCrypto ? formatCurrency(topCrypto.current_price) : '$0.00'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {topCrypto
                ? topCrypto.price_change_percentage_24h >= 0
                  ? <IconTrendingUp />
                  : <IconTrendingDown />
                : null}
              <span className="hidden sm:inline">{topCrypto ? formatPercentage(topCrypto.price_change_percentage_24h) : '0%'}</span>
              <span className="sm:hidden">{topCrypto ? `${topCrypto.price_change_percentage_24h >= 0 ? '+' : ''}${topCrypto.price_change_percentage_24h.toFixed(1)}%` : '0%'}</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {topCrypto
              ? topCrypto.price_change_percentage_24h >= 0
                ? 'Price increasing'
                : 'Price decreasing'
              : 'No data'} 
            {topCrypto
              ? topCrypto.price_change_percentage_24h >= 0
                ? <IconTrendingUp className="size-4" />
                : <IconTrendingDown className="size-4" />
              : null}
          </div>
          <div className="text-muted-foreground">
            Market cap: {topCrypto ? formatCurrency(topCrypto.market_cap) : '$0'}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Cryptocurrencies</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cryptoData.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              <span className="hidden sm:inline">Live data</span>
              <span className="sm:hidden">Live</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Real-time market tracking <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Updated every minute
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
