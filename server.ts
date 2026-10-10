import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const cleanAndParseJson = (text: string) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
};

const generateWithModelFallback = async (ai: any, params: any) => {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        ...params,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next. Error:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('Tüm AI modelleri meşgul, lütfen tekrar deneyin.');
};

// API: Generate Interview Questions tailored to interviewer title & candidate position
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const { interviewerTitle, targetRole, companyType, experienceLevel, additionalContext } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({ error: 'Görüşmeci unvanı ve hedeflenen rol zorunludur.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Sen dünya çapında tecrübeye sahip üst düzey bir Yönetici Mülakat Koçu (Executive Interview & Career Coach) ve Teknik İşe Alım Stratejistisin.
Görevin: Kullanıcının belirteceği görüşmeci unvanına (Örn: Engineering Manager, Head of Product, HR/İK Direktörü, CTO, Lead Data Scientist, CMO vb.) ve hedeflenen pozisyona göre derinlemesine, gerçekçi ve bu görüşmecinin spesifik zihniyetini (mindset) yansıtan mülakat soruları ve stratejileri üretmektir.

Görüşmecinin unvanına göre psikolojisi ve öncelikleri değişir:
- Örneğin bir HR/İK yöneticisi kültür uyumu, çatışma yönetimi, sadakat ve davranışsal STAR sorularına odaklanır.
- Bir Engineering Manager teslimat riski, kod kalitesi, ekip mentörlüğü, teknik borç ve mimari tercihlere odaklanır.
- Bir CTO yüksek seviye sistem vizyonu, teknoloji seçimi, ölçeklenebilirlik, maliyet optimizasyonu ve iş değeri odaklıdır.
- Bir Product Lead kullanıcı empatisi, metrikler, MVP stratejisi ve mühendislik-ürün işbirliğine bakar.

Çıktını MUTLAKA saf JSON formatında döndür. Hiçbir ekstra markdown veya açıklama yazma.
Döndürmen gereken JSON yapısı:
{
  "interviewerProfile": {
    "personaTitle": string,
    "mindsetSummary": string,
    "keyPriorities": string[],
    "greenFlags": string[],
    "redFlags": string[]
  },
  "questions": [
    {
      "id": string,
      "category": "technical" | "behavioral" | "situational" | "leadership" | "curveball",
      "categoryLabel": string,
      "difficulty": "Temel" | "Orta" | "Zor" | "Kritik Eleyici",
      "question": string,
      "whyInterviewerAsks": string,
      "whatTheyLookFor": string,
      "starStrategy": {
        "situation": string,
        "task": string,
        "action": string,
        "result": string
      },
      "sampleStrongAnswer": string,
      "pitfallsToAvoid": string
    }
  ],
  "reverseQuestions": [
    {
      "id": string,
      "question": string,
      "rationale": string
    }
  ]
}
En az 7-9 adet yüksek nitelikli soru ve 4 adet ters soru üret. Dil Türkçe olmalıdır.`;

    const userPrompt = `Görüşmeci Unvanı: ${interviewerTitle}
Hedeflenen Pozisyon: ${targetRole}
Şirket Tipi / Sektör: ${companyType || 'Genel Teknoloji/Kurumsal'}
Adayın Deneyim Seviyesi: ${experienceLevel || 'Mid / Senior'}
Ekstra Bağlam / Teknolojiler: ${additionalContext || 'Standart pozisyon gereksinimleri'}

Lütfen bu unvana sahip mülakatçının doğrudan soracağı en nokta atışı soruları, ideal STAR stratejilerini ve adayın bu kişiyi etkilemek için soracağı ters soruları JSON formatında üret.`;

    const response = await generateWithModelFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsedData = cleanAndParseJson(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error.message || 'Sorular üretilirken bir hata oluştu.' });
  }
});

// API: Evaluate User Answer with STAR methodology & Persona Context
app.post('/api/interview/evaluate-answer', async (req, res) => {
  try {
    const { interviewerTitle, targetRole, question, userAnswer, category } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Soru ve kullanıcı cevabı zorunludur.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Sen acımasız ama yapıcı bir Baş Mülakat Değerlendirme Koçusun.
Kullanıcının verilen mülakat sorusuna verdiği cevabı, görüşmecinin unvanı (${interviewerTitle || 'Görüşmeci'}) ve hedeflenen rol (${targetRole || 'Aday'}) perspektifinden STAR (Situation, Task, Action, Result) metodolojisine göre incele.

Çıktını MUTLAKA saf JSON olarak ver:
{
  "overallScore": number (0 ile 100 arasında puan),
  "executiveVerdict": string (Kısa 2-3 cümlelik yönetici özeti),
  "interviewerReaction": string (Bu görüşmeci bu cevabı duyduğunda içinden tam olarak ne düşünür?),
  "starAnalysis": {
    "situation": { "score": number (0-25), "comment": string },
    "task": { "score": number (0-25), "comment": string },
    "action": { "score": number (0-25), "comment": string },
    "result": { "score": number (0-25), "comment": string }
  },
  "strengths": string[],
  "weaknesses": string[],
  "redFlagsDetected": string[],
  "improvedSampleAnswer": string (Kullanıcının anlattığı olay örgüsünü bozmadan, profesyonel, metrikli ve STAR uyumlu yeniden yazılmış mükemmel versiyon),
  "coachingTips": string[]
}`;

    const userPrompt = `Görüşmeci Unvanı: ${interviewerTitle || 'Bilinmiyor'}
Hedef Pozisyon: ${targetRole || 'Bilinmiyor'}
Soru Kategorisi: ${category || 'Genel'}
Soru: ${question}

Adayın Verdiği Cevap:
"""${userAnswer}"""

Lütfen bu cevabı derinlemesine puanla ve geri bildirim sağla.`;

    const response = await generateWithModelFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsedData = cleanAndParseJson(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({ error: error.message || 'Cevap değerlendirilirken bir hata oluştu.' });
  }
});

