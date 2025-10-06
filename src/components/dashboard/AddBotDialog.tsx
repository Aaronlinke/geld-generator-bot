import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AddBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const AddBotDialog = ({ open, onOpenChange, userId }: AddBotDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    strategy_type: "crypto_arbitrage",
    risk_level: 5,
    max_daily_trades: 10,
    stop_loss_percentage: 5.0,
    take_profit_percentage: 10.0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('bot_strategies')
        .insert({
          user_id: userId,
          ...formData,
          status: 'paused'
        })
        .select()
        .single();

      if (error) throw error;

      // Create audit log
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'bot_created',
        resource_type: 'bot_strategy',
        resource_id: data.id,
        metadata: { bot_name: formData.name }
      });

      toast.success("Bot erfolgreich erstellt!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        strategy_type: "crypto_arbitrage",
        risk_level: 5,
        max_daily_trades: 10,
        stop_loss_percentage: 5.0,
        take_profit_percentage: 10.0
      });
    } catch (error: any) {
      toast.error(error.message || "Fehler beim Erstellen des Bots");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neuen Bot erstellen</DialogTitle>
          <DialogDescription>
            Erstelle einen neuen Trading Bot mit deinen Einstellungen
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Bitcoin Arbitrage Bot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beschreibe die Strategie deines Bots..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy_type">Strategie Typ *</Label>
            <Select
              value={formData.strategy_type}
              onValueChange={(value) => setFormData({ ...formData, strategy_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crypto_arbitrage">Crypto Arbitrage</SelectItem>
                <SelectItem value="forex">Forex Trading</SelectItem>
                <SelectItem value="affiliate">Affiliate Marketing</SelectItem>
                <SelectItem value="dropshipping">Dropshipping</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="mining">Mining Pool</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Risk Level: {formData.risk_level}</Label>
            <Slider
              value={[formData.risk_level]}
              onValueChange={(value) => setFormData({ ...formData, risk_level: value[0] })}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_daily_trades">Max. Tägliche Trades</Label>
              <Input
                id="max_daily_trades"
                type="number"
                value={formData.max_daily_trades}
                onChange={(e) => setFormData({ ...formData, max_daily_trades: parseInt(e.target.value) })}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop_loss">Stop Loss %</Label>
              <Input
                id="stop_loss"
                type="number"
                step="0.1"
                value={formData.stop_loss_percentage}
                onChange={(e) => setFormData({ ...formData, stop_loss_percentage: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="take_profit">Take Profit %</Label>
              <Input
                id="take_profit"
                type="number"
                step="0.1"
                value={formData.take_profit_percentage}
                onChange={(e) => setFormData({ ...formData, take_profit_percentage: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                "Bot erstellen"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
