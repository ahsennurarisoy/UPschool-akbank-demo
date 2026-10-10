import { UserTraining } from '../types';

export interface InterviewPreset {
  id: string;
  label: string;
  interviewerTitle: string;
  targetRole: string;
  companyType: string;
  experienceLevel: string;
  additionalContext: string;
}

export const INTERVIEWER_PRESETS: InterviewPreset[] = [
  {
    id: 'em-fullstack',
    label: 'Engineering Manager (Kıdemli Yazılımcı Mülakatı)',
    interviewerTitle: 'Engineering Manager (Yazılım Mühendisliği Müdürü)',
    targetRole: 'Senior Full Stack Developer (React & Node.js)',
    companyType: 'Büyüyen SaaS / FinTech Scale-up',
    experienceLevel: 'Senior (5+ Yıl)',
    additionalContext: 'Mikroservisler, CI/CD süreçleri, kod kalitesi, junior mentörlüğü ve teknik borç yönetimi.',
  },
  {
    id: 'hr-director',
    label: 'İK Direktörü / Talent Partner (Kültür & STAR)',
    interviewerTitle: 'Global Talent Acquisition Partner / İK Direktörü',
    targetRole: 'Product Specialist & Agile Takım Üyesi',
    companyType: 'Uluslararası Teknoloji Şirketi',
    experienceLevel: 'Mid-Level (3 Yıl)',
    additionalContext: 'Çapraz fonksiyonel takımlarla çalışma, kriz/çatışma çözümü, geri bildirim kültürü ve esneklik.',
  },
  {
    id: 'cto-startup',
    label: 'CTO (Sistem Tasarımı & Vizyon)',
    interviewerTitle: 'CTO / VP of Engineering',
    targetRole: 'Lead Backend Architect (Golang / Cloud)',
    companyType: 'Yüksek Trafikli E-Ticaret / Ödeme Sistemleri',
    experienceLevel: 'Lead / Staff (7+ Yıl)',
    additionalContext: 'Milyonlarca istekte yüksek erişilebilirlik (HA), Redis önbellekleme, Kafka mesaj kuyrukları ve maliyet optimizasyonu.',
  },
  {
    id: 'lead-ds',
    label: 'Lead Data Scientist (Yapay Zeka & Veri)',
    interviewerTitle: 'Head of Data Science & AI',
    targetRole: 'Machine Learning & LLM Engineer',
    companyType: 'Yapay Zeka Destekli B2B Platformu',
    experienceLevel: 'Mid-Senior (4 Yıl)',
    additionalContext: 'RAG sistemleri, vektör veritabanları, model fine-tuning ve ML pipeline optimizasyonu.',
  },
  {
    id: 'product-lead',
    label: 'Head of Product (Ürün & Mühendislik Uyumu)',
    interviewerTitle: 'Head of Product (Ürün Yönetimi Lideri)',
    targetRole: 'Frontend Lead / UX-Focused Engineer',
    companyType: 'Kullanıcı Odaklı Mobil & Web Girişimi',
    experienceLevel: 'Senior (5 Yıl)',
    additionalContext: 'A/B testleri, sayfa performans metrikleri (Core Web Vitals), kullanıcı geri bildirimi ve hızlı iterasyon.',
  },
];

export interface TrainingPreset {
  id: string;
  label: string;
  currentRole: string;
  targetCareerGoal: string;
  industrySector: string;
  learningPreferences: string;
  trainings: UserTraining[];
}

