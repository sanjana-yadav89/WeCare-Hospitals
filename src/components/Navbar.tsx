import React, { useState } from 'react';
import { 
  NavigationPage 
} from '../types';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  Clock, 
  Calendar, 
  Menu, 
  X, 
  AlertCircle, 
  Heart, 
  Activity, 
  BookmarkCheck,
  Search,
  Sparkles,
  User,
  LogIn,
  LogOut,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  Mic,
  FileText
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
  onOpenMyAppointments: () => void;
  onOpenEmergency: () => void;
  onOpenSymptomChecker: () => void;
  onOpenVoiceConsult: () => void;
  onOpenLabReport: () => void;
  appointmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenMyAppointments,
  onOpenEmergency,
  onOpenSymptomChecker,
  onOpenVoiceConsult,
  onOpenLabReport,
  appointmentsCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, logout, openAuthModal } = useAuth();

  const navItems: { id: NavigationPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Emergency & Quick Info Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Emergency & Level-1 Trauma Active
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              OPD: {HOSPITAL_INFO.opdHours}
            </span>
            <span className="hidden lg:inline-block text-slate-400">
              {HOSPITAL_INFO.address.split(',')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="topbar-voice-consult-btn"
              onClick={onOpenVoiceConsult}
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-all cursor-pointer text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 hover:bg-emerald-900 animate-pulse"
            >
              <Mic className="w-3 h-3 text-emerald-400" />
              <span>Voice AI Consult (Live)</span>
            </button>

            <button
              id="topbar-lab-report-btn"
              onClick={onOpenLabReport}
              className="hidden sm:inline-flex items-center gap-1 text-teal-300 hover:text-white transition-colors cursor-pointer text-xs font-medium px-2 py-0.5 rounded bg-teal-900/50 border border-teal-700/50 hover:bg-teal-800/60"
            >
              <FileText className="w-3 h-3 text-teal-300" />
              <span>AI Lab Analyzer</span>
            </button>

            <button
              id="topbar-symptom-btn"
              onClick={onOpenSymptomChecker}
              className="inline-flex items-center gap-1 text-teal-300 hover:text-white transition-colors cursor-pointer text-xs font-medium px-2 py-0.5 rounded bg-teal-900/50 border border-teal-700/50 hover:bg-teal-800/60"
            >
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>Symptom Guide</span>
            </button>

            <button
              id="topbar-emergency-btn"
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 text-rose-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-600/60 hover:bg-rose-900"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Hospital Brand Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <Heart className="w-6 h-6 fill-white/20 text-white" />
                <Activity className="w-3.5 h-3.5 text-cyan-200 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  WeCare
                </span>
                <span className="text-2xl font-light tracking-tight text-teal-600">
                  Hospitals
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-1 tracking-wide uppercase">
                Care • Compassion • Cure
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* My Appointments Pill */}
            <button
              id="nav-my-appointments-btn"
              onClick={onOpenMyAppointments}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'my-appointments'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-teal-600" />
              <span>My Appointments</span>
              {appointmentsCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-teal-600 rounded-full">
                  {appointmentsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Nav Link */}
            <button
              id="nav-admin-portal-btn"
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'admin'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Portal</span>
            </button>
          </nav>

          {/* Desktop Action Buttons & Auth Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* User Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      (profile?.displayName || user.displayName || user.email || 'P')[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[110px] truncate">
                    {profile?.displayName || user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Patient Account</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 mt-1 truncate">
                        {profile?.displayName || user.displayName || 'Patient'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenMyAppointments();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-teal-700 flex items-center gap-2 cursor-pointer"
                      >
                        <BookmarkCheck className="w-4 h-4 text-teal-600" />
                        <span>My Booked Consultations</span>
                      </button>

                      <button
                        id="nav-dropdown-admin-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Hospital Admin Desk</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        id="nav-logout-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-signin-btn"
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-2 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => openAuthModal('signup')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Voice AI Consult Quick Pill */}
            <button
              id="nav-voice-consult-cta"
              onClick={onOpenVoiceConsult}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 shadow-xs cursor-pointer transition-all hover:scale-102"
              title="Speak with Dr. WeCare Voice (Gemini Live API)"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Voice Consult</span>
            </button>

            <button
              id="nav-book-appointment-cta"
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 active:scale-98 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user ? (
              <button
                onClick={onOpenMyAppointments}
                className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold"
              >
                {(profile?.displayName || user.displayName || user.email || 'P')[0].toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="p-1.5 text-xs font-bold text-teal-700 bg-teal-50 rounded-lg"
              >
                Sign In
              </button>
            )}

            <button
              id="mobile-book-btn"
              onClick={() => onOpenBooking()}
              className="p-2 text-xs font-semibold bg-teal-600 text-white rounded-lg flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              <span>Book</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          
          {/* User Status Banner */}
          {user ? (
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-900">{profile?.displayName || user.displayName || 'Patient'}</p>
                <p className="text-[11px] text-teal-700">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg border border-rose-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600">Access your appointments</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-teal-600 text-white rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-200 text-slate-800 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              id="mobile-nav-my-appointments"
              onClick={() => {
                onOpenMyAppointments();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-teal-600" />
                My Appointments
              </span>
              {appointmentsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-teal-600 rounded-full">
                  {appointmentsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-nav-voice-consult"
              onClick={() => {
                onOpenVoiceConsult();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between cursor-pointer border border-emerald-200/70"
            >
              <span className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-600 animate-pulse" />
                Live Voice AI Consult
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                Gemini Live
              </span>
            </button>

            <button
              id="mobile-nav-lab-report"
              onClick={() => {
                onOpenLabReport();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-teal-800 bg-teal-50/70 hover:bg-teal-100 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-teal-600" />
              AI Lab & Prescription Analyzer
            </button>

            <button
              id="mobile-nav-symptom-checker"
              onClick={() => {
                onOpenSymptomChecker();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-teal-600" />
              Symptom Guide & Triage
            </button>

            <button
              id="mobile-nav-admin-portal"
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 cursor-pointer border border-emerald-200/80"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Hospital Admin Portal</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              id="mobile-emergency-btn"
              onClick={() => {
                onOpenEmergency();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-200 flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-rose-600" />
              24/7 Emergency ({HOSPITAL_INFO.emergencyPhone})
            </button>

            <button
              id="mobile-book-full-btn"
              onClick={() => {
                onOpenBooking();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Book Doctor Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
