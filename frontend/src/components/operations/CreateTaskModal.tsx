import React, { useState } from 'react';
import { Priority, TaskStatus } from '../../types';
import { GUJARAT_DISTRICTS } from '../../data/mockData';
import { PlusCircle, X, CheckSquare } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  creatorName: string;
  creatorRole: string;
  onClose: () => void;
  onCreateTask: (taskData: {
    title: string;
    description: string;
    districtId: string;
    districtName: string;
    priority: Priority;
    assignedEngineerName: string;
    waterSavedLiters: number;
    populationBenefited: number;
  }) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  creatorName,
  creatorRole,
  onClose,
  onCreateTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [districtId, setDistrictId] = useState('ahmedabad');
  const [priority, setPriority] = useState<Priority>('high');
  const [assignedEngineerName, setAssignedEngineerName] = useState('Priya Desai (Lead Hydraulic Engineer)');
  const [waterSaved, setWaterSaved] = useState<number>(1500000);
  const [population, setPopulation] = useState<number>(25000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const districtObj = GUJARAT_DISTRICTS.find(d => d.id === districtId);
    onCreateTask({
      title,
      description,
      districtId,
      districtName: districtObj?.name || 'Ahmedabad',
      priority,
      assignedEngineerName,
      waterSavedLiters: waterSaved,
      populationBenefited: population
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-sky-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Create New Hydraulic Work Order</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Work Order Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sabarmati Canal Gate Valve Overhaul & Calibration"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Target District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500"
              >
                {GUJARAT_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500"
              >
                <option value="critical">🔴 Critical Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Technical Work Instructions <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe repair actions, sensor calibrations, pressure goals..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Assignee (Infrastructure Engineer)</label>
            <input
              type="text"
              value={assignedEngineerName}
              onChange={(e) => setAssignedEngineerName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Est. Water Saved (Liters)</label>
              <input
                type="number"
                value={waterSaved}
                onChange={(e) => setWaterSaved(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Est. Citizens Benefited</label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
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
              className="w-1/2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl shadow-md"
            >
              Dispatch Work Order
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
