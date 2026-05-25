/* ==================
   FIT TRACKER APP
   ================== */

// ===== PIN LOCK =====
const PIN_KEY = 'fit:pin';
const PIN_SESSION_KEY = 'fit:unlocked';
const SESSION_DURATION = 1000 * 60 * 60 * 4; // 4 hours

const PinLock = {
  buffer: '',
  mode: 'verify', // 'setup', 'confirm', 'verify'
  firstPin: '',

  async hash(pin) {
    const enc = new TextEncoder();
    const data = enc.encode(pin + ':fit-tracker-salt-2026');
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  },

  hasPin() {
    return !!localStorage.getItem(PIN_KEY);
  },

  isUnlocked() {
    const ts = parseInt(sessionStorage.getItem(PIN_SESSION_KEY) || '0');
    return ts && (Date.now() - ts < SESSION_DURATION);
  },

  markUnlocked() {
    sessionStorage.setItem(PIN_SESSION_KEY, Date.now().toString());
  },

  async init() {
    const lockScreen = document.getElementById('lock-screen');
    const appEl = document.getElementById('app');

    if (this.isUnlocked()) {
      lockScreen.classList.add('hidden');
      appEl.classList.remove('hidden');
      return true;
    }

    lockScreen.classList.remove('hidden');
    appEl.classList.add('hidden');

    if (this.hasPin()) {
      this.mode = 'verify';
      this.updateUI('Enter PIN', '4 digits to unlock');
    } else {
      this.mode = 'setup';
      this.updateUI('Set a PIN', 'Choose 4 digits — you\'ll need this each time');
    }

    this.bindEvents();
    return false;
  },

  bindEvents() {
    document.querySelectorAll('.pin-key[data-digit]').forEach(btn => {
      btn.addEventListener('click', () => this.press(btn.dataset.digit));
    });
    document.getElementById('pin-back').addEventListener('click', () => this.backspace());
    document.getElementById('pin-reset-btn').addEventListener('click', () => this.resetApp());
  },

  press(digit) {
    if (this.buffer.length >= 4) return;
    this.buffer += digit;
    this.renderDots();
    this.clearError();
    if (this.buffer.length === 4) {
      setTimeout(() => this.submit(), 150);
    }
  },

  backspace() {
    this.buffer = this.buffer.slice(0, -1);
    this.renderDots();
    this.clearError();
  },

  renderDots() {
    document.querySelectorAll('.pin-dot').forEach((dot, i) => {
      dot.classList.toggle('filled', i < this.buffer.length);
    });
  },

  showError(msg) {
    const el = document.getElementById('pin-error');
    el.textContent = msg;
    document.getElementById('pin-dots').classList.add('shake');
    setTimeout(() => document.getElementById('pin-dots').classList.remove('shake'), 400);
  },

  clearError() {
    document.getElementById('pin-error').textContent = '';
  },

  updateUI(title, subtitle) {
    document.getElementById('lock-title').textContent = title;
    document.getElementById('lock-subtitle').textContent = subtitle;
    this.buffer = '';
    this.renderDots();
    this.clearError();
  },

  async submit() {
    if (this.mode === 'setup') {
      this.firstPin = this.buffer;
      this.mode = 'confirm';
      this.updateUI('Confirm PIN', 'Re-enter the same 4 digits');
    } else if (this.mode === 'confirm') {
      if (this.buffer === this.firstPin) {
        const hashed = await this.hash(this.buffer);
        localStorage.setItem(PIN_KEY, hashed);
        this.unlock();
      } else {
        this.showError('PINs don\'t match. Try again.');
        this.mode = 'setup';
        this.firstPin = '';
        setTimeout(() => this.updateUI('Set a PIN', 'Choose 4 digits'), 600);
      }
    } else if (this.mode === 'verify') {
      const hashed = await this.hash(this.buffer);
      const stored = localStorage.getItem(PIN_KEY);
      if (hashed === stored) {
        this.unlock();
      } else {
        this.showError('Wrong PIN. Try again.');
        setTimeout(() => { this.buffer = ''; this.renderDots(); }, 400);
      }
    }
  },

  unlock() {
    this.markUnlocked();
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    if (typeof render === 'function') render();
  },

  resetApp() {
    const confirmed = confirm(
      'This will delete your PIN and ALL your tracking data.\n\n' +
      'Are you sure? This cannot be undone.'
    );
    if (!confirmed) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('fit:') || k === PIN_KEY)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    location.reload();
  }
};

