import React, { useState } from 'react';
import {
  TrainingAnalysisResponse,
  UserTraining,
} from '../types';
import { TRAINING_PRESETS, TrainingPreset } from '../data/samplePresets';
import {
  GraduationCap,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  Award,
  Layers,
  Calendar,
  RefreshCw,
  FolderGit2,
  Code2,
} from 'lucide-react';

interface TrainingAnalyzerTabProps {
  data: TrainingAnalysisResponse | null;
  loading: boolean;
  onAnalyze: (params: {
    trainings: UserTraining[];
    currentRole: string;
    targetCareerGoal: string;
    industrySector: string;
    learningPreferences: string;
  }) => void;
}

export const TrainingAnalyzerTab: React.FC<TrainingAnalyzerTabProps> = ({
  data,
  loading,
  onAnalyze,
}) => {
  const [trainings, setTrainings] = useState<UserTraining[]>(TRAINING_PRESETS[0].trainings);
  const [currentRole, setCurrentRole] = useState(TRAINING_PRESETS[0].currentRole);
  const [targetCareerGoal, setTargetCareerGoal] = useState(TRAINING_PRESETS[0].targetCareerGoal);
  const [industrySector, setIndustrySector] = useState(TRAINING_PRESETS[0].industrySector);
  const [learningPreferences, setLearningPreferences] = useState(TRAINING_PRESETS[0].learningPreferences);

  // New training form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSkills, setNewSkills] = useState('');

  const handleApplyPreset = (preset: TrainingPreset) => {
    setTrainings(preset.trainings);
    setCurrentRole(preset.currentRole);
    setTargetCareerGoal(preset.targetCareerGoal);
    setIndustrySector(preset.industrySector);
    setLearningPreferences(preset.learningPreferences);
  };

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const skillsArray = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTrainingItem: UserTraining = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      providerOrPlatform: newProvider.trim() || 'Kişisel / Çevrimiçi',
      duration: newDuration.trim() || 'Tamamlandı',
      contentDescription: newContent.trim(),
      skillsCovered: skillsArray.length > 0 ? skillsArray : ['Genel Yetkinlikler'],
    };

    setTrainings([...trainings, newTrainingItem]);
    setNewTitle('');
    setNewProvider('');
    setNewDuration('');
    setNewContent('');
    setNewSkills('');
    setShowAddForm(false);
  };

  const handleRemoveTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleRunAnalysis = () => {
    if (trainings.length === 0 || !targetCareerGoal.trim()) return;
    onAnalyze({
      trainings,
      currentRole,
      targetCareerGoal,
      industrySector,
      learningPreferences,
    });
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Müfredat Açığı &amp; Bir Sonraki Adım Eğitimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Hangi Eğitimleri Aldınız &amp; Sırada Ne Olmalı?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Katıldığınız eğitimlerin içeriklerini ve müfredatlarını girin; ardından hedeflediğiniz bir sonraki
            kariyer basamağını belirtin. Yapay zeka eğitimlerinizdeki boşlukları tespit edip bir sonraki adım için
            <strong> tam olarak nasıl bir eğitim almanız gerektiğini</strong> (müfredat başlıkları, proje ve sertifikalarla) çıkarsın.
          </p>

          {/* Preset Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Hazır Eğitim Profillerini Dene:
            </span>
            <div className="flex flex-wrap gap-2">
              {TRAINING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-emerald-900/50 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/50 transition-all font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Target Career Goal Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Kariyer Hedefiniz</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mevcut Rolünüz / Durumunuz
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="Örn: Mid-Level Frontend Dev, Veri Analisti..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Hedeflediğiniz Bir Sonraki Pozisyon *
                </label>
                <input
                  type="text"
                  required
                  value={targetCareerGoal}
                  onChange={(e) => setTargetCareerGoal(e.target.value)}
                  placeholder="Örn: Senior Full Stack Engineer, AI Engineer, Tech Lead..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Hedeflenen Sektör
                </label>
                <input
                  type="text"
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  placeholder="Örn: FinTech, SaaS, E-Ticaret, Global Tech..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Öğrenme Stili Tercihi
                </label>
                <select
                  value={learningPreferences}
                  onChange={(e) => setLearningPreferences(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Hands-on Proje ve Cloud Mimarisi Ağırlıklı">Hands-on Proje ve Uygulama Ağırlıklı</option>
                  <option value="Resmi Sertifika Müfredatına Uygun (AWS, GCP, CKAD)">Resmi Uluslararası Sertifika Odaklı</option>
                  <option value="Sistem Tasarımı, Mimari ve Derin Kod İncelemesi">Sistem Tasarımı &amp; Derin Mimari</option>
                  <option value="Hızlı ve Yoğun Sprint (Bootcamp Tarzı)">Hızlı &amp; Yoğun Öğrenme Kampı</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={loading || trainings.length === 0 || !targetCareerGoal.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Eğitim İçerikleri İnceleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Eğitim Açıklarını Analiz Et &amp; Yol Haritasını Çıkar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: List of Attended Trainings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>Katıldığım Eğitimler ({trainings.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Bugüne kadar tamamladığınız kurs, bootcamp veya sertifika eğitimlerinin içerikleri
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Eğitim Ekle</span>
            </button>
          </div>

          {/* Add Training Modal / Form Inline */}
          {showAddForm && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl animate-fadeIn space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  Yeni Eğitim İçeriği Ekle
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕ Kapat
                </button>
              </div>

              <form onSubmit={handleAddTraining} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Eğitim Başlığı *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Örn: Docker & Kubernetes Temelleri"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Kurum / Eğitmen / Platform</label>
                    <input
                      type="text"
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                      placeholder="Örn: Udemy, Coursera, BTK Akademi, Patika"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Süre / Kapsam</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="Örn: 40 Saat veya 6 Hafta"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Öğrenilen Teknolojiler (Virgülle ayırın)</label>
                    <input
                      type="text"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      placeholder="Örn: Docker, Pods, Services, YAML"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Eğitim İçeriği &amp; Müfredat Açıklaması *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Bu eğitimde hangi modüller işlendi? Örn: Container mimarisi, Dockerfile optimizasyonu, Docker Compose ile çoklu servisler, Kubernetes kümesi ayağa kaldırma..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    Eğitimi Listeye Ekle
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Trainings Cards List */}
          {trainings.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">Henüz eklenmiş bir eğitim yok.</p>
              <p className="text-xs text-slate-500 mt-1">
                Yukarıdaki "Hazır Eğitim Profillerini Dene" butonlarına tıklayabilir veya kendiniz ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trainings.map((t, index) => (
                <div
                  key={t.id || index}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {t.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                        <span className="text-emerald-400 font-medium">📍 {t.providerOrPlatform}</span>
                        <span>•</span>
                        <span>⏱️ {t.duration}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTraining(t.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                      title="Eğitimi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content snippet */}
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 leading-relaxed mb-3">
                    {t.contentDescription}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {t.skillsCovered.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results Section */}
      {data && (
        <div className="space-y-8 animate-fadeIn pt-4">
          {/* Assessment Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Mevcut Müfredat Değerlendirmesi
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {targetCareerGoal} Hedefi İçin Hazırlık Durumu
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {data.profileAssessment.currentCompetencySummary}
                </p>
              </div>

              {/* Readiness Score Badge */}
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="text-lg font-extrabold text-white">
                    %{data.profileAssessment.readinessPercentage}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Hedefe Ulaşma Hazırlığı</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {data.profileAssessment.readinessPercentage >= 70
                      ? 'Güçlü Temel Mevcut'
                      : data.profileAssessment.readinessPercentage >= 40
                      ? 'Kritik Eksikler Var'
                      : 'Yeni Yol Haritası Gerekli'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acquired Skills vs Critical Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Acquired Skills */}
              <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mevcut Eğitimlerden Kazanılan Yetkinlikler ({data.profileAssessment.acquiredSkills.length})</span>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {data.profileAssessment.acquiredSkills.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.skill}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.evidenceFromTrainings}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 shrink-0 px-2 py-0.5 rounded bg-emerald-500/10">
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Skill Gaps */}
              <div className="bg-rose-950/15 rounded-xl p-5 border border-rose-900/30">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Hedef Rol İçin Kritik Yetkinlik Açıkları (Skill Gap)</span>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {data.profileAssessment.criticalSkillGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 p-2.5 rounded-lg border border-rose-900/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300">{gap.missingSkill}</span>
                        <span className="text-[10px] font-semibold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10">
                          {gap.importance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{gap.whyMissing}</p>
                      <p className="text-[10px] text-slate-400 italic">
                        <strong>Etkisi:</strong> {gap.impactOnTargetRole}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NEXT-STEP RECOMMENDED TRAININGS (THE CORE USER ASK) */}
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Bir Sonraki Adım Müfredat Tavsiyesi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Bir Sonraki Adım İçin Nasıl Bir Eğitim Almalısınız?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Mevcut eğitimlerinizin üzerine eklemeniz gereken spesifik müfredatlar ve öğrenme basamakları:
              </p>
            </div>

            {/* Roadmap Steps */}
            <div className="space-y-4">
              {data.nextStepTrainingRoadmap.map((step) => {
                const priorityColor =
                  step.priority.includes('1. Öncelik')
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : step.priority.includes('2. Aşama')
                    ? 'border-indigo-500/40 bg-indigo-950/20'
                    : 'border-violet-500/40 bg-violet-950/20';

                const badgeColor =
                  step.priority.includes('1. Öncelik')
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : step.priority.includes('2. Aşama')
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-violet-500/20 text-violet-300 border-violet-500/40';

                return (
                  <div
                    key={step.stepNumber}
                    className={`bg-slate-900 border rounded-2xl p-6 shadow-md transition-all ${priorityColor}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center border border-slate-700">
                          {step.stepNumber}
                        </span>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${badgeColor}`}>
                          {step.priority}
                        </span>
                        <span className="text-xs text-slate-400">
                          ⏱️ {step.estimatedDurationHours}
                        </span>
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-medium">
                        Önerilen Tür: {step.recommendedPlatformOrType}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      {step.trainingTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                      {step.trainingFocus}
                    </p>

                    {/* Target Syllabus Modules */}
                    <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-4">
                      <span className="text-xs font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bu Eğitim İçeriğinde MUTLAKA Bulunması Gereken Konular / Modüller:</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {step.targetSyllabus.map((module, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Measurable Outcome */}
                    <div className="flex items-center gap-2 text-xs bg-emerald-950/30 text-emerald-200 px-3.5 py-2 rounded-lg border border-emerald-900/40">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Kazanım &amp; Portföy Çıktısı:</strong> {step.measurableOutcome}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capstone Project Idea */}
          {data.capstonePortfolioProject && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase mb-2">
                <FolderGit2 className="w-4 h-4" />
                <span>Mülakatlarda Fark Yaratacak Bitirme / Portföy Projesi</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {data.capstonePortfolioProject.projectTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {data.capstonePortfolioProject.projectScope}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-indigo-300 block mb-2">
                    Birlikte Kullanılacak Teknolojiler (Mevcut + Yeni):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.capstonePortfolioProject.technologiesToCombine.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-300 block mb-2">
                    Repoda / Canlı Demoda Olması Gerekenler:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {data.capstonePortfolioProject.deliverableHighlights.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Certifications and Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Önerilen Resmi Sertifikalar</span>
              </h4>
              <div className="space-y-3">
                {data.recommendedCertifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{cert.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {cert.issuer}
                        </span>
                      </div>
                      <p className="text-slate-400">{cert.relevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Aksiyon Planı &amp; Zaman Çizelgesi</span>
              </h4>
              <div className="space-y-3">
                {data.actionPlanSteps.map((ap, apIdx) => (
                  <div
                    key={apIdx}
                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">{ap.phase}</span>
                      <span className="text-slate-400 text-[11px]">{ap.focus}</span>
                    </div>
                    <ul className="space-y-1 pl-2 border-l border-slate-800">
                      {ap.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="text-slate-300">
                          • {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
