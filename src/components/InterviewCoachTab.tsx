import React, { useState } from 'react';
import {
  InterviewGenerationResponse,
  InterviewQuestion,
} from '../types';
import { INTERVIEWER_PRESETS, InterviewPreset } from '../data/samplePresets';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  MessageSquare,
  ShieldAlert,
  Send,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface InterviewCoachTabProps {
  data: InterviewGenerationResponse | null;
  loading: boolean;
  onGenerate: (params: {
    interviewerTitle: string;
    targetRole: string;
    companyType: string;
    experienceLevel: string;
    additionalContext: string;
  }) => void;
  onStartPractice: (question: InterviewQuestion, interviewerTitle: string, targetRole: string) => void;
}

const COMMON_TITLES = [
  'Engineering Manager',
  'Global Talent Acquisition / İK Lideri',
  'CTO / VP of Engineering',
  'Senior Lead Frontend Developer',
  'Head of Product / Lead PM',
  'Lead Data Scientist & AI Lead',
  'Scrum Master / Agile Koç',
  'Finans Müdürü / CFO',
];

export const InterviewCoachTab: React.FC<InterviewCoachTabProps> = ({
  data,
  loading,
  onGenerate,
  onStartPractice,
}) => {
  const [interviewerTitle, setInterviewerTitle] = useState('Engineering Manager (Yazılım Mühendisliği Müdürü)');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Developer (React & Node.js)');
  const [companyType, setCompanyType] = useState('Büyüyen SaaS / FinTech Scale-up');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5+ Yıl)');
  const [additionalContext, setAdditionalContext] = useState('Mikroservisler, yüksek trafik, CI/CD, junior mentörlüğü ve teknik borç yönetimi.');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyPreset = (preset: InterviewPreset) => {
    setInterviewerTitle(preset.interviewerTitle);
    setTargetRole(preset.targetRole);
    setCompanyType(preset.companyType);
    setExperienceLevel(preset.experienceLevel);
    setAdditionalContext(preset.additionalContext);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) return;
    onGenerate({
      interviewerTitle,
      targetRole,
      companyType,
      experienceLevel,
      additionalContext,
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = data?.questions.filter((q) => {
    if (activeCategory === 'all') return true;
    return q.category === activeCategory;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Introduction Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Görüşmeci Zihniyeti &amp; Soru Tahmini</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Mülakata Kim Katılacak?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Mülakatı yapan kişinin unvanını ve hedefinizi belirtin. Yapay zeka, o görüşmecinin
            psikolojisine, masaya getirdiği endişelere ve rol gereksinimlerine göre soracağı
            potansiyel soruları, STAR cevap stratejilerini ve o kişiyi etkileyecek karşı soruları üretsin.
          </p>

          {/* Quick Presets */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Hızlı Senaryo Seç:
            </span>
            <div className="flex flex-wrap gap-2">
              {INTERVIEWER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-indigo-900/60 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500/50 transition-all font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interviewer Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">1.</span> Görüşmecinin Unvanı (Title) *
                </label>
                <span className="text-[11px] text-slate-400">Kiminle görüşeceksiniz?</span>
              </div>
              <input
                type="text"
                required
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Senior Engineering Manager, HR Specialist, CTO, Head of Product..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              {/* Quick Title Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_TITLES.slice(0, 5).map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setInterviewerTitle(title)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    + {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">2.</span> Başvurulan Pozisyon (Hedef Rol) *
                </label>
                <span className="text-[11px] text-slate-400">Gireceğiniz mülakat pozisyonu</span>
              </div>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Frontend Developer, Data Analyst, Product Lead..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Company Type / Industry */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">
                Şirket Türü / Sektör
              </label>
              <input
                type="text"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                placeholder="Örn: Global Kurumsal Banka, B2B SaaS Startup, E-Ticaret, FinTech..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">
                Kıdem Seviyesi
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="Junior / Stajyer (0-2 Yıl)">Junior / Giriş Seviyesi (0-2 Yıl)</option>
                <option value="Mid-Level (2-4 Yıl)">Mid-Level (2-4 Yıl)</option>
                <option value="Senior (5+ Yıl)">Senior (5+ Yıl)</option>
                <option value="Lead / Staff / Principal (7+ Yıl)">Lead / Staff / Principal (7+ Yıl)</option>
                <option value="Yönetici / Manager">Yönetici / Manager</option>
              </select>
            </div>
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>Mülakat Bağlamı &amp; Özel Teknolojiler (Opsiyonel)</span>
              <span className="text-xs text-slate-400">Şirketin ilanındaki teknolojiler veya özel konular</span>
            </label>
            <textarea
              rows={2}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Örn: Şirket mikroservislere geçiş yapıyor, React 19 ve Next.js kullanıyor, kriz durumlarında stres yönetimi önemli..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !interviewerTitle.trim() || !targetRole.trim()}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Sorular &amp; Zihin Haritası Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Görüşmeci Sorularını ve Stratejilerini Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {data && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interviewer Mindset / Persona Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                  Görüşmeci Psikolojisi &amp; Zihin Haritası
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {data.interviewerProfile.personaTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  Mülakatçı Perspektifi
                </span>
              </div>
            </div>

            {/* Mindset summary */}
            <div className="bg-slate-950/70 rounded-xl p-4 sm:p-5 border border-slate-800/80 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Bu Unvandaki Kişi Masaya Hangi Düşünceyle Oturuyor?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {data.interviewerProfile.mindsetSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Priorities, Green Flags & Red Flags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Priorities */}
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>En Çok Önemsediği 3 Şey</span>
                </div>
                <ul className="space-y-2">
                  {data.interviewerProfile.keyPriorities.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Green flags */}
              <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-900/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Görüşmeciyi Etkileyen Sinyaller</span>
                </div>
                <ul className="space-y-2">
                  {data.interviewerProfile.greenFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-emerald-200/90 flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red flags */}
              <div className="bg-rose-950/20 rounded-xl p-4 border border-rose-900/30">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Anında Eleten Kırmızı Bayraklar</span>
                </div>
                <ul className="space-y-2">
                  {data.interviewerProfile.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-2">
                      <span className="text-rose-400">✕</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Questions Header & Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                  <span>Potansiyel Mülakat Soruları ({data.questions.length})</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {data.interviewerProfile.personaTitle} tarafından sorulması en muhtemel sorular ve ideal cevap rehberleri
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tümü ({data.questions.length})
                </button>
                {Array.from(new Set(data.questions.map((q) => q.category))).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'technical'
                      ? 'Teknik'
                      : cat === 'behavioral'
                      ? 'Davranışsal (STAR)'
                      : cat === 'situational'
                      ? 'Durumsal'
                      : cat === 'leadership'
                      ? 'Liderlik'
                      : 'Kriz / Curveball'}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, index) => {
                const isExpanded = expandedQuestionId === q.id;
                const difficultyColor =
                  q.difficulty === 'Kritik Eleyici'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : q.difficulty === 'Zor'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : q.difficulty === 'Orta'
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

                return (
                  <div
                    key={q.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-md transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${difficultyColor}`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                            {q.categoryLabel}
                          </span>
                        </div>

                        {/* Quick action: Practice button */}
                        <button
                          type="button"
                          onClick={() => onStartPractice(q, interviewerTitle, targetRole)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Bu Soruyu Cevapla &amp; Puanlat</span>
                        </button>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                        "{q.question}"
                      </h3>

                      {/* Why Interviewer Asks */}
                      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Görüşmeci Bu Soruyu Neden Soruyor? (Gizli Amaç):</span>
                        </div>
                        <p className="leading-relaxed pl-5">{q.whyInterviewerAsks}</p>

                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cevapta Duymak İstediği Anahtar Şeyler:</span>
                        </div>
                        <p className="leading-relaxed pl-5">{q.whatTheyLookFor}</p>
                      </div>

                      {/* Toggle Expand Button */}
                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span>STAR Stratejisini &amp; Örnek Cevabı Gizle</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span>STAR Stratejisi, Örnek Cevap &amp; Tuzakları Gör</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(q.question, `q-${q.id}`)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === `q-${q.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Soruyu Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Strategy Section */}
                    {isExpanded && (
                      <div className="bg-slate-950/90 border-t border-slate-800 p-5 sm:p-6 space-y-5 animate-fadeIn">
                        {/* STAR Framework Guide */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <span>Bu Soru İçin İdeal STAR Cevap İskeleti</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="font-bold text-indigo-400 block mb-1">
                                [S] Durum (Situation):
                              </span>
                              <p className="text-slate-300">{q.starStrategy.situation}</p>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="font-bold text-violet-400 block mb-1">
                                [T] Görev (Task):
                              </span>
                              <p className="text-slate-300">{q.starStrategy.task}</p>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="font-bold text-emerald-400 block mb-1">
                                [A] Eylem (Action):
                              </span>
                              <p className="text-slate-300">{q.starStrategy.action}</p>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="font-bold text-amber-400 block mb-1">
                                [R] Sonuç &amp; Metrik (Result):
                              </span>
                              <p className="text-slate-300">{q.starStrategy.result}</p>
                            </div>
                          </div>
                        </div>

                        {/* Sample Strong Answer */}
                        <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-900/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Örnek Başarılı &amp; Güçlü Cevap Metni:</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(q.sampleStrongAnswer, `ans-${q.id}`)}
                              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              {copiedId === `ans-${q.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Kopyalandı</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Cevabı Kopyala</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                            "{q.sampleStrongAnswer}"
                          </p>
                        </div>

                        {/* Pitfalls to Avoid */}
                        <div className="bg-rose-950/30 rounded-xl p-3.5 border border-rose-900/30 flex items-start gap-2.5 text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-300">Bu Soruda Yapılan En Büyük Hata (Tuzak): </span>
                            <span className="text-rose-200/90">{q.pitfallsToAvoid}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Reverse Interviewing Questions Section */}
          {data.reverseQuestions && data.reverseQuestions.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>Stratejik Karşı Sorular (Reverse Interviewing)</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Görüşmenin Sonunda "{data.interviewerProfile.personaTitle}" Kişisine Sorabileceğiniz Etkileyici Sorular
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Görüşmeci "Sizin bize sormak istediğiniz bir soru var mı?" dediğinde sıradan sorular yerine bu kişiyi mest edecek stratejik sorular sorun:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.reverseQuestions.map((rq, idx) => (
                  <div
                    key={rq.id || idx}
                    className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-indigo-400 block mb-2">
                        Stratejik Soru #{idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-white mb-3">
                        "{rq.question}"
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                        <strong className="text-slate-300">Neden etkileyici:</strong> {rq.rationale}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(rq.question, `rq-${idx}`)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedId === `rq-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
