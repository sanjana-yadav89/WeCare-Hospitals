import React, { useState, useEffect, useMemo } from 'react';
import { 
  Appointment, 
  Doctor, 
  Department, 
  AppointmentStatus, 
  ConsultationType 
} from '../types';
import { 
  DEPARTMENTS, 
  DOCTORS, 
  HOSPITAL_INFO, 
  INITIAL_APPOINTMENTS 
} from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeToAllHospitalAppointments, 
  adminCreateAppointment, 
  adminUpdateAppointment, 
  adminDeleteAppointment,
  ADMIN_EMAIL
} from '../lib/firebase';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Printer, 
  Download, 
  DollarSign, 
  Activity, 
  Users, 
  Building2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Check, 
  FileText, 
  Stethoscope, 
  MapPin, 
  CreditCard,
  Video,
  Hospital,
  RefreshCw,
  MoreVertical,
  SlidersHorizontal
} from 'lucide-react';

interface AdminPortalProps {
  onBackToHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToHome }) => {
  const { user, isAdmin, adminLogin, logout } = useAuth();

  // Admin Login Form State
  const [adminEmailInput, setAdminEmailInput] = useState('sachin@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('808080');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Central Hospital Appointments State
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('wecare_all_hospital_appointments_v1');
      if (saved) return JSON.parse(saved);
      const userSaved = localStorage.getItem('wecare_hospitals_appointments_v1');
      if (userSaved) return JSON.parse(userSaved);
    } catch (e) {}
    return INITIAL_APPOINTMENTS;
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all'); // all, today, tomorrow, custom
  const [customDate, setCustomDate] = useState<string>('');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingSlipAppointment, setViewingSlipAppointment] = useState<Appointment | null>(null);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);

  // New Booking Form State (Admin Desk)
  const [newDeptId, setNewDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [newDoctorId, setNewDoctorId] = useState<string>(DOCTORS.filter(d => d.departmentId === DEPARTMENTS[0].id)[0]?.id || DOCTORS[0].id);
  const [newConsultationType, setNewConsultationType] = useState<ConsultationType>('in-person');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState<string>('10:00 AM');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number>(35);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientAddress, setNewPatientAddress] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newIsFirstVisit, setNewIsFirstVisit] = useState(true);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('confirmed');
  const [newAdminNotes, setNewAdminNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Subscribe to real-time appointments when user is logged in as admin
  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = subscribeToAllHospitalAppointments((cloudAppts) => {
        if (cloudAppts && cloudAppts.length > 0) {
          setAllAppointments(cloudAppts);
        }
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  // Handle Admin Login
  const handleAdminLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await adminLogin(adminEmailInput, adminPasswordInput);
    } catch (err: any) {
      console.error('Admin login error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setLoginError('Invalid password for administrator. Expected password is: 808080');
      } else if (err.code === 'auth/user-not-found') {
        setLoginError('Admin account not found. Click "1-Click Admin Login" below to auto-provision.');
      } else {
        setLoginError(err.message || 'Failed to authenticate as administrator.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handle1ClickAdminLogin = async () => {
    setAdminEmailInput('sachin@gmail.com');
    setAdminPasswordInput('808080');
    setLoginError('');
    setLoginLoading(true);
    try {
      await adminLogin('sachin@gmail.com', '808080');
    } catch (err: any) {
      setLoginError(err.message || 'Error signing in as admin.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Filtered Doctors based on selected Department in New Booking form
  const availableDoctorsForNewBooking = useMemo(() => {
    return DOCTORS.filter(d => d.departmentId === newDeptId);
  }, [newDeptId]);

  // When newDeptId changes, reset doctorId to first in that department
  useEffect(() => {
    const doctorsInDept = DOCTORS.filter(d => d.departmentId === newDeptId);
    if (doctorsInDept.length > 0) {
      setNewDoctorId(doctorsInDept[0].id);
    }
  }, [newDeptId]);

  const selectedDoctorForNew = useMemo(() => {
    return DOCTORS.find(d => d.id === newDoctorId) || DOCTORS[0];
  }, [newDoctorId]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter(appt => {
      // Search query (name, phone, email, id, doctor)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = appt.patientName?.toLowerCase().includes(q);
        const matchesPhone = appt.patientPhone?.toLowerCase().includes(q);
        const matchesEmail = appt.patientEmail?.toLowerCase().includes(q);
        const matchesId = appt.id?.toLowerCase().includes(q);
        const matchesDoc = appt.doctorName?.toLowerCase().includes(q);
        const matchesDept = appt.departmentName?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesId && !matchesDoc && !matchesDept) {
          return false;
        }
      }

      // Department filter
      if (selectedDeptFilter !== 'all' && appt.departmentId !== selectedDeptFilter) {
        return false;
      }

      // Doctor filter
      if (selectedDoctorFilter !== 'all' && appt.doctorId !== selectedDoctorFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && appt.status !== selectedStatusFilter) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter !== 'all' && appt.consultationType !== selectedTypeFilter) {
        return false;
      }

      // Date filter
      if (selectedDateFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (appt.date !== todayStr) return false;
      } else if (selectedDateFilter === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        if (appt.date !== tomorrowStr) return false;
      } else if (selectedDateFilter === 'custom' && customDate) {
        if (appt.date !== customDate) return false;
      }

      return true;
    });
  }, [allAppointments, searchQuery, selectedDeptFilter, selectedDoctorFilter, selectedStatusFilter, selectedTypeFilter, selectedDateFilter, customDate]);

  // Metrics Calculation
  const stats = useMemo(() => {
    const total = allAppointments.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = allAppointments.filter(a => a.date === todayStr).length;
    const confirmedCount = allAppointments.filter(a => a.status === 'confirmed').length;
    const completedCount = allAppointments.filter(a => a.status === 'completed').length;
    const cancelledCount = allAppointments.filter(a => a.status === 'cancelled').length;
    const rescheduledCount = allAppointments.filter(a => a.status === 'rescheduled').length;
    const totalRevenue = allAppointments.reduce((sum, a) => sum + (a.fee || 0), 0);

    return {
      total,
      todayCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      rescheduledCount,
      totalRevenue
    };
  }, [allAppointments]);

  // Handle Quick Status Change
  const handleQuickStatusChange = async (appointmentId: string, newStatusValue: AppointmentStatus) => {
    const appt = allAppointments.find(a => a.id === appointmentId);
    if (!appt) return;

    // Optimistic UI update
    setAllAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: newStatusValue } : a));

    try {
      await adminUpdateAppointment(appointmentId, { status: newStatusValue }, appt.userId);
    } catch (err) {
      console.error('Failed to update status in Firestore:', err);
    }
  };

  // Handle Admin Delete Appointment
  const handleDeleteAppointmentConfirm = async () => {
    if (!deletingAppointmentId) return;
    const appt = allAppointments.find(a => a.id === deletingAppointmentId);
    
    // Optimistic remove
    setAllAppointments(prev => prev.filter(a => a.id !== deletingAppointmentId));
    setDeletingAppointmentId(null);

    try {
      await adminDeleteAppointment(deletingAppointmentId, appt?.userId);
    } catch (err) {
      console.error('Failed to delete appointment in Firestore:', err);
    }
  };

  // Handle Submit New Booking from Admin Desk
  const handleCreateNewBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientPhone.trim()) {
      alert('Please fill in patient name and phone number.');
      return;
    }

    setIsSubmittingBooking(true);
    const selectedDoc = DOCTORS.find(d => d.id === newDoctorId) || DOCTORS[0];
    const selectedDept = DEPARTMENTS.find(d => d.id === newDeptId) || DEPARTMENTS[0];
    const bookingRef = `WC-ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: bookingRef,
      userId: 'admin_booked_' + Date.now(),
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      doctorSpecialty: selectedDoc.specialty,
      doctorImage: selectedDoc.image,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      consultationType: newConsultationType,
      date: newDate,
      timeSlot: newTimeSlot,
      patientName: newPatientName.trim(),
      patientAge: Number(newPatientAge) || 30,
      patientGender: newPatientGender,
      patientPhone: newPatientPhone.trim(),
      patientEmail: newPatientEmail.trim() || `${newPatientName.toLowerCase().replace(/\s+/g, '.') || 'patient'}@patient.wecare.org`,
      patientAddress: newPatientAddress.trim(),
      reason: newReason.trim() || 'General OPD Specialist Consultation',
      isFirstVisit: newIsFirstVisit,
      status: newStatus,
      createdAt: new Date().toISOString(),
      fee: selectedDoc.consultationFee,
      notes: newAdminNotes.trim()
    };

    try {
      // Optimistic update
      setAllAppointments(prev => [newAppointment, ...prev]);

      // Save to Firestore
      await adminCreateAppointment(newAppointment);

      setBookingSuccessMsg(`Appointment booked successfully! Ref ID: ${bookingRef}`);
      setTimeout(() => {
        setBookingSuccessMsg('');
        setIsAddModalOpen(false);
        // Reset form
        setNewPatientName('');
        setNewPatientPhone('');
        setNewPatientEmail('');
        setNewPatientAddress('');
        setNewReason('');
        setNewAdminNotes('');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating admin appointment:', err);
      alert('Could not save booking to Firestore. Local cache updated.');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle Submit Edit Booking
  const handleEditBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      const updates: Partial<Appointment> = {
        doctorId: editingAppointment.doctorId,
        doctorName: editingAppointment.doctorName,
        doctorSpecialty: editingAppointment.doctorSpecialty,
        departmentId: editingAppointment.departmentId,
        departmentName: editingAppointment.departmentName,
        consultationType: editingAppointment.consultationType,
        date: editingAppointment.date,
        timeSlot: editingAppointment.timeSlot,
        patientName: editingAppointment.patientName,
        patientAge: editingAppointment.patientAge,
        patientGender: editingAppointment.patientGender,
        patientPhone: editingAppointment.patientPhone,
        patientEmail: editingAppointment.patientEmail,
        patientAddress: editingAppointment.patientAddress,
        reason: editingAppointment.reason,
        status: editingAppointment.status,
        notes: editingAppointment.notes,
        fee: editingAppointment.fee
      };

      setAllAppointments(prev => prev.map(a => a.id === editingAppointment.id ? { ...a, ...updates } : a));
      await adminUpdateAppointment(editingAppointment.id, updates, editingAppointment.userId);
      setEditingAppointment(null);
    } catch (err) {
      console.error('Failed to update booking:', err);
      setEditingAppointment(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredAppointments.length === 0) {
      alert('No records to export with current filters.');
      return;
    }
    const headers = ['Ref ID', 'Date', 'Time', 'Patient Name', 'Age', 'Gender', 'Phone', 'Email', 'Doctor', 'Department', 'Type', 'Status', 'Fee (USD)', 'Notes'];
    const rows = filteredAppointments.map(a => [
      `"${a.id}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.patientName}"`,
      `"${a.patientAge}"`,
      `"${a.patientGender}"`,
      `"${a.patientPhone}"`,
      `"${a.patientEmail}"`,
      `"${a.doctorName}"`,
      `"${a.departmentName}"`,
      `"${a.consultationType}"`,
      `"${a.status}"`,
      `"${a.fee}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wecare_hospital_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not logged in as Admin, show Admin Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Header & Lock Icon */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-2">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Hospital Admin Portal
            </h2>
            <p className="text-xs text-slate-400">
              Restricted management gateway for authorized OPD receptionists & clinical directors.
            </p>
          </div>

          {/* Quick Credential Box */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-teal-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Configured Admin Credentials:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-900/80 text-[10px] text-teal-300 border border-teal-700">
                Hospital Admin
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">ADMIN EMAIL:</span>
                <span className="text-emerald-400 select-all font-bold">sachin@gmail.com</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PASSWORD:</span>
                <span className="text-emerald-400 select-all font-bold">808080</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-700/60 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* If currently logged in as a normal patient */}
          {user && !isAdmin && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-700/50 text-amber-200 text-xs">
              <p className="font-semibold">Patient Account Active ({user.email})</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Please log in with the administrator email <strong className="text-white">sachin@gmail.com</strong> to unlock the Admin Portal.
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="admin-login-email-input"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="sachin@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Access Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-login-password-input"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                id="admin-portal-login-btn"
                disabled={loginLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="admin-1click-demo-btn"
                onClick={handle1ClickAdminLogin}
                disabled={loginLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-600/50 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>1-Click Instant Admin Login (sachin@gmail.com)</span>
              </button>
            </div>
          </form>

          {/* Back to Patient Website */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Hospital Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Logged In: Full Central Hospital Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Admin Navigation Top Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md font-bold">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  WeCare Hospital Admin Desk
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Administrator:</span>
                <strong className="text-teal-300 font-medium">{user?.email}</strong>
              </p>
            </div>
          </div>

          {/* Actions: Add Booking, CSV, Back to Patient View, Logout */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="admin-open-add-booking-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New OPD Booking</span>
            </button>

            <button
              id="admin-export-csv-btn"
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download CSV Report"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              id="admin-switch-patient-view-btn"
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Patient View</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Card 1: Total Bookings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">All Bookings</span>
              <Calendar className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <span className="text-[11px] text-slate-500">Central records</span>
          </div>

          {/* Card 2: Today's Appointments */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Today's OPD</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-300">{stats.todayCount}</p>
            <span className="text-[11px] text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Card 3: Confirmed / Active */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.confirmedCount}</p>
            <span className="text-[11px] text-emerald-500/80 font-medium">Ready for doctor</span>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.completedCount}</p>
            <span className="text-[11px] text-slate-500">Discharged / Seen</span>
          </div>

          {/* Card 5: Cancelled / Rescheduled */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Exceptions</span>
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">{stats.cancelledCount + stats.rescheduledCount}</p>
            <span className="text-[11px] text-slate-500">{stats.cancelledCount} canc / {stats.rescheduledCount} resch</span>
          </div>

          {/* Card 6: Total Est Revenue */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">OPD Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300">${stats.totalRevenue}</p>
            <span className="text-[11px] text-slate-500">Consultation fees</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="admin-search-bookings-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, phone, email, booking ref ID, or doctor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Department Dropdown */}
              <select
                id="admin-filter-dept-select"
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="all">All Departments ({DEPARTMENTS.length})</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                id="admin-filter-status-select"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Consultation Type Dropdown */}
              <select
                id="admin-filter-type-select"
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="all">All Types</option>
                <option value="in-person">In-Person OPD</option>
                <option value="video">Tele-Consult (Video)</option>
                <option value="emergency">Emergency Priority</option>
              </select>

              {/* Date Filter */}
              <select
                id="admin-filter-date-select"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today's Bookings</option>
                <option value="tomorrow">Tomorrow's Bookings</option>
                <option value="custom">Custom Date</option>
              </select>

              {selectedDateFilter === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                />
              )}

              {/* Reset Filters button if any active */}
              {(selectedDeptFilter !== 'all' || selectedDoctorFilter !== 'all' || selectedStatusFilter !== 'all' || selectedTypeFilter !== 'all' || selectedDateFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDeptFilter('all');
                    setSelectedDoctorFilter('all');
                    setSelectedStatusFilter('all');
                    setSelectedTypeFilter('all');
                    setSelectedDateFilter('all');
                    setCustomDate('');
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-800/40 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            <span>
              Showing <strong className="text-white">{filteredAppointments.length}</strong> of <strong className="text-white">{allAppointments.length}</strong> bookings
            </span>
            <span className="text-[11px] text-slate-500">
              Real-time synchronization enabled
            </span>
          </div>
        </div>

        {/* Central Bookings Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Consultations Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No hospital appointments match your current search or filter criteria. Click "New OPD Booking" to register a patient.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Booking</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Patient Information</th>
                    <th className="py-3 px-4">Doctor & Department</th>
                    <th className="py-3 px-4">Schedule & Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAppointments.map((appt) => {
                    const statusColors = {
                      confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                      completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                      rescheduled: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                      cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    };

                    return (
                      <tr key={appt.id} className="hover:bg-slate-800/50 transition-colors">
                        
                        {/* Ref ID & Created Date */}
                        <td className="py-3.5 px-4 align-top">
                          <span className="font-mono font-bold text-teal-300 block">
                            {appt.id}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {new Date(appt.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Patient Information */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                            <span>{appt.patientName}</span>
                            {appt.isFirstVisit && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                1st Visit
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                            <span>{appt.patientAge}y, {appt.patientGender}</span>
                            <span>•</span>
                            <span className="text-slate-300">{appt.patientPhone}</span>
                          </div>
                          {appt.reason && (
                            <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate" title={appt.reason}>
                              <strong>Complaint:</strong> {appt.reason}
                            </p>
                          )}
                        </td>

                        {/* Doctor & Department */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-2">
                            {appt.doctorImage && (
                              <img 
                                src={appt.doctorImage} 
                                alt={appt.doctorName} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" 
                              />
                            )}
                            <div>
                              <p className="font-semibold text-slate-200">{appt.doctorName}</p>
                              <p className="text-[11px] text-teal-400">{appt.departmentName}</p>
                            </div>
                          </div>
                        </td>

                        {/* Schedule & Mode */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-medium text-slate-200 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{appt.timeSlot}</span>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                              appt.consultationType === 'video' 
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/50' 
                                : appt.consultationType === 'emergency'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {appt.consultationType === 'video' ? <Video className="w-2.5 h-2.5" /> : <Building2 className="w-2.5 h-2.5" />}
                              <span className="capitalize">{appt.consultationType}</span>
                            </span>
                          </div>
                        </td>

                        {/* Status Dropdown / Badge */}
                        <td className="py-3.5 px-4 align-top">
                          <select
                            id={`status-select-${appt.id}`}
                            value={appt.status}
                            onChange={(e) => handleQuickStatusChange(appt.id, e.target.value as AppointmentStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize cursor-pointer focus:outline-hidden ${statusColors[appt.status] || statusColors.confirmed}`}
                          >
                            <option value="confirmed" className="bg-slate-900 text-emerald-400">Confirmed</option>
                            <option value="completed" className="bg-slate-900 text-blue-400">Completed</option>
                            <option value="rescheduled" className="bg-slate-900 text-amber-400">Rescheduled</option>
                            <option value="cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                          </select>
                        </td>

                        {/* Fee */}
                        <td className="py-3.5 px-4 align-top font-bold text-slate-200">
                          ${appt.fee || 0}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right space-x-1 whitespace-nowrap">
                          {/* Print Slip */}
                          <button
                            id={`print-slip-btn-${appt.id}`}
                            onClick={() => setViewingSlipAppointment(appt)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Print OPD Consultation Slip"
                          >
                            <Printer className="w-4 h-4 text-cyan-400" />
                          </button>

                          {/* Edit Booking */}
                          <button
                            id={`edit-booking-btn-${appt.id}`}
                            onClick={() => setEditingAppointment(appt)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Booking Details"
                          >
                            <Edit3 className="w-4 h-4 text-teal-400" />
                          </button>

                          {/* Delete Booking */}
                          <button
                            id={`delete-booking-btn-${appt.id}`}
                            onClick={() => setDeletingAppointmentId(appt.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Delete Booking Record"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MODAL: ADD NEW BOOKING FROM ADMIN DESK
         ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">OPD Reception Booking Desk</h3>
                  <p className="text-xs text-slate-400">Register new patient appointment directly into central database</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">{bookingSuccessMsg}</h4>
                <p className="text-xs text-slate-400">Synced to cloud Firestore database in real time.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateNewBookingSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* Section 1: Department & Specialist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      id="admin-new-dept-select"
                      value={newDeptId}
                      onChange={(e) => setNewDeptId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Assigned Doctor
                    </label>
                    <select
                      id="admin-new-doctor-select"
                      value={newDoctorId}
                      onChange={(e) => setNewDoctorId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      {availableDoctorsForNewBooking.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} (${doc.consultationFee}) - {doc.opdRoom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 2: Mode, Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Consultation Mode
                    </label>
                    <select
                      id="admin-new-type-select"
                      value={newConsultationType}
                      onChange={(e) => setNewConsultationType(e.target.value as ConsultationType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs capitalize"
                    >
                      <option value="in-person">In-Person OPD</option>
                      <option value="video">Tele-Consult (Video)</option>
                      <option value="emergency">Emergency Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="admin-new-date-input"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Time Slot
                    </label>
                    <select
                      id="admin-new-timeslot-select"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      {(selectedDoctorForNew.timeSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']).map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 3: Patient Demographics */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Patient Details</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        id="admin-new-patient-name"
                        value={newPatientName}
                        onChange={(e) => setNewPatientName(e.target.value)}
                        placeholder="e.g. Robert Johnson"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Age & Gender
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newPatientAge}
                          onChange={(e) => setNewPatientAge(Number(e.target.value))}
                          placeholder="Age"
                          className="w-16 px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        />
                        <select
                          value={newPatientGender}
                          onChange={(e) => setNewPatientGender(e.target.value as any)}
                          className="flex-1 px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="admin-new-patient-phone"
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        id="admin-new-patient-email"
                        value={newPatientEmail}
                        onChange={(e) => setNewPatientEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Reason for Consultation / Chief Complaints
                    </label>
                    <textarea
                      id="admin-new-reason"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      rows={2}
                      placeholder="e.g. Chest pain during exertion, follow up post ECG"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Initial Booking Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="rescheduled">Rescheduled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Admin / Receptionist Notes
                      </label>
                      <input
                        type="text"
                        value={newAdminNotes}
                        onChange={(e) => setNewAdminNotes(e.target.value)}
                        placeholder="e.g. Paid in cash at Counter 2"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="admin-submit-new-booking-btn"
                    disabled={isSubmittingBooking}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Booking...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm & Register Booking (${selectedDoctorForNew.consultationFee})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: EDIT EXISTING BOOKING
         ========================================================= */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Edit Booking: {editingAppointment.id}</h3>
              </div>
              <button
                onClick={() => setEditingAppointment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditBookingSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={editingAppointment.patientName}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, patientName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingAppointment.patientPhone}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, patientPhone: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={editingAppointment.timeSlot}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, timeSlot: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingAppointment.status}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, status: e.target.value as AppointmentStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white capitalize"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fee ($)</label>
                  <input
                    type="number"
                    value={editingAppointment.fee}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason / Symptoms</label>
                <textarea
                  value={editingAppointment.reason}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, reason: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Admin Notes</label>
                <input
                  type="text"
                  value={editingAppointment.notes || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  placeholder="Administrative remarks..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: OPD CONSULTATION SLIP (PRINTABLE)
         ========================================================= */}
      {viewingSlipAppointment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 print:m-0 print:w-full print:shadow-none">
            
            {/* Action Bar */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold">OPD Consultation Slip</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setViewingSlipAppointment(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Slip Content */}
            <div className="p-6 sm:p-8 space-y-6 font-sans">
              
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b-2 border-teal-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-teal-900">WeCare Hospitals</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-teal-800">OPD SLIP</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{HOSPITAL_INFO.address}</p>
                  <p className="text-[10px] text-slate-500">Ph: {HOSPITAL_INFO.phone} • OPD Desk: Ext 104</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-teal-900 block">{viewingSlipAppointment.id}</span>
                  <span className="text-[10px] text-slate-500 block uppercase">Status: {viewingSlipAppointment.status}</span>
                </div>
              </div>

              {/* Patient & Doctor Two-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Information</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingSlipAppointment.patientName}</p>
                  <p className="text-slate-600">{viewingSlipAppointment.patientAge} Years / {viewingSlipAppointment.patientGender}</p>
                  <p className="text-slate-600">Mob: {viewingSlipAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consulting Specialist</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingSlipAppointment.doctorName}</p>
                  <p className="text-teal-700 font-semibold">{viewingSlipAppointment.departmentName}</p>
                  <p className="text-slate-600">Fee Paid: ${viewingSlipAppointment.fee}</p>
                </div>
              </div>

              {/* Schedule Strip */}
              <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs bg-teal-50/50">
                <div>
                  <span className="text-slate-500 block text-[10px]">CONSULTATION DATE:</span>
                  <span className="font-bold text-teal-950 text-sm">{viewingSlipAppointment.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TIME SLOT:</span>
                  <span className="font-bold text-teal-950 text-sm">{viewingSlipAppointment.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MODE:</span>
                  <span className="font-bold text-teal-950 capitalize">{viewingSlipAppointment.consultationType}</span>
                </div>
              </div>

              {/* Clinical Notes / Symptoms */}
              {viewingSlipAppointment.reason && (
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Primary Reason for Visit:</span>
                  <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    "{viewingSlipAppointment.reason}"
                  </p>
                </div>
              )}

              {/* Instructions & Signature */}
              <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-[10px] text-slate-500">
                <div className="space-y-1">
                  <p>• Please report to the OPD Nurse Station 15 minutes prior.</p>
                  <p>• Bring previous test reports, prescriptions, and ID card.</p>
                  <p>• Valid for 7 days for review consultation.</p>
                </div>
                <div className="text-center">
                  <div className="w-28 border-b border-slate-400 pb-4"></div>
                  <p className="mt-1 font-semibold text-slate-700">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CONFIRM DELETE
         ========================================================= */}
      {deletingAppointmentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Booking Record?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently remove booking <strong className="text-white font-mono">{deletingAppointmentId}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingAppointmentId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointmentConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Yes, Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
