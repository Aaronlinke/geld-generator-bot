import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export const StatsOverview = () => {
  const stats = [
    {
      title: "Gesamtgewinn",
      value: "€234,567.89",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-profit"
    },
    {
      title: "Aktive Bots",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "Erfolgsrate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-profit"
    },
    {
      title: "ROI (30 Tage)",
      value: "287%",
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
      color: "text-profit"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
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