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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch live crypto prices from CoinGecko API
    const symbols = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'];
    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`;
    
    console.log('Fetching market data from CoinGecko...');
    const response = await fetch(coingeckoUrl);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Market data received:', data);

    // Insert market data into database
    const marketDataInserts = [];
    for (const [id, priceData] of Object.entries(data)) {
      const symbol = id.toUpperCase();
      marketDataInserts.push({
        symbol,
        price: priceData.usd,
        volume_24h: priceData.usd_24h_vol || 0,
        price_change_24h: priceData.usd_24h_change || 0,
        market_cap: priceData.usd_market_cap || 0,
        last_updated: new Date().toISOString(),
      });
    }

    const { data: insertedData, error: insertError } = await supabaseClient
      .from('market_data')
      .insert(marketDataInserts)
      .select();

    if (insertError) {
      console.error('Error inserting market data:', insertError);
      throw insertError;
    }

    console.log('Market data inserted successfully:', insertedData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: insertedData,
        message: `Updated ${marketDataInserts.length} crypto prices` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in market-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});