-- Create market_data table for live crypto prices
CREATE TABLE IF NOT EXISTS public.market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price numeric NOT NULL,
  volume_24h numeric,
  price_change_24h numeric,
  market_cap numeric,
  last_updated timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_market_data_symbol ON public.market_data(symbol);
CREATE INDEX idx_market_data_created_at ON public.market_data(created_at DESC);

-- Enable RLS
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read market data
CREATE POLICY "Market data is viewable by everyone"
  ON public.market_data
  FOR SELECT
  USING (true);

-- Only system can insert market data
CREATE POLICY "System can insert market data"
  ON public.market_data
  FOR INSERT
  WITH CHECK (true);

-- Create trades table for paper trading
CREATE TABLE IF NOT EXISTS public.trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  bot_strategy_id uuid REFERENCES public.bot_strategies(id),
  symbol text NOT NULL,
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  total_value numeric NOT NULL,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  executed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_bot_strategy_id ON public.trades(bot_strategy_id);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);

-- Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Users can view their own trades
CREATE POLICY "Users can view their own trades"
  ON public.trades
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own trades
CREATE POLICY "Users can create their own trades"
  ON public.trades
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for trades
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;

-- Add trigger for updated_at on market_data
CREATE TRIGGER update_market_data_updated_at
  BEFORE UPDATE ON public.market_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();