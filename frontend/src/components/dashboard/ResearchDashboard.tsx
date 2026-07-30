import React from 'react';
import { FileSpreadsheet, Download, LineChart, Database, BookOpen } from 'lucide-react';
import { GUJARAT_DISTRICTS } from '../../data/mockData';

export const ResearchDashboard: React.FC = () => {
  const handleExportCSV = () => {
    alert('Exported Gujarat_10yr_Hydrology_Research_Dataset.csv successfully!');
  };

  return (
    <div className="space-y-6">

      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-black dark:via-slate-950 dark:to-blue-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-indigo-950/20 dark:shadow-black/40 ring-1 ring-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_60%)]" />

        <div className="relative flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
            <LineChart className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              GTU Hydrological Innovation & Research Lab
            </h2>
            <p className="text-xs text-indigo-200 dark:text-indigo-300 font-medium">
              Read-Only Analytics Workspace • Historical Datasets • Climate Correlation Models
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="relative px-5 py-3 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl shadow-md shadow-cyan-950/30 transition-all shrink-0 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <Download className="w-4 h-4" />
          <span>Export Research CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-black/20 space-y-4 transition-colors">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          10-Year Historical Groundwater Trends (North Gujarat Aquifers)
        </h3>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium space-y-3">
          <p className="flex items-start gap-2">
            <LineChart className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Historical cross-correlation analysis indicates a{' '}
              <strong className="text-blue-700 dark:text-cyan-400 font-bold">
                14.2% seasonal drawdown
              </strong>{' '}
              in Mehsana and Sabarkantha aquifers during the pre-monsoon March–May months.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              RAG knowledge indexing has ingested{' '}
              <strong className="text-blue-700 dark:text-cyan-400 font-bold">
                1,240 government policy papers and climate studies
              </strong>{' '}
              to model multi-decade sustainability thresholds.
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};