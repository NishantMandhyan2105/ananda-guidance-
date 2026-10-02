import { User, MentorProfile, JuniorProfile, MatchingWeights } from '../types';

export interface MatchRecommendation {
  mentor: User;
  mentorProfile?: MentorProfile;
  junior: User;
  juniorProfile?: JuniorProfile;
  matchScore: number;
  matchReasons: string[];
}

// Calculates Jaccard similarity index between two string arrays (case-insensitive)
function jaccardSimilarity(arr1: string[] = [], arr2: string[] = []): number {
  if (!arr1.length || !arr2.length) return 0;
  const set1 = new Set(arr1.map(s => s.trim().toLowerCase()));
  const set2 = new Set(arr2.map(s => s.trim().toLowerCase()));
  
  let intersectionSize = 0;
  set1.forEach(item => {
    if (set2.has(item)) intersectionSize++;
  });
  
  const unionSize = new Set([...set1, ...set2]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

// Calculates overlap count
function getOverlap(arr1: string[] = [], arr2: string[] = []): string[] {
  const set2 = new Set(arr2.map(s => s.trim().toLowerCase()));
  return arr1.filter(item => set2.has(item.trim().toLowerCase()));
}

export function calculateMatchScore(
  mentor: User,
  mentorProfile: MentorProfile | undefined,
  junior: User,
  juniorProfile: JuniorProfile | undefined,
  weights: MatchingWeights = {
    program: 0.25,
    interest: 0.25,
    guidance: 0.20,
    skill: 0.15,
    availability: 0.10,
    experience: 0.05
  }
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Academic Program & Department Match (Weight default 25%)
  let programScore = 0;
  if (mentor.program.toLowerCase() === junior.program.toLowerCase()) {
    programScore = 1.0;
    reasons.push(`Exact academic program match: ${junior.program}`);
  } else if (mentor.department.toLowerCase() === junior.department.toLowerCase()) {
    programScore = 0.8;
    reasons.push(`Same academic department: ${junior.department}`);
  } else {
    programScore = 0.2;
  }
  score += programScore * (weights.program * 100);

  // 2. Interest Overlap (Weight default 25%)
  const mInterests = mentorProfile?.interests || [];
  const jInterests = juniorProfile?.interests || [];
  const interestOverlap = getOverlap(mInterests, jInterests);
  const interestSim = jaccardSimilarity(mInterests, jInterests);
  
  if (interestOverlap.length > 0) {
    reasons.push(`Shared interests in: ${interestOverlap.slice(0, 3).join(', ')}`);
  }
  score += Math.min(1.0, interestSim * 1.8) * (weights.interest * 100);

  // 3. Guidance Area Overlap (Weight default 20%)
  const mGuidance = mentorProfile?.guidance_areas || [];
  const jGuidance = juniorProfile?.guidance_areas || [];
  const guidanceOverlap = getOverlap(mGuidance, jGuidance);
  
  if (guidanceOverlap.length > 0) {
    reasons.push(`Mentor offers requested guidance on: ${guidanceOverlap.slice(0, 2).join(' & ')}`);
    score += Math.min(1.0, guidanceOverlap.length / Math.max(1, jGuidance.length)) * (weights.guidance * 100);
  } else {
    score += 0.2 * (weights.guidance * 100);
  }

  // 4. Technology & Skills Alignment (Weight default 15%)
  const mTech = [...(mentorProfile?.technologies || []), ...(mentorProfile?.skills || [])];
  const jTopics = [...(juniorProfile?.preferred_topics || []), ...(juniorProfile?.current_skills || [])];
  const techOverlap = getOverlap(mTech, jTopics);

  if (techOverlap.length > 0) {
    reasons.push(`Technical alignment: ${techOverlap.slice(0, 2).join(', ')}`);
    score += Math.min(1.0, techOverlap.length / 2) * (weights.skill * 100);
  } else {
    score += 0.3 * (weights.skill * 100);
  }

  // 5. Availability Compatibility (Weight default 10%)
  const avail = mentorProfile?.availability?.toLowerCase() || '';
  if (avail.includes('3') || avail.includes('4') || avail.includes('weekend') || avail.includes('evening')) {
    score += 1.0 * (weights.availability * 100);
    reasons.push('High mentor availability match');
  } else {
    score += 0.7 * (weights.availability * 100);
  }

  // 6. Mentor Experience Relevance (Weight default 5%)
  const achievements = mentorProfile?.achievements || [];
  const competitions = mentorProfile?.competitions || [];
  const internships = mentorProfile?.internships || [];
  if (achievements.length > 0 || competitions.length > 0 || internships.length > 0) {
    score += 1.0 * (weights.experience * 100);
    if (internships.length > 0) {
      reasons.push(`Mentor brings practical experience (${internships[0]})`);
    } else if (competitions.length > 0) {
      reasons.push(`Mentor has competition/hackathon experience`);
    }
  }

  // Round score to 1 decimal place, cap between 40 and 98
  const finalScore = Math.min(98.5, Math.max(45.0, Math.round(score * 10) / 10));

  return {
    score: finalScore,
    reasons: reasons.slice(0, 4) // Keep concise, max 4 reasons
  };
}

export function generateSuggestedMatches(
  unmatchedMentors: { user: User; profile?: MentorProfile }[],
  unmatchedJuniors: { user: User; profile?: JuniorProfile }[],
  weights: MatchingWeights,
  maxPerMentor: number = 3,
  currentMentorMatchCounts: Record<string, number> = {}
): MatchRecommendation[] {
  const suggestions: MatchRecommendation[] = [];

  for (const j of unmatchedJuniors) {
    let bestMentor: { user: User; profile?: MentorProfile } | null = null;
    let bestScore = -1;
    let bestReasons: string[] = [];

    for (const m of unmatchedMentors) {
      const activeCount = currentMentorMatchCounts[m.user.id] || 0;
      if (activeCount >= maxPerMentor) continue;

      const { score, reasons } = calculateMatchScore(
        m.user,
        m.profile,
        j.user,
        j.profile,
        weights
      );

      if (score > bestScore) {
        bestScore = score;
        bestMentor = m;
        bestReasons = reasons;
      }
    }

    if (bestMentor) {
      suggestions.push({
        mentor: bestMentor.user,
        mentorProfile: bestMentor.profile,
        junior: j.user,
        juniorProfile: j.profile,
        matchScore: bestScore,
        matchReasons: bestReasons
      });
    }
  }

  return suggestions.sort((a, b) => b.matchScore - a.matchScore);
}