// Re-lock when app is hidden for a while (returning from background)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && PinLock.hasPin() && !PinLock.isUnlocked()) {
    location.reload();
  }
});

// ===== PLAN DATA =====
const START_DATE = '2026-05-25';
const TARGET_DATE = '2026-08-20';
const START_WEIGHT = 78.0;
const TARGET_WEIGHT = 70.0;

// Phase definitions
const PHASES = {
  0: {
    name: 'Phase 0 · Foundation',
    weeks: '1–3',
    description: 'Mobility, posture, bodyweight only. No heavy weights yet. Goal: wake the body up safely.',
    workout: [
      { id: 'w0', title: 'Warm-up: 5 min treadmill walk', meta: 'Speed 5.0 km/h, incline 2%' },
      { id: 'w1', title: 'Cat-Cow', meta: '10 slow reps' },
      { id: 'w2', title: "Child's pose", meta: 'Hold 45 sec' },
      { id: 'w3', title: 'Kneeling hip flexor stretch', meta: '45 sec each side · critical for sciatica' },
      { id: 'w4', title: 'Seated piriformis stretch', meta: '45 sec each side' },
      { id: 'w5', title: 'Glute bridge', meta: '15 reps · activates dormant glutes' },
      { id: 'w6', title: 'Dead bug', meta: '8 reps each side' },
      { id: 'w7', title: 'Bird dog', meta: '8 reps each side' },
      { id: 'w8', title: 'Wall angels', meta: '10 reps' },
      { id: 'w9', title: 'R1: Bodyweight squat', meta: '12 reps' },
      { id: 'w10', title: 'R1: Incline push-up', meta: '8–10 reps' },
      { id: 'w11', title: 'R1: Reverse lunge', meta: '6 each leg · step BACK' },
      { id: 'w12', title: 'R1: Cable row (light)', meta: '12 reps · 5–10 kg' },
      { id: 'w13', title: 'R1: Plank', meta: '20 sec' },
      { id: 'w14', title: 'R2: Squat', meta: '12 reps' },
      { id: 'w15', title: 'R2: Push-up', meta: '8–10 reps' },
      { id: 'w16', title: 'R2: Lunge', meta: '6 each leg' },
      { id: 'w17', title: 'R2: Cable row', meta: '12 reps' },
      { id: 'w18', title: 'R2: Plank', meta: '25 sec' },
      { id: 'w19', title: '10 min incline walk', meta: '5.5 km/h, 5% incline' },
      { id: 'w20', title: 'Cool-down stretches', meta: 'Forward fold + figure-4' }
    ]
  },
  1: {
    name: 'Phase 1 · Build',
    weeks: '4–7',
    description: 'Light weights added. Compound movements with focus on form.',
    workout: [
      { id: 'w0', title: 'Warm-up: 8 min cardio', meta: 'Treadmill or bike' },
      { id: 'w1', title: 'Mobility flow', meta: 'Cat-cow, hip flexor, glute bridge' },
      { id: 'w2', title: 'Goblet squat', meta: '3 × 10 · light dumbbell' },
      { id: 'w3', title: 'Romanian deadlift (light)', meta: '3 × 10 · hinge, neutral spine' },
      { id: 'w4', title: 'Dumbbell bench press', meta: '3 × 10' },
      { id: 'w5', title: 'Lat pulldown', meta: '3 × 12' },
      { id: 'w6', title: 'Standing shoulder press', meta: '3 × 10 · dumbbells' },
      { id: 'w7', title: 'Standing cable row', meta: '3 × 12' },
      { id: 'w8', title: 'Plank', meta: '3 × 40 sec' },
      { id: 'w9', title: 'Dead hang', meta: '3 × 20 sec · spine decompression' },
      { id: 'w10', title: '20 min incline walk', meta: '6 km/h, 6% incline' }
    ]
  },
  2: {
    name: 'Phase 2 · Push',
    weeks: '8–12',
    description: 'Progressive overload. Heavier compounds, drop rest times.',
    workout: [
      { id: 'w0', title: 'Warm-up: 10 min cardio', meta: 'Moderate pace' },
      { id: 'w1', title: 'Full mobility routine', meta: '8 min' },
      { id: 'w2', title: 'Barbell or DB squat', meta: '4 × 8' },
      { id: 'w3', title: 'Romanian deadlift', meta: '4 × 8' },
      { id: 'w4', title: 'Incline DB press', meta: '4 × 8' },
      { id: 'w5', title: 'Pull-up or assisted', meta: '4 × 6–8' },
      { id: 'w6', title: 'Standing OHP', meta: '3 × 8' },
      { id: 'w7', title: 'DB row', meta: '3 × 10' },
      { id: 'w8', title: 'Walking lunge', meta: '3 × 10 each' },
      { id: 'w9', title: 'Core circuit', meta: 'Plank + dead bug + bird dog' },
      { id: 'w10', title: '25 min cardio', meta: 'HIIT or steady incline' }
    ]
  }
};

