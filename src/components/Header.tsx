import React from 'react';
import { Phone, User as UserIcon, ShieldAlert, LogOut, ArrowRight, Stethoscope, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  currentRole: UserRole;
  onOpenAuth: () => void;
  onOpenEmergency: () => void;
  onSelectRole: (role: UserRole) => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onOpenAuth,
  onOpenEmergency,
  onSelectRole,
  activeView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              onNavigate('landing');
              onSelectRole('public');
            }}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
              ✦
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                ShebaCare
              </span>
              <span className="text-[10px] font-semibold text-teal-700 tracking-wide block leading-none">
                ডিজিটাল হাসপাতাল
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => {
                onNavigate('landing');
                onSelectRole('public');
              }}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap ${
                activeView === 'landing' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              Public Services
            </button>
            <button
              onClick={() => {
                onNavigate('patient');
                if (currentRole !== 'patient') onSelectRole('patient');
              }}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap ${
                activeView === 'patient' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => {
                onNavigate('doctor');
                if (currentRole !== 'doctor') onSelectRole('doctor');
              }}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap ${
                activeView === 'doctor' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              Doctor Workstation
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                if (currentRole !== 'admin') onSelectRole('admin');
              }}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap ${
                activeView === 'admin' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              Hospital Admin
            </button>
          </nav>

          {/* Zone 3: Actions & Hotline Pill */}
          <div className="flex items-center gap-3 shrink-0">
            {/* National Hotline Button */}
            <button
              onClick={onOpenEmergency}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>📞 10678</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100/80 p-1 pl-2.5 rounded-full border border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 capitalize block leading-none">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onOpenAuth}
                  title="Switch Persona / Log out"
                  className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 text-xs font-bold shadow-xs transition-colors"
                >
                  {currentUser.name.charAt(0)}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="py-2 px-3 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('patient');
                    onSelectRole('patient');
                  }}
                  className="py-2 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
