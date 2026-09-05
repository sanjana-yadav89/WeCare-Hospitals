import React from 'react';
import { NavigationPage } from '../types';
import { HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';
import { 
  Heart, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Calendar,
  ExternalLink,
  ChevronRight,
  HeartPulse
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
  onOpenEmergency: () => void;
  onSelectDepartment: (deptId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenEmergency,
  onSelectDepartment
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Top Banner: Emergency & Rapid Assistance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-teal-900/90 via-slate-800 to-cyan-950 border border-teal-700/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-3">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              24/7 Level-1 Trauma Emergency
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Need Immediate Medical Assistance?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-xl">
              Our rapid response trauma center, dedicated stroke team, and mobile ICU ambulances operate 24 hours a day with zero triage delay.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
            <button
              id="footer-emergency-call-btn"
              onClick={onOpenEmergency}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Call Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
            </button>
            <button
              id="footer-book-now-btn"
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Hospital Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">WeCare</span>
                <span className="text-2xl font-light tracking-tight text-teal-400">Hospitals</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              WeCare Hospitals is a premier multi-specialty healthcare institution dedicated to patient-centric clinical excellence, advanced robotic surgical techniques, and compassionate tertiary medicine.
            </p>

            {/* Accreditations Badges */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Certified & Accredited by
              </p>
              <div className="flex flex-wrap gap-2">
                {HOSPITAL_INFO.accreditations.map((acc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs font-medium text-teal-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    {acc.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Centers of Excellence (Departments) */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              Departments
            </h4>
            <ul className="space-y-2.5 text-sm">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    id={`footer-dept-${dept.id}`}
                    onClick={() => {
                      onNavigate('departments');
                      onSelectDepartment(dept.id);
                    }}
                    className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 group text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                    <span>{dept.name.split('&')[0].trim()}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  id="footer-view-all-depts"
                  onClick={() => onNavigate('departments')}
                  className="text-teal-400 hover:text-teal-300 font-medium text-xs flex items-center gap-1 mt-1 pt-1"
                >
                  View All Departments &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  About WeCare
                </button>
              </li>
              <li>
                <button
                  id="footer-link-doctors"
                  onClick={() => onNavigate('doctors')}
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  id="footer-link-book"
                  onClick={() => onOpenBooking()}
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  id="footer-link-appointments"
                  onClick={() => onNavigate('my-appointments')}
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  My Appointments
                </button>
              </li>
              <li>
                <button
                  id="footer-link-admin"
                  onClick={() => onNavigate('admin')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  Admin Portal (OPD Desk)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Timings */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              Contact Info
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>General: {HOSPITAL_INFO.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{HOSPITAL_INFO.email}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-medium">Visiting Hours:</p>
                  <p className="text-xs text-slate-400">{HOSPITAL_INFO.visitingHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Rights & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WeCare Hospitals Group. All rights reserved. Registered Healthcare Provider.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Patient Rights</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Clinical Ethics</span>
            <span>•</span>
            <span>JCI Gold Seal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
