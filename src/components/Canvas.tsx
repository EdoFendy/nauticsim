import React, { useRef, useState, useEffect } from 'react';
import { CircuitState, ToolMode, Position, Wire, TransformState, PinHighlightDef } from '../types';
import { SvgComponent } from './SvgComponents';
import { COMPONENT_DEFS } from '../utils/componentsDef';

interface CanvasProps {
  state: CircuitState;
  tool: ToolMode;
  poweredLoads: string[];
  activeWires: string[];
  energizedWires: string[];
  errors: string[];
  transform: TransformState;
  voltages: Record<string, string>; // From simulator
  highlightedPins?: PinHighlightDef[];
  showPinLabels?: boolean;
  onTransformChange: (t: TransformState) => void;
  onStateChange: (newState: CircuitState) => void;
  onItemSelect: (id: string, type: 'component' | 'pin') => void;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  state, 
  tool, 
  poweredLoads, 
  activeWires, 
  energizedWires, 
  errors, 
  transform, 
  voltages, 
  highlightedPins = [],
  showPinLabels = false,
  onTransformChange, 
  onStateChange, 
  onItemSelect 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dragItem, setDragItem] = useState<{ id: string, type: 'component' | 'compartment', startX: number, startY: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Wire drawing state
  const [wiringStart, setWiringStart] = useState<{ compId: string, pinId: string, pos: Position } | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  // Multimeter state
  const [multimeterProbe1, setMultimeterProbe1] = useState<{ compId: string, pinId: string, pos: Position, key: string } | null>(null);
  const [multimeterProbe2, setMultimeterProbe2] = useState<{ compId: string, pinId: string, pos: Position, key: string } | null>(null);

  // Compartment drawing state
  const [drawingCompartment, setDrawingCompartment] = useState<{ startX: number, startY: number } | null>(null);

  // Wire error feedback
  const [wireError, setWireError] = useState<string | null>(null);
  const wireErrorTimeoutRef = useRef<number | null>(null);

  const showWireError = (msg: string) => {
    setWireError(msg);
    if (wireErrorTimeoutRef.current) window.clearTimeout(wireErrorTimeoutRef.current);
    wireErrorTimeoutRef.current = window.setTimeout(() => setWireError(null), 4500);
  };

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });

  // Clear multimeter when switching tools + reset wiring on tool change
  useEffect(() => {
    if (tool !== 'multimeter') {
      setMultimeterProbe1(null);
      setMultimeterProbe2(null);
    }
    // If leaving wire tools, cancel pending first click
    if (!tool.startsWith('wire_')) {
      setWiringStart(null);
    }
  }, [tool]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && wiringStart) {
        setWiringStart(null);
        return;
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        onStateChange({
          ...state,
          components: state.components.filter(c => c.id !== selectedId),
          compartments: state.compartments.filter(c => c.id !== selectedId),
          wires: state.wires.filter(w => w.id !== selectedId && w.startComponentId !== selectedId && w.endComponentId !== selectedId)
        });
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, state, onStateChange, wiringStart]);

  const getSvgPoint = (e: React.MouseEvent | MouseEvent | React.WheelEvent): Position => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    // We only inverse the screen matrix to get the point in SVG space BEFORE our custom transform.
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    // Now we must reverse our custom pan/zoom transform manually
    return {
      x: (cursorPt.x - transform.x) / transform.scale,
      y: (cursorPt.y - transform.y) / transform.scale
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;
    
    // Zooming
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.2, transform.scale + delta), 3);
    
    // Calculate mouse position in raw SVG space (without our transform)
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorRaw = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    // Adjust pan to zoom into cursor
    const scaleRatio = newScale / transform.scale;
    const newX = cursorRaw.x - (cursorRaw.x - transform.x) * scaleRatio;
    const newY = cursorRaw.y - (cursorRaw.y - transform.y) * scaleRatio;

    onTransformChange({ x: newX, y: newY, scale: newScale });
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2 || tool === 'pan') {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
      return;
    }

    const pt = getSvgPoint(e);
    
    if (tool === 'select') {
      setSelectedId(null);
    } else if (tool === 'draw_compartment') {
      setDrawingCompartment({ startX: pt.x, startY: pt.y });
    } else if (tool.startsWith('place_')) {
      const type = tool.replace('place_', '') as any;
      const newComp = {
        id: `comp_${Date.now()}`,
        type,
        position: { x: pt.x - 20, y: pt.y - 20 },
        state: {}
      };
      onStateChange({
        ...state,
        components: [...state.components, newComp]
      });
      setSelectedId(newComp.id);
    } else if (tool.startsWith('wire_') && wiringStart) {
      // Click su sfondo vuoto mentre è in attesa secondo polo -> annulla selezione primo polo
      const target = e.target as Element;
      // Only cancel if not clicking on a pin (pin handler stops propagation)
      if (!target.closest('[data-pin-hit]')) {
        setWiringStart(null);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (isPanning) {
      onTransformChange({
        ...transform,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    const pt = getSvgPoint(e);
    setMousePos(pt);

    if (dragItem) {
      if (dragItem.type === 'component') {
        onStateChange({
          ...state,
          components: state.components.map(c => 
            c.id === dragItem.id ? { ...c, position: { x: pt.x - dragItem.startX, y: pt.y - dragItem.startY } } : c
          )
        });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (dragItem) {
      setDragItem(null);
    }
    
    if (drawingCompartment) {
      const pt = getSvgPoint(e as any);
      const x = Math.min(drawingCompartment.startX, pt.x);
      const y = Math.min(drawingCompartment.startY, pt.y);
      const width = Math.abs(pt.x - drawingCompartment.startX);
      const height = Math.abs(pt.y - drawingCompartment.startY);
      
      if (width > 20 && height > 20) {
        const newComp = {
          id: `comp_rt_${Date.now()}`,
          x, y, width, height,
          label: 'Vano Scafo'
        };
        onStateChange({
          ...state,
          compartments: [...state.compartments, newComp]
        });
      }
      setDrawingCompartment(null);
    }

    // In click-click mode wiring is cancelled only on background click (handlePointerDown) or Esc / tool change
  };

  const handleComponentMouseDown = (e: React.MouseEvent, id: string, compX: number, compY: number) => {
    e.stopPropagation();
    if (tool === 'select') {
      setSelectedId(id);
      onItemSelect(id, 'component');
      const pt = getSvgPoint(e);
      setDragItem({ id, type: 'component', startX: pt.x - compX, startY: pt.y - compY });
    }
  };

  const getPinDef = (compId: string, pinId: string) => {
    const comp = state.components.find(c => c.id === compId);
    if (!comp) return null;
    const def = COMPONENT_DEFS[comp.type];
    return def.pins.find(p => p.id === pinId) || null;
  };

  const validateWire = (
    color: 'red' | 'black' | 'brown' | 'blue' | 'yellow',
    startPinType: string,
    endPinType: string
  ): string | null => {
    const isPosFamily = (t: string) => ['positive','switch_in','switch_out','bat1','bat2','out'].includes(t);
    const isNeg = (t: string) => t === 'negative';
    const isAcLive = (t: string) => t === 'ac_live';
    const isAcNeutral = (t: string) => t === 'ac_neutral';
    const isFuel = (t: string) => t === 'fuel';

    if (color === 'yellow') {
      if (!isFuel(startPinType) || !isFuel(endPinType)) {
        return 'Tubo Carburante (giallo) va SOLO tra pin carburante (gialli: serbatoio, pompa, motore).';
      }
      return null;
    }

    if (isFuel(startPinType) || isFuel(endPinType)) {
      return 'Questo è un pin CARBURANTE (giallo)! Usa il Tubo Carburante (giallo) e NON un cavo elettrico.';
    }

    if (color === 'red') {
      if (isNeg(startPinType) || isNeg(endPinType)) {
        return 'Cavo ROSSO (+) collegato a pin NERO/GND (-)! Il rosso va SOLO su pin positivi (contrassegnati in rosso: +, BAT1/BAT2, OUT, pos_in). Usa il cavo NERO per i pin negativi.';
      }
      if (isAcLive(startPinType) || isAcLive(endPinType) || isAcNeutral(startPinType) || isAcNeutral(endPinType)) {
        return 'Cavo ROSSO (DC 12V) collegato a pin AC 230V (marrone/blu)! Usa cavo MARRONE per Fase (L) e BLU per Neutro (N) per i pin AC.';
      }
      if (startPinType === 'data' || endPinType === 'data') {
        return 'Cavo ROSSO non va su pin DATI (verde)! Quel pin è solo per segnali, non per alimentazione.';
      }
      if (!isPosFamily(startPinType) || !isPosFamily(endPinType)) {
        return `Pin non compatibile con cavo ROSSO: ${startPinType} → ${endPinType}. Il rosso collega solo pin positivi tra loro.`;
      }
    }
    if (color === 'black') {
      if (isPosFamily(startPinType) || isPosFamily(endPinType)) {
        return 'Cavo NERO (-) collegato a pin ROSSO/Positivo (+) ! Il nero va SOLO su pin negativi (GND, n*, neg_in). Usa cavo ROSSO per i positivi.';
      }
      if (isAcLive(startPinType) || isAcLive(endPinType) || isAcNeutral(startPinType) || isAcNeutral(endPinType)) {
        return 'Cavo NERO (GND DC) collegato a pin AC 230V! Per AC usa BLU (Neutro) o MARRONE (Fase), non il nero DC.';
      }
      if (startPinType === 'data' || endPinType === 'data') {
        return 'Cavo NERO non va su pin DATI (verde)!';
      }
      if (!isNeg(startPinType) || !isNeg(endPinType)) {
        return `Pin non compatibile con cavo NERO: ${startPinType} → ${endPinType}. Il nero collega solo pin negativi tra loro.`;
      }
    }
    if (color === 'brown') {
      if (!isAcLive(startPinType) || !isAcLive(endPinType)) {
        return 'Cavo MARRONE (Fase AC L) va SOLO tra pin AC Live (marrone/L). Hai provato a collegarlo a pin DC o Neutro.';
      }
    }
    if (color === 'blue') {
      if (!isAcNeutral(startPinType) || !isAcNeutral(endPinType)) {
        return 'Cavo BLU (Neutro AC N) va SOLO tra pin AC Neutral (blu/N). Hai provato a collegarlo a pin DC o Fase.';
      }
    }
    return null;
  };

  // Click-click wiring: 1° clic = seleziona primo polo, 2° clic = collega
  const handlePinClick = (e: React.PointerEvent, compId: string, pinId: string) => {
    (e as any).stopPropagation();
    if (tool === 'select') {
      const comp = state.components.find(c => c.id === compId)!;
      const def = COMPONENT_DEFS[comp.type];
      const pinDef = def.pins.find(p => p.id === pinId)!;
      onItemSelect(pinDef.type, 'pin');
      return;
    }
    if (tool === 'multimeter') {
      const pos = getPinPos(compId, pinId);
      const key = `${compId}:${pinId}`;
      if (!multimeterProbe1) {
        setMultimeterProbe1({ compId, pinId, pos, key });
      } else if (!multimeterProbe2 && multimeterProbe1.key !== key) {
        setMultimeterProbe2({ compId, pinId, pos, key });
      } else {
        setMultimeterProbe1({ compId, pinId, pos, key });
        setMultimeterProbe2(null);
      }
      return;
    }
    if (tool === 'wire_red' || tool === 'wire_black' || tool === 'wire_brown' || tool === 'wire_blue' || tool === 'wire_yellow') {
      const comp = state.components.find(c => c.id === compId)!;
      const def = COMPONENT_DEFS[comp.type];
      const pinDef = def.pins.find(p => p.id === pinId)!;

      // Primo clic: memorizza partenza
      if (!wiringStart) {
        setWiringStart({
          compId,
          pinId,
          pos: { x: comp.position.x + pinDef.x, y: comp.position.y + pinDef.y }
        });
        return;
      }

      // Secondo clic: stesso pin -> annulla
      if (wiringStart.compId === compId && wiringStart.pinId === pinId) {
        setWiringStart(null);
        return;
      }

      // Secondo clic: tenta collegamento
      const startDef = getPinDef(wiringStart.compId, wiringStart.pinId);
      const endDef = getPinDef(compId, pinId);
      if (!startDef || !endDef) {
        setWiringStart(null);
        return;
      }
      const color = tool === 'wire_red' ? 'red' as const : (tool === 'wire_black' ? 'black' as const : (tool === 'wire_brown' ? 'brown' as const : (tool === 'wire_blue' ? 'blue' as const : 'yellow' as const)));

      const duplicate = state.wires.some(w =>
        (w.startComponentId === wiringStart.compId && w.startPinId === wiringStart.pinId && w.endComponentId === compId && w.endPinId === pinId) ||
        (w.startComponentId === compId && w.startPinId === pinId && w.endComponentId === wiringStart.compId && w.endPinId === wiringStart.pinId)
      );
      if (duplicate) {
        showWireError('Collegamento già esistente! Questo filo esiste già tra questi due pin.');
        setWiringStart(null);
        return;
      }

      const validationError = validateWire(color, startDef.type, endDef.type);
      if (validationError) {
        showWireError(validationError);
        setWiringStart(null);
        return;
      }

      const wire: Wire = {
        id: `wire_${Date.now()}`,
        startComponentId: wiringStart.compId,
        startPinId: wiringStart.pinId,
        endComponentId: compId,
        endPinId: pinId,
        color,
        path: []
      };
      onStateChange({ ...state, wires: [...state.wires, wire] });
      setWiringStart(null);
    }
  };

  const handleToggleState = (compId: string, payload?: any) => {
    onStateChange({
      ...state,
      components: state.components.map(c => {
        if (c.id === compId) {
          if (c.type === 'toggle_switch' || c.type === 'inverter' || c.type === 'timone') {
            return { ...c, state: { ...c.state, on: !c.state?.on } };
          }
          if (c.type === 'manopola') {
            const gears = ['neutral', 'avanti', 'retromarcia'];
            const curIdx = gears.indexOf(c.state?.gear || 'neutral');
            return { ...c, state: { ...c.state, gear: gears[(curIdx + 1) % gears.length] } };
          }
          if (c.type === 'battery_switch') {
            const modes = ['off', '1', 'both', '2'];
            const curIdx = modes.indexOf(c.state?.mode || 'off');
            return { ...c, state: { ...c.state, mode: modes[(curIdx + 1) % modes.length] } };
          }
          if (c.type === 'dc_panel' || c.type === 'ac_panel') {
            const switchKey = `switch${payload.switchIndex}`;
            return { ...c, state: { ...c.state, [switchKey]: !c.state?.[switchKey] } };
          }
        }
        return c;
      })
    });
  };

  // get pin absolute pos for wires
  const getPinPos = (compId: string, pinId: string) => {
    const comp = state.components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const def = COMPONENT_DEFS[comp.type];
    const pinDef = def.pins.find(p => p.id === pinId);
    if (!pinDef) return { x: 0, y: 0 };
    return { x: comp.position.x + pinDef.x, y: comp.position.y + pinDef.y };
  };

  return (
    <div className="flex-1 relative bg-slate-900 overflow-hidden" style={{ cursor: isPanning ? 'grabbing' : (tool === 'select' ? 'default' : 'crosshair') }}>
      {wiringStart && !wireError && tool.startsWith('wire_') && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-sky-950/90 backdrop-blur border border-sky-500/40 text-sky-100 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.3)] z-50 flex items-center gap-2 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          Primo polo selezionato — clicca il secondo polo per collegare
          <span className="ml-2 text-sky-300/70 font-mono text-[10px] border border-sky-500/30 px-1.5 py-0.5 rounded">ESC per annullare</span>
        </div>
      )}
      {wireError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-amber-950/95 backdrop-blur border border-amber-500/50 text-amber-100 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] z-50 flex flex-col items-center max-w-[560px] animate-in fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400">⚠️</span>
            <h3 className="font-black uppercase tracking-widest text-amber-300 text-xs">Collegamento non valido</h3>
          </div>
          <p className="text-sm font-semibold text-amber-100 text-center leading-snug">{wireError}</p>
          <button onClick={() => setWireError(null)} className="mt-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1 rounded-full font-bold">Chiudi</button>
        </div>
      )}
      {errors.length > 0 && !wireError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-950/90 backdrop-blur border border-red-500/50 text-red-100 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] z-50 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="font-black uppercase tracking-widest text-red-400 text-sm">Cortocircuito Rilevato</h3>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <ul className="text-sm font-semibold text-red-200">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <svg
        ref={svgRef}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="grid" width={40 * transform.scale} height={40 * transform.scale} patternUnits="userSpaceOnUse" patternTransform={`translate(${transform.x}, ${transform.y})`}>
            <path d={`M ${40 * transform.scale} 0 L 0 0 0 ${40 * transform.scale}`} fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
            <path d={`M ${200 * transform.scale} 0 L 0 0 0 ${200 * transform.scale}`} fill="none" stroke="#334155" strokeWidth="2" opacity="0.3" />
          </pattern>
          
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.6"/>
          </filter>
          <filter id="drop-shadow-small" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
          </filter>
          
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-yellow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-white">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <linearGradient id="batGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          
          <linearGradient id="tinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          
          <linearGradient id="redPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          
          <linearGradient id="blackPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Compartments */}
          {state.compartments.map(comp => (
            <g key={comp.id} onClick={(e) => { e.stopPropagation(); if (tool==='select') setSelectedId(comp.id); }}>
              <rect
                x={comp.x} y={comp.y} width={comp.width} height={comp.height} rx={16}
                fill="rgba(15, 23, 42, 0.6)" stroke={selectedId === comp.id ? '#3b82f6' : '#334155'} strokeWidth={selectedId === comp.id ? 2 : 1}
                strokeDasharray={selectedId === comp.id ? '' : '8,8'}
              />
              <rect x={comp.x} y={comp.y} width={comp.width} height={40} rx={16} fill="rgba(30, 41, 59, 0.8)" style={{ clipPath: `inset(0 0 20px 0)` }} />
              <text x={comp.x + 20} y={comp.y + 25} fill="#94a3b8" fontSize={16} fontWeight="black" letterSpacing="1" style={{ pointerEvents: 'none' }}>
                {comp.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Wires */}
          {state.wires.map(wire => {
            const start = getPinPos(wire.startComponentId, wire.startPinId);
            const end = getPinPos(wire.endComponentId, wire.endPinId);
            const isSelected = selectedId === wire.id;
            const isActive = activeWires.includes(wire.id);
            const baseColor = wire.color === 'red' ? '#ef4444' : '#1e293b';
            
            return (
              <g key={wire.id} onClick={(e) => { e.stopPropagation(); if (tool==='select') setSelectedId(wire.id); }}>
                {/* Base wire */}
                <path
                  d={`M ${start.x} ${start.y} C ${start.x} ${(start.y+end.y)/2}, ${end.x} ${(start.y+end.y)/2}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke={isSelected ? '#3b82f6' : (wire.color === 'red' ? '#ef4444' : (wire.color === 'black' ? '#1e293b' : (wire.color === 'brown' ? '#a16207' : (wire.color === 'yellow' ? '#eab308' : '#1d4ed8'))))}
                  strokeWidth={isSelected ? 6 : 4}
                  strokeLinecap="round"
                  style={{ cursor: 'pointer' }}
                  filter={isSelected ? 'url(#glow-white)' : (isActive && (wire.color === 'red' || wire.color === 'brown') ? 'url(#glow-red)' : '')}
                />
                
                {/* Active current animation */}
                {isActive && (
                   <path
                     d={`M ${start.x} ${start.y} C ${start.x} ${(start.y+end.y)/2}, ${end.x} ${(start.y+end.y)/2}, ${end.x} ${end.y}`}
                     fill="none"
                     stroke={wire.color === 'red' ? '#fca5a5' : (wire.color === 'black' ? '#cbd5e1' : (wire.color === 'brown' ? '#fef08a' : (wire.color === 'yellow' ? '#fde047' : '#bfdbfe')))}
                     strokeWidth={2}
                     strokeLinecap="round"
                     strokeDasharray="4 12"
                     className={wire.color === 'red' || wire.color === 'brown' ? 'animate-flow-forward' : 'animate-flow-backward'}
                     style={{ pointerEvents: 'none' }}
                   />
                )}
                
                <path
                  d={`M ${start.x} ${start.y} C ${start.x} ${(start.y+end.y)/2}, ${end.x} ${(start.y+end.y)/2}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={15}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            );
          })}

          {/* Current wiring preview */}
          {wiringStart && (
            <path
               d={`M ${wiringStart.pos.x} ${wiringStart.pos.y} C ${wiringStart.pos.x} ${(wiringStart.pos.y+mousePos.y)/2}, ${mousePos.x} ${(wiringStart.pos.y+mousePos.y)/2}, ${mousePos.x} ${mousePos.y}`}
               fill="none"
               stroke={tool === 'wire_red' ? '#ef4444' : (tool === 'wire_black' ? '#94a3b8' : (tool === 'wire_brown' ? '#a16207' : (tool === 'wire_blue' ? '#1d4ed8' : '#eab308')))}
               strokeWidth={4}
               strokeDasharray="8,4"
               className="animate-pulse"
            />
          )}

          {/* Multimeter Probes */}
          {multimeterProbe1 && (
             <g>
               <circle cx={multimeterProbe1.pos.x} cy={multimeterProbe1.pos.y} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
               <line x1={multimeterProbe1.pos.x} y1={multimeterProbe1.pos.y} x2={multimeterProbe1.pos.x + 20} y2={multimeterProbe1.pos.y - 40} stroke="#ef4444" strokeWidth={3} />
               <rect x={multimeterProbe1.pos.x + 10} y={multimeterProbe1.pos.y - 70} width={40} height={20} rx={4} fill="#1e293b" />
               <text x={multimeterProbe1.pos.x + 30} y={multimeterProbe1.pos.y - 55} fill="#fff" fontSize={10} textAnchor="middle">V+</text>
             </g>
          )}
          
          {multimeterProbe2 && (
             <g>
               <circle cx={multimeterProbe2.pos.x} cy={multimeterProbe2.pos.y} r={6} fill="#000" stroke="#fff" strokeWidth={2} />
               <line x1={multimeterProbe2.pos.x} y1={multimeterProbe2.pos.y} x2={multimeterProbe2.pos.x + 20} y2={multimeterProbe2.pos.y - 40} stroke="#000" strokeWidth={3} />
               <rect x={multimeterProbe2.pos.x + 10} y={multimeterProbe2.pos.y - 70} width={40} height={20} rx={4} fill="#1e293b" />
               <text x={multimeterProbe2.pos.x + 30} y={multimeterProbe2.pos.y - 55} fill="#fff" fontSize={10} textAnchor="middle">COM</text>
             </g>
          )}

          {/* Multimeter Display Overlay */}
          {multimeterProbe1 && (
            <g transform={`translate(${multimeterProbe2 ? (multimeterProbe1.pos.x + multimeterProbe2.pos.x)/2 - 50 : multimeterProbe1.pos.x - 50}, ${multimeterProbe1.pos.y - 120})`}>
               <rect width={100} height={40} rx={4} fill="#eab308" stroke="#ca8a04" strokeWidth={2} />
               <rect x={10} y={5} width={80} height={30} fill="#1e293b" rx={2} />
               <text x={50} y={25} fill="#22c55e" fontSize={16} fontWeight="bold" textAnchor="middle" className="font-mono">
                 {multimeterProbe2 
                   ? (voltages[multimeterProbe1.key] || voltages[multimeterProbe2.key] ? (voltages[multimeterProbe1.key] !== voltages[multimeterProbe2.key] ? (voltages[multimeterProbe1.key]?.includes('AC') ? '230.0 V' : '12.44 V') : '0.00 V') : '0.00 V')
                   : '--- V'}
               </text>
            </g>
          )}

          {/* Components */}
          {state.components.map(comp => (
            <SvgComponent
              key={comp.id}
              component={comp}
              isSelected={selectedId === comp.id}
              onMouseDown={(e) => handleComponentMouseDown(e, comp.id, comp.position.x, comp.position.y)}
              onPinClick={(e, pinId) => handlePinClick(e, comp.id, pinId)}
              onToggleState={(payload) => handleToggleState(comp.id, payload)}
              isPowered={poweredLoads.includes(comp.id)}
              showPinLabels={showPinLabels}
              selectedPinId={wiringStart?.compId === comp.id ? wiringStart.pinId : undefined}
            />
          ))}

          {/* Highlighted Pins / Lesson Guidance Beacons */}
          {highlightedPins?.map((hp, idx) => {
            const pos = getPinPos(hp.componentId, hp.pinId);
            if (!pos || (pos.x === 0 && pos.y === 0)) return null;
            const beaconColor = hp.color === 'red' ? '#ef4444' : (hp.color === 'black' ? '#38bdf8' : (hp.color === 'yellow' ? '#eab308' : '#a855f7'));
            
            return (
              <g key={`beacon_${hp.componentId}_${hp.pinId}_${idx}`} transform={`translate(${pos.x}, ${pos.y})`} style={{ pointerEvents: 'none' }}>
                {/* Expanding pulse wave */}
                <circle r={14} fill="none" stroke={beaconColor} strokeWidth={2} className="animate-ping" opacity={0.8} />
                <circle r={9} fill="none" stroke={beaconColor} strokeWidth={2.5} />
                <circle r={3.5} fill="#ffffff" />
                {/* Callout flag */}
                <g transform="translate(12, -22)">
                  <rect 
                    x={0} 
                    y={0} 
                    width={hp.label.length * 6.8 + 16} 
                    height={22} 
                    rx={6} 
                    fill="#020617" 
                    stroke={beaconColor} 
                    strokeWidth={1.5} 
                    className="shadow-xl"
                  />
                  <text 
                    x={8} 
                    y={15} 
                    fill="#f8fafc" 
                    fontSize={11} 
                    fontWeight="900" 
                    className="tracking-wide font-sans"
                  >
                    {hp.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Drawing Compartment Preview */}
          {drawingCompartment && (
            <rect
              x={Math.min(drawingCompartment.startX, mousePos.x)}
              y={Math.min(drawingCompartment.startY, mousePos.y)}
              width={Math.abs(mousePos.x - drawingCompartment.startX)}
              height={Math.abs(mousePos.y - drawingCompartment.startY)}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
