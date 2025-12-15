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
      '[Explain It] Say out loud what you learned today.',
      '[Teach Mode] Pretend you are teaching a class for 5 minutes.',
      '[Peer Check] Ask someone one quick clarifying question.',
      '[Live Presence] Study in a café or shared space.',
      '[Voice Note] Record a short audio summary instead of writing.',
      '[Discussion Spark] Post or respond to one idea in a forum or chat.'
    ],
    neutral: [
      '[Balance] Study solo for 20 minutes, then do a 5-minute social recap.',
      '[Light Share] Tell a friend one thing you learned today.',
      '[Observe] Skim peers’ updates for motivation (no need to post).',
      '[Quiet Co-work] Study alongside others without interaction.',
      '[Mirror] Compare notes with someone briefly.',
      '[Ambient Social] Put on low-volume background chatter.',
      '[One Ping] Send a single message about progress, then return to work.'
    ],
    low: [
      '[Quiet Focus] Find a silent spot and study for 10 minutes.',
      '[Calm Intake] Read or take notes instead of talking.',
      '[Solo Task] Finish a small chunk entirely on your own—no social pressure.',
      '[Offline Mode] Turn off messaging apps while studying.',
      '[Private Rehearsal] Think through explanations silently.',
      '[Written Only] Express understanding only through writing.',
      '[Minimal Exposure] Study where no one can interrupt you.'
    ]
  },

  A: {
    high: [
      '[Warm Start] Begin with a line of encouragement to yourself.',
      '[Buddy Assist] Help someone understand a concept.',
      '[Co-work] Pick a light task that needs a bit of interaction.',
      '[Support Role] Offer to review someone’s work.',
      '[Gratitude Note] Thank yourself or someone else for effort.',
      '[Shared Goal] Set a small joint study goal.',
      '[Kind Lens] Reframe mistakes as learning signals.'
    ],
    neutral: [
      '[Comfort] Do a learning task you feel good about.',
      '[Reflect] Note one small difficulty today and a one-line solution.',
      '[Swap] Exchange a brief summary with one person (anonymous is fine).',
      '[Fair Deal] Balance your needs with task requirements.',
      '[Neutral Review] Assess work without praise or criticism.',
      '[Gentle Check-in] Ask: “What would help most right now?”'
    ],
    low: [
      '[Target] Finish a clear, small goal.',
      '[Efficiency] Skip interaction and go straight to the task.',
      '[Minimal Words] Summarize with as few words as possible.',
      '[Boundary] Say no to extra requests during study.',
      '[Direct Fix] Identify one flaw and correct it.',
      '[Self-First] Prioritize your task over helping others.',
      '[Clean Cut] Stop when the goal is met—no extras.'
    ]
  },

  C: {
    high: [
      '[Execute] Do the most important item on your plan.',
      '[Organize] Make a list of what you learned today.',
      '[Timer] Set a 20-minute focus timer.',
      '[Checklist] Convert the task into checkboxes.',
      '[Standardize] Use a proven method you trust.',
      '[Milestone] Define a clear “done” condition.',
      '[Optimize] Remove one inefficiency from your workflow.'
    ],
    neutral: [
      '[Light Plan] Write 3 optional tasks; complete just one.',
      '[Rhythm] Do a 10-minute short study sprint.',
      '[Easy Start] Begin with the task you find easiest to start.',
      '[Soft Structure] Outline without filling details.',
      '[Time Box] Work until the timer ends, then stop.',
      '[Progress Mark] Note what is partially complete.'
    ],
    low: [
      '[Curious Bite] Study anything interesting for 3 minutes.',
      '[Free Pass] Finish one ultra-easy subtask and call it done.',
      '[Play Mode] Treat a small knowledge task like a game.',
      '[Messy Draft] Allow work to be incomplete or rough.',
      '[One Step] Do only the next visible action.',
      '[Permission Slip] Accept lower-than-usual standards.',
      '[Reset] Clean your workspace for 2 minutes, then stop.'
    ]
  },

  N: {
    high: [
      '[Easy Win] Do a micro-task you feel zero stress about.',
      '[Settle] Rest 1 minute, then begin.',
      '[Decompress] Start from the simplest part—no perfection needed.',
      '[Safety First] Choose a task with no consequences.',
      '[Reassure] Write one sentence: “It’s okay to go slow.”',
      '[Familiar Zone] Use a topic you already know well.',
      '[Grounding] Name 3 things you can see before starting.'
    ],
    neutral: [
      '[Steady Pace] Work 5 minutes, pause 1 minute.',
      '[Just Right] Choose something not too hard, not too easy.',
      '[Calm Breath] Take three deep breaths before starting.',
      '[Predictable] Follow a routine task.',
      '[Contain] Limit work to a small, defined scope.',
      '[Emotion Check] Rate stress before and after.'
    ],
    low: [
      '[Challenge] Pick a slightly harder task.',
      '[Advance] Tackle the trickiest task early.',
      '[Sustain] Try 15 minutes of uninterrupted study.',
      '[Stretch] Do something mildly uncomfortable on purpose.',
      '[Proof] Collect evidence you can handle difficulty.',
      '[Exposure] Stay with confusion for 2 minutes.',
      '[Confidence Build] Finish a task that once felt hard.'
    ]
  },

  O: {
    high: [
      '[Explore] Try a new topic or tool.',
      '[Creative Map] Turn today’s learning into a sketch/mind map.',
      '[Switch Mode] Learn the same content in a totally new way.',
      '[Cross-Link] Connect this topic to an unrelated field.',
      '[What If] Ask one unconventional question.',
      '[Invent] Create your own example or analogy.',
      '[Playful Format] Use diagrams, colors, or symbols.'
    ],
    neutral: [
      '[Micro-Explore] Add a small twist to routine work (new spot, new order).',
      '[Light Remix] Write one sentence in your own words about a new insight.',
      '[Tiny New] Watch/read something new for under 3 minutes.',
      '[Perspective Shift] Rephrase the idea for a different audience.',
      '[Option B] Try an alternative method briefly.',
      '[Curiosity Note] Write one thing you don’t understand yet.'
    ],
    low: [
      '[Reinforce] Review a foundation you already know.',
      '[Structure] Follow a fixed sequence (A→B→C).',
      '[Stay Consistent] Don’t change the method—just finish the set task.',
      '[Repeat] Re-do a familiar exercise.',
      '[Template] Use an existing framework exactly as given.',
      '[Anchor] Stick to facts, not interpretations.',
      '[Close Loop] Finish something already started.'
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
