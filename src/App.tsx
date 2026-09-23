import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CircuitState, ToolMode, TransformState, ComponentType, PinHighlightDef } from './types';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { LessonModal } from './components/LessonModal';
import { simulateCircuit, SimulationResult } from './utils/simulator';
import { defaultState } from './utils/defaultState';
import { LESSONS } from './utils/lessons';
import { LESSON_STEPS } from './utils/lessonData';
import { COMPONENT_DEFS } from './utils/componentsDef';
import { BookOpen, X, Info, Download, Save, FileText, Settings, GraduationCap } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<CircuitState>(defaultState);
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 1 });

  const [tool, setTool] = useState<ToolMode>('select');
  const [simulation, setSimulation] = useState<SimulationResult>({ poweredLoads: [], errors: [], activeWires: [], energizedWires: [], voltages: {} });
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<{ id: string, type: 'component' | 'pin', defId: string } | null>(null);

  // ============================================
  // LESSON STATE
  // ============================================
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonStepIndex, setLessonStepIndex] = useState(0);
  const [showGuidePins, setShowGuidePins] = useState(true);
  const [showPinLabels, setShowPinLabels] = useState(false);
  const savedStateRef = useRef<CircuitState | null>(null);

  // Run simulation whenever state changes
  useEffect(() => {
    setSimulation(simulateCircuit(state));
  }, [state]);

  const handleClear = () => {
    setState({ components: [], wires: [], compartments: [] });
    setShowClearConfirm(false);
    setSelectedItemInfo(null);
  };

  const handleItemSelect = (id: string, type: 'component' | 'pin') => {
    if (type === 'component') {
      const comp = state.components.find(c => c.id === id);
      if (comp) setSelectedItemInfo({ id, type, defId: comp.type });
    } else {
      setSelectedItemInfo({ id, type, defId: id });
    }
  };

  const getLessonContent = () => {
    if (!selectedItemInfo) return null;
    let key = '';
    if (selectedItemInfo.type === 'pin') {
      key = `pin_${selectedItemInfo.defId}`;
    } else {
      key = selectedItemInfo.defId;
    }
    return LESSONS[key as keyof typeof LESSONS] || null;
  };

  const lessonContent = getLessonContent();
  const selectedComponent = selectedItemInfo?.type === 'component' ? state.components.find(c => c.id === selectedItemInfo.id) : null;

  // Generate BOM (Bill of Materials)
  const bom = useMemo(() => {
    const counts: Record<string, number> = {};
    state.components.forEach(c => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      name: COMPONENT_DEFS[type as ComponentType]?.name || type,
      count
    }));
  }, [state.components]);

  // UI Actions
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "nauticsim_layout.json");
    dlAnchorElem.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const json = JSON.parse(evt.target?.result as string);
            setState(json);
          } catch(err) {
            alert("Errore caricamento file!");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCustomNameChange = (id: string, newName: string) => {
    setState({
      ...state,
      components: state.components.map(c => c.id === id ? { ...c, customName: newName } : c)
    });
  };

  // ============================================
  // LESSON HANDLERS
  // ============================================
  const handleStartLesson = () => {
    // Save user's current work
    savedStateRef.current = JSON.parse(JSON.stringify(state));
    setLessonActive(true);
    setLessonStepIndex(0);
    setShowGuidePins(true);
    setShowPinLabels(false);
    // Load first lesson's initial circuit
    const firstStep = LESSON_STEPS[0];
    if (firstStep?.initialCircuit) {
      setState(JSON.parse(JSON.stringify(firstStep.initialCircuit)));
      setTransform({ x: 0, y: 0, scale: 1 });
    }
  };

  const handleCloseLesson = () => {
    setLessonActive(false);
    setShowGuidePins(false);
    setShowPinLabels(false);
    // Restore user's saved state
    if (savedStateRef.current) {
      setState(savedStateRef.current);
      savedStateRef.current = null;
    }
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleSelectLessonStep = (index: number) => {
    setLessonStepIndex(index);
    // Load that step's initial circuit
    const step = LESSON_STEPS[index];
    if (step?.initialCircuit) {
      setState(JSON.parse(JSON.stringify(step.initialCircuit)));
      setTransform({ x: 0, y: 0, scale: 1 });
    }
  };

  const handleLoadStepCircuit = (index: number) => {
    const step = LESSON_STEPS[index];
    if (step?.initialCircuit) {
      setState(JSON.parse(JSON.stringify(step.initialCircuit)));
      setTransform({ x: 0, y: 0, scale: 1 });
    }
  };

  // Get current highlighted pins for lesson
  const activeHighlights: PinHighlightDef[] = useMemo(() => {
    if (!lessonActive || !showGuidePins) return [];
    const step = LESSON_STEPS[lessonStepIndex];
    return step?.suggestedHighlights || [];
  }, [lessonActive, showGuidePins, lessonStepIndex]);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Toolbar currentTool={tool} onToolSelect={setTool} />
      
      <div className="flex-1 flex flex-col relative bg-slate-900 overflow-hidden">
        {/* Top Header */}
        <div className="h-14 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wide">NauticSim</h1>
            <span className="text-xs bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">PRO AC/DC</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Lesson Button */}
            {!lessonActive ? (
              <button
                onClick={handleStartLesson}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-400/30 animate-pulse hover:animate-none"
              >
                <GraduationCap size={16} /> Inizia Lezione
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/50 border border-amber-500/40 rounded-xl">
                <GraduationCap size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Lezione Attiva</span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">{lessonStepIndex + 1}/{LESSON_STEPS.length}</span>
              </div>
            )}

            <div className="flex gap-2 mr-4 border-r border-slate-800 pr-4">
               <button onClick={handleImport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors">
                 <Download size={14} /> Importa
               </button>
               <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors">
                 <Save size={14} /> Esporta
               </button>
            </div>
            
            <div className="text-sm bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800 shadow-inner flex items-center gap-2">
              <span className="text-slate-500 font-medium">Stato Rete: </span>
              <span className={simulation.errors.length > 0 ? "text-red-500 font-bold animate-pulse" : (simulation.activeWires.length > 0 ? "text-green-500 font-bold" : "text-yellow-500 font-bold")}>
                ● {simulation.errors.length > 0 ? 'CORTOCIRCUITO' : (simulation.activeWires.length > 0 ? 'ATTIVA (Flusso OK)' : 'STANDBY')}
              </span>
            </div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-950/80 px-3 py-1.5 rounded-full border border-red-900/50">
                <span className="text-xs text-red-300 font-bold uppercase tracking-wider">Cancellare tutto?</span>
                <button onClick={handleClear} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full font-bold transition-colors">Sì</button>
                <button onClick={() => setShowClearConfirm(false)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full font-bold transition-colors">No</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-1.5 bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-full border border-red-900/30 text-sm font-bold transition-all"
              >
                Pulisci Lavagna
              </button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <Canvas 
          state={state} 
          tool={tool} 
          poweredLoads={simulation.poweredLoads}
          activeWires={simulation.activeWires}
          energizedWires={simulation.energizedWires}
          errors={simulation.errors}
          transform={transform}
          voltages={simulation.voltages}
          highlightedPins={activeHighlights}
          showPinLabels={lessonActive && showPinLabels}
          onTransformChange={setTransform}
          onStateChange={setState} 
          onItemSelect={handleItemSelect}
        />

        {/* Lesson Modal (overlay) */}
        {lessonActive && (
          <LessonModal
            currentStepIndex={lessonStepIndex}
            circuitState={state}
            simulationResult={simulation}
            showGuidePins={showGuidePins}
            showPinLabels={showPinLabels}
            onSelectStep={handleSelectLessonStep}
            onLoadStepCircuit={handleLoadStepCircuit}
            onToggleGuidePins={() => setShowGuidePins(prev => !prev)}
            onTogglePinLabels={() => setShowPinLabels(prev => !prev)}
            onClose={handleCloseLesson}
          />
        )}

        {/* Right Panel (Inspector / BOM) */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-30 flex flex-col transition-transform duration-300 ${tool === 'select' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Settings size={16} /> Ispettore
            </h2>
            <button onClick={() => setTool('pan')} className="text-slate-500 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
            
            {/* Properties Editor */}
            {selectedComponent && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Nome Etichetta</label>
                <input 
                  type="text" 
                  value={selectedComponent.customName || COMPONENT_DEFS[selectedComponent.type].name}
                  onChange={(e) => handleCustomNameChange(selectedComponent.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                   <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Stato Rete:</span>
                   <span className={`text-xs font-black tracking-widest px-2 py-1 rounded ${simulation.poweredLoads.includes(selectedComponent.id) || ['battery','shore_power','solar_panel','vsr','mppt'].includes(selectedComponent.type) ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                     {simulation.poweredLoads.includes(selectedComponent.id) || ['battery','shore_power','solar_panel','vsr','mppt'].includes(selectedComponent.type) ? 'ATTIVO' : 'SPENTO'}
                   </span>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {selectedItemInfo && lessonContent && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-blue-400 mb-1 leading-tight">{lessonContent.title}</h3>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">{lessonContent.description}</p>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Manuale Tecnico</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{lessonContent.detailed}</p>
                </div>
              </div>
            )}

            {!selectedItemInfo && (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-50 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                <Info size={32} />
                <p className="text-xs font-medium px-4">Seleziona un componente o un pin per vedere le proprietà e il manuale tecnico.</p>
              </div>
            )}

            {/* BOM */}
            {!selectedItemInfo && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <FileText size={14} /> Distinta Materiali
                </h4>
                {bom.length === 0 ? (
                  <p className="text-xs text-slate-500">Nessun componente inserito.</p>
                ) : (
                  <ul className="space-y-2">
                    {bom.map((b, i) => (
                      <li key={i} className="flex justify-between items-center text-xs text-slate-300 border-b border-slate-800/50 pb-2">
                        <span className="truncate pr-2">{b.name}</span>
                        <span className="font-mono text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded font-bold">x{b.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
