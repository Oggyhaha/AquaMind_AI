import React, { useState, useEffect, useRef } from 'react';
import { District, Reservoir, RiskLevel } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Compass, Search, Layers, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

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
      case 'critical':
        return <span className="px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 text-xs font-extrabold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> CRITICAL STRESS</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> HIGH RISK</span>;
      case 'moderate':
        return <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-extrabold">MODERATE</span>;
      case 'safe':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> OPTIMAL</span>;
    }
  };

  const getRiskColorHex = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'moderate': return '#0ea5e9';
      case 'safe': return '#10b981';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    // Center on Gujarat state (Lat ~22.3°N, Lng ~71.8°E)
    const map = L.map(mapContainerRef.current, {
      center: [22.35, 71.65],
      zoom: 7.2,
      zoomControl: true,
      attributionControl: false
    });

    leafletMapRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Synchronize Tile Layer with Theme (CartoDB Light / Dark Matter)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [isDark]);

  // Synchronize Markers & Features on Map
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw Narmada Canal Feeder Line
    const canalCoords: [number, number][] = [
      [21.83, 73.75], // Sardar Sarovar Dam
      [22.30, 73.18], // Vadodara
      [23.02, 72.57], // Ahmedabad
      [23.21, 72.63], // Gandhinagar
      [23.58, 72.36], // Mehsana
      [23.24, 69.66]  // Kachchh Feeder
    ];

    L.polyline(canalCoords, {
      color: isDark ? '#38bdf8' : '#0284c7',
      weight: 3,
      dashArray: '6, 6',
      opacity: 0.85
    }).addTo(markersGroup);

    // 2. Add District Nodes
    filteredDistricts.forEach((d) => {
      const isSelected = selectedDistrict?.id === d.id;
      const colorHex = getRiskColorHex(d.riskLevel);

      const customIcon = L.divIcon({
        className: 'custom-district-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -6px; left: -6px; right: -6px; bottom: -6px;
                border: 3px solid #0ea5e9;
                border-radius: 50%;
                box-shadow: 0 0 12px #0ea5e9;
              "></div>
            ` : ''}
            <div style="
              width: ${isSelected ? '22px' : '18px'};
              height: ${isSelected ? '22px' : '18px'};
              background-color: ${colorHex};
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transition: all 0.2s ease;
              position: relative;
            ">
              ${d.activeAlertsCount > 0 ? `
                <span style="
                  position: absolute;
                  top: -6px;
                  right: -6px;
                  background-color: #dc2626;
                  color: #ffffff;
                  font-size: 9px;
                  font-weight: 800;
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 1px solid #ffffff;
                ">${d.activeAlertsCount}</span>
              ` : ''}
            </div>
            <div style="
              margin-top: 4px;
              background-color: ${isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
              color: ${isDark ? '#f8fafc' : '#0f172a'};
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: ${isSelected ? '800' : '700'};
              border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};
              white-space: nowrap;
              box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            ">${d.name}</div>
          </div>
        `,
        iconSize: [60, 40],
        iconAnchor: [30, 10]
      });

      const marker = L.marker([d.lat, d.lng], { icon: customIcon }).addTo(markersGroup);

      marker.on('click', () => {
        onSelectDistrict(isSelected ? null : d);
      });
    });

    // 3. Add Major Reservoirs Layer
    if (showReservoirs) {
      const reservoirCoords: Record<string, [number, number]> = {
        'res_sardar_sarovar': [21.83, 73.75],
        'res_ukai': [21.25, 73.58],
        'res_dharoi': [24.00, 72.85],
        'res_kadana': [23.31, 73.83],
        'res_shetrunji': [21.52, 71.98],
        'res_aaji': [22.25, 70.85]
      };

      reservoirs.forEach((res) => {
        const coords = reservoirCoords[res.id];
        if (!coords) return;

        const resIcon = L.divIcon({
          className: 'custom-reservoir-marker',
          html: `
            <div style="
              background-color: ${isDark ? '#1e293b' : '#ffffff'};
              color: ${isDark ? '#38bdf8' : '#0369a1'};
              border: 1.5px solid ${isDark ? '#38bdf8' : '#0284c7'};
              padding: 3px 8px;
              border-radius: 8px;
              font-size: 10px;
              font-weight: 800;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>💧 ${res.name} (${res.fillPercentage}%)</span>
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12]
        });

        L.marker(coords, { icon: resIcon }).addTo(markersGroup);
      });
    }
  }, [filteredDistricts, reservoirs, selectedDistrict, isDark, showReservoirs]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-colors duration-300">
      
      {/* Map Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Interactive Gujarat GIS Command Map</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time OpenStreetMap/GIS hydrology telemetry across Gujarat State
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
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

          {/* Toggle Reservoirs Layer */}
          <button
            onClick={() => setShowReservoirs(!showReservoirs)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showReservoirs
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Reservoirs Layer</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-8 relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[540px] transition-colors duration-300 shadow-inner">
          
          {/* Map Legend */}
          <div className="absolute top-4 left-4 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-xs space-y-1.5 transition-colors">
            <div className="font-extrabold text-slate-900 dark:text-white mb-1">Gujarat Water Stress GIS Legend</div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Critical Stress (&lt;40% supply)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">High Risk (Deficit)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Moderate Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Optimal Surplus</span>
            </div>
          </div>

          {/* Leaflet DOM Mounting Container */}
          <div ref={mapContainerRef} className="w-full h-[540px] z-0" />

        </div>

        {/* Selected District Inspector Sidepanel */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
          {selectedDistrict ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDistrict.name} District</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedDistrict.region} Region</p>
                </div>
                {getRiskBadge(selectedDistrict.riskLevel)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Water Demand</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{selectedDistrict.waterDemandMLD} MLD</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Current Supply</span>
                  <span className={`font-extrabold text-base ${selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {selectedDistrict.waterSupplyMLD} MLD
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Groundwater Depth</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{selectedDistrict.groundwaterLevelM} m</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold block">Population Impact</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{(selectedDistrict.population / 1000000).toFixed(2)} M</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Supply-Demand Gap Fulfillment</span>
                  <span>{Math.round((selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedDistrict.waterSupplyMLD < selectedDistrict.waterDemandMLD ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (selectedDistrict.waterSupplyMLD / selectedDistrict.waterDemandMLD) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onSelectDistrict(null)}
                className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Clear Selected District
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-3">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-medium">Click on any district node on the GIS map to inspect live hydrological metrics.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};