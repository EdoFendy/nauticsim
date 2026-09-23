import { CircuitState, ComponentType, PinDef } from '../types';
import { COMPONENT_DEFS } from './componentsDef';

export interface SimulationResult {
  poweredLoads: string[]; // Component IDs
  errors: string[];
  activeWires: string[]; // Wire IDs (flowing current)
  energizedWires: string[]; // Wire IDs (has voltage, even if open circuit)
  voltages: Record<string, string>; // compId:pinId -> voltage string
}

// Build a graph of connected pins
export function simulateCircuit(state: CircuitState): SimulationResult {
  const adjList = new Map<string, string[]>(); // pin key -> pin keys
  const wireMap = new Map<string, string>(); // pair "pinA|pinB" -> wireId

  const getPinKey = (compId: string, pinId: string) => `${compId}:${pinId}`;

  const addEdge = (u: string, v: string, wireId?: string) => {
    if (!adjList.has(u)) adjList.set(u, []);
    if (!adjList.has(v)) adjList.set(v, []);
    adjList.get(u)!.push(v);
    adjList.get(v)!.push(u);
    
    if (wireId) {
      wireMap.set(`${u}|${v}`, wireId);
      wireMap.set(`${v}|${u}`, wireId);
    }
  };

  // 1. Add edges for wires
  for (const wire of state.wires) {
    addEdge(
      getPinKey(wire.startComponentId, wire.startPinId),
      getPinKey(wire.endComponentId, wire.endPinId),
      wire.id
    );
  }

  const batteries: string[] = [];
  const acSources: string[] = []; // Shore power
  const fuelTanks: string[] = [];
  const fuelPumps: string[] = [];

  // 2. Add edges for component internals based on state
  for (const comp of state.components) {
    const compDef = COMPONENT_DEFS[comp.type];
    
    if (comp.type === 'battery' || comp.type === 'solar_panel') {
      batteries.push(comp.id);
    }
    else if (comp.type === 'fuel_tank') {
      fuelTanks.push(comp.id);
    }
    else if (comp.type === 'fuel_pump') {
      fuelPumps.push(comp.id);
    } 
    else if (comp.type === 'shore_power') {
      acSources.push(comp.id);
    }
    else if (comp.type === 'bus_bar_positive' || comp.type === 'bus_bar_negative') {
      const pins = compDef.pins.map(p => getPinKey(comp.id, p.id));
      for (let i = 1; i < pins.length; i++) {
        addEdge(pins[0], pins[i]);
      }
    }
    else if (comp.type === 'shunt') {
      // Shunt connects bat_neg to load_neg
      addEdge(getPinKey(comp.id, 'bat_neg'), getPinKey(comp.id, 'load_neg'));
    }
    else if (comp.type === 'vsr') {
      // Simplified: VSR connects bat1 to bat2 always for this sim to show parallel charging
      addEdge(getPinKey(comp.id, 'bat1'), getPinKey(comp.id, 'bat2'));
    }
    else if (comp.type === 'mppt') {
      // MPPT connects pv to bat if working, we simulate by bridging pos->pos, neg->neg
      addEdge(getPinKey(comp.id, 'pv_pos'), getPinKey(comp.id, 'bat_pos'));
      addEdge(getPinKey(comp.id, 'pv_neg'), getPinKey(comp.id, 'bat_neg'));
    }
    else if (comp.type === 'toggle_switch' || comp.type === 'fuse') {
      const isOn = comp.type === 'fuse' ? true : comp.state?.on;
      if (isOn) {
        addEdge(getPinKey(comp.id, 'in'), getPinKey(comp.id, 'out'));
      }
    }
    else if (comp.type === 'timone') {
      if (comp.state?.on) {
        addEdge(getPinKey(comp.id, 'in'), getPinKey(comp.id, 'out'));
      }
    }
    else if (comp.type === 'manopola') {
      addEdge(getPinKey(comp.id, 'in'), getPinKey(comp.id, 'out'));
    }
    else if (comp.type === 'battery_switch') {
      const s = comp.state?.mode || 'off';
      if (s === '1' || s === 'both') {
        addEdge(getPinKey(comp.id, 'bat1'), getPinKey(comp.id, 'out'));
      }
      if (s === '2' || s === 'both') {
        addEdge(getPinKey(comp.id, 'bat2'), getPinKey(comp.id, 'out'));
      }
    }
    else if (comp.type === 'dc_panel') {
      const negIn = getPinKey(comp.id, 'neg_in');
      for (let i = 1; i <= 8; i++) {
        addEdge(negIn, getPinKey(comp.id, `out${i}_neg`));
      }
      const posIn = getPinKey(comp.id, 'pos_in');
      for (let i = 1; i <= 8; i++) {
        if (comp.state?.[`switch${i}`]) {
          addEdge(posIn, getPinKey(comp.id, `out${i}_pos`));
        }
      }
    }
    else if (comp.type === 'ac_panel') {
      const nIn = getPinKey(comp.id, 'n_in');
      for (let i = 1; i <= 4; i++) {
        addEdge(nIn, getPinKey(comp.id, `out${i}_n`));
      }
      const lIn = getPinKey(comp.id, 'l_in');
      for (let i = 1; i <= 4; i++) {
        if (comp.state?.[`switch${i}`]) {
          addEdge(lIn, getPinKey(comp.id, `out${i}_l`));
        }
      }
    }
    else if (comp.type === 'fuse_block') {
      const negIn = getPinKey(comp.id, 'neg_in');
      for (let i = 1; i <= 6; i++) {
        addEdge(negIn, getPinKey(comp.id, `out${i}_neg`));
      }
      const posIn = getPinKey(comp.id, 'pos_in');
      for (let i = 1; i <= 6; i++) {
        addEdge(posIn, getPinKey(comp.id, `out${i}_pos`));
      }
    }
  }

  const getReachable = (startPins: string[]) => {
    const visited = new Set<string>();
    const queue = [...startPins];
    for (const p of queue) visited.add(p);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const neighbors = adjList.get(curr) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
    return visited;
  };

  const poweredLoads: string[] = [];
  const errors: string[] = [];
  const activeWires = new Set<string>();
  const voltages: Record<string, string> = {};

  // Map DC power
  const batReach = batteries.map(batId => {
    const pos = getReachable([getPinKey(batId, 'pos')]);
    const neg = getReachable([getPinKey(batId, 'neg')]);
    
    // Assign voltages
    pos.forEach(p => voltages[p] = "12.4V");
    neg.forEach(p => voltages[p] = "0V (GND)");
    
    return { id: batId, pos, neg };
  });

  // Short circuits DC
  for (const br of batReach) {
    const intersection = new Set([...br.pos].filter(x => br.neg.has(x)));
    if (intersection.size > 0) {
      errors.push(`Cortocircuito rilevato sulla rete 12V (Sorgente: ${br.id.substring(0, 5)})`);
    }
  }

  // Fuel system: an electric fuel pump conveys fuel only when it is powered
  for (const pumpId of fuelPumps) {
    const posKey = getPinKey(pumpId, 'pos');
    const negKey = getPinKey(pumpId, 'neg');
    const poweringBat = batReach.find(br => br.pos.has(posKey) && br.neg.has(negKey));
    if (poweringBat) {
      addEdge(getPinKey(pumpId, 'fuel_in'), getPinKey(pumpId, 'fuel_out'));
    }
  }

  // Fuel reachability: each tank's FEED pin is a fuel source
  const fuelReach = fuelTanks.map(tankId => {
    const feed = getReachable([getPinKey(tankId, 'feed')]);
    return { id: tankId, feed };
  });

  const traceActiveWires = (startPin: string, sourcePins: Set<string>) => {
    const visited = new Set<string>();
    const queue = [startPin];
    visited.add(startPin);
    while(queue.length > 0) {
       const curr = queue.shift()!;
       const neighbors = adjList.get(curr) || [];
       for (const n of neighbors) {
          if (sourcePins.has(n) && !visited.has(n)) {
            visited.add(n);
            queue.push(n);
            const wireId = wireMap.get(`${curr}|${n}`);
            if (wireId) activeWires.add(wireId);
          }
       }
    }
  };

  // Check which inverters are powered by DC to act as AC sources
  for (const comp of state.components.filter(c => c.type === 'inverter')) {
    const posKey = getPinKey(comp.id, 'pos_in');
    const negKey = getPinKey(comp.id, 'neg_in');
    const poweringBat = batReach.find(br => br.pos.has(posKey) && br.neg.has(negKey));
    if (poweringBat && comp.state?.on) {
      poweredLoads.push(comp.id);
      traceActiveWires(posKey, poweringBat.pos);
      traceActiveWires(negKey, poweringBat.neg);
      acSources.push(comp.id); // It becomes an AC source!
    }
  }

  // Map AC power
  const acReach = acSources.map(acId => {
    const lPin = getPinKey(acId, acId.includes('shore') ? 'l' : 'l_out');
    const nPin = getPinKey(acId, acId.includes('shore') ? 'n' : 'n_out');
    const l = getReachable([lPin]);
    const n = getReachable([nPin]);
    
    l.forEach(p => voltages[p] = "230V AC");
    n.forEach(p => voltages[p] = "0V AC (N)");
    
    return { id: acId, l, n };
  });

  // Short circuits AC
  for (const ar of acReach) {
    const intersection = new Set([...ar.l].filter(x => ar.n.has(x)));
    if (intersection.size > 0) {
      errors.push(`CORTOCIRCUITO GRAVE 230V! (Sorgente: ${ar.id.substring(0, 5)})`);
    }
  }

  // Check all loads
const structuralTypes = ['battery', 'solar_panel', 'shore_power', 'battery_switch', 'dc_panel', 'ac_panel', 'fuse_block', 'toggle_switch', 'fuse', 'bus_bar_positive', 'bus_bar_negative', 'shunt', 'mppt', 'vsr', 'inverter', 'timone', 'manopola', 'fuel_tank'];

  for (const comp of state.components) {
    if (!structuralTypes.includes(comp.type)) {
      
      // Is it a DC load?
      const def = COMPONENT_DEFS[comp.type];
      const hasPos = def.pins.find(p => p.type === 'positive');
      const hasAcL = def.pins.find(p => p.type === 'ac_live');

      if (comp.type === 'engine') {
        // Engine needs POWER (+/- from the same battery) AND FUEL (feed line from a tank through a powered pump)
        const posKey = getPinKey(comp.id, 'pos');
        const negKey = getPinKey(comp.id, 'neg');
        const fuelKey = getPinKey(comp.id, 'fuel_in');
        const poweringBat = batReach.find(br => br.pos.has(posKey) && br.neg.has(negKey));
        const hasFuel = fuelReach.some(fr => fr.feed.has(fuelKey));
        if (poweringBat && hasFuel) {
          poweredLoads.push(comp.id);
          traceActiveWires(posKey, poweringBat.pos);
          traceActiveWires(negKey, poweringBat.neg);
        }
        continue;
      }

      if (hasPos) {
        const posKey = getPinKey(comp.id, 'pos');
        const negKey = getPinKey(comp.id, 'neg');
        const poweringBat = batReach.find(br => br.pos.has(posKey) && br.neg.has(negKey));
        
        if (poweringBat) {
          poweredLoads.push(comp.id);
          traceActiveWires(posKey, poweringBat.pos);
          traceActiveWires(negKey, poweringBat.neg);
        }
      } 
      else if (hasAcL) {
        const lKey = getPinKey(comp.id, 'l');
        const nKey = getPinKey(comp.id, 'n');
        const poweringAc = acReach.find(ar => ar.l.has(lKey) && ar.n.has(nKey));
        
        if (poweringAc) {
          poweredLoads.push(comp.id);
          traceActiveWires(lKey, poweringAc.l);
          traceActiveWires(nKey, poweringAc.n);
        }
      }
    }
  }

  const energizedWires = new Set<string>();
  for (const wire of state.wires) {
    const startKey = getPinKey(wire.startComponentId, wire.startPinId);
    const endKey = getPinKey(wire.endComponentId, wire.endPinId);
    if (voltages[startKey] || voltages[endKey]) {
      // Propagate voltage to the other side of the wire if missing
      if (voltages[startKey] && !voltages[endKey]) voltages[endKey] = voltages[startKey];
      if (voltages[endKey] && !voltages[startKey]) voltages[startKey] = voltages[endKey];
      energizedWires.add(wire.id);
    }
  }

  return { poweredLoads, errors, activeWires: Array.from(activeWires), energizedWires: Array.from(energizedWires), voltages };
}
