import type { TraitLabels, Playbook, CardsDeck, LocaleBundle, Level } from '../../types';

export const labels: TraitLabels = {
  O: { name: 'Openness', alt: 'Intellect / Openness', tone: 'Curious explorer' },
  C: { name: 'Conscientiousness', alt: 'Order & drive', tone: 'Planner & executor' },
  E: { name: 'Extraversion', alt: 'Social energy', tone: 'Social driver' },
  A: { name: 'Agreeableness', alt: 'Cooperation', tone: 'Collaborator' },
  N: { name: 'Neuroticism', alt: 'Emotional volatility', tone: 'Emotional flux' }
};

export const playbook: Playbook = {
  O: {
    high: [
      'Weave cross-disciplinary examples or analogies to keep material fresh; capture quick ideas in spare minutes and validate fast.',
      'Turn outputs into a portfolio or mini experiments—showing your work fuels motivation.'
    ],
    neutral: [
      'Reserve one hour weekly for exploratory reading; use templates for the rest to stay curious without drifting.',
      'Map new knowledge onto existing frameworks so creativity and solid understanding move together.'
    ],
    low: [
      'Lean on structured materials with key worked examples to reduce overload and anxiety.',
      'Start with “replicate then tweak”: master a template before making small innovations.'
    ]
  },
  C: {
    high: [
      'Break work into pomodoros and milestones; close the day with a retro to quantify progress and quality.',
      'Pre-flight complex tasks with a mock run to lighten the cognitive load on execution day.'
    ],
    neutral: [
      'Plan with a 3-item todo and timeboxes; keep a 20% buffer to avoid frustration.',
      'Define starter actions (open outline, write the title) to lower the friction of beginning.'
    ],
    low: [
      'Work in 15–20 minute micro-sprints and reward yourself immediately to build a positive loop.',
      'Use a buddy or coach for weekly check-ins to add external accountability.'
    ]
  },
  E: {
    high: [
      'Favor discussion-based or group learning; teaching others cements your own learning. Host a weekly mini-share.',
      'Use commutes or workouts for podcasts and voice notes, channeling social energy into input.'
    ],
    neutral: [
      'Pair solo deep work with short group discussions at a 2:1 ratio to keep rhythm without social drain.',
      'Record a 3-minute voice question for peers to get quick feedback.'
    ],
    low: [
      'Prioritize async learning: writing, detailed notes, or screen-recorded explainers to skip live pressure.',
      'Book quiet blocks away from messaging to keep a controlled pace.'
    ]
  },
  A: {
    high: [
      'Use a “peer TA” mode—answer questions or swap reviews; social reciprocity boosts retention.',
      'Take coordination or integration roles in team work to leverage your empathy for collaboration.'
    ],
    neutral: [
      'Create a mini checklist for feedback (expectations, deadline, format) to balance warmth with clarity.',
      'Alternate solo work with paired retros so you keep efficiency and still get support.'
    ],
    low: [
      'Set discussion rules and timeboxes to prevent runaway debates; support points with facts and examples.',
      'Pick tasks with clear, measurable goals to reduce interpersonal friction on focus.'
    ]
  },
  N: {
    high: [
      'Ship a minimal viable version first, then iterate to curb perfectionism-driven delays.',
      'Add an emotional buffer: 5 minutes of breathing or stretching before study; short walks between tasks.'
    ],
    neutral: [
      'Keep a steady pace and sleep schedule; log mood and performance to spot triggers early.',
      'When stuck, write three actionable steps to prevent emotional escalation.'
    ],
    low: [
      'Use your stable affect to take high-pressure or tight-deadline tasks as the team’s ballast.',
      'Add deliberate challenges (timed quizzes) so comfort doesn’t slide into drift.'
    ]
  }
};

