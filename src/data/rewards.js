export const badges = [
    {
        id: 'first_steps',
        label: 'First Steps',
        icon: '⭐',
        description: 'Completed your first activity',
        earned: false
    },
    {
        id: 'streak_master',
        label: 'Streak Master',
        icon: '🔥',
        description: '3 Day learning streak',
        earned: false
    },
    {
        id: 'letter_master',
        label: 'Letter Master',
        icon: '🅰️',
        description: 'Found all letters in Letter Hunt',
        earned: false
    },
    {
        id: 'super_listener',
        label: 'Super Listener',
        icon: '👂',
        description: 'Perfect score in Phonics Match',
        earned: false
    },
    {
        id: 'artist',
        label: 'Tiny Artist',
        icon: '🎨',
        description: 'Completed a tracing activity',
        earned: false
    }
];

export function getEarnedBadges() {
    return badges.filter(b => b.earned);
}

export function getAllBadges() {
    return badges;
}