// API: Analyze User's Completed Trainings & Recommend Next-Step Training Roadmaps
app.post('/api/career/analyze-trainings', async (req, res) => {
  try {
    const { trainings, currentRole, targetCareerGoal, industrySector, learningPreferences } = req.body;

    if (!trainings || !Array.isArray(trainings) || trainings.length === 0) {
      return res.status(400).json({ error: 'En az bir tamamlanan eğitim içeriği girilmelidir.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Sen kıdemli bir Kariyer Gelişim Direktörü, Eğitim Müfredat Mimarı ve Teknoloji Mentörüsün.
Kullanıcı sana bugüne kadar katıldığı eğitimlerin içeriklerini, müfredatlarını ve konularını detaylıca veriyor.
Görevin:
1. Kullanıcının mevcut eğitim içeriklerinden hangi yetkinlikleri kazandığını objektif olarak tespit etmek.
2. Hedeflediği bir sonraki kariyer basamağına ulaşması için bu eğitimlerde eksik kalan KRİTİK YETKİNLİK AÇIKLARINI (Skill Gap) belirlemek.
3. KULLANICININ "BİR SONRAKİ ADIM İÇİN NASIL BİR EĞİTİM ALMASI GEREKTİĞİNİ" net, uygulanabilir, spesifik bir eğitim yol haritası ve müfredat önerisi olarak sunmak!

Tavsiye edeceğin eğitimler genel geçer "Python öğren" gibi yüzeysel olmamalı; spesifik konu başlıkları, hangi mimari/pratik kavramları içermesi gerektiği, proje çıktıları ve uluslararası geçerli sertifika/konsept referanslarını içermelidir.

Çıktını MUTLAKA saf JSON olarak ver:
{
  "profileAssessment": {
    "currentCompetencySummary": string,
    "readinessPercentage": number (0-100),
    "acquiredSkills": [
      {
        "skill": string,
        "category": "Teknik" | "Metodoloji" | "Mimari" | "Soft Skill",
        "level": "Başlangıç" | "Orta" | "İleri",
        "evidenceFromTrainings": string
      }
    ],
    "criticalSkillGaps": [
      {
        "missingSkill": string,
        "importance": "Kritik (Zorunlu)" | "Yüksek" | "Tamamlayıcı",
        "whyMissing": string,
        "impactOnTargetRole": string
      }
    ]
  },
  "nextStepTrainingRoadmap": [
    {
      "stepNumber": number,
      "priority": "1. Öncelik (Hemen Alınmalı)" | "2. Aşama (Derinleşme)" | "3. Aşama (Uzmanlık & Liderlik)",
      "trainingTitle": string,
      "trainingFocus": string,
      "targetSyllabus": string[],
      "recommendedPlatformOrType": string,
      "estimatedDurationHours": string,
      "measurableOutcome": string
    }
  ],
  "capstonePortfolioProject": {
    "projectTitle": string,
    "projectScope": string,
    "technologiesToCombine": string[],
    "deliverableHighlights": string[]
  },
  "recommendedCertifications": [
    {
      "name": string,
      "issuer": string,
      "relevance": string
    }
  ],
  "actionPlanSteps": [
    {
      "phase": string,
      "focus": string,
      "tasks": string[]
    }
  ]
}
Dil Türkçe olmalıdır.`;

    const trainingsSummary = trainings
      .map(
        (t: any, idx: number) => `Eğitim ${idx + 1}:
- Başlık: ${t.title || 'Başlıksız'}
- Kurum/Platform: ${t.providerOrPlatform || 'Belirtilmedi'}
- Süre: ${t.duration || 'Belirtilmedi'}
- İçerik & Müfredat Açıklaması: ${t.contentDescription || 'Belirtilmedi'}
- Öğrenilen Beceriler/Teknolojiler: ${Array.isArray(t.skillsCovered) ? t.skillsCovered.join(', ') : t.skillsCovered || 'Belirtilmedi'}
`
      )
      .join('\n');

    const userPrompt = `Adayın Mevcut Rolü: ${currentRole || 'Geliştirici / Uzman'}
Hedeflenen Bir Sonraki Kariyer Adımı / Rol: ${targetCareerGoal || 'Kıdemli Pozisyon'}
Hedeflenen Sektör: ${industrySector || 'Teknoloji / SaaS'}
Öğrenme Tercihi: ${learningPreferences || 'Hands-on Proje ve Uygulama Ağırlıklı'}

ADAYIN BUGÜNE KADAR KATILDIĞI EĞİTİMLERİN İÇERİKLERİ:
${trainingsSummary}

Lütfen bu eğitim içeriklerini detaylıca analiz et ve bir sonraki adım için NASIL bir eğitim alması gerektiğini, eksik yetkinlikleri ve somut müfredat yol haritasını JSON formatında hazırla.`;

    const response = await generateWithModelFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsedData = cleanAndParseJson(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing trainings:', error);
    return res.status(500).json({ error: error.message || 'Eğitim analizi yapılırken bir hata oluştu.' });
  }
});

// Vite integration / Static file serving
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Career & Interview Coach Server running on port ${PORT}`);
});