export const cards: CardsDeck = {
  E: {
    high: [
      '[Social Boost] Join an online/offline study group to fuel momentum.',
      '[Energy Switch] Chat with someone for 1 minute before studying to get in the zone.',
      '[Explain It] Say out loud what you learned today.'
    ],
    neutral: [
      '[Balance] Study solo for 20 minutes, then do a 5-minute social recap.',
      '[Light Share] Tell a friend one thing you learned today.',
      '[Observe] Skim peers’ updates for motivation (no need to post).'
    ],
    low: [
      '[Quiet Focus] Find a silent spot and study for 10 minutes.',
      '[Calm Intake] Read or take notes instead of talking.',
      '[Solo Task] Finish a small chunk entirely on your own—no social pressure.'
    ]
  },
  A: {
    high: [
      '[Warm Start] Begin with a line of encouragement to yourself.',
      '[Buddy Assist] Help someone understand a concept.',
      '[Co-work] Pick a light task that needs a bit of interaction.'
    ],
    neutral: [
      '[Comfort] Do a learning task you feel good about.',
      '[Reflect] Note one small difficulty today and a one-line solution.',
      '[Swap] Exchange a brief summary with one person (anonymous is fine).'
    ],
    low: [
      '[Target] Finish a clear, small goal.',
      '[Efficiency] Skip interaction and go straight to the task.',
      '[Minimal Words] Summarize with as few words as possible.'
    ]
  },
  C: {
    high: [
      '[Execute] Do the most important item on your plan.',
      '[Organize] Make a list of what you learned today.',
      '[Timer] Set a 20-minute focus timer.'
    ],
    neutral: [
      '[Light Plan] Write 3 optional tasks; complete just one.',
      '[Rhythm] Do a 10-minute short study sprint.',
      '[Easy Start] Begin with the task you find easiest to start.'
    ],
    low: [
      '[Curious Bite] Study anything interesting for 3 minutes.',
      '[Free Pass] Finish one ultra-easy subtask and call it done.',
      '[Play Mode] Treat a small knowledge task like a game.'
    ]
  },
  N: {
    high: [
      '[Easy Win] Do a micro-task you feel zero stress about.',
      '[Settle] Rest 1 minute, then begin.',
      '[Decompress] Start from the simplest part—no perfection needed.'
    ],
    neutral: [
      '[Steady Pace] Work 5 minutes, pause 1 minute.',
      '[Just Right] Choose something not too hard, not too easy.',
      '[Calm Breath] Take three deep breaths before starting.'
    ],
    low: [
      '[Challenge] Pick a slightly harder task.',
      '[Advance] Tackle the trickiest task early.',
      '[Sustain] Try 15 minutes of uninterrupted study.'
    ]
  },
  O: {
    high: [
      '[Explore] Try a new topic or tool.',
      '[Creative Map] Turn today’s learning into a sketch/mind map.',
      '[Switch Mode] Learn the same content in a totally new way.'
    ],
    neutral: [
      '[Micro-Explore] Add a small twist to routine work (new spot, new order).',
      '[Light Remix] Write one sentence in your own words about a new insight.',
      '[Tiny New] Watch/read something new for under 3 minutes.'
    ],
    low: [
      '[Reinforce] Review a foundation you already know.',
      '[Structure] Follow a fixed sequence (A→B→C).',
      '[Stay Consistent] Don’t change the method—just finish the set task.'
    ]
  }
};

export const resultText: LocaleBundle['resultText'] = {
  O: {
    high: 'Your Openness is high—you enjoy novelty, variety, and change.',
    neutral: 'Your Openness is mid—you like tradition and will try new things when they fit.',
    low: 'Your Openness is low—you prefer familiar, direct approaches and value stability.'
  },
  C: {
    high: 'Your Conscientiousness is high—structured and goal-driven.',
    neutral: 'Your Conscientiousness is mid—can flex between planning and adapting.',
    low: 'Your Conscientiousness is low—more spontaneous; external structure can help.'
  },
  E: {
    high: 'Your Extraversion is high—social energy lifts your learning.',
    neutral: 'Your Extraversion is mid—comfortable switching between solo and social modes.',
    low: 'Your Extraversion is low—quiet, independent learning feels best.'
  },
  A: {
    high: 'Your Agreeableness is high—warm collaborator, empathy fuels teamwork.',
    neutral: 'Your Agreeableness is mid—can work alone or with others as needed.',
    low: 'Your Agreeableness is low—direct or competitive; clarity and rules help collaboration.'
  },
  N: {
    high: 'Your Neuroticism is high—mood can swing and affect pace; buffers help.',
    neutral: 'Your Neuroticism is mid—generally steady with occasional swings.',
    low: 'Your Neuroticism is low—steady under pressure; a stabilizer for teams.'
  }
};

export const levelText: Record<Level, string> = {
  high: 'High',
  neutral: 'Mid',
  low: 'Low'
};

const bundle: LocaleBundle = {
  labels,
  playbook,
  cards,
  resultText,
  levelText
};

export default bundle;
