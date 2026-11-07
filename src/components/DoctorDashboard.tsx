import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  PhoneCall,
  Stethoscope,
  Play,
  FileEdit,
  Search,
  Filter,
  Check,
  XCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Appointment, Doctor, Prescription, User, AppointmentStatus } from '../types';
import { formatBDT } from '../utils/helpers';

interface DoctorDashboardProps {
  currentDoctor: Doctor;
  appointments: Appointment[];
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onOpenRxDrawer: (appointment: Appointment) => void;
  onViewPrescription: (prescription: Prescription) => void;
  prescriptions: Prescription[];
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentDoctor,
  appointments,
  onUpdateAppointmentStatus,
  onOpenRxDrawer,
  onViewPrescription,
  prescriptions,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Doctor's appointments
  const docAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id || a.doctorName.includes(currentDoctor.name.split(' ')[2] || '')
  );

  // KPIs
  const todayCount = docAppointments.length;
  const completedCount = docAppointments.filter((a) => a.status === 'Completed').length;
  const pendingCount = docAppointments.filter((a) => a.status === 'Pending').length;
  const inConsultCount = docAppointments.filter((a) => a.status === 'In-Consultation').length;

  const filtered = docAppointments.filter((apt) => {
    const matchesFilter = filterStatus === 'All' || apt.status === filterStatus;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-50 border border-teal-200 shrink-0">
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentDoctor.name}</h2>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                {currentDoctor.bmdcReg}
              </span>
            </div>
            <p className="text-xs text-teal-700 font-semibold">{currentDoctor.specialty}</p>
            <p className="text-[11px] text-slate-500">
              {currentDoctor.degrees} · {currentDoctor.branch} ({currentDoctor.roomNo})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Today's Schedule</span>
            <span className="text-xs font-bold text-slate-800">
              Shift: Morning & Evening
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Scheduled Today</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            {todayCount}
          </p>
          <span className="text-[10px] text-slate-400">Total patient slots</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Completed Consults</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
            {completedCount}
          </p>
          <span className="text-[10px] text-emerald-600">Prescriptions signed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-600 tabular-nums">
            {pendingCount}
          </p>
          <span className="text-[10px] text-amber-600">Awaiting queue accept</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">In-Consultation</span>
            <Stethoscope className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black font-mono text-rose-600 tabular-nums">
            {inConsultCount}
          </p>
          <span className="text-[10px] text-rose-600">Active chair vitals</span>
        </div>
      </div>

      {/* Patient Queue Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Clinical Queue & Consultations</h3>
            <p className="text-xs text-slate-500">
              Manage live patient flow, confirm bookings, and author digital e-prescriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {['All', 'Pending', 'Confirmed', 'In-Consultation', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filterStatus === s
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No patients found matching current queue filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Queue ID</th>
                  <th className="py-3 px-4">Patient Profile</th>
                  <th className="py-3 px-4">Slot & Shift</th>
                  <th className="py-3 px-4">Fee / Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((apt) => {
                  const associatedRx = prescriptions.find((p) => p.appointmentId === apt.id);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {apt.id}
                      </td>

                      {/* Patient */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {apt.patientAge}y · {apt.patientGender} · {apt.patientPhone}
                        </div>
                        {apt.notes && (
                          <div className="text-[10px] text-teal-800 truncate max-w-xs mt-0.5">
                            Note: {apt.notes}
                          </div>
                        )}
                      </td>

                      {/* Slot */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{apt.timeSlot}</div>
                        <div className="text-[11px] text-slate-500">{apt.date} ({apt.shift})</div>
                      </td>

                      {/* Fee */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 tabular-nums">
                          {formatBDT(apt.fee)}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                            apt.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {apt.paymentStatus === 'Paid' ? `Paid (${apt.paymentMethod || 'MFS'})` : 'Unpaid'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'In-Consultation'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : apt.status === 'Completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => onUpdateAppointmentStatus(apt.id, 'Confirmed')}
                                className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Accept
                              </button>
                              <button
                                onClick={() => onUpdateAppointmentStatus(apt.id, 'Declined')}
                                className="py-1 px-2 text-slate-500 hover:text-rose-600 rounded-lg text-[11px]"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => {
                                onUpdateAppointmentStatus(apt.id, 'In-Consultation');
                                onOpenRxDrawer(apt);
                              }}
                              className="py-1 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Start Consultation
                            </button>
                          )}

                          {apt.status === 'In-Consultation' && (
                            <button
                              onClick={() => onOpenRxDrawer(apt)}
                              className="py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                            >
                              <FileEdit className="w-3 h-3" /> Write / Sign Rx
                            </button>
                          )}

                          {apt.status === 'Completed' && associatedRx && (
                            <button
                              onClick={() => onViewPrescription(associatedRx)}
                              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> View Signed Rx
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
