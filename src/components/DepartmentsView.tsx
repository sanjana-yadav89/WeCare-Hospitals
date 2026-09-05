import React, { useState } from 'react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department, Doctor, NavigationPage } from '../types';
import { 
  HeartPulse, 
  Brain, 
  Activity, 
  Baby, 
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Crosshair, 
  CheckCircle2, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Sparkles,
  Phone,
  Search,
  UserCheck
} from 'lucide-react';

interface DepartmentsViewProps {
  selectedDeptId?: string;
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
  onNavigate: (page: NavigationPage) => void;
  onSelectDoctor: (doctorId: string) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  selectedDeptId,
  onSelectDepartment,
  onOpenBooking,
  onNavigate,
  onSelectDoctor
}) => {
  const [activeDeptId, setActiveDeptId] = useState<string>(selectedDeptId || DEPARTMENTS[0].id);
  const [deptSearch, setDeptSearch] = useState('');

  const currentDept: Department = DEPARTMENTS.find(d => d.id === activeDeptId) || DEPARTMENTS[0];
  const deptDoctors: Doctor[] = DOCTORS.filter(doc => doc.departmentId === currentDept.id);

  const getDepartmentIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Stethoscope': return <Stethoscope className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      default: return <Stethoscope className={className} />;
    }
  };

  const filteredDepartments = DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.shortDescription.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.commonConditions.some(c => c.toLowerCase().includes(deptSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-left mb-10">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Comprehensive Medical Care
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Centers of Medical Excellence
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            WeCare Hospitals houses 8 multidisciplinary departments equipped with advanced diagnostic infrastructure, high-tech surgical theaters, and specialized clinical faculty.
          </p>
        </div>

        {/* Department Selection Pills / Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quick Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Filter departments or treatments..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs"
              />
            </div>

            <p className="text-xs text-slate-500 font-medium self-end sm:self-auto">
              Select a department below to view specialized doctors & treatments:
            </p>
          </div>

          {/* Department Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredDepartments.map((dept) => {
              const isSelected = dept.id === currentDept.id;
              return (
                <button
                  key={dept.id}
                  id={`dept-tab-${dept.id}`}
                  onClick={() => {
                    setActiveDeptId(dept.id);
                    onSelectDepartment(dept.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {getDepartmentIcon(dept.icon, isSelected ? 'w-4 h-4 text-teal-200' : 'w-4 h-4 text-teal-600')}
                  <span>{dept.name.split('&')[0].trim()}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {dept.doctorIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Department Main Presentation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden text-left mb-16">
          
          {/* Hero Banner with Department Image */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
            <img
              src={currentDept.heroImage}
              alt={currentDept.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-400/40 text-teal-200 text-xs font-bold mb-3">
                {getDepartmentIcon(currentDept.icon, "w-4 h-4 text-teal-300")}
                <span>{currentDept.tagline}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {currentDept.name}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl">
                Led by {currentDept.headOfDepartment.name} ({currentDept.headOfDepartment.title})
              </p>
            </div>
          </div>

          {/* Department Content Body */}
          <div className="p-6 sm:p-10 space-y-10">
            
            {/* Overview & Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Clinical Overview</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {currentDept.fullDescription}
                </p>
              </div>

              {/* Department Stats Card */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  {currentDept.stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-200/80 last:border-none">
                      <span className="text-xs text-slate-600 font-medium">{stat.label}</span>
                      <span className="text-sm font-extrabold text-teal-700">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onOpenBooking(undefined, currentDept.id)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Department Appointment</span>
                </button>
              </div>
            </div>

            {/* Conditions Treated & Key Procedures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              
              {/* Conditions Treated */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Common Conditions Treated
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {currentDept.commonConditions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Procedures */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  Advanced Procedures
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {currentDept.keyProcedures.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dedicated Facilities */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Specialized Infrastructure
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {currentDept.facilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Doctors in this Department (Explicit Multiple Doctors Requirement) */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Doctors in {currentDept.name} ({deptDoctors.length} Specialists)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a specialist below for detailed credentials, OPD schedule, and instant booking:
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('doctors')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All Hospital Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Doctor Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deptDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    id={`dept-doc-card-${doc.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{doc.rating}</span>
                            <span className="text-slate-400 text-[10px]">({doc.reviewsCount})</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">{doc.name}</h4>
                          <p className="text-xs font-semibold text-teal-700">{doc.title}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                        {doc.specialty}
                      </p>

                      <div className="mt-3 text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-semibold text-slate-700">{doc.experienceYears} Years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Consultation Fee:</span>
                          <span className="font-bold text-teal-700">${doc.consultationFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>OPD Location:</span>
                          <span className="text-slate-700 font-medium">{doc.opdRoom.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        id={`dept-doc-book-${doc.id}`}
                        onClick={() => onOpenBooking(doc.id, currentDept.id)}
                        className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Appointment</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('doctors');
                          onSelectDoctor(doc.id);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