const NUTRITION_PLAN = [
  { id: 'n1', title: 'Breakfast', meta: '3 eggs + 2 whites scrambled · multigrain toast · ½ avocado · black coffee' },
  { id: 'n2', title: 'Mid-morning', meta: 'Greek yogurt + walnuts + small apple' },
  { id: 'n3', title: 'Lunch', meta: '150g grilled chicken/fish · 1 chapati or ½ cup brown rice · large salad' },
  { id: 'n4', title: 'Pre-workout', meta: '1 banana + black coffee · 30–45 min before gym' },
  { id: 'n5', title: 'Post-workout', meta: '1 scoop whey + water OR Greek yogurt + walnuts' },
  { id: 'n6', title: 'Dinner', meta: '150g grilled fish/chicken · roasted veg · no rice if had at lunch' }
];

const HABITS_PLAN = [
  { id: 'h1', title: 'Morning weight (Mondays)', meta: 'Same time, before food' },
  { id: 'h5', title: 'No soft drinks, juice, or fried food', meta: 'Liver-critical' },
  { id: 'h6', title: 'Morning mobility (10 min)', meta: 'Hip flexor + glute bridge + dead bug' },
  { id: 'h7', title: '7+ hours sleep target', meta: '' },
  { id: 'h8', title: '7,000+ steps', meta: 'Walking helps liver fat reduction' }
];

const YOUTUBE_SEARCHES = [
  'cat cow stretch beginner',
  'kneeling hip flexor stretch sciatica',
  'seated piriformis stretch',
  'glute bridge proper form',
  'dead bug exercise tutorial',
  'bird dog exercise tutorial',
  'wall angels posture',
  'bodyweight squat form',
  'incline push up beginner',
  'reverse lunge tutorial',
  'cable row standing',
  'dumbbell romanian deadlift',
  'lat pulldown proper form',
  'goblet squat tutorial',
  'Bob and Brad sciatica stretches'
];

// ===== STATE MANAGEMENT =====
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

function dateKey(d) {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
}

function dayNumber(d) {
  const start = new Date(START_DATE);
  start.setHours(0, 0, 0, 0);
  const diff = Math.round((d - start) / 86400000);
  return Math.max(1, diff + 1);
}

function getPhaseForDay(dayNum) {
  if (dayNum <= 21) return 0;
  if (dayNum <= 49) return 1;
  return 2;
}

