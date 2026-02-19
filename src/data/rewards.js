// Comprehensive Achievement & Reward System

export const achievements = {
  // ASSESSMENT ACHIEVEMENTS
  assessment_badges: [
    {
      id: 'first_assessment',
      name: 'Brave Beginning',
      icon: '🌟',
      description: 'Completed your first assessment',
      points: 50,
      requirement: { type: 'assessment_completed', count: 1 },
      rarity: 'common'
    },
    {
      id: 'perfect_score',
      name: 'Perfect Scholar',
      icon: '💯',
      description: 'Got 100% on assessment',
      points: 200,
      requirement: { type: 'assessment_accuracy', value: 100 },
      rarity: 'legendary'
    },
    {
      id: 'letter_expert',
      name: 'Letter Expert',
      icon: '🅰️+',
      description: 'Mastered letter recognition (100% in skill)',
      points: 100,
      requirement: { type: 'skill_mastery', skill: 'letter_recognition', value: 100 },
      rarity: 'rare'
    },
    {
      id: 'phonics_master',
      name: 'Phonics Pro',
      icon: '🎵',
      description: 'Mastered phonics (100% in skill)',
      points: 100,
      requirement: { type: 'skill_mastery', skill: 'phonics', value: 100 },
      rarity: 'rare'
    }
  ],

  // ACTIVITY ACHIEVEMENTS
  activity_badges: [
    {
      id: 'first_activity',
      name: 'First Steps',
      icon: '👣',
      description: 'Completed your first activity',
      points: 25,
      requirement: { type: 'activities_completed', count: 1 },
      rarity: 'common'
    },
    {
      id: 'five_activities',
      name: 'Getting Started',
      icon: '📚',
      description: 'Completed 5 activities',
      points: 50,
      requirement: { type: 'activities_completed', count: 5 },
      rarity: 'common'
    },
    {
      id: 'letter_hunt_champion',
      name: 'Letter Hunt Champion',
      icon: '🏆',
      description: 'Found all letters in Letter Hunt with perfect score',
      points: 100,
      requirement: { type: 'activity_perfect', activity: 'letter_hunt' },
      rarity: 'rare'
    },
    {
      id: 'phonics_genius',
      name: 'Phonics Genius',
      icon: '🧠',
      description: 'Perfect score in Phonics Match',
      points: 100,
      requirement: { type: 'activity_perfect', activity: 'phonics_match' },
      rarity: 'rare'
    },
    {
      id: 'tiny_artist',
      name: 'Tiny Artist',
      icon: '🎨',
      description: 'Completed 3 tracing activities',
      points: 75,
      requirement: { type: 'activity_type_count', activity: 'tracing', count: 3 },
      rarity: 'common'
    },
    {
      id: 'activity_marathon',
      name: 'Activity Marathon',
      icon: '🏃',
      description: 'Completed 10 activities in one day',
      points: 150,
      requirement: { type: 'activities_in_day', count: 10 },
      rarity: 'epic'
    }
  ],

  // STREAK ACHIEVEMENTS
  streak_badges: [
    {
      id: 'streak_3',
      name: 'On Fire!',
      icon: '🔥',
      description: '3 day learning streak',
      points: 75,
      requirement: { type: 'streak', count: 3 },
      rarity: 'common'
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      icon: '⚔️',
      description: '7 day learning streak',
      points: 200,
      requirement: { type: 'streak', count: 7 },
      rarity: 'epic'
    },
    {
      id: 'streak_14',
      name: 'Dedicated Learner',
      icon: '💎',
      description: '14 day learning streak',
      points: 500,
      requirement: { type: 'streak', count: 14 },
      rarity: 'legendary'
    },
    {
      id: 'streak_30',
      name: 'Month Master',
      icon: '👑',
      description: '30 day learning streak',
      points: 1000,
      requirement: { type: 'streak', count: 30 },
      rarity: 'legendary'
    }
  ],

  // SKILL MILESTONES
  skill_badges: [
    {
      id: 'beginner_complete',
      name: 'Beginner Graduate',
      icon: '🎓',
      description: 'Completed all Beginner level skills',
      points: 300,
      requirement: { type: 'level_complete', level: 'Beginner' },
      rarity: 'rare'
    },
    {
      id: 'intermediate_complete',
      name: 'Rising Star',
      icon: '⭐',
      description: 'Completed all Intermediate level skills',
      points: 500,
      requirement: { type: 'level_complete', level: 'Intermediate' },
      rarity: 'epic'
    },
    {
      id: 'advanced_complete',
      name: 'Super Reader',
      icon: '🦸',
      description: 'Completed all Advanced level skills',
      points: 1000,
      requirement: { type: 'level_complete', level: 'Advanced' },
      rarity: 'legendary'
    },
    {
      id: 'skill_master_letter',
      name: 'Letter Lord',
      icon: '🔤',
      description: 'Mastered letter recognition skill (90%+)',
      points: 150,
      requirement: { type: 'skill_mastery', skill: 'letter_recognition', value: 90 },
      rarity: 'rare'
    },
    {
      id: 'skill_master_phonics',
      name: 'Sound Specialist',
      icon: '🎶',
      description: 'Mastered phonics skill (90%+)',
      points: 150,
      requirement: { type: 'skill_mastery', skill: 'phonics', value: 90 },
      rarity: 'rare'
    },
    {
      id: 'skill_master_rhyming',
      name: 'Rhyme Ranger',
      icon: '🎭',
      description: 'Mastered rhyming skill (90%+)',
      points: 150,
      requirement: { type: 'skill_mastery', skill: 'rhyming', value: 90 },
      rarity: 'rare'
    },
    {
      id: 'skill_master_grammar',
      name: 'Grammar Guru',
      icon: '📝',
      description: 'Mastered grammar skill (90%+)',
      points: 150,
      requirement: { type: 'skill_mastery', skill: 'grammar', value: 90 },
      rarity: 'rare'
    },
    {
      id: 'skill_master_fluency',
      name: 'Fluency Hero',
      icon: '📖',
      description: 'Mastered reading fluency (90%+)',
      points: 150,
      requirement: { type: 'skill_mastery', skill: 'reading_fluency', value: 90 },
      rarity: 'rare'
    }
  ],

  // SPECIAL ACHIEVEMENTS
  special_badges: [
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      icon: '⚡',
      description: 'Completed activity in under 2 minutes',
      points: 100,
      requirement: { type: 'speed', seconds: 120 },
      rarity: 'rare'
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      icon: '🦉',
      description: 'Completed activity after 8 PM',
      points: 50,
      requirement: { type: 'time_after', hour: 20 },
      rarity: 'common'
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      icon: '🐦',
      description: 'Completed activity before 9 AM',
      points: 50,
      requirement: { type: 'time_before', hour: 9 },
      rarity: 'common'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      icon: '💎',
      description: '5 perfect activity scores in a row',
      points: 300,
      requirement: { type: 'perfect_streak', count: 5 },
      rarity: 'epic'
    },
    {
      id: 'explorer',
      name: 'Explorer',
      icon: '🗺️',
      description: 'Tried all 3 activity types',
      points: 100,
      requirement: { type: 'variety', types: 3 },
      rarity: 'common'
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      icon: '🦋',
      description: 'Invited parent to see progress',
      points: 75,
      requirement: { type: 'parent_share' },
      rarity: 'common'
    }
  ]
};

