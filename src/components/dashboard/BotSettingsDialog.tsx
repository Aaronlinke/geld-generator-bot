import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";

interface BotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botName: string;
}

export const BotSettingsDialog = ({ open, onOpenChange, botName }: BotSettingsDialogProps) => {
  const [riskLevel, setRiskLevel] = useState([50]);
  const [maxDaily, setMaxDaily] = useState("5000");
  const [autoRestart, setAutoRestart] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [stopLoss, setStopLoss] = useState("1000");

  const handleSave = () => {
    toast({
      title: "Einstellungen gespeichert",
      description: `${botName} wurde erfolgreich konfiguriert.`,
    });
    onOpenChange(false);
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