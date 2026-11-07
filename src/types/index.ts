export type UserRole = 'public' | 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  bloodGroup?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface Doctor {
  id: string;
  name: string;
  nameBn?: string;
  specialty: string;
  degrees: string;
  bmdcReg: string;
  experienceYears: number;
  consultationFee: number; // In BDT (৳)
  branch: 'Dhaka (Dhanmondi)' | 'Dhaka (Uttara)' | 'Chittagong (Panchlaish)' | 'Sylhet (Subidbazar)';
  roomNo: string;
  avatar: string;
  availableDays: string[];
  slots: {
    morning: string[];
    evening: string[];
  };
  rating: number;
  reviewsCount: number;
  about: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'In-Consultation' | 'Completed' | 'Declined';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorBmdc: string;
  branch: string;
  date: string;
  timeSlot: string;
  shift: 'Morning' | 'Evening';
  fee: number;
  status: AppointmentStatus;
  paymentStatus: 'Unpaid' | 'Paid';
  paymentMethod?: 'bKash' | 'Nagad' | 'Cash on Arrival';
  trxId?: string;
  createdAt: string;
  notes?: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology & Imaging' | 'Pathology' | 'Microbiology';
  sampleType: 'Blood' | 'Urine' | 'Stool' | 'Imaging / Scan' | 'Swab';
  turnaroundTime: string;
  price: number; // in ৳ BDT
  fastingRequired: boolean;
  description: string;
}

export interface LabBooking {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  items: {
    testId: string;
    testName: string;
    price: number;
  }[];
  totalAmount: number;
  collectionType: 'Hospital Visit' | 'Home Sample Collection (Dhaka Metro)';
  deliveryFee: number;
  date: string;
  status: 'Sample Pending' | 'In Lab Processing' | 'Report Ready';
  paymentStatus: 'Unpaid' | 'Paid';
  trxId?: string;
  gateway?: 'bKash' | 'Nagad';
  createdAt: string;
}

export interface PrescriptionMedicine {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosage: string; // e.g. "1 + 0 + 1", "1 + 1 + 1", "0 + 0 + 1", "1 + 0 + 0"
  timing: 'After Meal' | 'Before Meal' | 'With Food' | 'At Bedtime';
  duration: string; // e.g. "7 Days", "14 Days", "1 Month"
  instructions?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorDegrees: string;
  doctorBmdc: string;
  date: string;
  vitals: {
    bloodPressure: string; // e.g. 120/80 mmHg
    pulse: string; // e.g. 74 bpm
    weight: string; // e.g. 68 kg
    temperature?: string; // e.g. 98.6°F
    spo2?: string; // e.g. 99%
  };
  complaints: string[];
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advisedTests: string[];
  generalAdvice: string;
  followUpDate: string;
  signedAt: string;
}

export interface AuditTransaction {
  id: string;
  timestamp: string;
  patientName: string;
  patientPhone: string;
  service: string;
  amount: number;
  gateway: 'bKash' | 'Nagad';
  trxId: string;
  status: 'Success' | 'Refunded';
}
