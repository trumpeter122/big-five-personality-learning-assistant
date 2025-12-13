import templateEn from '../docs/packages/results/src/data/en';
import languages from '../docs/packages/questions/src/data/languages';

const questionModules = import.meta.glob('../docs/packages/questions/src/data/*/questions.ts', { eager: true });
const choiceModules = import.meta.glob('../docs/packages/questions/src/data/*/choices.ts', { eager: true });

const questionBank = Object.entries(questionModules).reduce((acc, [path, mod]) => {
  const code = path.split('/data/')[1].split('/')[0];
  acc[code] = mod.default;
  return acc;
}, {});

const choiceBank = Object.entries(choiceModules).reduce((acc, [path, mod]) => {
  const code = path.split('/data/')[1].split('/')[0];
  acc[code] = mod.default;
  return acc;
}, {});

export const traitLabels = {
  O: { zh: '开放性', en: 'Openness', tone: '创意探索', icon: 'O' },
  C: { zh: '尽责性', en: 'Conscientiousness', tone: '计划执行', icon: 'C' },
  E: { zh: '外向性', en: 'Extraversion', tone: '社交驱动', icon: 'E' },
  A: { zh: '宜人性', en: 'Agreeableness', tone: '合作共情', icon: 'A' },
  N: { zh: '神经质', en: 'Neuroticism', tone: '情绪波动', icon: 'N' }
};

export const learningPlaybook = {
  O: {
    high: [
      '穿插跨学科案例/类比，让课程保持新鲜感；用碎片时间记下灵感并快速验证。',
      '将学习产出做成「作品集」或创意小实验，用展示驱动自我激励。'
    ],
    neutral: [
      '每周留一小时做探索阅读，其余时间用固定模板总结，保持好奇但不跑题。',
      '把新知识映射到旧框架中，确保创意与扎实理解并行。'
    ],
    low: [
      '以结构化教材为主，搭配关键例题，减少信息过载带来的焦虑。',
      '采用“先复刻再微调”模式，先掌握范式，再逐步尝试小幅创新。'
    ]
  },
  C: {
    high: [
      '用番茄钟和里程碑拆解任务；建立每日收尾复盘，量化进度与质量。',
      '把复杂任务前置预演（mock run），减少执行日的认知负担。'
    ],
    neutral: [
      '用 3 项待办+时间盒的轻量计划，留 20% 缓冲避免挫败感。',
      '为关键任务设置「启动动作」（如打开大纲、写标题），降低开始门槛。'
    ],
    low: [
      '采用 15-20 分钟的微目标冲刺，完成后立即奖励自己，建立正反馈。',
      '寻找同伴或教练做周度检查，用外部责任感弥补自驱。'
    ]
  },
  E: {
    high: [
      '优先选择讨论式或群体学习，讲解他人即巩固自我；设置每周一次迷你分享会。',
      '在通勤/运动时听播客或语音笔记，利用社交能量驱动输入。'
    ],
    neutral: [
      '单人深度学习与短暂群讨论 2:1 搭配，既保留节奏又避免社交消耗。',
      '把问题写成 3 分钟语音向同伴请教，快速获得反馈。'
    ],
    low: [
      '以异步学习为主：写作、做笔记、录屏讲解，减少即刻社交压力。',
      '预约固定「安静块」，远离即时通讯，保持可控的节奏感。'
    ]
  },
  A: {
    high: [
      '用「同伴助教」模式——主动答疑或互批，社交互惠能增强记忆。',
      '在团队项目中做协调/整合角色，利用共情力提升合作效率。'
    ],
    neutral: [
      '为反馈制定小清单（期望、截止时间、格式），平衡友好与清晰界限。',
      '交替进行独立工作与配对复盘，既保持效率又获取支持。'
    ],
    low: [
      '设置讨论守则与时间盒，避免争论失控；用事实表和例子支撑观点。',
      '选择可量化目标的任务，弱化人际摩擦对专注的影响。'
    ]
  },
  N: {
    high: [
      '先完成「最小可行」版本再迭代，减少完美主义带来的拖延。',
      '建立情绪缓冲区：学习前 5 分钟呼吸/拉伸，任务间短暂散步清理压力。'
    ],
    neutral: [
      '保持稳定节奏与睡眠，定期记录情绪与表现，识别触发点及时调整。',
      '遇到卡点先写下 3 个可行动步，避免情绪化放大问题。'
    ],
    low: [
      '利用稳定情绪承担高压或截止紧的任务，为团队提供“压舱石”。',
      '刻意加入挑战情境（定时小测验），防止过度舒适导致的松散。'
    ]
  }
};

export const levelText = {
  high: '偏高',
  neutral: '中等',
  low: '偏低'
};

export const languageOptions = languages;
export const questionLanguages = Object.keys(questionBank);

export function buildQuestions(language) {
  const questions = questionBank[language] || questionBank['en'];
  const choices = choiceBank[language] || choiceBank['en'];

  return questions.map((question, index) => ({
    ...question,
    num: index + 1,
    choices: choices[question.keyed]
  }));
}

export function mapScoresToResults(scores) {
  return Object.keys(scores)
    .map((key) => {
      const domainTemplate = templateEn.find((template) => template.domain === key);
      if (!domainTemplate) return null;

      const { result, count, score } = scores[key];
      const resultText = domainTemplate.results.find((item) => item.score === result)?.text;

      const facets = domainTemplate.facets
        .map((facet) => {
          const facetScore = scores[key].facet?.[facet.facet];
          if (!facetScore) return null;
          return {
            facet: facet.facet,
            title: facet.title,
            text: facet.text,
            score: facetScore.score,
            count: facetScore.count,
            scoreText: facetScore.result
          };
        })
        .filter(Boolean);

      return {
        domain: domainTemplate.domain,
        title: domainTemplate.title,
        shortDescription: domainTemplate.shortDescription,
        description: domainTemplate.description,
        scoreText: resultText,
        count,
        score,
        facets
      };
    })
    .filter(Boolean);
}
