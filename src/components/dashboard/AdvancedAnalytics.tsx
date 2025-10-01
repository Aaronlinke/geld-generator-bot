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
import { Download, TrendingUp } from "lucide-react";

const performanceData = [
  { month: "Jan", gewinn: 4000, kosten: 2400, netto: 1600 },
  { month: "Feb", gewinn: 3000, kosten: 1398, netto: 1602 },
  { month: "Mär", gewinn: 2000, kosten: 9800, netto: -7800 },
  { month: "Apr", gewinn: 2780, kosten: 3908, netto: -1128 },
  { month: "Mai", gewinn: 1890, kosten: 4800, netto: -2910 },
  { month: "Jun", gewinn: 2390, kosten: 3800, netto: -1410 },
];

const botDistribution = [
  { name: "Crypto Bots", value: 35, color: "hsl(142 71% 45%)" },
  { name: "Trading Bots", value: 25, color: "hsl(217 32% 20%)" },
  { name: "Marketing Bots", value: 20, color: "hsl(45 93% 58%)" },
  { name: "E-Commerce", value: 20, color: "hsl(0 84% 60%)" },
];

const hourlyPerformance = [
  { time: "00:00", aktivität: 40 },
  { time: "03:00", aktivität: 30 },
  { time: "06:00", aktivität: 60 },
  { time: "09:00", aktivität: 80 },
  { time: "12:00", aktivität: 95 },
  { time: "15:00", aktivität: 70 },
  { time: "18:00", aktivität: 85 },
  { time: "21:00", aktivität: 50 },
];

export const AdvancedAnalytics = () => {
  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting analytics data...");
  };

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Erweiterte Analysen</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
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