function loadDay(d) {
  const key = `fit:${dateKey(d)}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDay(d, state) {
  const key = `fit:${dateKey(d)}`;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Save failed', e);
  }
}

function getDefaultState() {
  return {
    weight: null,
    sleep: null,
    energy: 5,
    mood: 5,
    sciatica: 0,
    water: 0,
    tasks: {},
    notes: ''
  };
}

let state = loadDay(currentDate) || getDefaultState();

// ===== RENDERING =====
function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function render() {
  const dayNum = dayNumber(currentDate);
  const phase = getPhaseForDay(dayNum);
  const phaseData = PHASES[phase];

  // Header
  document.getElementById('day-title').textContent = `Day ${dayNum}`;
  document.getElementById('day-subtitle').textContent = formatDate(currentDate);
  document.getElementById('phase-pill').textContent = phaseData.name;

  // Stats
  document.getElementById('weight-input').value = state.weight || '';
  document.getElementById('sleep-input').value = state.sleep || '';

  // Sliders
  document.getElementById('energy-slider').value = state.energy;
  document.getElementById('energy-value').textContent = state.energy;
  document.getElementById('mood-slider').value = state.mood;
  document.getElementById('mood-value').textContent = state.mood;
  document.getElementById('sciatica-slider').value = state.sciatica;
  const sciaticaEl = document.getElementById('sciatica-value');
  sciaticaEl.textContent = state.sciatica;
  sciaticaEl.className = 'slider-value sciatica-value' +
    (state.sciatica >= 7 ? ' high' : state.sciatica >= 4 ? ' medium' : '');

  // Water
  renderWater();

  // Notes
  document.getElementById('notes-input').value = state.notes;

  // Tasks
  renderTaskList('nutrition-list', NUTRITION_PLAN, 'nutrition-meta');
  renderTaskList('workout-list', phaseData.workout, 'workout-meta');
  renderTaskList('habits-list', HABITS_PLAN, 'habits-meta');

  // Progress
  updateProgress();

  // Streak
  updateStreak();
}

function renderTaskList(containerId, items, metaId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  let done = 0;
  items.forEach(item => {
    const isDone = !!state.tasks[item.id];
    if (isDone) done++;
    const row = document.createElement('div');
    row.className = 'task-item' + (isDone ? ' done' : '');
    row.innerHTML = `
      <div class="task-checkbox"></div>
      <div class="task-content">
        <div class="task-title"></div>
        <div class="task-meta"></div>
      </div>
    `;
    row.querySelector('.task-title').textContent = item.title;
    row.querySelector('.task-meta').textContent = item.meta;
    row.addEventListener('click', () => {
      state.tasks[item.id] = !state.tasks[item.id];
      saveDay(currentDate, state);
      render();
    });
    container.appendChild(row);
  });
  if (metaId) {
    document.getElementById(metaId).textContent = `${done}/${items.length}`;
  }
}

function renderWater() {
  const grid = document.getElementById('water-grid');
  grid.innerHTML = '';
  for (let i = 1; i <= 14; i++) {
    const cup = document.createElement('div');
    cup.className = 'water-cup' + (i <= state.water ? ' filled' : '');
    cup.textContent = i;
    cup.addEventListener('click', () => {
      state.water = state.water === i ? i - 1 : i;
      saveDay(currentDate, state);
      render();
    });
    grid.appendChild(cup);
  }
  const liters = (state.water * 0.25).toFixed(2).replace(/\.?0+$/, '');
  document.getElementById('water-meta').textContent = `${liters} / 3.5 L`;
}

function updateProgress() {
  const dayNum = dayNumber(currentDate);
  const phase = getPhaseForDay(dayNum);
  const allTasks = [
    ...NUTRITION_PLAN,
    ...PHASES[phase].workout,
    ...HABITS_PLAN
  ];
  const totalAll = allTasks.length + 14; // +14 for water cups
  const doneAll = allTasks.filter(t => state.tasks[t.id]).length + state.water;
  const pct = Math.round((doneAll / totalAll) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = pct + '%';
}

function updateStreak() {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (!s) break;
    const taskCount = Object.values(s.tasks || {}).filter(Boolean).length;
    if (taskCount < 5 && s.water < 4) break;
    streak++;
  }
  document.getElementById('streak-display').textContent = streak;
}

// ===== HISTORY TAB =====
function renderHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let anyData = false;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (!s) continue;
    anyData = true;
    const dayNum = dayNumber(d);
    const phase = getPhaseForDay(dayNum);
    const allTasks = [...NUTRITION_PLAN, ...PHASES[phase].workout, ...HABITS_PLAN];
    const totalAll = allTasks.length + 14;
    const doneAll = allTasks.filter(t => s.tasks && s.tasks[t.id]).length + (s.water || 0);
    const pct = Math.round((doneAll / totalAll) * 100);
    const row = document.createElement('div');
    row.className = 'history-day';
    row.innerHTML = `
      <div class="history-date">${formatDate(d)}</div>
      <div class="history-bar"><div class="history-bar-fill" style="width: ${pct}%"></div></div>
      <div class="history-pct">${pct}%</div>
    `;
    row.addEventListener('click', () => {
      currentDate = d;
      state = loadDay(currentDate) || getDefaultState();
      switchTab('today');
      render();
    });
    list.appendChild(row);
  }
  if (!anyData) {
    list.innerHTML = '<div class="empty-state">No history yet. Complete a day to see it here.</div>';
  }
  renderWeightChart();
}

function renderWeightChart() {
  const canvas = document.getElementById('weight-chart');
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 320;
  ctx.scale(1, 1);
  ctx.clearRect(0, 0, w, h);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const points = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (s && s.weight) points.push({ date: d, weight: s.weight });
  }

  if (points.length < 2) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px -apple-system, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Log weight on 2+ days to see chart', w / 2, h / 2);
    document.getElementById('weight-summary').textContent = '';
    return;
  }

  const weights = points.map(p => p.weight);
  const minW = Math.min(...weights, TARGET_WEIGHT) - 0.5;
  const maxW = Math.max(...weights, START_WEIGHT) + 0.5;
  const padding = 60;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  // Grid
  ctx.strokeStyle = '#2a2a3a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
    const val = (maxW - ((maxW - minW) / 4) * i).toFixed(1);
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px -apple-system, system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(val, padding - 10, y + 7);
  }

  // Target line
  const targetY = padding + chartH - ((TARGET_WEIGHT - minW) / (maxW - minW)) * chartH;
  ctx.strokeStyle = '#10b981';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, targetY);
  ctx.lineTo(w - padding, targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.font = '18px -apple-system, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Target', padding + 4, targetY - 6);

  // Plot points
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - ((p.weight - minW) / (maxW - minW)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - ((p.weight - minW) / (maxW - minW)) * chartH;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const latest = points[points.length - 1].weight;
  const first = points[0].weight;
  const diff = latest - first;
  const sign = diff > 0 ? '+' : '';
  document.getElementById('weight-summary').textContent =
    `Latest: ${latest.toFixed(1)} kg · Change: ${sign}${diff.toFixed(1)} kg · To go: ${(latest - TARGET_WEIGHT).toFixed(1)} kg`;
}

// ===== PLAN TAB =====
function renderPlan() {
  // Phase info
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNum = dayNumber(today);
  const phase = getPhaseForDay(dayNum);
  const phaseData = PHASES[phase];
  document.getElementById('phase-info').innerHTML = `
    <div class="phase-current">${phaseData.name}</div>
    <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 8px;">Weeks ${phaseData.weeks} · Day ${dayNum} of 87</div>
    <div>${phaseData.description}</div>
  `;

  // Goal progress
  const start = new Date(START_DATE);
  const target = new Date(TARGET_DATE);
  const total = Math.round((target - start) / 86400000);
  const elapsed = Math.round((today - start) / 86400000);
  const remaining = total - elapsed;
  document.getElementById('goal-progress').innerHTML =
    `<strong>${remaining} days remaining</strong> to target date`;

  // YouTube terms
  const container = document.getElementById('youtube-terms');
  container.innerHTML = '';
  YOUTUBE_SEARCHES.forEach(term => {
    const a = document.createElement('a');
    a.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(term);
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'youtube-term';
    a.textContent = term;
    container.appendChild(a);
  });
}

// ===== SUMMARY GENERATION =====
function generateDailySummary() {
  const dayNum = dayNumber(currentDate);
  const phase = getPhaseForDay(dayNum);
  const phaseData = PHASES[phase];

  const nutritionDone = NUTRITION_PLAN.filter(t => state.tasks[t.id]);
  const nutritionMissed = NUTRITION_PLAN.filter(t => !state.tasks[t.id]);
  const workoutDone = phaseData.workout.filter(t => state.tasks[t.id]);
  const workoutMissed = phaseData.workout.filter(t => !state.tasks[t.id]);
  const habitsDone = HABITS_PLAN.filter(t => state.tasks[t.id]);
  const habitsMissed = HABITS_PLAN.filter(t => !state.tasks[t.id]);

  const liters = (state.water * 0.25).toFixed(2).replace(/\.?0+$/, '');

  let summary = `Day ${dayNum} log (${formatDate(currentDate)}):\n\n`;
  summary += `STATS\n`;
  summary += `- Weight: ${state.weight ? state.weight + ' kg' : 'not logged'}\n`;
  summary += `- Sleep: ${state.sleep ? state.sleep + ' hrs' : 'not logged'}\n`;
  summary += `- Energy: ${state.energy}/10\n`;
  summary += `- Mood: ${state.mood}/10\n`;
  summary += `- Sciatica: ${state.sciatica}/10\n\n`;
  summary += `WATER: ${liters}L / 3.5L target\n\n`;
  summary += `NUTRITION (${nutritionDone.length}/${NUTRITION_PLAN.length} meals)\n`;
  summary += `- Eaten: ${nutritionDone.map(t => t.title).join(', ') || 'none'}\n`;
  if (nutritionMissed.length) summary += `- Missed: ${nutritionMissed.map(t => t.title).join(', ')}\n`;
  summary += `\nWORKOUT (${workoutDone.length}/${phaseData.workout.length} exercises) · ${phaseData.name}\n`;
  if (workoutDone.length === phaseData.workout.length) {
    summary += `- Completed full session\n`;
  } else if (workoutDone.length === 0) {
    summary += `- Did not work out\n`;
  } else {
    summary += `- Partial: did ${workoutDone.length} of ${phaseData.workout.length} exercises\n`;
    summary += `- Skipped: ${workoutMissed.map(t => t.title).join(', ')}\n`;
  }
  summary += `\nHABITS (${habitsDone.length}/${HABITS_PLAN.length})\n`;
  if (habitsMissed.length) summary += `- Missed: ${habitsMissed.map(t => t.title).join(', ')}\n`;
  if (state.notes) summary += `\nNOTES\n${state.notes}\n`;
  summary += `\nPlease give me my daily summary (wins, struggles, patterns) and tomorrow's specific plan.`;

  return summary;
}

function generateWeeklySummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (s) days.push({ date: d, state: s });
  }

  if (days.length === 0) {
    return 'No data logged in the last 7 days.';
  }

  let summary = `Weekly review — last ${days.length} days:\n\n`;

  // Weight trend
  const weights = days.filter(d => d.state.weight).map(d => d.state.weight);
  if (weights.length >= 2) {
    const change = weights[weights.length - 1] - weights[0];
    summary += `WEIGHT: ${weights[0]} → ${weights[weights.length - 1]} kg (${change >= 0 ? '+' : ''}${change.toFixed(1)} kg)\n\n`;
  } else if (weights.length === 1) {
    summary += `WEIGHT: ${weights[0]} kg (only 1 day logged)\n\n`;
  }

  // Aggregate stats
  const sleeps = days.filter(d => d.state.sleep).map(d => d.state.sleep);
  const energies = days.map(d => d.state.energy);
  const moods = days.map(d => d.state.mood);
  const sciaticas = days.map(d => d.state.sciatica);
  const waters = days.map(d => (d.state.water * 0.25));

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—';

  summary += `AVERAGES\n`;
  summary += `- Sleep: ${avg(sleeps)} hrs\n`;
  summary += `- Energy: ${avg(energies)}/10\n`;
  summary += `- Mood: ${avg(moods)}/10\n`;
  summary += `- Sciatica: ${avg(sciaticas)}/10\n`;
  summary += `- Water: ${avg(waters)}L/day\n\n`;

  // Adherence
  summary += `DAILY ADHERENCE\n`;
  days.forEach(d => {
    const dayNum = dayNumber(d.date);
    const phase = getPhaseForDay(dayNum);
    const allTasks = [...NUTRITION_PLAN, ...PHASES[phase].workout, ...HABITS_PLAN];
    const doneCount = allTasks.filter(t => d.state.tasks && d.state.tasks[t.id]).length;
    const pct = Math.round((doneCount / allTasks.length) * 100);
    summary += `- ${formatDate(d.date)}: ${pct}% (workout: ${PHASES[phase].workout.filter(t => d.state.tasks && d.state.tasks[t.id]).length}/${PHASES[phase].workout.length})\n`;
  });

  // Notes
  const allNotes = days.filter(d => d.state.notes).map(d => `${formatDate(d.date)}: ${d.state.notes}`);
  if (allNotes.length) {
    summary += `\nNOTES THIS WEEK\n${allNotes.join('\n')}\n`;
  }

  summary += `\nPlease give me my weekly deep-dive: trends, what's working, what's not, adjustments for next week, and whether I'm on track for Aug 20.`;
  return summary;
}

