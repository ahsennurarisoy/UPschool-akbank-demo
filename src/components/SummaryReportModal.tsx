import React, { useState } from 'react';
import { InterviewGenerationResponse, TrainingAnalysisResponse } from '../types';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  Brain,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface SummaryReportModalProps {
  interviewData: InterviewGenerationResponse | null;
  trainingData: TrainingAnalysisResponse | null;
}

export const SummaryReportModal: React.FC<SummaryReportModalProps> = ({
  interviewData,
  trainingData,
}) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    let md = `# Kariyer & Mülakat Koçu AI - Bütünleşik Rapor\n\n`;
    md += `Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\n`;

    if (interviewData) {
      md += `## 1. Mülakatçı Analizi: ${interviewData.interviewerProfile.personaTitle}\n\n`;
      md += `### Görüşmeci Zihniyeti:\n${interviewData.interviewerProfile.mindsetSummary}\n\n`;

      md += `### Temel Öncelikler:\n`;
      interviewData.interviewerProfile.keyPriorities.forEach((p, i) => {
        md += `${i + 1}. ${p}\n`;
      });
      md += `\n`;

      md += `### Potansiyel Sorular ve STAR Kılavuzu:\n`;
      interviewData.questions.forEach((q, i) => {
        md += `#### Soru ${i + 1} (${q.difficulty} - ${q.categoryLabel})\n`;
        md += `> **"${q.question}"**\n\n`;
        md += `- **Görüşmeci Neden Soruyor:** ${q.whyInterviewerAsks}\n`;
        md += `- **Aranan Anahtar Kavramlar:** ${q.whatTheyLookFor}\n`;
        md += `- **STAR Stratejisi:**\n`;
        md += `  - Durum: ${q.starStrategy.situation}\n`;
        md += `  - Görev: ${q.starStrategy.task}\n`;
        md += `  - Eylem: ${q.starStrategy.action}\n`;
        md += `  - Sonuç: ${q.starStrategy.result}\n`;
        md += `- **Örnek Güçlü Cevap:** "${q.sampleStrongAnswer}"\n\n`;
      });

      if (interviewData.reverseQuestions.length > 0) {
        md += `### Bu Görüşmeciye Sorulacak Stratejik Karşı Sorular:\n`;
        interviewData.reverseQuestions.forEach((rq, i) => {
          md += `${i + 1}. "${rq.question}" *(Gerekçe: ${rq.rationale})*\n`;
        });
        md += `\n`;
      }
    }

    if (trainingData) {
      md += `## 2. Eğitim İçerikleri Analizi & Bir Sonraki Adım Yol Haritası\n\n`;
      md += `### Hazırlık Durumu: %${trainingData.profileAssessment.readinessPercentage}\n`;
      md += `${trainingData.profileAssessment.currentCompetencySummary}\n\n`;

      md += `### Kritik Yetkinlik Açıkları (Skill Gap):\n`;
      trainingData.profileAssessment.criticalSkillGaps.forEach((g) => {
        md += `- **${g.missingSkill}** (${g.importance}): ${g.whyMissing} *(Etkisi: ${g.impactOnTargetRole})*\n`;
      });
      md += `\n`;

      md += `### Bir Sonraki Adım İçin Önerilen Eğitimler:\n`;
      trainingData.nextStepTrainingRoadmap.forEach((step) => {
        md += `#### Adım ${step.stepNumber}: ${step.trainingTitle} (${step.priority})\n`;
        md += `- **Odak:** ${step.trainingFocus}\n`;
        md += `- **Süre / Format:** ${step.estimatedDurationHours} - ${step.recommendedPlatformOrType}\n`;
        md += `- **Önemli Modüller:**\n`;
        step.targetSyllabus.forEach((m) => {
          md += `  - ${m}\n`;
        });
        md += `- **Kazanım:** ${step.measurableOutcome}\n\n`;
      });

      if (trainingData.capstonePortfolioProject) {
        md += `### Önerilen Portföy Projesi: ${trainingData.capstonePortfolioProject.projectTitle}\n`;
        md += `${trainingData.capstonePortfolioProject.projectScope}\n`;
        md += `- Teknolojiler: ${trainingData.capstonePortfolioProject.technologiesToCombine.join(', ')}\n\n`;
      }
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!interviewData && !trainingData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h3 className="text-base font-bold text-white mb-1">Henüz Rapor Oluşturulmadı</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          "Mülakat Koçu" sekmesinden soru ürettiğinizde veya "Eğitim &amp; Yol Haritası" sekmesinde analiz yaptığınızda, tüm sonuçlar otomatik olarak bu raporda toplanır.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Kişiselleştirilmiş Kariyer &amp; Mülakat Dosyanız</span>
          </h2>
          <p className="text-xs text-slate-400">
            Tüm mülakat analizlerinizi ve eğitim gelişim planınızı tek bir dosyada inceleyin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Markdown Kopyala</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Kaydet</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Title */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 print:text-indigo-700">
            TALENTFORGE AI YÖNETİCİ RAPORU
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black mt-1">
            Kariyer &amp; Mülakat Strateji Dosyası
          </h1>
          <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
            Rapor Tarihi: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Section 1: Interviewer */}
        {interviewData && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-indigo-400 print:text-indigo-800 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
              <Brain className="w-5 h-5" />
              <span>1. Görüşmeci Perspektifi ({interviewData.interviewerProfile.personaTitle})</span>
            </h2>
            <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
              <strong>Zihniyet Özeti:</strong> {interviewData.interviewerProfile.mindsetSummary}
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white print:text-black uppercase">
                Öncelikli Sorular ve STAR Kılavuzu:
              </h3>
              {interviewData.questions.slice(0, 5).map((q, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black">
                      #{idx + 1} {q.question}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-semibold">{q.categoryLabel}</span>
                  </div>
                  <p className="text-slate-400 print:text-slate-600">
                    <strong>Neden Soruluyor:</strong> {q.whyInterviewerAsks}
                  </p>
                  <p className="text-slate-300 print:text-slate-800 italic bg-slate-900 print:bg-white p-2 rounded border border-slate-800 print:border-slate-200">
                    "{q.sampleStrongAnswer}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Training Gap & Next Steps */}
        {trainingData && (
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
              <GraduationCap className="w-5 h-5" />
              <span>2. Bir Sonraki Adım Eğitim Müfredatı &amp; Yol Haritası</span>
            </h2>

            <div className="bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-white print:text-black mb-1">
                <span>Yetkinlik Değerlendirmesi:</span>
                <span className="text-emerald-400 print:text-emerald-700">
                  %{trainingData.profileAssessment.readinessPercentage} Hazır
                </span>
              </div>
              <p className="text-slate-300 print:text-slate-800">
                {trainingData.profileAssessment.currentCompetencySummary}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white print:text-black uppercase">
                Alınması Gereken Müfredatlar:
              </h3>
              {trainingData.nextStepTrainingRoadmap.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white print:text-black">
                      Adım {step.stepNumber}: {step.trainingTitle}
                    </span>
                    <span className="text-emerald-400 print:text-emerald-700">{step.priority}</span>
                  </div>
                  <p className="text-slate-400 print:text-slate-600">{step.trainingFocus}</p>
                  <div>
                    <span className="font-semibold text-slate-300 print:text-slate-700 block mb-1">
                      Önemli Modüller:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.targetSyllabus.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 print:bg-slate-200 text-slate-300 print:text-slate-800 text-[11px]"
                        >
                          • {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
