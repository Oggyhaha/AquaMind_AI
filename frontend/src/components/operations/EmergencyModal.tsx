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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl border border-red-200 animate-in zoom-in-95">
        
        <div className="flex justify-between items-center border-b border-red-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
            <h3 className="text-lg font-extrabold text-red-950">Declare Statewide Emergency Mode</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          As <strong>Secretary, Water Resources Dept</strong>, declaring Emergency Mode will alert all department roles across Gujarat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Emergency Crisis Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-950 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Target District Crisis Zone</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500"
            >
              {GUJARAT_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.region})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Emergency Crisis Description & Instructions <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30"
            >
              Broadcast Emergency Alert
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
