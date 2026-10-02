export type UserRole = 'admin' | 'coordinator' | 'mentor' | 'junior';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type MatchStatus = 'suggested' | 'pending' | 'active' | 'reassigned' | 'inactive';
export type InteractionType = 'in_person' | 'online' | 'phone' | 'group';
export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type EscalationCategory = 'academic' | 'wellbeing' | 'harassment' | 'safety' | 'personal' | 'other';
export type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EscalationStatus = 'new' | 'under_review' | 'referred' | 'resolved' | 'closed';
export type StoryCategory = 
  | 'project_completed' 
  | 'competition_attempted' 
  | 'skill_developed' 
  | 'opportunity_pursued' 
  | 'academic_improvement' 
  | 'communication_improvement' 
  | 'leadership' 
  | 'other';
export type StoryStatus = 'draft' | 'submitted' | 'approved' | 'published';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  student_id: string;
  department: string;
  program: string;
  semester: number;
  phone?: string;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  skills: string[];
  interests: string[];
  technologies: string[];
  projects: string[];
  achievements: string[];
  competitions: string[];
  internships: string[];
  guidance_areas: string[];
  availability: string;
  bio: string;
  created_at: string;
}

export interface JuniorProfile {
  id: string;
  user_id: string;
  interests: string[];
  current_skills: string[];
  guidance_areas: string[];
  current_goal: string;
  preferred_topics: string[];
  created_at: string;
}

export interface MentorMatch {
  id: string;
  mentor_id: string;
  junior_id: string;
  match_score: number;
  match_reason: string[];
  status: MatchStatus;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  // Hydrated references
  mentor?: User;
  junior?: User;
}

export interface Interaction {
  id: string;
  mentor_id: string;
  junior_id: string;
  interaction_date: string;
  duration: number; // in minutes
  interaction_type: InteractionType;
  topics: string[];
  discussion_summary: string;
  learning_outcome: string;
  next_interaction_date?: string;
  created_at: string;
  // Hydrated references & actions
  mentor?: User;
  junior?: User;
  action_items?: ActionItem[];
}

export interface ActionItem {
  id: string;
  interaction_id?: string;
  junior_id: string;
  description: string;
  due_date: string;
  status: ActionItemStatus;
  completed_at?: string;
  created_at: string;
}

export interface MonthlyPulse {
  id: string;
  junior_id: string;
  month: string; // YYYY-MM
  interaction_completed: boolean;
  usefulness_rating: number; // 1-5
  goal_clarity_rating: number; // 1-5
  previous_action_completed: boolean;
  next_guidance_request: string;
  submitted_at: string;
  // Hydrated
  junior?: User;
}

export interface Escalation {
  id: string;
  raised_by: string;
  junior_id: string;
  category: EscalationCategory;
  severity: EscalationSeverity;
  description: string;
  assigned_to?: string;
  status: EscalationStatus;
  resolution?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  // Hydrated
  raised_by_user?: User;
  junior?: User;
  assigned_to_user?: User;
}

export interface SuccessStory {
  id: string;
  student_id: string;
  mentor_id?: string;
  title: string;
  description: string;
  before_state?: string;
  action_taken?: string;
  outcome?: string;
  category: StoryCategory;
  status: StoryStatus;
  approved_by?: string;
  created_at: string;
  updated_at?: string;
  // Hydrated
  student?: User;
  mentor?: User;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  created_at: string;
  link?: string;
}

export interface MatchingWeights {
  program: number;      // default 0.25
  interest: number;     // default 0.25
  guidance: number;     // default 0.20
  skill: number;        // default 0.15
  availability: number; // default 0.10
  experience: number;   // default 0.05
}

export interface ProgramSettings {
  id: string;
  program_name: string;
  tagline: string;
  pilot_start_date: string;
  pilot_end_date: string;
  interaction_threshold_days: number;
  max_juniors_per_mentor: number;
  matching_weights: MatchingWeights;
  active: boolean;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ProgramHealthMetrics {
  mentor_participation: number;
  junior_participation: number;
  matching_completion: number;
  interaction_completion: number;
  goal_setting_rate: number;
  action_completion_rate: number;
  feedback_response_rate: number;
  escalation_resolution_rate: number;
  overall_health_score: number;
}
