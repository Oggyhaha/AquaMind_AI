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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">Executive Digital Approval Chain</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between font-bold text-slate-500">
            <span>AI Recommendation #{recommendation.id}</span>
            <span className="text-sky-700 font-mono">{recommendation.districtName} District</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm leading-snug">{recommendation.title}</h4>
          <p className="text-slate-600 text-xs">{recommendation.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5 text-xs">
              Official Approval Comment / Rationale <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="State reason for approving action..."
              required
            />
          </div>

          <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 space-y-1">
            <div className="flex items-center justify-between text-sky-900 font-bold">
              <span>Digital Signature Stamp:</span>
              <span className="font-mono text-xs">{digitalSig}</span>
            </div>
            <p className="text-[11px] text-sky-800">
              Signer: <strong>{approverName}</strong> ({approverTitle}) • Timestamp: {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-600/20"
            >
              Sign & Approve Task
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
