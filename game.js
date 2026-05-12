/* =========================================
   HARDWARE HEROES – GAME LOGIC
   ========================================= */

// ==================== AUDIO ====================
let audioCtx = null;
let soundEnabled = true;
let bgOscillators = [];

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.15, vol = 0.15, delay = 0) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.01);
  } catch(e) {}
}

function playCorrect() {
  playTone(523, 'square', 0.1, 0.12, 0);
  playTone(659, 'square', 0.1, 0.12, 0.1);
  playTone(784, 'square', 0.2, 0.12, 0.2);
}

function playWrong() {
  playTone(220, 'sawtooth', 0.15, 0.1, 0);
  playTone(180, 'sawtooth', 0.2,  0.1, 0.15);
}

function playSuccess() {
  const notes = [523,659,784,1047];
  notes.forEach((f,i) => playTone(f, 'square', 0.15, 0.12, i * 0.12));
}

function playClick() { playTone(880, 'sine', 0.05, 0.08); }

function startBgMusic() {
  if (!soundEnabled) return;
  stopBgMusic();
  try {
    const ctx = getAudioCtx();
    const melody = [261,294,330,349,392,440,494,523];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq * 0.5;
      gain.gain.value = 0.02;
      osc.start();
      bgOscillators.push(osc);
    });
  } catch(e) {}
}

function stopBgMusic() {
  bgOscillators.forEach(o => { try { o.stop(); } catch(e) {} });
  bgOscillators = [];
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundBtn');
  if (soundEnabled) {
    btn.textContent = '🔊 Sound AN';
    startBgMusic();
  } else {
    btn.textContent = '🔇 Sound AUS';
    stopBgMusic();
  }
}

// ==================== SCREENS ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); el.style.display = 'flex'; }
  document.querySelectorAll('.screen').forEach(s => {
    if (!s.classList.contains('active')) s.style.display = 'none';
  });
}

function showMenu() { playClick(); showScreen('screen-menu'); updateMenuStats(); }
function showLevelSelect() { playClick(); showScreen('screen-levelselect'); updateStarDisplay(); }
function showTutorial() { playClick(); showScreen('screen-tutorial'); }
function showCredits() { playClick(); showScreen('screen-credits'); }

