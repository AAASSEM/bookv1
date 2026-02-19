export const learningPlans = {
    'Beginner': {
        title: 'Letter Explorer',
        weeklyFocus: 'Recognizing letters A-E',
        dailyActivities: [
            { id: 'act1', title: 'Find the Letter A', type: 'Letter Hunt', icon: '🅰️', completed: false, link: '/activity/letter-hunt' },
            { id: 'act2', title: 'Song: ABCs', type: 'video', icon: '🎵', completed: true },
            { id: 'act3', title: 'Trace the letter A', type: 'writing', icon: '✍️', completed: false, link: '/activity/letter-tracing' },
        ],
        streak: 2,
        progress: 15
    },
    'Advanced Reader': {
        title: 'Word Wizard',
        weeklyFocus: 'Reading CVC words (Cat, Dog)',
        dailyActivities: [
            { id: 'act0', title: 'Find the Letter A', type: 'Letter Hunt', icon: '🅰️', completed: false, link: '/activity/letter-hunt' },
            { id: 'act1', title: 'Match word to picture', type: 'Phonics Game', icon: '🖼️', completed: false, link: '/activity/phonics-match' },
            { id: 'act2', title: 'Trace the letter A', type: 'writing', icon: '✍️', completed: false, link: '/activity/letter-tracing' },
            { id: 'act3', title: 'Read the story: The Fat Cat', type: 'story', icon: '📖', completed: false },
        ],
        streak: 5,
        progress: 40
    }
};

export function getLearningPlan(level) {
    return learningPlans[level] || learningPlans['Beginner'];
}
