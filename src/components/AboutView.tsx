import React from 'react';
import { HOSPITAL_INFO, HOSPITAL_FACILITIES } from '../data/hospitalData';
import { NavigationPage } from '../types';
import { 
  ShieldCheck, 
  Heart, 
  Award, 
  Users, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles,
  Phone,
  Activity,
  HeartHandshake,
  Microscope,
  Stethoscope,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenEmergency
}) => {
  const leadershipTeam = [
    {
      name: 'Dr. Robert Sterling, MD, FRCS',
      title: 'Founder & Chief Executive Officer',
      specialty: 'Cardiovascular Surgery & Hospital Administration',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      bio: 'Visionary healthcare leader with 30+ years in tertiary clinical management, dedicated to bringing international medical excellence to community care.'
    },
    {
      name: 'Dr. Evelyn Martinez, MD, FACOG',
      title: 'Chief Medical Director',
      specialty: 'Maternal-Fetal Medicine & Clinical Quality',
      image: 'https://images.unsplash.com/photo-1594824813590-482a537f7663?auto=format&fit=crop&w=400&q=80',
      bio: 'Oversees 45+ clinical departments, patient safety protocols, international JCI accreditations, and medical education programs.'
    },
    {
      name: 'Dr. Arthur Vance, MD, DM, FACC',
      title: 'Director of Interventional Sciences',
      specialty: 'Cardiology & Catheterization Center',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      bio: 'Pioneered zero-delay cardiac triage and robotic catheterization procedures with thousands of successful life-saving interventions.'
    },
    {
      name: 'Sister Mary Gallagher, RN, MSN',
      title: 'Chief Nursing Officer & Patient Experience Head',
      specialty: 'Critical Care Nursing & Patient Advocacy',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      bio: 'Leads our 800+ compassionate registered nursing staff with an unwavering commitment to empathetic bedside care and sterile standards.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Serving With Compassion Since {HOSPITAL_INFO.establishedYear}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl">
            About WeCare Hospitals
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Where human empathy meets surgical precision and medical innovation. We are committed to redefining clinical excellence and delivering healing you can rely on.
          </p>
        </div>
      </section>

      {/* 2. Mission, Vision, and Core Values */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              To deliver compassionate, comprehensive, and patient-centered healthcare through distinguished clinical expertise, pioneering medical research, and uncompromising safety standards.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              To stand as the most trusted healthcare institution globally, recognized for innovative robotic therapies, zero-delay emergency care, and holistic patient well-being.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-5 border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Our Core Values</h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Compassion:</strong> Dignity in every touchpoint.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Clinical Integrity:</strong> Evidence-based therapies.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Surgical Excellence:</strong> Robotic sub-millimeter precision.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Transparency:</strong> Clear pricing & communication.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Hospital Story & Milestones */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5 text-left">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
                Two Decades of Healing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From a Vision to a Multi-Specialty Healthcare Pioneer
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded in 2004 by a passionate team of cardiovascular and emergency surgeons, WeCare Hospitals began with a 60-bed facility. Today, it has grown into a 500-bed quaternary medical institution equipped with 8 centers of clinical excellence, 12 modular operating suites, and a dedicated team of over 1,200 doctors, nurses, and allied health professionals.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our relentless pursuit of quality has earned us accreditations from the Joint Commission International (JCI Gold Seal), the National Accreditation Board for Hospitals (NABH), and certified NABL diagnostic pathology laboratories.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-extrabold text-teal-700">150,000+</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Satisfied Patients Treated</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-extrabold text-teal-700">45,000+</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Successful Surgeries</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"
                  alt="WeCare Hospitals Modern Campus Facility"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <p className="text-xs font-semibold text-teal-300">Metro City Medical District</p>
                  <p className="text-lg font-bold">State-of-the-Art Quaternary Healthcare Campus</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Infrastructure & Clinical Facilities */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
            Modern Medical Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Advanced Diagnostic & Surgical Suites
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Engineered with precision engineering, clean-air laminar flow technology, and real-time digital monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {HOSPITAL_FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 overflow-hidden bg-slate-100">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {facility.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {facility.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Medical Leadership */}
      <section className="py-16 bg-slate-100/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
              Executive Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Guiding Clinical Excellence
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Our governing board comprises distinguished clinicians, surgical department chairs, and healthcare pioneers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {leadershipTeam.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col items-start"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-20 h-20 rounded-2xl object-cover mb-4 border-2 border-teal-500/20"
                />
                <h3 className="text-base font-bold text-slate-900">{leader.name}</h3>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">{leader.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{leader.specialty}</p>
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Accreditations Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">
          Recognized by National & Global Health Authorities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {HOSPITAL_INFO.accreditations.map((acc, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
              <Award className="w-10 h-10 text-teal-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">{acc.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{acc.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => onOpenBooking()}
            className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Schedule a Consultation
          </button>
          <button
            onClick={() => onNavigate('doctors')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
          >
            Meet Our Specialists
          </button>
        </div>
      </section>
    </div>
  );
};
