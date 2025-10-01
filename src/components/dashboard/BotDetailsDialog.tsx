import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot } from "@/types/bot";
import { TrendingUp, Activity, Clock, DollarSign } from "lucide-react";

interface BotDetailsDialogProps {
  bot: Bot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BotDetailsDialog = ({ bot, open, onOpenChange }: BotDetailsDialogProps) => {
  if (!bot) return null;

  const getStatusColor = () => {
    switch (bot.status) {
      case "active": return "success";
      case "paused": return "warning";
      case "maintenance": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusText = () => {
    switch (bot.status) {
      case "active": return "Aktiv";
      case "paused": return "Pausiert";
      case "maintenance": return "Wartung";
      default: return "Unbekannt";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{bot.icon}</span>
            <div>
              <DialogTitle className="text-2xl">{bot.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{bot.description}</p>
            </div>
            <Badge variant={getStatusColor() as any} className="ml-auto">
              {getStatusText()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-profit" />
                  Gesamtgewinn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-profit">{bot.earnings}</div>
                <p className="text-xs text-muted-foreground mt-1">Seit Start</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Tagesgewinn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-profit">+{bot.dailyProfit}</div>
                <p className="text-xs text-muted-foreground mt-1">Heute</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Tagesfortschritt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aktivität</span>
                  <span className="text-card-foreground font-medium">{bot.progress}%</span>
                </div>
                <Progress value={bot.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Performance Metriken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Erfolgsrate</div>
                  <div className="text-lg font-bold text-profit">94.2%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Trades Heute</div>
                  <div className="text-lg font-bold text-card-foreground">142</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Durchschn. Gewinn</div>
                  <div className="text-lg font-bold text-profit">€8.67</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Laufzeit</div>
                  <div className="text-lg font-bold text-card-foreground">18h 24m</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">Letzte Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Trade ausgeführt</span>
                  <span className="text-profit">+€12.50</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Trade ausgeführt</span>
                  <span className="text-profit">+€8.90</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Trade ausgeführt</span>
                  <span className="text-profit">+€15.30</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status-Update</span>
                  <span className="text-card-foreground">Optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
