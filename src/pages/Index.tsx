import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
import { AddBotDialog } from "@/components/dashboard/AddBotDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Withdrawal, Activity } from "@/types/bot";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addBotOpen, setAddBotOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [bots, setBots] = useState<Bot[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load all data from database
  useEffect(() => {
    if (user) {
      loadAllData();
      const cleanup = setupRealtimeSubscriptions();
      return cleanup;
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadBotStrategies(),
        loadWithdrawals(),
        loadActivities(),
        calculateTotalBalance()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const botsChannel = supabase
      .channel('bot_strategies_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_strategies' }, () => {
        loadBotStrategies();
      })
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_transactions' }, () => {
        loadWithdrawals();
        calculateTotalBalance();
      })
      .subscribe();

    const logsChannel = supabase
      .channel('audit_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => {
        loadActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(botsChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(logsChannel);
    };
  };

  const loadBotStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBots: Bot[] = (data || []).map(strategy => ({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description || '',
        earnings: `€${strategy.total_earnings?.toFixed(2) || '0.00'}`,
        dailyProfit: `€${strategy.daily_profit?.toFixed(2) || '0.00'}`,
        status: strategy.status as any,
        progress: Math.round((strategy.total_trades || 0) / (strategy.max_daily_trades || 10) * 100),
        icon: getIconForStrategyType(strategy.strategy_type)
      }));
      setBots(formattedBots);
    } catch (error) {
      console.error('Error loading bot strategies:', error);
    }
  };

  const loadWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('transaction_type', 'withdrawal')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedWithdrawals: Withdrawal[] = (data || []).map(tx => ({
        id: tx.id,
        amount: `€${tx.amount.toFixed(2)}`,
        date: new Date(tx.created_at).toLocaleDateString('de-DE'),
        method: tx.payment_method || 'Bank Transfer',
        status: tx.status as any,
        account: tx.blockchain_hash || tx.description || 'N/A'
      }));
      setWithdrawals(formattedWithdrawals);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedActivities: Activity[] = (data || []).map(log => {
        const metadata = log.metadata as any;
        return {
          id: log.id,
          type: getActivityType(log.action),
          title: formatActivityTitle(log.action),
          description: metadata?.bot_name || metadata?.description || log.action,
          timestamp: formatTimestamp(log.created_at),
          icon: getActivityIcon(log.action)
        };
      });
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const calculateTotalBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_strategies')
        .select('total_earnings');

      if (error) throw error;

      const total = (data || []).reduce((sum, bot) => sum + (bot.total_earnings || 0), 0);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error calculating balance:', error);
    }
  };

  const getIconForStrategyType = (type: string): string => {
    const icons: Record<string, string> = {
      'crypto_arbitrage': '₿',
      'forex': '💱',
      'affiliate': '🔗',
      'dropshipping': '📦',
      'social_media': '📱',
      'mining': '⛏️'
    };
    return icons[type] || '🤖';
  };

  const getActivityType = (action: string): Activity["type"] => {
    if (action.includes('bot_created') || action.includes('bot_started')) return 'bot_started';
    if (action.includes('bot_paused')) return 'bot_paused';
    if (action.includes('withdrawal')) return 'withdrawal';
    if (action.includes('earning')) return 'earning';
    return 'alert';
  };

  const formatActivityTitle = (action: string): string => {
    const titles: Record<string, string> = {
      'bot_created': 'Bot erstellt',
      'bot_started': 'Bot gestartet',
      'bot_paused': 'Bot pausiert',
      'bot_updated': 'Bot aktualisiert',
      'withdrawal_created': 'Auszahlung beantragt',
      'withdrawal_completed': 'Auszahlung abgeschlossen'
    };
    return titles[action] || action;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `Vor ${diffMins} Minuten`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Vor ${diffHours} Stunden`;
    const diffDays = Math.floor(diffHours / 24);
    return `Vor ${diffDays} Tagen`;
  };

  const getActivityIcon = (action: string): string => {
    if (action.includes('bot_started') || action.includes('bot_created')) return '🚀';
    if (action.includes('bot_paused')) return '⏸️';
    if (action.includes('withdrawal')) return '💳';
    if (action.includes('earning')) return '💰';
    return '🔔';
  };

  const handleBotStatusToggle = async (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    const newStatus = bot.status === "active" ? "paused" : "active";
    
    try {
      const { error } = await supabase
        .from('bot_strategies')
        .update({ status: newStatus })
        .eq('id', botId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: newStatus === 'active' ? 'bot_started' : 'bot_paused',
        resource_type: 'bot_strategy',
        resource_id: botId,
        metadata: { bot_name: bot.name }
      });

      toast.success(`Bot ${newStatus === 'active' ? 'gestartet' : 'pausiert'}`);
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Aktualisieren des Bots');
    }
  };

  const handleWithdrawalSubmit = async (withdrawal: Omit<Withdrawal, "id" | "date" | "status">) => {
    try {
      const amount = parseFloat(withdrawal.amount.replace('€', '').replace(',', '.'));

      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'withdrawal',
          amount,
          currency: 'EUR',
          status: 'pending',
          payment_method: withdrawal.method,
          description: withdrawal.account
        });

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'withdrawal_created',
        resource_type: 'financial_transaction',
        metadata: { amount: withdrawal.amount, method: withdrawal.method }
      });

      toast.success('Auszahlung erfolgreich beantragt!');
      setWithdrawalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Auszahlung');
    }
  };

  const handleBotDetails = (bot: Bot) => {
    setSelectedBot(bot);
    setDetailsOpen(true);
  };

  const handleBotSettings = (bot: Bot) => {
    setSelectedBot(bot);
    setSettingsOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onLogout={signOut} />
        
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
            
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Aktive Geld-Maschinen
                </h2>
                <p className="text-muted-foreground">
                  {bots.length === 0 ? 'Erstelle deinen ersten Bot' : `${bots.length} Bot${bots.length !== 1 ? 's' : ''} aktiv`}
                </p>
              </div>
              <Button onClick={() => setAddBotOpen(true)} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Bot hinzufügen
              </Button>
            </div>

            {bots.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground mb-4">Noch keine Bots erstellt</p>
                <Button onClick={() => setAddBotOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Bot erstellen
                </Button>
              </div>
            ) : (
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
            )}
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
          availableBalance={`€${totalBalance.toFixed(2)}`}
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

        <AddBotDialog
          open={addBotOpen}
          onOpenChange={setAddBotOpen}
          userId={user.id}
        />
      </div>
    </div>
  );
};

export default Index;