// ==================== PC PARTS DATA ====================
const PC_PARTS = {
  cpu: {
    name: 'CPU (Prozessor)',
    emoji: '🧠',
    color: '#00BCD4',
    desc: 'Das Gehirn des Computers. Die CPU verarbeitet alle Berechnungen und Befehle. Sie bestimmt maßgeblich die Geschwindigkeit deines PCs.',
    facts: [
      { label: 'Steht für', value: 'Central Processing Unit' },
      { label: 'Hersteller', value: 'Intel & AMD' },
      { label: 'Verbindung', value: 'Sitzt im CPU-Sockel des Mainboards' },
      { label: 'Kühlung', value: 'Braucht immer einen Kühler!' }
    ],
    svg: `<svg viewBox="0 0 140 140" width="120" height="120">
      <rect x="20" y="20" width="100" height="100" rx="8" fill="#263238" stroke="#00BCD4" stroke-width="3"/>
      <rect x="35" y="35" width="70" height="70" rx="4" fill="#37474F" stroke="#00E5FF" stroke-width="2"/>
      <text x="70" y="65" text-anchor="middle" font-size="10" fill="#00E5FF" font-family="monospace">CPU</text>
      <text x="70" y="80" text-anchor="middle" font-size="8" fill="#90A4AE" font-family="monospace">i7-13700K</text>
      ${Array.from({length:8},(_,i)=>`<rect x="${22+i*12}" y="10" width="6" height="10" rx="2" fill="#9E9E9E"/>`).join('')}
      ${Array.from({length:8},(_,i)=>`<rect x="${22+i*12}" y="120" width="6" height="10" rx="2" fill="#9E9E9E"/>`).join('')}
      ${Array.from({length:6},(_,i)=>`<rect x="10" y="${22+i*14}" width="10" height="6" rx="2" fill="#9E9E9E"/>`).join('')}
      ${Array.from({length:6},(_,i)=>`<rect x="120" y="${22+i*14}" width="10" height="6" rx="2" fill="#9E9E9E"/>`).join('')}
    </svg>`
  },
  mainboard: {
    name: 'Mainboard',
    emoji: '🟢',
    color: '#43A047',
    desc: 'Das Mainboard (auch Motherboard) ist die Hauptplatine des PCs. Alle anderen Bauteile werden damit verbunden.',
    facts: [
      { label: 'Funktion', value: 'Verbindet alle Komponenten' },
      { label: 'Formfaktor', value: 'ATX, mATX, ITX' },
      { label: 'Slots', value: 'PCIe, RAM-Slots, M.2, SATA' },
      { label: 'Wichtig', value: 'CPU und RAM müssen kompatibel sein' }
    ],
    svg: `<svg viewBox="0 0 160 120" width="140" height="105">
      <rect x="5" y="5" width="150" height="110" rx="4" fill="#1B5E20" stroke="#4CAF50" stroke-width="2"/>
      <rect x="15" y="15" width="55" height="55" rx="3" fill="#2E7D32" stroke="#81C784" stroke-width="1.5"/>
      <text x="42" y="46" text-anchor="middle" font-size="8" fill="#A5D6A7">CPU</text>
      <text x="42" y="56" text-anchor="middle" font-size="7" fill="#81C784">Socket</text>
      <rect x="80" y="15" width="70" height="18" rx="2" fill="#1A3A1A" stroke="#66BB6A" stroke-width="1"/>
      <rect x="82" y="17" width="30" height="14" rx="1" fill="#263238"/>
      <text x="97" y="28" text-anchor="middle" font-size="8" fill="#00BCD4">RAM</text>
      <rect x="118" y="17" width="30" height="14" rx="1" fill="#263238"/>
      <text x="133" y="28" text-anchor="middle" font-size="8" fill="#00BCD4">RAM</text>
      <rect x="15" y="78" width="130" height="16" rx="2" fill="#1A3A1A" stroke="#FF5722" stroke-width="1"/>
      <text x="30" y="90" text-anchor="middle" font-size="8" fill="#FF7043">PCIe x16</text>
      <rect x="15" y="100" width="80" height="10" rx="2" fill="#1A3A1A" stroke="#FF9800" stroke-width="1"/>
      <text x="30" y="109" text-anchor="middle" font-size="7" fill="#FFA726">PCIe x1</text>
      ${Array.from({length:6},(_,i)=>`<circle cx="${110+i*7}" cy="${55}" r="3" fill="#FFD600" stroke="#000" stroke-width="0.5"/>`).join('')}
      <line x1="15" y1="72" x2="145" y2="72" stroke="#388E3C" stroke-width="0.5" stroke-dasharray="4,3"/>
    </svg>`
  },
  ram: {
    name: 'RAM (Arbeitsspeicher)',
    emoji: '💾',
    color: '#7C4DFF',
    desc: 'Der RAM speichert temporäre Daten, auf die die CPU schnell zugreifen muss. Mehr RAM = flüssigeres Multitasking.',
    facts: [
      { label: 'Steht für', value: 'Random Access Memory' },
      { label: 'Typen', value: 'DDR4, DDR5' },
      { label: 'Typische Größe', value: '8 GB, 16 GB, 32 GB' },
      { label: 'Wichtig', value: 'Flüchtiger Speicher – Daten gehen beim Ausschalten verloren' }
    ],
    svg: `<svg viewBox="0 0 160 60" width="140" height="52">
      <rect x="5" y="10" width="150" height="40" rx="3" fill="#1A237E" stroke="#7C4DFF" stroke-width="2"/>
      ${Array.from({length:16},(_,i)=>`<rect x="${12+i*9}" y="14" width="6" height="15" rx="1" fill="#3F51B5" stroke="#5C6BC0" stroke-width="0.5"/>`).join('')}
      ${Array.from({length:8},(_,i)=>`<rect x="${12+i*18}" y="32" width="14" height="14" rx="2" fill="#283593" stroke="#5C6BC0" stroke-width="1"/>`).join('')}
      <text x="80" y="44" text-anchor="middle" font-size="7" fill="#7C4DFF" font-family="monospace">DDR5-5600 16GB</text>
      ${Array.from({length:30},(_,i)=>`<rect x="${8+i*5}" y="50" width="3" height="5" rx="0.5" fill="#9E9E9E"/>`).join('')}
    </svg>`
  },
  gpu: {
    name: 'GPU (Grafikkarte)',
    emoji: '🎮',
    color: '#FF6D00',
    desc: 'Die GPU berechnet Grafiken und Bilder. Für Gaming, 3D-Rendering und KI-Aufgaben unverzichtbar.',
    facts: [
      { label: 'Steht für', value: 'Graphics Processing Unit' },
      { label: 'Hersteller', value: 'NVIDIA & AMD' },
      { label: 'Anschluss', value: 'PCIe x16 Slot auf dem Mainboard' },
      { label: 'Ausgänge', value: 'HDMI, DisplayPort' }
    ],
    svg: `<svg viewBox="0 0 200 90" width="160" height="72">
      <rect x="5" y="10" width="190" height="70" rx="6" fill="#BF360C" stroke="#FF6D00" stroke-width="2"/>
      <rect x="15" y="15" width="80" height="55" rx="4" fill="#4A148C" stroke="#CE93D8" stroke-width="1.5"/>
      <circle cx="55" cy="42" r="22" fill="#6A1B9A" stroke="#BA68C8" stroke-width="2"/>
      <circle cx="55" cy="42" r="14" fill="#4A148C" stroke="#CE93D8" stroke-width="1"/>
      ${Array.from({length:6},(_,i)=>`
        <line x1="55" y1="42"
              x2="${55+18*Math.cos(i*60*Math.PI/180)}"
              y2="${42+18*Math.sin(i*60*Math.PI/180)}"
              stroke="#CE93D8" stroke-width="4" stroke-linecap="round"/>
      `).join('')}
      <rect x="105" y="15" width="80" height="55" rx="4" fill="#1A237E" stroke="#5C6BC0" stroke-width="1.5"/>
      ${Array.from({length:8},(_,i)=>`<rect x="${110+i*9}" y="20" width="7" height="45" rx="1" fill="#283593" stroke="#3F51B5" stroke-width="0.5"/>`).join('')}
      <rect x="5" y="72" width="190" height="10" rx="3" fill="#37474F"/>
      ${Array.from({length:20},(_,i)=>`<rect x="${8+i*9}" y="74" width="6" height="6" rx="0.5" fill="#546E7A"/>`).join('')}
      <rect x="160" y="25" width="24" height="12" rx="2" fill="#212121" stroke="#FF6D00" stroke-width="1"/>
      <text x="172" y="35" text-anchor="middle" font-size="7" fill="#FF6D00">HDMI</text>
      <rect x="160" y="42" width="24" height="12" rx="2" fill="#212121" stroke="#2196F3" stroke-width="1"/>
      <text x="172" y="52" text-anchor="middle" font-size="6" fill="#2196F3">DP</text>
    </svg>`
  },
  ssd: {
    name: 'SSD (Festplatte)',
    emoji: '💿',
    color: '#00ACC1',
    desc: 'Die SSD speichert dauerhaft alle Daten – Betriebssystem, Programme und Dateien. Viel schneller als eine HDD.',
    facts: [
      { label: 'Steht für', value: 'Solid State Drive' },
      { label: 'Vorteil', value: 'Sehr schnell, kein Lärm, stoßfest' },
      { label: 'Anschluss', value: 'M.2 (NVMe) oder SATA' },
      { label: 'Typische Größe', value: '500 GB bis 4 TB' }
    ],
    svg: `<svg viewBox="0 0 160 80" width="140" height="70">
      <rect x="5" y="10" width="150" height="60" rx="4" fill="#006064" stroke="#00ACC1" stroke-width="2"/>
      <rect x="15" y="18" width="40" height="25" rx="3" fill="#004D40" stroke="#00BCD4" stroke-width="1.5"/>
      <text x="35" y="35" text-anchor="middle" font-size="8" fill="#80DEEA">NAND</text>
      <rect x="65" y="18" width="40" height="25" rx="3" fill="#004D40" stroke="#00BCD4" stroke-width="1.5"/>
      <text x="85" y="35" text-anchor="middle" font-size="8" fill="#80DEEA">NAND</text>
      <rect x="115" y="18" width="30" height="25" rx="3" fill="#00363A" stroke="#00ACC1" stroke-width="1"/>
      <text x="130" y="31" text-anchor="middle" font-size="7" fill="#00BCD4">CTRL</text>
      <rect x="15" y="52" width="125" height="10" rx="2" fill="#004D40"/>
      <text x="77" y="61" text-anchor="middle" font-size="8" fill="#80DEEA" font-family="monospace">Samsung 990 Pro 1TB NVMe</text>
      <rect x="145" y="20" width="10" height="40" rx="1" fill="#00838F"/>
      ${Array.from({length:4},(_,i)=>`<line x1="145" y1="${24+i*10}" x2="155" y2="${24+i*10}" stroke="#00BCD4" stroke-width="1"/>`).join('')}
    </svg>`
  },
  psu: {
    name: 'Netzteil (PSU)',
    emoji: '⚡',
    color: '#FFA000',
    desc: 'Das Netzteil wandelt den Strom aus der Steckdose in die Spannung um, die der PC benötigt. Es versorgt alle Komponenten.',
    facts: [
      { label: 'Steht für', value: 'Power Supply Unit' },
      { label: 'Leistung', value: 'In Watt (W) gemessen' },
      { label: 'Zertifizierung', value: '80 Plus Bronze / Gold / Platinum' },
      { label: 'Wichtig', value: 'Zu schwaches Netzteil = Abstürze!' }
    ],
    svg: `<svg viewBox="0 0 140 120" width="120" height="103">
      <rect x="5" y="5" width="130" height="110" rx="6" fill="#1A1A1A" stroke="#FFA000" stroke-width="2"/>
      <rect x="15" y="15" width="110" height="50" rx="4" fill="#212121"/>
      <circle cx="40" cy="40" r="18" fill="#111" stroke="#FFA000" stroke-width="2"/>
      ${Array.from({length:6},(_,i)=>`
        <line x1="40" y1="40"
              x2="${40+14*Math.cos(i*60*Math.PI/180)}"
              y2="${40+14*Math.sin(i*60*Math.PI/180)}"
              stroke="#FFA000" stroke-width="2.5" stroke-linecap="round"/>
      `).join('')}
      <circle cx="40" cy="40" r="5" fill="#FFA000"/>
      <rect x="75" y="20" width="44" height="40" rx="3" fill="#111" stroke="#555" stroke-width="1"/>
      ${Array.from({length:4},(_,i)=>`<line x1="78" y1="${27+i*10}" x2="116" y2="${27+i*10}" stroke="#333" stroke-width="1"/>`).join('')}
      <text x="97" y="24" text-anchor="middle" font-size="7" fill="#FFA000">SPECS</text>
      <text x="97" y="34" text-anchor="middle" font-size="7" fill="#888">850W Gold</text>
      <text x="97" y="44" text-anchor="middle" font-size="6" fill="#666">12V / 70A</text>
      ${['yellow','red','orange','black','white','green'].map((c,i)=>
        `<line x1="${18+i*14}" y1="70" x2="${18+i*14}" y2="100" stroke="${c === 'black' ? '#555' : c}" stroke-width="3" stroke-linecap="round"/>`
      ).join('')}
      <rect x="100" y="90" width="25" height="18" rx="2" fill="#111" stroke="#555" stroke-width="1"/>
      <text x="112" y="103" text-anchor="middle" font-size="7" fill="#888">ON/OFF</text>
    </svg>`
  },
  cooler: {
    name: 'CPU-Kühler',
    emoji: '❄️',
    color: '#29B6F6',
    desc: 'Der CPU-Kühler verhindert, dass die CPU durch die entstehende Wärme überhitzt. Ohne Kühler würde die CPU sofort durchbrennen!',
    facts: [
      { label: 'Typen', value: 'Luftkühler & Wasserkühler (AIO)' },
      { label: 'Verbindung', value: 'Sitzt direkt auf dem CPU-Die' },
      { label: 'Wärmeleitpaste', value: 'Wird zwischen CPU und Kühler aufgetragen' },
      { label: 'Steuerung', value: 'Über 4-Pin PWM Anschluss am Mainboard' }
    ],
    svg: `<svg viewBox="0 0 120 120" width="110" height="110">
      <rect x="20" y="20" width="80" height="80" rx="6" fill="#01579B" stroke="#29B6F6" stroke-width="2"/>
      ${Array.from({length:6},(_,i)=>`
        <rect x="${24+i*12}" y="24" width="10" height="72" rx="2" fill="#0277BD" stroke="#29B6F6" stroke-width="0.5"/>
      `).join('')}
      <circle cx="60" cy="60" r="28" fill="rgba(1,87,155,0.85)" stroke="#4FC3F7" stroke-width="2"/>
      ${Array.from({length:7},(_,i)=>`
        <path d="M60,60 L${60+26*Math.cos((i*51-90)*Math.PI/180)},${60+26*Math.sin((i*51-90)*Math.PI/180)} 
                 A26,26,0,0,1,${60+26*Math.cos(((i+0.4)*51-90)*Math.PI/180)},${60+26*Math.sin(((i+0.4)*51-90)*Math.PI/180)} Z"
              fill="#0288D1" stroke="#4FC3F7" stroke-width="0.5"/>
      `).join('')}
      <circle cx="60" cy="60" r="10" fill="#01579B" stroke="#29B6F6" stroke-width="2"/>
      <circle cx="60" cy="60" r="4"  fill="#4FC3F7"/>
    </svg>`
  },
  case: {
    name: 'PC-Gehäuse',
    emoji: '🖥️',
    color: '#78909C',
    desc: 'Das Gehäuse beherbergt alle PC-Komponenten und schützt sie. Es sorgt auch für gute Luftzirkulation zur Kühlung.',
    facts: [
      { label: 'Formfaktoren', value: 'Full Tower, Mid Tower, Mini-ITX' },
      { label: 'Material', value: 'Stahl, Aluminium, Glas' },
      { label: 'Lüfter', value: 'Case Fans für Belüftung' },
      { label: 'Wichtig', value: 'Muss mit Mainboard-Formfaktor kompatibel sein' }
    ],
    svg: `<svg viewBox="0 0 100 160" width="80" height="128">
      <rect x="10" y="5" width="80" height="150" rx="6" fill="#263238" stroke="#546E7A" stroke-width="2.5"/>
      <rect x="10" y="5" width="40" height="150" rx="6" fill="rgba(100,200,255,0.08)" stroke="#546E7A" stroke-width="1"/>
      <rect x="18" y="15" width="64" height="55" rx="3" fill="#37474F" stroke="#546E7A" stroke-width="1"/>
      <circle cx="32" cy="42" r="14" fill="#263238" stroke="#455A64" stroke-width="1.5"/>
      ${Array.from({length:6},(_,i)=>`
        <line x1="32" y1="42"
              x2="${32+11*Math.cos(i*60*Math.PI/180)}"
              y2="${42+11*Math.sin(i*60*Math.PI/180)}"
              stroke="#455A64" stroke-width="2.5" stroke-linecap="round"/>
      `).join('')}
      <circle cx="32" cy="42" r="4" fill="#37474F"/>
      <circle cx="14" cy="100" r="5" fill="#00E676"/>
      <rect x="18" y="90" width="64" height="4" rx="2" fill="#37474F"/>
      <rect x="18" y="100" width="64" height="4" rx="2" fill="#37474F"/>
      <rect x="18" y="120" width="64" height="25" rx="3" fill="#1C313A" stroke="#455A64" stroke-width="1"/>
      <text x="50" y="137" text-anchor="middle" font-size="8" fill="#546E7A">CORSAIR 4000D</text>
      <rect x="62" y="15" width="16" height="10" rx="2" fill="#1A1A2E" stroke="#7E57C2" stroke-width="1"/>
      <rect x="62" y="30" width="16" height="10" rx="2" fill="#1A1A2E" stroke="#546E7A" stroke-width="1"/>
      <rect x="62" y="45" width="16" height="6" rx="1" fill="#1A1A2E" stroke="#546E7A" stroke-width="1"/>
    </svg>`
  }
};

