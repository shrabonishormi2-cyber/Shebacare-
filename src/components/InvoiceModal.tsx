import React from 'react';
import { X, Printer, CheckCircle2, Download, Building2, ShieldCheck } from 'lucide-react';
import { AuditTransaction } from '../types';
import { formatBDT } from '../utils/helpers';

interface InvoiceModalProps {
  transaction: AuditTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isBkash = transaction.gateway === 'bKash';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Actions (no-print) */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">
              Payment Successful & Verified
            </span>
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

        {/* Printable Invoice Container */}
        <div id="printable-content" className="p-8 space-y-6">
          {/* Hospital Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-teal-800 tracking-tight">ShebaCare ✦</span>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  ডিজিটাল হাসপাতাল
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">ShebaCare Digital Hospital Ltd.</p>
              <p className="text-[11px] text-slate-500">
                House #32, Road #7, Dhanmondi R/A, Dhaka-1205, Bangladesh
              </p>
              <p className="text-[11px] text-slate-500">
                Hotline: 10678 | Helpdesk: support@shebacare.com
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                PAID INVOICE
              </span>
              <p className="font-mono text-xs text-slate-500">
                Date: {transaction.timestamp}
              </p>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-[11px] text-slate-500">Billed To (Patient):</p>
              <p className="font-bold text-slate-900 text-sm">{transaction.patientName}</p>
              <p className="font-mono text-slate-600">{transaction.patientPhone}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">Transaction ID:</p>
              <p className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                {transaction.trxId}
              </p>
              <div className="mt-1 flex items-center justify-end gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                    isBkash ? 'bg-[#D12053]' : 'bg-[#F7941D]'
                  }`}
                >
                  {transaction.gateway} MFS
                </span>
                <span className="text-[11px] text-slate-500">Authorized</span>
              </div>
            </div>
          </div>

          {/* Itemized Service Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 font-semibold">
                <th className="py-2 text-left">Description of Service</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-medium text-slate-800">
                  {transaction.service}
                  <span className="block text-[11px] text-slate-500 font-normal">
                    ShebaCare Electronic Healthcare System Registration
                  </span>
                </td>
                <td className="py-3 text-center text-slate-600">1</td>
                <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {formatBDT(transaction.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td colSpan={2} className="pt-3 font-bold text-slate-800 text-right">
                  Total Paid:
                </td>
                <td className="pt-3 font-mono font-black text-slate-900 text-right text-base tabular-nums">
                  {formatBDT(transaction.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Digital Signature & Verification Note */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-teal-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by Bangladesh Bank Authorized MFS Gateway</span>
              </div>
              <p>This is a computer-generated receipt. No physical signature is required.</p>
            </div>
            <div className="text-right">
              <div className="w-20 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">
                [ DIGITAL SEAL ]
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close (no-print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
