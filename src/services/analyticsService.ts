import { 
  User, MentorMatch, Interaction, ActionItem, 
  MonthlyPulse, Escalation, SuccessStory, ProgramSettings, 
  ProgramHealthMetrics, JuniorProfile 
} from '../types';

export interface AttentionItem {
  id: string;
  type: 'escalation' | 'inactive_group' | 'no_goal' | 'overdue_action' | 'low_feedback' | 'missing_pulse';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  targetType: 'escalation' | 'match' | 'junior' | 'action' | 'pulse';
  targetId: string;
}

export function computeAnalytics(
  users: User[],
  matches: MentorMatch[],
  interactions: Interaction[],
  actions: ActionItem[],
  pulses: MonthlyPulse[],
  escalations: Escalation[],
  stories: SuccessStory[],
  juniorProfiles: JuniorProfile[],
  settings: ProgramSettings
) {
  const mentors = users.filter(u => u.role === 'mentor' && u.status === 'active');
  const juniors = users.filter(u => u.role === 'junior' && u.status === 'active');
  const activeMatches = matches.filter(m => m.status === 'active');

  // Days since last interaction threshold calculation
  const today = new Date();
  const thresholdDays = settings.interaction_threshold_days || 21;

  // Inactive groups identification
  const inactiveMatches: { match: MentorMatch; daysSinceLast: number }[] = [];
  activeMatches.forEach(m => {
    const groupInteractions = interactions
      .filter(i => (i.mentor_id === m.mentor_id && i.junior_id === m.junior_id))
      .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());

    if (groupInteractions.length === 0) {
      // No interactions recorded yet since match creation
      const daysSinceMatch = Math.floor((today.getTime() - new Date(m.created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceMatch >= thresholdDays) {
        inactiveMatches.push({ match: m, daysSinceLast: daysSinceMatch });
      }
    } else {
      const lastDate = new Date(groupInteractions[0].interaction_date);
      const daysSinceLast = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLast >= thresholdDays) {
        inactiveMatches.push({ match: m, daysSinceLast });
      }
    }
  });

  // Goals
  const juniorsWithGoalCount = juniorProfiles.filter(p => p.current_goal && p.current_goal.trim().length > 0).length;
  const juniorsWithoutGoalCount = Math.max(0, juniors.length - juniorsWithGoalCount);

  // Actions
  const totalActions = actions.length;
  const completedActions = actions.filter(a => a.status === 'completed').length;
  const overdueActions = actions.filter(a => {
    if (a.status === 'completed') return false;
    return new Date(a.due_date).getTime() < today.getTime();
  });
  const actionCompletionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  // Feedback Experience
  const totalPulses = pulses.length;
  const avgUsefulness = totalPulses > 0 
    ? Math.round((pulses.reduce((acc, p) => acc + p.usefulness_rating, 0) / totalPulses) * 10) / 10 
    : 0;
  const avgGoalClarity = totalPulses > 0 
    ? Math.round((pulses.reduce((acc, p) => acc + p.goal_clarity_rating, 0) / totalPulses) * 10) / 10 
    : 0;

  // Support Escalations
  const openEscalations = escalations.filter(e => e.status !== 'resolved' && e.status !== 'closed');
  const resolvedEscalations = escalations.filter(e => e.status === 'resolved' || e.status === 'closed');

  // Success Stories
  const publishedStories = stories.filter(s => s.status === 'published');
  const approvedStories = stories.filter(s => s.status === 'approved' || s.status === 'published');

  // Program Health (0 - 100%)
  const mentorParticipation = mentors.length > 0 
    ? Math.min(100, Math.round((activeMatches.map(m => m.mentor_id).filter((v, i, a) => a.indexOf(v) === i).length / mentors.length) * 100))
    : 0;
  
  const juniorParticipation = juniors.length > 0 
    ? Math.min(100, Math.round((activeMatches.length / juniors.length) * 100))
    : 0;

  const matchingCompletion = juniorParticipation;

  const interactionCompletion = activeMatches.length > 0
    ? Math.min(100, Math.round(((activeMatches.length - inactiveMatches.length) / activeMatches.length) * 100))
    : 0;

  const goalSettingRate = juniors.length > 0 
    ? Math.min(100, Math.round((juniorsWithGoalCount / juniors.length) * 100))
    : 0;

  const feedbackResponseRate = juniors.length > 0
    ? Math.min(100, Math.round((totalPulses / juniors.length) * 100))
    : 0;

  const escalationResolutionRate = escalations.length > 0
    ? Math.min(100, Math.round((resolvedEscalations.length / escalations.length) * 100))
    : 100;

  const overallHealthScore = Math.round(
    (mentorParticipation * 0.15) +
    (juniorParticipation * 0.15) +
    (interactionCompletion * 0.20) +
    (actionCompletionRate * 0.20) +
    (goalSettingRate * 0.10) +
    (feedbackResponseRate * 0.10) +
    (escalationResolutionRate * 0.10)
  );

  const healthMetrics: ProgramHealthMetrics = {
    mentor_participation: mentorParticipation,
    junior_participation: juniorParticipation,
    matching_completion: matchingCompletion,
    interaction_completion: interactionCompletion,
    goal_setting_rate: goalSettingRate,
    action_completion_rate: actionCompletionRate,
    feedback_response_rate: feedbackResponseRate,
    escalation_resolution_rate: escalationResolutionRate,
    overall_health_score: overallHealthScore
  };

  // Compile Attention Required List
  const attentionList: AttentionItem[] = [];

  // 1. Critical & High Escalations
  openEscalations.forEach(e => {
    attentionList.push({
      id: `att-esc-${e.id}`,
      type: 'escalation',
      title: `Open ${e.category.toUpperCase()} Escalation (${e.severity})`,
      description: e.description.substring(0, 100) + '...',
      severity: e.severity,
      targetType: 'escalation',
      targetId: e.id
    });
  });

  // 2. Inactive Mentor Groups
  inactiveMatches.forEach(({ match, daysSinceLast }) => {
    const mUser = users.find(u => u.id === match.mentor_id);
    const jUser = users.find(u => u.id === match.junior_id);
    attentionList.push({
      id: `att-inac-${match.id}`,
      type: 'inactive_group',
      title: `Inactive Group: ${mUser?.name || 'Mentor'} ↔ ${jUser?.name || 'Junior'}`,
      description: `No interaction recorded in ${daysSinceLast} days (threshold: ${thresholdDays} days).`,
      severity: daysSinceLast > 35 ? 'high' : 'medium',
      targetType: 'match',
      targetId: match.id
    });
  });

  // 3. Overdue Actions
  overdueActions.forEach(a => {
    const jUser = users.find(u => u.id === a.junior_id);
    attentionList.push({
      id: `att-act-${a.id}`,
      type: 'overdue_action',
      title: `Overdue Action (${jUser?.name || 'Student'})`,
      description: `${a.description} — Due on ${a.due_date}`,
      severity: 'medium',
      targetType: 'action',
      targetId: a.id
    });
  });

  // 4. Low feedback scores (< 3)
  pulses.filter(p => p.usefulness_rating < 3 || p.goal_clarity_rating < 3).forEach(p => {
    const jUser = users.find(u => u.id === p.junior_id);
    attentionList.push({
      id: `att-feed-${p.id}`,
      type: 'low_feedback',
      title: `Low Feedback Score from ${jUser?.name || 'Student'}`,
      description: `Rated usefulness: ${p.usefulness_rating}/5, goal clarity: ${p.goal_clarity_rating}/5. Request: "${p.next_guidance_request || 'None'}"`,
      severity: 'high',
      targetType: 'pulse',
      targetId: p.id
    });
  });

  // 5. Juniors without goals
  juniorProfiles.filter(p => !p.current_goal || p.current_goal.trim() === '').forEach(p => {
    const jUser = users.find(u => u.id === p.user_id);
    if (jUser) {
      attentionList.push({
        id: `att-goal-${p.id}`,
        type: 'no_goal',
        title: `No Mentoring Goal Set: ${jUser.name}`,
        description: `Student in ${jUser.program} has not established a first-semester learning goal.`,
        severity: 'low',
        targetType: 'junior',
        targetId: jUser.id
      });
    }
  });

  // Recharts Chart Formatted Series
  // 1. Monthly Interaction trends
  const interactionsByMonth = [
    { month: 'Aug 2026', completed: 18, scheduled: 20, missed: 2 },
    { month: 'Sep 2026', completed: 14, scheduled: 16, missed: 2 },
    { month: 'Oct 2026 (Est.)', completed: 0, scheduled: 22, missed: 0 }
  ];

  // 2. Usefulness & Clarity Distribution (1 to 5 Stars)
  const usefulnessDist = [1, 2, 3, 4, 5].map(star => ({
    rating: `${star} Star`,
    count: pulses.filter(p => p.usefulness_rating === star).length
  }));

  const goalClarityDist = [1, 2, 3, 4, 5].map(star => ({
    rating: `${star} Star`,
    count: pulses.filter(p => p.goal_clarity_rating === star).length
  }));

  // 3. Department Breakdown
  const departmentStats = Array.from(new Set(users.map(u => u.department)))
    .filter(d => d && d !== 'Dean of Student Welfare')
    .map(dept => {
      const deptMentors = mentors.filter(m => m.department === dept).length;
      const deptJuniors = juniors.filter(j => j.department === dept).length;
      const deptMatches = activeMatches.filter(m => {
        const ju = users.find(u => u.id === m.junior_id);
        return ju?.department === dept;
      }).length;

      const deptActions = actions.filter(a => {
        const ju = users.find(u => u.id === a.junior_id);
        return ju?.department === dept;
      });
      const deptCompletedActions = deptActions.filter(a => a.status === 'completed').length;
      const completionRate = deptActions.length > 0 ? Math.round((deptCompletedActions / deptActions.length) * 100) : 0;

      return {
        department: dept.replace('Computer Science & Engineering', 'CSE')
                        .replace('Electronics & Communication', 'ECE')
                        .replace('Information Technology', 'IT')
                        .replace('Mechanical Engineering', 'Mech')
                        .replace('Management Studies', 'MGMT')
                        .replace('Design & Media', 'Design'),
        mentors: deptMentors,
        juniors: deptJuniors,
        matches: deptMatches,
        actionsCompleted: deptCompletedActions,
        completionRate
      };
    });

  return {
    kpis: {
      totalMentors: mentors.length,
      totalJuniors: juniors.length,
      activeMatches: activeMatches.length,
      interactionsCompleted: interactions.length,
      interactionCompletionRate: interactionCompletion,
      inactiveGroupsCount: inactiveMatches.length,
      juniorsWithGoal: juniorsWithGoalCount,
      juniorsWithoutGoal: juniorsWithoutGoalCount,
      actionsAssigned: totalActions,
      actionsCompleted: completedActions,
      overdueActionsCount: overdueActions.length,
      actionCompletionRate,
      avgUsefulness,
      avgGoalClarity,
      totalPulses,
      openEscalationsCount: openEscalations.length,
      resolvedEscalationsCount: resolvedEscalations.length,
      successStoriesCount: publishedStories.length,
      pendingStoriesCount: stories.filter(s => s.status === 'submitted').length
    },
    healthMetrics,
    attentionList,
    inactiveMatches,
    charts: {
      interactionsByMonth,
      usefulnessDist,
      goalClarityDist,
      departmentStats
    }
  };
}
