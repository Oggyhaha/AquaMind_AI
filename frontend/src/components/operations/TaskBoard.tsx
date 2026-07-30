import React, { useState } from 'react';
import { OperationalTask, TaskStatus, UserRole } from '../../types';
import { CheckSquare, Clock, Upload, CheckCircle2, ShieldCheck, UserPlus, FileText, Camera, Award, X } from 'lucide-react';

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
  
  const [evidencePhoto, setEvidencePhoto] = useState<string>('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');
  const [evidenceNotes, setEvidenceNotes] = useState<string>('');

  const statusColumns: { id: TaskStatus; label: string; bg: string; border: string }[] = [
    { id: 'approved', label: '1. Approved Actions', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/30' },
    { id: 'assigned', label: '2. Assigned to Eng.', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/30' },
    { id: 'in_progress', label: '3. In Progress Field', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' },
    { id: 'completed', label: '4. Evidence Submitted', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30' },
    { id: 'verified', label: '5. Verified & Closed', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30' },
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
      evidenceNotes: evidenceNotes || 'Hydraulic repair completed in accordance with state maintenance specifications.',
      completedAt: new Date().toISOString()
    });
    setShowEvidenceModal(false);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical': return <span className="px-2.5 py-1 rounded bg-red-100 dark:bg-red-500/15 text-red-800 dark:text-red-400 text-xs font-extrabold">🔴 Critical</span>;
      case 'high': return <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-extrabold">🟠 High</span>;
      default: return <span className="px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-500/15 text-sky-800 dark:text-sky-400 text-xs font-extrabold">🟢 Normal</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/70 shadow-sm dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Closed-Loop Operations Command Board</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Jira-style task execution framework with digital evidence validation & SLA tracking
          </p>
        </div>

        <div className="flex items-center space-x-2.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-sky-900 dark:text-sky-300 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeFilter === 'critical'
                ? 'bg-white dark:bg-slate-700 text-red-700 dark:text-red-400 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Critical Only
          </button>
          {userRole === 'engineer' && (
            <button
              onClick={() => setActiveFilter('my_tasks')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeFilter === 'my_tasks'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              My Assigned Work
            </button>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 overflow-x-auto pb-4">
        {statusColumns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`rounded-3xl p-4 ${col.bg} border ${col.border} min-w-[260px] flex flex-col space-y-4`}>
              
              <div className="flex items-center justify-between font-extrabold text-xs text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-200/80 dark:border-slate-700/60">
                <span>{col.label}</span>
                <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md dark:hover:shadow-none dark:hover:border-slate-600 ${
                      selectedTask?.id === task.id
                        ? 'border-sky-500 dark:border-sky-500 ring-2 ring-sky-300/50 dark:ring-sky-500/30'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {getPriorityBadge(task.priority)}
                      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">#{task.id}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug mb-1">{task.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 font-medium">{task.description}</p>

                    <div className="space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>District:</span>
                        <strong className="text-slate-900 dark:text-slate-200">{task.districtName}</strong>
                      </div>

                      {task.assignedEngineerName && (
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span>Assignee:</span>
                          <strong className="text-indigo-700 dark:text-indigo-400 font-bold">{task.assignedEngineerName}</strong>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>SLA Due:</span>
                        </span>
                        <span className={`font-mono font-bold ${task.slaHoursRemaining <= 12 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.slaHoursRemaining > 0 ? `${task.slaHoursRemaining}h left` : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-400 dark:text-slate-500 italic border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    No tasks in stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Task Details & Lifecycle Controls */}
      {selectedTask && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-700/70 shadow-md dark:shadow-none space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/70 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">Task #{selectedTask.id}</span>
                {getPriorityBadge(selectedTask.priority)}
                <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold uppercase">
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">{selectedTask.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedTask.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role: District Officer - Assign Engineer */}
              {userRole === 'district_officer' && selectedTask.status === 'approved' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'assigned', {
                    assignedEngineerId: 'user_engineer',
                    assignedEngineerName: 'Priya Desai (Lead Hydraulic Engineer)'
                  })}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm dark:shadow-none transition-all flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign to Lead Engineer Priya Desai</span>
                </button>
              )}

              {/* Role: Engineer - Start Work */}
              {userRole === 'engineer' && selectedTask.status === 'assigned' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'in_progress')}
                  className="px-5 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm dark:shadow-none transition-all flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Mark Work In Progress</span>
                </button>
              )}

              {/* Role: Engineer - Upload Evidence */}
              {userRole === 'engineer' && (selectedTask.status === 'in_progress' || selectedTask.status === 'assigned') && (
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm dark:shadow-none transition-all flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Field Completion Evidence</span>
                </button>
              )}

              {/* Role: District/State Officer - Verify Work */}
              {(userRole === 'district_officer' || userRole === 'state_authority' || userRole === 'super_admin') && selectedTask.status === 'completed' && (
                <button
                  onClick={() => onUpdateTaskStatus(selectedTask.id, 'verified', {
                    verifiedBy: `${userName} (${userRole.replace('_', ' ')})`,
                    verifiedAt: new Date().toISOString()
                  })}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm dark:shadow-none transition-all flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Work & Close Task</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Operational Audit & Signature History</h4>
              <div className="space-y-2.5 text-xs font-medium">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Approved By: <strong className="text-slate-900 dark:text-slate-100">{selectedTask.approvedBy || 'State Water Authority'}</strong></span>
                </div>
                {selectedTask.digitalSignature && (
                  <div className="p-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-200 dark:border-sky-500/30 text-sky-900 dark:text-sky-300 font-mono text-xs">
                    Digital Signature Stamp: <strong>{selectedTask.digitalSignature}</strong>
                    {selectedTask.approvalComment && (
                      <p className="font-sans font-medium text-slate-700 dark:text-slate-400 mt-1 italic">"{selectedTask.approvalComment}"</p>
                    )}
                  </div>
                )}
                {selectedTask.assignedEngineerName && (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
                    <span>Assigned Engineer: <strong className="text-slate-900 dark:text-slate-100">{selectedTask.assignedEngineerName}</strong></span>
                  </div>
                )}
                {selectedTask.completedAt && (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                    <span>Completed At: <strong className="text-slate-900 dark:text-slate-100">{new Date(selectedTask.completedAt).toLocaleString()}</strong></span>
                  </div>
                )}
                {selectedTask.verifiedBy && (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <Award className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
                    <span>Verified By: <strong className="text-slate-900 dark:text-slate-100">{selectedTask.verifiedBy}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Field Evidence & Societal Impact</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold block uppercase">WATER SAVED</span>
                  <span className="text-base font-black text-sky-600 dark:text-sky-400">
                    {(selectedTask.waterSavedLiters / 1000000).toFixed(1)} Million Liters
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold block uppercase">CITIZENS BENEFITED</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {selectedTask.populationBenefited.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedTask.evidencePhotoUrl && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Engineer Photo Attachment:</span>
                  <img
                    src={selectedTask.evidencePhotoUrl}
                    alt="Evidence"
                    className="w-full h-40 object-cover rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xs"
                  />
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
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
        <div className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700/70 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/70 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upload Maintenance Completion Proof</h3>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Evidence Photo URL (or Field Camera Shot)</label>
                <input
                  type="text"
                  value={evidencePhoto}
                  onChange={(e) => setEvidencePhoto(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 font-mono text-xs transition-colors"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Field Maintenance Notes</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500/70 focus:border-sky-500 font-medium transition-colors resize-none"
                  placeholder="Describe repair actions, pressure readings, and testing results..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-sky-600 dark:bg-sky-500 text-white dark:text-slate-950 font-extrabold rounded-xl hover:bg-sky-700 dark:hover:bg-sky-400 shadow-md dark:shadow-sky-500/20 transition-colors"
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