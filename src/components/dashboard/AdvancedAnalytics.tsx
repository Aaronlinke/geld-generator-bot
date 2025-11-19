import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [botDistribution, setBotDistribution] = useState<any[]>([]);
  const [hourlyPerformance, setHourlyPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load monthly performance data
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (transactions) {
        // Group by month
        const monthlyData = transactions.reduce((acc: any, tx: any) => {
          const month = new Date(tx.created_at).toLocaleDateString('de-DE', { month: 'short' });
          if (!acc[month]) {
            acc[month] = { month, gewinn: 0, kosten: 0, netto: 0 };
          }
          
          const amount = parseFloat(tx.amount);
          if (tx.transaction_type === 'bot_earning') {
            acc[month].gewinn += amount > 0 ? amount : 0;
            acc[month].kosten += amount < 0 ? Math.abs(amount) : 0;
          } else if (tx.transaction_type === 'withdrawal') {
            acc[month].kosten += Math.abs(amount);
          }
          acc[month].netto = acc[month].gewinn - acc[month].kosten;
          
          return acc;
        }, {});

        setPerformanceData(Object.values(monthlyData));
      }

      // Load bot distribution
      const { data: bots } = await supabase
        .from('bot_strategies')
        .select('strategy_type')
        .eq('user_id', user?.id);

      if (bots) {
        const distribution = bots.reduce((acc: any, bot: any) => {
          acc[bot.strategy_type] = (acc[bot.strategy_type] || 0) + 1;
          return acc;
        }, {});

        const colors = {
          scalping: "hsl(142 71% 45%)",
          swing: "hsl(217 32% 20%)",
          arbitrage: "hsl(45 93% 58%)",
          market_making: "hsl(0 84% 60%)",
        };

        const distData = Object.entries(distribution).map(([type, count]) => ({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: count as number,
          color: colors[type as keyof typeof colors] || "hsl(var(--primary))",
        }));

        setBotDistribution(distData);
      }

      // Load hourly performance (from trades)
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .gte('executed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (trades) {
        const hourlyData = new Array(8).fill(0).map((_, i) => ({
          time: `${String(i * 3).padStart(2, '0')}:00`,
          aktivität: 0,
        }));

        trades.forEach((trade: any) => {
          const hour = new Date(trade.executed_at).getHours();
          const index = Math.floor(hour / 3);
          if (hourlyData[index]) {
            hourlyData[index].aktivität += 1;
          }
        });

        setHourlyPerformance(hourlyData);
      }

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Fehler beim Laden der Analysen');
    } finally {
      setLoading(false);
    }
  };
  const handleExport = () => {
    const csvData = [
      ['Performance Data'],
      ['Month', 'Gewinn', 'Kosten', 'Netto'],
      ...performanceData.map(d => [d.month, d.gewinn, d.kosten, d.netto]),
      [],
      ['Bot Distribution'],
      ['Type', 'Count'],
      ...botDistribution.map(d => [d.name, d.value]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Analyse exportiert');
  };

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Erweiterte Analysen</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="distribution">Verteilung</TabsTrigger>
            <TabsTrigger value="activity">Aktivität</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gewinn"
                    stroke="hsl(var(--profit))"
                    strokeWidth={2}
                    name="Gewinn"
                  />
                  <Line
                    type="monotone"
                    dataKey="kosten"
                    stroke="hsl(var(--loss))"
                    strokeWidth={2}
                    name="Kosten"
                  />
                  <Line
                    type="monotone"
                    dataKey="netto"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Netto"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Durchschn. Gewinn</div>
                <div className="text-2xl font-bold text-profit">€2,677</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Durchschn. Kosten</div>
                <div className="text-2xl font-bold text-loss">€4,351</div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">ROI</div>
                <div className="text-2xl font-bold text-primary">-38.5%</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="h-[400px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={botDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {botDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {botDistribution.map((bot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: bot.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-card-foreground">{bot.name}</div>
                    <div className="text-xs text-muted-foreground">{bot.value}% Anteil</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="aktivität" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Aktivitäts-Insights</div>
              <div className="space-y-2 text-sm text-card-foreground">
                <p>• Höchste Aktivität zwischen 12:00 - 15:00 Uhr</p>
                <p>• Niedrigste Aktivität in den frühen Morgenstunden</p>
                <p>• Durchschnittliche Aktivität: 63.75%</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};