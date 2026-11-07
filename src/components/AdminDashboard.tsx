import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Users,
  Activity,
  Plus,
  Edit2,
  Check,
  X,
  Search,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Doctor, DiagnosticTest, AuditTransaction, Appointment } from '../types';
import { formatBDT } from '../utils/helpers';

interface AdminDashboardProps {
  doctors: Doctor[];
  tests: DiagnosticTest[];
  transactions: AuditTransaction[];
  appointments: Appointment[];
  onAddDoctor: (doctor: Doctor) => void;
  onUpdateTest: (updatedTest: DiagnosticTest) => void;
  onViewInvoice: (transaction: AuditTransaction) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  doctors,
  tests,
  transactions,
  appointments,
  onAddDoctor,
  onUpdateTest,
  onViewInvoice,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'doctors' | 'tests' | 'audit'>('analytics');

  // Doctor onboarding modal state
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiology');
  const [docDegrees, setDocDegrees] = useState('MBBS, FCPS');
  const [docBmdc, setDocBmdc] = useState('BMDC-A-');
  const [docFee, setDocFee] = useState<number>(1000);
  const [docBranch, setDocBranch] = useState<'Dhaka (Dhanmondi)' | 'Dhaka (Uttara)' | 'Chittagong (Panchlaish)' | 'Sylhet (Subidbazar)'>('Dhaka (Dhanmondi)');
  const [docRoom, setDocRoom] = useState('Room 302, Block A');