// ==================== LEVEL DEFINITIONS ====================
const LEVELS = {
  1: {
    title: 'Level 1 – Die Grundlagen',
    questions: [
      {
        type: 'quiz',
        part: 'cpu',
        text: 'Was ist die Hauptaufgabe der CPU?',
        answers: [
          'Grafiken berechnen',
          'Daten dauerhaft speichern',
          'Alle Berechnungen und Befehle verarbeiten',
          'Strom verteilen'
        ],
        correct: 2,
        explanation: 'Die CPU (Central Processing Unit) ist das Gehirn des Computers. Sie verarbeitet alle Berechnungen und führt Befehle aus.'
      },
      {
        type: 'quiz',
        part: 'ram',
        text: 'Wofür steht "RAM"?',
        answers: [
          'Random Access Memory',
          'Read And Memory',
          'Rapid Archive Module',
          'Real Application Machine'
        ],
        correct: 0,
        explanation: 'RAM steht für "Random Access Memory" – Arbeitsspeicher. Er speichert temporäre Daten, die die CPU gerade benutzt.'
      },
      {
        type: 'quiz',
        part: 'ssd',
        text: 'Was unterscheidet eine SSD von einer HDD?',
        answers: [
          'SSD ist langsamer aber billiger',
          'SSD hat keine beweglichen Teile und ist viel schneller',
          'SSD benötigt mehr Strom',
          'Es gibt keinen Unterschied'
        ],
        correct: 1,
        explanation: 'SSDs (Solid State Drives) haben keine beweglichen Teile. Sie sind viel schneller, leiser und stromsparender als HDDs (Hard Disk Drives).'
      },
      {
        type: 'identify',
        text: 'Welches Bauteil siehst du hier?',
        showPart: 'gpu',
        answers: ['CPU', 'Netzteil', 'GPU (Grafikkarte)', 'Mainboard'],
        correct: 2,
        explanation: 'Das ist eine GPU (Graphics Processing Unit) – die Grafikkarte! Sie berechnet alle Grafiken und ist besonders beim Gaming wichtig.'
      },
      {
        type: 'quiz',
        part: 'mainboard',
        text: 'Was ist die Hauptaufgabe des Mainboards?',
        answers: [
          'Bilder ausgeben',
          'Alle Komponenten verbinden',
          'Spiele speichern',
          'Internet herstellen'
        ],
        correct: 1,
        explanation: 'Das Mainboard (Motherboard) ist die zentrale Platine, die alle Komponenten miteinander verbindet – CPU, RAM, GPU, SSD und mehr.'
      }
    ]
  },
  2: {
    title: 'Level 2 – Komponentenwissen',
    questions: [
      {
        type: 'quiz',
        part: 'psu',
        text: 'Was passiert, wenn das Netzteil zu schwach ist?',
        answers: [
          'Der PC wird schneller',
          'Es ändert sich nichts',
          'PC stürzt ab oder startet nicht',
          'Der Monitor wird dunkler'
        ],
        correct: 2,
        explanation: 'Wenn das Netzteil (PSU) nicht genug Watt liefert, kann es zu Abstürzen, Neustarts oder gar nicht erst zum Starten kommen. Besonders beim Gaming wichtig!'
      },
      {
        type: 'quiz',
        part: 'cooler',
        text: 'Wofür braucht man Wärmeleitpaste?',
        answers: [
          'Um den RAM zu kleben',
          'Für den Stecker zwischen CPU und Kühler',
          'Um die Wärme zwischen CPU und Kühler optimal zu übertragen',
          'Zum Lackieren des Gehäuses'
        ],
        correct: 2,
        explanation: 'Wärmeleitpaste füllt mikroskopische Unebenheiten zwischen CPU und Kühler. Ohne sie gibt es schlechten Wärmekontakt → CPU überhitzt!'
      },
      {
        type: 'quiz',
        part: 'ram',
        text: 'Was passiert mit RAM-Daten wenn der PC ausgeschaltet wird?',
        answers: [
          'Sie bleiben dauerhaft gespeichert',
          'Sie werden auf die SSD übertragen',
          'Sie gehen verloren',
          'Sie werden in der Cloud gesichert'
        ],
        correct: 2,
        explanation: 'RAM ist "flüchtiger Speicher" (volatile memory). Alle Daten gehen beim Ausschalten verloren. Dauerhaft gespeichert wird auf SSD/HDD.'
      },
      {
        type: 'quiz',
        part: 'gpu',
        text: 'Über welchen Slot wird die GPU mit dem Mainboard verbunden?',
        answers: [
          'SATA Anschluss',
          'PCIe x16 Slot',
          'USB-C Buchse',
          'M.2 Slot'
        ],
        correct: 1,
        explanation: 'Die GPU wird in den PCIe x16 Slot auf dem Mainboard gesteckt. PCIe steht für "Peripheral Component Interconnect Express" – eine sehr schnelle Verbindung.'
      },
      {
        type: 'identify',
        text: 'Welches Bauteil siehst du hier?',
        showPart: 'psu',
        answers: ['GPU', 'Netzteil (PSU)', 'CPU-Kühler', 'Mainboard'],
        correct: 1,
        explanation: 'Das ist das Netzteil (PSU – Power Supply Unit). Es wandelt den Wechselstrom aus der Steckdose in Gleichstrom für die PC-Komponenten um.'
      },
      {
        type: 'match',
        text: 'Ordne die Bauteile ihren Aufgaben zu!',
        pairs: [
          { term: 'CPU', def: 'Berechnungen ausführen' },
          { term: 'RAM', def: 'Temporäre Daten' },
          { term: 'SSD', def: 'Dauerhafter Speicher' },
          { term: 'GPU', def: 'Grafiken berechnen' }
        ]
      }
    ]
  },
};

