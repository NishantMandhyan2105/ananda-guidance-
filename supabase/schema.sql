-- =============================================================================
-- ĀNANDA: Senior–Junior Guidance Connect
-- Complete PostgreSQL / Supabase Database Schema
-- "BELONG • LEARN • CARE • GROW"
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'coordinator', 'mentor', 'junior');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('suggested', 'pending', 'active', 'reassigned', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE interaction_type AS ENUM ('in_person', 'online', 'phone', 'group');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE action_item_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escalation_category AS ENUM ('academic', 'wellbeing', 'harassment', 'safety', 'personal', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escalation_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escalation_status AS ENUM ('new', 'under_review', 'referred', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE story_category AS ENUM (
        'project_completed',
        'competition_attempted',
        'skill_developed',
        'opportunity_pursued',
        'academic_improvement',
        'communication_improvement',
        'leadership',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE story_status AS ENUM ('draft', 'submitted', 'approved', 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================================================
-- 2. USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'junior',
    student_id VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INT NOT NULL DEFAULT 1,
    phone VARCHAR(30),
    status user_status NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. MENTOR PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    projects TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    competitions TEXT[] DEFAULT '{}',
    internships TEXT[] DEFAULT '{}',
    guidance_areas TEXT[] DEFAULT '{}',
    availability VARCHAR(100) DEFAULT '2-4 hours/month',
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. JUNIOR PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.junior_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    interests TEXT[] DEFAULT '{}',
    current_skills TEXT[] DEFAULT '{}',
    guidance_areas TEXT[] DEFAULT '{}',
    current_goal TEXT,
    preferred_topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. MENTOR MATCHES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mentor_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    junior_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    match_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    match_reason TEXT[] DEFAULT '{}',
    status match_status NOT NULL DEFAULT 'suggested',
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. INTERACTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    junior_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    interaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration INT NOT NULL DEFAULT 30, -- minutes
    interaction_type interaction_type NOT NULL DEFAULT 'in_person',
    topics TEXT[] DEFAULT '{}',
    discussion_summary TEXT NOT NULL,
    learning_outcome TEXT NOT NULL,
    next_interaction_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. ACTION ITEMS (Business Rule: Max 2 actions per interaction)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interaction_id UUID REFERENCES public.interactions(id) ON DELETE CASCADE,
    junior_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status action_item_status NOT NULL DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. MONTHLY PULSES (5-Question Survey)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.monthly_pulses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    junior_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- e.g. '2026-09'
    interaction_completed BOOLEAN NOT NULL DEFAULT false,
    usefulness_rating INT NOT NULL CHECK (usefulness_rating BETWEEN 1 AND 5),
    goal_clarity_rating INT NOT NULL CHECK (goal_clarity_rating BETWEEN 1 AND 5),
    previous_action_completed BOOLEAN NOT NULL DEFAULT false,
    next_guidance_request TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_junior_monthly_pulse UNIQUE (junior_id, month)
);

-- =============================================================================
-- 9. ESCALATIONS & SUPPORT
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raised_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    junior_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category escalation_category NOT NULL,
    severity escalation_severity NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status escalation_status NOT NULL DEFAULT 'new',
    resolution TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- =============================================================================
-- 10. SUCCESS STORIES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    before_state TEXT,
    action_taken TEXT,
    outcome TEXT,
    category story_category NOT NULL,
    status story_status NOT NULL DEFAULT 'draft',
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 11. NOTIFICATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 12. PROGRAM SETTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.program_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name VARCHAR(255) NOT NULL DEFAULT 'ĀNANDA Senior–Junior Guidance Connect',
    tagline VARCHAR(255) NOT NULL DEFAULT 'BELONG • LEARN • CARE • GROW',
    pilot_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pilot_end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '90 days'),
    interaction_threshold_days INT NOT NULL DEFAULT 21,
    max_juniors_per_mentor INT NOT NULL DEFAULT 4,
    matching_weights JSONB NOT NULL DEFAULT '{"program": 0.25, "interest": 0.25, "guidance": 0.20, "skill": 0.15, "availability": 0.10, "experience": 0.05}',
    active BOOLEAN NOT NULL DEFAULT true
);

-- =============================================================================
-- 13. AUDIT LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 14. INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);
CREATE INDEX IF NOT EXISTS idx_mentor_matches_mentor ON public.mentor_matches(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_matches_junior ON public.mentor_matches(junior_id);
CREATE INDEX IF NOT EXISTS idx_mentor_matches_status ON public.mentor_matches(status);
CREATE INDEX IF NOT EXISTS idx_interactions_mentor ON public.interactions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_interactions_junior ON public.interactions(junior_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON public.interactions(interaction_date);
CREATE INDEX IF NOT EXISTS idx_action_items_junior ON public.action_items(junior_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON public.action_items(status);
CREATE INDEX IF NOT EXISTS idx_monthly_pulses_junior ON public.monthly_pulses(junior_id);
CREATE INDEX IF NOT EXISTS idx_escalations_status ON public.escalations(status);
CREATE INDEX IF NOT EXISTS idx_escalations_junior ON public.escalations(junior_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.junior_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
