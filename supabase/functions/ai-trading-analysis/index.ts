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
    const { symbol, strategyType, riskLevel } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get recent market data
    const { data: marketData, error: marketError } = await supabaseClient
      .from('market_data')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(10);

    if (marketError) throw marketError;

    // Prepare AI prompt with market context
    const systemPrompt = `You are an expert cryptocurrency trading analyst. Analyze the market data and provide actionable trading insights.
    
Strategy Type: ${strategyType}
Risk Level: ${riskLevel}/10
Symbol: ${symbol}

Provide your analysis in the following JSON format:
{
  "action": "buy" | "sell" | "hold",
  "confidence": 0-100,
  "reasoning": "brief explanation",
  "entry_price": number,
  "stop_loss": number,
  "take_profit": number,
  "risk_reward_ratio": number
}`;

    const marketContext = `Recent market data for ${symbol}:
${JSON.stringify(marketData, null, 2)}

Based on this data, what is your trading recommendation?`;

    console.log('Calling Lovable AI for trading analysis...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: marketContext }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;
    
    console.log('AI analysis received:', analysis);

    // Try to parse JSON from the response
    let parsedAnalysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysis.match(/```json\n([\s\S]*?)\n```/) || analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        parsedAnalysis = JSON.parse(analysis);
      }
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      parsedAnalysis = {
        action: 'hold',
        confidence: 50,
        reasoning: analysis,
        risk_reward_ratio: 1.5
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: parsedAnalysis,
        raw_analysis: analysis,
        market_data: marketData?.[0]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-trading-analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});