import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  Stethoscope,
  Building,
  User as UserIcon,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { Doctor, DiagnosticTest, Appointment, Prescription, User, AuditTransaction } from '../types';
import { formatBDT } from '../utils/helpers';

interface PatientDashboardProps {
  currentUser: User;
  doctors: Doctor[];
  tests: DiagnosticTest[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  onBookAppointment: (appointment: Appointment) => void;
  onOpenPaymentModal: (
    amount: number,
    serviceTitle: string,
    appointmentId?: string,
    labBookingId?: string
  ) => void;
  onViewPrescription: (prescription: Prescription) => void;
  onViewInvoice: (transaction: AuditTransaction) => void;
  transactions: AuditTransaction[];
  selectedDoctorFromLanding?: Doctor | null;
  onClearSelectedDoctor?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  doctors,
  tests,
  appointments,
  prescriptions,
  onBookAppointment,
  onOpenPaymentModal,
  onViewPrescription,
  onViewInvoice,
  transactions,
  selectedDoctorFromLanding,
  onClearSelectedDoctor,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'book' | 'labs' | 'prescriptions'>(
    selectedDoctorFromLanding ? 'book' : 'appointments'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Doctor search & filter
  const [docSearch, setDocSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Booking slot state
  const [activeDoctorForBooking, setActiveDoctorForBooking] = useState<Doctor | null>(
    selectedDoctorFromLanding || null
  );
  const [selectedDate, setSelectedDate] = useState('2026-11-09');
  const [selectedShift, setSelectedShift] = useState<'Morning' | 'Evening'>('Morning');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Diagnostic Lab Cart
  const [labCart, setLabCart] = useState<DiagnosticTest[]>([]);
  const [collectionType, setCollectionType] = useState<'Hospital Visit' | 'Home Sample Collection'>(
    'Hospital Visit'
  );

  // Filter patient's own appointments
  const myAppointments = appointments.filter(
    (a) => a.patientId === currentUser.id || a.patientPhone === currentUser.phone
  );

  // Filter patient's prescriptions
  const myPrescriptions = prescriptions.filter(
    (p) => p.patientId === currentUser.id || p.patientPhone === currentUser.phone
  );

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(docSearch.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty.includes(selectedSpecialty);
    const matchesBranch =
      selectedBranch === 'All' || doc.branch.includes(selectedBranch);
    return matchesSearch && matchesSpecialty && matchesBranch;
  });

  // Handle slot reservation
  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctorForBooking || !selectedTimeSlot) return;

    const newAppointment: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientPhone: currentUser.phone,
      patientAge: currentUser.age || 32,
      patientGender: currentUser.gender || 'Male',
      doctorId: activeDoctorForBooking.id,
      doctorName: activeDoctorForBooking.name,
      doctorSpecialty: activeDoctorForBooking.specialty,
      doctorBmdc: activeDoctorForBooking.bmdcReg,
      branch: activeDoctorForBooking.branch,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      shift: selectedShift,
      fee: activeDoctorForBooking.consultationFee,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      notes: bookingNote,
    };

