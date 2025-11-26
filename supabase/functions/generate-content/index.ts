import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { botStrategyId, contentType, prompt } = await req.json();
    console.log('Generating content:', { botStrategyId, contentType, prompt });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get bot strategy details
    const { data: botStrategy, error: botError } = await supabase
      .from('bot_strategies')
      .select('*')
      .eq('id', botStrategyId)
      .single();

    if (botError) throw botError;

    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) throw new Error('User not authenticated');

    // Generate content with Lovable AI
    const systemPrompt = `Du bist ein professioneller Content Creator. Erstelle hochwertigen ${contentType}-Content auf Deutsch. 
Der Content soll:
- Professionell und verkaufsfertig sein
- SEO-optimiert sein
- Mindestens 500 Wörter haben
- Strukturiert und gut formatiert sein`;

    const userPrompt = prompt || `Erstelle einen ${contentType} über ein interessantes Thema, das gut verkauft werden kann.`;

    console.log('Calling Lovable AI...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 402) {
        throw new Error('INSUFFICIENT_CREDITS: Lovable AI credits aufgebraucht. Bitte Credits aufladen.');
      }
      if (aiResponse.status === 429) {
        throw new Error('RATE_LIMITED: Zu viele Anfragen. Bitte warten.');
      }
      
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0].message.content;

    // Extract title from content (first line or first 100 chars)
    const lines = generatedContent.split('\n').filter((l: string) => l.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').substring(0, 100) || `${contentType} Content`;

    // Save to database
    const { data: savedContent, error: saveError } = await supabase
      .from('generated_content')
      .insert({
        user_id: user.id,
        bot_strategy_id: botStrategyId,
        content_type: contentType,
        title: title,
        content: generatedContent,
        metadata: { prompt, model: 'gemini-2.5-flash' },
        status: 'generated'
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update bot strategy stats
    await supabase
      .from('bot_strategies')
      .update({
        total_trades: (botStrategy.total_trades || 0) + 1,
        last_executed_at: new Date().toISOString()
      })
      .eq('id', botStrategyId);

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Content generiert',
        message: `${contentType} wurde erfolgreich erstellt: ${title}`,
        type: 'success'
      });

    console.log('Content generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        content: savedContent,
        message: 'Content erfolgreich generiert'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-content:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Content generation failed' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});