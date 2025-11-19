import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const EarningsChart = () => {
  const [data, setData] = useState<Array<{ time: string; earnings: number }>>([]);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('amount, created_at')
        .eq('transaction_type', 'earning')
        .order('created_at', { ascending: true });

      if (transactions) {
        // Group by hour
        const hourlyData: Record<string, number> = {};
        transactions.forEach(tx => {
          const hour = new Date(tx.created_at).getHours();
          const timeKey = `${hour.toString().padStart(2, '0')}:00`;
          hourlyData[timeKey] = (hourlyData[timeKey] || 0) + tx.amount;
        });

        const chartData = Object.entries(hourlyData).map(([time, earnings]) => ({
          time,
          earnings
        }));

        setData(chartData);
      }
    } catch (error) {
      console.error('Error loading earnings data:', error);
    }
  };
  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Tägliche Einnahmen in Echtzeit
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Live-Tracking aller automatisierten Einkommensströme
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))"
                }}
                formatter={(value: number) => [`€${value.toLocaleString()}`, "Einnahmen"]}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="hsl(var(--profit))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--profit))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--profit))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};