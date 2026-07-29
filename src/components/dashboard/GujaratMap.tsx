import React, { useState } from 'react';
import { District, Reservoir, RiskLevel } from '../../types';
import { MapPin, Waves, AlertTriangle, ShieldCheck, Filter, Search, Layers, Compass } from 'lucide-react';

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
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showReservoirs, setShowReservoirs] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDistricts = districts.filter(d => {
    if (filterRisk !== 'all' && d.riskLevel !== filterRisk) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white border-red-600 shadow-red-500/50';
      case 'high': return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/50';
      case 'moderate': return 'bg-sky-500 text-white border-sky-600 shadow-sky-500/50';
      case 'safe': return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/50';
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">CRITICAL STRESS</span>;
      case 'high': return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">HIGH RISK</span>;
      case 'moderate': return <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">MODERATE</span>;
      case 'safe': return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">OPTIMAL</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Interactive Gujarat GIS Command Map</h3>
          </div>
          <p className="text-xs text-slate-500">Real-time water stress levels, canal flows, and major reservoirs across Gujarat</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 w-36"
            />
          </div>

          {/* Risk Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
            {['all', 'critical', 'high', 'moderate', 'safe'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  filterRisk === risk
                    ? 'bg-white text-sky-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Reservoirs Layer Toggle */}
          <button
            onClick={() => setShowReservoirs(!showReservoirs)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showReservoirs ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Reservoirs Layer</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Inspector Sidepanel Layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Vector SVG Map Container */}
        <div className="lg:col-span-2 relative min-h-[400px] bg-gradient-to-b from-sky-50/50 via-slate-50 to-blue-50/30 rounded-xl border border-slate-200/80 p-4 overflow-hidden flex flex-col justify-between">
          
          {/* Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-sm text-[11px] space-y-1">
            <div className="font-bold text-slate-800 mb-1">Risk Heatmap Legend</div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="text-slate-600">Critical Stress (&lt;40% supply)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-600">High Risk (Demand Deficit)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
              <span className="text-slate-600">Moderate Supply</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-600">Safe / Surplus</span>
            </div>
          </div>

          {/* Interactive Graphic Representation of Gujarat Grid */}
          <div className="w-full h-full min-h-[350px] relative flex items-center justify-center pt-8">
            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[460px] drop-shadow-md">
              {/* Background Narmada Canal Vector Line */}
              <path
                d="M 580 480 Q 420 320 280 250 T 150 180"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <text x="360" y="275" fill="#0369a1" fontSize="12" fontWeight="bold">Narmada Main Canal Feeder</text>

              {/* District Grid Nodes */}
              {districts.map((d) => {
                // Approximate coordinate mapping to 800x600 canvas for Gujarat SVG grid
                const x = ((d.lng - 68.5) / (74.5 - 68.5)) * 650 + 70;
                const y = 520 - ((d.lat - 20.0) / (24.5 - 20.0)) * 460;
                const isSelected = selectedDistrict?.id === d.id;

                return (
                  <g key={d.id} onClick={() => onSelectDistrict(d)} className="cursor-pointer group">
                    {/* Outer Pulse Ring if selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="24"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                    
                    {/* Main District Circle Node */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "18" : "14"}
                      className={`transition-all duration-300 ${
                        d.riskLevel === 'critical' ? 'fill-red-500 stroke-red-700' :
                        d.riskLevel === 'high' ? 'fill-amber-500 stroke-amber-700' :
                        d.riskLevel === 'moderate' ? 'fill-sky-500 stroke-sky-700' :
                        'fill-emerald-500 stroke-emerald-700'
                      } stroke-2 ${isSelected ? 'stroke-4 drop-shadow-lg' : 'hover:scale-125'}`}
                    />
                    
                    {/* Label */}
                    <text
                      x={x}
                      y={y + 28}
                      textAnchor="middle"
                      className={`text-[11px] font-bold pointer-events-none fill-slate-800 group-hover:fill-sky-900 ${
                        isSelected ? 'fill-sky-900 font-extrabold text-[13px]' : ''
                      }`}
                    >
                      {d.name}
                    </text>

                    {/* Alert Badge count */}
                    {d.activeAlertsCount > 0 && (
                      <g transform={`translate(${x + 8}, ${y - 12})`}>
                        <circle r="8" fill="#dc2626" />
                        <text x="0" y="3" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                          {d.activeAlertsCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Major Reservoirs Layer Pins */}
              {showReservoirs && reservoirs.map((res) => {
                const resX = res.name.includes('Sardar') ? 560 : res.name.includes('Ukai') ? 540 : res.name.includes('Dharoi') ? 480 : 320;
                const resY = res.name.includes('Sardar') ? 420 : res.name.includes('Ukai') ? 490 : res.name.includes('Dharoi') ? 180 : 310;
                
                return (
                  <g key={res.id} transform={`translate(${resX}, ${resY})`} className="cursor-pointer">
                    <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#0284c7" className="animate-bounce" />
                    <text x="12" y="4" fill="#075985" fontSize="10" fontWeight="bold">{res.name} ({res.fillPercentage}%)</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
            <span>Coordinates: 20.0°N – 24.5°N | 68.5°E – 74.5°E</span>
            <span>Click any district node to inspect hydrology data</span>
          </div>
        </div>

        {/* Selected District Hydrology Inspector Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
          {selectedDistrict ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedDistrict.name} District</h4>
                  <p className="text-xs text-slate-500">{selectedDistrict.region} Region</p>
                </div>
                {getRiskBadge(selectedDistrict.riskLevel)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Water Demand</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedDistrict.waterDemandMLD} MLD</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Supply</span>
                  <span className={`font-bold text-sm ${selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedDistrict.waterSupplyMLD} MLD
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Groundwater Level</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedDistrict.groundwaterLevelM} m</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Population Impact</span>
                  <span className="font-bold text-slate-800 text-sm">{(selectedDistrict.population / 1000000).toFixed(2)} M</span>
                </div>
              </div>

              {/* Water Supply Deficit Progress Bar */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Supply-Demand Balance</span>
                  <span>{Math.round((selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}% Fulfilled</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectDistrict(null)}
                  className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                  Reset Map Selection
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Click on any district node on the map to inspect real-time water health metrics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
