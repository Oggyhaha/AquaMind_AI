import React, { useMemo, useState } from 'react';
import { District, Reservoir, RiskLevel } from '../../types';
import { Compass, Search, Layers, MapPin } from 'lucide-react';

interface GujaratMapProps {
  districts: District[];
  reservoirs: Reservoir[];
  selectedDistrict: District | null;
  onSelectDistrict: (district: District | null) => void;
}

// Shared geographic bounds used to project every lat/lng pair (districts,
// reservoirs, and the state outline) into the same 950x680 SVG canvas.
const MAP_BOUNDS = {
  minLat: 19.9,
  maxLat: 24.85,
  minLng: 68.0,
  maxLng: 74.6,
  width: 950,
  height: 680,
  padding: 55,
};

const project = (lat: number, lng: number): [number, number] => {
  const usableWidth = MAP_BOUNDS.width - MAP_BOUNDS.padding * 2;
  const usableHeight = MAP_BOUNDS.height - MAP_BOUNDS.padding * 2;

  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * usableWidth +
    MAP_BOUNDS.padding;

  const y =
    usableHeight -
    ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * usableHeight +
    MAP_BOUNDS.padding;

  return [x, y];
};

// Real Gujarat state boundary (mainland + Kutch + Saurashtra peninsula),
// derived from the Survey of India 2011 district boundaries (union of all
// 33 districts, simplified). Expressed as [lat, lng] pairs and projected
// with the same helper used for districts and reservoirs, so everything
// lines up on one shared coordinate system.
const GUJARAT_OUTLINE_LATLNG: [number, number][] = [
  [23.653, 68.095], [23.601, 68.142], [23.593, 68.299], [23.496, 68.326], [23.518, 68.48],
  [23.42, 68.4], [23.437, 68.45], [23.35, 68.487], [23.371, 68.581], [23.338, 68.559],
  [23.328, 68.621], [23.301, 68.544], [23.248, 68.54], [23.301, 68.635], [23.224, 68.584],
  [23.08, 68.759], [22.838, 69.196], [22.774, 69.472], [22.811, 69.417], [22.8, 69.682],
  [22.92, 70.08], [22.953, 70.036], [22.978, 70.108], [23.215, 70.312], [23.177, 70.505],
  [23.214, 70.712], [23.117, 70.689], [23.029, 70.561], [22.96, 70.541], [22.967, 70.432],
  [22.934, 70.497], [22.845, 70.466], [22.816, 70.404], [22.904, 70.427], [22.907, 70.375],
  [22.553, 70.126], [22.543, 69.976], [22.5, 69.971], [22.495, 69.89], [22.451, 69.914],
  [22.465, 69.805], [22.415, 69.782], [22.485, 69.737], [22.359, 69.655], [22.328, 69.333],
  [22.195, 69.148], [22.422, 69.195], [22.375, 69.121], [22.41, 69.11], [22.39, 69.035],
  [22.478, 69.069], [22.311, 68.936], [21.958, 69.217], [21.83, 69.372], [21.888, 69.396],
  [21.829, 69.372], [21.539, 69.722], [21.115, 70.091], [20.848, 70.448], [20.69, 70.827],
  [20.719, 70.813], [20.738, 71.08], [20.869, 71.437], [20.97, 71.557], [20.943, 71.529],
  [21.199, 72.112], [21.303, 72.108], [21.625, 72.309], [21.808, 72.162], [21.824, 72.242],
  [21.891, 72.204], [22.058, 72.225], [22.144, 72.323], [22.315, 72.376], [22.3, 72.419],
  [22.209, 72.427], [22.321, 72.516], [22.275, 72.737], [22.232, 72.756], [22.304, 72.945],
  [22.241, 72.913], [22.173, 72.752], [22.216, 72.648], [22.182, 72.567], [21.944, 72.509],
  [21.885, 72.515], [21.883, 72.57], [21.955, 72.667], [21.749, 72.597], [21.678, 72.528],
  [21.658, 72.807], [21.581, 72.611], [21.535, 72.635], [21.539, 72.737], [21.453, 72.651],
  [21.475, 72.735], [21.317, 72.598], [21.225, 72.657], [21.099, 72.621], [21.062, 72.75],
  [20.932, 72.757], [20.576, 72.904], [20.468, 72.855], [20.38, 72.897], [20.337, 72.777],
  [20.128, 72.738], [20.142, 72.824], [20.225, 72.859], [20.209, 72.963], [20.274, 72.912],
  [20.291, 73.035], [20.361, 73.097], [20.303, 73.101], [20.289, 73.167], [20.223, 73.06],
  [20.159, 73.065], [20.208, 73.169], [20.186, 73.218], [20.128, 73.188], [20.123, 73.249],
  [20.209, 73.299], [20.198, 73.417], [20.39, 73.379], [20.536, 73.493], [20.649, 73.392],
  [20.736, 73.467], [20.654, 73.496], [20.679, 73.521], [20.563, 73.67], [20.62, 73.838],
  [20.692, 73.812], [20.742, 73.942], [20.982, 73.901], [21.009, 73.807], [21.085, 73.808],
  [21.118, 73.618], [21.171, 73.577], [21.14, 73.719], [21.174, 73.816], [21.271, 73.823],
  [21.299, 73.942], [21.405, 73.939], [21.419, 74.045], [21.475, 74.063], [21.448, 74.101],
  [21.498, 74.321], [21.568, 74.3], [21.532, 74.195], [21.569, 74.165], [21.498, 73.852],
  [21.628, 73.78], [21.676, 73.895], [21.824, 73.796], [21.948, 74.147], [22.015, 74.092],
  [22.085, 74.179], [22.098, 74.124], [22.212, 74.123], [22.219, 74.072], [22.355, 74.065],
  [22.32, 74.19], [22.394, 74.291], [22.476, 74.191], [22.419, 74.12], [22.506, 74.083],
  [22.49, 74.034], [22.542, 74.041], [22.521, 74.151], [22.644, 74.264], [22.634, 74.379],
  [22.852, 74.476], [22.908, 74.461], [22.897, 74.393], [23.164, 74.269], [23.19, 74.203],
  [23.157, 74.155], [23.266, 74.139], [23.332, 74.029], [23.31, 73.985], [23.372, 73.975],
  [23.334, 73.892], [23.447, 73.829], [23.454, 73.756], [23.41, 73.721], [23.458, 73.692],
  [23.435, 73.621], [23.621, 73.656], [23.654, 73.573], [23.607, 73.523], [23.703, 73.508],
  [23.791, 73.352], [23.927, 73.421], [24.105, 73.362], [24.002, 73.243], [24.195, 73.067],
  [24.364, 73.219], [24.396, 73.077], [24.499, 73.086], [24.48, 72.993], [24.399, 72.95],
  [24.378, 72.977], [24.337, 72.911], [24.367, 72.725], [24.464, 72.683], [24.519, 72.539],
  [24.417, 72.5], [24.415, 72.457], [24.515, 72.441], [24.585, 72.246], [24.629, 72.347],
  [24.621, 72.165], [24.712, 72.058], [24.634, 71.94], [24.682, 71.872], [24.609, 71.852],
  [24.677, 71.792], [24.639, 71.655], [24.68, 71.478], [24.616, 71.288], [24.69, 71.097],
  [24.636, 71.009], [24.543, 70.987], [24.444, 70.998], [24.406, 71.122], [24.348, 70.947],
  [24.295, 70.874], [24.259, 70.907], [24.221, 70.806], [24.252, 70.571], [24.422, 70.573],
  [24.295, 70.11], [24.171, 70.025], [24.171, 69.731], [24.293, 69.594], [24.236, 69.194],
  [24.274, 69.095], [24.223, 69.003], [24.303, 68.945], [24.213, 68.865], [24.314, 68.808],
  [24.296, 68.765], [23.971, 68.753], [23.98, 68.358], [23.924, 68.332], [23.875, 68.209],
  [23.696, 68.172], [23.653, 68.095],
];

