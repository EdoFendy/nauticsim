export const LESSONS: Record<string, { title: string, description: string, detailed: string }> = {
  battery: {
    title: "Batteria 12V (Accumulatore)",
    description: "Il cuore dell'impianto elettrico della barca. Fornisce l'energia in corrente continua (DC).",
    detailed: "In barca, l'energia è immagazzinata in batterie, solitamente a 12V o 24V. Funzionano come serbatoi d'energia. Hanno un polo Positivo (+) da cui 'esce' la corrente, e un polo Negativo (-) a cui la corrente 'ritorna'. Un circuito è chiuso (e funziona) solo se l'energia compie l'intero percorso uscendo dal rosso e tornando al nero."
  },
  battery_switch: {
    title: "Staccabatterie a 4 posizioni",
    description: "Gestisce da quale batteria prelevare l'energia o isola l'impianto.",
    detailed: "Fondamentale per la sicurezza. Ha i pin rossi perché gestisce SOLO il polo positivo (il negativo va sempre a massa). Permette di scegliere la Batteria 1, la 2, entrambe (BOTH - utile per avviare il motore se una è scarica) o OFF per togliere tensione a tutto l'impianto quando si lascia la barca."
  },
  bus_bar_positive: {
    title: "Barra Collettrice Positiva (Bus Bar)",
    description: "Un nodo di distribuzione per i cavi positivi.",
    detailed: "Invece di collegare 10 cavi direttamente al polo della batteria (creando caos e falsi contatti), si porta un cavo grosso dalla batteria a questa barra di rame. Da qui, ogni utenza prende il suo polo positivo. È tutta rossa perché trasporta solo energia potenziale verso i carichi."
  },
  bus_bar_negative: {
    title: "Barra Collettrice Negativa (Massa)",
    description: "Raccoglie tutti i ritorni negativi per riportarli alla batteria.",
    detailed: "L'elettricità deve sempre tornare a casa. La barra negativa, spesso stagnata per resistere alla corrosione marina, accoglie tutti i cavi neri provenienti da luci e pompe, e li convoglia in un unico grosso cavo nero che torna al polo negativo della batteria. Niente cavi rossi qui, o causerai un cortocircuito letale!"
  },
  dc_panel: {
    title: "Quadro Elettrico Principale (DC Panel)",
    description: "Distribuisce e protegge i circuiti con interruttori magnetotermici.",
    detailed: "Riceve l'energia principale (Positivo e Negativo) e la divide in vari 'canali'. Ogni canale ha un interruttore che fa da protezione (breaker). Il quadro fornisce un'uscita positiva (interrotta dall'interruttore) e un'uscita negativa diretta (o tramite un bus bar interno) per chiudere comodamente il circuito di ogni singola zona della barca."
  },
  toggle_switch: {
    title: "Interruttore Semplice in Linea",
    description: "Apre o chiude un singolo circuito (es. per accendere una luce).",
    detailed: "Nota che ha solo pin ROSSI. Questo perché l'interruttore non ha bisogno del negativo per funzionare: si limita a 'tagliare' a metà il filo positivo (fase interrotta). Quando è ON, unisce i due pin e lascia passare la corrente verso il carico. Se mettessi un rosso e un nero sull'interruttore, faresti un cortocircuito premendolo!"
  },
  light: {
    title: "Luce di Cabina",
    description: "Illuminazione interna standard a LED.",
    detailed: "Un carico semplice. Trasforma l'energia elettrica in luce. Ha bisogno di un polo positivo (rosso) da cui riceve l'energia, e un polo negativo (nero) per farla defluire. Se manca uno dei due, l'elettrone non si muove e la luce non si accende."
  },
  bilge_pump: {
    title: "Pompa di Sentina",
    description: "Espelle l'acqua accumulata sul fondo dello scafo.",
    detailed: "Un dispositivo salvavita. Spesso collegata direttamente alla batteria o con un circuito sempre alimentato (tramite galleggiante) in modo che possa funzionare anche a staccabatterie spento. Trasforma l'energia in movimento meccanico (girante)."
  },
  freshwater_pump: {
    title: "Pompa Acqua Dolce (Autoclave)",
    description: "Mette in pressione l'impianto idrico di bordo (docce, lavandini).",
    detailed: "Quando apri il rubinetto, la pressione scende, un pressostato interno chiude il circuito e la pompa si accende. Assorbe molta corrente, quindi necessita di un cavo di sezione adeguata e di un suo interruttore dedicato sul quadro principale."
  },
  chartplotter: {
    title: "Chartplotter (Navigatore GPS)",
    description: "Schermo multifunzione per cartografia, radar e sonar.",
    detailed: "L'elettronica di bordo è molto sensibile agli sbalzi di tensione. Si collega rigorosamente al quadro principale sotto un interruttore dedicato. È un carico passivo: prende il rosso e il nero per alimentare il suo processore e il display."
  },
  vhf: {
    title: "Radio VHF",
    description: "Dispositivo di comunicazione radio marino.",
    detailed: "Strumento di sicurezza obbligatorio. Spesso si consiglia di avere un circuito molto diretto verso le batterie per garantirne il funzionamento in emergenza. Trasmette (assorbendo molta potenza) e riceve sui canali marini."
  },
  nav_light_port: {
    title: "Luce di Via - Sinistra (Rossa)",
    description: "Indica il lato sinistro (Port) dell'imbarcazione di notte.",
    detailed: "Obbligatoria in navigazione notturna per il regolamento COLREG. Visto frontalmente, chi vede rosso sa che la tua barca sta andando verso sinistra. Funziona a 12V, e di solito è comandata dallo stesso interruttore delle altre luci di navigazione."
  },
  nav_light_stbd: {
    title: "Luce di Via - Dritta (Verde)",
    description: "Indica il lato destro (Starboard) dell'imbarcazione.",
    detailed: "Mostra il lato destro. Vengono cablate in parallelo: il cavo positivo parte dal quadro e si sdoppia per alimentare sia la luce rossa che quella verde contemporaneamente."
  },
  nav_light_stern: {
    title: "Luce di Coronamento (Poppa)",
    description: "Luce bianca fissa rivolta verso poppa (135°).",
    detailed: "Permette a chi ti segue di capire la tua direzione. Anche questa viene cablata in parallelo alle luci laterali. Tutte e tre formano il circuito 'Luci di Navigazione' (Nav Lights)."
  },
  anchor_light: {
    title: "Luce di Fonda",
    description: "Luce bianca a 360° posta in testa d'albero.",
    detailed: "Si accende quando la barca è all'ancora. È separata dalle luci di via (non si usano insieme!). Necessita di un interruttore separato sul quadro DC."
  },
  fuel_pump: {
    title: "Pompa Benzina",
    description: "Invia carburante dal serbatoio al motore.",
    detailed: "Di vitale importanza nei motori fuoribordo/entrobordo. Assorbe potenza e deve essere posta sotto fusibile, ma con un cablaggio robusto. Simile alla pompa dell'acqua per principi elettrici, ma dedicata al carburante."
  },
  sonar: {
    title: "Ecoscandaglio (Fishfinder)",
    description: "Usa onde sonore per mappare il fondo e trovare pesci.",
    detailed: "Spesso abbinato al chartplotter, l'ecoscandaglio emette impulsi tramite un trasduttore. Essendo elettronica delicata, richiede un'alimentazione stabile e una buona protezione dai picchi di tensione del motore."
  },
  stereo: {
    title: "Stereo Marino",
    description: "Impianto audio per l'intrattenimento a bordo.",
    detailed: "Un carico non essenziale, ma comune. Gli stereo assorbono parecchia corrente (specialmente se hanno amplificatori) e andrebbero sempre collegati al quadro DC sotto un interruttore dedicato per non scaricare le batterie inavvertitamente."
  },
  fuse: {
    title: "Fusibile in Linea",
    description: "Protegge un singolo componente dai cortocircuiti.",
    detailed: "Va inserito sempre sul cavo POSITIVO (Rosso), il più vicino possibile alla fonte di energia (es. subito dopo la batteria). Se c'è un cortocircuito, il filamento interno fonde interrompendo la corrente prima che il cavo prenda fuoco."
  },
  fuse_block: {
    title: "Scatola Portafusibili",
    description: "Una variante del Quadro DC, usa fusibili standard invece degli interruttori magnetotermici.",
    detailed: "Molto usata su barche piccole. Distribuisce l'energia a vari dispositivi, ognuno protetto dal proprio fusibile. È più economico del pannello magnetotermico ma richiede di avere fusibili di ricambio a bordo."
  },
  windlass: {
    title: "Salpa Ancora",
    description: "Motore ad alta potenza per recuperare l'ancora.",
    detailed: "Essendo uno dei carichi più pesanti a bordo (spesso >1000W), necessita di cavi di grossa sezione e di un teleruttore dedicato. L'uso continuo può scaricare rapidamente la batteria se il motore non è acceso per ricaricare."
  },
  shore_power: {
    title: "Presa da Banchina",
    description: "Connessione alla rete elettrica terrestre (230V).",
    detailed: "Permette di alimentare le utenze a 230V (come prese e caricabatterie) quando la barca è ormeggiata. Attenzione alla polarità (Fase e Neutro) e al rischio di correnti galvaniche, che richiedono l'uso di isolatori specifici."
  },
  ac_panel: {
    title: "Quadro Elettrico 230V (AC)",
    description: "Pannello di controllo e protezione per la rete a corrente alternata.",
    detailed: "Gestisce la distribuzione della corrente a 230V proveniente dalla banchina o dall'inverter verso prese, boiler, ecc. Include interruttori magnetotermici differenziali (salvavita) essenziali per la sicurezza."
  },
  inverter: {
    title: "Inverter DC/AC",
    description: "Converte l'energia a 12V (DC) delle batterie in 230V (AC).",
    detailed: "Consente l'uso di elettrodomestici standard in mare. Durante la conversione si genera calore e si perde circa il 10-15% di energia. Attenzione: assorbe enormi quantità di corrente dalla rete 12V (es. 2000W / 12V = 166 Ampere!), necessita di cavi enormi."
  },
  ac_outlet: {
    title: "Presa Shuko 230V",
    description: "Presa di corrente standard domestica.",
    detailed: "Utile per collegare caricabatterie di portatili, piccoli elettrodomestici, phon, ecc. Funziona solo se la barca è collegata alla banchina o se l'inverter è acceso."
  },
  solar_panel: {
    title: "Pannello Solare",
    description: "Genera energia elettrica sfruttando la luce del sole.",
    detailed: "Ottimo per mantenere cariche le batterie durante le soste in rada. La tensione di uscita è variabile in base al sole (es. 18V-24V) e deve essere convertita da un Regolatore di Carica prima di raggiungere la batteria (12V)."
  },
  mppt: {
    title: "Regolatore MPPT",
    description: "Ottimizza l'energia proveniente dai pannelli solari.",
    detailed: "Maximum Power Point Tracking: adatta in tempo reale la tensione del pannello (più alta) a quella della batteria, recuperando energia extra. Riceve dai pannelli i cavi (PV) e si collega alla batteria (+ e -)."
  },
  shunt: {
    title: "Shunt",
    description: "Resistenza di misurazione per monitorare i consumi.",
    detailed: "Viene installato in serie sul cavo NEGATIVO principale della batteria (tutta la corrente in uscita o in entrata DEVE passare da qui). Misurando la leggerissima caduta di tensione ai suoi capi, il Battery Monitor sa esattamente quanti Ampere stanno passando."
  },
  battery_monitor: {
    title: "Battery Monitor (BMV)",
    description: "Display intelligente per lo stato della batteria.",
    detailed: "Collega un cavo dati allo Shunt e un piccolo positivo alla batteria. Calcola con precisione l'energia entrata e uscita, indicando lo Stato di Carica (SOC %) e il tempo residuo prima di rimanere a secco, come il cruscotto di un'auto."
  },
  vsr: {
    title: "Relè Sensibile alla Tensione (VSR)",
    description: "Collega in automatico due batterie quando c'è energia in abbondanza.",
    detailed: "Spesso usato tra la batteria motore e quella servizi. Se rileva >13.7V (es. motore acceso che ricarica), chiude il circuito caricandole entrambe. Se la tensione scende (motore spento), le separa (isolerà), evitando che usando i servizi si scarichi la batteria d'avviamento."
  },
  engine: {
    title: "Motore (Avviamento)",
    description: "Il motore di propulsione: il carico che riceve l'energia di spunto dal banco batteria 1.",
    detailed: "Il motore è il carico più esigente di tutto l'impianto. Al momento dell'avviamento il motorino di spunta richiede 100-300 Ampere in pochi secondi, quindi il cavo positivo B+ deve essere diretto dalla Batteria 1 (Avviamento) o dal perno OUT dello staccabatterie, con sezione 25-50mm² e fusibile dedicato entro 20 cm. Il collegamento NEGATIVO (-) completa il circuito tornando alla Barra Negativa comune: mai far passare il ritorno del motore attraverso struttura o acqua. Il motore riceve il carburante dalla pompa benzina tramite il TUBO GIALLO (FUEL IN): senza benzina il motore non parte anche con 12V. Oltre all'avviamento, quando il motore gira l'alternatore ricarica la Batteria 1 (o entrambe tramite VSR). In questo simulatore il motore gira solo se riceve +12V sul pin B+ red, massa sul pin nero ED benzina sul pin FUEL IN giallo."
  },
  timone: {
    title: "Timone (Volante + Chiave)",
    description: "La postazione di governo: volante per la direzione, chiave avviamento che abilita il circuito del motore.",
    detailed: "In cabina di pilotaggio l'energia del comando parte dallo staccabatterie, passa per un fusibile e arriva alla chiave avviamento sul timone. Girando la chiave (clic sul volante per attivare CHIAVE ON) il contatto si chiude e l'energia può proseguire verso la manopola e poi al motorino di spunto. Il volante serve solo per la direzione del timone: in questo simulatore gira quando la chiave è ON. Collegamenti: pin IN dalla barra positiva (o staccabatterie), pin OUT alla manopola."
  },
  manopola: {
    title: "Manopola (Comando Motore)",
    description: "La leva di gas/marcia che ha in serie la sicurezza di folle.",
    detailed: "La manopola concentra marcia (avanti/folle/retromarcia) e acceleratore. Nel circuito d'avviamento fa da 'interruttore di folle': il motorino di spunto può essere alimentato solo quando la leva è in N (folle), altrimenti la barca scatterebbe in avanti. In questo simulatore la manopola lascia sempre passare l'energia dal timone al motore (clic per ciclare N → AV → AR) e la posizione della leva è puramente di comando. Collegamenti: pin IN dal timone (chiave ON), pin OUT al B+ del motore."
  },
  fuel_tank: {
    title: "Serbatoio Carburante",
    description: "La tanica di benzina: da qui parte la tubazione gialla verso la pompa e poi al motore.",
    detailed: "Il serbatoio alimenta la pompa benzina con la sua linea FEED (mandata) e riceve indietro la RET (ritorno del carburante non consumato). Il tubo carburante è GIALLO e va usato SOLO tra i pin gialli: FEED del serbatoio → FUEL IN della pompa → FUEL OUT → FUEL IN del motore. Attenzione: la pompa benzina FUNZIONA solo se è alimentata elettricamente a 12V. Se il motore ha energia ma non riceve benzina (tubo giallo mancante o pompa senza 12V), non parte: gli serve sia il + e il - sia il carburante."
  },
  // PIN LESSONS
  pin_positive: {
    title: "Terminale Positivo (+)",
    description: "Da qui esce o entra la 'pressione' elettrica (Voltaggio).",
    detailed: "Rappresentato dal colore ROSSO. Nei circuiti DC delle barche, il positivo è il cavo 'caldo'. Va sempre protetto con fusibili o magnetotermici, perché se tocca un metallo collegato a massa (negativo) genera un cortocircuito esplosivo."
  },
  pin_negative: {
    title: "Terminale Negativo (-) / Massa",
    description: "La via di ritorno per l'energia.",
    detailed: "Rappresentato dal colore NERO (o giallo nei nuovi standard marini ABYC). Completa il circuito riportando gli elettroni alla batteria. Non ha potenziale pericoloso se toccato da solo, ma deve essere integro affinché gli strumenti funzionino."
  },
  pin_switch_in: {
    title: "Ingresso Interruttore (Positivo)",
    description: "Il punto in cui l'energia in ingresso si ferma, in attesa di passare.",
    detailed: "L'energia arriva qui e aspetta. Se l'interruttore è aperto (OFF), l'energia non va oltre. È la porta d'ingresso."
  },
  pin_switch_out: {
    title: "Uscita Interruttore (Positivo)",
    description: "Da qui l'energia prosegue verso il carico, ma solo se è su ON.",
    detailed: "Quando chiudi l'interruttore (ON), un contatto meccanico unisce l'ingresso a questa uscita, lasciando fluire la corrente. Va collegato al pin positivo del dispositivo che vuoi controllare."
  }
};
