import React, { useState, useEffect } from 'react';
import { 
  NavigationPage, 
  Appointment, 
  Doctor, 
  Department 
} from './types';
import { 
  INITIAL_APPOINTMENTS, 
  DEPARTMENTS, 
  DOCTORS, 
  HOSPITAL_INFO 
} from './data/hospitalData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  subscribeToUserAppointments, 
  updateAppointmentInFirestore, 
  saveAppointmentToFirestore 
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { DepartmentsView } from './components/DepartmentsView';
import { DoctorsView } from './components/DoctorsView';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { EmergencyModal } from './components/EmergencyModal';
import { SymptomCheckerModal } from './components/SymptomCheckerModal';
import { VoiceConsultationModal } from './components/VoiceConsultationModal';
import { LabReportAnalyzerModal } from './components/LabReportAnalyzerModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';

const LOCAL_STORAGE_KEY = 'wecare_hospitals_appointments_v1';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyAppointmentsModalOpen, setIsMyAppointmentsModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isVoiceConsultModalOpen, setIsVoiceConsultModalOpen] = useState(false);
  const [isLabReportModalOpen, setIsLabReportModalOpen] = useState(false);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load appointments from localStorage:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  // Subscribe to real-time Firestore appointments when logged in
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserAppointments(
        user.uid,
        (cloudAppts) => {
          if (cloudAppts.length > 0) {
            setAppointments(cloudAppts);
          } else {
            // Check if there are local guest bookings to migrate to Firestore
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
              try {
                const parsed: Appointment[] = JSON.parse(saved);
                const userRelevant = parsed.filter(a => !a.userId || a.userId === user.uid);
                if (userRelevant.length > 0) {
                  userRelevant.forEach(async (a) => {
                    try {
                      await saveAppointmentToFirestore(user.uid, { ...a, userId: user.uid });
                    } catch (e) {
                      // ignore
                    }
                  });
                }
              } catch (e) {
                // ignore
              }
            }
          }
        },
        (error) => {
          console.warn('Firestore subscription fallback to local cache:', error);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  // Save to LocalStorage as an offline cache
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to persist appointments:', e);
    }
  }, [appointments]);

  // Scroll to top on page navigation
  const handleNavigate = (page: NavigationPage) => {
    if (page === 'my-appointments') {
      setIsMyAppointmentsModalOpen(true);
      return;
    }
    if (page === 'book') {
      setIsBookingModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDeptId(deptId);
    setCurrentPage('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctor = (docId: string) => {
    setSelectedDoctorId(docId);
    setCurrentPage('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (docId?: string, deptId?: string) => {
    if (docId) setSelectedDoctorId(docId);
    if (deptId) setSelectedDeptId(deptId);
    setIsBookingModalOpen(true);
  };

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments(prev => {
      const exists = prev.some(a => a.id === newAppointment.id);
      if (exists) {
        return prev.map(a => a.id === newAppointment.id ? newAppointment : a);
      }
      return [newAppointment, ...prev];
    });
  };

  const handleCancelAppointment = async (id: string) => {
    setAppointments(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'cancelled' } : item)
    );
    if (user) {
      try {
        await updateAppointmentInFirestore(user.uid, id, { status: 'cancelled' });
      } catch (err) {
        console.error('Failed to update status in Firestore:', err);
      }
    }
  };

  const handleRescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => 
      prev.map(item => item.id === id ? { ...item, date: newDate, timeSlot: newTime, status: 'rescheduled' } : item)
    );
    if (user) {
      try {
        await updateAppointmentInFirestore(user.uid, id, { date: newDate, timeSlot: newTime, status: 'rescheduled' });
      } catch (err) {
        console.error('Failed to reschedule in Firestore:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        onOpenMyAppointments={() => setIsMyAppointmentsModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
        onOpenVoiceConsult={() => setIsVoiceConsultModalOpen(true)}
        onOpenLabReport={() => setIsLabReportModalOpen(true)}
        appointmentsCount={appointments.filter(a => a.status === 'confirmed').length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectDepartment={handleSelectDepartment}
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={handleSelectDoctor}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
            onOpenVoiceConsult={() => setIsVoiceConsultModalOpen(true)}
            onOpenLabReport={() => setIsLabReportModalOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenBooking={() => handleOpenBooking()}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsView
            selectedDeptId={selectedDeptId}
            onSelectDepartment={setSelectedDeptId}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsView
            initialDoctorId={selectedDoctorId}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortal
            onBackToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onSelectDepartment={handleSelectDepartment}
      />

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedDeptId={selectedDeptId}
        onAppointmentBooked={handleAppointmentBooked}
        onViewMyAppointments={() => setIsMyAppointmentsModalOpen(true)}
      />

      {/* My Appointments Manager Modal */}
      <MyAppointmentsModal
        isOpen={isMyAppointmentsModalOpen}
        onClose={() => setIsMyAppointmentsModalOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onRescheduleAppointment={handleRescheduleAppointment}
        onOpenNewBooking={() => {
          setIsMyAppointmentsModalOpen(false);
          setIsBookingModalOpen(true);
        }}
      />

      {/* 24/7 Emergency Dispatch Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Smart Symptom Guidance Modal */}
      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Live Voice AI Consultation Modal (Gemini Live API) */}
      <VoiceConsultationModal
        isOpen={isVoiceConsultModalOpen}
        onClose={() => setIsVoiceConsultModalOpen(false)}
        onBookAppointment={handleOpenBooking}
      />

      {/* AI Lab & Prescription Analyzer Modal (Gemini Vision) */}
      <LabReportAnalyzerModal
        isOpen={isLabReportModalOpen}
        onClose={() => setIsLabReportModalOpen(false)}
        onBookAppointment={handleOpenBooking}
      />

      {/* Patient Auth Modal (Sign In / Sign Up) */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