  // Inline test editing state
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTurnaround, setEditTurnaround] = useState<string>('');

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState<'All' | 'bKash' | 'Nagad'>('All');

  // Financial calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
  const bkashTotal = transactions
    .filter((t) => t.gateway === 'bKash')
    .reduce((acc, t) => acc + t.amount, 0);
  const nagadTotal = transactions
    .filter((t) => t.gateway === 'Nagad')
    .reduce((acc, t) => acc + t.amount, 0);

  const bkashPercent = totalRevenue > 0 ? Math.round((bkashTotal / totalRevenue) * 100) : 50;
  const nagadPercent = 100 - bkashPercent;

  const confirmedAppointmentsCount = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Completed'
  ).length;
  const completionRate =
    appointments.length > 0
      ? Math.round((confirmedAppointmentsCount / appointments.length) * 100)
      : 100;

  // Onboard doctor handler
  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: docName.startsWith('Dr.') || docName.startsWith('Prof.') ? docName : `Dr. ${docName}`,
      specialty: docSpecialty,
      degrees: docDegrees,
      bmdcReg: docBmdc,
      experienceYears: 10,
      consultationFee: docFee,
      branch: docBranch,
      roomNo: docRoom,
      avatar: '/src/assets/images/doctor_portrait_bmdc_1794069729415.jpg',
      availableDays: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
      slots: {
        morning: ['09:30 AM', '10:30 AM', '11:30 AM'],
        evening: ['05:00 PM', '06:00 PM', '07:00 PM'],
      },
      rating: 4.8,
      reviewsCount: 1,
      about: `Clinical specialist in ${docSpecialty} registered under Bangladesh Medical & Dental Council.`,
    };

    onAddDoctor(newDoc);
    setIsAddDoctorOpen(false);
    setDocName('');
    setDocBmdc('BMDC-A-');
  };

  // Inline test update
  const handleStartEditTest = (test: DiagnosticTest) => {
    setEditingTestId(test.id);
    setEditPrice(test.price);
    setEditTurnaround(test.turnaroundTime);
  };

  const handleSaveEditTest = (test: DiagnosticTest) => {
    onUpdateTest({
      ...test,
      price: editPrice,
      turnaroundTime: editTurnaround,
    });
    setEditingTestId(null);
  };

  // Filtered transactions
  const filteredAudit = transactions.filter((t) => {
    const matchesGateway = gatewayFilter === 'All' || t.gateway === gatewayFilter;
    const matchesSearch =
      t.patientName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      t.trxId.toLowerCase().includes(auditSearch.toLowerCase()) ||
      t.service.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesGateway && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Console Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Executive Management Console</h2>
            <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded uppercase">
              Super Admin Level
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial audits, Bangladeshi MFS distribution, clinical staff, and pathology catalog.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'analytics' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Financial Analytics
          </button>
          <button
            onClick={() => setAdminTab('doctors')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'doctors' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Medical Faculty ({doctors.length})
          </button>
          <button
            onClick={() => setAdminTab('tests')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'tests' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lab Catalog ({tests.length})
          </button>
          <button
            onClick={() => setAdminTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'audit' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            MFS Audit Trail
          </button>
        </div>
      </div>

      {/* TAB 1: Financial Analytics */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          {/* Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Hospital Revenue (MFS)
              </span>
              <p className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {formatBDT(totalRevenue)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Aggregated live from bKash & Nagad settlement</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Consultation Success Rate
              </span>
              <p className="text-3xl font-black font-mono text-teal-700 tabular-nums">
                {completionRate}%
              </p>
              <span className="text-xs text-slate-500">
                {confirmedAppointmentsCount} of {appointments.length} appointments confirmed/served
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Active Medical Faculty
              </span>
              <p className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {doctors.length} Doctors
              </p>
              <span className="text-xs text-slate-500">
                Across Dhaka Dhanmondi, Uttara, Chittagong & Sylhet
              </span>
            </div>
          </div>

          {/* MFS Distribution Breakdown Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Bangladeshi Mobile Financial Services (MFS) Gateway Share
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time transaction volume split between bKash PGW and Nagad Gateway.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono font-bold">
                <span className="text-[#D12053] flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D12053]" />
                  bKash: {formatBDT(bkashTotal)} ({bkashPercent}%)
                </span>
                <span className="text-[#F7941D] flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
                  Nagad: {formatBDT(nagadTotal)} ({nagadPercent}%)
                </span>
              </div>
            </div>

            {/* Split Bar */}
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${bkashPercent}%` }}
                className="bg-[#D12053] h-full transition-all duration-500"
                title={`bKash: ${bkashPercent}%`}
              />
              <div
                style={{ width: `${nagadPercent}%` }}
                className="bg-[#F7941D] h-full transition-all duration-500"
                title={`Nagad: ${nagadPercent}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                <span className="font-bold text-[#D12053] block">bKash Merchant Account</span>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                  A/C: 01713009988 · Merchant ID: BK-DHAKA-8491
                </p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <span className="font-bold text-[#F7941D] block">Nagad Corporate Wallet</span>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                  A/C: 01911002233 · Merchant ID: NG-HEALTH-2201
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Doctor Faculty Management */}
      {adminTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Hospital Medical Faculty</h3>
              <p className="text-xs text-slate-500">
                BMDC certified specialists, room allocations, and fee schedules.
              </p>
            </div>
            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Onboard New Doctor
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">BMDC Reg</th>
                    <th className="py-3 px-4">Specialty & Branch</th>
                    <th className="py-3 px-4">Room Allocation</th>
                    <th className="py-3 px-4 text-right">Fee (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {doc.name}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          {doc.degrees}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-700">
                        {doc.bmdcReg}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-teal-800">{doc.specialty}</span>
                        <span className="block text-[11px] text-slate-500">{doc.branch}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{doc.roomNo}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatBDT(doc.consultationFee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Diagnostic Test Catalog Manager with Inline Editing */}
      {adminTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Diagnostic Pathology & Imaging Catalog</h3>
              <p className="text-xs text-slate-500">
                Update laboratory pricing and turnaround times inline with instant patient portal sync.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Investigation Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Sample Type</th>
                    <th className="py-3 px-4">Turnaround Time</th>
                    <th className="py-3 px-4 text-right">Price (BDT)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tests.map((test) => {
                    const isEditing = editingTestId === test.id;

                    return (
                      <tr key={test.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {test.name}
                          <span className="block text-[11px] text-slate-500 font-normal line-clamp-1">
                            {test.description}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-teal-800 font-medium">{test.category}</td>
                        <td className="py-3 px-4 text-slate-600">{test.sampleType}</td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTurnaround}
                              onChange={(e) => setEditTurnaround(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-28"
                            />
                          ) : (
                            <span className="text-slate-600">{test.turnaroundTime}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono w-24 text-right"
                            />
                          ) : (
                            formatBDT(test.price)
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleSaveEditTest(test)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingTestId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditTest(test)}
                              className="py-1 px-2.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                            >
                              Edit Price
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MFS Real-Time Audit Trail */}
      {adminTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Hospital Financial Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Verified payment events from bKash and Nagad payment gateway webhooks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patient, TrxID, service..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                {(['All', 'bKash', 'Nagad'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGatewayFilter(g)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      gatewayFilter === g ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Patient / Mobile</th>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4">Gateway</th>
                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                    <th className="py-3 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredAudit.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{txn.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 tracking-wide">
                        {txn.trxId}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="font-semibold text-slate-900 block">{txn.patientName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{txn.patientPhone}</span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-700">{txn.service}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                            txn.gateway === 'bKash' ? 'bg-[#D12053]' : 'bg-[#F7941D]'
                          }`}
                        >
                          {txn.gateway}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 tabular-nums">
                        {formatBDT(txn.amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => onViewInvoice(txn)}
                          className="py-1 px-2.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Print PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Onboard New Doctor */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Onboard Medical Specialist</h3>
                <p className="text-xs text-slate-500">
                  Register new consultant with official BMDC credentials.
                </p>
              </div>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sabrina Sharmin"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Specialty Department
                  </label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neuromedicine">Neuromedicine</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    BMDC Registration ID
                  </label>
                  <input
                    type="text"
                    placeholder="BMDC-A-56123"
                    value={docBmdc}
                    onChange={(e) => setDocBmdc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Academic Degrees & Fellowships
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS (DMC), FCPS, MD, MRCP (UK)"
                  value={docDegrees}
                  onChange={(e) => setDocDegrees(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hospital Branch
                  </label>
                  <select
                    value={docBranch}
                    onChange={(e) => setDocBranch(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Dhaka (Dhanmondi)">Dhaka (Dhanmondi)</option>
                    <option value="Dhaka (Uttara)">Dhaka (Uttara)</option>
                    <option value="Chittagong (Panchlaish)">Chittagong (Panchlaish)</option>
                    <option value="Sylhet (Subidbazar)">Sylhet (Subidbazar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Consultation Fee (৳ BDT)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={docFee}
                    onChange={(e) => setDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chamber Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 405, Block B"
                  value={docRoom}
                  onChange={(e) => setDocRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="py-2 px-4 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
