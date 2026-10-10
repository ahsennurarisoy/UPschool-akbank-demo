import React from 'react';
import { Target, GraduationCap, Mic, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'interview' | 'training' | 'practice' | 'report';
  setActiveTab: (tab: 'interview' | 'training' | 'practice' | 'report') => void;
  hasQuestions: boolean;
  hasRoadmap: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasQuestions,
  hasRoadmap,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  TalentForge AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Kariyer &amp; Mülakat Koçu
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Görüşmeci unvanına özel soru analizi &amp; eğitim müfredatı gelişim rehberi
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Mülakat Koçu</span>
              {hasQuestions && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'training'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Eğitim &amp; Yol Haritası</span>
              {hasRoadmap && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse ml-0.5"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'practice'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden md:inline">Cevap Simülasyonu</span>
              <span className="md:hidden">Pratik</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Kariyer Raporu</span>
              <span className="sm:hidden">Rapor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
