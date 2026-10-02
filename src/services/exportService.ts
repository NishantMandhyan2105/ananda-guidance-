import { User, MentorMatch, Interaction, ActionItem, MonthlyPulse, Escalation } from '../types';

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 1. Program Overall Report Export
export function exportProgramReportCSV(
  kpis: Record<string, any>,
  programName: string
) {
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Program Name', programName],
    ['Report Generated Date', new Date().toLocaleDateString()],
    ['Total Senior Mentors', kpis.totalMentors],
    ['Total Junior Students', kpis.totalJuniors],
    ['Active Mentor-Junior Groups', kpis.activeMatches],
    ['Interactions Completed', kpis.interactionsCompleted],
    ['Interaction Completion Rate', `${kpis.interactionCompletionRate}%`],
    ['Inactive Groups Needing Attention', kpis.inactiveGroupsCount],
    ['Students With Goals', kpis.juniorsWithGoal],
    ['Students Without Goals', kpis.juniorsWithoutGoal],
    ['Actions Assigned', kpis.actionsAssigned],
    ['Actions Completed', kpis.actionsCompleted],
    ['Overdue Actions', kpis.overdueActionsCount],
    ['Action Completion Rate', `${kpis.actionCompletionRate}%`],
    ['Average Usefulness Rating (1-5)', `${kpis.avgUsefulness} / 5.0`],
    ['Average Goal Clarity Rating (1-5)', `${kpis.avgGoalClarity} / 5.0`],
    ['Monthly Pulses Submitted', kpis.totalPulses],
    ['Open Escalations', kpis.openEscalationsCount],
    ['Resolved Escalations', kpis.resolvedEscalationsCount],
    ['Published Success Stories', kpis.successStoriesCount]
  ];

  const csv = [headers.join(','), ...rows.map(r => `"${r[0]}","${r[1]}"`)].join('\n');
  downloadCSV(`ananda-program-report-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

// 2. Department Breakdown Report Export
export function exportDepartmentReportCSV(departmentStats: any[]) {
  const headers = ['Department', 'Mentors', 'Juniors', 'Active Matches', 'Actions Completed', 'Action Completion Rate (%)'];
  const rows = departmentStats.map(d => [
    `"${d.department}"`,
    d.mentors,
    d.juniors,
    d.matches,
    d.actionsCompleted,
    `${d.completionRate}%`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`ananda-department-report-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

// 3. Mentor Activity Report Export
export function exportMentorActivityReportCSV(
  mentors: User[],
  matches: MentorMatch[],
  interactions: Interaction[],
  users: User[]
) {
  const headers = ['Mentor Name', 'Student ID', 'Department', 'Program', 'Assigned Juniors', 'Interactions Recorded', 'Last Interaction Date'];
  const rows = mentors.map(m => {
    const assignedMatches = matches.filter(match => match.mentor_id === m.id && match.status === 'active');
    const juniorNames = assignedMatches
      .map(match => users.find(u => u.id === match.junior_id)?.name || 'Unknown')
      .join('; ');

    const mentorInteractions = interactions
      .filter(i => i.mentor_id === m.id)
      .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());

    const lastDate = mentorInteractions.length > 0 ? mentorInteractions[0].interaction_date : 'None';

    return [
      `"${m.name}"`,
      `"${m.student_id}"`,
      `"${m.department}"`,
      `"${m.program}"`,
      `"${juniorNames || 'None'}"`,
      mentorInteractions.length,
      `"${lastDate}"`
    ];
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`ananda-mentor-activity-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

// 4. Junior Progress Dossier Export
export function exportJuniorProgressCSV(
  juniors: User[],
  matches: MentorMatch[],
  actions: ActionItem[],
  pulses: MonthlyPulse[],
  users: User[]
) {
  const headers = ['Student Name', 'Student ID', 'Department', 'Program', 'Assigned Mentor', 'Total Actions', 'Completed Actions', 'Latest Usefulness Rating', 'Latest Goal Clarity'];
  const rows = juniors.map(j => {
    const activeMatch = matches.find(m => m.junior_id === j.id && m.status === 'active');
    const mentor = activeMatch ? users.find(u => u.id === activeMatch.mentor_id) : null;

    const jActions = actions.filter(a => a.junior_id === j.id);
    const completed = jActions.filter(a => a.status === 'completed').length;

    const jPulses = pulses
      .filter(p => p.junior_id === j.id)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    
    const latestPulse = jPulses[0];

    return [
      `"${j.name}"`,
      `"${j.student_id}"`,
      `"${j.department}"`,
      `"${j.program}"`,
      `"${mentor ? mentor.name : 'Unmatched'}"`,
      jActions.length,
      completed,
      latestPulse ? `${latestPulse.usefulness_rating} / 5` : 'N/A',
      latestPulse ? `${latestPulse.goal_clarity_rating} / 5` : 'N/A'
    ];
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`ananda-junior-progress-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
