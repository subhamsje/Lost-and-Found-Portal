import React, { useState, useMemo } from 'react';
import { Item } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, Search, Locate, Shield } from 'lucide-react';

interface CampusMapProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
}

// Landmarks positioning on SVG canvas (coordinate boundaries matching user upload)
const MAP_LANDMARKS = [
  { name: 'College Central Library', x: 51, y: 14, color: 'indigo', label: 'Central Library Block' },
  { name: 'CS Department (CSE Block)', x: 19, y: 38, color: 'blue', label: 'Computer Science Dept' },
  { name: 'Main Football Ground', x: 42, y: 56, color: 'emerald', label: 'Football Ground' },
  { name: 'DSCE Rock Garden Area', x: 74, y: 35, color: 'teal', label: 'DSCE Rock Garden' },
  { name: 'IEM Department Building', x: 80, y: 22, color: 'cyan', label: 'IEM Department' },
  { name: 'CD Sagar Auditorium Lobby', x: 78, y: 44, color: 'amber', label: 'CD Sagar Auditorium' },
  { name: 'Dayananda Sagar Pre-University College Block', x: 44, y: 72, color: 'violet', label: 'DS Pre-Univ College' },
  { name: 'Inner Campus Road', x: 30, y: 52, color: 'sky', label: 'Inner Road Walkway' }
];

// Map location name to coordinates
const LOCATION_COORDINATES: Record<string, { x: number; y: number }> = {
  'College Central Library': { x: 51, y: 14 },
  'CS Department (CSE Block)': { x: 19, y: 38 },
  'Main Football Ground': { x: 42, y: 56 },
  'DSCE Rock Garden Area': { x: 74, y: 35 },
  'IEM Department Building': { x: 80, y: 22 },
  'CD Sagar Auditorium Lobby': { x: 78, y: 44 },
  'Dayananda Sagar Pre-University College Block': { x: 44, y: 72 },
  'Inner Campus Road': { x: 30, y: 52 }
};