// Combine all achievements
export const allAchievements = [
  ...achievements.assessment_badges,
  ...achievements.activity_badges,
  ...achievements.streak_badges,
  ...achievements.skill_badges,
  ...achievements.special_badges
];

// Achievement rarity colors
export const rarityColors = {
  common: '#95a5a6',      // Gray
  rare: '#3498db',         // Blue
  epic: '#9b59b6',         // Purple
  legendary: '#f39c12'     // Gold
};

// Points system
export const pointsLevels = {
  bronze: 500,
  silver: 1500,
  gold: 3000,
  platinum: 5000,
  diamond: 10000
};

export function getLevelForPoints(points) {
  if (points >= pointsLevels.diamond) return { name: 'Diamond', icon: '💠', color: '#b9f2ff' };
  if (points >= pointsLevels.platinum) return { name: 'Platinum', icon: '💎', color: '#e5e4e2' };
  if (points >= pointsLevels.gold) return { name: 'Gold', icon: '🏅', color: '#ffd700' };
  if (points >= pointsLevels.silver) return { name: 'Silver', icon: '🥈', color: '#c0c0c0' };
  if (points >= pointsLevels.bronze) return { name: 'Bronze', icon: '🥉', color: '#cd7f32' };
  return { name: 'Beginner', icon: '🌱', color: '#90EE90' };
}

// Legacy support for old code
export const badges = allAchievements.map(a => ({
  id: a.id,
  label: a.name,
  icon: a.icon,
  description: a.description,
  earned: false,
  points: a.points,
  rarity: a.rarity
}));

export function getEarnedBadges(earnedIds = []) {
  return allAchievements.filter(b => earnedIds.includes(b.id));
}

export function getAllBadges() {
  return allAchievements;
}
