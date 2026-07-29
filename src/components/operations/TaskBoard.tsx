import React, { useState } from 'react';
import { OperationalTask, TaskStatus, UserRole } from '../../types';
import { 
  CheckSquare, 
  Clock, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle, 
  FileText, 
  Camera, 
  Award,
  ChevronRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface TaskBoardProps {
  tasks: OperationalTask[];
  userRole: UserRole;
  userName: string;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus, extraData?: any) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  userRole,
  userName,
  onUpdateTaskStatus
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<OperationalTask | null>(tasks[0] || null);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  
  // Evidence Upload Modal State
  const [evidencePhoto, setEvidencePhoto] = useState<string>('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');
  const [evidenceNotes, setEvidenceNotes] = useState<string>('');

  const statusColumns: { id: TaskStatus; label: string; bg: string; border: string }[] = [
    { id: 'approved', label: '1. Approved Actions', bg: 'bg-sky-50', border: 'border-sky-200' },
    { id: 'assigned', label: '2. Assigned to Eng.', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'in_progress', label: '3. In Progress Field', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'completed', label: '4. Evidence Submitted', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'verified', label: '5. Verified & Closed', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ];

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'my_tasks' && userRole === 'engineer' && t.assignedEngineerName !== userName) return false;
    if (activeFilter === 'critical' && t.priority !== 'critical') return false;
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    onUpdateTaskStatus(selectedTask.id, 'completed', {
      evidencePhotoUrl: evidencePhoto,
      evidenceNotes: evidenceNotes || 'Field repair completed in accordance with hydraulic standards.',
      completedAt: new Date().toISOString()
    });
    setShowEvidenceModal(false);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical': return <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">🔴 Critical</span>;
      case 'high': return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">🟠 High</span>;
      default: return <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">🟢 Normal</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Closed-Loop Operations & Task Command</h2>
          </div>
          <p className="text-xs text-slate-500">
            Jira-style task execution framework with digital evidence validation & SLA tracking
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 text-xs font-semibold bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all' ? 'bg-white text-sky-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'critical' ? 'bg-white text-red-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical Only
          </button>
          {userRole === 'engineer' && (
            <button
              onClick={() => setActiveFilter('my_tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'my_tasks' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Assigned Work
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {statusColumns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`rounded-2xl p-3.5 ${col.bg} border ${col.border} min-w-[240px] flex flex-col space-y-3`}>
              
              {/* Column Header */}
              <div className="flex items-center justify-between font-bold text-xs text-slate-800 pb-2 border-b border-slate-200/60">
                <span>{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white text-slate-700 font-mono text-[11px] flex items-center justify-center border border-slate-200">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                      selectedTask?.id === task.id ? 'border-sky-500 ring-2 ring-sky-300/50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {getPriorityBadge(task.priority)}
                      <span className="text-[10px] font-mono text-slate-400">#{task.id}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{task.description}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>District:</span>
                        <strong className="text-slate-800">{task.districtName}</strong>
                      </div>

                      {task.assignedEngineerName && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Assignee:</span>
                          <strong className="text-indigo-700 font-semibold">{task.assignedEngineerName}</strong>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>SLA Due:</span>
                        </span>
                        <span className={`font-mono font-bold ${task.slaHoursRemaining <= 12 ? 'text-red-600' : 'text-slate-700'}`}>
                          {task.slaHoursRemaining > 0 ? `${task.slaHoursRemaining}h left` : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-400 italic border border-dashed border-slate-200 rounded-xl">
                    No tasks in this stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Task Inspection & Lifecycle Approval Panel */}
      {selectedTask && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-sky-600">Task #{selectedTask.id}</span>
                {getPriorityBadge(selectedTask.priority)}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTask.title}</h3>
              <p className="text-xs text-slate-500">{selectedTask.description}</p>
            </div>

            {/* Action Buttons based on User Role & Task Lifecycle */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role 1: District Officer - Assign Engineer */}
              {userRole === 'district_officer' && selectedTask.status === 'approved' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'assigned', {
                    assignedEngineerId: 'user_engineer',
                    assignedEngineerName: 'Priya Desai (Lead Hydraulic Engineer)'
                  })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign to Lead Engineer Priya Desai</span>
                </button>
              )}

              {/* Role 2: Engineer - Start Work */}
              {userRole === 'engineer' && selectedTask.status === 'assigned' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'in_progress')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Clock className="w-4 h-4" />
                  <span>Mark Work In Progress</span>
                </button>
              )}

              {/* Role 2: Engineer - Upload Evidence */}
              {userRole === 'engineer' && (selectedTask.status === 'in_progress' || selectedTask.status === 'assigned') && (
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Field Completion Evidence</span>
                </button>
              )}

              {/* Role 3: District/State Officer - Verify Work */}
              {(userRole === 'district_officer' || userRole === 'state_authority' || userRole === 'super_admin') && selectedTask.status === 'completed' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'verified', {
                    verifiedBy: `${userName} (${userRole.replace('_', ' ')})`,
                    verifiedAt: new Date().toISOString()
                  })}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Work & Close Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Audit Timeline & Impact Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Timeline Specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Operational Lifecycle Audit</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Approved By: <strong>{selectedTask.approvedBy || 'State Water Authority'}</strong></span>
                </div>
                {selectedTask.assignedEngineerName && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>Assigned Engineer: <strong>{selectedTask.assignedEngineerName}</strong></span>
                  </div>
                )}
                {selectedTask.completedAt && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Completed At: <strong>{new Date(selectedTask.completedAt).toLocaleString()}</strong></span>
                  </div>
                )}
                {selectedTask.verifiedBy && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Verified By: <strong>{selectedTask.verifiedBy}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence & Impact Display */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Field Proof & Societal Impact</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block">WATER SAVED</span>
                  <span className="text-base font-extrabold text-sky-600">
                    {(selectedTask.waterSavedLiters / 1000000).toFixed(1)} Million Liters
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block">CITIZENS BENEFITED</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {selectedTask.populationBenefited.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedTask.evidencePhotoUrl && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-600 block">Engineer Photo Attachment:</span>
                  <img
                    src={selectedTask.evidencePhotoUrl}
                    alt="Evidence"
                    className="w-full h-36 object-cover rounded-xl border border-slate-300 shadow-sm"
                  />
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                    "{selectedTask.evidenceNotes}"
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Evidence Upload Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Maintenance Completion Proof</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Photo URL (or Camera Snapshot)</label>
                <input
                  type="text"
                  value={evidencePhoto}
                  onChange={(e) => setEvidencePhoto(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono text-[11px]"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Engineer Completion Notes</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  placeholder="Describe repair actions, pressure readings, and testing results..."
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-md"
                >
                  Submit Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
