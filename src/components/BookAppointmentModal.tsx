import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DEPARTMENTS, DOCTORS, HOSPITAL_INFO } from '../data/hospitalData';
import { 
  Department, 
  Doctor, 
  Appointment, 
  ConsultationType 
} from '../types';
import { useAuth } from '../context/AuthContext';
import { saveAppointmentToFirestore } from '../lib/firebase';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Video, 
  ShieldCheck, 
  Printer, 
  Download, 
  CalendarPlus, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus,
  CloudCheck,
  Lock
} from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDeptId?: string;
  onAppointmentBooked: (newAppointment: Appointment) => void;
  onViewMyAppointments: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDeptId,
  onAppointmentBooked,
  onViewMyAppointments
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDeptId || DEPARTMENTS[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [consultationType, setConsultationType] = useState<ConsultationType>('in-person');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [reason, setReason] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed Appointment Result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user) {
      if (!patientName && (profile?.displayName || user.displayName)) {
        setPatientName(profile?.displayName || user.displayName || '');
      }
      if (!patientEmail && user.email) {
        setPatientEmail(user.email);
      }
      if (!patientPhone && profile?.phoneNumber) {
        setPatientPhone(profile.phoneNumber);
      }
      if (!patientAddress && profile?.address) {
        setPatientAddress(profile.address);
      }
    }
  }, [user, profile, isOpen]);

  // Initialize preselected doctor or department
  useEffect(() => {
    if (preselectedDoctorId) {
      const doc = DOCTORS.find(d => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedDoctorId(doc.id);
        setSelectedDeptId(doc.departmentId);
      }
    } else if (preselectedDeptId) {
      setSelectedDeptId(preselectedDeptId);
      const docsInDept = DOCTORS.filter(d => d.departmentId === preselectedDeptId);
      if (docsInDept.length > 0) {
        setSelectedDoctorId(docsInDept[0].id);
      }
    } else {
      const docsInDept = DOCTORS.filter(d => d.departmentId === selectedDeptId);
      if (docsInDept.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(docsInDept[0].id);
      }
    }
  }, [preselectedDoctorId, preselectedDeptId, isOpen]);

  // When department changes, update doctor if current doctor is not in new department
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docs = DOCTORS.filter(d => d.departmentId === deptId);
    if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  const currentDeptDoctors = DOCTORS.filter(d => d.departmentId === selectedDeptId);
  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || currentDeptDoctors[0] || DOCTORS[0];
  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  // Generate next 14 calendar days
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Starting tomorrow
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    return { iso, dayName, monthName, dayNum };
  });

  // Default select first available date on load
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].iso);
    }
  }, [availableDates]);

  // Available Time slots for the chosen doctor
  const availableTimeSlots = currentDoctor?.timeSlots || [
    '09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM'
  ];

  useEffect(() => {
    if (availableTimeSlots.length > 0 && (!selectedTimeSlot || !availableTimeSlots.includes(selectedTimeSlot))) {
      setSelectedTimeSlot(availableTimeSlots[0]);
    }
  }, [selectedDoctorId, availableTimeSlots]);

  if (!isOpen) return null;

  // Step Validation & Handlers
  const handleNextToStep2 = () => {
    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor to proceed.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setErrorMsg('Please select both a date and a time slot.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMsg('Please sign in or create an account to complete your booking.');
      openAuthModal('signin');
      return;
    }

    if (!patientName.trim()) {
      setErrorMsg('Please enter patient full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      setErrorMsg('Please enter a valid age (1-120).');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Generate unique Booking ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `WC-2026-${randomNum}`;

    const newAppt: Appointment = {
      id: bookingId,
      userId: user.uid,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      doctorImage: currentDoctor.image,
      departmentId: currentDept.id,
      departmentName: currentDept.name,
      consultationType: consultationType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      patientGender: patientGender,
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      patientAddress: patientAddress.trim(),
      reason: reason.trim() || 'General Specialist Consultation & Evaluation',
      isFirstVisit: isFirstVisit,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      fee: currentDoctor.consultationFee
    };

    try {
      // Save directly to Firebase Firestore under users/{uid}/appointments/{id}
      await saveAppointmentToFirestore(user.uid, newAppt);
      
      // Save and emit
      onAppointmentBooked(newAppt);
      setConfirmedAppointment(newAppt);
      setStep(4);

      // Trigger confetti celebratory effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // safe fallback
      }
    } catch (err: any) {
      console.error('Error saving appointment to Firestore:', err);
      // Even if offline or error, emit to local state
      onAppointmentBooked(newAppt);
      setConfirmedAppointment(newAppt);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!confirmedAppointment) return;
    const title = encodeURIComponent(`WeCare Hospital: Appointment with ${confirmedAppointment.doctorName}`);
    const details = encodeURIComponent(
      `Appointment Ref: ${confirmedAppointment.id}\nSpecialty: ${confirmedAppointment.doctorSpecialty}\nMode: ${confirmedAppointment.consultationType.toUpperCase()}\nDepartment: ${confirmedAppointment.departmentName}\nLocation: ${HOSPITAL_INFO.address}`
    );
    const location = encodeURIComponent(HOSPITAL_INFO.address);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const handleResetAndClose = () => {
    setStep(1);
    setPatientName('');
    setPatientAge('');
    setPatientPhone('');
    setPatientEmail('');
    setPatientAddress('');
    setReason('');
    setErrorMsg('');
    setConfirmedAppointment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-5 sm:p-6 rounded-t-3xl flex items-center justify-between relative shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                WeCare Online OPD Booking
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Book Doctor Consultation
            </h2>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={handleResetAndClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker (Steps 1 to 3) */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                1
              </span>
              <span className="hidden sm:inline">Specialist</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                2
              </span>
              <span className="hidden sm:inline">Date & Time</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                3
              </span>
              <span className="hidden sm:inline">Patient Info</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto">
          
          {/* STEP 1: Department & Doctor Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  1. Select Clinical Department
                </label>
                <select
                  id="booking-dept-select"
                  value={selectedDeptId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.doctorIds.length} Doctors Available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  2. Select Doctor ({currentDeptDoctors.length} Specialists in {currentDept.name.split('&')[0]})
                </label>
                
                <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
                  {currentDeptDoctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        id={`booking-doc-option-${doc.id}`}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                            <p className="text-xs text-teal-700 font-medium">{doc.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{doc.experienceYears}+ Yrs Exp. • Fee: ${doc.consultationFee}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {doc.isAvailableToday ? 'Today' : doc.availableDays.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Type Radio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  3. Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    id="booking-mode-inperson"
                    onClick={() => setConsultationType('in-person')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      consultationType === 'in-person'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <div className="text-xs">
                      <p className="font-semibold">In-Person OPD Visit</p>
                      <p className="text-[10px] text-slate-500 font-normal">At WeCare Hospital Campus</p>
                    </div>
                  </div>

                  <div
                    id="booking-mode-video"
                    onClick={() => setConsultationType('video')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      consultationType === 'video'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4 text-teal-600 shrink-0" />
                    <div className="text-xs">
                      <p className="font-semibold">HD Video Consultation</p>
                      <p className="text-[10px] text-slate-500 font-normal">Secure Tele-Health Link</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="booking-step1-next-btn"
                onClick={handleNextToStep2}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Selected Doctor Summary Pill */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={currentDoctor.image} alt={currentDoctor.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{currentDoctor.name}</h4>
                    <p className="text-[11px] text-teal-700">{currentDoctor.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-teal-700 hover:underline font-semibold"
                >
                  Change Doctor
                </button>
              </div>

              {/* 14-Day Date Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Select Consultation Date
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        id={`date-slot-${item.iso}`}
                        onClick={() => setSelectedDate(item.iso)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-md font-bold'
                            : 'bg-white border-slate-200 hover:border-teal-400 text-slate-700'
                        }`}
                      >
                        <span className={`text-[10px] block uppercase ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                          {item.dayName}
                        </span>
                        <span className="text-base font-extrabold block my-0.5">
                          {item.dayNum}
                        </span>
                        <span className={`text-[10px] block ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Available OPD Time Slots
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableTimeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        id={`time-slot-${slot.replace(/\s+/g, '')}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OPD Chamber info */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  {consultationType === 'in-person'
                    ? `Consultation Room: ${currentDoctor.opdRoom}`
                    : 'Video room link will be sent via SMS & Email 15 minutes before the session.'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="booking-step2-next-btn"
                  onClick={handleNextToStep3}
                  className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Continue to Patient Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information Form */}
          {step === 3 && (
            <form onSubmit={handleFinalBooking} className="space-y-4">
              
              {/* Auth Prompt or Verified Banner */}
              {!user ? (
                <div className="p-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl border border-teal-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-teal-500/20 rounded-xl text-teal-300 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Patient Account Sign In Required</p>
                      <p className="text-[11px] text-teal-200 mt-0.5">
                        Sign in or create an account to store and access your digital OPD slip securely.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      id="modal-prompt-signin-btn"
                      onClick={() => openAuthModal('signin')}
                      className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      id="modal-prompt-signup-btn"
                      onClick={() => openAuthModal('signup')}
                      className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Booking as: <strong>{profile?.displayName || user.displayName || 'Patient'}</strong> ({user.email})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md">
                    Verified Account
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    id="patient-name-input"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      id="patient-age-input"
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="e.g. 42"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="patient-gender-select"
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (for SMS & OTP) *
                  </label>
                  <input
                    id="patient-phone-input"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (for Confirmation Slip) *
                  </label>
                  <input
                    id="patient-email-input"
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Residential Address / City
                </label>
                <input
                  id="patient-address-input"
                  type="text"
                  placeholder="Street Address, City, State"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Primary Symptoms
                </label>
                <textarea
                  id="patient-reason-input"
                  rows={2}
                  placeholder="Describe your health symptoms, medical concern, or previous diagnostics..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Patient Type:</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={isFirstVisit}
                    onChange={() => setIsFirstVisit(true)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>First Visit</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={!isFirstVisit}
                    onChange={() => setIsFirstVisit(false)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Follow-Up Visit</span>
                </label>
              </div>

              {/* Consultation Fee Summary */}
              <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Total Consultation Fee</p>
                  <p className="text-[11px] text-slate-500">Payable at Hospital Reception or Online</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-teal-700">${currentDoctor.consultationFee} USD</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="booking-confirm-submit-btn"
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Confirmation Slip */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Appointment Confirmed & Scheduled
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Thank You, {confirmedAppointment.patientName}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  A confirmation SMS & email have been dispatched to {confirmedAppointment.patientPhone}.
                </p>
              </div>

              {/* Printable Appointment Slip Card */}
              <div 
                id="appointment-receipt-slip"
                className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 text-left space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                    <p className="text-base font-extrabold text-teal-800 tracking-wider">
                      {confirmedAppointment.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block">
                      Confirmed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Doctor</p>
                    <p className="font-bold text-slate-800">{confirmedAppointment.doctorName}</p>
                    <p className="text-slate-500 text-[11px]">{confirmedAppointment.doctorSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Department</p>
                    <p className="font-bold text-slate-800">{confirmedAppointment.departmentName}</p>
                    <p className="text-teal-700 font-semibold text-[11px] uppercase">
                      {confirmedAppointment.consultationType} Consultation
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Date & Time</p>
                    <p className="font-bold text-slate-800">{confirmedAppointment.date}</p>
                    <p className="text-teal-700 font-bold">{confirmedAppointment.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Consultation Fee</p>
                    <p className="text-base font-extrabold text-teal-800">${confirmedAppointment.fee} USD</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Hospital: WeCare Hospitals Metro Campus</span>
                  <span>OPD Desk Counter #3</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="slip-add-calendar-btn"
                  onClick={handleAddToCalendar}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-600" />
                  <span>Add to Calendar</span>
                </button>

                <button
                  id="slip-print-btn"
                  onClick={handlePrint}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-teal-600" />
                  <span>Print Receipt Slip</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  id="slip-view-my-appts-btn"
                  onClick={() => {
                    handleResetAndClose();
                    onViewMyAppointments();
                  }}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>View in My Appointments</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
