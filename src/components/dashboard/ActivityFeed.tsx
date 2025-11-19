import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Play, Pause, DollarSign, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Activity {
  id: string;
  action: string;
  created_at: string;
  metadata?: any;
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
}

export const ActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading activities:', error);
        return;
      }

      const formattedActivities: Activity[] = (data || []).map(log => {
        let icon = <Clock className="w-5 h-5" />;
        let title = log.action;
        let description = '';
        let color = 'text-muted-foreground';

        const metadata = log.metadata as any;

        switch (log.action) {
          case 'bot_created':
            icon = <Play className="w-5 h-5" />;
            title = 'Bot erstellt';
            description = `${metadata?.bot_name || 'Neuer Bot'} wurde erstellt`;
            color = 'text-profit';
            break;
          case 'bot_updated':
            icon = <Play className="w-5 h-5" />;
            title = 'Bot aktualisiert';
            description = `${metadata?.bot_name || 'Bot'} wurde aktualisiert`;
            color = 'text-primary';
            break;
          case 'bot_status_changed':
            icon = metadata?.new_status === 'active' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />;
            title = metadata?.new_status === 'active' ? 'Bot gestartet' : 'Bot pausiert';
            description = `${metadata?.bot_name || 'Bot'} ${metadata?.new_status === 'active' ? 'gestartet' : 'pausiert'}`;
            color = metadata?.new_status === 'active' ? 'text-profit' : 'text-warning';
            break;
          case 'withdrawal_requested':
            icon = <DollarSign className="w-5 h-5" />;
            title = 'Auszahlung beantragt';
            description = `€${metadata?.amount?.toFixed(2) || '0.00'} via ${metadata?.payment_method || 'Unbekannt'}`;
            color = 'text-primary';
            break;
          case 'profile_updated':
            icon = <Clock className="w-5 h-5" />;
            title = 'Profil aktualisiert';
            description = 'Ihre Profildaten wurden aktualisiert';
            color = 'text-primary';
            break;
          default:
            description = log.action;
        }

        return {
          id: log.id,
          action: log.action,
          created_at: log.created_at,
          metadata: log.metadata,
          icon,
          title,
          description,
          color
        };
      });

      setActivities(formattedActivities);
    };

    loadActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('audit_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
                <div className={`text-2xl ${activity.color}`}>
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
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: de })}
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
