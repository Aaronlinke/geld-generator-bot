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
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { BotDetailsDialog } from "@/components/dashboard/BotDetailsDialog";
import { SystemSettings } from "@/components/dashboard/SystemSettings";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Withdrawal, Activity } from "@/types/bot";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  
  const [bots, setBots] = useState<Bot[]>([
    {
      id: "1",
      name: "Crypto Arbitrage Bot",
      description: "Automatischer Krypto-Handel zwischen Börsen",
      earnings: "€45,678.23",
      dailyProfit: "€1,234.56",
      status: "active",
      progress: 87,
      icon: "₿"
    },
    {
      id: "2",
      name: "Forex Trading Bot",
      description: "KI-gestützter Devisenhandel",
      earnings: "€32,145.67",
      dailyProfit: "€892.34",
      status: "active",
      progress: 92,
      icon: "💱"
    },
    {
      id: "3",
      name: "Affiliate Marketing Bot",
      description: "Automatische Affiliate-Kampagnen",
      earnings: "€18,934.21",
      dailyProfit: "€456.78",
      status: "active",
      progress: 76,
      icon: "🔗"
    },
    {
      id: "4",
      name: "Dropshipping Bot",
      description: "Produktlistung und Bestellabwicklung",
      earnings: "€28,567.89",
      dailyProfit: "€723.45",
      status: "paused",
      progress: 45,
      icon: "📦"
    },
    {
      id: "5",
      name: "Social Media Bot",
      description: "Automatisierte Content-Monetarisierung",
      earnings: "€12,345.67",
      dailyProfit: "€234.56",
      status: "active",
      progress: 68,
      icon: "📱"
    },
    {
      id: "6",
      name: "Mining Pool Bot",
      description: "Optimierte Krypto-Mining Verwaltung",
      earnings: "€56,789.12",
      dailyProfit: "€1,456.78",
      status: "maintenance",
      progress: 0,
      icon: "⛏️"
    }
  ]);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: "WD-001",
      amount: "€5,000.00",
      date: "2025-09-28",
      method: "Bank Transfer",
      status: "completed",
      account: "DE89 **** 1234"
    },
    {
      id: "WD-002",
      amount: "€2,500.00",
      date: "2025-09-25",
      method: "PayPal",
      status: "completed",
      account: "user@email.com"
    },
    {
      id: "WD-003",
      amount: "€10,000.00",
      date: "2025-09-30",
      method: "Bank Transfer",
      status: "pending",
      account: "DE89 **** 1234"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "earning",
      title: "Neuer Gewinn",
      description: "Crypto Arbitrage Bot: +€1,234.56",
      timestamp: "Vor 5 Minuten",
      icon: "💰"
    },
    {
      id: "2",
      type: "bot_started",
      title: "Bot gestartet",
      description: "Forex Trading Bot wurde aktiviert",
      timestamp: "Vor 1 Stunde",
      icon: "🚀"
    },
    {
      id: "3",
      type: "withdrawal",
      title: "Auszahlung beantragt",
      description: "€10,000.00 wird verarbeitet",
      timestamp: "Vor 2 Stunden",
      icon: "💳"
    },
    {
      id: "4",
      type: "earning",
      title: "Tagesgewinn erreicht",
      description: "€47,523.84 heute verdient",
      timestamp: "Vor 3 Stunden",
      icon: "📈"
    }
  ]);

  const handleBotStatusToggle = (botId: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === "active" ? "paused" : "active";
        const statusText = newStatus === "active" ? "gestartet" : "pausiert";
        
        toast({
          title: `Bot ${statusText}`,
          description: `${bot.name} wurde ${statusText}.`,
        });

        const newActivity: Activity = {
          id: Date.now().toString(),
          type: newStatus === "active" ? "bot_started" : "bot_paused",
          title: `Bot ${statusText}`,
          description: `${bot.name} wurde ${statusText}`,
          timestamp: "Gerade eben",
          icon: newStatus === "active" ? "🚀" : "⏸️"
        };
        
        setActivities(prev => [newActivity, ...prev]);

        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  const handleWithdrawalSubmit = (withdrawal: Omit<Withdrawal, "id" | "date" | "status">) => {
    const newWithdrawal: Withdrawal = {
      id: `WD-${String(withdrawals.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      ...withdrawal
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: "withdrawal",
      title: "Auszahlung beantragt",
      description: `${withdrawal.amount} wird verarbeitet`,
      timestamp: "Gerade eben",
      icon: "💳"
    };
    
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleBotDetails = (bot: Bot) => {
    setSelectedBot(bot);
    setDetailsOpen(true);
  };

  const handleBotSettings = (bot: Bot) => {
    setSelectedBot(bot);
    setSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="withdrawals">Auszahlungen</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <StatsOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EarningsChart />
              </div>
              <div>
                <ActivityFeed activities={activities} />
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
              {bots.map((bot) => (
                <BotCard 
                  key={bot.id} 
                  {...bot}
                  onStatusToggle={() => handleBotStatusToggle(bot.id)}
                  onSettingsClick={() => handleBotSettings(bot)}
                  onDetailsClick={() => handleBotDetails(bot)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="withdrawals" className="mt-6">
            <WithdrawalHistory withdrawals={withdrawals} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <UserProfile />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsPanel />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>

        <WithdrawalDialog 
          open={withdrawalOpen}
          onOpenChange={setWithdrawalOpen}
          availableBalance="€234,567.89"
          onWithdrawalSubmit={handleWithdrawalSubmit}
        />

        <BotSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          botName={selectedBot?.name || ""}
        />

        <BotDetailsDialog
          bot={selectedBot}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </div>
    </div>
  );
};

export default Index;