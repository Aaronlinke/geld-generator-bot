import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Settings, Bell, Shield, Wallet } from "lucide-react";

export const SystemSettings = () => {
  const handleSave = () => {
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Systemeinstellungen wurden erfolgreich aktualisiert.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Allgemeine Einstellungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Sprache</Label>
            <Select defaultValue="de">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Währung</Label>
            <Select defaultValue="eur">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-muted-foreground">
                Dunkles Design verwenden
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-dark border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">E-Mail Benachrichtigungen</div>
              <div className="text-sm text-muted-foreground">
                Wichtige Updates per E-Mail erhalten
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">Bot Alerts</div>
              <div className="text-sm text-muted-foreground">
                Bei Bot-Problemen benachrichtigen
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">Täglicher Report</div>
              <div className="text-sm text-muted-foreground">
                Tägliche Zusammenfassung erhalten
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-dark border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sicherheit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Aktuelles Passwort</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Neues Passwort</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Passwort bestätigen</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">Zwei-Faktor-Authentifizierung</div>
              <div className="text-sm text-muted-foreground">
                Zusätzliche Sicherheitsebene aktivieren
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-dark border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Auszahlungseinstellungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-withdrawal">Mindestbetrag für Auszahlung (€)</Label>
            <Input id="min-withdrawal" type="number" defaultValue="100" />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="font-medium">Automatische Auszahlungen</div>
              <div className="text-sm text-muted-foreground">
                Automatisch auszahlen bei Schwellenwert
              </div>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto-withdrawal-amount">Auto-Auszahlungs-Schwelle (€)</Label>
            <Input id="auto-withdrawal-amount" type="number" defaultValue="10000" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Zurücksetzen</Button>
        <Button onClick={handleSave}>Einstellungen speichern</Button>
      </div>
    </div>
  );
};
