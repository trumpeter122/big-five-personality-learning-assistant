import { useEffect, useMemo, useState } from 'react';
import zhQuestions from '../docs/packages/questions/src/data/zh-cn/questions';
import zhChoices from '../docs/packages/questions/src/data/zh-cn/choices';
import enQuestions from '../docs/packages/questions/src/data/en/questions';
import enChoices from '../docs/packages/questions/src/data/en/choices';
import { processAnswers } from '../docs/packages/score/src/index.ts';
import templateEn from '../docs/packages/results/src/data/en';
import './App.css';

const QUESTIONS_PER_PAGE = 8;

const traitLabels = {
  O: { zh: '开放性', en: 'Openness', tone: '创意探索' },
  C: { zh: '尽责性', en: 'Conscientiousness', tone: '计划执行' },
  E: { zh: '外向性', en: 'Extraversion', tone: '社交驱动' },
  A: { zh: '宜人性', en: 'Agreeableness', tone: '合作共情' },
  N: { zh: '神经质', en: 'Neuroticism', tone: '情绪波动' }
};

const learningPlaybook = {
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

const levelText = {
  high: '偏高',
  neutral: '中等',
  low: '偏低'
};

function buildQuestions(language) {
  const data =
    language === 'zh-cn'
      ? { questions: zhQuestions, choices: zhChoices }
      : { questions: enQuestions, choices: enChoices };

  return data.questions.map((question, index) => ({
    ...question,
    num: index + 1,
    choices: data.choices[question.keyed]
  }));
}

function mapScoresToResults(scores) {
  return Object.keys(scores).map((key) => {
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
  }).filter(Boolean);
}

function App() {
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('idle'); // idle | test | manual | done
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [manualScores, setManualScores] = useState({ O: 3, C: 3, E: 3, A: 3, N: 3 });
  const [report, setReport] = useState(null);
  const [language] = useState('zh-cn');

  const questions = useMemo(() => buildQuestions(language), [language]);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setAnswers({});
    setReport(null);
    setPage(0);
  }, [language]);

  const currentQuestions = useMemo(() => {
    const start = page * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  }, [page, questions]);

  const handleSelect = (question, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { domain: question.domain, facet: question.facet, score: choice.score }
    }));
  };

  const handleSubmitTest = () => {
    const formatted = Object.entries(answers).map(([, value]) => value);
    const scores = processAnswers(formatted);
    const generated = mapScoresToResults(scores);
    setReport({ scores, generated });
    setMode('done');
  };

  const handleManualSubmit = () => {
    const manual = Object.entries(manualScores).map(([domain, score]) => ({
      domain,
      score: Number(score)
    }));
    const scores = processAnswers(manual);
    const generated = mapScoresToResults(scores);
    setReport({ scores, generated });
    setMode('done');
  };

  const resetTest = (nextMode = 'test') => {
    setAnswers({});
    setReport(null);
    setPage(0);
    setMode(nextMode);
  };

  const canSubmit = answeredCount === questions.length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">人格学习助手</p>
          <h1>「人格适配」学习策略引擎</h1>
          <p className="subtitle">
            基于 Big Five（120 题）与学习风格适配理论，快速生成与你气质吻合的学习路线。
          </p>
        </div>
        <div className="header-actions">
          <button className="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '切换暗色' : '切换亮色'}
          </button>
          <div className="pill accent">Mediterranean · 极简</div>
        </div>
      </header>

      <section className="card hero">
        <div>
          <div className="badge-row">
            <span className="pill soft">严谨测评 · Johnson IPIP NEO-PI-R</span>
            <span className="pill soft">学习风格适配</span>
            <span className="pill soft">多端响应</span>
          </div>
          <p className="hero-text">
            完成官方 120 题人格测试，或直接输入你熟悉的 Big Five 轮廓。系统将基于人格高低分，映射专属学习节奏、协作方式与复习仪式。
          </p>
          <div className="cta-row">
            <button className="primary" onClick={() => resetTest('test')}>
              开始严谨人格测试
            </button>
            <button className="ghost" onClick={() => resetTest('manual')}>
              我已知人格，直接输入
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <p className="label">题量</p>
            <p className="value">120</p>
            <p className="hint">Johnson 版 IPIP · 双向计分</p>
          </div>
          <div className="stat">
            <p className="label">耗时</p>
            <p className="value">≈10 分钟</p>
            <p className="hint">8 题/屏，随时暂停</p>
          </div>
          <div className="stat">
            <p className="label">输出</p>
            <p className="value">人格报告 & 学习策略</p>
            <p className="hint">大五维度 × 学习风格适配</p>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">人格测试</p>
              <h2>{mode === 'manual' ? '输入已知人格' : 'Big Five 120 题问卷'}</h2>
            </div>
            {mode === 'test' && (
              <div className="progress">
                <span>完成 {answeredCount}/{questions.length}</span>
                <div className="progress-bar">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {mode === 'manual' && (
            <div className="manual-grid">
              {Object.entries(traitLabels).map(([key, meta]) => (
                <div key={key} className="manual-card">
                  <div className="manual-head">
                    <div className="pill muted">{meta.zh}</div>
                    <span className="score">{manualScores[key]}</span>
                  </div>
                  <p className="tone">{meta.en} · {meta.tone}</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={manualScores[key]}
                    onChange={(e) =>
                      setManualScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                  />
                  <p className="hint">1=低特质，5=高特质。基于你的自评或已有测评结果。</p>
                </div>
              ))}
              <div className="manual-actions">
                <button className="ghost" onClick={() => resetTest('test')}>改为答题</button>
                <button className="primary" onClick={handleManualSubmit}>生成学习策略</button>
              </div>
            </div>
          )}

          {mode === 'test' && (
            <>
              <div className="question-list">
                {currentQuestions.map((question) => {
                  const selected = answers[question.id]?.score;
                  return (
                    <div key={question.id} className="question-card">
                      <div className="question-meta">
                        <span className="pill muted">Q{question.num}</span>
                        <span className="pill muted">{traitLabels[question.domain].zh}</span>
                      </div>
                      <p className="question-text">{question.text}</p>
                      <div className="choices">
                        {question.choices.map((choice, index) => (
                          <button
                            key={choice.text + index}
                            className={`choice ${selected === choice.score ? 'active' : ''}`}
                            onClick={() => handleSelect(question, choice)}
                          >
                            {choice.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="panel-actions">
                <div className="nav">
                  <button className="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    上一组
                  </button>
                  <button
                    className="ghost"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    下一组
                  </button>
                </div>
                <div className="panel-cta">
                  <button className="ghost" onClick={() => setMode('manual')}>
                    我已知人格，直接输入
                  </button>
                  <button className="primary" disabled={!canSubmit} onClick={handleSubmitTest}>
                    生成报告
                  </button>
                </div>
              </div>
              {!canSubmit && (
                <p className="hint align-right">需完成全部 120 题以保持严谨性。</p>
              )}
            </>
          )}

          {mode === 'idle' && (
            <div className="idle">
              <p>选择「开始严谨人格测试」或「直接输入」以生成策略。</p>
            </div>
          )}
        </div>

        <div className="card panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">学习策略与人格反馈</p>
              <h2>个性化建议</h2>
            </div>
            {report && <div className="pill accent">已生成</div>}
          </div>

          {!report && (
            <div className="placeholder">
              <p>等待生成报告…</p>
              <p className="hint">完成问卷或提交自评后，将自动推送学习策略。</p>
            </div>
          )}

          {report && (
            <div className="result-grid">
              {report.generated.map((item) => {
                const level = report.scores[item.domain]?.result || 'neutral';
                const strategies = learningPlaybook[item.domain]?.[level] || [];
                return (
                  <div key={item.domain} className="result-card">
                    <div className="result-head">
                      <div className="pill muted">{traitLabels[item.domain].zh}</div>
                      <div className={`level ${level}`}>{levelText[level]}</div>
                    </div>
                    <p className="result-title">{item.title}</p>
                    <p className="result-text" dangerouslySetInnerHTML={{ __html: item.scoreText || '' }} />
                    {item.facets?.length > 0 && (
                      <div className="facets">
                        {item.facets.slice(0, 2).map((facet) => (
                          <span key={facet.facet} className="facet-pill">
                            {facet.title}: {facet.scoreText || facet.result}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="strategy">
                      <p className="label">学习策略</p>
                      <ul>
                        {strategies.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
