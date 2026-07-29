import React, { useState } from 'react';
import { District, Reservoir, RiskLevel } from '../../types';
import { Compass, Search, Layers, MapPin, Waves, AlertTriangle } from 'lucide-react';

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

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-800 text-xs font-bold">CRITICAL STRESS</span>;
      case 'high': return <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">HIGH RISK</span>;
      case 'moderate': return <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold">MODERATE</span>;
      case 'safe': return <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">OPTIMAL</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-sky-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Interactive Gujarat GIS Command Map</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time water stress levels, canal flows, and major reservoirs across all 33 districts of Gujarat
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 w-44"
            />
          </div>

          {/* Risk Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'critical', 'high', 'moderate', 'safe'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
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
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              showReservoirs ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Reservoirs Layer</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Inspector Sidepanel Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Map Container (Expanded viewBox to prevent any cutoff!) */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-sky-50/60 via-slate-50 to-blue-50/40 rounded-2xl border border-slate-200 p-4 overflow-hidden flex flex-col justify-between min-h-[480px]">
          
          {/* Map Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <div className="font-extrabold text-slate-900 mb-1">State Heatmap Legend</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 font-medium">Critical Stress (&lt;40% supply)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 font-medium">High Risk (Deficit)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 font-medium">Moderate Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 font-medium">Optimal Surplus</span>
            </div>
          </div>

          {/* SVG Viewport (950 x 680 viewBox fits Gujarat completely!) */}
          <div className="w-full h-full min-h-[440px] relative flex items-center justify-center pt-6">
            <svg viewBox="0 0 950 680" className="w-full h-auto max-h-[520px] drop-shadow-md">
              
              {/* Narmada Main Canal Feeder Vector Path */}
              <path
                d="M 680 540 Q 510 380 340 280 T 180 200"
                fill="none"
                stroke="#0284c7"
                strokeWidth="5"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
              <text x="420" y="305" fill="#0369a1" fontSize="14" fontWeight="extrabold">Narmada Main Canal Feeder</text>

              {/* District Coordinate Node Plotting (Scaled to fit full canvas bounds) */}
              {districts.map((d) => {
                // Precise math transform for Gujarat GIS bounding box
                const x = ((d.lng - 68.2) / (74.8 - 68.2)) * 740 + 100;
                const y = 600 - ((d.lat - 20.0) / (24.8 - 20.0)) * 520;
                const isSelected = selectedDistrict?.id === d.id;

                return (
                  <g key={d.id} onClick={() => onSelectDistrict(d)} className="cursor-pointer group">
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="28"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="3"
                        className="animate-ping"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "20" : "15"}
                      className={`transition-all duration-300 ${
                        d.riskLevel === 'critical' ? 'fill-red-500 stroke-red-700' :
                        d.riskLevel === 'high' ? 'fill-amber-500 stroke-amber-700' :
                        d.riskLevel === 'moderate' ? 'fill-sky-500 stroke-sky-700' :
                        'fill-emerald-500 stroke-emerald-700'
                      } stroke-2 ${isSelected ? 'stroke-4 shadow-lg' : 'hover:scale-125'}`}
                    />

                    {/* District Label */}
                    <text
                      x={x}
                      y={y + 32}
                      textAnchor="middle"
                      className={`text-xs font-bold pointer-events-none fill-slate-900 group-hover:fill-sky-900 ${
                        isSelected ? 'fill-sky-900 font-black text-sm' : ''
                      }`}
                    >
                      {d.name}
                    </text>

                    {/* Alert Badge count */}
                    {d.activeAlertsCount > 0 && (
                      <g transform={`translate(${x + 10}, ${y - 14})`}>
                        <circle r="9" fill="#dc2626" />
                        <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                          {d.activeAlertsCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Major Reservoirs Pin Layer */}
              {showReservoirs && reservoirs.map((res) => {
                const resX = res.name.includes('Sardar') ? 660 : res.name.includes('Ukai') ? 630 : res.name.includes('Dharoi') ? 560 : 380;
                const resY = res.name.includes('Sardar') ? 480 : res.name.includes('Ukai') ? 560 : res.name.includes('Dharoi') ? 220 : 360;

                return (
                  <g key={res.id} transform={`translate(${resX}, ${resY})`} className="cursor-pointer">
                    <rect x="-10" y="-10" width="20" height="20" rx="6" fill="#0284c7" className="animate-bounce" />
                    <text x="14" y="5" fill="#075985" fontSize="12" fontWeight="extrabold">{res.name} ({res.fillPercentage}%)</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-200/80 font-medium">
            <span>Grid Bounds: 20.0°N – 24.8°N | 68.2°E – 74.8°E</span>
            <span>All 33 Gujarat Districts & Reservoirs Rendered</span>
          </div>
        </div>

        {/* Selected District Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          {selectedDistrict ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selectedDistrict.name} District</h4>
                  <p className="text-xs text-slate-500 font-medium">{selectedDistrict.region} Region</p>
                </div>
                {getRiskBadge(selectedDistrict.riskLevel)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Water Demand</span>
                  <span className="font-extrabold text-slate-900 text-base">{selectedDistrict.waterDemandMLD} MLD</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Current Supply</span>
                  <span className={`font-extrabold text-base ${selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedDistrict.waterSupplyMLD} MLD
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Groundwater Level</span>
                  <span className="font-extrabold text-slate-900 text-base">{selectedDistrict.groundwaterLevelM} m</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Population Impact</span>
                  <span className="font-extrabold text-slate-900 text-base">{(selectedDistrict.population / 1000000).toFixed(2)} M</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Supply-Demand Balance</span>
                  <span>{Math.round((selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}% Fulfilled</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
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
                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Reset Map Selection
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <MapPin className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Click on any district node on the map to inspect real-time water health metrics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
