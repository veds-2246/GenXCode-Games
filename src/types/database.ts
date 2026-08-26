export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          whatsapp_number: string;
          role: "player" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          whatsapp_number: string;
          role?: "player" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          whatsapp_number?: string;
          role?: "player" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      access_requests: {
        Row: {
          id: string;
          player_id: string;
          status: "pending" | "approved" | "rejected" | "expired";
          requested_at: string;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: {
          id?: string;
          player_id: string;
          status?: "pending" | "approved" | "rejected" | "expired";
          requested_at?: string;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Update: {
          id?: string;
          player_id?: string;
          status?: "pending" | "approved" | "rejected" | "expired";
          requested_at?: string;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "access_requests_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_requests_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      arcade_sessions: {
        Row: {
          id: string;
          player_id: string;
          started_at: string;
          expires_at: string;
          ended_at: string | null;
          status: "active" | "expired" | "ended";
          granted_by: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          started_at: string;
          expires_at: string;
          ended_at?: string | null;
          status?: "active" | "expired" | "ended";
          granted_by: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          started_at?: string;
          expires_at?: string;
          ended_at?: string | null;
          status?: "active" | "expired" | "ended";
          granted_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "arcade_sessions_granted_by_fkey";
            columns: ["granted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "arcade_sessions_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      game_scores: {
        Row: {
          id: string;
          session_id: string;
          player_id: string;
          game_id: string;
          score: number;
          duration_ms: number | null;
          played_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          player_id: string;
          game_id: string;
          score: number;
          duration_ms?: number | null;
          played_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          player_id?: string;
          game_id?: string;
          score?: number;
          duration_ms?: number | null;
          played_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_scores_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_scores_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_scores_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "arcade_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_active_arcade_session: {
        Args: { target_player_id: string };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      user_role: "player" | "admin";
      access_request_status: "pending" | "approved" | "rejected" | "expired";
      session_status: "active" | "expired" | "ended";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  TableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TableName]["Row"];

export type InsertTables<
  TableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TableName]["Insert"];

export type UpdateTables<
  TableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TableName]["Update"];

export type Enums<
  EnumName extends keyof Database["public"]["Enums"]
> = Database["public"]["Enums"][EnumName];