import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeBots: 0,
    winRate: 0,
    roi: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: bots } = await supabase
        .from('bot_strategies')
        .select('*');

      const activeBots = bots?.filter(b => b.status === 'active').length || 0;
      const totalEarnings = bots?.reduce((sum, b) => sum + (b.total_earnings || 0), 0) || 0;
      const avgWinRate = bots?.reduce((sum, b) => sum + (b.win_rate || 0), 0) / (bots?.length || 1);
      
      // Calculate ROI (total earnings / initial investment)
      const roi = totalEarnings > 0 ? ((totalEarnings / 10000) * 100) : 0;

      setStats({
        totalEarnings,
        activeBots,
        winRate: avgWinRate,
        roi
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statsDisplay = [
    {
      title: "Gesamtgewinn",
      value: `€${stats.totalEarnings.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-profit"
    },
    {
      title: "Aktive Bots",
      value: stats.activeBots.toString(),
      change: "+2",
      trend: "up",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "Erfolgsrate",
      value: `${stats.winRate.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-profit"
    },
    {
      title: "ROI (30 Tage)",
      value: `${stats.roi.toFixed(0)}%`,
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
      color: "text-profit"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsDisplay.map((stat, index) => (
        <Card key={index} className="bg-gradient-dark border-border hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-profit mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-loss mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-profit" : "text-loss"}>
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-1">vs. letzten Monat</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};