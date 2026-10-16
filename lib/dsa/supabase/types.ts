// Hand-written to match utils/db/migrations/0019_dsa_learning.sql.

/** A learner's course settings. Their name and email live on the Ractrotech account. */
export type Profile = {
  id: string;
  goal_per_day: number;
  /** Which language the course is shown in. One of lib/dsa/lang.ts LANGS. */
  lang: string | null;
  education: string | null;
  motivation: string | null;
  skill_level: string | null;
  /** Set when the five welcome questions are answered. Null means not yet. */
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgressRow = {
  id: string;
  user_id: string;
  topic_id: string;
  section_id: string;
  solved_at: string;
  attempts: number;
};

export type ActivityRow = {
  id: string;
  user_id: string;
  day: string; // YYYY-MM-DD
  solved: number;
  visits: number;
};

export type SubmissionRow = {
  id: string;
  user_id: string;
  topic_id: string;
  section_id: string;
  code: string;
  passed: boolean;
  created_at: string;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      dsa_profiles: Table<Profile>;
      dsa_progress: Table<ProgressRow>;
      dsa_activity: Table<ActivityRow>;
      dsa_submissions: Table<SubmissionRow>;
      dsa_notes: Table<{
        id: string;
        user_id: string;
        topic_id: string;
        body: string;
        updated_at: string;
      }>;
    };
    Views: Record<never, never>;
    Functions: {
      dsa_record_solve: {
        Args: {
          p_topic_id: string;
          p_section_id: string;
          p_code: string;
          p_passed: boolean;
          p_day: string;
        };
        Returns: void;
      };
      dsa_record_visit: {
        Args: { p_day: string };
        Returns: void;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
