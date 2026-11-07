import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle, Stethoscope, Search, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { Appointment, Prescription, PrescriptionMedicine, DiagnosticTest } from '../types';
import { POPULAR_MEDICINES } from '../data/mockData';

interface DoctorWorkstationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  testsCatalog: DiagnosticTest[];
  onFinalizePrescription: (prescription: Prescription, appointmentId: string) => void;
}

export const DoctorWorkstationDrawer: React.FC<DoctorWorkstationDrawerProps> = ({
  isOpen,
  onClose,
  appointment,
  testsCatalog,
  onFinalizePrescription,
}) => {
  if (!isOpen || !appointment) return null;

  // Vitals
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('74');
  const [weight, setWeight] = useState('68');
  const [spo2, setSpo2] = useState('99%');

  // Clinical notes
  const [complaintsText, setComplaintsText] = useState(
    appointment.notes || 'Chest discomfort after exertion, morning fatigue'
  );
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension Stage 1');
  const [generalAdvice, setGeneralAdvice] = useState(
    'Strict low-sodium diet (<5g/day). 30 minutes daily brisk walking. Avoid oily foods.'
  );
  const [followUpDays, setFollowUpDays] = useState('14 Days');

  // Advised Tests
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'Complete Blood Count (CBC) with ESR',
    'Lipid Profile (Total, HDL, LDL, Triglycerides)',
  ]);

  // Medicines builder
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm-1',
      brandName: 'Tab. Bizoran 5/20',
      genericName: 'Amlodipine 5mg + Olmesartan 20mg',
      strength: '25mg',
      dosage: '1 + 0 + 0',
      timing: 'After Meal',
      duration: '1 Month',
      instructions: 'Take in the morning with water.',
    },
    {
      id: 'm-2',
      brandName: 'Tab. Seclo 20',
      genericName: 'Omeprazole',
      strength: '20mg',
      dosage: '1 + 0 + 1',
      timing: 'Before Meal',
      duration: '14 Days',
      instructions: '30 mins before food.',
    },
  ]);

  // New medicine quick adder
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredMeds = searchQuery.trim()
    ? POPULAR_MEDICINES.filter(
        (m) =>
          m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const addMedicineFromCatalog = (med: typeof POPULAR_MEDICINES[0]) => {
    const newMed: PrescriptionMedicine = {
      id: `med-${Date.now()}`,
      brandName: med.brandName,
      genericName: med.genericName,
      strength: med.strength,
      dosage: '1 + 0 + 1',
      timing: 'After Meal',
      duration: '14 Days',
      instructions: '',
    };
    setMedicines([...medicines, newMed]);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleUpdateMedicine = (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleToggleTest = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter((t) => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();

    const newPrescription: Prescription = {
      id: `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientAge: appointment.patientAge,
      patientGender: appointment.patientGender,
      patientPhone: appointment.patientPhone,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      doctorSpecialty: appointment.doctorSpecialty,
      doctorDegrees: 'MBBS, FCPS, MD (Cardiology)',
      doctorBmdc: appointment.doctorBmdc,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      vitals: {
        bloodPressure: `${bp} mmHg`,
        pulse: `${pulse} bpm`,
        weight: `${weight} kg`,
        spo2,
      },
      complaints: complaintsText.split(',').map((s) => s.trim()).filter(Boolean),
      diagnosis,
      medicines,
      advisedTests: selectedTests,
      generalAdvice,
      followUpDate: `After ${followUpDays}`,
      signedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} BDST`,
    };

    onFinalizePrescription(newPrescription, appointment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Clinical Rx Authoring Workstation</h3>
              <p className="text-[11px] text-teal-300">
                Patient: <span className="font-semibold text-white">{appointment.patientName}</span> ({appointment.patientAge}y · {appointment.patientGender})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Snapshot Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4 text-slate-600">
            <span>Appt: <strong className="font-mono text-slate-900">{appointment.id}</strong></span>
            <span>·</span>
            <span>Slot: <strong className="text-slate-900">{appointment.timeSlot}</strong></span>
            <span>·</span>
            <span>Branch: <strong className="text-teal-700">{appointment.branch}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Allergies: NKDA (None Known)
          </span>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFinalize} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Patient Vitals */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>01.</span> Physical Vitals Check
            </h4>
            <div className="grid grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Pulse (bpm)</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="74"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Weight (kg)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="68"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">SpO2</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  placeholder="99%"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Findings */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>02.</span> Complaints & Diagnosis
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Chief Complaints (comma separated)
                </label>
                <input
                  type="text"
                  value={complaintsText}
                  onChange={(e) => setComplaintsText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Clinical Diagnosis
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-teal-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Medicine Builder */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>03.</span> Prescribe Medications (Rx)
              </h4>
              <span className="text-[11px] text-teal-700 font-medium">
                {medicines.length} Item(s)
              </span>
            </div>

            {/* Quick Auto-suggest Search */}
            <div className="relative mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Bangladeshi drug catalog (e.g. Napa, Seclo, Bizoran, Monas)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {showSuggestions && filteredMeds.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {filteredMeds.map((med, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addMedicineFromCatalog(med)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <strong className="text-slate-900 font-semibold">{med.brandName}</strong>
                        <span className="text-slate-500 ml-1.5">({med.genericName})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{med.company}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Added Medicine List */}
            <div className="space-y-2.5">
              {medicines.map((med, idx) => (
                <div
                  key={med.id || idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-700">{idx + 1}.</span>
                      <strong className="text-slate-900 text-xs">{med.brandName}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">[{med.strength}]</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dosage Selectors */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Dosage Pattern</label>
                      <select
                        value={med.dosage}
                        onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                      >
                        <option value="1 + 0 + 1">1 + 0 + 1</option>
                        <option value="1 + 1 + 1">1 + 1 + 1</option>
                        <option value="1 + 0 + 0">1 + 0 + 0 (Morning)</option>
                        <option value="0 + 0 + 1">0 + 0 + 1 (Night)</option>
                        <option value="0 + 1 + 0">0 + 1 + 0 (Noon)</option>
                        <option value="1 SOS">1 SOS (If pain/fever)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Meal Timing</label>
                      <select
                        value={med.timing}
                        onChange={(e) => handleUpdateMedicine(idx, 'timing', e.target.value as any)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value="After Meal">After Meal</option>
                        <option value="Before Meal">Before Meal (30 min)</option>
                        <option value="With Food">With Food</option>
                        <option value="At Bedtime">At Bedtime</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                        placeholder="e.g. 7 Days"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Advised Diagnostic Investigations */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>04.</span> Advised Diagnostic Lab Investigations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {testsCatalog.map((t) => {
                const isSelected = selectedTests.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToggleTest(t.name)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="mr-1 text-teal-600 font-bold">✓</span>}
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: General Lifestyle Advice */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>05.</span> Lifestyle Advice & Follow-Up
            </h4>
            <div className="space-y-2">
              <textarea
                rows={2}
                value={generalAdvice}
                onChange={(e) => setGeneralAdvice(e.target.value)}
                placeholder="Dietary precautions, exercise advice, or warning symptoms..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-600">Schedule Follow-up:</span>
                <select
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="7 Days">After 7 Days</option>
                  <option value="14 Days">After 14 Days</option>
                  <option value="1 Month">After 1 Month</option>
                  <option value="3 Months">After 3 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finalize & Sign E-Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
