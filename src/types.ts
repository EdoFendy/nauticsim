export type Position = { x: number; y: number };

export type ComponentType = 
  | 'battery' 
  | 'battery_switch' 
  | 'dc_panel' 
  | 'toggle_switch' 
  | 'light' 
  | 'bilge_pump'
  | 'freshwater_pump'
  | 'bus_bar_positive'
  | 'bus_bar_negative'
  | 'chartplotter'
  | 'vhf'
  | 'nav_light_port'
  | 'nav_light_stbd'
  | 'nav_light_stern'
  | 'anchor_light'
  | 'fuel_pump'
  | 'sonar'
  | 'stereo'
  | 'fuse'
  | 'fuse_block'
  // NEW: AC & Solar & Advanced
  | 'shore_power'
  | 'ac_panel'
  | 'inverter'
  | 'ac_outlet'
  | 'solar_panel'
  | 'mppt'
  | 'shunt'
  | 'battery_monitor'
  | 'vsr'
  | 'windlass'
  // NEW: Motore & Propulsione
  | 'engine'
  // NEW: Timoneria & Comando Motore
  | 'timone'
  | 'manopola'
  // NEW: Impianto Carburante
  | 'fuel_tank';

export type PinType = 'positive' | 'negative' | 'switch_in' | 'switch_out' | 'bat1' | 'bat2' | 'out' | 'ac_live' | 'ac_neutral' | 'data' | 'fuel';

export interface PinDef {
  id: string; 
  type: PinType;
  x: number;
  y: number;
  color: string;
}

export interface ComponentDef {
  type: ComponentType;
  name: string;
  width: number;
  height: number;
  pins: PinDef[];
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: Position;
  customName?: string;
  state: any; 
}

export interface Wire {
  id: string;
  startComponentId: string;
  startPinId: string;
  endComponentId: string;
  endPinId: string;
  color: 'red' | 'black' | 'brown' | 'blue' | 'green' | 'yellow';
  path: Position[];
}

export interface Compartment {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface CircuitState {
  components: CircuitComponent[];
  wires: Wire[];
  compartments: Compartment[];
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
}

export type ToolMode = 
  | 'select'
  | 'pan'
  | 'multimeter'
  | 'draw_compartment'
  | 'wire_red'
  | 'wire_black'
  | 'wire_brown'
  | 'wire_blue'
  | 'wire_yellow'
  | 'place_battery'
  | 'place_battery_switch'
  | 'place_dc_panel'
  | 'place_toggle_switch'
  | 'place_light'
  | 'place_bilge_pump'
  | 'place_freshwater_pump'
  | 'place_bus_bar_positive'
  | 'place_bus_bar_negative'
  | 'place_chartplotter'
  | 'place_vhf'
  | 'place_nav_light_port'
  | 'place_nav_light_stbd'
  | 'place_nav_light_stern'
  | 'place_anchor_light'
  | 'place_fuel_pump'
  | 'place_sonar'
  | 'place_stereo'
  | 'place_fuse'
  | 'place_fuse_block'
  | 'place_shore_power'
  | 'place_ac_panel'
  | 'place_inverter'
  | 'place_ac_outlet'
  | 'place_solar_panel'
  | 'place_mppt'
  | 'place_shunt'
  | 'place_battery_monitor'
  | 'place_vsr'
  | 'place_windlass'
  | 'place_engine'
  | 'place_timone'
  | 'place_manopola'
  | 'place_fuel_tank';

export interface PinHighlightDef {
  componentId: string;
  pinId: string;
  label: string;
  color: 'red' | 'black' | 'yellow' | 'blue';
  pulse?: boolean;
}

export interface LessonObjective {
  id: string;
  text: string;
  isCompleted: (state: CircuitState, simulationResult: any) => boolean;
}

export interface LessonStep {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  theory: {
    summary: string;
    points: { title: string; text: string; tag?: string }[];
    safetyNote?: string;
    rulesOfThumb?: string[];
  };
  objectives: LessonObjective[];
  initialCircuit: CircuitState;
  suggestedHighlights?: PinHighlightDef[];
}

