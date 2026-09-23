import React, { useState } from 'react';
import { ToolMode } from '../types';
import { 
  MousePointer2, Square, Minus, Battery, CircleDot,
  Server, ToggleLeft, Lightbulb, Droplets, Monitor,
  Radio, Map, Ship, Anchor, Power, ChevronDown, ChevronRight,
  Hand, Activity, Speaker, Type, Cog, LifeBuoy, Joystick, Fuel
} from 'lucide-react';

interface ToolbarProps {
  currentTool: ToolMode;
  onToolSelect: (tool: ToolMode) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ currentTool, onToolSelect }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Disegna & Collega': true,
    'Energia & Distribuzione': true,
    'Elettronica': true,
    'Pompe': true,
    'Illuminazione': true
  });

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const categories = [
    {
      name: 'Disegna & Collega',
      items: [
        { mode: 'select', icon: <MousePointer2 size={18} />, label: 'Seleziona / Muovi' },
        { mode: 'pan', icon: <Hand size={18} />, label: 'Sposta Vista' },
        { mode: 'draw_compartment', icon: <Square size={18} />, label: 'Vano (Scafo)' },
        { mode: 'wire_red', icon: <Minus size={18} color="#ef4444" strokeWidth={4} />, label: 'Cavo Rosso (+)' },
        { mode: 'wire_black', icon: <Minus size={18} color="#94a3b8" strokeWidth={4} />, label: 'Cavo Nero (-)' },
        { mode: 'wire_yellow', icon: <Minus size={18} color="#facc15" strokeWidth={4} />, label: 'Tubo Carburante (Giallo)' },
      ]
    },
    {
      name: 'Energia & Distribuzione',
      items: [
        { mode: 'place_battery', icon: <Battery size={18} className="text-green-400" />, label: 'Batteria 12V' },
        { mode: 'place_battery_switch', icon: <Power size={18} className="text-orange-400" />, label: 'Staccabatterie' },
        { mode: 'place_bus_bar_positive', icon: <Server size={18} color="#ef4444" />, label: 'Barra Positiva' },
        { mode: 'place_bus_bar_negative', icon: <Server size={18} color="#94a3b8" />, label: 'Barra Negativa' },
        { mode: 'place_dc_panel', icon: <Server size={18} className="text-blue-400" />, label: 'Quadro DC Main' },
        { mode: 'place_fuse_block', icon: <Server size={18} className="text-yellow-400" />, label: 'Pannello Fusibili' },
        { mode: 'place_fuse', icon: <Minus size={18} className="text-yellow-300" strokeDasharray="2,2" />, label: 'Fusibile Linea' },
        { mode: 'place_toggle_switch', icon: <ToggleLeft size={18} />, label: 'Interruttore' },
      ]
    },
    {
      name: 'Motore & Propulsione',
      items: [
        { mode: 'place_engine', icon: <Cog size={18} className="text-cyan-300" />, label: 'Motore (Avviamento)' },
        { mode: 'place_timone', icon: <LifeBuoy size={18} className="text-sky-300" />, label: 'Timone + Chiave' },
        { mode: 'place_manopola', icon: <Joystick size={18} className="text-amber-300" />, label: 'Manopola Comando Motore' },
        { mode: 'place_fuel_tank', icon: <Fuel size={18} className="text-yellow-400" />, label: 'Serbatoio Carburante' },
      ]
    },
    {
      name: 'Elettronica',
      items: [
        { mode: 'place_chartplotter', icon: <Map size={18} className="text-indigo-400" />, label: 'Chartplotter' },
        { mode: 'place_sonar', icon: <Activity size={18} className="text-blue-500" />, label: 'Ecoscandaglio' },
        { mode: 'place_vhf', icon: <Radio size={18} className="text-indigo-400" />, label: 'Radio VHF' },
        { mode: 'place_stereo', icon: <Speaker size={18} className="text-purple-400" />, label: 'Stereo' },
      ]
    },
    {
      name: 'Pompe',
      items: [
        { mode: 'place_bilge_pump', icon: <Ship size={18} className="text-cyan-400" />, label: 'Pompa Sentina' },
        { mode: 'place_freshwater_pump', icon: <Droplets size={18} className="text-blue-400" />, label: 'Pompa Acqua (Autoclave)' },
        { mode: 'place_fuel_pump', icon: <Battery size={18} className="text-red-500" />, label: 'Pompa Benzina' },
      ]
    },
    {
      name: 'Illuminazione',
      items: [
        { mode: 'place_light', icon: <Lightbulb size={18} className="text-yellow-200" />, label: 'Luce Cabina' },
        { mode: 'place_nav_light_port', icon: <CircleDot size={18} className="text-red-500" />, label: 'Luce Sinistra (Rossa)' },
        { mode: 'place_nav_light_stbd', icon: <CircleDot size={18} className="text-green-500" />, label: 'Luce Dritta (Verde)' },
        { mode: 'place_nav_light_stern', icon: <CircleDot size={18} className="text-white" />, label: 'Luce Poppa (Bianca)' },
        { mode: 'place_anchor_light', icon: <Anchor size={18} className="text-yellow-100" />, label: 'Luce di Fonda' },
      ]
    }
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-slate-200 w-72 border-r border-slate-800 overflow-y-auto custom-scrollbar shadow-2xl z-10 shrink-0">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Strumenti</h2>
      </div>
      
      <div className="p-2 space-y-1">
        {categories.map(cat => (
          <div key={cat.name} className="mb-2">
            <button 
              onClick={() => toggleSection(cat.name)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
            >
              {cat.name}
              {openSections[cat.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {openSections[cat.name] && (
              <div className="space-y-1 mt-1">
                {cat.items.map(t => (
                  <button
                    key={t.mode}
                    onClick={() => onToolSelect(t.mode as ToolMode)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border ${
                      currentTool === t.mode 
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'bg-transparent border-transparent hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={currentTool === t.mode ? 'scale-110 transition-transform' : ''}>
                      {t.icon}
                    </div>
                    <span className="text-sm font-medium tracking-wide text-left">{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
