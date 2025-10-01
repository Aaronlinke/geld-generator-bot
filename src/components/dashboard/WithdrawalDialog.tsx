import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: string;
  onWithdrawalSubmit?: (withdrawal: { amount: string; method: string; account: string }) => void;
}

export const WithdrawalDialog = ({ open, onOpenChange, availableBalance, onWithdrawalSubmit }: WithdrawalDialogProps) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentMethod || !accountDetails) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount.replace(/[^0-9.,]/g, '').replace(',', '.'));
    const availableAmount = parseFloat(availableBalance.replace(/[^0-9.,]/g, '').replace(',', '.'));

    if (numAmount > availableAmount) {
      toast({
        title: "Fehler",
        description: "Auszahlungsbetrag übersteigt verfügbares Guthaben",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const methodMap: Record<string, string> = {
        bank: "Bank Transfer",
        paypal: "PayPal",
        crypto: "Crypto"
      };

      onWithdrawalSubmit?.({
        amount: `€${numAmount.toFixed(2)}`,
        method: methodMap[paymentMethod],
        account: accountDetails
      });

      toast({
        title: "Auszahlung beantragt",
        description: `€${numAmount.toFixed(2)} wird in 1-3 Werktagen auf Ihr ${methodMap[paymentMethod]}-Konto überwiesen.`,
      });
      
      setAmount("");
      setPaymentMethod("");
      setAccountDetails("");
      setIsProcessing(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-dark border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-card-foreground">Auszahlung anfordern</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Verfügbares Guthaben: <span className="text-profit font-bold">{availableBalance}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleWithdrawal} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-card-foreground">Auszahlungsbetrag (€)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="z.B. 1000.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method" className="text-card-foreground">Zahlungsmethode</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-background border-border text-card-foreground">
                <SelectValue placeholder="Methode auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Banküberweisung</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="crypto">Krypto-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account" className="text-card-foreground">
              {paymentMethod === "bank" && "IBAN"}
              {paymentMethod === "paypal" && "PayPal E-Mail"}
              {paymentMethod === "crypto" && "Wallet-Adresse"}
              {!paymentMethod && "Kontodaten"}
            </Label>
            <Input
              id="account"
              type="text"
              placeholder={
                paymentMethod === "bank" ? "DE89 3704 0044 0532 0130 00" :
                paymentMethod === "paypal" ? "ihre@email.com" :
                paymentMethod === "crypto" ? "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" :
                "Bitte wählen Sie zuerst eine Zahlungsmethode"
              }
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="bg-background border-border text-card-foreground"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-profit hover:bg-profit/90"
            >
              {isProcessing ? "Wird verarbeitet..." : "Auszahlung beantragen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
