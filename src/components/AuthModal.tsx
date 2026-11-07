import React, { useState } from 'react';
import { X, ShieldCheck, Stethoscope, User as UserIcon, Lock, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { validateBdPhone } from '../utils/helpers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (newUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  users,
  onRegister,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState<number>(30);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regBlood, setRegBlood] = useState('B+');

  if (!isOpen) return null;

  const phoneInfo = validateBdPhone(regPhone);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      onLogin(found);
      onClose();
    } else {
      setError('Invalid credentials. You can use the 1-Click Demo Personas below.');
    }
  };

  const handleQuickPersona = (role: UserRole) => {
    let target = users.find((u) => u.role === role);
    if (!target) {
      if (role === 'doctor') {
        target = {
          id: 'user-doctor-1',
          name: 'Prof. Dr. Tariqul Islam',
          email: 'dr.tariq@shebacare.com',
          role: 'doctor',
          phone: '01819998877',
        };
      } else if (role === 'admin') {
        target = {
          id: 'user-admin-1',
          name: 'Hospital Superintendent (Admin)',
          email: 'admin@shebacare.com',
          role: 'admin',
          phone: '01911223344',
        };
      } else {
        target = {
          id: 'user-patient-1',
          name: 'Nafis Iqbal',
          email: 'nafis.iqbal@gmail.com',
          role: 'patient',
          phone: '01712345678',
        };
      }
    }
    onLogin(target);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInfo.isValid) return;

    const newUser: User = {
      id: `user-patient-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: 'patient',
      age: regAge,
      gender: regGender,
      bloodGroup: regBlood,
    };

    onRegister(newUser);
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Visual Column */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-6 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-lg tracking-tight">ShebaCare ✦</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                সেবা কেয়ার
              </span>
            </div>
            <h3 className="text-xl font-bold leading-tight mb-2">
              Next-Gen Bangladeshi Digital Health Portal
            </h3>
            <p className="text-xs text-teal-200 leading-relaxed">
              Access certified BMDC doctors, real-time diagnostic bookings with bKash/Nagad, and secure electronic prescriptions.
            </p>
          </div>

          {/* Quick Persona Fillers in Sidebar */}
          <div className="relative z-10 pt-4 border-t border-teal-700/50 space-y-2">
            <span className="text-[11px] font-semibold text-teal-300 block">
              1-Click Demo Personas:
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickPersona('patient')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-3.5 h-3.5 text-teal-300" />
                  <span className="font-medium text-teal-100">Patient: Nafis Iqbal</span>
                </div>
                <span className="text-[10px] text-teal-400">Sign in &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('doctor')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="font-medium text-emerald-100">Doctor: Dr. Tariqul</span>
                </div>
                <span className="text-[10px] text-emerald-400">Sign in &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('admin')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-medium text-amber-100">Superintendent (Admin)</span>
                </div>
                <span className="text-[10px] text-amber-400">Sign in &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="p-6 md:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  tab === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  tab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient Sign-Up
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. nafis.iqbal@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-teal-600 cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                Sign In to Portal
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile Quick Persona buttons */}
              <div className="pt-2 block md:hidden border-t border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Quick Demo Access:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('patient')}
                    className="px-2 py-1 text-[11px] bg-slate-100 rounded text-slate-700"
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('doctor')}
                    className="px-2 py-1 text-[11px] bg-emerald-50 rounded text-emerald-800"
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('admin')}
                    className="px-2 py-1 text-[11px] bg-amber-50 rounded text-amber-800"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per NID / Birth Cert)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nafis Iqbal"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. patient@shebacare.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Bangladeshi Mobile Number
                  </label>
                  {regPhone && phoneInfo.operatorName && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${phoneInfo.badgeColor}`}>
                      {phoneInfo.operatorName}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border rounded-xl focus:ring-2 focus:outline-none ${
                      regPhone && !phoneInfo.isValid
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-teal-500'
                    }`}
                    required
                  />
                </div>
                {regPhone && !phoneInfo.isValid && (
                  <p className="text-[10px] text-rose-500 mt-1">{phoneInfo.error}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!phoneInfo.isValid}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Registration
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              BMDC Accredited · Encrypted Health Data · 24/7 Digital Prescriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