export const TRAINING_PRESETS: TrainingPreset[] = [
  {
    id: 'fe-to-fullstack',
    label: 'Frontend Geliştirici ➔ Senior Full Stack & Sistem Mimarı',
    currentRole: 'Mid-Level Frontend Developer (React/TS)',
    targetCareerGoal: 'Senior Full Stack Engineer & Cloud Architect',
    industrySector: 'FinTech & B2B SaaS',
    learningPreferences: 'Hands-on Proje ve Cloud Mimarisi Ağırlıklı',
    trainings: [
      {
        id: 't1',
        title: 'Komple Web Geliştirme Bootcamp (HTML, CSS, JS, React)',
        providerOrPlatform: 'Udemy / Angela Yu & Patika.dev',
        duration: '70 Saat Video + 12 Hafta Proje',
        contentDescription: 'JavaScript ES6+, DOM Manipülasyonu, React temelleri, State management (Redux Toolkit), Tailwind CSS, REST API entegrasyonu, Temel Git ve GitHub iş akışları.',
        skillsCovered: ['JavaScript (ES6+)', 'React', 'Redux Toolkit', 'Tailwind CSS', 'REST API', 'Git'],
      },
      {
        id: 't2',
        title: 'İleri Seviye TypeScript ve React Tasarım Kalıpları',
        providerOrPlatform: 'Frontend Masters',
        duration: '25 Saat',
        contentDescription: 'Generics, Union Types, Type Guards, Compound Components paterni, Custom Hooks mimarisi, React 18 Concurrent Rendering ve Context optimizasyonu.',
        skillsCovered: ['TypeScript', 'Design Patterns', 'Performance Tuning', 'Custom Hooks'],
      },
      {
        id: 't3',
        title: 'Node.js ve Express ile Temel Backend Geliştirme',
        providerOrPlatform: 'Coursera & YouTube Workshop',
        duration: '30 Saat',
        contentDescription: 'Express.js rotaları, Middleware kavramı, MongoDB & Mongoose ile CRUD işlemleri, JWT tabanlı kimlik doğrulama, Postman ile API testi.',
        skillsCovered: ['Node.js', 'Express', 'MongoDB', 'JWT Auth', 'CRUD'],
      },
    ],
  },
  {
    id: 'da-to-mle',
    label: 'Veri Analisti ➔ Machine Learning & LLM Engineer',
    currentRole: 'Junior / Mid Veri Analisti',
    targetCareerGoal: 'Machine Learning & AI Çözüm Mühendisi',
    industrySector: 'Kurumsal Teknoloji & Yapay Zeka',
    learningPreferences: 'Uygulamalı Kodlama ve Gerçek Hayat Senaryoları',
    trainings: [
      {
        id: 't1',
        title: 'Python ile İleri Veri Analizi ve SQL Masterclass',
        providerOrPlatform: 'Miuul / DataCamp',
        duration: '60 Saat',
        contentDescription: 'Pandas, NumPy, Matplotlib, Seaborn ile veri manipülasyonu ve görselleştirme. PostgreSQL ile karmaşık sorgular, Window fonksiyonları ve CTE yapıları.',
        skillsCovered: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'Veri Görselleştirme'],
      },
      {
        id: 't2',
        title: 'İş Zekası ve Dashboard Tasarımı (Power BI)',
        providerOrPlatform: 'Kurumsal Akademi & Microsoft Learn',
        duration: '35 Saat',
        contentDescription: 'DAX dili, veri modelleme, interaktif yönetim raporları, ETL süreçleri ve Power BI Service üzerinde canlı veri akışı.',
        skillsCovered: ['Power BI', 'DAX', 'ETL', 'Veri Modelleme'],
      },
      {
        id: 't3',
        title: 'Temel Makine Öğrenmesi Algoritmaları',
        providerOrPlatform: 'Coursera (Andrew Ng - Machine Learning Specialization)',
        duration: '45 Saat',
        contentDescription: 'Lineer Regresyon, Lojistik Regresyon, Karar Ağaçları, Random Forest, Scikit-Learn ile model eğitimi, Train/Test ayrımı ve Temel Metrikler (Precision, Recall, ROC-AUC).',
        skillsCovered: ['Scikit-Learn', 'Supervised Learning', 'Model Evaluation', 'Özellik Mühendisliği'],
      },
    ],
  },
  {
    id: 'jr-backend-to-devops',
    label: 'Backend Geliştirici ➔ DevOps & Cloud Platform Mühendisi',
    currentRole: 'Junior Backend Developer (Java / Spring)',
    targetCareerGoal: 'Cloud & DevOps Platform Engineer',
    industrySector: 'E-Ticaret ve Yüksek Ölçekli Sistemler',
    learningPreferences: 'Resmi Sertifika Müfredatına Uygun & Pratik Altyapı',
    trainings: [
      {
        id: 't1',
        title: 'Java Spring Boot ile Mikroservis Geliştirme',
        providerOrPlatform: 'Udemy / Baeldung',
        duration: '50 Saat',
        contentDescription: 'Spring MVC, Spring Data JPA, Hibernate, PostgreSQL, RESTful Servis Tasarımı, Exception Handling ve Swagger dokümantasyonu.',
        skillsCovered: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Hibernate'],
      },
      {
        id: 't2',
        title: 'Temel Linux Sistem Yönetimi ve Bash Scripting',
        providerOrPlatform: 'Linux Foundation / YouTube',
        duration: '20 Saat',
        contentDescription: 'Linux dosya sistemi izinleri, proses yönetimi, SSH anahtarları, Cron joblar, temel Bash scriptleri ile otomasyon.',
        skillsCovered: ['Linux CLI', 'Bash Scripting', 'SSH', 'Process Management'],
      },
      {
        id: 't3',
        title: 'Docker ile Konteynerizasyon Temelleri',
        providerOrPlatform: 'Docker Docs & Pluralsight',
        duration: '15 Saat',
        contentDescription: 'Dockerfile yazımı, Image build etme, Docker Hub, Docker Compose ile çok servisli lokal geliştirme ortamı kurma.',
        skillsCovered: ['Docker', 'Dockerfile', 'Docker Compose', 'Containerization'],
      },
    ],
  },
];
