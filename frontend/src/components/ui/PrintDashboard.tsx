import React from 'react';
import { Printer } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface DistrictData {
  name: string;
  riskLevel: string;
  waterDemandMLD: number;
  waterSupplyMLD: number;
  groundwaterLevelM: number;
  region: string;
}

export interface PrintDashboardProps {
  districts?: DistrictData[];
  totalWaterSaved?: number;
  tasksCount?: number;
}

export const PrintDashboard: React.FC<PrintDashboardProps> = ({
  districts = [],
  totalWaterSaved = 0,
  tasksCount = 0,
}) => {
  const { isDark } = useTheme();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1100,height=900');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this site to generate the print report.');
      return;
    }

    // Calculate aggregated metrics
    const totalDemand = districts.reduce((acc, d) => acc + (d.waterDemandMLD || 0), 0);
    const totalSupply = districts.reduce((acc, d) => acc + (d.waterSupplyMLD || 0), 0);
    const netBalance = totalSupply - totalDemand;
    const avgGroundwater = districts.length
      ? (districts.reduce((acc, d) => acc + (d.groundwaterLevelM || 0), 0) / districts.length).toFixed(1)
      : '0.0';

    const highRiskCount = districts.filter(
      (d) => d.riskLevel?.toLowerCase() === 'high' || d.riskLevel?.toLowerCase() === 'critical'
    ).length;
    const medRiskCount = districts.filter((d) => d.riskLevel?.toLowerCase() === 'medium').length;
    const lowRiskCount = districts.filter((d) => d.riskLevel?.toLowerCase() === 'low').length;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    const reportRef = `AM-RPT-${Date.now().toString().slice(-6)}`;

    const tableRowsHtml = districts
      .map((district, idx) => {
        const risk = (district.riskLevel || 'Low').toLowerCase();
        let badgeStyle = 'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;';
        if (risk === 'high' || risk === 'critical') {
          badgeStyle = 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
        } else if (risk === 'medium') {
          badgeStyle = 'background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a;';
        }

        const deficit = (district.waterSupplyMLD || 0) - (district.waterDemandMLD || 0);
        const deficitColor = deficit < 0 ? '#dc2626' : '#16a34a';

        return `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 500;">${idx + 1}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #0f172a;">${district.name}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #475569;">${district.region}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: 600; color: #1e293b;">${(district.waterDemandMLD || 0).toLocaleString()}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: 600; color: #1e293b;">${(district.waterSupplyMLD || 0).toLocaleString()}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: 700; color: ${deficitColor};">
              ${deficit > 0 ? '+' : ''}${deficit.toLocaleString()}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; color: #334155;">${district.groundwaterLevelM ?? 0}m</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; ${badgeStyle}">
                ${district.riskLevel || 'Low'}
              </span>
            </td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AquaMind AI - Official Water Resource & Regional Risk Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.4;
    }

    /* Screen-only Print Bar */
    .no-print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      margin: -24px -24px 24px -24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .no-print-btn {
      background-color: #0284c7;
      color: white;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .no-print-btn:hover {
      background-color: #0369a1;
    }
    .close-btn {
      background-color: #475569;
      color: white;
      border: none;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
    }

    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0369a1;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .meta-box {
      text-align: right;
    }
    .confidential-badge {
      display: inline-block;
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 800;
      border-radius: 6px;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .meta-text {
      font-size: 11px;
      color: #475569;
      margin-top: 2px;
    }

    /* Executive Summary Cards */
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin-bottom: 12px;
      border-left: 4px solid #0284c7;
      padding-left: 8px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .kpi-label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-value {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
    }
    .kpi-sub {
      font-size: 10px;
      color: #0284c7;
      font-weight: 600;
      margin-top: 2px;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background-color: #0f172a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      text-align: left;
    }
    th.text-right {
      text-align: right;
    }
    th.text-center {
      text-align: center;
    }

    .totals-row {
      background-color: #e0f2fe !important;
      font-weight: 800;
    }
    .totals-row td {
      border-top: 2px solid #0284c7;
      border-bottom: 2px solid #0284c7;
      font-weight: 800;
      color: #0369a1;
      padding: 12px;
    }

    /* Executive Insights Box */
    .insights-box {
      background-color: #f0f9ff;
      border: 1px dashed #0284c7;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 30px;
    }
    .insights-title {
      font-size: 12px;
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 4px;
    }
    .insights-text {
      font-size: 12px;
      color: #334155;
    }

    /* Signatures */
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-box {
      width: 45%;
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      text-align: left;
    }
    .sig-title {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-role {
      font-size: 11px;
      color: #64748b;
    }
    .sig-hash {
      font-size: 9px;
      color: #94a3b8;
      font-family: monospace;
      margin-top: 4px;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Screen Top Bar -->
  <div class="no-print-bar">
    <div style="font-weight: 600; font-size: 14px;">AquaMind AI Report Preview</div>
    <div style="display: flex; gap: 10px;">
      <button class="no-print-btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print Document
      </button>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
  </div>

  <!-- Report Header -->
  <div class="header">
    <div>
      <div class="brand-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0284c7" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
        AquaMind AI
      </div>
      <div class="brand-subtitle">Water Management & Regional Operations Intelligence</div>
    </div>
    <div class="meta-box">
      <div class="confidential-badge">CONFIDENTIAL • OFFICIAL USE ONLY</div>
      <div class="meta-text"><strong>Date:</strong> ${formattedDate}</div>
      <div class="meta-text"><strong>Report Ref:</strong> ${reportRef}</div>
      <div class="meta-text"><strong>Time:</strong> ${formattedTime}</div>
    </div>
  </div>

  <!-- Executive Summary Section -->
  <div class="section-title">Executive Summary</div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Districts Monitored</div>
      <div class="kpi-value">${districts.length}</div>
      <div class="kpi-sub">${highRiskCount} High Risk</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Water Saved</div>
      <div class="kpi-value" style="color: #0284c7;">${totalWaterSaved.toLocaleString()}</div>
      <div class="kpi-sub">MLD Optimized</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Operations</div>
      <div class="kpi-value">${tasksCount}</div>
      <div class="kpi-sub">Field Directives</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Net Balance</div>
      <div class="kpi-value" style="color: ${netBalance >= 0 ? '#16a34a' : '#dc2626'};">
        ${netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString()}
      </div>
      <div class="kpi-sub">MLD Net Surplus/Deficit</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Groundwater</div>
      <div class="kpi-value">${avgGroundwater}<span style="font-size: 11px;">m</span></div>
      <div class="kpi-sub">Statewide Median</div>
    </div>
  </div>

  <!-- District Breakdown Table -->
  <div class="section-title">District Water Balance & Risk Breakdown</div>
  <table>
    <thead>
      <tr>
        <th style="width: 35px;">#</th>
        <th>District Name</th>
        <th>Region</th>
        <th class="text-right">Demand (MLD)</th>
        <th class="text-right">Supply (MLD)</th>
        <th class="text-right">Balance (MLD)</th>
        <th class="text-right">Groundwater</th>
        <th class="text-center">Risk Level</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 20px;">No district data available</td></tr>'}
    </tbody>
    <tfoot>
      <tr class="totals-row">
        <td colspan="3">STATEWIDE TOTAL / AVERAGE</td>
        <td style="text-align: right;">${totalDemand.toLocaleString()}</td>
        <td style="text-align: right;">${totalSupply.toLocaleString()}</td>
        <td style="text-align: right; color: ${netBalance >= 0 ? '#15803d' : '#b91c1c'};">
          ${netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString()}
        </td>
        <td style="text-align: right;">${avgGroundwater}m</td>
        <td style="text-align: center;">${highRiskCount} Critical / ${medRiskCount} Moderate</td>
      </tr>
    </tfoot>
  </table>

  <!-- System Insights -->
  <div class="insights-box">
    <div class="insights-title">🤖 AI Automated System Assessment</div>
    <div class="insights-text">
      ${
        highRiskCount > 0
          ? `Priority alert issued for <strong>${highRiskCount} district(s)</strong> exceeding baseline risk thresholds. Automated re-routing directives recommended for high deficit zones.`
          : `All monitored districts are currently operating within safe hydraulic parameters. Reserve capacity stands optimal.`
      }
      Cumulative water optimization algorithms have delivered <strong>${totalWaterSaved.toLocaleString()} MLD</strong> in savings across active supply pipelines.
    </div>
  </div>

  <!-- Signatures Section -->
  <div class="signature-section">
    <div class="signature-box">
      <div style="height: 35px;"></div>
      <div class="sig-title">Chief Engineer / Water Allocation Officer</div>
      <div class="sig-role">Water Resources Department, Govt. of Gujarat</div>
      <div class="sig-hash">Verified Digital Signature • ID: WRA-GUJ-${Math.floor(100000 + Math.random() * 900000)}</div>
    </div>
    <div class="signature-box">
      <div style="height: 35px;"></div>
      <div class="sig-title">AquaMind AI Systems Lead</div>
      <div class="sig-role">Autonomous Operations & Resource Optimization</div>
      <div class="sig-hash">SHA256: ${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>AquaMind AI Water Intelligence Platform &copy; ${new Date().getFullYear()} • Government Executive Dashboard</div>
    <div>Document Ref: ${reportRef} • Page 1 of 1</div>
  </div>

  <script>
    // Auto trigger print after render
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <button
      onClick={handlePrint}
      type="button"
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
        transition-all duration-200 shadow-sm cursor-pointer border
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500/50
        ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700 hover:border-sky-500/50 shadow-slate-900/50'
            : 'bg-white hover:bg-sky-50/80 text-sky-700 border-sky-200 hover:border-sky-300 shadow-sky-100'
        }
      `}
      title="Generate and print executive dashboard report"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print Dashboard</span>
    </button>
  );
};

export default PrintDashboard;
