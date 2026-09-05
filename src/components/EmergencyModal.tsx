import React, { useState } from 'react';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { 
  Phone, 
  AlertCircle, 
  HeartPulse, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Car, 
  Activity, 
  Sparkles,
  Radio
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [ambulanceLocation, setAmbulanceLocation] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'locating' | 'dispatched'>('idle');
  const [etaMinutes, setEtaMinutes] = useState(8);

  if (!isOpen) return null;

  const handleRequestAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambulanceLocation.trim()) return;

    setDispatchStatus('locating');
    setTimeout(() => {
      setDispatchStatus('dispatched');
      setEtaMinutes(Math.floor(6 + Math.random() * 5));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-200 text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-rose-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider bg-rose-950/60 px-2.5 py-0.5 rounded-full text-rose-200 border border-rose-400/40">
                24/7 Level-1 Trauma Emergency
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Emergency Dispatch & Triage
              </h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Direct 1-Tap Call */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wide">
              Immediate Critical Ambulance / Trauma Helpline
            </p>
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>Call Hotline: {HOSPITAL_INFO.emergencyPhone}</span>
            </a>
            <p className="text-[11px] text-rose-600 font-medium">
              Zero triage waiting time. Direct line to Senior Emergency Medicine Physician.
            </p>
          </div>

          {/* Quick Ambulance Request Simulator */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-teal-600" />
                Mobile ICU Ambulance Dispatch
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                GPS Active
              </span>
            </div>

            {dispatchStatus === 'idle' && (
              <form onSubmit={handleRequestAmbulance} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Enter pickup address, landmark or postal code..."
                  value={ambulanceLocation}
                  onChange={(e) => setAmbulanceLocation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-rose-400" />
                  <span>Dispatch Nearest Mobile ICU Unit</span>
                </button>
              </form>
            )}

            {dispatchStatus === 'locating' && (
              <div className="text-center py-4 space-y-2">
                <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-semibold text-slate-700">Connecting to WeCare Trauma Control Room...</p>
              </div>
            )}

            {dispatchStatus === 'dispatched' && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ambulance Unit #08 Dispatched!</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Pickup Location:</strong> {ambulanceLocation}
                </p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200">
                  <span className="text-slate-600">Estimated Arrival (ETA):</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{etaMinutes} Minutes</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Paramedic team is on audio-standby. Keep the patient calm and stay near the phone.
                </p>
              </div>
            )}
          </div>

          {/* Emergency First-Aid Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Critical Emergency Red Flags (Act Immediately)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">1. Severe Chest Pain</p>
                <p className="text-[11px] text-slate-500">Tightness radiating to left arm/jaw, sweating, shortness of breath.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">2. Stroke Signs (FAST)</p>
                <p className="text-[11px] text-slate-500">Facial droop, arm weakness, slurred speech, sudden dizziness.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">3. Severe Breathing Distress</p>
                <p className="text-[11px] text-slate-500">Bluish lips, inability to speak in full sentences, severe asthma.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">4. Head Trauma & Seizure</p>
                <p className="text-[11px] text-slate-500">Loss of consciousness, repeated vomiting, sudden convulsions.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Emergency Window
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