    onBookAppointment(newAppointment);
    setBookingSuccessMsg(
      `Appointment booked with ${activeDoctorForBooking.name} for ${selectedDate} at ${selectedTimeSlot}. Status: Pending Confirmation.`
    );
    setActiveDoctorForBooking(null);
    setSelectedTimeSlot('');
    setBookingNote('');
    setActiveTab('appointments');
    if (onClearSelectedDoctor) onClearSelectedDoctor();
  };

  // Lab Cart handlers
  const addToLabCart = (test: DiagnosticTest) => {
    if (!labCart.some((t) => t.id === test.id)) {
      setLabCart([...labCart, test]);
    }
  };

  const removeFromLabCart = (testId: string) => {
    setLabCart(labCart.filter((t) => t.id !== testId));
  };

  const labSubtotal = labCart.reduce((sum, item) => sum + item.price, 0);
  const homeFee = collectionType === 'Home Sample Collection' ? (labSubtotal > 2000 ? 0 : 150) : 0;
  const labGrandTotal = labSubtotal + homeFee;

  const handleProceedToPayLab = () => {
    if (labCart.length === 0) return;
    const testNames = labCart.map((t) => t.name).join(', ');
    onOpenPaymentModal(
      labGrandTotal,
      `Diagnostic Lab Tests: ${testNames.slice(0, 40)}...`,
      undefined,
      `LAB-${Date.now().toString().slice(-4)}`
    );
    setLabCart([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <aside
          className={`${
            sidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'
          } bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-6 transition-all duration-300`}
        >
          {/* User Profile Chip */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-base shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</h4>
                <p className="text-[11px] font-mono text-slate-500 truncate">{currentUser.phone}</p>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  Patient Health ID: SHB-{currentUser.id.slice(-4).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>My Appointments</span>}
              {!sidebarCollapsed && myAppointments.length > 0 && (
                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {myAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'book'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Book Specialist Slot</span>}
            </button>

            <button
              onClick={() => setActiveTab('labs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'labs'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FlaskConical className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Diagnostic Lab Bookings</span>}
              {!sidebarCollapsed && labCart.length > 0 && (
                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-bold">
                  {labCart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'prescriptions'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Digital Prescriptions & Rx</span>}
              {!sidebarCollapsed && myPrescriptions.length > 0 && (
                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {myPrescriptions.length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Support Card */}
          {!sidebarCollapsed && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Hospital Reception Help
              </span>
              <p className="text-[11px] text-slate-500">
                Call ShebaCare desk directly for inquiries or rescheduling.
              </p>
              <a
                href="tel:10678"
                className="text-xs font-mono font-bold text-teal-700 block hover:underline"
              >
                📞 10678 (Dhanmondi HQ)
              </a>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className={`${sidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'} space-y-6`}>
          {bookingSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bookingSuccessMsg}</span>
              </div>
              <button
                onClick={() => setBookingSuccessMsg('')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: My Appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Consultation Appointments</h3>
                  <p className="text-xs text-slate-500">
                    Track status, verify payments with bKash/Nagad, and access consultations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('book')}
                  className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Book New Slot
                </button>
              </div>

              {myAppointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Active Appointments</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no consultations scheduled. Select a specialist from our medical faculty to book a slot.
                  </p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="py-2 px-4 bg-teal-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Browse BMDC Doctors
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {myAppointments.map((apt) => {
                    const isPaid = apt.paymentStatus === 'Paid';
                    const matchedTxn = transactions.find((t) => t.trxId === apt.trxId);

                    return (
                      <div
                        key={apt.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {apt.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : apt.status === 'In-Consultation'
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200 animate-pulse'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {apt.status}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
                              }`}
                            >
                              {isPaid ? `Paid via ${apt.paymentMethod || 'MFS'}` : 'Unpaid (Due)'}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-base">{apt.doctorName}</h4>
                          <p className="text-xs text-teal-700 font-medium">{apt.doctorSpecialty}</p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date} ({apt.shift})
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.timeSlot}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {apt.branch}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                          <div className="text-right sm:mr-3">
                            <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                            <span className="text-base font-black font-mono text-slate-900 tabular-nums">
                              {formatBDT(apt.fee)}
                            </span>
                          </div>

                          {!isPaid ? (
                            <button
                              onClick={() =>
                                onOpenPaymentModal(
                                  apt.fee,
                                  `Doctor Consultation: ${apt.doctorName}`,
                                  apt.id
                                )
                              }
                              className="w-full sm:w-auto py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay with bKash / Nagad
                            </button>
                          ) : matchedTxn ? (
                            <button
                              onClick={() => onViewInvoice(matchedTxn)}
                              className="w-full sm:w-auto py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              View Invoice
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Book Appointment Slot */}
          {activeTab === 'book' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Book Doctor Consultation</h3>
                <p className="text-xs text-slate-500">
                  Select your medical specialty, review BMDC credentials, and choose a preferred time slot.
                </p>
              </div>

              {/* Modal or Drawer when doctor is picked */}
              {activeDoctorForBooking ? (
                <div className="bg-white border-2 border-teal-600 rounded-2xl p-6 shadow-md space-y-6">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg">
                        {activeDoctorForBooking.name.charAt(4)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900">
                          {activeDoctorForBooking.name}
                        </h4>
                        <p className="text-xs text-teal-700 font-semibold">
                          {activeDoctorForBooking.specialty}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          BMDC: {activeDoctorForBooking.bmdcReg} · {activeDoctorForBooking.degrees}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveDoctorForBooking(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Change Doctor
                    </button>
                  </div>

                  <form onSubmit={handleConfirmAppointment} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Consultation Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Select Consultation Shift
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShift('Morning');
                              setSelectedTimeSlot('');
                            }}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                              selectedShift === 'Morning'
                                ? 'bg-teal-50 border-teal-500 text-teal-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            Morning (09:00 - 12:30)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShift('Evening');
                              setSelectedTimeSlot('');
                            }}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                              selectedShift === 'Evening'
                                ? 'bg-teal-50 border-teal-500 text-teal-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            Evening (05:00 - 08:30)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Time Slot Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Available {selectedShift} Slots ({activeDoctorForBooking.branch})
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(selectedShift === 'Morning'
                          ? activeDoctorForBooking.slots.morning
                          : activeDoctorForBooking.slots.evening
                        ).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border text-center transition-all ${
                              selectedTimeSlot === slot
                                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-400'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reason for Visit / Symptoms (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Follow-up for chest tightness, high blood pressure check..."
                        value={bookingNote}
                        onChange={(e) => setBookingNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Due Upon Booking</span>
                        <span className="font-mono font-black text-slate-900 text-lg tabular-nums">
                          {formatBDT(activeDoctorForBooking.consultationFee)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveDoctorForBooking(null)}
                          className="py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedTimeSlot}
                          className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                        >
                          Confirm & Generate Appointment
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Doctor Search & Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                    <div className="sm:col-span-6 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search doctor by name or specialty..."
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                      >
                        <option value="All">All Specialties</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Medicine">Internal Medicine</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neuromedicine">Neuromedicine</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                      >
                        <option value="All">All Branches</option>
                        <option value="Dhanmondi">Dhaka (Dhanmondi)</option>
                        <option value="Uttara">Dhaka (Uttara)</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                      </select>
                    </div>
                  </div>

                  {/* Doctor Directory Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center shrink-0 border border-teal-200">
                              {doc.name.charAt(4)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h4>
                              <p className="text-xs font-semibold text-teal-700">{doc.specialty}</p>
                              <p className="text-[11px] text-slate-500 truncate">{doc.degrees}</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-600">{doc.bmdcReg}</span>
                            <span className="font-mono font-bold text-slate-900 tabular-nums">
                              Fee: {formatBDT(doc.consultationFee)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 truncate">{doc.branch}</span>
                          <button
                            type="button"
                            onClick={() => setActiveDoctorForBooking(doc)}
                            className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                          >
                            Pick Slot &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Diagnostic Lab Bookings + Cart */}
          {activeTab === 'labs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Diagnostic Pathology & Lab Tests</h3>
                  <p className="text-xs text-slate-500">
                    Book tests with home sample collection in Dhaka or visit the nearest hospital branch.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Tests Catalog (Left) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="grid grid-cols-1 gap-2.5">
                    {tests.map((test) => {
                      const inCart = labCart.some((t) => t.id === test.id);
                      return (
                        <div
                          key={test.id}
                          className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                {test.category}
                              </span>
                              <span className="text-[11px] text-slate-400">Sample: {test.sampleType}</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 truncate">{test.name}</h4>
                            <p className="text-[11px] text-slate-500">TAT: {test.turnaroundTime}</p>
                          </div>

                          <div className="text-right shrink-0 space-y-1">
                            <span className="font-mono font-bold text-slate-900 text-sm block tabular-nums">
                              {formatBDT(test.price)}
                            </span>
                            {inCart ? (
                              <button
                                onClick={() => removeFromLabCart(test.id)}
                                className="py-1 px-2.5 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                onClick={() => addToLabCart(test)}
                                className="py-1 px-2.5 text-[11px] font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lab Cart & Checkout (Right) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>Selected Investigations</span>
                    <span className="font-mono text-teal-700">{labCart.length} item(s)</span>
                  </h4>

                  {labCart.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Your test cart is empty. Click "+ Add" on tests to calculate total and dispatch sample collection.
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto space-y-1 pr-1">
                        {labCart.map((item) => (
                          <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                            <div className="pr-2 truncate">
                              <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">Sample: {item.sampleType}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-bold text-slate-800 tabular-nums">
                                {formatBDT(item.price)}
                              </span>
                              <button
                                onClick={() => removeFromLabCart(item.id)}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Collection Mode */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Sample Collection Mode:
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setCollectionType('Hospital Visit')}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              collectionType === 'Hospital Visit'
                                ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-bold">Hospital Walk-In</span>
                            <span className="text-[10px] text-slate-500">Free collection</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCollectionType('Home Sample Collection')}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              collectionType === 'Home Sample Collection'
                                ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-bold">Home Collection</span>
                            <span className="text-[10px] text-slate-500">
                              {labSubtotal > 2000 ? 'FREE (Over ৳2K)' : '+৳150 Dhaka Metro'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Financial Calculation */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Investigations Subtotal:</span>
                          <span className="font-mono tabular-nums">{formatBDT(labSubtotal)}</span>
                        </div>
                        {collectionType === 'Home Sample Collection' && (
                          <div className="flex justify-between text-slate-600">
                            <span>Phlebotomist Dispatch Fee:</span>
                            <span className="font-mono tabular-nums">
                              {homeFee === 0 ? 'FREE' : formatBDT(homeFee)}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                          <span>Total Payable:</span>
                          <span className="font-mono font-black text-teal-800 tabular-nums">
                            {formatBDT(labGrandTotal)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleProceedToPayLab}
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Proceed to Pay with bKash / Nagad
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Digital Prescriptions & Past Records */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">E-Prescriptions & Clinical Timeline</h3>
                <p className="text-xs text-slate-500">
                  Access official prescriptions signed by your consulting BMDC doctors with full medication dosages.
                </p>
              </div>

              {myPrescriptions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Digital Prescriptions Issued Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Once a doctor finishes your consultation, your complete electronic prescription will appear here with printable PDF support.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPrescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            {rx.id}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">Date: {rx.date}</span>
                        </div>

                        <h4 className="font-bold text-base text-slate-900">{rx.doctorName}</h4>
                        <p className="text-xs text-teal-700 font-semibold">{rx.doctorSpecialty}</p>
                        <p className="text-[11px] text-slate-600 font-mono">BMDC Reg: {rx.doctorBmdc}</p>

                        <div className="pt-1">
                          <p className="text-xs text-slate-700">
                            <strong className="text-slate-900">Diagnosis:</strong> {rx.diagnosis}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Prescribed Medicines: {rx.medicines.map((m) => m.brandName).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={() => onViewPrescription(rx)}
                          className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View & Print Rx
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
