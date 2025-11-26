import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FileText, Sparkles, Loader2, Download } from "lucide-react";

const CONTENT_TYPES = [
  { value: "blog_article", label: "Blog Artikel" },
  { value: "social_media", label: "Social Media Post" },
  { value: "product_description", label: "Produktbeschreibung" },
  { value: "ebook_chapter", label: "E-Book Kapitel" },
  { value: "newsletter", label: "Newsletter" },
];

export const ContentBotPanel = () => {
  const { user } = useAuth();
  const [contentType, setContentType] = useState("blog_article");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [botStrategyId, setBotStrategyId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadContentBot();
      loadGeneratedContent();
    }
  }, [user]);

  const loadContentBot = async () => {
    const { data } = await supabase
      .from('bot_strategies')
      .select('*')
      .eq('user_id', user?.id)
      .eq('strategy_type', 'content_creation')
      .maybeSingle();

    if (data) {
      setBotStrategyId(data.id);
    } else {
      // Create content bot if not exists
      const insertData: any = {
        name: 'AI Content Bot',
        strategy_type: 'content_creation',
        status: 'active',
        risk_level: 1,
        content_type: 'blog_article',
        content_settings: {}
      };
      
      const { data: newBot } = await supabase
        .from('bot_strategies')
        .insert([insertData])
        .select()
        .single();

      if (newBot) setBotStrategyId(newBot.id);
    }
  };

  const loadGeneratedContent = async () => {
    const { data } = await supabase
      .from('generated_content')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setGeneratedContent(data);
  };

  const generateContent = async () => {
    if (!botStrategyId) {
      toast.error('Content Bot nicht gefunden');
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          botStrategyId,
          contentType,
          prompt: prompt || undefined
        }
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes('INSUFFICIENT_CREDITS')) {
          toast.error('⚠️ Keine AI Credits mehr!', {
            description: 'Lovable AI Credits aufgebraucht! Gehe zu Settings → Workspace → Usage.'
          });
        } else if (data.error.includes('RATE_LIMITED')) {
          toast.error('⏱️ Rate Limit erreicht', {
            description: 'Zu viele Anfragen. Bitte warten.'
          });
        } else {
          toast.error('Fehler: ' + data.error);
        }
        return;
      }

      toast.success('🎉 Content generiert!', {
        description: data.content.title
      });

      setPrompt("");
      await loadGeneratedContent();
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast.error('Fehler bei der Content-Generierung');
    } finally {
      setGenerating(false);
    }
  };

  const downloadContent = (content: any) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Erstelle verkaufsfertigen Content mit KI - sofort, ohne externe APIs!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Content-Typ</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Prompt (optional - KI wählt Thema wenn leer)
            </label>
            <Textarea
              placeholder="Z.B: 'Schreibe über gesunde Ernährung für Berufstätige'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generiere Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Content generieren
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generierter Content ({generatedContent.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedContent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Noch kein Content generiert. Starte oben!
              </p>
            ) : (
              generatedContent.map((content) => (
                <div
                  key={content.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{content.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {content.content_type} • {new Date(content.created_at).toLocaleDateString('de-DE')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {content.content.substring(0, 150)}...
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadContent(content)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};