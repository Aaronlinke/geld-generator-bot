import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface BotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botId: string;
  botName: string;
}

export const BotSettingsDialog = ({ open, onOpenChange, botId, botName }: BotSettingsDialogProps) => {
  const { user } = useAuth();
  const [riskLevel, setRiskLevel] = useState([50]);
  const [maxDaily, setMaxDaily] = useState("10");
  const [autoRestart, setAutoRestart] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [stopLoss, setStopLoss] = useState("5");
  const [takeProfit, setTakeProfit] = useState("10");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && botId) {
      loadBotSettings();
    }
  }, [open, botId]);

  const loadBotSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_strategies')
        .select('*')
        .eq('id', botId)
        .single();

      if (error) throw error;

      if (data) {
        setRiskLevel([data.risk_level || 50]);
        setMaxDaily(data.max_daily_trades?.toString() || "10");
        setAutoRestart(data.auto_restart || false);
        setNotifications(data.notifications_enabled || true);
        setStopLoss(data.stop_loss_percentage?.toString() || "5");
        setTakeProfit(data.take_profit_percentage?.toString() || "10");
      }
    } catch (error: any) {
      console.error('Error loading bot settings:', error);
      toast.error('Fehler beim Laden der Einstellungen');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bot_strategies')
        .update({
          risk_level: riskLevel[0],
          max_daily_trades: parseInt(maxDaily),
          auto_restart: autoRestart,
          notifications_enabled: notifications,
          stop_loss_percentage: parseFloat(stopLoss),
          take_profit_percentage: parseFloat(takeProfit),
          updated_at: new Date().toISOString()
        })
        .eq('id', botId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'bot_updated',
        resource_type: 'bot_strategy',
        resource_id: botId,
        metadata: { bot_name: botName }
      });

      toast.success('Einstellungen erfolgreich gespeichert');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving bot settings:', error);
      toast.error(error.message || 'Fehler beim Speichern der Einstellungen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{botName} - Einstellungen</DialogTitle>
          <DialogDescription>
            Konfigurieren Sie die Parameter für optimale Performance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="risk">Risiko</TabsTrigger>
            <TabsTrigger value="automation">Automatisierung</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxDaily">Maximales Tagesbudget (€)</Label>
              <Input
                id="maxDaily"
                type="number"
                value={maxDaily}
                onChange={(e) => setMaxDaily(e.target.value)}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop-Loss Limit (€)</Label>
              <Input
                id="stopLoss"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="1000"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <div className="font-medium">Benachrichtigungen</div>
                <div className="text-sm text-muted-foreground">
                  Erhalte Updates über Bot-Aktivitäten
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Risiko-Level: {riskLevel[0]}%</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Höheres Risiko = Höhere potenzielle Gewinne
                </p>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Konservativ</div>
                  <div className="text-xs text-muted-foreground">1-33%</div>
                </div>
                <div className="p-4 bg-card border border-primary/50 rounded-lg">
                  <div className="text-sm text-card-foreground mb-1">Moderat</div>
                  <div className="text-xs text-muted-foreground">34-66%</div>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Aggressiv</div>
                  <div className="text-xs text-muted-foreground">67-100%</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <div className="font-medium">Auto-Restart</div>
                <div className="text-sm text-muted-foreground">
                  Bot automatisch nach Fehler neu starten
                </div>
              </div>
              <Switch
                checked={autoRestart}
                onCheckedChange={setAutoRestart}
              />
            </div>

            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <div className="font-medium">Zeitplan</div>
              <div className="text-sm text-muted-foreground">
                Bot läuft: 24/7
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Zeitplan anpassen
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};