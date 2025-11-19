import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface MarketData {
  symbol: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  last_updated: string;
}

export const MarketDataPanel = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketData();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('market-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'market_data'
        },
        () => loadMarketData()
      )
      .subscribe();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLatestPrices, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const loadMarketData = async () => {
    try {
      // Get latest price for each symbol
      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by symbol and get latest
      const latest = data?.reduce((acc: any, item: any) => {
        if (!acc[item.symbol]) {
          acc[item.symbol] = item;
        }
        return acc;
      }, {});

      setMarketData(Object.values(latest || {}));
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  };

  const fetchLatestPrices = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('market-data');
      
      if (error) throw error;
      
      toast.success('Marktdaten aktualisiert');
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast.error('Fehler beim Abrufen der Marktdaten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Live Marktdaten</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLatestPrices}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Keine Marktdaten verfügbar</p>
              <Button onClick={fetchLatestPrices} disabled={loading}>
                Marktdaten abrufen
              </Button>
            </div>
          ) : (
            marketData.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
              >
                <div>
                  <h4 className="font-semibold text-card-foreground">{item.symbol}</h4>
                  <p className="text-2xl font-bold text-card-foreground">
                    ${item.price.toLocaleString('de-DE', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 ${
                      item.price_change_24h >= 0 ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {item.price_change_24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {item.price_change_24h.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vol: ${(item.volume_24h / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};