// ==================== GAME STATE ====================
let currentLevel = 1;
let currentQuestion = 0;
let score = 0;
let stars = { 1: 0, 2: 0 };
let matchSelectedTerm = null;
let matchSelectedDef  = null;
let matchPairs = [];
let matchMatched = 0;
let orderItems = [];

// ==================== NAVIGATION ====================
function startLevel(num) {
  playClick();
  currentLevel = num;
  currentQuestion = 0;
  score = 0;
  showScreen('screen-game');
  document.getElementById('hudLevel').textContent = LEVELS[num].title.split('–')[0].trim();
  document.getElementById('hudScore').textContent = '0';
  renderQuestion();
}

function nextLevel() {
  const next = currentLevel + 1;
  if (LEVELS[next]) {
    document.getElementById('overlay-result').classList.add('hidden');
    startLevel(next);
  } else {
    document.getElementById('overlay-result').classList.add('hidden');
    showLevelSelect();
  }
}

// ==================== RENDER QUESTION ====================
function renderQuestion() {
  const level = LEVELS[currentLevel];
  const q = level.questions[currentQuestion];
  const total = level.questions.length;
  const pct = Math.round((currentQuestion / total) * 100);

  document.getElementById('hudProgress').style.width = pct + '%';

  const content = document.getElementById('gameContent');
  content.innerHTML = '';

  if (q.type === 'quiz' || q.type === 'identify') renderQuiz(q, content);
  else if (q.type === 'match') renderMatch(q, content);
  else if (q.type === 'order') renderOrder(q, content);
}

