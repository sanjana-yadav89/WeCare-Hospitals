import React, { useState } from 'react';
import { 
  DEPARTMENTS, 
  DOCTORS, 
  TESTIMONIALS, 
  HEALTH_PACKAGES, 
  HOSPITAL_INFO 
} from '../data/hospitalData';
import { NavigationPage } from '../types';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Award, 
  ChevronRight, 
  Sparkles,
  HeartPulse,
  Stethoscope,
  Brain,
  Baby,
  ShieldAlert,
  Users,
  Crosshair,
  MapPin,
  Building2,
  Mic,
  FileText,
  MessageSquare
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
  onSelectDoctor: (doctorId: string) => void;
  onOpenEmergency: () => void;
  onOpenSymptomChecker: () => void;
  onOpenVoiceConsult: () => void;
  onOpenLabReport: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectDepartment,
  onOpenBooking,
  onSelectDoctor,
  onOpenEmergency,
  onOpenSymptomChecker,
  onOpenVoiceConsult,
  onOpenLabReport
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Department icon resolver
  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-teal-600" />;
      case 'Brain': return <Brain className="w-6 h-6 text-teal-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-teal-600" />;
      case 'Baby': return <Baby className="w-6 h-6 text-teal-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-teal-600" />;
      case 'Users': return <Users className="w-6 h-6 text-teal-600" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-teal-600" />;
      case 'Crosshair': return <Crosshair className="w-6 h-6 text-teal-600" />;
      default: return <Stethoscope className="w-6 h-6 text-teal-600" />;
    }
  };

  const filteredDepts = searchQuery.trim() === '' 
    ? DEPARTMENTS 
    : DEPARTMENTS.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.commonConditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>JCI & NABH Accredited Multi-Specialty Hospital</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Compassionate Care, <br />
                <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                  World-Class Medicine.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                At WeCare Hospitals, world-renowned clinical specialists, cutting-edge robotic surgical suites, and dedicated 24/7 Level-1 trauma care converge to provide precision healthcare tailored to you and your family.
              </p>

              {/* Quick Search Bar */}
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 max-w-xl shadow-xl flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-teal-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, department, or symptoms..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-400 border border-slate-700/60"
                  />
                </div>

                <button
                  id="hero-search-btn"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      onNavigate('departments');
                    } else {
                      onOpenBooking();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Find Care</span>
                </button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-voice-consult-btn"
                  onClick={onOpenVoiceConsult}
                  className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Mic className="w-4 h-4 animate-pulse text-slate-950" />
                  <span>Start Live Voice AI Consult</span>
                </button>

                <button
                  id="hero-lab-report-btn"
                  onClick={onOpenLabReport}
                  className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-300 hover:text-white font-semibold text-sm border border-teal-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>AI Lab & Prescription Scan</span>
                </button>

                <button
                  id="hero-book-btn"
                  onClick={() => onOpenBooking()}
                  className="px-5 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book In-Person OPD</span>
                </button>
              </div>

              {/* Hero Badges */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">500+</p>
                  <p className="text-xs text-slate-400 font-medium">Advanced Hospital Beds</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">45+</p>
                  <p className="text-xs text-slate-400 font-medium">Super Specialists</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">99.4%</p>
                  <p className="text-xs text-slate-400 font-medium">Clinical Success Rate</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                  alt="WeCare Hospital Doctors and Healthcare Professionals"
                  className="w-full h-96 sm:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Floating Overlay Badge: Emergency */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-teal-500/30 text-left shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <HeartPulse className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">24/7 Level-1 Emergency</p>
                        <p className="text-sm font-semibold text-white">Direct Hotline: {HOSPITAL_INFO.emergencyPhone}</p>
                      </div>
                    </div>

                    <button
                      id="hero-quick-ambulance-btn"
                      onClick={onOpenEmergency}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ambulance
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Award Badge */}
              <div className="hidden sm:flex absolute -top-6 -left-6 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">#1 Best Multi-Specialty</p>
                  <p className="text-[11px] text-slate-500">Healthcare Excellence 2025</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Quick Action Cards (4 Pillars) */}
      <section className="-mt-12 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Find Doctor */}
          <div 
            onClick={() => onNavigate('doctors')}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition-all cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Find a Doctor
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explore profiles of 45+ world-class surgeons and specialists across departments.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-3 group-hover:translate-x-1 transition-transform">
              Search Doctors &rarr;
            </span>
          </div>

          {/* Card 2: Book Appointment */}
          <div 
            onClick={() => onOpenBooking()}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition-all cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Book Appointment
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instant OPD hospital visits or secure HD video consultations in 3 simple steps.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-3 group-hover:translate-x-1 transition-transform">
              Book Online Now &rarr;
            </span>
          </div>

          {/* Card 3: 24/7 Emergency */}
          <div 
            onClick={onOpenEmergency}
            className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-rose-200/80 hover:border-rose-400 hover:shadow-xl transition-all cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-rose-900 group-hover:text-rose-700 transition-colors">
              24/7 Trauma Emergency
            </h3>
            <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
              Immediate ambulance dispatch, stroke response team & cardiac cath lab standby.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 mt-3 group-hover:translate-x-1 transition-transform">
              Emergency Dispatch &rarr;
            </span>
          </div>

          {/* Card 4: Health Checkups */}
          <div 
            onClick={() => onOpenBooking()}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition-all cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Health Packages
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Comprehensive preventive body screening & customized health checkup packages.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-3 group-hover:translate-x-1 transition-transform">
              View Packages &rarr;
            </span>
          </div>

        </div>
      </section>

      {/* 2.5 Unique AI Medical Intelligence Suite */}
      <section className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-10 border border-teal-500/30 text-white shadow-2xl relative overflow-hidden">
          {/* Ambient decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Next-Gen Gemini 3.1 & Vision Clinical Intelligence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Unique AI-Powered Healthcare Features
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-2">
                  Experience seamless real-time spoken consultations, instant medical document breakdown, and intelligent OPD preparation before you step into the hospital.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-teal-500/30 text-xs text-teal-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Gemini Live Voice Active</span>
                </div>
              </div>
            </div>

            {/* 3 AI Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              
              {/* Feature 1: Real-Time Live Voice */}
              <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Dr. WeCare Voice Consult
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Audio
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Speak naturally to our AI clinical triage agent using bidirectional WebAudio. Discuss symptoms, receive instant first-aid advice, and get guided specialist referrals.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero latency natural speech conversation</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instant OPD Doctor direct booking</span>
                    </li>
                  </ul>
                </div>

                <button
                  id="home-start-voice-ai-btn"
                  onClick={onOpenVoiceConsult}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Start Live Voice Consultation</span>
                </button>
              </div>

              {/* Feature 2: AI Lab Report & Prescription Analyzer */}
              <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-teal-400/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                      Lab & Prescription Scan
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Vision AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Upload lab blood panels, MRI/X-ray summaries, or doctor prescriptions. Get plain-English explanations, abnormal marker flags, and dietary questions.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Decodes medical jargon & units instantly</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Recommends specific hospital specialists</span>
                    </li>
                  </ul>
                </div>

                <button
                  id="home-upload-lab-ai-btn"
                  onClick={onOpenLabReport}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-teal-400/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload & Analyze Medical Report</span>
                </button>
              </div>

              {/* Feature 3: Smart Symptom Checker */}
              <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Interactive Triage Guide
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Triage
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Describe how you are feeling to identify relevant medical departments, severity assessment, and preparation tips before consulting a physician.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Guided department recommendation</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Red-flag emergency detection</span>
                    </li>
                  </ul>
                </div>

                <button
                  id="home-open-triage-ai-btn"
                  onClick={onOpenSymptomChecker}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Interactive Triage</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Departments Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-700 font-semibold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Centers of Clinical Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized Medical Departments
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Each department is led by distinguished senior faculty, staffed with multidisciplinary specialists, and powered by ultra-modern medical infrastructure.
            </p>
          </div>

          <button
            id="home-view-all-depts"
            onClick={() => onNavigate('departments')}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Explore All 8 Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDepts.slice(0, 8).map((dept) => {
            const doctorCount = dept.doctorIds.length;
            return (
              <div
                key={dept.id}
                id={`home-dept-card-${dept.id}`}
                onClick={() => {
                  onNavigate('departments');
                  onSelectDepartment(dept.id);
                }}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-400 transition-all duration-300 group flex flex-col cursor-pointer text-left"
              >
                {/* Department Image & Badge */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={dept.heroImage}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-teal-700 shadow-sm">
                    {getDepartmentIcon(dept.icon)}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {doctorCount} Specialists On Duty
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {dept.shortDescription}
                    </p>

                    {/* Common conditions tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dept.commonConditions.slice(0, 2).map((cond, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-600 group-hover:text-teal-700 flex items-center gap-1">
                      Department Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBooking(undefined, dept.id);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      Book OPD
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Meet Our Top Doctors Section */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-teal-700 font-semibold text-xs uppercase tracking-wider mb-2">
                <UserCheck className="w-4 h-4" />
                <span>Our Medical Specialists</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Consult With Renowned Doctors
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                Every doctor at WeCare holds board certifications from premier international institutions with decades of demonstrated clinical excellence.
              </p>
            </div>

            <button
              id="home-view-all-doctors"
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer self-start md:self-auto shadow-xs"
            >
              <span>View All 20+ Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Doctors Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.slice(0, 4).map((doctor) => (
              <div
                key={doctor.id}
                id={`home-doctor-card-${doctor.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left group"
              >
                {/* Doctor Headshot */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{doctor.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
                  </div>

                  {/* Available Today Badge */}
                  {doctor.isAvailableToday && (
                    <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Available Today
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-teal-300 font-medium">{doctor.departmentName}</p>
                    <h3 className="text-base font-bold leading-tight">{doctor.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-600 line-clamp-1">
                      {doctor.specialty}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {doctor.qualifications}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">{doctor.experienceYears}+ Years Exp.</span>
                      <span className="font-bold text-teal-700">${doctor.consultationFee} Fee</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      id={`home-doc-book-${doctor.id}`}
                      onClick={() => onOpenBooking(doctor.id, doctor.departmentId)}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Consultation</span>
                    </button>

                    <button
                      id={`home-doc-profile-${doctor.id}`}
                      onClick={() => {
                        onNavigate('doctors');
                        onSelectDoctor(doctor.id);
                      }}
                      className="w-full py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-medium text-center transition-colors"
                    >
                      View Profile & Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose WeCare Hospitals (Clinical Advantages) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
            The WeCare Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Why Patients Trust WeCare Hospitals
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Combining empathetic patient care with uncompromising surgical precision, world-class diagnostics, and zero-delay critical response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">JCI & NABH Certified</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Stringent international benchmarks for clinical hygiene, ultra-sterile operating theaters, and patient safety protocols.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Robotic Precision</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              State-of-the-art Mako robotic joint systems and Da Vinci surgical modules ensuring minimal blood loss and faster recovery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 font-bold">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero-Delay Trauma</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Dedicated rapid response emergency teams, bi-plane Cath Labs, and Level-3 NICU ready 24 hours a day, 365 days a year.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Patient-Centric Care</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Transparent consultation fees, comprehensive insurance desk assistance, and compassionate follow-up medical support.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Preventive Health Checkup Packages */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-950/70 border border-teal-800 px-3 py-1 rounded-full">
                Early Detection Saves Lives
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                Preventive Health Checkups
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Comprehensive multi-parameter health screening packages customized for individuals and families at special subsidized rates.
              </p>
            </div>

            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 px-5 py-2.5 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Health Check</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {HEALTH_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 transition-all flex flex-col justify-between relative ${
                  pkg.popular
                    ? 'bg-gradient-to-b from-slate-800 to-slate-850 border-2 border-teal-400 shadow-2xl shadow-teal-500/10'
                    : 'bg-slate-800/80 border border-slate-700/80'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-6 bg-teal-400 text-slate-950 text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs text-teal-300 font-medium mt-1">{pkg.targetAudience}</p>

                  <div className="my-5 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">${pkg.discountedPrice}</span>
                    <span className="text-sm text-slate-400 line-through">${pkg.originalPrice}</span>
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">
                      {Math.round(((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    Includes {pkg.testsCount} Comprehensive Tests:
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-700">
                  <button
                    onClick={() => onOpenBooking()}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md shadow-teal-400/20'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book This Package</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Patient Testimonials & Stories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
            Real Patient Journeys
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Stories of Healing & Hope
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Hear directly from patients whose lives were transformed through the dedicated care of our medical teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-teal-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                    {t.patientName.charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.patientName}</h4>
                  <p className="text-[11px] text-teal-600 font-medium">{t.treatment}</p>
                  <p className="text-[10px] text-slate-400">Dr. {t.doctorName.replace('Dr. ', '')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-teal-700 to-cyan-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Consult with Our Specialists?
            </h2>
            <p className="text-teal-100 text-sm sm:text-base mt-1 max-w-xl">
              Choose your preferred department, select your doctor, and secure your OPD or video consultation slot in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenBooking()}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-white text-teal-800 font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg cursor-pointer"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className="w-full md:w-auto px-5 py-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-900 text-white font-semibold text-sm border border-teal-600/60 transition-colors cursor-pointer"
            >
              View Doctors
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
