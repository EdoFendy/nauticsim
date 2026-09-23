import React, { useState } from 'react';
import { LessonStep, CircuitState, PinHighlightDef } from '../types';
import { LESSON_STEPS } from '../utils/lessonData';
import { 
  GraduationCap, CheckCircle2, Circle, ChevronLeft, ChevronRight, 
  Sparkles, Flame, ShieldAlert, Zap, Compass, RotateCcw, 
  Eye, EyeOff, X, Minimize2, Maximize2, Lightbulb, BookmarkCheck,
  HelpCircle, AlertTriangle
} from 'lucide-react';

interface LessonModalProps {
  currentStepIndex: number;
  circuitState: CircuitState;
  simulationResult: any;
  showGuidePins: boolean;
  showPinLabels: boolean;
  onSelectStep: (index: number) => void;
  onLoadStepCircuit: (index: number) => void;
  onToggleGuidePins: () => void;
  onTogglePinLabels: () => void;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  currentStepIndex,
  circuitState,
  simulationResult,
  showGuidePins,
  showPinLabels,
  onSelectStep,
  onLoadStepCircuit,
  onToggleGuidePins,
  onTogglePinLabels,
  onClose
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'objectives' | 'diagram'>('theory');

  const step = LESSON_STEPS[currentStepIndex] || LESSON_STEPS[0];
  const totalSteps = LESSON_STEPS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Check completions of objectives
  const objectivesStatus = step.objectives.map(obj => ({
    ...obj,
    completed: obj.isCompleted(circuitState, simulationResult)
  }));

  const allCompleted = objectivesStatus.length > 0 && objectivesStatus.every(o => o.completed);

