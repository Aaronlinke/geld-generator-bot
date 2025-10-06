export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_integrations: {
        Row: {
          api_key_encrypted: string
          api_secret_encrypted: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          metadata: Json | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bot_strategies: {
        Row: {
          ai_enabled: boolean | null
          auto_restart: boolean | null
          created_at: string
          daily_profit: number | null
          description: string | null
          id: string
          max_daily_trades: number | null
          name: string
          notifications_enabled: boolean | null
          risk_level: number | null
          status: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage: number | null
          strategy_type: string
          take_profit_percentage: number | null
          total_earnings: number | null
          total_trades: number | null
          trading_account_id: string | null
          updated_at: string
          user_id: string
          win_rate: number | null
        }
        Insert: {
          ai_enabled?: boolean | null
          auto_restart?: boolean | null
          created_at?: string
          daily_profit?: number | null
          description?: string | null
          id?: string
          max_daily_trades?: number | null
          name: string
          notifications_enabled?: boolean | null
          risk_level?: number | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage?: number | null
          strategy_type: string
          take_profit_percentage?: number | null
          total_earnings?: number | null
          total_trades?: number | null
          trading_account_id?: string | null
          updated_at?: string
          user_id: string
          win_rate?: number | null
        }
        Update: {
          ai_enabled?: boolean | null
          auto_restart?: boolean | null
          created_at?: string
          daily_profit?: number | null
          description?: string | null
          id?: string
          max_daily_trades?: number | null
          name?: string
          notifications_enabled?: boolean | null
          risk_level?: number | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage?: number | null
          strategy_type?: string
          take_profit_percentage?: number | null
          total_earnings?: number | null
          total_trades?: number | null
          trading_account_id?: string | null
          updated_at?: string
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_strategies_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          blockchain_hash: string | null
          bot_strategy_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          trading_account_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          blockchain_hash?: string | null
          bot_strategy_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          trading_account_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          blockchain_hash?: string | null
          bot_strategy_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          trading_account_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_bot_strategy_id_fkey"
            columns: ["bot_strategy_id"]
            isOneToOne: false
            referencedRelation: "bot_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          kyc_verified_at: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_verified_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_verified_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_management_rules: {
        Row: {
          bot_strategy_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          rule_config: Json
          rule_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bot_strategy_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rule_config: Json
          rule_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bot_strategy_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rule_config?: Json
          rule_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_management_rules_bot_strategy_id_fkey"
            columns: ["bot_strategy_id"]
            isOneToOne: false
            referencedRelation: "bot_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_accounts: {
        Row: {
          account_name: string
          api_key_encrypted: string | null
          balance_btc: number | null
          balance_eth: number | null
          balance_eur: number | null
          balance_usd: number | null
          created_at: string
          exchange: string
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          api_key_encrypted?: string | null
          balance_btc?: number | null
          balance_eth?: number | null
          balance_eur?: number | null
          balance_usd?: number | null
          created_at?: string
          exchange: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          api_key_encrypted?: string | null
          balance_btc?: number | null
          balance_eth?: number | null
          balance_eur?: number | null
          balance_usd?: number | null
          created_at?: string
          exchange?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "premium" | "admin" | "enterprise"
      bot_status: "active" | "paused" | "maintenance" | "stopped"
      kyc_status: "pending" | "verified" | "rejected"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "premium", "admin", "enterprise"],
      bot_status: ["active", "paused", "maintenance", "stopped"],
      kyc_status: ["pending", "verified", "rejected"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
    },
  },
} as const
