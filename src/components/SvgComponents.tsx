import React from 'react';
import { ComponentType, CircuitComponent, PinDef, Wire } from '../types';
import { COMPONENT_DEFS } from '../utils/componentsDef';

interface ComponentProps {
  component: CircuitComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onPinClick: (e: React.PointerEvent, pinId: string) => void;
  onToggleState: (payload?: any) => void;
  isPowered?: boolean;
  showPinLabels?: boolean;
  selectedPinId?: string;
}

export const SvgComponent: React.FC<ComponentProps> = ({
  component,
  isSelected,
  onMouseDown,
  onPinClick,
  onToggleState,
  isPowered,
  showPinLabels = false,
  selectedPinId
}) => {
  const def = COMPONENT_DEFS[component.type];
  const { x, y } = component.position;
  const [hoveredPin, setHoveredPin] = React.useState<string | null>(null);

  const formatPinLabel = (pin: PinDef) => {
    if (pin.id === 'pos' || pin.id === 'pos_in') return '+12V';
    if (pin.id === 'neg' || pin.id === 'neg_in') return 'GND (-)';
    if (pin.id === 'in') return 'IN';
    if (pin.id === 'out') return 'OUT';
    if (pin.id === 'bat1') return 'BAT 1';
    if (pin.id === 'bat2') return 'BAT 2';
    if (pin.id === 'fuel_in') return 'FUEL IN';
    if (pin.id === 'fuel_out') return 'FUEL OUT';
    if (pin.id === 'feed') return 'FEED';
    if (pin.id === 'return') return 'RETURN';
    if (pin.id.startsWith('out') && pin.id.endsWith('_pos')) return `+ CH${pin.id.replace('out','').replace('_pos','')}`;
    if (pin.id.startsWith('out') && pin.id.endsWith('_neg')) return `- CH${pin.id.replace('out','').replace('_neg','')}`;
    if (pin.id.startsWith('p')) return `+${pin.id}`;
    if (pin.id.startsWith('n')) return `-${pin.id}`;
    return pin.id.toUpperCase();
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
      className="transition-transform duration-200 hover:brightness-110"
    >
      {/* Selection Highlight */}
      {isSelected && (
        <rect
          x={-6}
          y={-6}
          width={def.width + 12}
          height={def.height + 12}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4"
          rx="8"
        />
      )}

      {/* Component Body rendering based on type */}
      {renderBody(component, def, onToggleState, isPowered)}

      {/* Pins - High quality copper/brass look */}
      {def.pins.map(pin => {
        const isHovered = hoveredPin === pin.id;
        const showBadge = showPinLabels || isHovered;
        const labelText = formatPinLabel(pin);

        return (
          <g 
            key={pin.id} 
            transform={`translate(${pin.x}, ${pin.y})`}
            onMouseEnter={() => setHoveredPin(pin.id)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            {/* Base shadow */}
            <circle cx={0} cy={2} r={6} fill="rgba(0,0,0,0.5)" />
            {/* Terminal base */}
            <circle r={7} fill="#b45309" stroke="#78350f" strokeWidth={1} />
            {/* Terminal top (copper/brass/ac) */}
            <circle r={5} fill={pin.color === '#ef4444' ? 'url(#redPinGrad)' : (pin.color === '#000000' ? 'url(#blackPinGrad)' : pin.color)} />
            
            {/* First-click selection highlight */}
            {selectedPinId === pin.id && (
              <circle r={14} fill="none" stroke="#38bdf8" strokeWidth={2.5} className="animate-ping" opacity={0.7} />
            )}
            {selectedPinId === pin.id && (
              <circle r={10} fill="none" stroke="#38bdf8" strokeWidth={2} />
            )}
            {/* Pin hit area */}
            <circle
              r={12}
              fill="transparent"
              data-pin-hit="true"
              onPointerDown={(e) => {
                e.stopPropagation();
                onPinClick(e, pin.id);
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Fallback for click event if pointer already handled, prevent double firing
              }}
              style={{ cursor: 'crosshair' }}
              className="hover:fill-white/20 transition-colors"
            />

            {/* Pin Badge / Label */}
            {showBadge && (
              <g transform={`translate(0, ${pin.y < 25 ? -12 : 14})`} style={{ pointerEvents: 'none' }}>
                <rect 
                  x={-labelText.length * 3.5 - 4} 
                  y={-7} 
                  width={labelText.length * 7 + 8} 
                  height={13} 
                  rx={3} 
                  fill={pin.color === '#ef4444' ? '#450a0a' : (pin.color === '#eab308' ? '#422006' : (pin.color === '#000000' ? '#0f172a' : '#1e293b'))} 
                  stroke={pin.color === '#ef4444' ? '#ef4444' : (pin.color === '#eab308' ? '#eab308' : (pin.color === '#000000' ? '#475569' : '#3b82f6'))} 
                  strokeWidth={1} 
                />
                <text 
                  x={0} 
                  y={3} 
                  fill="#ffffff" 
                  fontSize={8} 
                  fontWeight="bold" 
                  textAnchor="middle"
                  className="font-mono tracking-tight"
                >
                  {labelText}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

function renderBody(component: CircuitComponent, def: any, onToggleState: (payload?: any) => void, isPowered?: boolean) {
  switch (component.type) {
    case 'battery':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="url(#batGrad)" stroke="#1e293b" strokeWidth={2} />
          <rect x={0} y={0} width={def.width} height={30} rx={8} fill="#1e293b" />
          {/* Terminals base */}
          <rect x={15} y={-8} width={20} height={10} fill="#64748b" rx={2} />
          <rect x={55} y={-8} width={20} height={10} fill="#64748b" rx={2} />
          {/* Ribs */}
          <line x1={10} y1={50} x2={80} y2={50} stroke="#000" strokeWidth={2} opacity={0.3} />
          <line x1={10} y1={65} x2={80} y2={65} stroke="#000" strokeWidth={2} opacity={0.3} />
          <line x1={10} y1={80} x2={80} y2={80} stroke="#000" strokeWidth={2} opacity={0.3} />
          {/* Labels */}
          <text x={def.width/2} y={55} fill="#fff" fontSize={18} fontWeight="900" textAnchor="middle" letterSpacing="1">AGM</text>
          <text x={def.width/2} y={75} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">12V 100Ah</text>
          <text x={25} y={22} fill="#ef4444" fontSize={18} fontWeight="black" textAnchor="middle">+</text>
          <text x={65} y={22} fill="#94a3b8" fontSize={20} fontWeight="black" textAnchor="middle">-</text>
        </g>
      );
      
    case 'battery_switch':
      const mode = component.state?.mode || 'off';
      let rotation = 0;
      if (mode === '1') rotation = 90;
      if (mode === 'both') rotation = 180;
      if (mode === '2') rotation = 270;
      
      return (
        <g onClick={(e) => { e.stopPropagation(); onToggleState(); }} style={{ cursor: 'pointer' }} filter="url(#drop-shadow)">
          {/* Base */}
          <rect x={0} y={0} width={def.width} height={def.height} rx={12} fill="#1e293b" stroke="#0f172a" strokeWidth={3} />
          <circle cx={50} cy={50} r={40} fill="#334155" stroke="#0f172a" strokeWidth={2} />
          
          {/* Labels */}
          <text x={50} y={22} fill={mode === 'off' ? '#ef4444' : '#94a3b8'} fontSize={10} fontWeight="black" textAnchor="middle">OFF</text>
          <text x={85} y={54} fill={mode === '1' ? '#22c55e' : '#94a3b8'} fontSize={11} fontWeight="black" textAnchor="middle">1</text>
          <text x={50} y={85} fill={mode === 'both' ? '#22c55e' : '#94a3b8'} fontSize={10} fontWeight="black" textAnchor="middle">BOTH</text>
          <text x={15} y={54} fill={mode === '2' ? '#22c55e' : '#94a3b8'} fontSize={11} fontWeight="black" textAnchor="middle">2</text>
          
          {/* Knob */}
          <g transform={`rotate(${rotation}, 50, 50)`} className="transition-transform duration-300 ease-in-out">
            <circle cx={50} cy={50} r={28} fill="url(#redPinGrad)" stroke="#7f1d1d" strokeWidth={1} />
            {/* Knob Handle */}
            <path d="M 42 22 L 58 22 L 54 50 L 46 50 Z" fill="#f87171" />
            <circle cx={50} cy={50} r={15} fill="#b91c1c" />
            <rect x={48} y={24} width={4} height={10} fill="#fff" rx={2} />
          </g>

          {/* Terminal Pin Labels */}
          <text x={20} y={95} fill="#f87171" fontSize={8} fontWeight="black" textAnchor="middle">BAT 1</text>
          <text x={80} y={95} fill="#f87171" fontSize={8} fontWeight="black" textAnchor="middle">BAT 2</text>
          <text x={50} y={10} fill="#f87171" fontSize={8} fontWeight="black" textAnchor="middle">OUT</text>
        </g>
      );
      
    case 'dc_panel':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={6} fill="#1e293b" stroke="#0f172a" strokeWidth={3} />
          <rect x={5} y={5} width={def.width-10} height={def.height-10} rx={4} fill="#0f172a" />
          <rect x={10} y={10} width={def.width-20} height={30} rx={2} fill="#334155" />
          <text x={def.width/2} y={30} fill="#fff" fontSize={14} fontWeight="black" textAnchor="middle" letterSpacing="2">DC MAIN</text>
          
          {/* Switches for 1 to 8 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const idx = i + 1;
            const isOn = component.state?.[`switch${idx}`];
            const sy = 60 + i * 25;
            return (
              <g key={idx} transform={`translate(10, ${sy})`} onClick={(e) => { e.stopPropagation(); onToggleState({ switchIndex: idx }); }} style={{ cursor: 'pointer' }}>
                <rect x={35} y={0} width={36} height={16} rx={8} fill={isOn ? '#22c55e' : '#475569'} />
                <circle cx={isOn ? 62 : 44} cy={8} r={6} fill="#fff" className="transition-all duration-200" />
                <rect x={0} y={1} width={30} height={14} fill="#334155" rx={2} />
                <text x={15} y={11} fill="#94a3b8" fontSize={9} fontWeight="bold" textAnchor="middle">CH {idx}</text>
                {/* Breaker Indicator */}
                <circle cx={80} cy={8} r={4} fill={isOn ? '#22c55e' : '#ef4444'} opacity={isOn ? 1 : 0.4} filter={isOn ? 'url(#glow-green)' : ''} />
              </g>
            );
          })}
        </g>
      );

    case 'bus_bar_positive':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#450a0a" stroke="#2a0606" strokeWidth={2} />
          {/* Copper bar */}
          <rect x={10} y={12} width={def.width - 20} height={16} rx={2} fill="url(#copperGrad)" stroke="#b45309" strokeWidth={1} />
          <text x={def.width/2} y={24} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle" opacity={0.6}>POS DISTRIBUTION</text>
        </g>
      );
      
    case 'bus_bar_negative':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#020617" stroke="#000" strokeWidth={2} />
          {/* Tin bar */}
          <rect x={10} y={12} width={def.width - 20} height={16} rx={2} fill="url(#tinGrad)" stroke="#475569" strokeWidth={1} />
          <text x={def.width/2} y={24} fill="#000" fontSize={10} fontWeight="bold" textAnchor="middle" opacity={0.6}>NEG RETURN</text>
        </g>
      );

    case 'chartplotter':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="#1e293b" stroke="#0f172a" strokeWidth={3} />
          {/* Screen */}
          <rect x={10} y={10} width={def.width - 20} height={def.height - 40} rx={4} fill={isPowered ? '#0c4a6e' : '#020617'} />
          {isPowered && (
            <g>
              {/* Map graphics */}
              <path d="M 10 40 Q 40 20 80 50 T 150 30" fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.5} />
              <path d="M 10 60 Q 50 40 90 70 T 150 50" fill="none" stroke="#7dd3fc" strokeWidth={2} />
              <circle cx={def.width/2} cy={(def.height-40)/2 + 5} r={4} fill="#ef4444" filter="url(#glow-red)" />
              <text x={def.width/2} y={30} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">NAVIONICS</text>
            </g>
          )}
          {/* Buttons */}
          <circle cx={def.width - 25} cy={def.height - 15} r={5} fill="#475569" />
          <circle cx={def.width - 40} cy={def.height - 15} r={5} fill="#475569" />
          <text x={30} y={def.height - 12} fill="#94a3b8" fontSize={12} fontWeight="bold">GPS MAP</text>
        </g>
      );

    case 'vhf':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          <rect x={10} y={10} width={50} height={35} rx={2} fill={isPowered ? '#bbf7d0' : '#334155'} />
          {isPowered && <text x={35} y={35} fill="#166534" fontSize={18} fontWeight="bold" textAnchor="middle">16</text>}
          {/* Dials */}
          <circle cx={80} cy={27} r={8} fill="#475569" />
          <circle cx={100} cy={27} r={8} fill="#475569" />
          <text x={80} y={45} fill="#94a3b8" fontSize={8} textAnchor="middle">VOL</text>
          <text x={100} y={45} fill="#94a3b8" fontSize={8} textAnchor="middle">SQ</text>
          {/* Mic Cord (decorative) */}
          <path d="M 10 50 Q -10 60 0 70 T -5 80" fill="none" stroke="#334155" strokeWidth={3} />
        </g>
      );

    case 'light':
    case 'nav_light_port':
    case 'nav_light_stbd':
    case 'nav_light_stern':
    case 'anchor_light':
      const lightConfig = {
        'light': { fill: '#fef08a', stroke: '#eab308', glow: 'url(#glow-yellow)', label: 'CABIN' },
        'nav_light_port': { fill: '#fca5a5', stroke: '#ef4444', glow: 'url(#glow-red)', label: 'PORT' },
        'nav_light_stbd': { fill: '#86efac', stroke: '#22c55e', glow: 'url(#glow-green)', label: 'STBD' },
        'nav_light_stern': { fill: '#f8fafc', stroke: '#cbd5e1', glow: 'url(#glow-white)', label: 'STERN' },
        'anchor_light': { fill: '#f8fafc', stroke: '#cbd5e1', glow: 'url(#glow-white)', label: 'ANCHOR' }
      }[component.type];
      
      return (
        <g filter="url(#drop-shadow)">
          <circle cx={def.width/2} cy={def.height/2 - 5} r={def.width/2 - 10} fill={isPowered ? lightConfig.fill : '#334155'} stroke={isPowered ? lightConfig.stroke : '#1e293b'} strokeWidth={2} />
          {isPowered && <circle cx={def.width/2} cy={def.height/2 - 5} r={def.width/2 - 5} fill={lightConfig.fill} filter={lightConfig.glow} opacity={0.6} />}
          <text x={def.width/2} y={def.height - 2} fill="#94a3b8" fontSize={8} fontWeight="bold" textAnchor="middle">{lightConfig.label}</text>
        </g>
      );

    case 'bilge_pump':
    case 'freshwater_pump':
    case 'fuel_pump':
      const isBilge = component.type === 'bilge_pump';
      const isFuel = component.type === 'fuel_pump';
      const color = isBilge ? '#0284c7' : (isFuel ? '#dc2626' : '#2563eb');
      const stroke = isBilge ? '#0369a1' : (isFuel ? '#991b1b' : '#1e3a8a');
      const label = isBilge ? 'BILGE' : (isFuel ? 'FUEL' : 'FRESH');
      return (
        <g filter="url(#drop-shadow)">
          {/* Base */}
          <rect x={5} y={def.height - 40} width={def.width - 10} height={30} rx={15} fill={color} stroke={stroke} strokeWidth={2} />
          {/* Top cylinder */}
          <rect x={15} y={15} width={def.width - 30} height={def.height - 40} rx={5} fill={color} stroke={stroke} strokeWidth={2} />
          {/* Hose outlet */}
          <rect x={def.width - 15} y={def.height - 35} width={15} height={10} fill="#475569" />
          {isFuel && (
            <g>
              {/* Fuel fittings (bottom) */}
              <circle cx={15} cy={def.height - 5} r={5} fill="#eab308" stroke="#854d0e" strokeWidth={1.5} />
              <circle cx={65} cy={def.height - 5} r={5} fill="#eab308" stroke="#854d0e" strokeWidth={1.5} />
              <text x={15} y={def.height - 12} fill="#fde047" fontSize={5.5} fontWeight="bold" textAnchor="middle">IN</text>
              <text x={65} y={def.height - 12} fill="#fde047" fontSize={5.5} fontWeight="bold" textAnchor="middle">OUT</text>
            </g>
          )}
          {isPowered && (
            <g>
              <circle cx={def.width/2} cy={def.height/2} r={12} fill="#bae6fd" opacity={0.5} />
              {/* Fix for spinning half circle - set local center */}
              <path d={`M ${def.width/2 - 10} ${def.height/2} A 10 10 0 0 1 ${def.width/2 + 10} ${def.height/2}`} stroke="#fff" strokeWidth={2} fill="none" className="animate-spin" style={{ transformOrigin: `${def.width/2}px ${def.height/2}px` }} />
              {/* Particles out of hose */}
              <circle cx={def.width + 5} cy={def.height - 30} r={2} fill={isFuel ? '#fca5a5' : '#38bdf8'} />
              <circle cx={def.width + 10} cy={def.height - 28} r={2} fill={isFuel ? '#fca5a5' : '#38bdf8'} />
            </g>
          )}
          <text x={def.width/2} y={35} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">{label}</text>
        </g>
      );

    case 'toggle_switch':
      const isOn = component.state?.on;
      return (
        <g onClick={(e) => { e.stopPropagation(); onToggleState(); }} style={{ cursor: 'pointer' }} filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          {/* Metallic face */}
          <rect x={15} y={15} width={20} height={40} fill="url(#tinGrad)" rx={2} stroke="#334155" />
          {/* Switch toggle */}
          <rect x={20} y={isOn ? 18 : 32} width={10} height={20} fill={isOn ? '#ef4444' : '#0f172a'} rx={2} filter="url(#drop-shadow-small)" />
        </g>
      );

    case 'fuse':
      return (
        <g filter="url(#drop-shadow)">
          {/* Robust Marine Base */}
          <rect x={0} y={4} width={def.width} height={def.height - 8} rx={6} fill="#0f172a" stroke="#1e293b" strokeWidth={2} />
          
          {/* Terminal Blocks for IN and OUT */}
          <rect x={3} y={10} width={10} height={20} rx={2} fill="url(#copperGrad)" stroke="#b45309" strokeWidth={1} />
          <rect x={def.width - 13} y={10} width={10} height={20} rx={2} fill="url(#copperGrad)" stroke="#b45309" strokeWidth={1} />
          
          {/* Clear Glass / Polycarbonate Body */}
          <rect x={14} y={6} width={def.width - 28} height={def.height - 12} rx={4} fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth={1} />
          
          {/* Fuse Link (Internal metal element) */}
          <path d={`M 14 20 L ${def.width/2 - 6} 20 Q ${def.width/2} 12 ${def.width/2 + 6} 20 L ${def.width - 14} 20`} fill="none" stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
          
          {/* Fuse Rating Badge */}
          <rect x={def.width/2 - 14} y={24} width={28} height={10} rx={2} fill="#78350f" />
          <text x={def.width/2} y={32} fill="#fef08a" fontSize={7} fontWeight="black" textAnchor="middle">50A ANL</text>
          
          {/* IN and OUT labels */}
          <text x={8} y={36} fill="#ef4444" fontSize={7} fontWeight="black" textAnchor="middle">IN</text>
          <text x={def.width - 8} y={36} fill="#ef4444" fontSize={7} fontWeight="black" textAnchor="middle">OUT</text>
        </g>
      );

    case 'fuse_block':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={6} fill="#1e293b" stroke="#0f172a" strokeWidth={3} />
          <rect x={5} y={5} width={def.width-10} height={def.height-10} rx={4} fill="#0f172a" />
          <text x={def.width/2} y={20} fill="#fff" fontSize={12} fontWeight="black" textAnchor="middle" letterSpacing="1">FUSES</text>
          
          {Array.from({ length: 6 }).map((_, i) => {
            const sy = 45 + i * 20;
            return (
              <g key={i} transform={`translate(10, ${sy})`}>
                <rect x={50} y={0} width={20} height={12} rx={2} fill="#f59e0b" />
                <text x={60} y={9} fill="#fff" fontSize={7} fontWeight="bold" textAnchor="middle">15A</text>
                <line x1={30} y1={6} x2={50} y2={6} stroke="#334155" strokeWidth={2} />
                <line x1={70} y1={6} x2={90} y2={6} stroke="#334155" strokeWidth={2} />
              </g>
            );
          })}
        </g>
      );

    case 'shore_power':
      return (
        <g filter="url(#drop-shadow)">
          <circle cx={def.width/2} cy={def.height/2} r={def.width/2} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={4} />
          <circle cx={def.width/2} cy={def.height/2} r={def.width/2 - 10} fill="#334155" />
          <circle cx={def.width/2} cy={def.height/2} r={15} fill="#0f172a" />
          <text x={def.width/2} y={30} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">230V AC</text>
          <text x={def.width/2} y={40} fill="#94a3b8" fontSize={8} textAnchor="middle">SHORE</text>
          {isPowered && <circle cx={def.width/2} cy={20} r={3} fill="#22c55e" filter="url(#glow-green)" />}
        </g>
      );
      
    case 'ac_panel':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={6} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={2} />
          <rect x={5} y={5} width={def.width-10} height={def.height-10} rx={4} fill="#f1f5f9" />
          <text x={def.width/2} y={25} fill="#334155" fontSize={14} fontWeight="black" textAnchor="middle">230V AC PANEL</text>
          {Array.from({ length: 4 }).map((_, i) => {
            const sy = 55 + i * 25;
            const isOn = component.state?.[`switch${i + 1}`];
            return (
              <g key={i} onClick={(e) => { e.stopPropagation(); onToggleState({ switchIndex: i + 1 }); }} style={{ cursor: 'pointer' }}>
                <rect x={50} y={sy} width={40} height={18} fill="#94a3b8" rx={4} />
                <rect x={isOn ? 70 : 52} y={sy + 2} width={18} height={14} fill={isOn ? '#10b981' : '#ef4444'} rx={3} className="transition-all duration-200" />
                <text x={70} y={sy + 13} fill="#fff" fontSize={8} fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>{isOn ? 'ON' : 'OFF'}</text>
              </g>
            );
          })}
        </g>
      );
      
    case 'inverter':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} />
          <rect x={5} y={5} width={def.width-10} height={40} fill="#1e3a8a" rx={4} />
          <text x={def.width/2} y={20} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">INVERTER 2000W</text>
          <text x={def.width/2} y={35} fill="#93c5fd" fontSize={10} textAnchor="middle">12V DC  ➡  230V AC</text>
          
          <rect x={10} y={60} width={60} height={40} rx={4} fill="#1e293b" />
          <text x={40} y={75} fill={isPowered ? '#22c55e' : '#64748b'} fontSize={12} fontWeight="bold" textAnchor="middle" className={isPowered ? "animate-pulse" : ""}>
            {isPowered ? '230V' : 'OFF'}
          </text>
          
          {/* Power toggle */}
          <g onClick={(e) => { e.stopPropagation(); onToggleState(); }} style={{ cursor: 'pointer' }} transform="translate(100, 60)">
             <circle cx={15} cy={15} r={15} fill={component.state?.on ? '#10b981' : '#ef4444'} filter={component.state?.on ? 'url(#glow-green)' : ''} />
             <path d="M 15 8 L 15 15 M 10 10 A 8 8 0 0 0 20 10" stroke="#fff" strokeWidth={2} fill="none" />
          </g>
          
          {/* Grills */}
          <line x1={140} y1={50} x2={140} y2={100} stroke="#1e3a8a" strokeWidth={2} />
          <line x1={145} y1={50} x2={145} y2={100} stroke="#1e3a8a" strokeWidth={2} />
        </g>
      );

    case 'ac_outlet':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2} />
          <circle cx={def.width/2} cy={def.height/2} r={18} fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx={def.width/2 - 6} cy={def.height/2} r={3} fill="#0f172a" />
          <circle cx={def.width/2 + 6} cy={def.height/2} r={3} fill="#0f172a" />
          <circle cx={def.width/2} cy={def.height/2 + 10} r={3} fill="#0f172a" />
          {isPowered && <circle cx={def.width/2} cy={10} r={2} fill="#22c55e" filter="url(#glow-green)" />}
        </g>
      );
      
    case 'solar_panel':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#1e293b" stroke="#94a3b8" strokeWidth={3} />
          <rect x={5} y={5} width={def.width-10} height={def.height-10} rx={2} fill="#020617" />
          {/* Solar cells grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={20 + i*17} y1={5} x2={20 + i*17} y2={def.height-5} stroke="#1e3a8a" strokeWidth={1} />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <line key={`h${i}`} x1={5} y1={20 + i*20} x2={def.width-5} y2={20 + i*20} stroke="#1e3a8a" strokeWidth={1} />
          ))}
        </g>
      );
      
    case 'mppt':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={6} fill="#0ea5e9" stroke="#0369a1" strokeWidth={2} />
          <rect x={10} y={10} width={def.width-20} height={40} rx={4} fill="#0f172a" />
          <text x={def.width/2} y={35} fill="#38bdf8" fontSize={18} fontWeight="black" textAnchor="middle" className="font-mono">
            {isPowered ? '14.2V' : '--.-V'}
          </text>
          <text x={def.width/2} y={65} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">MPPT CHARGE</text>
          <text x={def.width/2} y={75} fill="#bae6fd" fontSize={8} textAnchor="middle">CONTROLLER</text>
          
          <circle cx={40} cy={95} r={4} fill={isPowered ? "#22c55e" : "#475569"} filter={isPowered ? "url(#glow-green)" : ""} />
          <circle cx={60} cy={95} r={4} fill={isPowered ? "#eab308" : "#475569"} filter={isPowered ? "url(#glow-yellow)" : ""} />
          <circle cx={80} cy={95} r={4} fill={isPowered ? "#3b82f6" : "#475569"} />
        </g>
      );
      
    case 'shunt':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#334155" stroke="#1e293b" strokeWidth={2} />
          <rect x={10} y={15} width={80} height={20} fill="#b45309" />
          <line x1={30} y1={15} x2={30} y2={35} stroke="#000" strokeWidth={2} opacity={0.3} />
          <line x1={50} y1={15} x2={50} y2={35} stroke="#000" strokeWidth={2} opacity={0.3} />
          <line x1={70} y1={15} x2={70} y2={35} stroke="#000" strokeWidth={2} opacity={0.3} />
          <text x={def.width/2} y={12} fill="#fff" fontSize={8} fontWeight="bold" textAnchor="middle">500A / 50mV</text>
        </g>
      );

    case 'battery_monitor':
      return (
        <g filter="url(#drop-shadow)">
          <circle cx={def.width/2} cy={def.height/2} r={def.width/2} fill="#1e293b" stroke="#334155" strokeWidth={3} />
          <circle cx={def.width/2} cy={def.height/2} r={def.width/2 - 8} fill="#020617" />
          <text x={def.width/2} y={35} fill="#38bdf8" fontSize={16} fontWeight="bold" textAnchor="middle" className="font-mono">
            {isPowered ? '98%' : '---'}
          </text>
          <text x={def.width/2} y={48} fill="#22c55e" fontSize={10} textAnchor="middle" className="font-mono">
            {isPowered ? '+12.4A' : ''}
          </text>
        </g>
      );
      
    case 'vsr':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="#dc2626" stroke="#991b1b" strokeWidth={2} />
          <circle cx={def.width/2} cy={def.height/2 - 10} r={15} fill="#1e293b" />
          <circle cx={def.width/2} cy={def.height/2 - 10} r={12} fill={isPowered ? "#ef4444" : "#475569"} filter={isPowered ? "url(#glow-red)" : ""} />
          <text x={def.width/2} y={15} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">VSR</text>
          <text x={def.width/2} y={25} fill="#fca5a5" fontSize={8} textAnchor="middle">140A</text>
        </g>
      );
      
    case 'windlass':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={20} y={0} width={80} height={80} rx={10} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2} />
          <circle cx={def.width/2} cy={40} r={25} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={3} />
          {/* Gypsy */}
          <path d={`M ${def.width/2 - 15} 40 L ${def.width/2 + 15} 40`} stroke="#64748b" strokeWidth={6} strokeDasharray="4 2" className={isPowered ? "animate-spin" : ""} style={{ transformOrigin: `${def.width/2}px 40px` }} />
          <text x={def.width/2} y={15} fill="#334155" fontSize={10} fontWeight="bold" textAnchor="middle">WINDLASS</text>
          <text x={def.width/2} y={85} fill="#ef4444" fontSize={8} fontWeight="bold" textAnchor="middle">1000W</text>
        </g>
      );

    case 'engine':
      return (
        <g filter="url(#drop-shadow)">
          {/* Engine block (carter) */}
          <rect x={10} y={35} width={120} height={55} rx={8} fill="#334155" stroke="#1e293b" strokeWidth={2} />
          {/* Cylinder head / valve cover */}
          <rect x={20} y={20} width={100} height={25} rx={4} fill="#475569" stroke="#1e293b" strokeWidth={2} />
          <rect x={20} y={20} width={100} height={10} rx={4} fill="#64748b" />
          {/* Oil pan */}
          <rect x={25} y={80} width={90} height={12} rx={4} fill="#1e293b" />
          {/* Exhaust manifold */}
          <rect x={120} y={25} width={10} height={10} rx={2} fill="#94a3b8" />
          <rect x={120} y={22} width={8} height={6} rx={2} fill="#64748b" />
          {/* Starter solenoid / B+ terminal */}
          <rect x={15} y={48} width={26} height={16} rx={3} fill="#78350f" stroke="#451a03" strokeWidth={1.5} />
          <text x={28} y={59} fill="#fef08a" fontSize={8} fontWeight="bold" textAnchor="middle">STARTER</text>
          {/* Flywheel (spins when powered) */}
          <circle cx={def.width - 28} cy={92} r={16} fill="#64748b" stroke="#334155" strokeWidth={3} />
          {isPowered && (
            <g>
              <circle cx={def.width - 28} cy={92} r={9} fill="none" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="3 4" className="animate-spin" style={{ transformOrigin: `${def.width - 28}px 92px` }} />
              <circle cx={def.width - 28} cy={92} r={2} fill="#e2e8f0" />
            </g>
          )}
          {!isPowered && <circle cx={def.width - 28} cy={92} r={9} fill="none" stroke="#1e293b" strokeWidth={2} strokeDasharray="3 4" />}
          {/* Oil filter */}
          <circle cx={125} cy={80} r={8} fill="#0f172a" stroke="#1e293b" />
          {/* Belt / pulley */}
          <circle cx={20} cy={70} r={7} fill="#475569" stroke="#0f172a" strokeWidth={2} />
          {/* Fuel rail inlet */}
          <line x1={15} y1={100} x2={15} y2={82} stroke="#eab308" strokeWidth={3} strokeLinecap="round" />
          <line x1={15} y1={82} x2={60} y2={82} stroke="#eab308" strokeWidth={2} strokeLinecap="round" />
          <circle cx={15} cy={100} r={4} fill="#eab308" stroke="#854d0e" strokeWidth={1.5} />
          <text x={22} y={112} fill="#fde047" fontSize={6} fontWeight="bold">FUEL</text>
          {/* Labels */}
          <text x={def.width/2} y={105} fill="#fca5a5" fontSize={9} fontWeight="black" textAnchor="middle" letterSpacing="1">ENGINE 12V</text>
          <text x={30} y={12} fill="#ef4444" fontSize={9} fontWeight="black" textAnchor="middle">+ B+</text>
          <text x={110} y={12} fill="#94a3b8" fontSize={10} fontWeight="black" textAnchor="middle">-</text>
          {/* Status */}
          {isPowered && (
            <circle cx={14} cy={10} r={4} fill="#22c55e" filter="url(#glow-green)" />
          )}
        </g>
      );

    case 'timone':
      const keyOn = (component.state?.on) as boolean;
      return (
        <g onClick={(e) => { e.stopPropagation(); onToggleState(); }} style={{ cursor: 'pointer' }} filter="url(#drop-shadow)">
          {/* Console base */}
          <rect x={0} y={10} width={def.width} height={def.height - 10} rx={8} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          <rect x={4} y={16} width={def.width - 8} height={30} rx={4} fill="#334155" />
          <text x={def.width/2} y={35} fill="#fff" fontSize={11} fontWeight="black" textAnchor="middle" letterSpacing="1">TIMONE</text>
          {/* Steering wheel */}
          <g className={keyOn ? 'animate-spin' : ''} style={{ transformOrigin: '50px 72px' }}>
            <circle cx={50} cy={72} r={28} fill="none" stroke="#94a3b8" strokeWidth={5} />
            <circle cx={50} cy={72} r={8} fill="#475569" stroke="#0f172a" strokeWidth={2} />
            <line x1={50} y1={44} x2={50} y2={100} stroke="#94a3b8" strokeWidth={4} />
            <line x1={22} y1={72} x2={78} y2={72} stroke="#94a3b8" strokeWidth={4} />
            <line x1={30} y1={52} x2={70} y2={92} stroke="#94a3b8" strokeWidth={3} />
            <line x1={70} y1={52} x2={30} y2={92} stroke="#94a3b8" strokeWidth={3} />
            <circle cx={30} cy={52} r={3} fill="#cbd5e1" />
            <circle cx={70} cy={52} r={3} fill="#cbd5e1" />
            <circle cx={30} cy={92} r={3} fill="#cbd5e1" />
            <circle cx={70} cy={92} r={3} fill="#cbd5e1" />
          </g>
          {/* Key indicator */}
          <text x={20} y={12} fill={keyOn ? '#22c55e' : '#64748b'} fontSize={8} fontWeight="black">CHIAVE {keyOn ? 'ON' : 'OFF'}</text>
          <circle cx={92} cy={10} r={4} fill={keyOn ? '#22c55e' : '#475569'} filter={keyOn ? 'url(#glow-green)' : ''} />
        </g>
      );

    case 'manopola':
      const gear = (component.state?.gear as string) || 'neutral';
      const leverAngle = gear === 'avanti' ? 38 : gear === 'retromarcia' ? -38 : 0;
      return (
        <g onClick={(e) => { e.stopPropagation(); onToggleState(); }} style={{ cursor: 'pointer' }} filter="url(#drop-shadow)">
          {/* Console box */}
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          <rect x={4} y={4} width={def.width - 8} height={26} rx={4} fill="#334155" />
          <text x={def.width/2} y={21} fill="#fff" fontSize={10} fontWeight="black" textAnchor="middle" letterSpacing="1">COMANDO MOTORE</text>
          {/* Base arc */}
          <path d={`M 20 78 A 45 45 0 0 1 90 78`} fill="none" stroke="#475569" strokeWidth={3} />
          {/* Gear labels */}
          <text x={18} y={92} fill={gear === 'retromarcia' ? '#ef4444' : '#64748b'} fontSize={9} fontWeight="black" textAnchor="middle">AR</text>
          <text x={55} y={108} fill={gear === 'neutral' ? '#eab308' : '#64748b'} fontSize={9} fontWeight="black" textAnchor="middle">N</text>
          <text x={92} y={92} fill={gear === 'avanti' ? '#38bdf8' : '#64748b'} fontSize={9} fontWeight="black" textAnchor="middle">AV</text>
          {/* Lever */}
          <g transform={`rotate(${leverAngle}, 55, 84)`} className="transition-transform duration-300 ease-in-out">
            <line x1={55} y1={84} x2={55} y2={46} stroke="#cbd5e1" strokeWidth={7} strokeLinecap="round" />
            <circle cx={55} cy={84} r={9} fill="#475569" stroke="#0f172a" strokeWidth={2} />
            <circle cx={55} cy={46} r={7} fill="#eab308" stroke="#78350f" strokeWidth={2} />
          </g>
          {/* Gear LED */}
          <circle cx={10} cy={100} r={4} fill={gear === 'neutral' ? '#eab308' : '#475569'} />
          <circle cx={55} cy={114} r={4} fill={gear === 'retromarcia' ? '#ef4444' : '#475569'} />
          <circle cx={100} cy={100} r={4} fill={gear === 'avanti' ? '#38bdf8' : '#475569'} />
        </g>
      );

    case 'fuel_tank':
      return (
        <g filter="url(#drop-shadow)">
          {/* Tank body */}
          <rect x={0} y={12} width={120} height={70} rx={10} fill="#3f3f46" stroke="#27272a" strokeWidth={3} />
          <rect x={6} y={18} width={108} height={58} rx={7} fill="none" stroke="#52525b" strokeWidth={1} />
          {/* Fuel level */}
          <rect x={10} y={26} width={100} height={42} rx={4} fill="#1a2e05" />
          <rect x={12} y={52} width={96} height={14} rx={3} fill="#a3e635" opacity={0.9} />
          <rect x={12} y={40} width={96} height={10} rx={3} fill="#4ade80" opacity={0.35} />
          {/* Gauge line */}
          <line x1={10} y1={58} x2={110} y2={58} stroke="#365314" strokeWidth={1} strokeDasharray="3 3" />
          {/* Fill cap */}
          <circle cx={110} cy={10} r={8} fill="#52525b" stroke="#3f3f46" strokeWidth={2} />
          <circle cx={110} cy={10} r={3} fill="#27272a" />
          {/* Straps */}
          <line x1={20} y1={12} x2={20} y2={82} stroke="#27272a" strokeWidth={4} />
          <line x1={100} y1={12} x2={100} y2={82} stroke="#27272a" strokeWidth={4} />
          {/* Feed/Return fittings (right side) */}
          <circle cx={140} cy={45} r={5} fill="#eab308" stroke="#854d0e" strokeWidth={1.5} />
          <circle cx={140} cy={70} r={5} fill="#eab308" stroke="#854d0e" strokeWidth={1.5} />
          <text x={137.5} y={38} fill="#fde047" fontSize={5.5} fontWeight="bold" textAnchor="middle">FEED</text>
          <text x={137.5} y={77} fill="#fde047" fontSize={5.5} fontWeight="bold" textAnchor="middle">RET</text>
          {/* Label */}
          <text x={60} y={30} fill="#fef08a" fontSize={9} fontWeight="black" textAnchor="middle" letterSpacing="1">FUEL TANK</text>
        </g>
      );

    case 'sonar':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={8} fill="#1e293b" stroke="#0f172a" strokeWidth={3} />
          <rect x={10} y={10} width={def.width - 20} height={def.height - 40} rx={4} fill={isPowered ? '#0f172a' : '#020617'} />
          {isPowered && (
            <g>
              <path d="M 10 30 Q 30 20 50 30 T 90 30 T 130 30" fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.8} />
              <path d="M 10 50 Q 40 30 70 50 T 130 50" fill="none" stroke="#22c55e" strokeWidth={3} />
              <path d="M 10 70 Q 50 60 80 70 T 130 70" fill="none" stroke="#ef4444" strokeWidth={4} />
              <text x={def.width/2} y={25} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle">FISHFINDER</text>
            </g>
          )}
          <circle cx={def.width - 25} cy={def.height - 15} r={5} fill="#475569" />
          <circle cx={def.width - 40} cy={def.height - 15} r={5} fill="#475569" />
        </g>
      );

    case 'stereo':
      return (
        <g filter="url(#drop-shadow)">
          <rect x={0} y={0} width={def.width} height={def.height} rx={4} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          <rect x={10} y={10} width={130} height={30} rx={2} fill={isPowered ? '#1e1b4b' : '#0f172a'} />
          {isPowered && (
            <g>
              <text x={30} y={30} fill="#818cf8" fontSize={14} fontWeight="bold" className="animate-pulse">▶ 104.5 FM</text>
              <circle cx={110} cy={25} r={8} fill="#312e81" stroke="#4f46e5" strokeWidth={2} />
            </g>
          )}
          {!isPowered && <circle cx={110} cy={25} r={8} fill="#1e293b" />}
        </g>
      );
  }
}
