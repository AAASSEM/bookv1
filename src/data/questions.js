export const assessmentQuestions = [
    // LETTER RECOGNITION (Questions 1-4)
    {
        id: 1,
        type: 'multiple-choice',
        prompt: 'Which letter matches sound /a/ as in "apple"?',
        options: [
            { id: 'a', text: 'A' },
            { id: 'b', text: 'B' },
            { id: 'c', text: 'C' },
        ],
        correctId: 'a',
        skill: 'letter_recognition'
    },
    {
        id: 2,
        type: 'multiple-choice',
        prompt: 'Find the letter "B"',
        options: [
            { id: 'd', text: 'D' },
            { id: 'b', text: 'B' },
            { id: 'p', text: 'P' },
        ],
        correctId: 'b',
        skill: 'letter_recognition'
    },
    {
        id: 3,
        type: 'multiple-choice',
        prompt: 'Which letter makes the sound /s/ as in "snake"?',
        options: [
            { id: 's', text: 'S' },
            { id: 'f', text: 'F' },
            { id: 'z', text: 'Z' },
        ],
        correctId: 's',
        skill: 'letter_recognition'
    },
    {
        id: 4,
        type: 'multiple-choice',
        prompt: 'Point to the letter "M"',
        options: [
            { id: 'n', text: 'N' },
            { id: 'w', text: 'W' },
            { id: 'm', text: 'M' },
        ],
        correctId: 'm',
        skill: 'letter_recognition'
    },

    // PHONICS (Questions 5-8)
    {
        id: 5,
        type: 'image-choice',
        prompt: 'Tap picture that starts with "M".',
        options: [
            { id: 'moon', text: '🌙', label: 'Moon' },
            { id: 'sun', text: '☀️', label: 'Sun' },
            { id: 'star', text: '⭐', label: 'Star' },
        ],
        correctId: 'moon',
        skill: 'phonics'
    },
    {
        id: 6,
        type: 'image-choice',
        prompt: 'Which picture starts with "B"?',
        options: [
            { id: 'ball', text: '⚽', label: 'Ball' },
            { id: 'cat', text: '🐱', label: 'Cat' },
            { id: 'duck', text: '🦆', label: 'Duck' },
        ],
        correctId: 'ball',
        skill: 'phonics'
    },
    {
        id: 7,
        type: 'multiple-choice',
        prompt: 'Which word starts with the same sound as "sun"?',
        options: [
            { id: 'snake', text: 'Snake' },
            { id: 'sock', text: 'Sock' },
            { id: 'cat', text: 'Cat' },
        ],
        correctId: 'sock',
        skill: 'phonics'
    },
    {
        id: 8,
        type: 'multiple-choice',
        prompt: 'What sound does "dog" start with?',
        options: [
            { id: 'd', text: '/d/' },
            { id: 'b', text: '/b/' },
            { id: 'g', text: '/g/' },
        ],
        correctId: 'd',
        skill: 'phonics'
    },

    // RHYMING (Questions 9-11)
    {
        id: 9,
        type: 'multiple-choice',
        prompt: 'Which word rhymes with "Cat"?',
        options: [
            { id: 'dog', text: 'Dog' },
            { id: 'bat', text: 'Bat' },
            { id: 'fish', text: 'Fish' },
        ],
        correctId: 'bat',
        skill: 'rhyming'
    },
    {
        id: 10,
        type: 'multiple-choice',
        prompt: 'Find the word that rhymes with "hop"?',
        options: [
            { id: 'run', text: 'Run' },
            { id: 'top', text: 'Top' },
            { id: 'jump', text: 'Jump' },
        ],
        correctId: 'top',
        skill: 'rhyming'
    },
    {
        id: 11,
        type: 'multiple-choice',
        prompt: 'Which words rhyme? "Pan" and...',
        options: [
            { id: 'pen', text: 'Pen' },
            { id: 'can', text: 'Can' },
            { id: 'pin', text: 'Pin' },
        ],
        correctId: 'can',
        skill: 'rhyming'
    },

    // GRAMMAR & WORD STRUCTURE (Questions 12-13)
    {
        id: 12,
        type: 'multiple-choice',
        prompt: 'Choose the correct ending: "The dog is runn..."',
        options: [
            { id: 'ing', text: 'ing' },
            { id: 'ed', text: 'ed' },
            { id: 's', text: 's' },
        ],
        correctId: 'ing',
        skill: 'grammar'
    },
    {
        id: 13,
        type: 'multiple-choice',
        prompt: 'Fill in the blank: "I ___ a red ball"',
        options: [
            { id: 'has', text: 'have' },
            { id: 'have', text: 'has' },
            { id: 'had', text: 'had' },
        ],
        correctId: 'have',
        skill: 'grammar'
    },

    // READING FLUENCY (Questions 14-15)
    {
        id: 14,
        type: 'multiple-choice',
        prompt: 'Read this sentence: "I see a big red car."',
        options: [
            { id: 'easy', text: 'I can read it easily' },
            { id: 'hard', text: 'I need help' },
        ],
        correctId: 'easy',
        skill: 'reading_fluency'
    },
    {
        id: 15,
        type: 'multiple-choice',
        prompt: 'Can you read: "The cat sits on the mat"?',
        options: [
            { id: 'yes', text: 'Yes, I can read it' },
            { id: 'no', text: 'No, I need help' },
        ],
        correctId: 'yes',
        skill: 'reading_fluency'
    }
];