// ===== ACTIONS =====
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied! Paste in Claude chat'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Copied! Paste in Claude chat');
    } catch {
      showToast('Could not copy — long-press to copy manually');
    }
    document.body.removeChild(ta);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'history') renderHistory();
  if (tab === 'plan') renderPlan();
  window.scrollTo(0, 0);
}

// ===== EVENT LISTENERS =====
document.getElementById('prev-day-btn').addEventListener('click', () => {
  currentDate = new Date(currentDate.getTime() - 86400000);
  state = loadDay(currentDate) || getDefaultState();
  render();
});

document.getElementById('next-day-btn').addEventListener('click', () => {
  currentDate = new Date(currentDate.getTime() + 86400000);
  state = loadDay(currentDate) || getDefaultState();
  render();
});

document.getElementById('weight-input').addEventListener('input', (e) => {
  state.weight = parseFloat(e.target.value) || null;
  saveDay(currentDate, state);
});

document.getElementById('sleep-input').addEventListener('input', (e) => {
  state.sleep = parseFloat(e.target.value) || null;
  saveDay(currentDate, state);
});

document.getElementById('energy-slider').addEventListener('input', (e) => {
  state.energy = parseInt(e.target.value);
  document.getElementById('energy-value').textContent = state.energy;
  saveDay(currentDate, state);
});

