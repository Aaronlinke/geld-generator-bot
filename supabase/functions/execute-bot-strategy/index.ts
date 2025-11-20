import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { botStrategyId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get bot strategy details
    const { data: botStrategy, error: botError } = await supabaseClient
      .from('bot_strategies')
      .select('*')
      .eq('id', botStrategyId)
      .single();

    if (botError || !botStrategy) {
      throw new Error('Bot strategy not found');
    }

    if (botStrategy.status !== 'active') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Bot is not active' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Executing bot strategy:', botStrategy.name);

    // Get AI trading analysis
    const symbol = botStrategy.strategy_type === 'scalping' ? 'BITCOIN' :
                   botStrategy.strategy_type === 'swing' ? 'ETHEREUM' :
                   botStrategy.strategy_type === 'arbitrage' ? 'BINANCECOIN' : 'BITCOIN';

    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-trading-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({
        symbol,
        strategyType: botStrategy.strategy_type,
        riskLevel: botStrategy.risk_level,
      }),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json().catch(() => ({ error: 'Unknown error' }));
      const errorMsg = errorData.error || 'Failed to get AI analysis';
      console.error('AI analysis error:', errorMsg);
      throw new Error(errorMsg);
    }

    const { analysis, market_data } = await analysisResponse.json();
    console.log('AI analysis:', analysis);

    // Execute paper trade based on AI recommendation
    if (analysis.action === 'buy' || analysis.action === 'sell') {
      const quantity = (botStrategy.daily_profit || 100) / market_data.price;
      const totalValue = quantity * market_data.price;

      // Create trade
      const { data: trade, error: tradeError } = await supabaseClient
        .from('trades')
        .insert({
          user_id: botStrategy.user_id,
          bot_strategy_id: botStrategy.id,
          symbol,
          side: analysis.action,
          quantity,
          price: market_data.price,
          total_value: totalValue,
          status: 'completed',
        })
        .select()
        .single();

      if (tradeError) {
        console.error('Trade error:', tradeError);
        throw tradeError;
      }

      // Calculate profit/loss (for demo, assume 2-5% profit on buy)
      const profitMultiplier = analysis.action === 'buy' ? 
        (1 + (Math.random() * 0.03 + 0.02)) : // 2-5% profit
        (1 - (Math.random() * 0.02 + 0.01));  // 1-3% loss on sell

      const profit = totalValue * (profitMultiplier - 1);

      // Create financial transaction
      const { error: txError } = await supabaseClient
        .from('financial_transactions')
        .insert({
          user_id: botStrategy.user_id,
          bot_strategy_id: botStrategy.id,
          amount: profit,
          transaction_type: 'bot_earning',
          currency: 'USD',
          status: 'completed',
          completed_at: new Date().toISOString(),
          description: `${analysis.action.toUpperCase()} ${symbol} - AI confidence: ${analysis.confidence}%`,
          metadata: {
            trade_id: trade.id,
            analysis,
          },
        });

      if (txError) {
        console.error('Transaction error:', txError);
      }

      // Update bot strategy stats
      const newTotalEarnings = (botStrategy.total_earnings || 0) + profit;
      const newTotalTrades = (botStrategy.total_trades || 0) + 1;
      const newWinRate = profit > 0 ? 
        ((botStrategy.win_rate || 0) * (newTotalTrades - 1) + 100) / newTotalTrades :
        ((botStrategy.win_rate || 0) * (newTotalTrades - 1)) / newTotalTrades;

      await supabaseClient
        .from('bot_strategies')
        .update({
          total_earnings: newTotalEarnings,
          daily_profit: profit,
          total_trades: newTotalTrades,
          win_rate: newWinRate,
        })
        .eq('id', botStrategy.id);

      // Log action
      await supabaseClient
        .from('audit_logs')
        .insert({
          user_id: botStrategy.user_id,
          action: 'bot_trade_executed',
          resource_type: 'bot_strategy',
          resource_id: botStrategy.id,
          metadata: {
            trade_id: trade.id,
            action: analysis.action,
            symbol,
            profit,
            confidence: analysis.confidence,
          },
        });

      // Create notification
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: botStrategy.user_id,
          type: profit > 0 ? 'success' : 'warning',
          title: `Trade Executed: ${analysis.action.toUpperCase()} ${symbol}`,
          message: `AI executed ${analysis.action} order for ${symbol}. ${profit > 0 ? 'Profit' : 'Loss'}: $${Math.abs(profit).toFixed(2)}`,
        });

      return new Response(
        JSON.stringify({ 
          success: true,
          trade,
          analysis,
          profit,
          message: `Executed ${analysis.action} order for ${symbol}`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `AI recommendation: ${analysis.action} (holding)`,
        analysis,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error executing bot strategy:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});