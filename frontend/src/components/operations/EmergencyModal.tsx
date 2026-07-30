import React, { useState } from 'react';
import { GUJARAT_DISTRICTS } from '../../data/mockData';
import { ShieldAlert, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTrigger: (title: string, description: string, district: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onConfirmTrigger
}) => {
  const [title, setTitle] = useState('Kachchh Groundwater Salinity Spike & Crisis');
  const [description, setDescription] = useState('Rapal taluka TDS sensor network registered >2800 PPM salinity. Require immediate mobile water tanker & purification unit dispatch.');
  const [district, setDistrict] = useState('Kachchh');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmTrigger(title, description, district);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 dark:bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl border border-red-200 dark:border-red-500/30 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center border-b border-red-100 dark:border-red-500/20 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center ring-1 ring-red-100 dark:ring-red-500/20">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-extrabold text-red-950 dark:text-red-300 tracking-tight">Declare Statewide Emergency Mode</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          As <strong className="text-slate-800 dark:text-slate-200">Secretary, Water Resources Dept</strong>, declaring Emergency Mode will alert all department roles across Gujarat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
              Emergency Crisis Title <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-xs font-bold text-red-950 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/70 focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Target District Crisis Zone</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/70 focus:border-red-500 transition-colors"
            >
              {GUJARAT_DISTRICTS.map(d => (
                <option key={d.id} value={d.name} className="dark:bg-slate-800 dark:text-slate-100">
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
              Emergency Crisis Description & Instructions <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/70 focus:border-red-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 text-white dark:text-slate-950 font-extrabold rounded-xl shadow-lg shadow-red-600/30 dark:shadow-red-500/20 transition-colors"
            >
              Broadcast Emergency Alert
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};