document.getElementById('mood-slider').addEventListener('input', (e) => {
  state.mood = parseInt(e.target.value);
  document.getElementById('mood-value').textContent = state.mood;
  saveDay(currentDate, state);
});

document.getElementById('sciatica-slider').addEventListener('input', (e) => {
  state.sciatica = parseInt(e.target.value);
  const el = document.getElementById('sciatica-value');
  el.textContent = state.sciatica;
  el.className = 'slider-value sciatica-value' +
    (state.sciatica >= 7 ? ' high' : state.sciatica >= 4 ? ' medium' : '');
  saveDay(currentDate, state);
});

document.getElementById('notes-input').addEventListener('input', (e) => {
  state.notes = e.target.value;
  clearTimeout(window._notesSaveTimer);
  window._notesSaveTimer = setTimeout(() => saveDay(currentDate, state), 400);
});

document.getElementById('copy-summary-btn').addEventListener('click', () => {
  copyToClipboard(generateDailySummary());
});

document.getElementById('copy-weekly-btn').addEventListener('click', () => {
  copyToClipboard(generateWeeklySummary());
});

document.getElementById('reset-day-btn').addEventListener('click', () => {
  if (confirm('Reset all data for this day?')) {
    state = getDefaultState();
    saveDay(currentDate, state);
    render();
  }
});

document.getElementById('export-btn').addEventListener('click', () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fit:')) {
      data[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitness-tracker-${dateKey(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data exported');
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ===== INIT =====
PinLock.init().then(unlocked => {
  if (unlocked) render();
});

// Service worker for offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
