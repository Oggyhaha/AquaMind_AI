import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { GUJARAT_DISTRICTS } from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const chartData = GUJARAT_DISTRICTS.map(d => ({
    name: d.name,
    Demand: d.waterDemandMLD,
    Supply: d.waterSupplyMLD,
  }));

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Report PDF generated & downloaded successfully! (AquaMind_Statewide_Hydrology_Report_2026.pdf)');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-900">Hydrology Analytics & Statewide Reports</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Generate executive PDF & Excel reports for Gujarat Water Resources Ministry</p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-5 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Compiling PDF Report...' : 'Export Statewide Executive PDF'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">District Supply vs Demand Discrepancy (MLD)</h3>
        <div className="h-88 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Demand" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Supply" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { title: 'Statewide Water Audit 2026', desc: 'Comprehensive supply-demand gap analysis across 33 districts', date: 'July 2026' },
          { title: 'Non-Revenue Water Loss Report', desc: 'Acoustic pipeline leak telemetry & lost volume metrics', date: 'Weekly Feed' },
          { title: 'Saurashtra Drought Vulnerability Index', desc: 'Groundwater depletion models for Rajkot & Bhavnagar', date: 'Monsoon 2026' }
        ].map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <FileText className="w-7 h-7 text-sky-600" />
              <span className="text-xs text-slate-400 font-mono font-bold">{report.date}</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">{report.title}</h4>
            <p className="text-xs text-slate-500 font-medium">{report.desc}</p>
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-slate-50 hover:bg-sky-50 text-sky-800 border border-slate-200 hover:border-sky-300 font-extrabold text-xs rounded-2xl transition-colors"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