  if (isMinimized) {
    return (
      <div className="absolute top-16 left-6 z-40 flex items-center gap-3 bg-slate-950/90 backdrop-blur-md border border-blue-500/40 p-2.5 px-4 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-400 animate-bounce" size={20} />
          <span className="text-xs font-black uppercase tracking-wider text-blue-200">
            Lezione {step.id}/{totalSteps}: {step.title.split(':')[0]}
          </span>
        </div>
        
        <div className="h-4 w-px bg-slate-700 mx-1"></div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            title="Passo precedente"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-mono font-bold text-cyan-400 px-1">{step.id}</span>
          <button 
            onClick={() => onSelectStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            title="Prossimo passo"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        <button 
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow"
        >
          <Maximize2 size={13} /> Espandi
        </button>
        <button 
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
          title="Esci dalla lezione"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-16 left-6 bottom-6 w-[490px] max-w-[calc(100vw-3rem)] bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] z-40 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-left-4">
      {/* Top Header Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/50 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">NauticSim Academy</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full font-bold">
                {step.badge}
              </span>
            </div>
            <h2 className="text-sm font-black text-white leading-tight mt-0.5 truncate max-w-[280px]">
              {step.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Riduci a icona"
          >
            <Minimize2 size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Chiudi Lezione"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress & Stepper Pills */}
      <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Compass size={13} className="text-blue-400" />
            Modulo {step.id} di {totalSteps}
          </span>
          <span className="font-mono font-black text-cyan-400 text-[11px] bg-cyan-950/60 border border-cyan-900/50 px-2 py-0.5 rounded-full">
            {progressPercent}% Completato
          </span>
        </div>

        {/* Mini Step Navigator Dots */}
        <div className="flex items-center gap-1.5">
          {LESSON_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => onSelectStep(idx)}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                  : idx < currentStepIndex
                  ? 'bg-blue-800/80 hover:bg-blue-700'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Passo ${s.id}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Action Quickbar */}
      <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLoadStepCircuit(currentStepIndex)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 rounded-lg text-xs font-bold transition-all shadow hover:border-blue-400"
            title="Carica la configurazione guidata sul canvas"
          >
            <RotateCcw size={12} className="text-blue-400" /> Carica Circuito Esempio
          </button>

          <button
            onClick={onToggleGuidePins}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              showGuidePins 
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra fari pulsanti sui pin da connettere"
          >
            <Zap size={12} className={showGuidePins ? 'text-amber-400' : ''} /> 
            {showGuidePins ? 'Fari Attivi' : 'Mostra Pin'}
          </button>

          <button
            onClick={onTogglePinLabels}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              showPinLabels
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Mostra etichette con nome su tutti i pin"
          >
            {showPinLabels ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
              activeTab === 'theory' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Spiegazione
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${
              activeTab === 'objectives' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Obiettivi {allCompleted && '✓'}
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
        {activeTab === 'theory' && (
          <div className="space-y-4">
            {/* Subtitle & Summary */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                {step.subtitle}
              </p>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {step.theory.summary}
              </p>
            </div>

            {/* Special Visual Schematic for Fuses / Batteries */}
            {step.id === 3 && (
              <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 rounded-xl p-4 border border-amber-500/30 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-amber-400" size={16} />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Come Funziona il Fusibile: Cavo Rosso vs Cavo Nero
                  </span>
                </div>
                
                {/* SVG Schematic diagram of fuse */}
                <div className="w-full bg-slate-950/80 rounded-lg p-3 border border-slate-800 flex flex-col items-center">
                  <svg viewBox="0 0 400 90" className="w-full max-w-[360px] h-auto">
                    {/* Input Wire Red */}
                    <line x1="10" y1="45" x2="110" y2="45" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                    <text x="50" y="32" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">Cavo Rosso (IN)</text>
                    <text x="50" y="65" fill="#94a3b8" fontSize="8" textAnchor="middle">da Bat / Out Switch</text>

                    {/* Fuse Body */}
                    <rect x="110" y="20" width="180" height="50" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    <rect x="135" y="26" width="130" height="38" rx="4" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" />
                    
                    {/* Copper Terminals */}
                    <circle cx="125" cy="45" r="7" fill="#f59e0b" stroke="#78350f" />
                    <circle cx="275" cy="45" r="7" fill="#f59e0b" stroke="#78350f" />

                    {/* S Filament */}
                    <path d="M 135 45 L 180 45 Q 200 30 200 45 Q 200 60 220 45 L 265 45" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                    <text x="200" y="58" fill="#fef08a" fontSize="8" fontWeight="black" textAnchor="middle">50A ANL</text>

                    {/* Output Wire Red */}
                    <line x1="290" y1="45" x2="390" y2="45" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                    <text x="345" y="32" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">Cavo Rosso (OUT)</text>
                    <text x="345" y="65" fill="#94a3b8" fontSize="8" textAnchor="middle">alla Barra Positiva</text>
                  </svg>
                  <p className="text-[11px] text-amber-200 mt-2 font-medium text-center">
                    ⚠️ <strong>Nota bene</strong>: Nel fusibile entra ed esce <span className="text-red-400 font-bold">SOLO IL FILO ROSSO</span>. Non collegare MAI il filo nero, altrimenti provochi un cortocircuito istantaneo!
                  </p>
                </div>
              </div>
            )}

            {/* Special Visual Schematic for Battery Switch */}
            {step.id === 2 && (
              <div className="bg-gradient-to-br from-blue-950/30 to-slate-900 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="text-blue-400" size={16} />
                  <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                    Schema Cablaggio Staccabatterie a 4 Vie
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span><strong>Polo + Bat 1</strong> → Terminale <strong>BAT 1</strong> (cavo rosso)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span><strong>Polo + Bat 2</strong> → Terminale <strong>BAT 2</strong> (cavo rosso)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>Terminale <strong>OUT</strong> → Ingresso <strong>Fusibile Principale</strong> (cavo rosso)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                    <span><strong>Poli Negativi Bat 1 e Bat 2</strong> → <strong>Barra Negativa Comune</strong> (cavi neri)</span>
                  </div>
                </div>
              </div>
            )}

            {/* In-depth Points List */}
            <div className="space-y-3">
              {step.theory.points.map((pt, i) => (
                <div key={i} className="bg-slate-900 rounded-xl p-3.5 border border-slate-800/90 transition-all hover:border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-black text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {pt.title}
                    </h3>
                    {pt.tag && (
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        pt.tag.includes('PERICOLO') ? 'bg-red-950 text-red-300 border border-red-800' :
                        pt.tag.includes('Rosso') ? 'bg-red-950 text-red-300' :
                        pt.tag.includes('Nero') ? 'bg-slate-800 text-slate-300' :
                        'bg-blue-950 text-blue-300'
                      }`}>
                        {pt.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line font-normal">
                    {pt.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Safety Note Alert */}
            {step.theory.safetyNote && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3.5 flex gap-3 items-start">
                <Flame className="text-red-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-300 mb-1">
                    Avviso di Sicurezza Nautica
                  </h4>
                  <p className="text-xs text-red-200/80 leading-relaxed font-medium">
                    {step.theory.safetyNote}
                  </p>
                </div>
              </div>
            )}

            {/* Rules of Thumb */}
            {step.theory.rulesOfThumb && (
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2 text-xs font-black text-blue-400 uppercase tracking-wider">
                  <Lightbulb size={14} /> Regole da Ricordare Sempre
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {step.theory.rulesOfThumb.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Missione del Modulo {step.id}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Completa i collegamenti o le azioni richieste sul canvas. Quando tutti gli obiettivi sono verdi, sarai pronto per il passo successivo!
              </p>
            </div>

            <div className="space-y-2.5">
              {objectivesStatus.map((obj, i) => (
                <div 
                  key={obj.id} 
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    obj.completed
                      ? 'bg-green-950/30 border-green-700/60 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {obj.completed ? (
                      <CheckCircle2 className="text-green-400" size={18} />
                    ) : (
                      <Circle className="text-slate-600" size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-relaxed ${
                      obj.completed ? 'text-green-200 line-through opacity-85' : 'text-slate-200'
                    }`}>
                      {obj.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {allCompleted ? (
              <div className="bg-gradient-to-r from-green-950/60 to-emerald-950/60 border border-green-500/50 rounded-xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Sparkles className="text-green-400 animate-bounce" size={24} />
                <h4 className="text-sm font-black text-green-300 uppercase tracking-wider">
                  Obiettivo Raggiunto con Successo!
                </h4>
                <p className="text-xs text-green-200/80">
                  Ottimo lavoro! Hai compreso la logica del modulo. Clicca su &quot;Prossimo Step&quot; per continuare.
                </p>
                {currentStepIndex < totalSteps - 1 && (
                  <button
                    onClick={() => onSelectStep(currentStepIndex + 1)}
                    className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-lg"
                  >
                    Vai al Passo {step.id + 1} →
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  💡 <em>Suggerimento:</em> Usa il pulsante <strong className="text-amber-300">&quot;Mostra Pin&quot;</strong> in alto per vedere i fari guida sul canvas!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
        <button
          onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-colors"
        >
          <ChevronLeft size={14} /> Precedente
        </button>

        <div className="flex items-center gap-2">
          {currentStepIndex < totalSteps - 1 ? (
            <button
              onClick={() => onSelectStep(currentStepIndex + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Prossimo Step <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Completa Corso <BookmarkCheck size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
