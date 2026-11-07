import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, ShieldCheck, Clock, Ambulance, ArrowRight, HeartPulse, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Doctor, DiagnosticTest } from '../types';
import { formatBDT } from '../utils/helpers';

interface LandingViewProps {
  doctors: Doctor[];
  tests: DiagnosticTest[];
  onSelectDoctorForBooking: (doctor: Doctor) => void;
  onBookTest: (test: DiagnosticTest) => void;
  onOpenEmergency: () => void;
  onNavigateToPortal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  doctors,
  tests,
  onSelectDoctorForBooking,
  onBookTest,
  onOpenEmergency,
  onNavigateToPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.degrees.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch =
      selectedBranch === 'All' || doc.branch.includes(selectedBranch);

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty.includes(selectedSpecialty);

    return matchesSearch && matchesBranch && matchesSpecialty;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-teal-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100/70 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>BMDC Verified Doctors · Instant bKash & Nagad Booking</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                World-Class Healthcare,{' '}
                <span className="text-teal-700 underline decoration-teal-300 decoration-wavy decoration-2">
                  Rooted in Bangladesh.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                ShebaCare Digital Hospital connects you with top-tier consultants across Dhaka, Chittagong, and Sylhet. Book doctor appointments, order home diagnostic sample collections, and access encrypted electronic prescriptions.
              </p>

              {/* Fast-Search Strip */}
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  {/* Text query */}
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Doctor name, specialty, or condition..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  {/* Branch selector */}
                  <div className="sm:col-span-3 relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
                    >
                      <option value="All">All Branches</option>
                      <option value="Dhaka">Dhaka (Dhanmondi / Uttara)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>

                  {/* Specialty selector */}
                  <div className="sm:col-span-3">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
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
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-teal-800 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> 100% BMDC Certified
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Morning & Evening Slots
                    </span>
                  </div>
                  <span className="font-mono text-teal-700 font-bold">
                    {filteredDoctors.length} Specialists Available
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hospital Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="/src/assets/images/hero_hospital_care_1794069729513.jpg"
                  alt="ShebaCare Hospital Dhanmondi Lobby"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-mono bg-teal-600/90 px-2 py-0.5 rounded font-bold">
                    Flagship Center
                  </span>
                  <h4 className="text-base font-bold mt-1">Dhanmondi Specialised Wing, Dhaka</h4>
                  <p className="text-xs text-slate-200">
                    Equipped with Siemens 128-Slice CT, 3.0T MRI, and Automated Roche Hematology Lab.
                  </p>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    24/7 ICU & Ambulance
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 block leading-none">
                    Hotline: 10678 Toll-Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Top Medical Faculty
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Consult with Verified BMDC Specialists
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose your doctor and reserve physical or teleconsultation slots in seconds.
            </p>
          </div>

          <button
            onClick={onNavigateToPortal}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            Open Full Patient Portal &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.slice(0, 6).map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback avatar styled container
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-bold text-lg">
                      {doc.name.charAt(4) || 'D'}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h3>
                    <p className="text-xs font-medium text-teal-700 truncate">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{doc.degrees}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="font-mono font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                        {doc.bmdcReg}
                      </span>
                      <span>·</span>
                      <span>{doc.experienceYears}+ yrs exp</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.about}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="font-medium text-slate-800">{doc.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {formatBDT(doc.consultationFee)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                <button
                  onClick={() => onSelectDoctorForBooking(doc)}
                  className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Book Appointment Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Diagnostic Tests Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Clinical Diagnostic Pathology & Radiology
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Popular Lab Investigations & Screening
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Accredited high-throughput automated laboratory. Book tests with home sample collection across Dhaka metropolitan or walk in.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Home Sample Collection: <strong>Available Today</strong></span>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/60 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="bg-slate-700/80 text-teal-300 px-2 py-0.5 rounded font-medium">
                      {test.category}
                    </span>
                    <span className="font-mono text-slate-300">
                      Sample: <strong className="text-white">{test.sampleType}</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                    {test.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Report Delivery: {test.turnaroundTime}</span>
                    <span className="text-base font-black font-mono text-teal-300 tabular-nums">
                      {formatBDT(test.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookTest(test)}
                    className="py-1.5 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    Add / Book
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Need tests in bulk or executive health package? Contact our lab coordinator.
            </span>
            <button
              onClick={onNavigateToPortal}
              className="py-2.5 px-5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Explore All Diagnostic Tests &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Floating Emergency Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenEmergency}
          className="flex items-center gap-2.5 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-2xl shadow-rose-600/40 border-2 border-white transition-all transform hover:scale-105 active:scale-95 group"
        >
          <Ambulance className="w-5 h-5 text-white animate-bounce" />
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider block font-black leading-none text-rose-200">
              Emergency 24/7
            </span>
            <span className="text-xs font-bold leading-tight block">
              Call 10678 / Dispatch
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
