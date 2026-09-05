import React, { useState } from 'react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department, Doctor } from '../types';
import { 
  Sparkles, 
  Search, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  HeartPulse, 
  Activity, 
  Brain, 
  Baby, 
  Users, 
  Stethoscope, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (preselectedDoctorId?: string, preselectedDeptId?: string) => void;
}

interface SymptomPreset {
  id: string;
  label: string;
  category: string;
  departmentId: string;
  recommendedReason: string;
  urgency: 'routine' | 'priority' | 'emergency';
}

const COMMON_SYMPTOMS: SymptomPreset[] = [
  {
    id: 's-1',
    label: 'Chest tightness, palpitations or irregular heartbeat',
    category: 'Heart & Vascular',
    departmentId: 'cardiology',
    recommendedReason: 'Cardiac evaluation, ECG/2D-Echo and coronary risk assessment.',
    urgency: 'priority'
  },
  {
    id: 's-2',
    label: 'Chronic knee, hip or shoulder joint pain & stiffness',
    category: 'Bones & Joints',
    departmentId: 'orthopedics',
    recommendedReason: 'Orthopedic joint assessment, robotic arthroplasty or arthroscopy evaluation.',
    urgency: 'routine'
  },
  {
    id: 's-3',
    label: 'Persistent migraine, dizziness, tremors or numbness',
    category: 'Brain & Spine',
    departmentId: 'neurology',
    recommendedReason: 'Neurological consultation, EEG/MRI nerve study and migraine clinic.',
    urgency: 'routine'
  },
  {
    id: 's-4',
    label: 'High fever, persistent cough or asthma in infant/child',
    category: 'Children’s Health',
    departmentId: 'pediatrics',
    recommendedReason: 'Pediatric specialist evaluation, respiratory triage and child wellness.',
    urgency: 'priority'
  },
  {
    id: 's-5',
    label: 'Severe acidity, GERD, chronic bloating or jaundice',
    category: 'Digestive & Liver',
    departmentId: 'gastroenterology',
    recommendedReason: 'Gastroenterology diagnostic endoscopy, liver function & metabolic screening.',
    urgency: 'routine'
  },
  {
    id: 's-6',
    label: 'PCOS, irregular menstrual cycles or pregnancy planning',
    category: "Women's Health",
    departmentId: 'gynecology',
    recommendedReason: 'Obstetrics & Gynecology ultrasound evaluation and hormonal profiling.',
    urgency: 'routine'
  },
  {
    id: 's-7',
    label: 'Unexplained weight loss, persistent lump or swelling',
    category: 'Oncology Screening',
    departmentId: 'oncology',
    recommendedReason: 'Comprehensive oncology screening, biopsy/tumor marker evaluation.',
    urgency: 'priority'
  },
  {
    id: 's-8',
    label: 'Acute traumatic injury, intense sudden bleeding or severe shortness of breath',
    category: 'Immediate Emergency',
    departmentId: 'emergency',
    recommendedReason: 'Direct 24/7 Level-1 Emergency & Trauma resuscitation bay.',
    urgency: 'emergency'
  }
];

export const SymptomCheckerModal: React.FC<SymptomCheckerModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomPreset | null>(null);
  const [customText, setCustomText] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: SymptomPreset) => {
    setSelectedSymptom(preset);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const lower = customText.toLowerCase();
    // smart keyword match
    if (lower.includes('heart') || lower.includes('chest') || lower.includes('bp') || lower.includes('pulse')) {
      setSelectedSymptom(COMMON_SYMPTOMS[0]);
    } else if (lower.includes('knee') || lower.includes('bone') || lower.includes('joint') || lower.includes('fracture') || lower.includes('back')) {
      setSelectedSymptom(COMMON_SYMPTOMS[1]);
    } else if (lower.includes('head') || lower.includes('brain') || lower.includes('seizure') || lower.includes('stroke') || lower.includes('spine')) {
      setSelectedSymptom(COMMON_SYMPTOMS[2]);
    } else if (lower.includes('baby') || lower.includes('child') || lower.includes('kid') || lower.includes('pediatric')) {
      setSelectedSymptom(COMMON_SYMPTOMS[3]);
    } else if (lower.includes('stomach') || lower.includes('digest') || lower.includes('acid') || lower.includes('liver') || lower.includes('gas')) {
      setSelectedSymptom(COMMON_SYMPTOMS[4]);
    } else if (lower.includes('period') || lower.includes('women') || lower.includes('pregnan') || lower.includes('uterus') || lower.includes('ovary')) {
      setSelectedSymptom(COMMON_SYMPTOMS[5]);
    } else if (lower.includes('cancer') || lower.includes('tumor') || lower.includes('lump') || lower.includes('chemo')) {
      setSelectedSymptom(COMMON_SYMPTOMS[6]);
    } else {
      setSelectedSymptom(COMMON_SYMPTOMS[0]); // default
    }
  };

  const recommendedDept = selectedSymptom
    ? DEPARTMENTS.find(d => d.id === selectedSymptom.departmentId) || DEPARTMENTS[0]
    : null;

  const deptDoctors = recommendedDept
    ? DOCTORS.filter(doc => doc.departmentId === recommendedDept.id)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-t-3xl relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Smart Clinical Guidance
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Which Specialist Should You See?
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 flex-1 overflow-y-auto">
          
          {/* Custom Search Form */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Describe your symptoms or health query:
            </label>
            <form onSubmit={handleCustomSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., severe lower back pain, persistent cough, irregular heartbeat..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Analyze
              </button>
            </form>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Or tap a common health concern:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_SYMPTOMS.map((preset) => {
                const isSelected = selectedSymptom?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">
                        {preset.category}
                      </span>
                      {preset.urgency === 'emergency' && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                      {preset.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendation Box */}
          {selectedSymptom && recommendedDept && (
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-teal-500/40 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    Recommended Department
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {recommendedDept.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedSymptom.recommendedReason}
                  </p>
                </div>
              </div>

              {/* Recommended Doctors in this Department */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Top Recommended Specialists ({deptDoctors.length} Available):
                </p>

                <div className="space-y-2">
                  {deptDoctors.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-[11px] text-teal-700">{doc.specialty}</p>
                          <p className="text-[10px] text-slate-400">Fee: ${doc.consultationFee} • {doc.experienceYears}+ Yrs Exp</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking(doc.id, recommendedDept.id);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking(undefined, recommendedDept.id);
                  }}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Book Appointment in {recommendedDept.name.split('&')[0].trim()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
