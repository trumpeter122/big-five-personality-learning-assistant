import { useAssessment } from '../context/AssessmentContext';

type AboutContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPills: string[];
  heroStats: { label: string; value: string; hint: string }[];
  pillarsTitle: string;
  pillarsHint: string;
  pillars: { title: string; body: string }[];
  guidelinesTitle: string;
  guidelinesHint: string;
  guidelines: { title: string; detail: string }[];
  traitsTitle: string;
  traitsHint: string;
  traits: { key: string; name: string; summary: string; high: string; low: string }[];
  note: string;
};

const aboutContent: Record<'en' | 'zh', AboutContent> = {
  en: {
    heroBadge: 'Theory overview',
    heroTitle: 'Where the Big Five came from',
    heroSubtitle:
      'The Five-Factor Model grew out of the lexical hypothesis: important personality differences become common words. Factor analyses of those descriptors consistently revealed five broad dimensions.',
    heroPills: ['Lexical hypothesis', 'Factor-analytic evidence', 'Continuum, not types'],
    heroStats: [
      {
        label: 'Core idea',
        value: 'Language encodes traits',
        hint: 'Galton (1884) to Allport & Odbert (1936) cataloged thousands of adjectives, assuming key traits live in everyday words.'
      },
      {
        label: 'Evidence base',
        value: 'Factor analysis across data',
        hint: 'Tupes & Christal (1958/61), Norman (1963), Digman (1980s), and Costa & McCrae (1992) all converged on five factors.'
      },
      {
        label: 'What a trait means',
        value: 'Positions on continua',
        hint: 'Everyone sits somewhere on each dimension; facets add nuance beyond a single high/low tag.'
      }
    ],
    pillarsTitle: 'Conceptual pillars of the Big Five',
    pillarsHint: 'Why five traits keep showing up in research.',
    pillars: [
      {
        title: 'Lexical roots',
        body: 'Start with the words people use. Allport & Odbert turned dictionaries into 4,504 trait adjectives; later lists replicate across languages.'
      },
      {
        title: 'Trait continua',
        body: 'Extraversion, Agreeableness, Conscientiousness, Neuroticism, and Openness sit on spectrums—no “types,” just positions.'
      },
      {
        title: 'Independent factors',
        body: 'Factor analyses show the five dimensions are largely orthogonal, giving you a nuanced profile rather than one label.'
      },
      {
        title: 'Cross-language replication',
        body: 'The same five clusters emerge in English, Dutch, German, and more, supporting a universal structure with local nuance.'
      }
    ],
    guidelinesTitle: 'History in brief',
    guidelinesHint: "From early lexical lists to today's Five-Factor Model.",
    guidelines: [
      {
        title: '1884 · Galton',
        detail: 'Proposed mining language to build a taxonomy of personality—first articulation of the lexical hypothesis.'
      },
      {
        title: '1936 · Allport & Odbert',
        detail: 'Cataloged 4,504 trait adjectives from dictionaries, creating a foundation dataset for later factor analyses.'
      },
      {
        title: '1940s–1950s · Cattell, Fiske',
        detail: 'Reduced the list to 16 clusters (16PF) and then observed five higher-order factors in peer ratings.'
      },
      {
        title: '1958/61 · Tupes & Christal',
        detail: 'Analyzed Air Force peer ratings; consistently found five dimensions (Surgency, Agreeableness, Dependability, Emotional Stability, Culture).'
      },
      {
        title: '1963 · Norman',
        detail: 'Replicated five factors and relabeled them; later work with Goldberg shaped the modern OCEAN names.'
      },
      {
        title: '1980s–1992 · Digman; Costa & McCrae',
        detail: 'Synthesized prior evidence; the NEO model grew into the Five-Factor Model (NEO PI-R) widely used today.'
      },
      {
        title: '1990s · International Personality Item Pool',
        detail: 'Community-built, multilingual item bank (Goldberg, Hofstee) that keeps the model open and comparable across studies.'
      }
    ],
    traitsTitle: 'The five domains at a glance',
    traitsHint: 'Each domain is a continuum with shared sub-facets across cultures.',
    traits: [
      {
        key: 'O',
        name: 'Openness',
        summary: 'Curiosity, pattern-finding, imagination, comfort with ideas and aesthetics.',
        high: 'Seeks novelty and complexity, plays with metaphors and abstract links.',
        low: 'Prefers tried-and-true methods, favors clarity, tradition, and proof.'
      },
      {
        key: 'C',
        name: 'Conscientiousness',
        summary: 'Goal-directed self-regulation, planning, reliability, impulse control.',
        high: 'Structured, disciplined, values order and steady progress.',
        low: 'Flexible and adaptive, may avoid rigid plans or defer structure.'
      },
      {
        key: 'E',
        name: 'Extraversion',
        summary: 'Energy from engagement, assertiveness, sociability, reward sensitivity.',
        high: 'Energized by people and momentum, assertive and talk-to-think.',
        low: 'Recovers energy alone, deliberate pace, processes internally before sharing.'
      },
      {
        key: 'A',
        name: 'Agreeableness',
        summary: 'Cooperation style, empathy, trust, and preferred conflict posture.',
        high: "Warm, collaborative, optimistic about others' intentions.",
        low: "Direct, comfortable with debate, guarded about others' motives."
      },
      {
        key: 'N',
        name: 'Neuroticism',
        summary: 'Sensitivity to stress, threat detection, and negative affect.',
        high: 'Vigilant, reactive to risk or uncertainty, emotions rise and fall quickly.',
        low: 'Even-keeled under pressure, slow to ruminate, returns to baseline fast.'
      }
    ],
    note: 'Built from the lexical hypothesis and factor analyses: five broad domains that replicate across languages, with facets adding nuance.'
  },
  zh: {
    heroBadge: '理论背景',
    heroTitle: '大五人格是如何形成的',
    heroSubtitle:
      '五因素模型源自词汇假设：重要的性格差异会沉淀成日常用语。对这些描述做因子分析，跨多种语言都能看到五个稳定维度。',
    heroPills: ['词汇假设', '因子分析证据', '连续刻度而非类型'],
    heroStats: [
      {
        label: '核心思想',
        value: '语言承载特质',
        hint: '从 Galton（1884）到 Allport & Odbert（1936）整理出数千形容词，假设关键特质藏在日常词汇里。'
      },
      {
        label: '证据来源',
        value: '跨数据的因子分析',
        hint: 'Tupes & Christal（1958/61）、Norman（1963）、Digman（1980s）、Costa & McCrae（1992）都收敛到五个维度。'
      },
      {
        label: '维度含义',
        value: '连续刻度而非标签',
        hint: '每个人在五个维度上都有位置；分面让画像更细，而不是单纯的高/低标签。'
      }
    ],
    pillarsTitle: '大五模型的理论基石',
    pillarsHint: '为什么五个维度会反复出现。',
    pillars: [
      {
        title: '词汇起点',
        body: '从日常词汇出发。Allport & Odbert 把词典转成 4504 个特质形容词，其他语言也能得到类似清单。'
      },
      {
        title: '连续维度',
        body: '外向、宜人、责任、神经质、开放性都是刻度，不是“类型”；高低是倾向，而非好坏。'
      },
      {
        title: '相对独立',
        body: '各维度大体正交。一个维度高并不强迫另一维度呈现特定模式，因此画像保持细腻。'
      },
      {
        title: '跨语言复现',
        body: '无论英语、荷兰语、德语等研究，因子分析都能得到相似的五个簇，兼顾普遍结构与本地差异。'
      }
    ],
    guidelinesTitle: '简史',
    guidelinesHint: '从早期词汇整理到今天的五因素模型。',
    guidelines: [
      {
        title: '1884 · Galton',
        detail: '提出用语言挖掘人格分类——词汇假设的最早表述。'
      },
      {
        title: '1936 · Allport & Odbert',
        detail: '从词典整理出 4504 个特质形容词，成为后续因子分析的数据基础。'
      },
      {
        title: '1940s–1950s · Cattell, Fiske',
        detail: '将清单缩减并提出 16 个因子（16PF），在同侪评分里又观察到五个更高阶因子。'
      },
      {
        title: '1958/61 · Tupes & Christal',
        detail: '分析空军军官的同侪评分，反复得到五个维度（Surgency、Agreeableness、Dependability、Emotional Stability、Culture）。'
      },
      {
        title: '1963 · Norman',
        detail: '复制五因素并改名，随后与 Goldberg 的工作奠定了 OCEAN 的现代命名。'
      },
      {
        title: '1980s–1992 · Digman；Costa & McCrae',
        detail: '综合既有研究，NEO 模型扩展成五因素模型（NEO PI-R），成为当下主流命名。'
      },
      {
        title: '1990s · 国际人格题库',
        detail: 'Goldberg、Hofstee 等建立开放多语题库（IPIP），让研究与应用更可比。'
      }
    ],
    traitsTitle: '五个维度一览',
    traitsHint: '每个维度是连续刻度，并有跨文化共通的分面。',
    traits: [
      {
        key: 'O',
        name: '开放性',
        summary: '好奇心、模式感知、想象力，对概念和审美的舒适度。',
        high: '喜欢新鲜和复杂，乐于用隐喻连接概念。',
        low: '偏好已有方法与清晰结构，重视传统与验证。'
      },
      {
        key: 'C',
        name: '责任心',
        summary: '自我调节、计划性、可靠性与冲动控制。',
        high: '条理清晰，重视秩序与稳步达成。',
        low: '机动灵活，可能推迟或淡化固定结构。'
      },
      {
        key: 'E',
        name: '外向性',
        summary: '能量来源、表达性、社交活力与对奖赏的敏感度。',
        high: '被人和节奏激活，表达直接，常边说边想。',
        low: '需要独处恢复，节奏沉稳，先内化再表达。'
      },
      {
        key: 'A',
        name: '宜人性',
        summary: '合作风格、共情、信任与冲突取向。',
        high: '温暖协作，乐观看待他人动机。',
        low: '直接辩证，设防心较高，习惯先验证再信任。'
      },
      {
        key: 'N',
        name: '情绪稳定性（神经质）',
        summary: '对压力、威胁与负性情绪的敏感度。',
        high: '对风险敏感，遇到不确定时情绪起伏更快。',
        low: '在压力下相对平稳，少纠结，恢复较快。'
      }
    ],
    note: '基于词汇假设与因子分析的积累：五个跨语言复现的广义维度，分面让画像更细腻。'
  }
};

