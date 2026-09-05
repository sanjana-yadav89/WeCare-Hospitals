import React, { useState } from 'react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookmarkCheck, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Printer, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Building2, 
  Video, 
  PlusCircle,
  MapPin,
  CalendarDays,
  LogIn,
  UserPlus,
  ShieldCheck,
  Cloud,
  Check
} from 'lucide-react';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  onOpenNewBooking: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenNewBooking
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  
  // Reschedule Dialog State
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('10:30 AM');

  // Slip preview modal
  const [viewingSlipAppt, setViewingSlipAppt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const filteredAppointments = appointments.filter((appt) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      q === '' ||
      appt.id.toLowerCase().includes(q) ||
      appt.patientName.toLowerCase().includes(q) ||
      appt.doctorName.toLowerCase().includes(q) ||
      appt.patientPhone.includes(q) ||
      appt.departmentName.toLowerCase().includes(q);

    const matchesStatus = selectedStatus === 'all' || appt.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmReschedule = () => {
    if (!reschedulingAppt || !newRescheduleDate || !newRescheduleTime) return;
    onRescheduleAppointment(reschedulingAppt.id, newRescheduleDate, newRescheduleTime);
    setReschedulingAppt(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-5 sm:p-6 rounded-t-3xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  My Appointments ({appointments.length})
                </h2>
                {user && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-800/80 border border-teal-600 text-teal-300 px-2 py-0.5 rounded-full">
                    <Cloud className="w-3 h-3 text-teal-300" />
                    Firebase Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {user 
                  ? `Signed in as ${profile?.displayName || user.displayName || user.email}`
                  : 'Track, reschedule, or print your hospital consultations.'}
              </p>
            </div>
          </div>

          <button
            id="close-my-appointments-btn"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In Notice */}
        {!user && (
          <div className="p-4 bg-teal-50 border-b border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2 text-xs text-teal-950">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Sign In to Save Your Bookings Permanently</p>
                <p className="text-[11px] text-teal-800">
                  Connect with your email or Google account to access your appointments across all your devices.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('signin')}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-3 py-1.5 bg-white border border-teal-300 text-teal-900 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-teal-100 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, doctor, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all capitalize cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No Appointments Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {appointments.length === 0
                  ? "You haven't scheduled any doctor appointments yet."
                  : 'No appointments matched your search filter criteria.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="mt-4 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                id={`appointment-card-${appt.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Doctor & Patient Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={appt.doctorImage}
                    alt={appt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Ref: {appt.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          appt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : appt.status === 'rescheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {appt.doctorName}
                    </h4>
                    <p className="text-xs text-teal-700 font-medium">{appt.departmentName}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <strong className="text-slate-800">{appt.date}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <strong className="text-slate-800">{appt.timeSlot}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        Patient: {appt.patientName} ({appt.patientAge}y, {appt.patientGender})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => setViewingSlipAppt(appt)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Slip</span>
                  </button>

                  {appt.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => {
                          setReschedulingAppt(appt);
                          setNewRescheduleDate(appt.date);
                          setNewRescheduleTime(appt.timeSlot);
                        }}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel appointment ${appt.id}?`)) {
                            onCancelAppointment(appt.id);
                          }
                        }}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenNewBooking();
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Another Appointment</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

      {/* Reschedule Sub-Modal */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">
              Reschedule Appointment {reschedulingAppt.id}
            </h3>
            <p className="text-xs text-slate-500">
              Select a new date and time for consultation with {reschedulingAppt.doctorName}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Time Slot</label>
              <select
                value={newRescheduleTime}
                onChange={(e) => setNewRescheduleTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setReschedulingAppt(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Slip Modal */}
      {viewingSlipAppt && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs font-extrabold text-teal-800 uppercase">WeCare Hospitals</p>
                <h3 className="text-lg font-bold text-slate-900">OPD Appointment Slip</h3>
              </div>
              <button
                onClick={() => setViewingSlipAppt(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <span className="font-extrabold text-teal-800">{viewingSlipAppt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold">{viewingSlipAppt.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Age & Gender:</span>
                <span>{viewingSlipAppt.patientAge} Years / {viewingSlipAppt.patientGender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold">{viewingSlipAppt.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Specialty:</span>
                <span>{viewingSlipAppt.doctorSpecialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-teal-700">{viewingSlipAppt.date} at {viewingSlipAppt.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <span className="font-bold uppercase">{viewingSlipAppt.consultationType} Consultation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee:</span>
                <span className="font-extrabold text-teal-700">${viewingSlipAppt.fee} USD</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setViewingSlipAppt(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
