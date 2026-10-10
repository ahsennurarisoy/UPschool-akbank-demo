import React, { useState } from 'react';
import { Header } from './components/Header';
import { InterviewCoachTab } from './components/InterviewCoachTab';
import { TrainingAnalyzerTab } from './components/TrainingAnalyzerTab';
import { AnswerPracticeModal } from './components/AnswerPracticeModal';
import { SummaryReportModal } from './components/SummaryReportModal';
import {
  InterviewGenerationResponse,
  InterviewQuestion,
  TrainingAnalysisResponse,
  AnswerEvaluationResponse,
  UserTraining,
} from './types';
import { AlertCircle, X, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'training' | 'practice' | 'report'>('interview');

  // Interview state
  const [interviewData, setInterviewData] = useState<InterviewGenerationResponse | null>(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Training state
  const [trainingData, setTrainingData] = useState<TrainingAnalysisResponse | null>(null);
  const [trainingLoading, setTrainingLoading] = useState(false);

  // Practice state
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<InterviewQuestion | null>(null);
  const [practiceInterviewerTitle, setPracticeInterviewerTitle] = useState('Engineering Manager');
  const [practiceTargetRole, setPracticeTargetRole] = useState('Senior Full Stack Developer');
  const [evaluationResult, setEvaluationResult] = useState<AnswerEvaluationResponse | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateQuestions = async (params: {
    interviewerTitle: string;
    targetRole: string;
    companyType: string;
    experienceLevel: string;
    additionalContext: string;
  }) => {
    setInterviewLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sorular üretilemedi.');
      }

      const data: InterviewGenerationResponse = await response.json();
      setInterviewData(data);
      setPracticeInterviewerTitle(params.interviewerTitle);
      setPracticeTargetRole(params.targetRole);
      if (data.questions.length > 0) {
        setActivePracticeQuestion(data.questions[0]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Mülakat soruları üretilirken bir hata oluştu.');
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleAnalyzeTrainings = async (params: {
    trainings: UserTraining[];
    currentRole: string;
    targetCareerGoal: string;
    industrySector: string;
    learningPreferences: string;
  }) => {
    setTrainingLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/career/analyze-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eğitim analizi yapılamadı.');
      }

      const data: TrainingAnalysisResponse = await response.json();
      setTrainingData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Eğitim yol haritası analiz edilirken bir hata oluştu.');
    } finally {
      setTrainingLoading(false);
    }
  };

  const handleEvaluateAnswer = async (params: {
    question: string;
    userAnswer: string;
    interviewerTitle: string;
    targetRole: string;
    category?: string;
  }): Promise<AnswerEvaluationResponse | null> => {
    setEvaluating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cevap değerlendirilemedi.');
      }

      const data: AnswerEvaluationResponse = await response.json();
      setEvaluationResult(data);
      return data;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Cevabınız değerlendirilirken bir hata oluştu.');
      return null;
    } finally {
      setEvaluating(false);
    }
  };

  const handleStartPractice = (
    question: InterviewQuestion,
    interviewerTitle: string,
    targetRole: string
  ) => {
    setActivePracticeQuestion(question);
    setPracticeInterviewerTitle(interviewerTitle);
    setPracticeTargetRole(targetRole);
    setEvaluationResult(null);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasQuestions={Boolean(interviewData)}
        hasRoadmap={Boolean(trainingData)}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 flex items-center justify-between text-rose-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interview' && (
          <InterviewCoachTab
            data={interviewData}
            loading={interviewLoading}
            onGenerate={handleGenerateQuestions}
            onStartPractice={handleStartPractice}
          />
        )}

        {activeTab === 'training' && (
          <TrainingAnalyzerTab
            data={trainingData}
            loading={trainingLoading}
            onAnalyze={handleAnalyzeTrainings}
          />
        )}

        {activeTab === 'practice' && (
          <AnswerPracticeModal
            question={activePracticeQuestion}
            interviewerTitle={practiceInterviewerTitle}
            targetRole={practiceTargetRole}
            onClose={() => setActiveTab('interview')}
            onEvaluate={handleEvaluateAnswer}
            evaluationResult={evaluationResult}
            evaluating={evaluating}
          />
        )}

        {activeTab === 'report' && (
          <SummaryReportModal
            interviewData={interviewData}
            trainingData={trainingData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">TalentForge AI</span>
            <span>— Kişiselleştirilmiş Kariyer &amp; Mülakat Koçu</span>
          </div>
          <p>© 2026 TalentForge AI. STAR Metodolojisi &amp; Müfredat Açığı Analiz Motoru.</p>
        </div>
      </footer>
    </div>
  );
}
