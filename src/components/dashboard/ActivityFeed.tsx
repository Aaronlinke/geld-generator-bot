import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "@/types/bot";
import { Clock } from "lucide-react";

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "bot_started": return "text-profit";
      case "bot_paused": return "text-warning";
      case "withdrawal": return "text-primary";
      case "earning": return "text-profit";
      case "alert": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className={`text-2xl ${getActivityColor(activity.type)}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-card-foreground mb-1">
                    {activity.title}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.timestamp}
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
