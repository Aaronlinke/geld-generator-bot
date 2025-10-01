import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, TrendingUp, Clock } from "lucide-react";

interface Withdrawal {
  id: string;
  amount: string;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
  account: string;
}

const withdrawals: Withdrawal[] = [
  {
    id: "WD-001",
    amount: "€5,000.00",
    date: "2025-09-28",
    method: "Bank Transfer",
    status: "completed",
    account: "DE89 **** 1234"
  },
  {
    id: "WD-002",
    amount: "€2,500.00",
    date: "2025-09-25",
    method: "PayPal",
    status: "completed",
    account: "user@email.com"
  },
  {
    id: "WD-003",
    amount: "€10,000.00",
    date: "2025-09-30",
    method: "Bank Transfer",
    status: "pending",
    account: "DE89 **** 1234"
  },
  {
    id: "WD-004",
    amount: "€3,200.00",
    date: "2025-09-20",
    method: "Crypto",
    status: "completed",
    account: "0x7a8f...4d2e"
  },
  {
    id: "WD-005",
    amount: "€1,800.00",
    date: "2025-09-15",
    method: "PayPal",
    status: "failed",
    account: "user@email.com"
  }
];

export const WithdrawalHistory = () => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "pending": return "warning";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Abgeschlossen";
      case "pending": return "In Bearbeitung";
      case "failed": return "Fehlgeschlagen";
      default: return "Unbekannt";
    }
  };

  const totalWithdrawn = withdrawals
    .filter(w => w.status === "completed")
    .reduce((sum, w) => sum + parseFloat(w.amount.replace(/[€,]/g, "")), 0);

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Auszahlungshistorie</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Gesamt: €{totalWithdrawn.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/30 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-card-foreground">{withdrawal.amount}</span>
                      <Badge variant={getStatusVariant(withdrawal.status) as any}>
                        {getStatusText(withdrawal.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {withdrawal.date}
                      </div>
                      <div>{withdrawal.method} • {withdrawal.account}</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {withdrawal.id}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};