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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_chat_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          id: string
          lecture_id: string | null
          notes: string | null
          reject_reason: string | null
          scheduled_date: string
          scheduled_time: string
          status: Database["public"]["Enums"]["booking_status"]
          student_id: string
          subject: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lecture_id?: string | null
          notes?: string | null
          reject_reason?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_id: string
          subject?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lecture_id?: string | null
          notes?: string | null
          reject_reason?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_id?: string
          subject?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          lecture_id: string
          sender_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          lecture_id: string
          sender_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          lecture_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          amount_paid: number | null
          course_id: string
          created_at: string
          enrolled_at: string
          id: string
          payment_id: string | null
          payment_provider: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
        }
        Insert: {
          amount_paid?: number | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
        }
        Update: {
          amount_paid?: number | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean
          order_index: number
          title: string
          title_en: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          order_index?: number
          title: string
          title_en?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          order_index?: number
          title?: string
          title_en?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_live_sessions: {
        Row: {
          course_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          is_completed: boolean
          scheduled_date: string
          scheduled_time: string
          title: string
          title_en: string | null
          zoom_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean
          scheduled_date: string
          scheduled_time: string
          title: string
          title_en?: string | null
          zoom_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean
          scheduled_date?: string
          scheduled_time?: string
          title?: string
          title_en?: string | null
          zoom_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          category_en: string | null
          course_type: Database["public"]["Enums"]["course_type"]
          cover_image_url: string | null
          created_at: string
          description: string
          description_en: string | null
          enrollment_count: number
          id: string
          instructor_id: string | null
          instructor_name: string | null
          instructor_name_en: string | null
          is_published: boolean
          language: string | null
          level: string | null
          price: number
          short_description: string | null
          short_description_en: string | null
          title: string
          title_en: string | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          category_en?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_image_url?: string | null
          created_at?: string
          description: string
          description_en?: string | null
          enrollment_count?: number
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          instructor_name_en?: string | null
          is_published?: boolean
          language?: string | null
          level?: string | null
          price?: number
          short_description?: string | null
          short_description_en?: string | null
          title: string
          title_en?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          category_en?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_image_url?: string | null
          created_at?: string
          description?: string
          description_en?: string | null
          enrollment_count?: number
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          instructor_name_en?: string | null
          is_published?: boolean
          language?: string | null
          level?: string | null
          price?: number
          short_description?: string | null
          short_description_en?: string | null
          title?: string
          title_en?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      lectures: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          student_id: string
          subject: string | null
          teacher_id: string
          title: string
          updated_at: string
          video_url: string | null
          zoom_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          student_id: string
          subject?: string | null
          teacher_id: string
          title: string
          updated_at?: string
          video_url?: string | null
          zoom_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          student_id?: string
          subject?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          zoom_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          lecture_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          lecture_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          lecture_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          bio: string | null
          bio_en: string | null
          created_at: string
          full_name: string | null
          full_name_en: string | null
          id: string
          phone: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_en?: string | null
          created_at?: string
          full_name?: string | null
          full_name_en?: string | null
          id?: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_en?: string | null
          created_at?: string
          full_name?: string | null
          full_name_en?: string | null
          id?: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_requests: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          reject_reason: string | null
          status: string
          student_id: string
          subject: string | null
          teacher_id: string | null
          updated_at: string
          zoom_url: string | null
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reject_reason?: string | null
          status?: string
          student_id: string
          subject?: string | null
          teacher_id?: string | null
          updated_at?: string
          zoom_url?: string | null
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reject_reason?: string | null
          status?: string
          student_id?: string
          subject?: string | null
          teacher_id?: string | null
          updated_at?: string
          zoom_url?: string | null
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          teacher_id?: string
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          created_at: string
          id: string
          price: number | null
          subjects: string[] | null
          subjects_en: string[] | null
          university: string | null
          university_en: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          price?: number | null
          subjects?: string[] | null
          subjects_en?: string[] | null
          university?: string | null
          university_en?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number | null
          subjects?: string[] | null
          subjects_en?: string[] | null
          university?: string | null
          university_en?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      teacher_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          student_id?: string
          teacher_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      get_course_live_sessions_enrolled: {
        Args: { _course_id: string }
        Returns: {
          duration_minutes: number
          id: string
          is_completed: boolean
          scheduled_date: string
          scheduled_time: string
          title: string
          title_en: string
          zoom_url: string
        }[]
      }
      get_course_live_sessions_public: {
        Args: { _course_id: string }
        Returns: {
          duration_minutes: number
          id: string
          is_completed: boolean
          scheduled_date: string
          scheduled_time: string
          title: string
          title_en: string
        }[]
      }
      get_public_profile: {
        Args: { _user_id: string }
        Returns: {
          account_type: string
          avatar_url: string
          bio: string
          bio_en: string
          full_name: string
          full_name_en: string
          user_id: string
        }[]
      }
      get_public_profiles: {
        Args: { _user_ids: string[] }
        Returns: {
          account_type: string
          avatar_url: string
          bio: string
          bio_en: string
          full_name: string
          full_name_en: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_cover_path: { Args: { _name: string }; Returns: boolean }
      is_enrolled_in_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      user_can_access_chat_audio: { Args: { _name: string }; Returns: boolean }
      user_can_access_lecture_file: {
        Args: { _bucket: string; _name: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "cancelled"
        | "completed"
      course_type: "recorded" | "live" | "hybrid"
      enrollment_status: "pending" | "active" | "cancelled" | "refunded"
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
      app_role: ["admin", "moderator", "user"],
      booking_status: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
      ],
      course_type: ["recorded", "live", "hybrid"],
      enrollment_status: ["pending", "active", "cancelled", "refunded"],
    },
  },
} as const
