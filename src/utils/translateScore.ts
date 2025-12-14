const replacements: { en: string; zh: string }[] = [
  { en: 'Your score on Openness to Experience is high', zh: '你的开放性得分较高' },
  { en: 'Your score on Openness to Experience is low', zh: '你的开放性得分较低' },
  { en: 'Your score on Openness to Experience is average', zh: '你的开放性得分中等' },
  { en: 'Your score on Conscientiousness is high', zh: '你的尽责性得分较高' },
  { en: 'Your score on Conscientiousness is low', zh: '你的尽责性得分较低' },
  { en: 'Your score on Conscientiousness is average', zh: '你的尽责性得分中等' },
  { en: 'Your score on Extraversion is high', zh: '你的外向性得分较高' },
  { en: 'Your score on Extraversion is low', zh: '你的外向性得分较低' },
  { en: 'Your score on Extraversion is average', zh: '你的外向性得分中等' },
  { en: 'Your score on Agreeableness is high', zh: '你的宜人性得分较高' },
  { en: 'Your score on Agreeableness is low', zh: '你的宜人性得分较低' },
  { en: 'Your score on Agreeableness is average', zh: '你的宜人性得分中等' },
  { en: 'Your score on Neuroticism is high', zh: '你的神经质得分较高' },
  { en: 'Your score on Neuroticism is low', zh: '你的神经质得分较低' },
  { en: 'Your score on Neuroticism is average', zh: '你的神经质得分中等' }
];

export function translateScoreText(text: string, lang: string): string {
  if (lang === 'en') return text;
  let translated = text;
  replacements.forEach(({ en, zh }) => {
    translated = translated.replace(en, zh);
  });
  return translated;
}
