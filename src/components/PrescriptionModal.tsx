import React from 'react';
import { X, Printer, ShieldCheck, Stethoscope, FileText, Calendar, Activity } from 'lucide-react';
import { Prescription } from '../types';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Actions Bar (no-print) */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">
              BMDC Verified Digital E-Prescription
            </span>
            <span className="text-[11px] font-mono text-slate-500">({prescription.id})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prescription Document (printable) */}
        <div id="printable-content" className="p-8 overflow-y-auto space-y-6">
          {/* Hospital & Doctor Header */}
          <div className="flex items-start justify-between border-b-2 border-teal-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-teal-900 tracking-tight">ShebaCare ✦</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  সেবা কেয়ার ডিজিটাল হাসপাতাল
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                House #32, Road #7, Dhanmondi R/A, Dhaka-1205 · Hotline: 10678
              </p>
              <p className="text-[11px] text-slate-500">
                Department of Clinical Medicine & Outpatient Consultation
              </p>
            </div>

            <div className="text-right max-w-xs">
              <h4 className="font-bold text-slate-900 text-sm">{prescription.doctorName}</h4>
              <p className="text-[11px] text-slate-600 leading-tight">{prescription.doctorDegrees}</p>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">{prescription.doctorSpecialty}</p>
              <p className="font-mono text-[11px] font-bold text-rose-700 mt-1">
                BMDC Reg: {prescription.doctorBmdc}
              </p>
            </div>
          </div>

          {/* Patient Info Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Patient Name</span>
              <span className="font-bold text-slate-800">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Age / Gender</span>
              <span className="font-medium text-slate-800">
                {prescription.patientAge} Yrs · {prescription.patientGender}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Contact Phone</span>
              <span className="font-mono text-slate-800">{prescription.patientPhone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Consultation Date</span>
              <span className="font-medium text-slate-800">{prescription.date}</span>
            </div>
          </div>

          {/* Clinical Vitals Strip */}
          <div className="flex items-center gap-4 py-2 px-3 bg-teal-50/60 rounded-lg border border-teal-100 text-xs">
            <span className="font-bold text-teal-800 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Recorded Vitals:
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700">
              <span>
                BP: <strong className="font-mono">{prescription.vitals.bloodPressure || '120/80 mmHg'}</strong>
              </span>
              <span>·</span>
              <span>
                Pulse: <strong className="font-mono">{prescription.vitals.pulse || '72 bpm'}</strong>
              </span>
              <span>·</span>
              <span>
                Weight: <strong className="font-mono">{prescription.vitals.weight || '68 kg'}</strong>
              </span>
              {prescription.vitals.spo2 && (
                <>
                  <span>·</span>
                  <span>
                    SpO2: <strong className="font-mono">{prescription.vitals.spo2}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Main Prescription Layout: Left Clinical Notes / Right Rx */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[320px]">
            {/* Left Column: Complaints, Diagnosis, Tests */}
            <div className="md:col-span-4 border-r border-slate-200 pr-4 space-y-5">
              <div>
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Chief Complaints
                </h5>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {prescription.complaints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Clinical Diagnosis
                </h5>
                <p className="text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {prescription.diagnosis || 'Clinical evaluation'}
                </p>
              </div>

              {prescription.advisedTests.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Advised Investigations (Lab)
                  </h5>
                  <ul className="text-xs text-teal-800 space-y-1">
                    {prescription.advisedTests.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-mono font-bold text-teal-600">{idx + 1}.</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Rx Symbol & Medication Table */}
            <div className="md:col-span-8 pl-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif font-black text-teal-900 italic">℞</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Prescribed Medications
                </span>
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-200">
                {prescription.medicines.map((med, idx) => (
                  <div key={idx} className="py-2.5 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700">{idx + 1}.</span>
                        <h6 className="font-bold text-slate-900 text-sm">{med.brandName}</h6>
                        <span className="text-xs text-slate-500">({med.genericName})</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {med.strength}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-700 pl-5">
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {med.dosage}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-slate-600">{med.timing}</span>
                      <span>·</span>
                      <span className="text-slate-600">Duration: {med.duration}</span>
                    </div>

                    {med.instructions && (
                      <p className="text-[11px] text-slate-500 italic pl-5">
                        Note: {med.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* General Advice */}
              {prescription.generalAdvice && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-700">
                  <span className="font-bold text-amber-900 block mb-0.5">Lifestyle & Dietary Advice:</span>
                  <p>{prescription.generalAdvice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer & Doctor Stamp */}
          <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="font-medium text-slate-700">
                Next Follow-Up Date: <span className="font-bold text-slate-900">{prescription.followUpDate}</span>
              </p>
              <div className="flex items-center gap-1.5 text-teal-700 mt-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px]">Valid BMDC Electronic Signature & Timestamp</span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 mb-1">
                <p className="font-serif italic font-bold text-teal-900">{prescription.doctorName}</p>
              </div>
              <p className="text-[11px] text-slate-500">Digitally Authorized ({prescription.signedAt})</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close (no-print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close Prescription
          </button>
        </div>
      </div>
    </div>
  );
};
