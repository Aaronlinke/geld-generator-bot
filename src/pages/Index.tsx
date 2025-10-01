import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { BotCard } from "@/components/dashboard/BotCard";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { WithdrawalDialog } from "@/components/dashboard/WithdrawalDialog";
import { WithdrawalHistory } from "@/components/dashboard/WithdrawalHistory";
import { BotSettingsDialog } from "@/components/dashboard/BotSettingsDialog";
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState("");
  
  const bots = [
    {
      name: "Crypto Arbitrage Bot",
      description: "Automatischer Krypto-Handel zwischen Börsen",
      earnings: "€45,678.23",
      dailyProfit: "€1,234.56",
      status: "active" as const,
      progress: 87,
      icon: "₿"
    },
    {
      name: "Forex Trading Bot",
      description: "KI-gestützter Devisenhandel",
      earnings: "€32,145.67",
      dailyProfit: "€892.34",
      status: "active" as const,
      progress: 92,
      icon: "💱"
    },
    {
      name: "Affiliate Marketing Bot",
      description: "Automatische Affiliate-Kampagnen",
      earnings: "€18,934.21",
      dailyProfit: "€456.78",
      status: "active" as const,
      progress: 76,
      icon: "🔗"
    },
    {
      name: "Dropshipping Bot",
      description: "Produktlistung und Bestellabwicklung",
      earnings: "€28,567.89",
      dailyProfit: "€723.45",
      status: "paused" as const,
      progress: 45,
      icon: "📦"
    },
    {
      name: "Social Media Bot",
      description: "Automatisierte Content-Monetarisierung",
      earnings: "€12,345.67",
      dailyProfit: "€234.56",
      status: "active" as const,
      progress: 68,
      icon: "📱"
    },
    {
      name: "Mining Pool Bot",
      description: "Optimierte Krypto-Mining Verwaltung",
      earnings: "€56,789.12",
      dailyProfit: "€1,456.78",
      status: "maintenance" as const,
      progress: 0,
      icon: "⛏️"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="withdrawals">Auszahlungen</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <StatsOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EarningsChart />
              </div>
              <div className="space-y-4">
                <Card className="bg-gradient-dark border-border p-6">
                  <h3 className="font-bold text-card-foreground mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded hover:bg-secondary/20 text-sm text-muted-foreground hover:text-card-foreground transition-colors">
                      🚀 Neuen Bot hinzufügen
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-secondary/20 text-sm text-muted-foreground hover:text-card-foreground transition-colors">
                      📊 Detaillierte Analysen
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-secondary/20 text-sm text-muted-foreground hover:text-card-foreground transition-colors">
                      ⚙️ System-Einstellungen
                    </button>
                    <button 
                      onClick={() => setWithdrawalOpen(true)}
                      className="w-full text-left p-2 rounded hover:bg-secondary/20 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                    >
                      💳 Auszahlung anfordern
                    </button>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Aktive Geld-Maschinen
              </h2>
              <p className="text-muted-foreground mb-6">
                Überwachen und verwalten Sie Ihre automatisierten Einkommensquellen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((bot, index) => (
                <BotCard 
                  key={index} 
                  {...bot}
                  onSettingsClick={() => {
                    setSelectedBot(bot.name);
                    setSettingsOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="withdrawals" className="mt-6">
            <WithdrawalHistory />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <UserProfile />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsPanel />
          </TabsContent>
        </Tabs>

        <WithdrawalDialog 
          open={withdrawalOpen}
          onOpenChange={setWithdrawalOpen}
          availableBalance="€234,567.89"
        />

        <BotSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          botName={selectedBot}
        />
      </div>
    </div>
  );
};

export default Index;