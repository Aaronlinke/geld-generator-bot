import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", earnings: 0 },
  { time: "04:00", earnings: 8450 },
  { time: "08:00", earnings: 16780 },
  { time: "12:00", earnings: 28900 },
  { time: "16:00", earnings: 34560 },
  { time: "20:00", earnings: 42780 },
  { time: "24:00", earnings: 47523 },
];

export const EarningsChart = () => {
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