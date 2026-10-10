import React, { useState, useEffect } from 'react';
import {
  AnswerEvaluationResponse,
  InterviewQuestion,
} from '../types';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AnswerPracticeModalProps {
  question: InterviewQuestion | null;
  interviewerTitle: string;
  targetRole: string;
  onClose: () => void;
  onEvaluate: (params: {
    question: string;
    userAnswer: string;
    interviewerTitle: string;
    targetRole: string;
    category?: string;
  }) => Promise<AnswerEvaluationResponse | null>;
  evaluationResult: AnswerEvaluationResponse | null;
  evaluating: boolean;
}

export const AnswerPracticeModal: React.FC<AnswerPracticeModalProps> = ({
  question,
  interviewerTitle,
  targetRole,
  onClose,
  onEvaluate,
  evaluationResult,
  evaluating,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // Trigger confetti if high score
  useEffect(() => {
    if (evaluationResult && evaluationResult.overallScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [evaluationResult]);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleCopyImproved = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !userAnswer.trim()) return;
    await onEvaluate({
      question: question.question,
      userAnswer,
      interviewerTitle,
      targetRole,
      category: question.category,
    });
  };

  if (!question) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h3 className="text-base font-bold text-white mb-1">Henüz Bir Soru Seçilmedi</h3>
        <p className="text-xs text-slate-400">
          "Mülakat Koçu" sekmesine giderek listeden herhangi bir sorunun üzerindeki <strong>"Bu Soruyu Cevapla &amp; Puanlat"</strong> butonuna tıklayın.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question Context Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/30">
              Görüşmeci: {interviewerTitle}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              Rol: {targetRole}
            </span>
          </div>

          <span className="text-xs font-semibold text-violet-400">
            Kategori: {question.categoryLabel}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
          "{question.question}"
        </h2>

        <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          <strong className="text-indigo-400">Koç Notu:</strong> {question.whyInterviewerAsks}
        </p>
      </div>

      {/* Answer Form & Live Hints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Answer input area */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span>Cevabınızı Girin (Yazarak veya Konuşarak):</span>
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Dinleniyor... (Durdur)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mikrofonla Söyle</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              rows={8}
              required
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Örnek STAR formatında: 
[Durum]: Önceki şirketimde e-ticaret checkout servisimizde beklenmeyen bir bellek sızıntısı yaşandı...
[Görev]: Ben takımın backend sorumlusu olarak sorunu kökten çözmekle görevlendirildim...
[Eylem]: Öncelikle Profiling araçlarıyla leak olan nesneleri tespit ettim ve Redis önbellek katmanını yeniden yapılandırdım...
[Sonuç]: Bu hamle ile yanıt sürelerini %45 düşürdük ve Black Friday boyunca %99.99 uptime sağladık."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Karakter sayısı: {userAnswer.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUserAnswer('')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Temizle
                </button>
                <button
                  type="submit"
                  disabled={evaluating || !userAnswer.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>STAR Metodolojisiyle Değerlendiriliyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-violet-200" />
                      <span>Cevabımı Değerlendir &amp; Puanla</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* STAR Checklist helper */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>STAR Kontrol Listesi</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-indigo-400 block mb-0.5">S - Situation (Durum)</strong>
                <p className="text-slate-400">Olayın geçtiği bağlamı ve zorluğu 1-2 cümlede net verin.</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-violet-400 block mb-0.5">T - Task (Görev)</strong>
                <p className="text-slate-400">Sizin sorumluluğunuz ve aşılması gereken engel neydi?</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-emerald-400 block mb-0.5">A - Action (Eylem)</strong>
                <p className="text-slate-400">"Biz yaptık" yerine "Ben şu kararı aldım ve uyguladım" deyin.</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-400 block mb-0.5">R - Result (Sonuç)</strong>
                <p className="text-slate-400">Mümkünse yüzde (%), süre veya iş değeri gibi metrik verin.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluationResult && (
        <div className="space-y-6 animate-fadeIn pt-2">
          {/* Main Score & Impression Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-violet-400">
                  Değerlendirme Sonucu
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  STAR Performans Analizi
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {evaluationResult.executiveVerdict}
                </p>
              </div>

              {/* Score badge */}
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
                <div className="w-14 h-14 rounded-full bg-violet-600/20 border-2 border-violet-500 flex items-center justify-center text-white font-extrabold text-xl">
                  {evaluationResult.overallScore}
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Genel Puan</span>
                  <span className="text-xs font-bold text-violet-400">
                    {evaluationResult.overallScore >= 85
                      ? 'Harika (Teklif Alabilir)'
                      : evaluationResult.overallScore >= 65
                      ? 'İyi (Geliştirilebilir)'
                      : 'Eksik (Daha Fazla STAR Gerekli)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interviewer Impression */}
            <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-indigo-900/40 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    "{interviewerTitle}" Bu Cevabı Dinlerken Ne Düşündü?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{evaluationResult.interviewerReaction}"
                  </p>
                </div>
              </div>
            </div>

            {/* STAR Breakdown 4 boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-indigo-400">Durum (Situation)</span>
                  <span className="font-extrabold text-white">{evaluationResult.starAnalysis.situation.score}/25</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {evaluationResult.starAnalysis.situation.comment}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-violet-400">Görev (Task)</span>
                  <span className="font-extrabold text-white">{evaluationResult.starAnalysis.task.score}/25</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {evaluationResult.starAnalysis.task.comment}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-400">Eylem (Action)</span>
                  <span className="font-extrabold text-white">{evaluationResult.starAnalysis.action.score}/25</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {evaluationResult.starAnalysis.action.comment}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-400">Sonuç (Result)</span>
                  <span className="font-extrabold text-white">{evaluationResult.starAnalysis.result.score}/25</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {evaluationResult.starAnalysis.result.comment}
                </p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Güçlü Yönleriniz:</span>
                </div>
                <ul className="space-y-1.5 text-emerald-200/90">
                  {evaluationResult.strengths.map((str, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/30 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Geliştirilmesi Gereken Noktalar:</span>
                </div>
                <ul className="space-y-1.5 text-amber-200/90">
                  {evaluationResult.weaknesses.map((w, wIdx) => (
                    <li key={wIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red flags if any */}
            {evaluationResult.redFlagsDetected && evaluationResult.redFlagsDetected.length > 0 && (
              <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-900/40 text-xs mb-6">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Tespit Edilen Kırmızı Bayraklar (Dikkat):</span>
                </div>
                <ul className="space-y-1 text-rose-200/90">
                  {evaluationResult.redFlagsDetected.map((rf, rfIdx) => (
                    <li key={rfIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-400">✕</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Refined Improved Answer */}
            <div className="bg-slate-950 rounded-xl p-5 border border-violet-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Koç Tarafından Parlatılmış İdeal Versiyon (Revize STAR Metni):</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyImproved(evaluationResult.improvedSampleAnswer)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedAnswer ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900 p-4 rounded-lg border border-slate-800">
                "{evaluationResult.improvedSampleAnswer}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
