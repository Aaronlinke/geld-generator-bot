import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Play, Square } from "lucide-react";
import { toast } from "sonner";

export const BotExecutionPanel = () => {
  const { user } = useAuth();
  const [activeBots, setActiveBots] = useState<any[]>([]);
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadActiveBots();
    }
  }, [user]);

  const loadActiveBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_strategies')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      setActiveBots(data || []);
    } catch (error) {
      console.error('Error loading active bots:', error);
    }
  };

  const executeBotStrategy = async (botId: string) => {
    let responseData: any = null;
    try {
      setExecuting(botId);
      const { data, error } = await supabase.functions.invoke('execute-bot-strategy', {
        body: { botStrategyId: botId }
      });

      responseData = data;

      if (error) throw error;

      if (data.success) {
        toast.success(data.message || 'Bot erfolgreich ausgeführt');
        await loadActiveBots();
      }
    } catch (error: any) {
      console.error('Error executing bot:', error);
      
      // Check for specific error types in the response
      const errorMsg = error.message || responseData?.error || "Bot konnte nicht ausgeführt werden";
      
      if (errorMsg.includes('INSUFFICIENT_CREDITS')) {
        toast.error('⚠️ Keine AI Credits mehr!', {
          description: 'Lovable AI Credits aufgebraucht! Gehe zu Settings → Workspace → Usage um Credits aufzuladen.'
        });
      } else if (errorMsg.includes('RATE_LIMITED')) {
        toast.error('⏱️ Rate Limit erreicht', {
          description: 'Zu viele Anfragen. Bitte warte einen Moment.'
        });
      } else {
        toast.error('Fehler bei der Bot-Ausführung', {
          description: errorMsg
        });
      }
    } finally {
      setExecuting(null);
    }
  };

  const executeAllBots = async () => {
    for (const bot of activeBots) {
      await executeBotStrategy(bot.id);
      // Wait 2 seconds between executions to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  return (
    <Card className="bg-gradient-dark border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Bot Ausführung</CardTitle>
          <Button
            variant="default"
            size="sm"
            onClick={executeAllBots}
            disabled={activeBots.length === 0 || executing !== null}
          >
            <Play className="w-4 h-4 mr-2" />
            Alle ausführen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeBots.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keine aktiven Bots
            </p>
          ) : (
            activeBots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
              >
                <div>
                  <h4 className="font-semibold text-card-foreground">{bot.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {bot.strategy_type} • Risk: {bot.risk_level}/10
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => executeBotStrategy(bot.id)}
                  disabled={executing === bot.id}
                >
                  {executing === bot.id ? (
                    <>
                      <Square className="w-4 h-4 mr-2 animate-pulse" />
                      Läuft...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ausführen
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tipp:</strong> Bots verwenden KI-Analyse für Trading-Entscheidungen und führen Paper-Trading mit echten Marktdaten durch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};