function renderQuiz(q, container) {
  const card = document.createElement('div');
  card.className = 'q-card';

  const total = LEVELS[currentLevel].questions.length;
  card.innerHTML = `
    <div class="q-num">Frage ${currentQuestion + 1} von ${total}</div>
    <div class="q-text">${q.text}</div>
    <div class="q-part-display">
      ${q.type === 'identify' ? PC_PARTS[q.showPart].svg : (q.part ? PC_PARTS[q.part].svg : '')}
    </div>
    <div class="answers-grid">
      ${q.answers.map((a, i) => `
        <button class="answer-btn" onclick="checkAnswer(${i})" id="ans${i}">
          <span class="answer-letter">${'ABCD'[i]}</span>
          ${a}
        </button>
      `).join('')}
    </div>
  `;
  container.appendChild(card);
}

function checkAnswer(idx) {
  const q = LEVELS[currentLevel].questions[currentQuestion];
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach(b => b.disabled = true);

  const correct = idx === q.correct;
  if (correct) {
    playCorrect();
    score += 20;
    document.getElementById('hudScore').textContent = score;
    btns[idx].classList.add('correct');
  } else {
    playWrong();
    btns[idx].classList.add('wrong');
    btns[q.correct].classList.add('correct');
  }

  showFeedback(correct, q.explanation, q.part || q.showPart);
}