// A small coastal landmass in the Gulf of Khambhat, rendered as a separate
// closed path so it doesn't connect to the mainland outline.
const GUJARAT_COASTAL_ISLAND_LATLNG: [number, number][] = [
  [21.967, 72.293], [21.841, 72.311], [21.798, 72.357], [21.819, 72.389], [21.884, 72.4],
  [21.963, 72.444], [22.006, 72.424], [22.029, 72.375], [22.013, 72.329], [21.967, 72.293],
];

export const GujaratMap: React.FC<GujaratMapProps> = ({
  districts,
  reservoirs,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showReservoirs, setShowReservoirs] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically filter districts by risk level & search query
  const filteredDistricts = districts.filter((d) => {
    if (filterRisk !== 'all' && d.riskLevel !== filterRisk) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-800 text-xs font-extrabold">
            CRITICAL STRESS
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-extrabold">
            HIGH RISK
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-extrabold">
            MODERATE
          </span>
        );
      case 'safe':
        return (
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-extrabold">
            OPTIMAL
          </span>
        );
    }
  };

  const reservoirPositions: Record<string, { x: number; y: number; labelDx: number; labelDy: number }> = {
    res_sardar_sarovar: { x: 800, y: 430, labelDx: 15, labelDy: 5 },
    res_ukai: { x: 770, y: 525, labelDx: 15, labelDy: 5 },
    res_dharoi: { x: 670, y: 150, labelDx: 15, labelDy: -5 },
    res_kadana: { x: 810, y: 240, labelDx: 15, labelDy: 5 },
    res_shetrunji: { x: 550, y: 495, labelDx: -110, labelDy: 18 },
    res_aaji: { x: 410, y: 385, labelDx: -100, labelDy: 18 },
  };

  const riskFillClass = (level: RiskLevel) =>
    level === 'critical'
      ? 'fill-red-500 stroke-red-700'
      : level === 'high'
      ? 'fill-amber-500 stroke-amber-700'
      : level === 'moderate'
      ? 'fill-sky-500 stroke-sky-700'
      : 'fill-emerald-500 stroke-emerald-700';

  // Project the state outline once — it never changes between renders.
  // Combines the mainland+peninsula ring and the small coastal island into
  // one path string (two subpaths) so both render with identical styling.
  const outlinePath = useMemo(() => {
    const ringToPath = (ring: [number, number][]) =>
      ring
        .map(([lat, lng]) => project(lat, lng))
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(' ') + ' Z';

    return `${ringToPath(GUJARAT_OUTLINE_LATLNG)} ${ringToPath(GUJARAT_COASTAL_ISLAND_LATLNG)}`;
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Header Controls */}
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
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 via-white to-cyan-50">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 w-44"
            />
          </div>

          {/* Risk Level Filter Pills (ALL, CRITICAL, HIGH, MODERATE, SAFE) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'critical', 'high', 'moderate', 'safe'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterRisk === risk
                    ? 'bg-white text-sky-900 font-extrabold shadow-xs border border-slate-200'
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

      {/* Main Map View & Inspector Sidepanel */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* SVG Canvas Container */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-cyan-100 shadow-2xl p-6 min-h-[560px]">
          {/* Map Legend */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <div className="font-extrabold text-slate-900 mb-1">Gujarat Water Stress Heatmap</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="text-slate-700 font-medium">Critical Stress (&lt;40% supply)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span className="text-slate-700 font-medium">High Risk (Deficit)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 inline-block shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
              <span className="text-slate-700 font-medium">Moderate Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-slate-700 font-medium">Optimal Surplus</span>
            </div>
          </div>

          {/* SVG Viewport (950 x 680 Canvas) */}
          <div className="w-full h-full min-h-[480px] relative flex items-center justify-center pt-4">
            <svg
              viewBox="0 0 950 680"
              style={{
                background: 'linear-gradient(180deg,#f8fcff 0%,#edf7ff 100%)',
                borderRadius: '20px',
              }}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto max-h-[560px] drop-shadow-md select-none"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0L0 0 0 40" fill="none" stroke="#d9edf9" strokeWidth="1" />
                </pattern>

                <linearGradient id="canal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                <linearGradient id="stateFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="55%" stopColor="#f0f9ff" />
                  <stop offset="100%" stopColor="#dbeafe" />
                </linearGradient>

                <radialGradient id="reservoirGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>

                {/* Soft glow filter reused by markers, canal, and the selection ring */}
                <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="stateShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0369a1" floodOpacity="0.18" />
                </filter>
              </defs>

              <rect width="950" height="680" fill="url(#grid)" />

              {/* Gujarat State Outline */}
              <path
                d={outlinePath}
                fill="url(#stateFill)"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#stateShadow)"
                opacity="0.95"
              />
              <path
                d={outlinePath}
                fill="none"
                stroke="#bae6fd"
                strokeWidth="0.75"
                strokeDasharray="2 4"
                opacity="0.8"
              />

              {/* Narmada Main Canal Feeder Line */}
              <path
                d="M 800 430 Q 720 370 650 260 T 410 380 T 210 240"
                fill="none"
                stroke="url(#canal)"
                strokeWidth="5"
                strokeDasharray="9 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#softGlow)"
                opacity="0.9"
              />
              <text x="520" y="266" fill="#0369a1" fontSize="13" fontWeight="800" style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 4 }}>
                Narmada Main Canal Feeder
              </text>

              {/* RENDER FILTERED DISTRICT NODES */}
              {filteredDistricts.map((d) => {
                const [x, y] = project(d.lat, d.lng);
                const isSelected = selectedDistrict?.id === d.id;
                const colorClass = riskFillClass(d.riskLevel);

                return (
                  <g
                    key={d.id}
                    onClick={() => onSelectDistrict(d)}
                    className="cursor-pointer group"
                    style={{ transition: 'transform 250ms ease' }}
                  >
                    {isSelected && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r="24"
                          fill="none"
                          className={`${colorClass} animate-pulse`}
                          strokeWidth="2.5"
                          opacity="0.55"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="17"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="2.5"
                          filter="url(#softGlow)"
                        />
                      </>
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '13' : '10'}
                      className={`transition-all duration-300 ${colorClass} group-hover:opacity-90`}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? 'url(#softGlow)' : undefined}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '13' : '10'}
                      fill="transparent"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />

                    <text
                      x={x}
                      y={y + 26}
                      textAnchor="middle"
                      fontSize={isSelected ? '13' : '11.5'}
                      fontWeight={isSelected ? 800 : 700}
                      className={isSelected ? 'fill-sky-900' : 'fill-slate-800'}
                      style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 4.5 }}
                    >
                      {d.name}
                    </text>

                    {d.activeAlertsCount > 0 && (
                      <g transform={`translate(${x + 9}, ${y - 13})`}>
                        <circle r="9" fill="#dc2626" filter="url(#softGlow)" />
                        <circle r="9" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="0" y="3.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                          {d.activeAlertsCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Major Reservoirs Pin Layer */}
              {showReservoirs &&
                reservoirs.map((res) => {
                  const pos = reservoirPositions[res.id] || { x: 500, y: 350, labelDx: 15, labelDy: 5 };

                  return (
                    <g key={res.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer">
                      <circle r="16" fill="url(#reservoirGlow)" />
                      <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                      <circle r="8" fill="none" stroke="#0369a1" strokeWidth="1" opacity="0.6" />
                      <g transform={`translate(${pos.labelDx}, ${pos.labelDy})`}>
                        <rect
                          x="-4"
                          y="-12"
                          width={res.name.length * 7.5 + 45}
                          height="20"
                          rx="8"
                          fill="#ffffffF2"
                          stroke="#0284c7"
                          strokeWidth="1.25"
                          filter="url(#stateShadow)"
                        />
                        <text x="4" y="2" fill="#075985" fontSize="11" fontWeight="800">
                          💧 {res.name} ({res.fillPercentage}%)
                        </text>
                      </g>
                    </g>
                  );
                })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-200/80 font-medium">
            <span>
              Showing {filteredDistricts.length} of {districts.length} Gujarat Districts
            </span>
            <span>Grid Bounds: 20.2°N – 24.5°N | 68.5°E – 74.5°E</span>
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
                  <span
                    className={`font-extrabold text-base ${
                      selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {selectedDistrict.waterSupplyMLD} MLD
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Groundwater Level</span>
                  <span className="font-extrabold text-slate-900 text-base">{selectedDistrict.groundwaterLevelM} m</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] uppercase font-bold block">Population Impact</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {(selectedDistrict.population / 1000000).toFixed(2)} M
                  </span>
                </div>
              </div>

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