import React, { useState } from 'react';
import { District, Reservoir, RiskLevel } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Compass, Search, Layers, MapPin } from 'lucide-react';

interface GujaratMapProps {
  districts: District[];
  reservoirs: Reservoir[];
  selectedDistrict: District | null;
  onSelectDistrict: (district: District | null) => void;
}

export const GujaratMap: React.FC<GujaratMapProps> = ({
  districts,
  reservoirs,
  selectedDistrict,
  onSelectDistrict
}) => {
  const { isDark } = useTheme();
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showReservoirs, setShowReservoirs] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDistricts = districts.filter(d => {
    if (filterRisk !== 'all' && d.riskLevel !== filterRisk) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return <span className="px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-extrabold">CRITICAL STRESS</span>;
      case 'high': return <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-extrabold">HIGH RISK</span>;
      case 'moderate': return <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-xs font-extrabold">MODERATE</span>;
      case 'safe': return <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">OPTIMAL</span>;
    }
  };

  const reservoirPositions: Record<string, { x: number; y: number; labelDx: number; labelDy: number }> = {
    'res_sardar_sarovar': { x: 800, y: 430, labelDx: 15, labelDy: 5 },
    'res_ukai': { x: 770, y: 525, labelDx: 15, labelDy: 5 },
    'res_dharoi': { x: 670, y: 150, labelDx: 15, labelDy: -5 },
    'res_kadana': { x: 810, y: 240, labelDx: 15, labelDy: 5 },
    'res_shetrunji': { x: 550, y: 495, labelDx: -110, labelDy: 18 },
    'res_aaji': { x: 410, y: 385, labelDx: -100, labelDy: 18 }
  };

  // Theme-aware SVG colors
  const svgTextFill = isDark ? '#e2e8f0' : '#0f172a';
  const svgSubTextFill = isDark ? '#94a3b8' : '#64748b';
  const canalStroke = isDark ? '#38bdf8' : '#0284c7';
  const canalTextFill = isDark ? '#7dd3fc' : '#0369a1';
  const reservoirPillBg = isDark ? '#1e293b' : '#ffffff';
  const reservoirPillStroke = isDark ? '#38bdf8' : '#0284c7';
  const reservoirPillText = isDark ? '#7dd3fc' : '#075985';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700/70 shadow-sm p-6 space-y-5 transition-colors duration-300">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Interactive Gujarat GIS Command Map</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time water stress levels, canal flows, and major reservoirs across all 33 districts of Gujarat
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 w-44 transition-colors"
            />
          </div>

          {/* Risk Level Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['all', 'critical', 'high', 'moderate', 'safe'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterRisk === risk
                    ? 'bg-white dark:bg-slate-700 text-sky-900 dark:text-sky-300 font-extrabold shadow-xs border border-slate-200 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Reservoirs Layer Toggle */}
          <button
            onClick={() => setShowReservoirs(!showReservoirs)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              showReservoirs
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Reservoirs Layer</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Inspector Sidepanel */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Canvas Container */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-sky-50/70 via-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:via-slate-900 dark:to-sky-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 overflow-hidden flex flex-col justify-between min-h-[520px] transition-colors duration-300">
          
          {/* Map Legend */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1.5 transition-colors">
            <div className="font-extrabold text-slate-900 dark:text-white mb-1">Gujarat Water Stress Heatmap</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Critical Stress (&lt;40% supply)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">High Risk (Deficit)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 inline-block"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Moderate Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Optimal Surplus</span>
            </div>
          </div>

          {/* SVG Viewport */}
          <div className="w-full h-full min-h-[480px] relative flex items-center justify-center pt-4">
            <svg viewBox="0 0 1000 700" className="w-full h-auto max-h-[560px] drop-shadow-md select-none">
              
              {/* Gujarat State Boundary Outline */}
              <defs>
                <linearGradient id="boundaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? '#0c4a6e' : '#bae6fd'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isDark ? '#164e63' : '#a5f3fc'} stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M 130 80 L 180 55 L 240 45 L 310 50 L 380 40 L 450 55 L 530 60 L 600 55 L 660 50 L 720 55 L 780 70 L 830 85 L 870 110 L 890 150 L 900 200 L 895 250 L 880 300 L 870 350 L 860 400 L 855 440 L 860 470 L 870 510 L 875 550 L 865 590 L 840 620 L 800 635 L 750 640 L 700 630 L 660 615 L 620 600 L 580 590 L 540 585 L 500 590 L 460 600 L 420 610 L 380 605 L 340 595 L 310 580 L 280 560 L 250 540 L 230 520 L 210 490 L 195 460 L 180 430 L 165 400 L 150 360 L 140 320 L 135 280 L 130 240 L 125 200 L 120 160 L 125 120 Z"
                fill="url(#boundaryGradient)"
                stroke={isDark ? '#1e3a5f' : '#7dd3fc'}
                strokeWidth="2"
                strokeDasharray="6 3"
                opacity="0.6"
              />
              {/* State label */}
              <text x="490" y="660" textAnchor="middle" fill={isDark ? '#475569' : '#94a3b8'} fontSize="14" fontWeight="bold" letterSpacing="4" opacity="0.5">
                GUJARAT
              </text>
              {/* Narmada Main Canal Feeder Line */}
              <path
                d="M 800 430 Q 720 370 650 260 T 410 380 T 210 240"
                fill="none"
                stroke={canalStroke}
                strokeWidth="4"
                strokeDasharray="7 5"
                className="animate-pulse"
              />
              <text x="520" y="270" fill={canalTextFill} fontSize="13" fontWeight="extrabold">
                Narmada Main Canal Feeder
              </text>

              {/* RENDER FILTERED DISTRICT NODES */}
              {filteredDistricts.map((d) => {
                const x = ((d.lng - 68.5) / (74.5 - 68.5)) * 840 + 80;
                const y = 620 - ((d.lat - 20.2) / (24.5 - 20.2)) * 540;
                const isSelected = selectedDistrict?.id === d.id;

                return (
                  <g key={d.id} onClick={() => onSelectDistrict(d)} className="cursor-pointer group">
                    {isSelected && (
                      <circle cx={x} cy={y} r="28" fill="none" stroke="#0ea5e9" strokeWidth="3" className="animate-ping" />
                    )}

                    <circle
                      cx={x} cy={y}
                      r={isSelected ? "18" : "14"}
                      className={`transition-all duration-300 ${
                        d.riskLevel === 'critical' ? 'fill-red-500 stroke-red-700' :
                        d.riskLevel === 'high' ? 'fill-amber-500 stroke-amber-700' :
                        d.riskLevel === 'moderate' ? 'fill-sky-500 stroke-sky-700' :
                        'fill-emerald-500 stroke-emerald-700'
                      } stroke-2 ${isSelected ? 'stroke-4 shadow-lg' : 'hover:scale-125'}`}
                    />

                    <text
                      x={x} y={y + 24}
                      textAnchor="middle"
                      fill={svgTextFill}
                      className={`text-xs font-bold pointer-events-none ${isSelected ? 'font-black text-sm' : ''}`}
                    >
                      {d.name}
                    </text>

                    {d.activeAlertsCount > 0 && (
                      <g transform={`translate(${x + 8}, ${y - 12})`}>
                        <circle r="9" fill="#dc2626" />
                        <text x="0" y="3.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                          {d.activeAlertsCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Major Reservoirs Pin Layer */}
              {showReservoirs && reservoirs.map((res) => {
                const pos = reservoirPositions[res.id] || { x: 500, y: 350, labelDx: 15, labelDy: 5 };
                return (
                  <g key={res.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer">
                    <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                    <g transform={`translate(${pos.labelDx}, ${pos.labelDy})`}>
                      <rect
                        x="-4" y="-12"
                        width={res.name.length * 7.5 + 45}
                        height="20" rx="6"
                        fill={reservoirPillBg}
                        stroke={reservoirPillStroke}
                        strokeWidth="1.5"
                        className="drop-shadow-xs"
                      />
                      <text x="4" y="2" fill={reservoirPillText} fontSize="11" fontWeight="extrabold">
                        💧 {res.name} ({res.fillPercentage}%)
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 font-medium">
            <span>Showing {filteredDistricts.length} of {districts.length} Gujarat Districts</span>
            <span>Grid Bounds: 20.2°N – 24.5°N | 68.5°E – 74.5°E</span>
          </div>
        </div>

        {/* Selected District Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 transition-colors">
          {selectedDistrict ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDistrict.name} District</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedDistrict.region} Region</p>
                </div>
                {getRiskBadge(selectedDistrict.riskLevel)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Water Demand</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{selectedDistrict.waterDemandMLD} MLD</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Current Supply</span>
                  <span className={`font-extrabold text-base ${selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {selectedDistrict.waterSupplyMLD} MLD
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Groundwater Level</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{selectedDistrict.groundwaterLevelM} m</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Population Impact</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{(selectedDistrict.population / 1000000).toFixed(2)} M</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Supply-Demand Balance</span>
                  <span>{Math.round((selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}% Fulfilled</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onSelectDistrict(null)}
                className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Reset Map Selection
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-3">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-medium">Click on any district node on the map to inspect real-time water health metrics.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};