import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Lock, KeyRound, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';
import { formatBDT, validateBdPhone, generateTrxId } from '../utils/helpers';
import { AuditTransaction } from '../types';

interface MfsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceTitle: string;
  patientName: string;
  patientPhone: string;
  onPaymentSuccess: (transaction: AuditTransaction) => void;
}

export const MfsPaymentModal: React.FC<MfsPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  serviceTitle,
  patientName,
  patientPhone,
  onPaymentSuccess,
}) => {
  const [gateway, setGateway] = useState<'bKash' | 'Nagad'>('bKash');
  const [step, setStep] = useState<'account' | 'otp' | 'pin' | 'processing'>('account');
  const [walletPhone, setWalletPhone] = useState(patientPhone || '01712345678');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const phoneInfo = validateBdPhone(walletPhone);
  const DEMO_OTP = '739201';

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInfo.isValid) {
      setError('Please provide a valid 11-digit Bangladeshi mobile number.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP sent to your mobile.');
      return;
    }
    setError('');
    setStep('pin');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredPinLen = gateway === 'bKash' ? 5 : 4;
    if (pin.length !== requiredPinLen) {
      setError(`Please enter your ${requiredPinLen}-digit ${gateway} PIN.`);
      return;
    }
    setError('');
    setStep('processing');

    setTimeout(() => {
      const trxId = generateTrxId(gateway);
      const newTransaction: AuditTransaction = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        patientName,
        patientPhone: walletPhone,
        service: serviceTitle,
        amount,
        gateway,
        trxId,
        status: 'Success',
      };

      onPaymentSuccess(newTransaction);
    }, 1800);
  };

  const reset = () => {
    setStep('account');
    setOtp('');
    setPin('');
    setError('');
    onClose();
  };

  const isBkash = gateway === 'bKash';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Gateway Brand Header */}
        <div
          className={`px-6 py-5 text-white transition-colors duration-300 ${
            isBkash ? 'bg-[#D12053]' : 'bg-[#F7941D]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Brand Logo Stylized */}
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg">
                {isBkash ? 'bK' : 'নগদ'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg tracking-tight">
                    {isBkash ? 'bKash Payment' : 'Nagad Payment'}
                  </h3>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    Secured
                  </span>
                </div>
                <p className="text-xs text-white/90">Merchant: ShebaCare Digital Hospital Ltd</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Callout */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-white/80">Total Payable:</span>
            <span className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatBDT(amount)}
            </span>
          </div>
        </div>

        {/* Gateway Switcher Tabs */}
        {step !== 'processing' && (
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => {
                setGateway('bKash');
                setPin('');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                isBkash
                  ? 'border-[#D12053] text-[#D12053] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#D12053]" />
              bKash Wallet
            </button>
            <button
              type="button"
              onClick={() => {
                setGateway('Nagad');
                setPin('');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                !isBkash
                  ? 'border-[#F7941D] text-[#F7941D] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
              Nagad Account
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'account' && (
            <form onSubmit={handleAccountNext} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Your {gateway} Account Number (11 Digits)
                  </label>
                  {walletPhone && phoneInfo.operatorName && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${phoneInfo.badgeColor}`}>
                      {phoneInfo.operatorName}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  By clicking Proceed, you agree to the terms of {gateway} payment gateway.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Billing For:</span>
                  <span className="font-medium text-slate-800">{serviceTitle}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Patient:</span>
                  <span className="font-medium text-slate-800">{patientName}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!phoneInfo.isValid}
                className={`w-full py-3 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  isBkash ? 'bg-[#D12053] hover:bg-[#b01742]' : 'bg-[#F7941D] hover:bg-[#de7e0f]'
                } disabled:opacity-50`}
              >
                Proceed & Receive OTP
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpNext} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6 text-slate-700" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">Enter Verification Code (OTP)</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  A 6-digit code has been dispatched to <span className="font-mono font-medium text-slate-800">{walletPhone}</span>
                </p>
              </div>

              {/* Demo OTP Helper Pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-medium">
                  Simulated OTP: <span className="font-mono font-bold">{DEMO_OTP}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(DEMO_OTP)}
                  className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-lg hover:bg-emerald-100/50"
                >
                  Auto-fill
                </button>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-xl font-mono tracking-widest py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className={`w-2/3 py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBkash ? 'bg-[#D12053] hover:bg-[#b01742]' : 'bg-[#F7941D] hover:bg-[#de7e0f]'
                  } disabled:opacity-50`}
                >
                  Verify OTP
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6 text-slate-700" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">
                  Enter {gateway} PIN ({gateway === 'bKash' ? '5 Digits' : '4 Digits'})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  To confirm payment of <span className="font-mono font-bold text-slate-800">{formatBDT(amount)}</span>
                </p>
              </div>

              {/* Quick Test PIN Helper */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-2 text-center">
                <span className="text-[11px] text-slate-600">
                  Demo PIN hint: <span className="font-mono font-bold text-slate-800">{gateway === 'bKash' ? '12345' : '1234'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPin(gateway === 'bKash' ? '12345' : '1234')}
                  className="ml-2 text-[10px] font-bold text-teal-700 underline"
                >
                  Fill Demo PIN
                </button>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={gateway === 'bKash' ? 5 : 4}
                  placeholder={gateway === 'bKash' ? '• • • • •' : '• • • •'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-widest py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={pin.length !== (gateway === 'bKash' ? 5 : 4)}
                  className={`w-2/3 py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBkash ? 'bg-[#D12053] hover:bg-[#b01742]' : 'bg-[#F7941D] hover:bg-[#de7e0f]'
                  } disabled:opacity-50`}
                >
                  Confirm Payment
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin mx-auto flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-800">
                  Verifying with Bangladesh Bank Interbank Switch...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Validating {gateway} transaction authorization. Please do not close this window.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>256-Bit SSL Encrypted Payment</span>
          </div>
          <span className="font-mono text-slate-400">Bangladesh Bank Reg: MFS-02</span>
        </div>
      </div>
    </div>
  );
};
