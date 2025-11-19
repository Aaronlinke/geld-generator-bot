import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Mail, Phone, Shield, Bell, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const UserProfile = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setCountry(data.country || "");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          country: country,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Profil erfolgreich aktualisiert');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Fehler beim Speichern des Profils');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{firstName} {lastName}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {email}
                </div>
                <Badge variant="success">Premium</Badge>
              </div>
            </div>
            <Button variant="outline">
              Profilbild ändern
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Persönlich</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="billing">Abrechnung</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="bg-gradient-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Persönliche Informationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gradient-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sicherheitseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Aktuelles Passwort</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Neues Passwort</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Passwort ändern</Button>

              <div className="mt-6 p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold mb-2 text-card-foreground">Zwei-Faktor-Authentifizierung</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Erhöhen Sie die Sicherheit Ihres Kontos mit 2FA
                </p>
                <Button variant="outline">2FA aktivieren</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-gradient-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Benachrichtigungseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Bot-Status Updates", desc: "Benachrichtigungen wenn Bots starten/stoppen" },
                { title: "Gewinn-Alerts", desc: "Mitteilungen bei signifikanten Gewinnen" },
                { title: "Fehler-Meldungen", desc: "Sofortige Benachrichtigung bei Problemen" },
                { title: "Wöchentliche Berichte", desc: "Zusammenfassung Ihrer Performance" },
                { title: "Auszahlungen", desc: "Updates zu Auszahlungsanfragen" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-card-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-gradient-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Abrechnungsinformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-primary rounded-lg text-primary-foreground">
                <div className="text-sm mb-2">Aktueller Plan</div>
                <div className="text-3xl font-bold mb-4">Premium Plan</div>
                <div className="text-sm opacity-90">€99.99/Monat</div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-card-foreground">Zahlungsmethoden</h3>
                <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center">
                      💳
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">•••• •••• •••• 4242</div>
                      <div className="text-sm text-muted-foreground">Läuft ab 12/2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Bearbeiten</Button>
                </div>
              </div>

              <Button className="w-full">Zahlungsmethode hinzufügen</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};