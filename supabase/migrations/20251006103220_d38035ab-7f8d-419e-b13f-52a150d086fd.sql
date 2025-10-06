-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_strategies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trading_accounts;

-- Add missing RLS policy for profiles INSERT (needed for auto-creation)
CREATE POLICY "System can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);