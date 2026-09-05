import React, { useState, useMemo } from 'react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor, NavigationPage } from '../types';
import { 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Languages, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Filter, 
  X, 
  Phone, 
  Video, 
  User, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface DoctorsViewProps {
  initialDoctorId?: string;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  initialDoctorId,
  onOpenBooking,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee-asc' | 'fee-desc'>('rating');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(() => {
    if (initialDoctorId) {
      return DOCTORS.find(d => d.id === initialDoctorId) || null;
    }
    return null;
  });

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.departmentName.toLowerCase().includes(q) ||
        doc.qualifications.toLowerCase().includes(q) ||
        doc.languages.some(l => l.toLowerCase().includes(q));

      // Department filter
      const matchesDept = selectedDepartment === 'all' || doc.departmentId === selectedDepartment;

      // Available Today filter
      const matchesAvail = !onlyAvailableToday || doc.isAvailableToday;

      return matchesSearch && matchesDept && matchesAvail;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee-asc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'fee-desc') return b.consultationFee - a.consultationFee;
      return 0;
    });
  }, [searchQuery, selectedDepartment, onlyAvailableToday, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-10">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            World-Renowned Specialists
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Find & Consult Our Doctors
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Choose from over 20+ board-certified medical specialists across 8 dedicated centers of clinical excellence. Book in-person OPD visits or online video consultations.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-8 space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="doctor-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, condition, language..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="md:col-span-3">
              <select
                id="doctor-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="rating">Sort: Highest Rating</option>
                <option value="experience">Sort: Most Experienced</option>
                <option value="fee-asc">Sort: Fee (Lowest First)</option>
                <option value="fee-desc">Sort: Fee (Highest First)</option>
              </select>
            </div>

            {/* Available Today Checkbox Toggle */}
            <div className="md:col-span-3 flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 w-full select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailableToday}
                  onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span>Available for OPD Today</span>
              </label>
            </div>

          </div>

          {/* Department Filter Chips */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="dept-filter-all"
              onClick={() => setSelectedDepartment('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedDepartment === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments ({DOCTORS.length})
            </button>

            {DEPARTMENTS.map((dept) => {
              const count = dept.doctorIds.length;
              const isSelected = selectedDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  id={`dept-filter-${dept.id}`}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept.name.split('&')[0].trim()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>Showing {filteredDoctors.length} verified specialists</span>
          {(searchQuery || selectedDepartment !== 'all' || onlyAvailableToday) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('all');
                setOnlyAvailableToday(false);
              }}
              className="text-teal-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any specialists matching your search filters. Try clearing or broadening your search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('all');
                setOnlyAvailableToday(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
            >
              Show All Doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Top Image & Badge Header */}
                  <div className="relative h-64 bg-slate-100 overflow-hidden">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>

                    {/* Department Pill */}
                    <div className="absolute top-3 left-3 bg-teal-900/90 text-teal-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-teal-700/50">
                      {doc.departmentName.split('&')[0].trim()}
                    </div>

                    {/* Name & Title on bottom image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold leading-tight">{doc.name}</h3>
                      <p className="text-xs text-teal-300 font-medium line-clamp-1">{doc.title}</p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.specialty}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Experience:</span>
                        <span className="font-semibold text-slate-800">{doc.experienceYears} Years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Consultation Fee:</span>
                        <span className="font-bold text-teal-700">${doc.consultationFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">OPD Days:</span>
                        <span className="font-medium text-slate-700">{doc.availableDays.join(', ')}</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Languages className="w-3.5 h-3.5 text-slate-400" />
                      <span>Speaks: {doc.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    id={`book-doc-btn-${doc.id}`}
                    onClick={() => onOpenBooking(doc.id, doc.departmentId)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>

                  <button
                    id={`view-profile-btn-${doc.id}`}
                    onClick={() => setActiveDoctorModal(doc)}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Doctor Detail Modal */}
      {activeDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 rounded-t-3xl">
              <button
                onClick={() => setActiveDoctorModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <img
                  src={activeDoctorModal.image}
                  alt={activeDoctorModal.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-400 shadow-md shrink-0"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-2.5 py-0.5 rounded-full border border-teal-700/50">
                    {activeDoctorModal.departmentName}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-1.5">{activeDoctorModal.name}</h3>
                  <p className="text-xs sm:text-sm text-teal-100 font-medium">{activeDoctorModal.title}</p>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {activeDoctorModal.rating} ({activeDoctorModal.reviewsCount} reviews)
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{activeDoctorModal.experienceYears}+ Years Clinical Exp.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* About Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Professional Biography
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {activeDoctorModal.bio}
                </p>
              </div>

              {/* Specialty & Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Specialization</p>
                  <p className="text-slate-800 font-bold mt-0.5">{activeDoctorModal.specialty}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Qualifications</p>
                  <p className="text-slate-800 font-bold mt-0.5">{activeDoctorModal.qualifications}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Consultation Fee</p>
                  <p className="text-teal-700 font-extrabold text-sm mt-0.5">${activeDoctorModal.consultationFee} USD</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">OPD Chamber</p>
                  <p className="text-slate-800 font-medium mt-0.5">{activeDoctorModal.opdRoom}</p>
                </div>
              </div>

              {/* Education & Fellowships */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  Education & Board Certifications
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeDoctorModal.education.map((edu, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Slots */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Standard OPD Consultation Schedule
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDoctorModal.timeSlots.map((slot, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                      {slot}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Available on: {activeDoctorModal.availableDays.join(', ')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id={`modal-book-btn-${activeDoctorModal.id}`}
                  onClick={() => {
                    const doc = activeDoctorModal;
                    setActiveDoctorModal(null);
                    onOpenBooking(doc.id, doc.departmentId);
                  }}
                  className="w-full sm:flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment with {activeDoctorModal.name.split(' ')[1]}</span>
                </button>

                <button
                  onClick={() => setActiveDoctorModal(null)}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
