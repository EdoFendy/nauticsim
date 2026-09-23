import { CircuitState } from '../types';

export const defaultState: CircuitState = {
  compartments: [
    { id: 'c1', label: 'Engine Room / Lazarette', x: 50, y: 550, width: 1050, height: 280 },
    { id: 'c2', label: 'Helm / Center Console', x: 450, y: 100, width: 350, height: 420 },
    { id: 'c3', label: 'Forward Cabin', x: 50, y: 100, width: 350, height: 420 },
  ],
  components: [
    // POWER (Engine Room)
    { id: 'bat1', type: 'battery', position: { x: 100, y: 600 }, state: {} },
    { id: 'bat2', type: 'battery', position: { x: 250, y: 600 }, state: {} },
    { id: 'switch1', type: 'battery_switch', position: { x: 400, y: 600 }, state: { mode: 'both' } },
    { id: 'pos_bus', type: 'bus_bar_positive', position: { x: 600, y: 600 }, state: {} },
    { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 600, y: 660 }, state: {} },
    { id: 'bilge1', type: 'bilge_pump', position: { x: 900, y: 650 }, state: {} },
    
    // DISTRIBUTION (Helm)
    { 
      id: 'dc1', type: 'dc_panel', position: { x: 480, y: 150 }, 
      state: { switch1: true, switch2: true, switch3: false, switch4: true, switch5: true } 
    },
    { id: 'plotter1', type: 'chartplotter', position: { x: 650, y: 150 }, state: {} },
    { id: 'vhf1', type: 'vhf', position: { x: 650, y: 300 }, state: {} },
    
    // CABIN (Forward)
    { id: 'light1', type: 'light', position: { x: 100, y: 150 }, state: {} },
    { id: 'sw_light1', type: 'toggle_switch', position: { x: 100, y: 250 }, state: { on: true } },
    { id: 'pump1', type: 'freshwater_pump', position: { x: 200, y: 350 }, state: {} },
    
    // NAVIGATION LIGHTS (Scattered)
    { id: 'nav_port', type: 'nav_light_port', position: { x: 300, y: 40 }, state: {} },
    { id: 'nav_stbd', type: 'nav_light_stbd', position: { x: 800, y: 40 }, state: {} },
    { id: 'nav_stern', type: 'nav_light_stern', position: { x: 1000, y: 560 }, state: {} }
  ],
  wires: [
    // Battery Negs to Neg Bus
    { id: 'w1', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n0', color: 'black', path: [] },
    { id: 'w2', startComponentId: 'bat2', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n1', color: 'black', path: [] },
    
    // Battery Pos to Switch
    { id: 'w3', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat1', color: 'red', path: [] },
    { id: 'w4', startComponentId: 'bat2', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat2', color: 'red', path: [] },
    
    // Switch Out to Pos Bus
    { id: 'w5', startComponentId: 'switch1', startPinId: 'out', endComponentId: 'pos_bus', endPinId: 'p0', color: 'red', path: [] },
    
    // Main Panel Supply
    { id: 'w6', startComponentId: 'pos_bus', startPinId: 'p1', endComponentId: 'dc1', endPinId: 'pos_in', color: 'red', path: [] },
    { id: 'w7', startComponentId: 'neg_bus', startPinId: 'n2', endComponentId: 'dc1', endPinId: 'neg_in', color: 'black', path: [] },

    // Automatic Bilge Pump (Direct to Bus)
    { id: 'w_bilge_neg', startComponentId: 'neg_bus', startPinId: 'n3', endComponentId: 'bilge1', endPinId: 'neg', color: 'black', path: [] },
    { id: 'w_bilge_pos', startComponentId: 'pos_bus', startPinId: 'p2', endComponentId: 'bilge1', endPinId: 'pos', color: 'red', path: [] },

    // DC CH1: Chartplotter
    { id: 'w8', startComponentId: 'dc1', startPinId: 'out1_pos', endComponentId: 'plotter1', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w9', startComponentId: 'dc1', startPinId: 'out1_neg', endComponentId: 'plotter1', endPinId: 'neg', color: 'black', path: [] },
    
    // DC CH2: VHF
    { id: 'w10', startComponentId: 'dc1', startPinId: 'out2_pos', endComponentId: 'vhf1', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w11', startComponentId: 'dc1', startPinId: 'out2_neg', endComponentId: 'vhf1', endPinId: 'neg', color: 'black', path: [] },

    // DC CH3: Cabin Light (via Toggle Switch)
    { id: 'w12', startComponentId: 'dc1', startPinId: 'out3_pos', endComponentId: 'sw_light1', endPinId: 'in', color: 'red', path: [] },
    { id: 'w13', startComponentId: 'sw_light1', startPinId: 'out', endComponentId: 'light1', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w14', startComponentId: 'dc1', startPinId: 'out3_neg', endComponentId: 'light1', endPinId: 'neg', color: 'black', path: [] },

    // DC CH4: Nav Lights (Port, Stbd, Stern) all on same breaker
    { id: 'w15', startComponentId: 'dc1', startPinId: 'out4_pos', endComponentId: 'nav_port', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w16', startComponentId: 'nav_port', startPinId: 'pos', endComponentId: 'nav_stbd', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w17', startComponentId: 'nav_stbd', startPinId: 'pos', endComponentId: 'nav_stern', endPinId: 'pos', color: 'red', path: [] },
    
    { id: 'w18', startComponentId: 'dc1', startPinId: 'out4_neg', endComponentId: 'nav_port', endPinId: 'neg', color: 'black', path: [] },
    { id: 'w19', startComponentId: 'nav_port', startPinId: 'neg', endComponentId: 'nav_stbd', endPinId: 'neg', color: 'black', path: [] },
    { id: 'w20', startComponentId: 'nav_stbd', startPinId: 'neg', endComponentId: 'nav_stern', endPinId: 'neg', color: 'black', path: [] },

    // DC CH5: Freshwater Pump
    { id: 'w21', startComponentId: 'dc1', startPinId: 'out5_pos', endComponentId: 'pump1', endPinId: 'pos', color: 'red', path: [] },
    { id: 'w22', startComponentId: 'dc1', startPinId: 'out5_neg', endComponentId: 'pump1', endPinId: 'neg', color: 'black', path: [] },
  ]
};
