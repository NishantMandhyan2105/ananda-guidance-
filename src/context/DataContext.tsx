import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, MentorProfile, JuniorProfile, MentorMatch, 
  Interaction, ActionItem, MonthlyPulse, Escalation, 
  SuccessStory, ProgramSettings, AuditLog, ActionItemStatus,
  EscalationStatus, StoryStatus, MatchStatus
} from '../types';
import { 
  ALL_INITIAL_USERS, MENTOR_PROFILES, JUNIOR_PROFILES, 
  INITIAL_MATCHES, INITIAL_INTERACTIONS, INITIAL_ACTIONS, 
  INITIAL_PULSES, INITIAL_ESCALATIONS, INITIAL_SUCCESS_STORIES, 
  INITIAL_PROGRAM_SETTINGS, INITIAL_AUDIT_LOGS 
} from '../data/seedData';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface DataContextType {
  users: User[];
  mentorProfiles: MentorProfile[];
  juniorProfiles: JuniorProfile[];
  matches: MentorMatch[];
  interactions: Interaction[];
  actionItems: ActionItem[];
  monthlyPulses: MonthlyPulse[];
  escalations: Escalation[];
  successStories: SuccessStory[];
  programSettings: ProgramSettings;
  auditLogs: AuditLog[];
  
  // CRUD & Operations
  addUser: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>, profileData?: Partial<MentorProfile | JuniorProfile>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateJuniorProfile: (userId: string, updates: Partial<JuniorProfile>) => void;
  updateMentorProfile: (userId: string, updates: Partial<MentorProfile>) => void;
  
  // Matching
  createMatch: (mentorId: string, juniorId: string, score: number, reasons: string[]) => void;
  approveMatch: (matchId: string) => void;
  rejectMatch: (matchId: string) => void;
  reassignMatch: (matchId: string, newMentorId: string) => void;

  // Interactions & Actions
  recordInteraction: (
    interactionData: Omit<Interaction, 'id' | 'created_at'>,
    actionsData: { description: string; due_date: string }[]
  ) => boolean;
  toggleActionStatus: (actionId: string, status: ActionItemStatus) => void;

  // Pulses
  submitMonthlyPulse: (pulseData: Omit<MonthlyPulse, 'id' | 'submitted_at'>) => { success: boolean; message: string };

  // Escalations
  raiseEscalation: (escalationData: Omit<Escalation, 'id' | 'status' | 'created_at' | 'updated_at'>) => void;
  updateEscalation: (escalationId: string, updates: Partial<Escalation>) => void;

  // Success Stories
  submitSuccessStory: (storyData: Omit<SuccessStory, 'id' | 'created_at'>) => void;
  updateStoryStatus: (storyId: string, status: StoryStatus) => void;

  // Settings & Reset
  updateSettings: (newSettings: Partial<ProgramSettings>) => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast, addNotification } = useNotifications();

  // Helper to load or fallback to seed
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error loading state for ${key}`, e);
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadState('ananda_users', ALL_INITIAL_USERS));
  const [mentorProfiles, setMentorProfiles] = useState<MentorProfile[]>(() => loadState('ananda_mentor_profiles', MENTOR_PROFILES));
  const [juniorProfiles, setJuniorProfiles] = useState<JuniorProfile[]>(() => loadState('ananda_junior_profiles', JUNIOR_PROFILES));
  const [matches, setMatches] = useState<MentorMatch[]>(() => loadState('ananda_matches', INITIAL_MATCHES));
  const [interactions, setInteractions] = useState<Interaction[]>(() => loadState('ananda_interactions', INITIAL_INTERACTIONS));
  const [actionItems, setActionItems] = useState<ActionItem[]>(() => {
    const list: ActionItem[] = loadState('ananda_action_items', INITIAL_ACTIONS);
    // Auto-detect overdue on initial load
    const now = new Date().toISOString().slice(0, 10);
    return list.map(item => {
      if (item.status === 'completed') return item;
      if (item.due_date < now) {
        return { ...item, status: 'overdue' as ActionItemStatus };
      }
      return item;
    });
  });
  const [monthlyPulses, setMonthlyPulses] = useState<MonthlyPulse[]>(() => loadState('ananda_pulses', INITIAL_PULSES));
  const [escalations, setEscalations] = useState<Escalation[]>(() => loadState('ananda_escalations', INITIAL_ESCALATIONS));
  const [successStories, setSuccessStories] = useState<SuccessStory[]>(() => loadState('ananda_stories', INITIAL_SUCCESS_STORIES));
  const [programSettings, setProgramSettings] = useState<ProgramSettings>(() => loadState('ananda_settings', INITIAL_PROGRAM_SETTINGS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadState('ananda_audit_logs', INITIAL_AUDIT_LOGS));

  // Persistence effects
  useEffect(() => { localStorage.setItem('ananda_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ananda_mentor_profiles', JSON.stringify(mentorProfiles)); }, [mentorProfiles]);
  useEffect(() => { localStorage.setItem('ananda_junior_profiles', JSON.stringify(juniorProfiles)); }, [juniorProfiles]);
  useEffect(() => { localStorage.setItem('ananda_matches', JSON.stringify(matches)); }, [matches]);
  useEffect(() => { localStorage.setItem('ananda_interactions', JSON.stringify(interactions)); }, [interactions]);
  useEffect(() => { localStorage.setItem('ananda_action_items', JSON.stringify(actionItems)); }, [actionItems]);
  useEffect(() => { localStorage.setItem('ananda_pulses', JSON.stringify(monthlyPulses)); }, [monthlyPulses]);
  useEffect(() => { localStorage.setItem('ananda_escalations', JSON.stringify(escalations)); }, [escalations]);
  useEffect(() => { localStorage.setItem('ananda_stories', JSON.stringify(successStories)); }, [successStories]);
  useEffect(() => { localStorage.setItem('ananda_settings', JSON.stringify(programSettings)); }, [programSettings]);
  useEffect(() => { localStorage.setItem('ananda_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Log Audit Action helper
  const logAudit = (action: string, entity_type: string, entity_id?: string, metadata?: Record<string, any>) => {
    const entry: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: currentUser?.id,
      user_name: currentUser?.name || 'System',
      action,
      entity_type,
      entity_id,
      metadata,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Add User
  const addUser = (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>, profileData?: Partial<MentorProfile | JuniorProfile>) => {
    const newId = `usr-${userData.role}-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id: newId,
      created_at: timestamp,
      updated_at: timestamp
    };

    setUsers(prev => [newUser, ...prev]);

    if (userData.role === 'mentor') {
      const newMentorProfile: MentorProfile = {
        id: `prof-m-${Date.now()}`,
        user_id: newId,
        skills: (profileData as Partial<MentorProfile>)?.skills || [],
        interests: (profileData as Partial<MentorProfile>)?.interests || [],
        technologies: (profileData as Partial<MentorProfile>)?.technologies || [],
        projects: (profileData as Partial<MentorProfile>)?.projects || [],
        achievements: (profileData as Partial<MentorProfile>)?.achievements || [],
        competitions: (profileData as Partial<MentorProfile>)?.competitions || [],
        internships: (profileData as Partial<MentorProfile>)?.internships || [],
        guidance_areas: (profileData as Partial<MentorProfile>)?.guidance_areas || ['Programming', 'Academics'],
        availability: (profileData as Partial<MentorProfile>)?.availability || '2-4 hours/month',
        bio: (profileData as Partial<MentorProfile>)?.bio || '',
        created_at: timestamp
      };
      setMentorProfiles(prev => [...prev, newMentorProfile]);
    } else if (userData.role === 'junior') {
      const newJuniorProfile: JuniorProfile = {
        id: `prof-j-${Date.now()}`,
        user_id: newId,
        interests: (profileData as Partial<JuniorProfile>)?.interests || [],
        current_skills: (profileData as Partial<JuniorProfile>)?.current_skills || [],
        guidance_areas: (profileData as Partial<JuniorProfile>)?.guidance_areas || ['Programming', 'Academics'],
        current_goal: (profileData as Partial<JuniorProfile>)?.current_goal || 'Build solid fundamentals in first-semester courses.',
        preferred_topics: (profileData as Partial<JuniorProfile>)?.preferred_topics || [],
        created_at: timestamp
      };
      setJuniorProfiles(prev => [...prev, newJuniorProfile]);
    }

    logAudit('USER_CREATED', 'users', newId, { name: newUser.name, role: newUser.role, department: newUser.department });
    showToast('User Created', `${newUser.name} added as ${newUser.role}.`, 'success');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u));
    logAudit('USER_UPDATED', 'users', id, updates);
  };

  const updateJuniorProfile = (userId: string, updates: Partial<JuniorProfile>) => {
    setJuniorProfiles(prev => prev.map(p => p.user_id === userId ? { ...p, ...updates } : p));
    logAudit('JUNIOR_PROFILE_UPDATED', 'junior_profiles', userId, updates);
    showToast('Profile Updated', 'Your guidance preferences and goals have been saved.', 'success');
  };

  const updateMentorProfile = (userId: string, updates: Partial<MentorProfile>) => {
    setMentorProfiles(prev => prev.map(p => p.user_id === userId ? { ...p, ...updates } : p));
    logAudit('MENTOR_PROFILE_UPDATED', 'mentor_profiles', userId, updates);
    showToast('Profile Updated', 'Mentor profile updated successfully.', 'success');
  };

  // Matching
  const createMatch = (mentorId: string, juniorId: string, score: number, reasons: string[]) => {
    const newMatch: MentorMatch = {
      id: `match-${Date.now()}`,
      mentor_id: mentorId,
      junior_id: juniorId,
      match_score: score,
      match_reason: reasons,
      status: 'active',
      approved_by: currentUser?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setMatches(prev => [newMatch, ...prev]);
    logAudit('MATCH_CREATED', 'mentor_matches', newMatch.id, { mentorId, juniorId, score });
    showToast('Match Approved', 'Senior mentor paired with junior student.', 'success');
  };

  const approveMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'active' as MatchStatus, approved_by: currentUser?.id, updated_at: new Date().toISOString() } : m));
    logAudit('MATCH_APPROVED', 'mentor_matches', matchId);
    showToast('Match Approved', 'Match status updated to active.', 'success');
  };

  const rejectMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'inactive' as MatchStatus, updated_at: new Date().toISOString() } : m));
    logAudit('MATCH_REJECTED', 'mentor_matches', matchId);
    showToast('Match Rejected', 'Suggested match has been dismissed.', 'info');
  };

  const reassignMatch = (matchId: string, newMentorId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          mentor_id: newMentorId,
          status: 'reassigned' as MatchStatus,
          updated_at: new Date().toISOString()
        };
      }
      return m;
    }));
    logAudit('MATCH_REASSIGNED', 'mentor_matches', matchId, { newMentorId });
    showToast('Mentor Reassigned', 'Junior has been assigned to a new senior mentor.', 'success');
  };

  // Interactions (Business Rule: Max 2 action items!)
  const recordInteraction = (
    interactionData: Omit<Interaction, 'id' | 'created_at'>,
    actionsData: { description: string; due_date: string }[]
  ): boolean => {
    if (actionsData.length > 2) {
      showToast('Action Limit Exceeded', 'Mentoring interactions can create a maximum of 2 action items.', 'alert');
      return false;
    }

    const intId = `int-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newInteraction: Interaction = {
      ...interactionData,
      id: intId,
      created_at: timestamp
    };

    setInteractions(prev => [newInteraction, ...prev]);

    // Create action items
    const newActions: ActionItem[] = actionsData.map((act, idx) => ({
      id: `act-${Date.now()}-${idx}`,
      interaction_id: intId,
      junior_id: interactionData.junior_id,
      description: act.description,
      due_date: act.due_date,
      status: 'pending' as ActionItemStatus,
      created_at: timestamp
    }));

    if (newActions.length > 0) {
      setActionItems(prev => [...newActions, ...prev]);
    }

    logAudit('INTERACTION_RECORDED', 'interactions', intId, {
      mentor_id: interactionData.mentor_id,
      junior_id: interactionData.junior_id,
      actionsCount: newActions.length
    });

    addNotification(
      'New Mentoring Interaction Recorded',
      `Your guidance discussion on "${newInteraction.topics.join(', ')}" has been recorded. ${newActions.length} next action(s) assigned.`,
      'info',
      interactionData.junior_id
    );

    showToast('Interaction Recorded', 'Mentoring discussion and action items saved successfully.', 'success');
    return true;
  };

  const toggleActionStatus = (actionId: string, status: ActionItemStatus) => {
    setActionItems(prev => prev.map(a => {
      if (a.id === actionId) {
        const completed_at = status === 'completed' ? new Date().toISOString() : undefined;
        return { ...a, status, completed_at };
      }
      return a;
    }));

    logAudit('ACTION_STATUS_CHANGED', 'action_items', actionId, { newStatus: status });
    if (status === 'completed') {
      showToast('Action Completed! 🎉', 'Great job taking your next step forward.', 'success');
    }
  };

  // Pulses (1 per junior per month)
  const submitMonthlyPulse = (pulseData: Omit<MonthlyPulse, 'id' | 'submitted_at'>): { success: boolean; message: string } => {
    const existing = monthlyPulses.find(p => p.junior_id === pulseData.junior_id && p.month === pulseData.month);
    if (existing && currentUser?.role !== 'admin') {
      return {
        success: false,
        message: 'You have already submitted a pulse response for this month.'
      };
    }

    const newPulse: MonthlyPulse = {
      ...pulseData,
      id: `pulse-${Date.now()}`,
      submitted_at: new Date().toISOString()
    };

    setMonthlyPulses(prev => [newPulse, ...prev.filter(p => !(p.junior_id === pulseData.junior_id && p.month === pulseData.month))]);
    logAudit('PULSE_SUBMITTED', 'monthly_pulses', newPulse.id, {
      junior_id: pulseData.junior_id,
      month: pulseData.month,
      usefulness: pulseData.usefulness_rating
    });

    showToast('Monthly Pulse Submitted', 'Thank you! Your feedback helps us support you better.', 'success');
    return { success: true, message: 'Pulse submitted successfully' };
  };

  // Escalations
  const raiseEscalation = (escalationData: Omit<Escalation, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    const escId = `esc-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newEscalation: Escalation = {
      ...escalationData,
      id: escId,
      status: 'new',
      created_at: timestamp,
      updated_at: timestamp
    };

    setEscalations(prev => [newEscalation, ...prev]);
    logAudit('ESCALATION_RAISED', 'escalations', escId, {
      category: escalationData.category,
      severity: escalationData.severity,
      junior_id: escalationData.junior_id
    });

    showToast('Concern Escalated', 'University student support coordinators have been alerted.', 'warning');
  };

  const updateEscalation = (escalationId: string, updates: Partial<Escalation>) => {
    setEscalations(prev => prev.map(e => {
      if (e.id === escalationId) {
        const resolved_at = updates.status === 'resolved' || updates.status === 'closed' ? new Date().toISOString() : e.resolved_at;
        return {
          ...e,
          ...updates,
          resolved_at,
          updated_at: new Date().toISOString()
        };
      }
      return e;
    }));

    logAudit('ESCALATION_UPDATED', 'escalations', escalationId, updates);
    showToast('Escalation Updated', 'Case status has been updated.', 'info');
  };

  // Success Stories
  const submitSuccessStory = (storyData: Omit<SuccessStory, 'id' | 'created_at'>) => {
    const newStory: SuccessStory = {
      ...storyData,
      id: `story-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSuccessStories(prev => [newStory, ...prev]);
    logAudit('SUCCESS_STORY_SUBMITTED', 'success_stories', newStory.id, { title: storyData.title });
    showToast('Story Submitted', 'Your guidance journey story has been submitted for review.', 'success');
  };

  const updateStoryStatus = (storyId: string, status: StoryStatus) => {
    setSuccessStories(prev => prev.map(s => s.id === storyId ? { ...s, status, approved_by: currentUser?.id, updated_at: new Date().toISOString() } : s));
    logAudit('SUCCESS_STORY_STATUS_CHANGED', 'success_stories', storyId, { status });
    showToast('Success Story Updated', `Status changed to ${status}.`, 'success');
  };

  // Settings
  const updateSettings = (newSettings: Partial<ProgramSettings>) => {
    setProgramSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATED', 'program_settings', programSettings.id, newSettings);
    showToast('Settings Saved', 'Institutional program settings updated.', 'success');
  };

  // Reset to seed data
  const resetAllData = () => {
    setUsers(ALL_INITIAL_USERS);
    setMentorProfiles(MENTOR_PROFILES);
    setJuniorProfiles(JUNIOR_PROFILES);
    setMatches(INITIAL_MATCHES);
    setInteractions(INITIAL_INTERACTIONS);
    setActionItems(INITIAL_ACTIONS);
    setMonthlyPulses(INITIAL_PULSES);
    setEscalations(INITIAL_ESCALATIONS);
    setSuccessStories(INITIAL_SUCCESS_STORIES);
    setProgramSettings(INITIAL_PROGRAM_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    localStorage.removeItem('ananda_users');
    localStorage.removeItem('ananda_mentor_profiles');
    localStorage.removeItem('ananda_junior_profiles');
    localStorage.removeItem('ananda_matches');
    localStorage.removeItem('ananda_interactions');
    localStorage.removeItem('ananda_action_items');
    localStorage.removeItem('ananda_pulses');
    localStorage.removeItem('ananda_escalations');
    localStorage.removeItem('ananda_stories');
    localStorage.removeItem('ananda_settings');
    localStorage.removeItem('ananda_audit_logs');

    logAudit('SYSTEM_RESET', 'system', undefined, { note: 'Restored initial demonstration seed data' });
    showToast('Data Reset', 'Restored complete seed dataset.', 'info');
  };

  return (
    <DataContext.Provider value={{
      users,
      mentorProfiles,
      juniorProfiles,
      matches,
      interactions,
      actionItems,
      monthlyPulses,
      escalations,
      successStories,
      programSettings,
      auditLogs,
      addUser,
      updateUser,
      updateJuniorProfile,
      updateMentorProfile,
      createMatch,
      approveMatch,
      rejectMatch,
      reassignMatch,
      recordInteraction,
      toggleActionStatus,
      submitMonthlyPulse,
      raiseEscalation,
      updateEscalation,
      submitSuccessStory,
      updateStoryStatus,
      updateSettings,
      resetAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
