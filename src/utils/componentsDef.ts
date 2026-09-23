import { ComponentDef, ComponentType } from '../types';

export const COMPONENT_DEFS: Record<ComponentType, ComponentDef> = {
  battery: {
    type: 'battery',
    name: 'Batteria 12V',
    width: 90,
    height: 110,
    pins: [
      { id: 'pos', type: 'positive', x: 25, y: 15, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 65, y: 15, color: '#000000' }
    ]
  },
  battery_switch: {
    type: 'battery_switch',
    name: 'Staccabatterie',
    width: 100,
    height: 100,
    pins: [
      { id: 'bat1', type: 'bat1', x: 20, y: 80, color: '#ef4444' },
      { id: 'bat2', type: 'bat2', x: 80, y: 80, color: '#ef4444' },
      { id: 'out', type: 'out', x: 50, y: 15, color: '#ef4444' }
    ]
  },
  dc_panel: {
    type: 'dc_panel',
    name: 'Quadro DC',
    width: 140,
    height: 280,
    pins: [
      { id: 'pos_in', type: 'positive', x: 30, y: 20, color: '#ef4444' },
      { id: 'neg_in', type: 'negative', x: 110, y: 20, color: '#000000' },
      ...Array.from({ length: 8 }).map((_, i) => ({ id: `out${i + 1}_pos`, type: 'switch_out' as const, x: 20, y: 65 + i * 25, color: '#ef4444' })),
      ...Array.from({ length: 8 }).map((_, i) => ({ id: `out${i + 1}_neg`, type: 'negative' as const, x: 120, y: 65 + i * 25, color: '#000000' }))
    ]
  },
  toggle_switch: {
    type: 'toggle_switch',
    name: 'Interruttore',
    width: 50,
    height: 70,
    pins: [
      { id: 'in', type: 'switch_in', x: 25, y: 15, color: '#ef4444' },
      { id: 'out', type: 'switch_out', x: 25, y: 55, color: '#ef4444' }
    ]
  },
  light: {
    type: 'light',
    name: 'Luce Cabina',
    width: 70,
    height: 70,
    pins: [
      { id: 'pos', type: 'positive', x: 15, y: 35, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 55, y: 35, color: '#000000' }
    ]
  },
  bilge_pump: {
    type: 'bilge_pump',
    name: 'Pompa Sentina',
    width: 80,
    height: 90,
    pins: [
      { id: 'pos', type: 'positive', x: 25, y: 15, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 55, y: 15, color: '#000000' }
    ]
  },
  freshwater_pump: {
    type: 'freshwater_pump',
    name: 'Pompa Acqua',
    width: 90,
    height: 70,
    pins: [
      { id: 'pos', type: 'positive', x: 20, y: 15, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 70, y: 15, color: '#000000' }
    ]
  },
  bus_bar_positive: {
    type: 'bus_bar_positive',
    name: 'Barra Positiva',
    width: 180,
    height: 40,
    pins: Array.from({ length: 8 }).map((_, i) => ({
      id: `p${i}`, type: 'positive' as const, x: 20 + i * 20, y: 20, color: '#ef4444'
    }))
  },
  bus_bar_negative: {
    type: 'bus_bar_negative',
    name: 'Barra Negativa',
    width: 180,
    height: 40,
    pins: Array.from({ length: 8 }).map((_, i) => ({
      id: `n${i}`, type: 'negative' as const, x: 20 + i * 20, y: 20, color: '#000000'
    }))
  },
  chartplotter: {
    type: 'chartplotter',
    name: 'Chartplotter',
    width: 160,
    height: 120,
    pins: [
      { id: 'pos', type: 'positive', x: 40, y: 110, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 120, y: 110, color: '#000000' }
    ]
  },
  vhf: {
    type: 'vhf',
    name: 'Radio VHF',
    width: 120,
    height: 70,
    pins: [
      { id: 'pos', type: 'positive', x: 30, y: 60, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 90, y: 60, color: '#000000' }
    ]
  },
  nav_light_port: {
    type: 'nav_light_port',
    name: 'Luce Sinistra',
    width: 50,
    height: 50,
    pins: [
      { id: 'pos', type: 'positive', x: 15, y: 25, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 35, y: 25, color: '#000000' }
    ]
  },
  nav_light_stbd: {
    type: 'nav_light_stbd',
    name: 'Luce Dritta',
    width: 50,
    height: 50,
    pins: [
      { id: 'pos', type: 'positive', x: 15, y: 25, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 35, y: 25, color: '#000000' }
    ]
  },
  nav_light_stern: {
    type: 'nav_light_stern',
    name: 'Luce Poppa',
    width: 50,
    height: 50,
    pins: [
      { id: 'pos', type: 'positive', x: 15, y: 25, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 35, y: 25, color: '#000000' }
    ]
  },
  anchor_light: {
    type: 'anchor_light',
    name: 'Luce Fonda',
    width: 40,
    height: 80,
    pins: [
      { id: 'pos', type: 'positive', x: 10, y: 70, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 30, y: 70, color: '#000000' }
    ]
  },
  fuel_pump: {
    type: 'fuel_pump',
    name: 'Pompa Benzina',
    width: 80,
    height: 90,
    pins: [
      { id: 'pos', type: 'positive', x: 25, y: 15, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 55, y: 15, color: '#000000' },
      { id: 'fuel_in', type: 'fuel', x: 15, y: 80, color: '#eab308' },
      { id: 'fuel_out', type: 'fuel', x: 65, y: 80, color: '#eab308' }
    ]
  },
  sonar: {
    type: 'sonar',
    name: 'Ecoscandaglio',
    width: 140,
    height: 120,
    pins: [
      { id: 'pos', type: 'positive', x: 30, y: 110, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 110, y: 110, color: '#000000' }
    ]
  },
  stereo: {
    type: 'stereo',
    name: 'Stereo',
    width: 150,
    height: 60,
    pins: [
      { id: 'pos', type: 'positive', x: 40, y: 50, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 110, y: 50, color: '#000000' }
    ]
  },
  fuse: {
    type: 'fuse',
    name: 'Fusibile Principale (In-line)',
    width: 70,
    height: 40,
    pins: [
      { id: 'in', type: 'switch_in', x: 8, y: 20, color: '#ef4444' },
      { id: 'out', type: 'switch_out', x: 62, y: 20, color: '#ef4444' }
    ]
  },
  fuse_block: {
    type: 'fuse_block',
    name: 'Portafusibili',
    width: 140,
    height: 180,
    pins: [
      { id: 'pos_in', type: 'positive', x: 70, y: 20, color: '#ef4444' },
      { id: 'neg_in', type: 'negative', x: 120, y: 20, color: '#000000' },
      ...Array.from({ length: 6 }).map((_, i) => ({ id: `out${i + 1}_pos`, type: 'switch_out' as const, x: 20, y: 50 + i * 20, color: '#ef4444' })),
      ...Array.from({ length: 6 }).map((_, i) => ({ id: `out${i + 1}_neg`, type: 'negative' as const, x: 120, y: 50 + i * 20, color: '#000000' }))
    ]
  },
  shore_power: {
    type: 'shore_power', name: 'Presa Banchina (230V)', width: 100, height: 100,
    pins: [
      { id: 'l', type: 'ac_live', x: 30, y: 80, color: '#a16207' },
      { id: 'n', type: 'ac_neutral', x: 70, y: 80, color: '#1d4ed8' }
    ]
  },
  ac_panel: {
    type: 'ac_panel', name: 'Quadro AC 230V', width: 140, height: 180,
    pins: [
      { id: 'l_in', type: 'ac_live', x: 40, y: 20, color: '#a16207' },
      { id: 'n_in', type: 'ac_neutral', x: 100, y: 20, color: '#1d4ed8' },
      ...Array.from({ length: 4 }).map((_, i) => ({ id: `out${i + 1}_l`, type: 'ac_live' as const, x: 30, y: 60 + i * 25, color: '#a16207' })),
      ...Array.from({ length: 4 }).map((_, i) => ({ id: `out${i + 1}_n`, type: 'ac_neutral' as const, x: 110, y: 60 + i * 25, color: '#1d4ed8' }))
    ]
  },
  inverter: {
    type: 'inverter', name: 'Inverter DC/AC', width: 160, height: 120,
    pins: [
      { id: 'pos_in', type: 'positive', x: 30, y: 100, color: '#ef4444' },
      { id: 'neg_in', type: 'negative', x: 70, y: 100, color: '#000000' },
      { id: 'l_out', type: 'ac_live', x: 110, y: 20, color: '#a16207' },
      { id: 'n_out', type: 'ac_neutral', x: 140, y: 20, color: '#1d4ed8' }
    ]
  },
  ac_outlet: {
    type: 'ac_outlet', name: 'Presa 230V', width: 60, height: 60,
    pins: [
      { id: 'l', type: 'ac_live', x: 15, y: 50, color: '#a16207' },
      { id: 'n', type: 'ac_neutral', x: 45, y: 50, color: '#1d4ed8' }
    ]
  },
  solar_panel: {
    type: 'solar_panel', name: 'Pannello Solare', width: 160, height: 80,
    pins: [
      { id: 'pos', type: 'positive', x: 60, y: 70, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 100, y: 70, color: '#000000' }
    ]
  },
  mppt: {
    type: 'mppt', name: 'Regolatore MPPT', width: 120, height: 140,
    pins: [
      { id: 'pv_pos', type: 'positive', x: 30, y: 120, color: '#ef4444' },
      { id: 'pv_neg', type: 'negative', x: 50, y: 120, color: '#000000' },
      { id: 'bat_pos', type: 'positive', x: 70, y: 120, color: '#ef4444' },
      { id: 'bat_neg', type: 'negative', x: 90, y: 120, color: '#000000' }
    ]
  },
  shunt: {
    type: 'shunt', name: 'Shunt (Misuratore)', width: 100, height: 50,
    pins: [
      { id: 'bat_neg', type: 'negative', x: 20, y: 25, color: '#000000' },
      { id: 'load_neg', type: 'negative', x: 80, y: 25, color: '#000000' },
      { id: 'data', type: 'data', x: 50, y: 10, color: '#22c55e' }
    ]
  },
  battery_monitor: {
    type: 'battery_monitor', name: 'Battery Monitor', width: 80, height: 80,
    pins: [
      { id: 'pos', type: 'positive', x: 20, y: 70, color: '#ef4444' },
      { id: 'data', type: 'data', x: 60, y: 70, color: '#22c55e' }
    ]
  },
  vsr: {
    type: 'vsr', name: 'Relè VSR', width: 80, height: 80,
    pins: [
      { id: 'bat1', type: 'bat1', x: 20, y: 60, color: '#ef4444' },
      { id: 'bat2', type: 'bat2', x: 60, y: 60, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 40, y: 75, color: '#000000' }
    ]
  },
  windlass: {
    type: 'windlass', name: 'Salpa Ancora', width: 120, height: 120,
    pins: [
      { id: 'pos', type: 'positive', x: 40, y: 100, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 80, y: 100, color: '#000000' }
    ]
  },
  engine: {
    type: 'engine', name: 'Motore (Avviamento)', width: 140, height: 120,
    pins: [
      { id: 'pos', type: 'positive', x: 30, y: 15, color: '#ef4444' },
      { id: 'neg', type: 'negative', x: 110, y: 15, color: '#000000' },
      { id: 'fuel_in', type: 'fuel', x: 15, y: 100, color: '#eab308' }
    ]
  },
  timone: {
    type: 'timone', name: 'Timone (Volante + Chiave)', width: 100, height: 110,
    pins: [
      { id: 'in', type: 'switch_in', x: 20, y: 95, color: '#ef4444' },
      { id: 'out', type: 'switch_out', x: 80, y: 95, color: '#ef4444' }
    ]
  },
  manopola: {
    type: 'manopola', name: 'Manopola (Comando Motore)', width: 110, height: 120,
    pins: [
      { id: 'in', type: 'switch_in', x: 30, y: 108, color: '#ef4444' },
      { id: 'out', type: 'switch_out', x: 80, y: 108, color: '#ef4444' }
    ]
  },
  fuel_tank: {
    type: 'fuel_tank', name: 'Serbatoio Carburante', width: 150, height: 110,
    pins: [
      { id: 'feed', type: 'fuel', x: 140, y: 45, color: '#eab308' },
      { id: 'return', type: 'fuel', x: 140, y: 70, color: '#eab308' }
    ]
  }
};
