import React, { useState } from 'react';
import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_TESTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import {
  User,
  Doctor,
  DiagnosticTest,
  Appointment,
  Prescription,
  AuditTransaction,
  UserRole,
  AppointmentStatus,
} from './types';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { EmergencyModal } from './components/EmergencyModal';
import { MfsPaymentModal } from './components/MfsPaymentModal';
import { InvoiceModal } from './components/InvoiceModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { DoctorWorkstationDrawer } from './components/DoctorWorkstationDrawer';
import { CheckCircle2, ShieldAlert, Sparkles, Building, Phone, Mail } from 'lucide-react';

export default function App() {
  // Global State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Nafis Iqbal default
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activeView, setActiveView] = useState<string>('landing');

  // Medical Data State
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [tests, setTests] = useState<DiagnosticTest[]>(INITIAL_TESTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [transactions, setTransactions] = useState<AuditTransaction[]>(INITIAL_TRANSACTIONS);

  // Cross-Navigation & Modal States
  const [selectedDoctorFromLanding, setSelectedDoctorFromLanding] = useState<Doctor | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(1000);
  const [paymentServiceTitle, setPaymentServiceTitle] = useState('');
  const [paymentAppointmentId, setPaymentAppointmentId] = useState<string | undefined>();
  const [activeInvoice, setActiveInvoice] = useState<AuditTransaction | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Prescription View & Authoring States
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activeAppointmentForRx, setActiveAppointmentForRx] = useState<Appointment | null>(null);
  const [isRxDrawerOpen, setIsRxDrawerOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth & Role Switching
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'doctor') {
      setActiveView('doctor');
    } else if (user.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('patient');
    }
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()})`);
  };

  const handleRegister = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'doctor') {
      const docUser = users.find((u) => u.role === 'doctor') || INITIAL_USERS[1];
      setCurrentUser(docUser);
      setActiveView('doctor');
    } else if (role === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[2];
      setCurrentUser(adminUser);
      setActiveView('admin');
    } else if (role === 'patient') {
      const patientUser = users.find((u) => u.role === 'patient') || INITIAL_USERS[0];
      setCurrentUser(patientUser);
      setActiveView('patient');
    } else {
      setActiveView('landing');
    }
  };

  // Appointments
  const handleBookAppointment = (newAppt: Appointment) => {
    setAppointments([newAppt, ...appointments]);
    showToast(`Appointment reserved with ${newAppt.doctorName} (ID: ${newAppt.id})`);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Appointment ${id} status updated to: ${newStatus}`);
  };

  // MFS Payment Initiation & Completion
  const handleOpenPayment = (
    amount: number,
    serviceTitle: string,
    appointmentId?: string
  ) => {
    setPaymentAmount(amount);
    setPaymentServiceTitle(serviceTitle);
    setPaymentAppointmentId(appointmentId);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newTxn: AuditTransaction) => {
    setTransactions([newTxn, ...transactions]);
    setIsPaymentOpen(false);

    // If payment was for an appointment, mark it as Paid & Confirmed
    if (paymentAppointmentId) {
      setAppointments(
        appointments.map((a) =>
          a.id === paymentAppointmentId
            ? {
                ...a,
                status: 'Confirmed',
                paymentStatus: 'Paid',
                paymentMethod: newTxn.gateway,
                trxId: newTxn.trxId,
              }
            : a
        )
      );
    }

    // Automatically display printable invoice
    setActiveInvoice(newTxn);
    setIsInvoiceOpen(true);
    showToast(
      `Payment of ৳${newTxn.amount.toLocaleString()} received via ${newTxn.gateway}! TrxID: ${newTxn.trxId}`
    );
  };

  // Doctor Prescription Authoring
  const handleOpenRxDrawer = (appointment: Appointment) => {
    setActiveAppointmentForRx(appointment);
    setIsRxDrawerOpen(true);
  };

  const handleFinalizePrescription = (newRx: Prescription, appointmentId: string) => {
    setPrescriptions([newRx, ...prescriptions]);
    // Mark appointment as Completed
    setAppointments(
      appointments.map((a) =>
        a.id === appointmentId ? { ...a, status: 'Completed' } : a
      )
    );
    showToast(`E-Prescription ${newRx.id} signed & dispatched to patient.`);
  };

  // View Prescription Modal
  const handleViewPrescription = (prescription: Prescription) => {
    setActivePrescription(prescription);
    setIsPrescriptionModalOpen(true);
  };

  // View Invoice Modal
  const handleViewInvoice = (transaction: AuditTransaction) => {
    setActiveInvoice(transaction);
    setIsInvoiceOpen(true);
  };

  // Doctor Selected from Landing -> Route to Patient Dashboard
  const handleSelectDoctorForBooking = (doc: Doctor) => {
    setSelectedDoctorFromLanding(doc);
    setActiveView('patient');
    if (currentRole !== 'patient') {
      setCurrentRole('patient');
      const patientUser = users.find((u) => u.role === 'patient') || INITIAL_USERS[0];
      setCurrentUser(patientUser);
    }
  };

  // Lab Test booked from Landing
  const handleBookTestFromLanding = (test: DiagnosticTest) => {
    handleOpenPayment(test.price, `Diagnostic Test: ${test.name}`);
  };

  // Current active doctor object for doctor workstation
  const activeDoctorObj =
    doctors.find((d) => d.name === currentUser?.name) || doctors[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Role Indicator & 1-Click Quick Persona Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-teal-400">
              ShebaCare Healthtech Engine
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">
              National Accreditation: BMDC Registered · DGHS Recognized
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active View:</span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => {
                  setActiveView('landing');
                  setCurrentRole('public');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeView === 'landing'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Landing
              </button>
              <button
                onClick={() => handleSelectRole('patient')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeView === 'patient'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => handleSelectRole('doctor')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeView === 'doctor'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => handleSelectRole('admin')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeView === 'admin'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onSelectRole={handleSelectRole}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'landing' && (
          <LandingView
            doctors={doctors}
            tests={tests}
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
            onBookTest={handleBookTestFromLanding}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onNavigateToPortal={() => {
              setActiveView('patient');
              if (currentRole !== 'patient') handleSelectRole('patient');
            }}
          />
        )}

        {activeView === 'patient' && (
          <PatientDashboard
            currentUser={currentUser || INITIAL_USERS[0]}
            doctors={doctors}
            tests={tests}
            appointments={appointments}
            prescriptions={prescriptions}
            onBookAppointment={handleBookAppointment}
            onOpenPaymentModal={handleOpenPayment}
            onViewPrescription={handleViewPrescription}
            onViewInvoice={handleViewInvoice}
            transactions={transactions}
            selectedDoctorFromLanding={selectedDoctorFromLanding}
            onClearSelectedDoctor={() => setSelectedDoctorFromLanding(null)}
          />
        )}

        {activeView === 'doctor' && (
          <DoctorDashboard
            currentDoctor={activeDoctorObj}
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onOpenRxDrawer={handleOpenRxDrawer}
            onViewPrescription={handleViewPrescription}
            prescriptions={prescriptions}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            doctors={doctors}
            tests={tests}
            transactions={transactions}
            appointments={appointments}
            onAddDoctor={(newDoc) => {
              setDoctors([...doctors, newDoc]);
              showToast(`Doctor ${newDoc.name} onboarded successfully.`);
            }}
            onUpdateTest={(updatedTest) => {
              setTests(tests.map((t) => (t.id === updatedTest.id ? updatedTest : t)));
              showToast(`Updated pricing for ${updatedTest.name}`);
            }}
            onViewInvoice={handleViewInvoice}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">ShebaCare ✦</span>
                <span className="text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  সেবা কেয়ার
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                ShebaCare Digital Hospital Ltd. Pioneers in cloud-native clinical diagnostics, teleconsultation, and encrypted medical records in Bangladesh.
              </p>
              <p className="font-mono text-teal-400 font-bold text-sm">
                Emergency Hotline: 10678
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Hospital Branches</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Dhanmondi HQ: House 32, Road 7, Dhaka</li>
                <li>• Uttara Care: Sector 3, Jashimuddin Ave, Dhaka</li>
                <li>• Chittagong Wing: Panchlaish Medical Area</li>
                <li>• Sylhet Center: Subidbazar Care Hub</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Services</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• BMDC Specialist Outpatient Clinics</li>
                <li>• High-Throughput Diagnostic Pathology</li>
                <li>• Automated Home Sample Collection</li>
                <li>• 24/7 ICU & Neonatal Ambulatory Transit</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">MFS & Accreditations</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Authorized bKash PGW & Nagad MFS partner. Licensed under Directorate General of Health Services (DGHS) & BMDC regulations.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-1 bg-slate-800 text-[#D12053] font-bold font-mono rounded">
                  bKash
                </span>
                <span className="px-2 py-1 bg-slate-800 text-[#F7941D] font-bold font-mono rounded">
                  নগদ
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} ShebaCare Digital Hospital. All rights reserved.</p>
            <p>Designed for Healthcare in Bangladesh · Encrypted Health Portal</p>
          </div>
        </div>
      </footer>

      {/* Universal Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        users={users}
        onRegister={handleRegister}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <MfsPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentAmount}
        serviceTitle={paymentServiceTitle}
        patientName={currentUser?.name || 'Valued Patient'}
        patientPhone={currentUser?.phone || '01712345678'}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        transaction={activeInvoice}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        prescription={activePrescription}
      />

      <DoctorWorkstationDrawer
        isOpen={isRxDrawerOpen}
        onClose={() => setIsRxDrawerOpen(false)}
        appointment={activeAppointmentForRx}
        testsCatalog={tests}
        onFinalizePrescription={handleFinalizePrescription}
      />
    </div>
  );
}
