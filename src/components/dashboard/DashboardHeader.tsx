import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export const DashboardHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${dashboardHero})` }}
      />
      <div className="relative bg-gradient-dark p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Geld Maschine Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Automatische Einkommensströme in Echtzeit
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="success" className="text-sm px-3 py-1">
              🟢 Alle Systeme Online
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-profit">
                €47,523.84
              </div>
              <div className="text-sm text-muted-foreground">
                Heute verdient
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};