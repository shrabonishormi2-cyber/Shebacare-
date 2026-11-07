import React, { useState } from 'react';
import { Phone, Ambulance, ShieldAlert, HeartPulse, X, CheckCircle, MapPin, Clock } from 'lucide-react';
import { validateBdPhone } from '../utils/helpers';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Dhaka (Dhanmondi)');
  const [serviceType, setServiceType] = useState<'icu' | 'standard' | 'er'>('icu');
  const [isDispatched, setIsDispatched] = useState(false);
  const [ambulanceETA, setAmbulanceETA] = useState<number | null>(null);

  if (!isOpen) return null;

  const phoneInfo = validateBdPhone(phone);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInfo.isValid) return;
    setIsDispatched(true);
    setAmbulanceETA(Math.floor(Math.random() * 8) + 7); // 7 to 14 mins
  };

  const reset = () => {
    setIsDispatched(false);
    setAmbulanceETA(null);
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Emergency Medical Care 24/7</h3>
              <p className="text-xs text-rose-100">ShebaCare Acute Response & Ambulatory Dispatch</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Hotline Banner */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600 animate-bounce" />
            <span className="text-xs font-semibold text-rose-900">National Hospital Hotline:</span>
          </div>
          <a
            href="tel:10678"
            className="font-mono font-bold text-rose-700 text-lg hover:underline tracking-tight"
          >
            📞 10678 <span className="text-xs font-normal text-rose-500">(Toll-Free)</span>
          </a>
        </div>

        <div className="p-6">
          {isDispatched ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Ambulance Dispatched!</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Our emergency response team has been alerted for <span className="font-semibold text-slate-800">{location}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Estimated Arrival:</span>
                  <span className="font-bold text-rose-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ambulanceETA} Minutes
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Service Unit:</span>
                  <span className="font-semibold text-slate-800">
                    {serviceType === 'icu' ? 'ICU Mobile Critical Unit' : 'Rapid Ambulance Service'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Caller Phone:</span>
                  <span className="font-mono text-slate-800">{phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Assigned Hospital Branch:</span>
                  <span className="font-semibold text-teal-700">{location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Please keep your phone active. The dispatch doctor will call your number within 60 seconds.
              </p>

              <button
                onClick={reset}
                className="w-full py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Emergency Service Needed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('icu')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'icu'
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Ambulance className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-bold text-slate-800">ICU Ambulance</span>
                    </div>
                    <p className="text-[11px] text-slate-500">With ventilator & paramedic</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('standard')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'standard'
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <HeartPulse className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800">Basic Transport</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Fast ER transit & oxygen</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearest ShebaCare Hospital Branch
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Dhaka (Dhanmondi)">Dhaka (Dhanmondi Branch - House 32, Road 7)</option>
                    <option value="Dhaka (Uttara)">Dhaka (Uttara Branch - Sector 3, Jashimuddin Ave)</option>
                    <option value="Chittagong (Panchlaish)">Chittagong (Panchlaish Medical Wing)</option>
                    <option value="Sylhet (Subidbazar)">Sylhet (Subidbazar Care Center)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Patient / Attendant BD Mobile Number
                  </label>
                  {phone && phoneInfo.operatorName && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${phoneInfo.badgeColor}`}>
                      {phoneInfo.operatorName}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 ${
                    phone && !phoneInfo.isValid
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 focus:ring-teal-500'
                  }`}
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be 11-digit Bangladeshi number (013, 014, 015, 016, 017, 018, 019).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!phoneInfo.isValid}
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Ambulance className="w-4 h-4" />
                  Dispatch Emergency Ambulance Now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