export default function CampusMap({ items, onSelectItem }: CampusMapProps) {
  // Simulated user coordinate
  const [userCoords, setUserCoords] = useState({ x: 35, y: 41 });
  const [selectedPin, setSelectedPin] = useState<Item | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState('');
  const [gpsLocked, setGpsLocked] = useState(false);

  // Trigger GPS locator simulation
  const handleLocateUser = () => {
    setGpsLocked(true);
    setTimeout(() => {
      setUserCoords({ x: 35, y: 41 }); // Align near CSE Dept Walkway
    }, 450);
  };

  // Click on the map to set user's location
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setUserCoords({ x, y });
      setGpsLocked(false);
    }
  };

  // Match items to coordinates on the map
  const activePinsWithCoords = useMemo(() => {
    return items.map(item => {
      const coords = LOCATION_COORDINATES[item.location] || { x: 50, y: 50 };
      return {
        ...item,
        x: coords.x,
        y: coords.y
      };
    }).filter(pin => {
      if (!mapSearch) return true;
      return pin.title.toLowerCase().includes(mapSearch.toLowerCase()) || 
             pin.location.toLowerCase().includes(mapSearch.toLowerCase());
    });
  }, [items, mapSearch]);

  return (
    <div className="w-full h-full text-slate-800 font-sans flex flex-col overflow-hidden" id="campus-map-interactive">
      <div className="flex flex-col lg:flex-row gap-6 w-full h-[650px] lg:h-[580px]">
        {/* Map Stage Container (Left 2/3) */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-100/40 backdrop-blur-md overflow-hidden relative select-none flex flex-col justify-between shadow-sm">
          
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap gap-2 items-center justify-between pointer-events-none">
            {/* Quick Title Card */}
            <div className="px-4 py-2 rounded-xl bg-white border border-slate-200/80 shadow-md flex items-center gap-2 pointer-events-auto">
              <Compass className="w-4 h-4 text-blue-600 rotate-12" />
              <div className="text-left">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 leading-none">DSCE Campus Vector Map</h4>
                <p className="text-[8.5px] text-slate-400 font-mono mt-0.5 font-bold">Landmark checkpoint network</p>
              </div>
            </div>

            {/* Quick Actions Search */}
            <div className="flex gap-2 pointer-events-auto">
              {/* Search Inside Map */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter items on map..."
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  className="h-8 pl-8 pr-2.5 text-[10px] w-40 rounded-lg bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 outline-none text-slate-800 focus:w-48 transition-all shadow-sm"
                />
              </div>

              {/* Locate GPS trigger */}
              <button
                onClick={handleLocateUser}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-[10px] font-bold border transition-all cursor-pointer shadow-sm ${gpsLocked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'}`}
              >
                <Locate className={`w-3.5 h-3.5 text-blue-500 ${gpsLocked ? 'animate-spin' : ''}`} />
                <span>My Location</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Render Field */}
          <div className="flex-1 relative w-full h-full cursor-crosshair overflow-hidden bg-white">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full absolute inset-0 text-slate-200 fill-none"
              onClick={handleMapClick}
              id="dsce-vector-canvas"
            >
              {/* Complex inner roads (Styled as soft modern grey boundaries) */}
              <path d="M 30,0 L 30,100" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
              <path d="M 0,48 L 100,50" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
              <path d="M 30,22 Q 60,20 80,22" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 80,22 L 80,100" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
              <path d="M 30,76 L 100,74" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

              <rect x="0.5" y="0.5" width="99" height="99" rx="4" stroke="#E2E8F0" strokeWidth="1" />

              {/* DRAW BUILDING BLOCKS */}
              
              {/* Central Football Ground */}
              <g>
                <rect 
                  x="36" y="44" width="22" height="20" rx="2" 
                  fill="rgba(16, 185, 129, 0.04)" 
                  stroke="rgba(16, 185, 129, 0.18)" 
                  strokeWidth="0.8" 
                />
                <line x1="47" y1="44" x2="47" y2="64" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.5" />
                <circle cx="47" cy="54" r="3" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.5" />
              </g>

              {/* CS Department (CSE Block) */}
              <rect 
                x="12" y="26" width="13" height="18" rx="2" 
                fill="rgba(59, 130, 246, 0.04)" 
                stroke="rgba(59, 130, 246, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* PU College Block */}
              <rect 
                x="34" y="66" width="26" height="12" rx="2" 
                fill="rgba(139, 92, 246, 0.04)" 
                stroke="rgba(139, 92, 246, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* IEM Department */}
              <rect 
                x="74" y="16" width="14" height="10" rx="2" 
                fill="rgba(6, 182, 212, 0.04)" 
                stroke="rgba(6, 182, 212, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* Rock Garden */}
              <circle 
                cx="74" cy="35" r="5" 
                fill="rgba(20, 184, 166, 0.04)" 
                stroke="rgba(20, 184, 166, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* CD Sagar Auditorium */}
              <rect 
                x="68" y="44" width="22" height="15" rx="2" 
                fill="rgba(245, 158, 11, 0.04)" 
                stroke="rgba(245, 158, 11, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* Central Library */}
              <rect 
                x="41" y="10" width="18" height="10" rx="2" 
                fill="rgba(99, 102, 241, 0.04)" 
                stroke="rgba(99, 102, 241, 0.18)" 
                strokeWidth="0.8" 
              />

              {/* Dynamic Landmark texts & Hover States */}
              {MAP_LANDMARKS.map((landmark) => {
                const isHovered = hoveredLandmark === landmark.name;
                return (
                  <g 
                    key={landmark.name}
                    onMouseEnter={() => setHoveredLandmark(landmark.name)}
                    onMouseLeave={() => setHoveredLandmark(null)}
                    className="cursor-help pointer-events-auto"
                  >
                    <circle cx={landmark.x} cy={landmark.y} r="5" fill="transparent" />
                    <circle cx={landmark.x} cy={landmark.y} r="1.2" fill={isHovered ? '#1E293B' : '#94A3B8'} />
                    
                    {/* Styled Landmark label popup */}
                    <text
                      x={landmark.x}
                      y={landmark.y - 3}
                      textAnchor="middle"
                      fill={isHovered ? '#2563EB' : '#64748B'}
                      fontSize={isHovered ? '2.4' : '1.8'}
                      fontWeight={isHovered ? '700' : '500'}
                      className="transition-all duration-150 select-none pointer-events-none font-sans"
                    >
                      {landmark.label}
                    </text>
                  </g>
                );
              })}

              {/* DYNAMIC ITEM MARKERS PLOTTING */}
              {activePinsWithCoords.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                const statusColor = pin.status === 'lost' ? '#EF4444' : pin.status === 'found' ? '#F59E0B' : '#10B981';
                
                return (
                  <g
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                    }}
                    className="cursor-pointer pointer-events-auto"
                  >
                    <g className="transition-transform duration-200 transform hover:scale-125">
                      {/* Outer focus circle */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={isSelected ? '3.5' : '2.4'}
                        fill="none"
                        stroke={statusColor}
                        strokeWidth="0.8"
                        opacity={isSelected ? '1' : '0.65'}
                        className="animate-pulse"
                      />
                      {/* Center pinpoint indicator */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={isSelected ? '1.8' : '1.2'}
                        fill={statusColor}
                      />
                    </g>
                  </g>
                );
              })}

              {/* ACTIVE USER POSITION DOT */}
              <g className="pointer-events-none">
                <circle
                  cx={userCoords.x}
                  cy={userCoords.y}
                  r="5"
                  fill="rgba(37, 99, 235, 0.12)"
                />
                <circle
                  cx={userCoords.x}
                  cy={userCoords.y}
                  r="2.5"
                  fill="rgba(37, 99, 235, 0.25)"
                />
                {/* Core blue pointer */}
                <circle
                  cx={userCoords.x}
                  cy={userCoords.y}
                  r="0.9"
                  fill="#2563EB"
                  stroke="#ffffff"
                  strokeWidth="0.3"
                />
              </g>
            </svg>

            {/* Instruction Footer Bar */}
            <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[9px] text-slate-400 font-mono tracking-wide pointer-events-none uppercase">
              <span>* Click on coordinates to adjust location marker</span>
              <span>Grid scale: 10m gridded alignment</span>
            </div>
          </div>

          {/* Selected Item Floating Card Preview */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                className="absolute bottom-4 left-4 right-4 z-30 p-4 rounded-xl bg-white border border-slate-200 shadow-xl flex gap-4 items-center text-left"
              >
                {/* Item Avatar */}
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                  {selectedPin.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase ${selectedPin.status === 'lost' ? 'bg-rose-50 text-rose-700 border border-rose-100' : selectedPin.status === 'found' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      {selectedPin.status === 'lost' ? 'Lost Item' : selectedPin.status === 'found' ? 'Found' : 'Returned'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{selectedPin.location}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1 truncate">{selectedPin.title}</h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{selectedPin.description}</p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onSelectItem(selectedPin);
                      setSelectedPin(null);
                    }}
                    className="h-8 px-4 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wide hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-[9px] text-slate-400 hover:text-slate-700 py-1 transition-colors uppercase font-mono font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sidebar Info Section (Right 1/3) */}
        <div className="w-full lg:w-85 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm select-none shrink-0 text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-800 text-base">Campus Locator</h3>
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">DSCE ACTIVE</span>
            </div>

            {/* Quick Map Stats */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Campus Sector</span>
                <span className="block font-display font-bold text-xs text-slate-800">Dayananda Sagar</span>
              </div>
              <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Coordinates</span>
                <span className="block font-display font-bold text-[10px] text-slate-800 truncate">
                  Lat {userCoords.x} / Lng {userCoords.y}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Select or hover on coordinates to view active search beacons inside <strong>Dayananda Sagar College of Engineering</strong>.
            </p>

            <div className="h-px bg-slate-150" />

            {/* Active Items Feed hotlinks */}
            <div className="space-y-2">
              <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider leading-none pb-1 font-bold">Campus Map Beacons ({activePinsWithCoords.length})</h4>
              
              <div className="space-y-1.5 max-h-[220px] lg:max-h-[190px] overflow-y-auto pr-1">
                {activePinsWithCoords.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-400 font-mono">
                    No active markers declared
                  </div>
                ) : (
                  activePinsWithCoords.map((pin) => {
                    const statusColor = pin.status === 'lost' ? 'bg-rose-500' : pin.status === 'found' ? 'bg-amber-500' : 'bg-emerald-500';
                    return (
                      <button
                        key={pin.id}
                        onClick={() => {
                          setSelectedPin(pin);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between text-xs transition-all cursor-pointer text-slate-700 hover:text-slate-900 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1 text-left">
                          <span className="text-base shrink-0">{pin.icon}</span>
                          <div className="min-w-0">
                            <p className="font-bold truncate text-slate-800">{pin.title}</p>
                            <span className="text-[10px] text-slate-400 font-semibold block truncate leading-none mt-0.5">{pin.location}</span>
                          </div>
                        </div>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColor} shrink-0`} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            {/* Safety badge */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-2.5 items-center text-left">
              <Shield className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="block text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Secure Verifier</span>
                <span className="block text-[9px] text-slate-500 leading-snug">All map placements are checked by staff monitors.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
