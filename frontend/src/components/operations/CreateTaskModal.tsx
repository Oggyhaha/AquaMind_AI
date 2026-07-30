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
    <div className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700/70 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/70 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center ring-1 ring-sky-100 dark:ring-sky-500/20">
              <PlusCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Create New Hydraulic Work Order</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
              Work Order Title <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sabarmati Canal Gate Valve Overhaul & Calibration"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Target District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              >
                {GUJARAT_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id} className="dark:bg-slate-800 dark:text-slate-100">
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              >
                <option value="critical" className="dark:bg-slate-800 dark:text-slate-100">🔴 Critical Priority</option>
                <option value="high" className="dark:bg-slate-800 dark:text-slate-100">🟠 High Priority</option>
                <option value="medium" className="dark:bg-slate-800 dark:text-slate-100">🟡 Medium Priority</option>
                <option value="low" className="dark:bg-slate-800 dark:text-slate-100">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
              Technical Work Instructions <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe repair actions, sensor calibrations, pressure goals..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Assignee (Infrastructure Engineer)</label>
            <input
              type="text"
              value={assignedEngineerName}
              onChange={(e) => setAssignedEngineerName(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Est. Water Saved (Liters)</label>
              <input
                type="number"
                value={waterSaved}
                onChange={(e) => setWaterSaved(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">Est. Citizens Benefited</label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              />
            </div>
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
              className="w-1/2 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-900 font-extrabold rounded-xl shadow-md dark:shadow-sky-500/20 transition-colors"
            >
              Dispatch Work Order
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};