function AboutPage() {
  const { uiLanguage } = useAssessment();
  const lang: 'en' | 'zh' = uiLanguage.startsWith('zh') ? 'zh' : 'en';
  const c = aboutContent[lang];
  const modelLabel = lang === 'zh' ? '大五模型' : 'Five-Factor Model';
  const interpretationLabel = lang === 'zh' ? '解读指南' : 'Interpretation';
  const highLabel = lang === 'zh' ? '高分' : 'High';
  const lowLabel = lang === 'zh' ? '低分' : 'Low';

  return (
    <>
      <section className="card hero">
        <div>
          <p className="eyebrow">{c.heroBadge}</p>
          <h2>{c.heroTitle}</h2>
          <div className="badge-row">
            {c.heroPills.map((pill) => (
              <span key={pill} className="pill soft">
                {pill}
              </span>
            ))}
          </div>
          <p className="hero-text">{c.heroSubtitle}</p>
        </div>
        <div className="hero-stats">
          {c.heroStats.map((stat) => (
            <div key={stat.label} className="stat">
              <p className="label">{stat.label}</p>
              <p className="value">{stat.value}</p>
              <p className="hint">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{modelLabel}</p>
            <h2>{c.pillarsTitle}</h2>
            <p className="hint">{c.pillarsHint}</p>
          </div>
        </div>
        <div className="result-grid">
          {c.pillars.map((pillar) => (
            <div key={pillar.title} className="result-card">
              <p className="result-title">{pillar.title}</p>
              <p className="result-text">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{interpretationLabel}</p>
            <h2>{c.guidelinesTitle}</h2>
            <p className="hint">{c.guidelinesHint}</p>
          </div>
        </div>
        <div className="question-list">
          {c.guidelines.map((item, idx) => (
            <div key={item.title} className="question-card">
              <p className="question-text">
                {idx + 1}) {item.title}
              </p>
              <p className="hint">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{c.traitsTitle}</p>
            <h2>{c.traitsHint}</h2>
          </div>
          <p className="hint align-right about-note">{c.note}</p>
        </div>
        <div className="result-grid">
          {c.traits.map((trait) => (
            <div key={trait.key} className="result-card trait-card">
              <div className="result-head">
                <div className="pill muted">{trait.key}</div>
                <p className="tone">{trait.name}</p>
              </div>
              <p className="result-title">{trait.summary}</p>
              <div className="trait-line">
                <span className="trait-label">{highLabel}</span>
                <p className="hint">{trait.high}</p>
              </div>
              <div className="trait-line">
                <span className="trait-label">{lowLabel}</span>
                <p className="hint">{trait.low}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
