const studyCardsZh = {
  E: {
    high: [
      '【社交动力卡】参加一个线上/线下学习小组，加速学习动力',
      '【能量激活卡】学习前和他人短聊 1 分钟，会更进入状态',
      '【表达任务卡】用口头讲一讲今天学到的东西'
    ],
    neutral: [
      '【平衡卡】尝试独立学习 20 分钟，再进行 5 分钟社交式复盘',
      '【轻社交卡】给朋友分享一个你今天学到的知识点',
      '【互动观察卡】浏览同伴的学习进度增强动力（自己不用发言）'
    ],
    low: [
      '【深度专注卡】找一个安静空间学习 10 分钟',
      '【安静吸收卡】用阅读/记笔记方式完成任务',
      '【单人任务卡】完全独立完成一小段内容，无社交压力'
    ]
  },
  A: {
    high: [
      '【温暖任务卡】给自己一句鼓励的话作为学习开始',
      '【伙伴支持卡】帮助别人解释一个知识点',
      '【合作卡】选择一个需要一点互动的轻任务'
    ],
    neutral: [
      '【平和卡】做一个你自己觉得舒服的学习任务',
      '【理解卡】反思今天学习中一个小困难并写一句解决策略',
      '【适度合作卡】与一人交换学习总结（可匿名）'
    ],
    low: [
      '【目标卡】专注完成一个明确的小目标',
      '【效率卡】不和任何人互动，直奔主题完成任务',
      '【硬核卡】学习过程中，用最少话语表达总结（越简洁越好）'
    ]
  },
  C: {
    high: [
      '【计划执行卡】完成计划表上最重要的任务',
      '【条理卡】整理今天学习内容的清单',
      '【坚持卡】设一个 20 分钟专注计时器'
    ],
    neutral: [
      '【轻规划卡】写下今天 3 个可选任务，完成其中 1 个即可',
      '【节奏卡】完成 10 分钟短学习',
      '【灵活卡】选择一个你觉得最容易达成的任务开始'
    ],
    low: [
      '【随心挑战卡】学习 3 分钟任意你感兴趣的内容',
      '【自由卡】今天只要完成一个超简单的小点就算完成',
      '【放松学习卡】以玩耍心态完成一个轻量知识任务'
    ]
  },
  N: {
    high: [
      '【轻松卡】完成一个你完全不紧张的微任务',
      '【安稳卡】休息 1 分钟再开始学习',
      '【减压卡】从最简单的部分学起，不要求完美'
    ],
    neutral: [
      '【节奏稳定卡】做 5 分钟任务，停 1 分钟',
      '【适度压力卡】选择一个不太难也不太简单的内容',
      '【情绪观察卡】学习前深呼吸三次再开始'
    ],
    low: [
      '【挑战卡】选择一个难度稍高的任务',
      '【推进卡】把今天最麻烦的任务提前解决',
      '【持续卡】尝试 15 分钟不间断学习'
    ]
  },
  O: {
    high: [
      '【探索卡】尝试一个新知识或新工具',
      '【创意卡】把今天学的内容用图/脑图表达',
      '【跳跃卡】换一种全新方式学习同一内容'
    ],
    neutral: [
      '【微探索卡】在固定内容中加入一点变化（如换学习地点）',
      '【轻创意卡】写一句用自己话描述的新理解',
      '【稳中求新卡】看一个不超过 3 分钟的新内容'
    ],
    low: [
      '【稳固卡】复习一个你已学过的基础知识',
      '【结构卡】按固定步骤完成学习（A→B→C）',
      '【常规卡】不要改变方式，完成既定任务即可'
    ]
  }
};

const studyCardsEn = {
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

export const studyCards = studyCardsZh;

export function getStudyCards(uiLanguage) {
  if (typeof uiLanguage === 'string' && uiLanguage.toLowerCase().startsWith('en')) {
    return studyCardsEn;
  }
  return studyCardsZh;
}