function showFeedback(correct, explanation, partKey) {
  const content = document.getElementById('gameContent');
  const fb = document.createElement('div');
  fb.className = `feedback-box ${correct ? 'correct' : 'wrong'}`;
  fb.innerHTML = `
    <div class="feedback-title">${correct ? '✅ Richtig!' : '❌ Leider falsch'}</div>
    <p>${explanation}</p>
    ${partKey ? `<button style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:14px;margin-top:6px;font-family:'Comic Neue',cursive;font-weight:700;" onclick="showPartInfo('${partKey}')">🔍 Mehr über ${PC_PARTS[partKey]?.name} erfahren</button>` : ''}
    <br>
    <button class="next-btn" onclick="nextQuestion()">Weiter →</button>
  `;
  content.appendChild(fb);
}

// ==================== MATCH GAME ====================
function renderMatch(q, container) {
  matchSelectedTerm = null;
  matchSelectedDef  = null;
  matchMatched = 0;
  matchPairs = [...q.pairs];

  const card = document.createElement('div');
  card.className = 'q-card match-container';

  const shuffledDefs = [...q.pairs].sort(() => Math.random() - 0.5);

  card.innerHTML = `
    <div class="q-num">Frage ${currentQuestion + 1} von ${LEVELS[currentLevel].questions.length}</div>
    <div class="q-text">${q.text}</div>
    <div class="match-columns">
      <div>
        <div class="match-col-title">🔧 BAUTEIL</div>
        ${q.pairs.map((p, i) => `
          <div class="match-item" id="term-${i}" onclick="selectTerm(${i})">${p.term}</div>
        `).join('')}
      </div>
      <div>
        <div class="match-col-title">📋 FUNKTION</div>
        ${shuffledDefs.map((p, i) => `
          <div class="match-item" id="def-${i}" onclick="selectDef(${i})" data-def="${p.def}">${p.def}</div>
        `).join('')}
      </div>
    </div>
  `;

  container.appendChild(card);
}

function selectTerm(i) {
  if (document.getElementById(`term-${i}`).classList.contains('matched')) return;
  document.querySelectorAll('.match-item[id^="term-"]').forEach(el => el.classList.remove('selected-term'));
  matchSelectedTerm = i;
  document.getElementById(`term-${i}`).classList.add('selected-term');
  if (matchSelectedDef !== null) tryMatch();
}

function selectDef(i) {
  if (document.getElementById(`def-${i}`).classList.contains('matched')) return;
  document.querySelectorAll('.match-item[id^="def-"]').forEach(el => el.classList.remove('selected-def'));
  matchSelectedDef = i;
  document.getElementById(`def-${i}`).classList.add('selected-def');
  if (matchSelectedTerm !== null) tryMatch();
}

function tryMatch() {
  const termEl = document.getElementById(`term-${matchSelectedTerm}`);
  const defEl  = document.getElementById(`def-${matchSelectedDef}`);
  const termData = matchPairs[matchSelectedTerm];
  const defData  = defEl.dataset.def;

  if (termData.def === defData) {
    playCorrect();
    termEl.classList.remove('selected-term');
    defEl.classList.remove('selected-def');
    termEl.classList.add('matched');
    defEl.classList.add('matched');
    matchMatched++;
    score += 10;
    document.getElementById('hudScore').textContent = score;
    matchSelectedTerm = null;
    matchSelectedDef  = null;
    if (matchMatched === matchPairs.length) {
      setTimeout(() => {
        const content = document.getElementById('gameContent');
        const fb = document.createElement('div');
        fb.className = 'feedback-box correct';
        fb.innerHTML = `<div class="feedback-title">✅ Alle richtig!</div><p>Super, du kennst die Bauteile und ihre Funktionen!</p><button class="next-btn" onclick="nextQuestion()">Weiter →</button>`;
        content.appendChild(fb);
      }, 400);
    }
  } else {
    playWrong();
    termEl.classList.add('wrong-flash');
    defEl.classList.add('wrong-flash');
    setTimeout(() => {
      termEl.classList.remove('selected-term', 'wrong-flash');
      defEl.classList.remove('selected-def', 'wrong-flash');
    }, 600);
    matchSelectedTerm = null;
    matchSelectedDef  = null;
  }
}

// ==================== ORDER GAME ====================
function renderOrder(q, container) {
  orderItems = [...q.steps].sort(() => Math.random() - 0.5);

  const card = document.createElement('div');
  card.className = 'q-card';

  card.innerHTML = `
    <div class="q-num">Frage ${currentQuestion + 1} von ${LEVELS[currentLevel].questions.length}</div>
    <div class="q-text">${q.text}</div>
    <div class="build-area">
      <div class="parts-pool">
        <h3>📦 VERFÜGBARE TEILE</h3>
        <div id="partsPool">
          ${orderItems.map(item => `
            <div class="part-chip" draggable="true" id="chip-${item.id}"
                 ondragstart="dragStart(event,'${item.id}')"
                 ondragend="dragEnd(event)">
              ${item.label}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="build-slots">
        <h3>🔧 BAUPLAN</h3>
        ${q.steps.map((step, i) => `
          <div class="build-slot" id="slot-${i}"
               ondragover="dragOver(event)"
               ondrop="dropItem(event, ${i})"
               ondragleave="dragLeave(event)">
            <span class="slot-num">${i + 1}</span>
            <span class="slot-content" id="slotContent-${i}">
              <span style="color:#555;font-size:12px">Hierher ziehen…</span>
            </span>
          </div>
        `).join('')}
        <button class="next-btn" onclick="checkOrder()" style="margin-top:12px">Überprüfen ✓</button>
      </div>
    </div>
  `;
  container.appendChild(card);
}

let draggingId = null;

function dragStart(e, id) {
  draggingId = id;
  e.target.classList.add('dragging');
  e.dataTransfer.setData('text/plain', id);
}

function dragEnd(e) { e.target.classList.remove('dragging'); }

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) { e.currentTarget.classList.remove('drag-over'); }

function dropItem(e, slotIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const id = e.dataTransfer.getData('text/plain');
  const step = LEVELS[currentLevel].questions[currentQuestion].steps.find(s => s.id === id);
  if (!step) return;

  const slotContent = document.getElementById(`slotContent-${slotIdx}`);
  const oldId = slotContent.dataset.filledId;
  if (oldId) {
    // Return old chip to pool
    const chip = document.getElementById(`chip-${oldId}`);
    if (chip) chip.classList.remove('used');
  }

  slotContent.innerHTML = `<span class="part-chip" style="margin:0;">${step.label}</span>`;
  slotContent.dataset.filledId = id;
  document.getElementById(`slot-${slotIdx}`).classList.add('filled');

  const chip = document.getElementById(`chip-${id}`);
  if (chip) chip.classList.add('used');
}

function checkOrder() {
  const q = LEVELS[currentLevel].questions[currentQuestion];
  let allCorrect = true;
  let filled = 0;

  q.steps.forEach((step, i) => {
    const slotContent = document.getElementById(`slotContent-${i}`);
    if (!slotContent || !slotContent.dataset.filledId) { allCorrect = false; return; }
    filled++;
    if (slotContent.dataset.filledId !== step.id) allCorrect = false;
  });

  if (filled < q.steps.length) {
    alert('Bitte fülle alle Slots aus!');
    return;
  }

  const content = document.getElementById('gameContent');
  const fb = document.createElement('div');

  if (allCorrect) {
    playSuccess();
    score += 30;
    document.getElementById('hudScore').textContent = score;
    fb.className = 'feedback-box correct';
    fb.innerHTML = `<div class="feedback-title">✅ Perfekte Reihenfolge!</div>
      <p>Genau so baut man einen PC zusammen! Du bist ein Hardware Hero! 🦸</p>
      <button class="next-btn" onclick="nextQuestion()">Weiter →</button>`;
  } else {
    playWrong();
    fb.className = 'feedback-box wrong';
    fb.innerHTML = `<div class="feedback-title">❌ Nicht ganz richtig</div>
      <p>Die richtige Reihenfolge:<br>${q.steps.map((s,i)=>`<strong>${i+1}.</strong> ${s.label}`).join(' → ')}</p>
      <button class="next-btn" onclick="nextQuestion()">Weiter →</button>`;
  }

  content.appendChild(fb);
}

// ==================== NEXT QUESTION ====================
function nextQuestion() {
  const level = LEVELS[currentLevel];
  currentQuestion++;

  if (currentQuestion >= level.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ==================== RESULT ====================
function showResult() {
  const maxScore = LEVELS[currentLevel].questions.length * 20;
  const pct = score / maxScore;
  let starCount = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
  stars[currentLevel] = Math.max(stars[currentLevel], starCount);
  saveProgress();

  playSuccess();

  document.getElementById('hudProgress').style.width = '100%';

  const emoji = starCount === 3 ? '🏆' : starCount === 2 ? '🎉' : '💪';
  const title = starCount === 3 ? 'Perfekt!' : starCount === 2 ? 'Sehr gut!' : 'Geschafft!';
  const text  = starCount === 3
    ? 'Du hast alle Fragen richtig beantwortet – du bist ein echter Hardware Hero!'
    : starCount === 2
    ? 'Gute Arbeit! Mit etwas Übung schaffst du auch die 3 Sterne!'
    : 'Du hast das Level geschafft! Wiederhole es für mehr Sterne.';

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultText').textContent  = text;

  const starsEl = document.getElementById('resultStars');
  starsEl.innerHTML = [1,2,3].map((i,idx) => `<span class="result-star" id="rs${idx}">★</span>`).join('');

  [1,2,3].forEach((_, i) => {
    setTimeout(() => {
      if (i < starCount) document.getElementById(`rs${i}`).classList.add('lit');
    }, 300 + i * 200);
  });

  const nextBtn = document.getElementById('btnNextLevel');
  if (LEVELS[currentLevel + 1]) {
    nextBtn.textContent = `Level ${currentLevel + 1} ▶`;
    nextBtn.style.display = '';
  } else {
    nextBtn.style.display = 'none';
  }

  document.getElementById('overlay-result').classList.remove('hidden');
}

// ==================== PART INFO ====================
function showPartInfo(key) {
  const part = PC_PARTS[key];
  if (!part) return;
  document.getElementById('infoPartSvg').innerHTML = part.svg;
  document.getElementById('infoTitle').textContent = part.name;
  document.getElementById('infoDesc').textContent  = part.desc;
  document.getElementById('infoFacts').innerHTML = part.facts.map(f =>
    `<div class="info-fact"><strong>${f.label}:</strong> ${f.value}</div>`
  ).join('');
  document.getElementById('overlay-info').classList.remove('hidden');
}

function closeInfo() {
  document.getElementById('overlay-info').classList.add('hidden');
}

// ==================== PROGRESS ====================
function saveProgress() {
  try { localStorage.setItem('hw_stars', JSON.stringify(stars)); } catch(e) {}
}

function loadProgress() {
  try {
    const s = JSON.parse(localStorage.getItem('hw_stars'));
    if (s) stars = s;
  } catch(e) {}
}

function updateStarDisplay() {
  [1,2].forEach(lvl => {
    [1,2,3].forEach(si => {
      const el = document.getElementById(`l${lvl}s${si}`);
      if (el) el.classList.toggle('earned', si <= stars[lvl]);
    });
  });
}

// ==================== FLOATING MENU ICONS ====================
const MENU_ICONS = [
  // CPU
  { svg: `<svg viewBox="0 0 60 60" width="80" height="80"><rect x="8" y="8" width="44" height="44" rx="5" fill="none" stroke="#00BCD4" stroke-width="2.5"/><rect x="16" y="16" width="28" height="28" rx="3" fill="none" stroke="#00E5FF" stroke-width="1.5"/>${[0,1,2,3].map(i=>`<rect x="${10+i*11}" y="2" width="5" height="6" rx="1" fill="#00BCD4"/>`).join('')}${[0,1,2,3].map(i=>`<rect x="${10+i*11}" y="52" width="5" height="6" rx="1" fill="#00BCD4"/>`).join('')}</svg>`, x: 8, y: 12, dur: 20, delay: 0 },
  // GPU
  { svg: `<svg viewBox="0 0 100 42" width="130" height="56"><rect x="3" y="3" width="94" height="36" rx="4" fill="none" stroke="#FF6D00" stroke-width="2"/><circle cx="25" cy="20" r="10" fill="none" stroke="#FF9800" stroke-width="1.5"/>${[0,1,2,3,4,5].map(i=>`<line x1="25" y1="20" x2="${25+8*Math.cos(i*60*Math.PI/180)}" y2="${20+8*Math.sin(i*60*Math.PI/180)}" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"/>`).join('')}<rect x="3" y="34" width="94" height="7" rx="2" fill="none" stroke="#FF6D00" stroke-width="1"/></svg>`, x: 75, y: 5, dur: 25, delay: 3 },
  // RAM
  { svg: `<svg viewBox="0 0 90 28" width="110" height="34"><rect x="3" y="4" width="84" height="20" rx="2" fill="none" stroke="#7C4DFF" stroke-width="2"/>${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${7+i*9}" y="7" width="6" height="9" rx="1" fill="none" stroke="#9C6DFF" stroke-width="1"/>`).join('')}</svg>`, x: 20, y: 72, dur: 22, delay: 6 },
  // Mainboard
  { svg: `<svg viewBox="0 0 80 60" width="100" height="75"><rect x="3" y="3" width="74" height="54" rx="3" fill="none" stroke="#4CAF50" stroke-width="2"/><rect x="8" y="7" width="26" height="26" rx="2" fill="none" stroke="#81C784" stroke-width="1.5"/><rect x="37" y="7" width="34" height="12" rx="1.5" fill="none" stroke="#66BB6A" stroke-width="1"/><rect x="8" y="40" width="64" height="9" rx="1.5" fill="none" stroke="#FF5722" stroke-width="1"/></svg>`, x: 65, y: 65, dur: 28, delay: 9 },
  // PSU
  { svg: `<svg viewBox="0 0 60 50" width="75" height="62"><rect x="3" y="3" width="54" height="44" rx="4" fill="none" stroke="#FFA000" stroke-width="2"/><circle cx="22" cy="24" r="10" fill="none" stroke="#FFA000" stroke-width="1.5"/>${[0,1,2,3,4,5].map(i=>`<line x1="22" y1="24" x2="${22+8*Math.cos(i*60*Math.PI/180)}" y2="${24+8*Math.sin(i*60*Math.PI/180)}" stroke="#FFA000" stroke-width="1.5" stroke-linecap="round"/>`).join('')}</svg>`, x: 40, y: 40, dur: 18, delay: 12 },
  // SSD
  { svg: `<svg viewBox="0 0 80 28" width="100" height="35"><rect x="3" y="3" width="74" height="22" rx="3" fill="none" stroke="#00ACC1" stroke-width="2"/><rect x="7" y="6" width="18" height="12" rx="2" fill="none" stroke="#00BCD4" stroke-width="1"/><rect x="28" y="6" width="18" height="12" rx="2" fill="none" stroke="#00BCD4" stroke-width="1"/><rect x="50" y="6" width="14" height="12" rx="2" fill="none" stroke="#00ACC1" stroke-width="1"/></svg>`, x: 5, y: 50, dur: 30, delay: 4 },
  // Cooler
  { svg: `<svg viewBox="0 0 60 60" width="72" height="72"><rect x="8" y="8" width="44" height="44" rx="5" fill="none" stroke="#29B6F6" stroke-width="2"/><circle cx="30" cy="30" r="14" fill="none" stroke="#4FC3F7" stroke-width="2"/>${[0,1,2,3].map(i=>`<path d="M30,30 Q${30+12*Math.cos((i*90-45)*Math.PI/180)},${30+12*Math.sin((i*90-45)*Math.PI/180)} ${30+16*Math.cos((i*90)*Math.PI/180)},${30+16*Math.sin((i*90)*Math.PI/180)} Q${30+12*Math.cos((i*90+45)*Math.PI/180)},${30+12*Math.sin((i*90+45)*Math.PI/180)} 30,30 Z" fill="none" stroke="#29B6F6" stroke-width="1"/>`).join('')}</svg>`, x: 85, y: 45, dur: 24, delay: 7 },
  // Fan
  { svg: `<svg viewBox="0 0 55 55" width="65" height="65"><rect x="3" y="3" width="49" height="49" rx="6" fill="none" stroke="#546E7A" stroke-width="2"/><circle cx="27" cy="27" r="20" fill="none" stroke="#455A64" stroke-width="1.5"/><circle cx="27" cy="27" r="5" fill="none" stroke="#78909C" stroke-width="1.5"/></svg>`, x: 55, y: 80, dur: 32, delay: 2 },
];

function buildFloatingIcons() {
  const layer = document.getElementById('floatingIcons');
  if (!layer) return;
  layer.innerHTML = '';
  MENU_ICONS.forEach((icon, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'float-icon';
    wrap.style.cssText = `
      left: ${icon.x}%;
      top:  ${icon.y}%;
      --dur:   ${icon.dur}s;
      --delay: ${icon.delay}s;
      --r0: ${(Math.random()-0.5)*20}deg;
      --r1: ${(Math.random()-0.5)*20}deg;
      --r2: ${(Math.random()-0.5)*20}deg;
    `;
    wrap.innerHTML = icon.svg;
    layer.appendChild(wrap);
  });
}

// ==================== MENU STATS ====================
function updateMenuStats() {
  const totalStars = Object.values(stars).reduce((a,b) => a + b, 0);
  const totalLevels = Object.values(stars).filter(s => s > 0).length;
  const elS = document.getElementById('statStars');
  const elL = document.getElementById('statLevels');
  if (elS) elS.textContent = totalStars;
  if (elL) elL.textContent = totalLevels;
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  showScreen('screen-menu');
  buildFloatingIcons();
  setTimeout(() => { updateStarDisplay(); updateMenuStats(); }, 100);
});
