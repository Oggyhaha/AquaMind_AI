import React from 'react';
import { FileSpreadsheet, Download, LineChart, Database, BookOpen } from 'lucide-react';
import { GUJARAT_DISTRICTS } from '../../data/mockData';

export const ResearchDashboard: React.FC = () => {
  const handleExportCSV = () => {
    alert('Exported Gujarat_10yr_Hydrology_Research_Dataset.csv successfully!');
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-7 text-white shadow-xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <LineChart className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white">GTU Hydrological Innovation & Research Lab</h2>
            <p className="text-xs text-indigo-200 font-medium">Read-Only Analytics Workspace • Historical Datasets • Climate Correlation Models</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all shrink-0 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Research CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          10-Year Historical Groundwater Trends (North Gujarat Aquifers)
        </h3>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium space-y-2">
          <p>
            Historical cross-correlation analysis indicates a <strong>14.2% seasonal drawdown</strong> in Mehsana and Sabarkantha aquifers during the pre-monsoon March–May months.
          </p>
          <p>
            RAG knowledge indexing has ingested 1,240 government policy papers and climate studies to model multi-decade sustainability thresholds.
          </p>
        </div>
      </div>

    </div>
  );
};
