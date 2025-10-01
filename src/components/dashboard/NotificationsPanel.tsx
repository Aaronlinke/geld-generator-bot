import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Crypto Bot: Gewinn erzielt",
    message: "€1,234.56 Gewinn in den letzten 24 Stunden",
    time: "vor 5 Minuten",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Forex Bot: Hohes Volumen",
    message: "Ungewöhnlich hohe Handelsaktivität erkannt",
    time: "vor 23 Minuten",
    read: false,
  },
  {
    id: "3",
    type: "error",
    title: "Mining Bot: Verbindungsfehler",
    message: "Konnte keine Verbindung zum Mining Pool herstellen",
    time: "vor 1 Stunde",
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "System Update verfügbar",
    message: "Neue Features und Verbesserungen sind verfügbar",
    time: "vor 2 Stunden",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Auszahlung abgeschlossen",
    message: "€5,000.00 wurden auf Ihr Konto überwiesen",
    time: "vor 3 Stunden",
    read: true,
  },
];

export const NotificationsPanel = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-profit" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Benachrichtigungen
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">
            Alle als gelesen markieren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read
                    ? "bg-card border-border opacity-60"
                    : "bg-card border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-card-foreground text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};