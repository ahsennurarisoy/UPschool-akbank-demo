export type DifficultyLevel = 'Temel' | 'Orta' | 'Zor' | 'Kritik Eleyici';

export type QuestionCategory = 'technical' | 'behavioral' | 'situational' | 'leadership' | 'curveball';

export interface StarStrategy {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  question: string;
  whyInterviewerAsks: string;
  whatTheyLookFor: string;
  starStrategy: StarStrategy;
  sampleStrongAnswer: string;
  pitfallsToAvoid: string;
}

export interface ReverseQuestion {
  id: string;
  question: string;
  rationale: string;
}

export interface InterviewerProfile {
  personaTitle: string;
  mindsetSummary: string;
  keyPriorities: string[];
  greenFlags: string[];
  redFlags: string[];
}

export interface InterviewGenerationResponse {
  interviewerProfile: InterviewerProfile;
  questions: InterviewQuestion[];
  reverseQuestions: ReverseQuestion[];
}

export interface StarAnalysisSection {
  score: number;
  comment: string;
}

export interface AnswerEvaluationResponse {
  overallScore: number;
  executiveVerdict: string;
  interviewerReaction: string;
  starAnalysis: {
    situation: StarAnalysisSection;
    task: StarAnalysisSection;
    action: StarAnalysisSection;
    result: StarAnalysisSection;
  };
  strengths: string[];
  weaknesses: string[];
  redFlagsDetected: string[];
  improvedSampleAnswer: string;
  coachingTips: string[];
}

export interface UserTraining {
  id: string;
  title: string;
  providerOrPlatform: string;
  duration: string;
  contentDescription: string;
  skillsCovered: string[];
}

export interface AcquiredSkill {
  skill: string;
  category: 'Teknik' | 'Metodoloji' | 'Mimari' | 'Soft Skill';
  level: 'Başlangıç' | 'Orta' | 'İleri';
  evidenceFromTrainings: string;
}

export interface CriticalSkillGap {
  missingSkill: string;
  importance: 'Kritik (Zorunlu)' | 'Yüksek' | 'Tamamlayıcı';
  whyMissing: string;
  impactOnTargetRole: string;
}

export interface RecommendedTraining {
  stepNumber: number;
  priority: '1. Öncelik (Hemen Alınmalı)' | '2. Aşama (Derinleşme)' | '3. Aşama (Uzmanlık & Liderlik)';
  trainingTitle: string;
  trainingFocus: string;
  targetSyllabus: string[];
  recommendedPlatformOrType: string;
  estimatedDurationHours: string;
  measurableOutcome: string;
}

export interface CapstonePortfolioProject {
  projectTitle: string;
  projectScope: string;
  technologiesToCombine: string[];
  deliverableHighlights: string[];
}

export interface RecommendedCertification {
  name: string;
  issuer: string;
  relevance: string;
}

export interface ActionPlanStep {
  phase: string;
  focus: string;
  tasks: string[];
}

export interface TrainingAnalysisResponse {
  profileAssessment: {
    currentCompetencySummary: string;
    readinessPercentage: number;
    acquiredSkills: AcquiredSkill[];
    criticalSkillGaps: CriticalSkillGap[];
  };
  nextStepTrainingRoadmap: RecommendedTraining[];
  capstonePortfolioProject: CapstonePortfolioProject;
  recommendedCertifications: RecommendedCertification[];
  actionPlanSteps: ActionPlanStep[];
}
