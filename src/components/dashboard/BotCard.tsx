import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BotCardProps {
  name: string;
  description: string;
  earnings: string;
  dailyProfit: string;
  status: "active" | "paused" | "maintenance";
  progress: number;
  icon: string;
  onSettingsClick?: () => void;
}

export const BotCard = ({ 
  name, 
  description, 
  earnings, 
  dailyProfit, 
  status, 
  progress, 
  icon,
  onSettingsClick
}: BotCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "active": return "success";
      case "paused": return "warning";
      case "maintenance": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active": return "Aktiv";
      case "paused": return "Pausiert";
      case "maintenance": return "Wartung";
      default: return "Unbekannt";
    }
  };

  return (
    <Card className="bg-gradient-dark border-border hover:shadow-glow hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <CardTitle className="text-lg text-card-foreground">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge variant={getStatusColor() as any} className="text-xs">
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Gesamtgewinn</div>
            <div className="text-lg font-bold text-profit">{earnings}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Heute</div>
            <div className="text-lg font-bold text-profit">+{dailyProfit}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tagesfortschritt</span>
            <span className="text-card-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onSettingsClick}>
            Einstellungen
          </Button>
          <Button variant={status === "active" ? "destructive" : "default"} size="sm" className="flex-1">
            {status === "active" ? "Pausieren" : "Starten"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};