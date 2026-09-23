import { LessonStep, CircuitState } from '../types';

export const LESSON_STEPS: LessonStep[] = [
  // ==========================================
  // MODULO 1: I FONDAMENTI DEL CIRCUITO DC
  // ==========================================
  {
    id: 1,
    slug: 'fondamenti-circuito-dc',
    title: "1. L'Abc dell'Elettricità Marina: Circuito Chiuso e Polarità",
    subtitle: 'Comprendere come viaggia la corrente continua a 12V e la differenza vitale tra cavo Rosso e Nero',
    category: 'Principi Base',
    badge: 'Principiante',
    theory: {
      summary: "A bordo di un'imbarcazione quasi tutti i dispositivi (luci, pompe, GPS, radio) funzionano a Corrente Continua (DC) a 12 Volt forniti dalle batterie. Perché un dispositivo funzioni, l'energia deve percorrere un anello completo: uscire dal polo positivo, attraversare il carico e ritornare al polo negativo.",
      points: [
        {
          title: 'Il Cavo ROSSO (+): Il Polo Positivo',
          text: 'Rappresenta il potenziale elettrico (+12V). È il cavo che porta l’energia dalla batteria verso i dispositivi. Va sempre protetto con interruttori e fusibili perché, se tocca una parte metallica a massa, provoca un cortocircuito immediato.',
          tag: 'Cavo Rosso'
        },
        {
          title: 'Il Cavo NERO (-) o Giallo: Il Ritorno di Massa (Ground)',
          text: 'Rappresenta il potenziale 0V. L’elettricità non può scorrere se non ha una via per "tornare a casa" alla batteria. Senza il cavo nero collegato, il circuito è aperto e il dispositivo rimarrà completamente spento.',
          tag: 'Cavo Nero'
        },
        {
          title: 'La Regola del Circuito Chiuso (Closed Loop)',
          text: 'Immagina un fiume circolare: l’acqua (gli elettroni) esce dalla pompa (batteria), fa girare un mulino (lampadina o pompa) e deve rientrare nella pompa. Se spezzi il tubo di mandata (rosso) o il tubo di ritorno (nero), tutto il flusso si arresta istantaneamente.',
          tag: 'Regola Base'
        },
        {
          title: 'Cos\'è un Cortocircuito? (Cosa NON fare mai!)',
          text: 'Se colleghi direttamente un cavo rosso con un cavo nero SENZA mettere in mezzo un apparecchio (carico), crei un cortocircuito secco. La resistenza è zero e la corrente schizza a centinaia di Ampere in millisecondi: i cavi si arroventano, fondono e possono incendiare la barca!',
          tag: 'PERICOLO'
        }
      ],
      safetyNote: 'In ambiente marino l’acqua salata è un conduttore elettrico naturale. Un cortocircuito a bordo è estremamente pericoloso perché può innescare un incendio in mezzo al mare in pochissimi secondi.',
      rulesOfThumb: [
        'Rosso = Polo Positivo (+12V)',
        'Nero (o Giallo secondo standard marini recenti) = Polo Negativo / Massa (-)',
        'Un dispositivo ha SEMPRE bisogno di entrambi i collegamenti per accendersi.'
      ]
    },
    objectives: [
      {
        id: 'connect_pos',
        text: 'Collega il polo positivo (+) della Batteria al polo positivo (+) della Luce con cavo ROSSO',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => 
            w.color === 'red' && 
            ((w.startComponentId === 'bat1' && w.startPinId === 'pos' && w.endComponentId === 'light1' && w.endPinId === 'pos') ||
             (w.startComponentId === 'light1' && w.startPinId === 'pos' && w.endComponentId === 'bat1' && w.endPinId === 'pos'))
          );
        }
      },
      {
        id: 'connect_neg',
        text: 'Collega il polo negativo (-) della Luce al polo negativo (-) della Batteria con cavo NERO',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => 
            w.color === 'black' && 
            ((w.startComponentId === 'light1' && w.startPinId === 'neg' && w.endComponentId === 'bat1' && w.endPinId === 'neg') ||
             (w.startComponentId === 'bat1' && w.startPinId === 'neg' && w.endComponentId === 'light1' && w.endPinId === 'neg'))
          );
        }
      },
      {
        id: 'light_powered',
        text: 'Osserva la lampada accendersi con il flusso attivo di corrente',
        isCompleted: (_state: CircuitState, sim: any) => {
          return sim?.poweredLoads?.includes('light1') && (!sim?.errors || sim.errors.length === 0);
        }
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Cabina / Prova Circuito', x: 100, y: 120, width: 700, height: 380 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 180, y: 220 }, state: {} },
        { id: 'light1', type: 'light', position: { x: 550, y: 240 }, state: {} }
      ],
      wires: []
    },
    suggestedHighlights: [
      { componentId: 'bat1', pinId: 'pos', label: '1. Polo + (Rosso)', color: 'red', pulse: true },
      { componentId: 'light1', pinId: 'pos', label: '2. Ingresso + Luce', color: 'red', pulse: true },
      { componentId: 'light1', pinId: 'neg', label: '3. Uscita - Luce', color: 'black', pulse: true },
      { componentId: 'bat1', pinId: 'neg', label: '4. Ritorno - Batteria', color: 'black', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 2: DUE BATTERIE & STACCABATTERIE
  // ==========================================
  {
    id: 2,
    slug: 'batterie-e-staccabatterie',
    title: '2. Banco Batterie & Staccabatterie a 4 Vie (1 / 2 / BOTH / OFF)',
    subtitle: 'Come separare la Batteria Motore dalla Batteria Servizi e gestire la manopola selettrice',
    category: 'Accumulo & Selezione',
    badge: 'Fondamentale',
    theory: {
      summary: "In barca non si usa quasi mai una sola batteria. Se ascolti musica o lasci il frigo acceso mentre sei all'ancora, rischieresti di scaricarla e non riuscire più a riavviare il motore per tornare a terra! Per questo si usano DUE banchi batteria distinti gestiti da uno staccabatterie a 4 posizioni.",
      points: [
        {
          title: 'Batteria 1 (Avviamento / Motore)',
          text: 'È una batteria speciale ad altissimo spunto (alta corrente erogabile per pochi secondi per avviare il motorino del fuoribordo o entrobordo). Deve rimanere SEMPRE carica e isolata dai consumi di bordo.',
          tag: 'Banco 1'
        },
        {
          title: 'Batteria 2 (Servizi di Bordo / Deep Cycle)',
          text: 'Batteria a scarica lenta (AGM, Gel o Litio). Alimenta frigo, luci, chartplotter, autoclave dell’acqua e stereo. Può essere scaricata fino al 50-80% senza rovinarsi.',
          tag: 'Banco 2'
        },
        {
          title: 'Lo Staccabatterie a 4 Posizioni: Come Funziona',
          text: 'Ha 3 grossi perni filettati in rame/ottone per i cavi ROSSI: "BAT 1" (riceve il + dalla bat 1), "BAT 2" (riceve il + dalla bat 2) e "OUT" (porta l\'energia all\'impianto della barca).',
          tag: 'Componente Chiave'
        },
        {
          title: 'Le 4 Posizioni della Manopola:',
          text: '• OFF: Stacca completamente il positivo da tutta la barca (sicurezza massima all’ormeggio).\n• 1: Alimenta la barca SOLO dalla Batteria Motore (da usare in navigazione per farla ricaricare).\n• 2: Alimenta la barca SOLO dalla Batteria Servizi (da usare all’ancora o a motore spento).\n• BOTH (1+2): Mette le due batterie in PARALLELO. Si usa SOLO in emergenza se la bat 1 è scarica per rubare spunto dalla 2 e avviare il motore!',
          tag: 'Uso Pratico'
        },
        {
          title: 'E i Cavi Neri (-)? La Massa Comune',
          text: 'I poli negativi (-) di entrambe le batterie si collegano INSIEME alla Barra Negativa comune (Common Ground). Lo staccabatterie NON tocca mai i cavi neri: interrompe soltanto la linea positiva per motivi di sicurezza.',
          tag: 'Regola d\'Oro'
        }
      ],
      safetyNote: 'Non lasciare lo staccabatterie su BOTH durante l’ancoraggio! Se una batteria ha un difetto interno o si scarica, scaricherà istantaneamente anche l’altra per vasi comunicanti, lasciandoti senza corrente!',
      rulesOfThumb: [
        'Cavo Rosso da Bat 1 (+) va al perno "BAT 1" dello staccabatterie.',
        'Cavo Rosso da Bat 2 (+) va al perno "BAT 2" dello staccabatterie.',
        'Cavo Rosso dal perno "OUT" va al resto dell\'impianto.',
        'I cavi Neri (-) delle batterie vanno ENTRAMBI alla Barra Negativa (Massa Comune).'
      ]
    },
    objectives: [
      {
        id: 'connect_negs',
        text: 'Collega i poli negativi (-) di Bat 1 e Bat 2 alla Barra Negativa di massa con cavi NERI',
        isCompleted: (state: CircuitState) => {
          const b1Neg = state.wires.some(w => w.color === 'black' && 
            ((w.startComponentId === 'bat1' && w.startPinId === 'neg' && w.endComponentId === 'neg_bus') ||
             (w.endComponentId === 'bat1' && w.endPinId === 'neg' && w.startComponentId === 'neg_bus')));
          const b2Neg = state.wires.some(w => w.color === 'black' && 
            ((w.startComponentId === 'bat2' && w.startPinId === 'neg' && w.endComponentId === 'neg_bus') ||
             (w.endComponentId === 'bat2' && w.endPinId === 'neg' && w.startComponentId === 'neg_bus')));
          return b1Neg && b2Neg;
        }
      },
      {
        id: 'connect_bat1_switch',
        text: 'Collega il polo positivo (+) della Batteria 1 al pin BAT 1 dello staccabatterie (cavo ROSSO)',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'bat1' && w.startPinId === 'pos' && w.endComponentId === 'switch1' && w.endPinId === 'bat1') ||
             (w.startComponentId === 'switch1' && w.startPinId === 'bat1' && w.endComponentId === 'bat1' && w.endPinId === 'pos')));
        }
      },
      {
        id: 'connect_bat2_switch',
        text: 'Collega il polo positivo (+) della Batteria 2 al pin BAT 2 dello staccabatterie (cavo ROSSO)',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'bat2' && w.startPinId === 'pos' && w.endComponentId === 'switch1' && w.endPinId === 'bat2') ||
             (w.startComponentId === 'switch1' && w.startPinId === 'bat2' && w.endComponentId === 'bat2' && w.endPinId === 'pos')));
        }
      },
      {
        id: 'switch_test',
        text: 'Clicca sullo staccabatterie per ruotare la manopola da OFF a 1, 2 o BOTH',
        isCompleted: (state: CircuitState) => {
          const sw = state.components.find(c => c.id === 'switch1');
          return sw?.state?.mode && sw.state.mode !== 'off';
        }
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Sala Macchine / Vano Batterie', x: 60, y: 100, width: 880, height: 420 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 120, y: 180 }, state: {} },
        { id: 'bat2', type: 'battery', position: { x: 280, y: 180 }, state: {} },
        { id: 'switch1', type: 'battery_switch', position: { x: 480, y: 200 }, state: { mode: 'off' } },
        { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 180, y: 380 }, state: {} }
      ],
      wires: []
    },
    suggestedHighlights: [
      { componentId: 'bat1', pinId: 'neg', label: 'Bat 1 (-)', color: 'black', pulse: true },
      { componentId: 'bat2', pinId: 'neg', label: 'Bat 2 (-)', color: 'black', pulse: true },
      { componentId: 'neg_bus', pinId: 'n0', label: 'Barra Negativa (Massa)', color: 'black', pulse: true },
      { componentId: 'bat1', pinId: 'pos', label: 'Bat 1 (+) -> BAT 1', color: 'red', pulse: true },
      { componentId: 'switch1', pinId: 'bat1', label: 'Terminale BAT 1', color: 'red', pulse: true },
      { componentId: 'bat2', pinId: 'pos', label: 'Bat 2 (+) -> BAT 2', color: 'red', pulse: true },
      { componentId: 'switch1', pinId: 'bat2', label: 'Terminale BAT 2', color: 'red', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 3: I FUSIBILI DI SICUREZZA
  // ==========================================
  {
    id: 3,
    slug: 'tutto-sui-fusibili',
    title: '3. Tutto sui Fusibili: Perché, Dove Collocarli e Cablaggio',
    subtitle: 'La protezione salvavita dai principi di incendio a bordo: la regola dei 20 cm e l\'uso del cavo Rosso',
    category: 'Sicurezza & Protezione',
    badge: 'Vitale',
    theory: {
      summary: "I fusibili sono la componente di sicurezza più importante di tutta la barca. Molti credono che servano a proteggere l'elettrodomestico, ma la loro funzione principale è un'altra: PROTEGGERE IL CAVO DA INCENDIO. Un cortocircuito su un cavo non protetto fa prendere fuoco a una barca in vetroresina in meno di 60 secondi.",
      points: [
        {
          title: 'Come Funziona un Fusibile?',
          text: 'È un interruttore termico "a perdere". All\'interno contiene una lamella metallica calibrata per sopportare un certo numero di Ampere (es. 10A, 50A, 100A). Se scorre più corrente del limite, il calore fonde la lamella istantaneamente, interrompendo il circuito prima che il cavo si surriscaldi.',
          tag: 'Principio Fisico'
        },
        {
          title: 'PERCHÉ si collegano i fusibili?',
          text: 'Una batteria da 12V al piombo o litio, se messa in corto, può scaricare 800-1500 Ampere istantanei! Un cavo elettrico attraversato da questa corrente si trasforma in una stufetta incandescente a 700°C: la guaina in plastica brucia, i gas tossici invadono la cabina e la barca prende fuoco. Il fusibile interviene in millesimi di secondo evitando la catastrofe.',
          tag: 'Perché il Fusibile'
        },
        {
          title: 'DOVE devono stare i fusibili? (La Regola dei 20 cm)',
          text: 'Standard internazionali marini (ABYC E-11 e ISO 10133): il fusibile principale DEVE essere installato IL PIÙ VICINO POSSIBILE ALLA SORGENTE D\'ENERGIA, tassativamente entro 18-20 cm (massimo 30 cm con guaina protettiva) dalla batteria o dal perno "OUT" dello staccabatterie.\n\nPerché? Perché qualsiasi tratto di cavo prima del fusibile NON È PROTETTO! Se metti il fusibile a 2 metri di distanza e il cavo si sfrega contro una paratia a 40 cm dalla batteria, il cavo brucerà e il fusibile non salterà mai!',
          tag: 'Regola dei 20 cm'
        },
        {
          title: 'Cavo Rosso o Cavo Nero? Dove entra e dove esce?',
          text: '• SEMPRE E SOLO IL CAVO ROSSO (+)! Il fusibile interrompe SEMPRE la fase positiva.\n• DOVE ENTRA: Il cavo rosso non protetto (proveniente dal perno OUT dello staccabatterie o dal polo + della batteria) entra nel pin IN del fusibile.\n• DOVE ESCE: Dal pin OUT del fusibile esce il cavo rosso protetto, che prosegue verso la barra di distribuzione positiva o il quadro.\n• MAI IL CAVO NERO: Se colleghi un cavo nero a un lato del fusibile e un cavo rosso dall\'altro, crei un cortocircuito secco a 12V: boom, fusibile bruciato all\'istante!',
          tag: 'Cablaggio Corretto'
        }
      ],
      safetyNote: 'Non sostituire MAI un fusibile bruciato con uno di amperaggio più alto o con un pezzo di filo o stagnola! Se il fusibile è saltato, c\'è un motivo (un sovraccarico o un cortocircuito): individua prima il problema.',
      rulesOfThumb: [
        'Il fusibile principale va entro 20 cm dalla fonte positiva.',
        'Nel fusibile in-line entrano ed escono SOLO cavi ROSSI (+).',
        'Il cavo dal perno OUT dello staccabatterie entra in "IN" del fusibile; da "OUT" del fusibile si va alla barra positiva.'
      ]
    },
    objectives: [
      {
        id: 'connect_switch_out_to_fuse',
        text: 'Collega il perno OUT dello staccabatterie all\'ingresso "IN" del Fusibile con cavo ROSSO',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'switch1' && w.startPinId === 'out' && w.endComponentId === 'fuse1' && w.endPinId === 'in') ||
             (w.startComponentId === 'fuse1' && w.startPinId === 'in' && w.endComponentId === 'switch1' && w.endPinId === 'out')));
        }
      },
      {
        id: 'connect_fuse_to_bus',
        text: 'Collega l\'uscita "OUT" del Fusibile alla Barra Positiva (pos_bus) con cavo ROSSO',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'fuse1' && w.startPinId === 'out' && w.endComponentId === 'pos_bus') ||
             (w.endComponentId === 'fuse1' && w.endPinId === 'out' && w.startComponentId === 'pos_bus')));
        }
      },
      {
        id: 'verify_bus_energized',
        text: 'Gira lo staccabatterie su 1, 2 o BOTH: verifica che la Barra Positiva sia sotto tensione (12.4V)',
        isCompleted: (state: CircuitState, sim: any) => {
          const sw = state.components.find(c => c.id === 'switch1');
          const isSwOn = sw?.state?.mode && sw.state.mode !== 'off';
          const busHasVoltage = Object.keys(sim?.voltages || {}).some(k => k.startsWith('pos_bus:') && sim.voltages[k]?.includes('12'));
          return isSwOn && busHasVoltage && (!sim?.errors || sim.errors.length === 0);
        }
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Quadro Batterie & Protezione Principale (Entro 20cm)', x: 60, y: 100, width: 880, height: 420 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 100, y: 160 }, state: {} },
        { id: 'bat2', type: 'battery', position: { x: 240, y: 160 }, state: {} },
        { id: 'switch1', type: 'battery_switch', position: { x: 420, y: 170 }, state: { mode: 'both' } },
        { id: 'fuse1', type: 'fuse', position: { x: 570, y: 170 }, state: {} },
        { id: 'pos_bus', type: 'bus_bar_positive', position: { x: 670, y: 180 }, state: {} },
        { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 180, y: 380 }, state: {} }
      ],
      wires: [
        // Already connected from lesson 2
        { id: 'w_b1_neg', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n0', color: 'black', path: [] },
        { id: 'w_b2_neg', startComponentId: 'bat2', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n1', color: 'black', path: [] },
        { id: 'w_b1_pos', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat1', color: 'red', path: [] },
        { id: 'w_b2_pos', startComponentId: 'bat2', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat2', color: 'red', path: [] }
      ]
    },
    suggestedHighlights: [
      { componentId: 'switch1', pinId: 'out', label: '1. OUT Staccabatterie [Rosso]', color: 'red', pulse: true },
      { componentId: 'fuse1', pinId: 'in', label: '2. IN Fusibile Principale [Rosso]', color: 'red', pulse: true },
      { componentId: 'fuse1', pinId: 'out', label: '3. OUT Fusibile Protetto [Rosso]', color: 'red', pulse: true },
      { componentId: 'pos_bus', pinId: 'p0', label: '4. Barra Positiva [Rosso]', color: 'red', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 4: DISTRIBUZIONE (BUS BAR & QUADRO DC)
  // ==========================================
  {
    id: 4,
    slug: 'distribuzione-busbar-quadro-dc',
    title: '4. Dalla Protezione alla Distribuzione: Bus Bar e Quadro DC',
    subtitle: 'Come convogliare l\'energia alle utenze tramite barre collettrici e interruttori magnetotermici',
    category: 'Distribuzione',
    badge: 'Architettura',
    theory: {
      summary: "Una volta che abbiamo una linea positiva a 12V protetta dal fusibile principale e una barra di massa negativa affidabile, dobbiamo portare l'energia alla consolle di comando dove si trova il Quadro Elettrico Principale (DC Panel).",
      points: [
        {
          title: 'Barra Positiva (Bus Bar Rossa)',
          text: 'Un blocco di rame solido che fa da "nodo centrale". Invece di ammucchiare 10 cavi sul morsetto della batteria (che provocherebbe surriscaldamenti e falsi contatti), si porta un solo cavo grosso protetto alla barra. Da lì ogni circuito prende il suo positivo pulito.',
          tag: 'Bus Bar Positiva'
        },
        {
          title: 'Barra Negativa (Massa Comune)',
          text: 'Raccoglie tutti i ritorni di massa provenienti da luci, pompe e strumenti, e li convoglia alle batterie con un unico cavo di grosso diametro.',
          tag: 'Bus Bar Negativa'
        },
        {
          title: 'Il Quadro Elettrico DC (DC Main Panel)',
          text: 'È il cruscotto della barca. Riceve l’alimentazione principale con due morsetti principali:\n• "pos_in" (entra il cavo rosso dalla barra positiva)\n• "neg_in" (entra il cavo nero dalla barra negativa)\nAll\'interno del quadro, ogni canale ha un interruttore magnetotermico (breaker) che protegge la singola linea da sovraccarichi.',
          tag: 'Quadro DC'
        },
        {
          title: 'Uscite dei Canali (CH1, CH2, CH3...)',
          text: 'Ogni canale del quadro offre una coppia di pin:\n• out_pos: cavo rosso che va all’utenza (interrotto dal tastino sul quadro)\n• out_neg: cavo nero di ritorno a massa.',
          tag: 'Canali'
        }
      ],
      safetyNote: 'I cavi di dorsale tra la sala macchine e il quadro di plancia devono essere di sezione adeguata (spesso 16mm² o 25mm²) per evitare cali di tensione sulle lunghe distanze.',
      rulesOfThumb: [
        'Dalla Barra Positiva si porta un cavo ROSSO a "pos_in" del Quadro DC.',
        'Dalla Barra Negativa si porta un cavo NERO a "neg_in" del Quadro DC.',
        'Ogni interruttore sul quadro comanda un\'utenza specifica.'
      ]
    },
    objectives: [
      {
        id: 'feed_dc_pos',
        text: 'Porta l\'alimentazione positiva dalla Barra Positiva (p1) all\'ingresso pos_in del Quadro DC (cavo ROSSO)',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'pos_bus' && w.endComponentId === 'dc1' && w.endPinId === 'pos_in') ||
             (w.endComponentId === 'pos_bus' && w.startComponentId === 'dc1' && w.startPinId === 'pos_in')));
        }
      },
      {
        id: 'feed_dc_neg',
        text: 'Porta la massa negativa dalla Barra Negativa (n2) all\'ingresso neg_in del Quadro DC (cavo NERO)',
        isCompleted: (state: CircuitState) => {
          return state.wires.some(w => w.color === 'black' && 
            ((w.startComponentId === 'neg_bus' && w.endComponentId === 'dc1' && w.endPinId === 'neg_in') ||
             (w.endComponentId === 'neg_bus' && w.startComponentId === 'dc1' && w.startPinId === 'neg_in')));
        }
      },
      {
        id: 'turn_on_ch1',
        text: 'Attiva l\'interruttore CH 1 sul Quadro DC cliccando sulla levetta',
        isCompleted: (state: CircuitState) => {
          const dc = state.components.find(c => c.id === 'dc1');
          return !!dc?.state?.switch1;
        }
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Sala Macchine', x: 60, y: 350, width: 880, height: 260 },
        { id: 'c2', label: 'Plancia Comando / Consolle', x: 350, y: 60, width: 400, height: 260 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 100, y: 400 }, state: {} },
        { id: 'bat2', type: 'battery', position: { x: 230, y: 400 }, state: {} },
        { id: 'switch1', type: 'battery_switch', position: { x: 380, y: 410 }, state: { mode: 'both' } },
        { id: 'fuse1', type: 'fuse', position: { x: 520, y: 410 }, state: {} },
        { id: 'pos_bus', type: 'bus_bar_positive', position: { x: 620, y: 400 }, state: {} },
        { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 620, y: 480 }, state: {} },
        { id: 'dc1', type: 'dc_panel', position: { x: 420, y: 80 }, state: { switch1: false } }
      ],
      wires: [
        { id: 'w_b1_neg', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n0', color: 'black', path: [] },
        { id: 'w_b2_neg', startComponentId: 'bat2', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n1', color: 'black', path: [] },
        { id: 'w_b1_pos', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat1', color: 'red', path: [] },
        { id: 'w_b2_pos', startComponentId: 'bat2', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat2', color: 'red', path: [] },
        { id: 'w_sw_fuse', startComponentId: 'switch1', startPinId: 'out', endComponentId: 'fuse1', endPinId: 'in', color: 'red', path: [] },
        { id: 'w_fuse_pos', startComponentId: 'fuse1', startPinId: 'out', endComponentId: 'pos_bus', endPinId: 'p0', color: 'red', path: [] }
      ]
    },
    suggestedHighlights: [
      { componentId: 'pos_bus', pinId: 'p1', label: 'Barra Positiva (Uscita)', color: 'red', pulse: true },
      { componentId: 'dc1', pinId: 'pos_in', label: 'Quadro DC (pos_in)', color: 'red', pulse: true },
      { componentId: 'neg_bus', pinId: 'n2', label: 'Barra Negativa (Uscita)', color: 'black', pulse: true },
      { componentId: 'dc1', pinId: 'neg_in', label: 'Quadro DC (neg_in)', color: 'black', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 5: CABLARE LE UTENZE DI BORDO
  // ==========================================
  {
    id: 5,
    slug: 'cablare-utenze-bordo',
    title: '5. Collegare le Utenze: Pompa di Sentina, Chartplotter GPS e Luci',
    subtitle: 'La pompa salvavita diretta a batteria vs le utenze controllate da interruttore',
    category: 'Utenze di Bordo',
    badge: 'Pratica Reale',
    theory: {
      summary: "A bordo esistono due tipi di utenze: quelle 'sotto staccabatterie' (che si spengono quando lasci la barca) e quelle 'sempre alimentate' per motivi salvavita (come la Pompa di Sentina Automatica).",
      points: [
        {
          title: 'Il Caso Speciale della Pompa di Sentina (Bilge Pump)',
          text: 'La pompa di sentina automatica è il dispositivo che impedisce alla barca di affondare se una fascetta perde o piove molto mentre sei a terra. Per questo va collegata DIRETTA alla batteria o alla Bus Bar con un fusibile dedicato, MAI sotto un interruttore che potresti dimenticare spento!',
          tag: 'Salvavita'
        },
        {
          title: 'Cablaggio Strumenti Elettronici (Chartplotter GPS, VHF, Ecoscandaglio)',
          text: 'Si collegano ai canali dedicati del Quadro DC. Cavo ROSSO da "out1_pos" al polo positivo dell’apparecchio, cavo NERO dal polo negativo dell’apparecchio a "out1_neg" o alla barra di massa comune.',
          tag: 'Elettronica'
        },
        {
          title: 'Le Luci di Navigazione (COLREG)',
          text: 'Luce di via sinistra (Rossa), dritta (Verde) e coronamento poppa (Bianca). Vengono cablate in parallelo sotto un unico canale (CH4) in modo da accendersi tutte contemporaneamente con un solo clic.',
          tag: 'Navigazione'
        },
        {
          title: 'Dove entra il cavo rosso e dove entra il nero sull\'utenza?',
          text: 'Ogni apparecchio nautico ha due morsetti o fili:\n• ROSSO (o marcato +): riceve i +12V dalla linea protetta\n• NERO (o marcato -): ritorna al negativo comune.\nInvertire i poli su uno strumento elettronico (GPS o ecoscandaglio) può bruciare la scheda madre all’istante se non ha diodo di protezione!',
          tag: 'Attenzione'
        }
      ],
      safetyNote: 'La pompa di sentina deve avere cavi stagnati e giunzioni stagne (termorestringente con colla) perché lavora a contatto con l’acqua salata sul fondo dello scafo.',
      rulesOfThumb: [
        'Pompa di sentina: diretta a Bus Bar con fusibile (funziona anche a staccabatterie spento).',
        'Chartplotter e luci: sotto interruttore del Quadro DC.',
        'Rosso al pin (+) dell\'utenza, Nero al pin (-) di ritorno.'
      ]
    },
    objectives: [
      {
        id: 'wire_bilge_direct',
        text: 'Collega la Pompa di Sentina diretta alla Bus Bar Positiva e Negativa (cavo rosso su pos, cavo nero su neg)',
        isCompleted: (state: CircuitState) => {
          const posW = state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'pos_bus' && w.endComponentId === 'bilge1' && w.endPinId === 'pos') ||
             (w.endComponentId === 'pos_bus' && w.startComponentId === 'bilge1' && w.startPinId === 'pos')));
          const negW = state.wires.some(w => w.color === 'black' && 
            ((w.startComponentId === 'neg_bus' && w.endComponentId === 'bilge1' && w.endPinId === 'neg') ||
             (w.endComponentId === 'neg_bus' && w.startComponentId === 'bilge1' && w.startPinId === 'neg')));
          return posW && negW;
        }
      },
      {
        id: 'wire_chartplotter',
        text: 'Collega il Chartplotter al Canale 1 del Quadro DC (out1_pos a pos, out1_neg a neg)',
        isCompleted: (state: CircuitState) => {
          const posW = state.wires.some(w => w.color === 'red' && 
            ((w.startComponentId === 'dc1' && w.startPinId === 'out1_pos' && w.endComponentId === 'plotter1' && w.endPinId === 'pos') ||
             (w.endComponentId === 'dc1' && w.endPinId === 'out1_pos' && w.startComponentId === 'plotter1' && w.startPinId === 'pos')));
          const negW = state.wires.some(w => w.color === 'black' && 
            ((w.startComponentId === 'dc1' && w.startPinId === 'out1_neg' && w.endComponentId === 'plotter1' && w.endPinId === 'neg') ||
             (w.endComponentId === 'dc1' && w.endPinId === 'out1_neg' && w.startComponentId === 'plotter1' && w.startPinId === 'neg')));
          return posW && negW;
        }
      },
      {
        id: 'power_check',
        text: 'Verifica che la Pompa di Sentina e il Chartplotter siano entrambi funzionanti e animati',
        isCompleted: (_state: CircuitState, sim: any) => {
          return sim?.poweredLoads?.includes('bilge1') && sim?.poweredLoads?.includes('plotter1') && (!sim?.errors || sim.errors.length === 0);
        }
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Sala Macchine', x: 60, y: 350, width: 880, height: 260 },
        { id: 'c2', label: 'Plancia Comando', x: 350, y: 60, width: 590, height: 260 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 100, y: 400 }, state: {} },
        { id: 'bat2', type: 'battery', position: { x: 230, y: 400 }, state: {} },
        { id: 'switch1', type: 'battery_switch', position: { x: 380, y: 410 }, state: { mode: 'both' } },
        { id: 'fuse1', type: 'fuse', position: { x: 520, y: 410 }, state: {} },
        { id: 'pos_bus', type: 'bus_bar_positive', position: { x: 620, y: 400 }, state: {} },
        { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 620, y: 480 }, state: {} },
        { id: 'bilge1', type: 'bilge_pump', position: { x: 820, y: 440 }, state: {} },
        { id: 'dc1', type: 'dc_panel', position: { x: 380, y: 80 }, state: { switch1: true } },
        { id: 'plotter1', type: 'chartplotter', position: { x: 600, y: 100 }, state: {} }
      ],
      wires: [
        { id: 'w_b1_neg', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n0', color: 'black', path: [] },
        { id: 'w_b2_neg', startComponentId: 'bat2', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n1', color: 'black', path: [] },
        { id: 'w_b1_pos', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat1', color: 'red', path: [] },
        { id: 'w_b2_pos', startComponentId: 'bat2', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat2', color: 'red', path: [] },
        { id: 'w_sw_fuse', startComponentId: 'switch1', startPinId: 'out', endComponentId: 'fuse1', endPinId: 'in', color: 'red', path: [] },
        { id: 'w_fuse_pos', startComponentId: 'fuse1', startPinId: 'out', endComponentId: 'pos_bus', endPinId: 'p0', color: 'red', path: [] },
        { id: 'w_bus_dc_pos', startComponentId: 'pos_bus', startPinId: 'p1', endComponentId: 'dc1', endPinId: 'pos_in', color: 'red', path: [] },
        { id: 'w_bus_dc_neg', startComponentId: 'neg_bus', startPinId: 'n2', endComponentId: 'dc1', endPinId: 'neg_in', color: 'black', path: [] }
      ]
    },
    suggestedHighlights: [
      { componentId: 'pos_bus', pinId: 'p2', label: 'Alimentazione Pompa Sentina', color: 'red', pulse: true },
      { componentId: 'bilge1', pinId: 'pos', label: 'Polo + Pompa Sentina', color: 'red', pulse: true },
      { componentId: 'bilge1', pinId: 'neg', label: 'Ritorno - Pompa Sentina', color: 'black', pulse: true },
      { componentId: 'neg_bus', pinId: 'n3', label: 'Massa Pompa Sentina', color: 'black', pulse: true },
      { componentId: 'dc1', pinId: 'out1_pos', label: 'CH1 Positivo GPS', color: 'red', pulse: true },
      { componentId: 'plotter1', pinId: 'pos', label: 'Polo + Chartplotter', color: 'red', pulse: true },
      { componentId: 'dc1', pinId: 'out1_neg', label: 'CH1 Negativo GPS', color: 'black', pulse: true },
      { componentId: 'plotter1', pinId: 'neg', label: 'Polo - Chartplotter', color: 'black', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 6: SAFETY LAB - ERRORI & CORTOCIRCUITI
  // ==========================================
  {
    id: 6,
    slug: 'safety-lab-cortocircuiti',
    title: '6. Safety Lab: Gli Errori Più Comuni e Cortocircuiti',
    subtitle: 'Sperimenta gli errori tipici in totale sicurezza e impara a interpretare gli allarmi',
    category: 'Diagnostica & Sicurezza',
    badge: 'Laboratorio Errori',
    theory: {
      summary: "In mare non c'è l'elettricista a cui telefonare. Essere consapevoli degli errori più comuni permette di prevenirli durante l'installazione e di risolverli all'istante in caso di guasto.",
      points: [
        {
          title: 'Errore 1: Cortocircuito Positivo-Negativo Diretto',
          text: 'Accade quando un cavo rosso tocca direttamente la barra negativa o un perno di massa. Nel nostro simulatore compare l\'allarme rosso lampeggiante "CORTOCIRCUITO RILEVATO" e il flusso si arresta. Nella realtà, senza fusibile, questo provoca fumo immediato e fiamme.',
          tag: 'Corto Diretto'
        },
        {
          title: 'Errore 2: Mettere il Fusibile sul Cavo Nero (ERRORE GRAVE!)',
          text: 'Perché il fusibile NON deve MAI stare sul negativo? Se il fusibile sul negativo salta, la lampada si spegne, MA tutto il dispositivo e il cavo rimangono sotto tensione a +12V! Se l’umidità o l’acqua tocca l’apparecchio, la corrente scarica attraverso l’acqua di sentina o il motore, innescando corrosione galvanica distruttiva su asse ed elica.',
          tag: 'Fusibile su Negativo'
        },
        {
          title: 'Errore 3: Uso di Nastro Isolante o Morsetti "Mammut"',
          text: 'In ambiente marino le vibrazioni del motore e l\'aria salmastra allentano e ossidano i mammut da casa. Si usano ESCLUSIVAMENTE capicorda a occhiello crimpati con pinza a cricchetto e guaina termorestringente con sigillante adesivo interno.',
          tag: 'Regola Materiali'
        }
      ],
      safetyNote: 'Prima di toccare qualsiasi cavo positivo con una chiave metallica, GIRA SEMPRE LO STACCABATTERIE SU OFF! Se la chiave tocca contemporaneamente il positivo e la massa metallica, si salderà letteralmente per fusione termica con rischio di gravi ustioni.',
      rulesOfThumb: [
        'Il fusibile si mette SEMPRE sul ROSSO, MAI sul NERO.',
        'Se un fusibile salta, non rimetterne uno più grande: trova prima il corto.',
        'In barca si usano solo connettori marini stagni.'
      ]
    },
    objectives: [
      {
        id: 'fix_short_circuit',
        text: 'Il circuito sottostante ha un cortocircuito secco intenzionale: trova il filo errato che unisce il rosso alla massa e cancellalo (selezionalo e premi Delete)',
        isCompleted: (state: CircuitState, sim: any) => {
          return (!sim?.errors || sim.errors.length === 0) && state.wires.length > 0;
        }
      },
      {
        id: 'test_multimeter',
        text: 'Usa lo strumento Multimetro (dalla barra laterale) per verificare la tensione a 12.4V sui poli della batteria',
        isCompleted: () => true // Educational step
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Vano di Prova Cortocircuito', x: 120, y: 120, width: 700, height: 380 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 200, y: 220 }, state: {} },
        { id: 'light1', type: 'light', position: { x: 550, y: 220 }, state: {} }
      ],
      wires: [
        // Working load
        { id: 'w_light_pos', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'light1', endPinId: 'pos', color: 'red', path: [] },
        { id: 'w_light_neg', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'light1', endPinId: 'neg', color: 'black', path: [] },
        // ACCIDENTAL SHORT CIRCUIT WIRE (Direct from pos to neg!)
        { id: 'w_DEADLY_SHORT', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'bat1', endPinId: 'neg', color: 'red', path: [] }
      ]
    },
    suggestedHighlights: [
      { componentId: 'bat1', pinId: 'pos', label: 'Corto tra Positivo...', color: 'red', pulse: true },
      { componentId: 'bat1', pinId: 'neg', label: '...e Negativo!', color: 'black', pulse: true }
    ]
  },

  // ==========================================
  // MODULO 7: LE 10 REGOLE D'ORO & CONCLUSIONE
  // ==========================================
  {
    id: 7,
    slug: 'regole-oro-conclusione',
    title: '7. Le 10 Regole d\'Oro dell\'Impianto Perfetto & Conclusione',
    subtitle: 'La checklist definitiva per essere consapevole, autonomo e sicuro al 100% in mare',
    category: 'Checklist Finale',
    badge: 'Master Nautico',
    theory: {
      summary: "Complimenti per essere arrivato fin qui! Ora possiedi le basi reali e fondamentali per capire qualsiasi impianto elettrico nautico a 12V. Ecco il decalogo finale da memorizzare per non commettere errori quando metterai le mani sull'impianto reale della tua barca.",
      points: [
        {
          title: '1. Colori Inequivocabili',
          text: 'Rosso = Positivo (+12V), Nero o Giallo = Negativo di Massa (0V). Non usare mai cavi di colore a caso!',
          tag: 'Regola 1'
        },
        {
          title: '2. Fusibili Principali a Monte entro 20 cm',
          text: 'Ogni fonte di energia deve avere il suo fusibile entro 20 cm dal morsetto positivo, prima di qualsiasi diramazione.',
          tag: 'Regola 2'
        },
        {
          title: '3. Fusibili SEMPRE sul Cavo Rosso',
          text: 'Il fusibile interrompe la linea calda (+). Non si mette MAI sul cavo nero di massa.',
          tag: 'Regola 3'
        },
        {
          title: '4. Due Batterie Separate per Scopi Diversi',
          text: 'Banco 1 per avviare il motore, Banco 2 per vivere a bordo all\'ancora. Mai tenerle in parallelo fisso (BOTH) se non per emergenza.',
          tag: 'Regola 4'
        },
        {
          title: '5. La Massa è Comune',
          text: 'Tutti i negativi delle batterie e delle utenze si incontrano sulla stessa Barra Negativa.',
          tag: 'Regola 5'
        },
        {
          title: '6. Pompa di Sentina Indipendente',
          text: 'La pompa salvavita con galleggiante va cablata a monte dello staccabatterie con proprio fusibile: deve svuotare la barca anche quando sei assente.',
          tag: 'Regola 6'
        },
        {
          title: '7. Rame Stagnato Marino (Tinned Copper)',
          text: 'I cavi marini sono stagnati filo per filo per resistere alla salsedine. I cavi elettrici da casa in rame nudo diventano neri e marciscono in due stagioni.',
          tag: 'Regola 7'
        },
        {
          title: '8. Sezione Cavi Adeguata',
          text: 'A 12V la caduta di tensione è micidiale: cavi troppo sottili scaldano e fanno spegnere gli strumenti. Scegli sezioni abbondanti (minimo 1.5mm² per luci, 4-6mm² per pompe, 25-50mm² per batterie/staccabatterie).',
          tag: 'Regola 8'
        },
        {
          title: '9. Capicorda Crimpatura a Freddo',
          text: 'Niente saldature a stagno (con le vibrazioni si spezzano) e niente mammut. Solo capicorda a occhiello ben pressati.',
          tag: 'Regola 9'
        },
        {
          title: '10. Rispetta la Rete: Se Salta un Fusibile C\'È un Motivo!',
          text: 'Non riarmare a occhi chiusi: controlla cavi, puzza di bruciato o infiltrazioni d\'acqua prima di dare nuovamente tensione.',
          tag: 'Regola 10'
        }
      ],
      safetyNote: 'Sei ora pronto per passare alla modalità libera del simulatore, disegnare lo scafo della tua imbarcazione e progettare un impianto elettrico a regola d\'arte!',
      rulesOfThumb: [
        'Usa il pulsante "Distinta Materiali" per verificare i componenti necessari.',
        'Esporta il progetto in JSON per salvarlo sul tuo computer o condividerlo.',
        'Usa il Multimetro virtuale per misurare le tensioni in ogni punto.'
      ]
    },
    objectives: [
      {
        id: 'explore_freely',
        text: 'Carica l\'impianto completo della barca di esempio e prova ad azionare gli interruttori del quadro',
        isCompleted: () => true
      }
    ],
    initialCircuit: {
      compartments: [
        { id: 'c1', label: 'Sala Macchine / Lazarette', x: 50, y: 550, width: 1050, height: 280 },
        { id: 'c2', label: 'Plancia Comando / Helm', x: 450, y: 100, width: 350, height: 420 },
        { id: 'c3', label: 'Cabina di Prua', x: 50, y: 100, width: 350, height: 420 }
      ],
      components: [
        { id: 'bat1', type: 'battery', position: { x: 100, y: 600 }, state: {} },
        { id: 'bat2', type: 'battery', position: { x: 250, y: 600 }, state: {} },
        { id: 'switch1', type: 'battery_switch', position: { x: 400, y: 600 }, state: { mode: 'both' } },
        { id: 'fuse1', type: 'fuse', position: { x: 530, y: 600 }, state: {} },
        { id: 'pos_bus', type: 'bus_bar_positive', position: { x: 620, y: 600 }, state: {} },
        { id: 'neg_bus', type: 'bus_bar_negative', position: { x: 620, y: 660 }, state: {} },
        { id: 'bilge1', type: 'bilge_pump', position: { x: 900, y: 650 }, state: {} },
        { id: 'dc1', type: 'dc_panel', position: { x: 480, y: 150 }, state: { switch1: true, switch2: true, switch3: false } },
        { id: 'plotter1', type: 'chartplotter', position: { x: 650, y: 150 }, state: {} },
        { id: 'light1', type: 'light', position: { x: 100, y: 150 }, state: {} }
      ],
      wires: [
        { id: 'w1', startComponentId: 'bat1', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n0', color: 'black', path: [] },
        { id: 'w2', startComponentId: 'bat2', startPinId: 'neg', endComponentId: 'neg_bus', endPinId: 'n1', color: 'black', path: [] },
        { id: 'w3', startComponentId: 'bat1', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat1', color: 'red', path: [] },
        { id: 'w4', startComponentId: 'bat2', startPinId: 'pos', endComponentId: 'switch1', endPinId: 'bat2', color: 'red', path: [] },
        { id: 'w5', startComponentId: 'switch1', startPinId: 'out', endComponentId: 'fuse1', endPinId: 'in', color: 'red', path: [] },
        { id: 'w6', startComponentId: 'fuse1', startPinId: 'out', endComponentId: 'pos_bus', endPinId: 'p0', color: 'red', path: [] },
        { id: 'w7', startComponentId: 'pos_bus', startPinId: 'p1', endComponentId: 'dc1', endPinId: 'pos_in', color: 'red', path: [] },
        { id: 'w8', startComponentId: 'neg_bus', startPinId: 'n2', endComponentId: 'dc1', endPinId: 'neg_in', color: 'black', path: [] },
        { id: 'w_bilge_neg', startComponentId: 'neg_bus', startPinId: 'n3', endComponentId: 'bilge1', endPinId: 'neg', color: 'black', path: [] },
        { id: 'w_bilge_pos', startComponentId: 'pos_bus', startPinId: 'p2', endComponentId: 'bilge1', endPinId: 'pos', color: 'red', path: [] },
        { id: 'w_plot_pos', startComponentId: 'dc1', startPinId: 'out1_pos', endComponentId: 'plotter1', endPinId: 'pos', color: 'red', path: [] },
        { id: 'w_plot_neg', startComponentId: 'dc1', startPinId: 'out1_neg', endComponentId: 'plotter1', endPinId: 'neg', color: 'black', path: [] },
        { id: 'w_light_pos', startComponentId: 'dc1', startPinId: 'out2_pos', endComponentId: 'light1', endPinId: 'pos', color: 'red', path: [] },
        { id: 'w_light_neg', startComponentId: 'dc1', startPinId: 'out2_neg', endComponentId: 'light1', endPinId: 'neg', color: 'black', path: [] }
      ]
    },
    suggestedHighlights: []
  }
];
