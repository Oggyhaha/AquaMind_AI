import React, { useState } from 'react';
import { AIRecommendation } from '../../types';
import { ShieldCheck, Lock, FileText, CheckCircle2, X } from 'lucide-react';

interface DigitalApprovalModalProps {
  isOpen: boolean;
  recommendation: AIRecommendation | null;
  approverName: string;
  approverTitle: string;
  onClose: () => void;
  onConfirmApproval: (recId: string, approvalComment: string, digitalSignature: string) => void;
}

export const DigitalApprovalModal: React.FC<DigitalApprovalModalProps> = ({
  isOpen,
  recommendation,
  approverName,
  approverTitle,
  onClose,
  onConfirmApproval
}) => {
  const [comment, setComment] = useState<string>('Reservoir release approved due to predicted water shortage in Saurashtra region.');

  if (!isOpen || !recommendation) return null;

  const digitalSig = `DIG-SIG-STATE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmApproval(recommendation.id, comment, digitalSig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700/70 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/70 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center ring-1 ring-sky-100 dark:ring-sky-500/20">
              <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Executive Digital Approval Chain</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
            <span>AI Recommendation #{recommendation.id}</span>
            <span className="text-sky-700 dark:text-sky-400 font-mono">{recommendation.districtName} District</span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">{recommendation.title}</h4>
          <p className="text-slate-600 dark:text-slate-400 text-xs">{recommendation.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5 text-xs">
              Official Approval Comment / Rationale <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 font-medium transition-colors resize-none"
              placeholder="State reason for approving action..."
              required
            />
          </div>

          <div className="bg-sky-50/70 dark:bg-sky-500/10 p-3.5 rounded-xl border border-sky-200 dark:border-sky-500/30 space-y-1">
            <div className="flex items-center justify-between text-sky-900 dark:text-sky-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Digital Signature Stamp:
              </span>
              <span className="font-mono text-xs">{digitalSig}</span>
            </div>
            <p className="text-[11px] text-sky-800 dark:text-sky-400/90">
              Signer: <strong className="text-sky-900 dark:text-sky-300">{approverName}</strong> ({approverTitle}) • Timestamp: {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-900 font-extrabold text-xs rounded-xl shadow-md shadow-sky-600/20 dark:shadow-sky-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Sign & Approve Task
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};