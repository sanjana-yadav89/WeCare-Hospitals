export type NavigationPage = 'home' | 'about' | 'departments' | 'doctors' | 'book' | 'my-appointments' | 'admin';

export type ConsultationType = 'in-person' | 'video' | 'emergency';

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g., "Senior Consultant & Interventional Cardiologist"
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  image: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  timeSlots: string[];
  languages: string[];
  opdRoom: string;
  education: string[];
  awards?: string[];
  isAvailableToday?: boolean;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  heroImage: string;
  shortDescription: string;
  fullDescription: string;
  headOfDepartment: {
    name: string;
    title: string;
  };
  commonConditions: string[];
  keyProcedures: string[];
  facilities: string[];
  stats: {
    label: string;
    value: string;
  }[];
  doctorIds: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  departmentId: string;
  departmentName: string;
  consultationType: ConsultationType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:30 AM"
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail: string;
  patientAddress?: string;
  reason: string;
  isFirstVisit: boolean;
  status: AppointmentStatus;
  createdAt: string;
  fee: number;
  notes?: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  location: string;
  treatment: string;
  department: string;
  doctorName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface HospitalFacility {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  image: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  targetAudience: string;
  testsCount: number;
  originalPrice: number;
  discountedPrice: number;
  features: string[];
  popular?: boolean;
}

export interface EmergencyService {
  title: string;
  phone: string;
  availability: string;
  description: string;
  icon: string;
}
