/* ==================
   FIT TRACKER v5 — APP LOGIC
   ================== */

// ============================================
// PIN LOCK
// ============================================
const PIN_KEY = 'fit:pin';
const PIN_SESSION_KEY = 'fit:unlocked';
const SESSION_DURATION = 1000 * 60 * 60 * 4; // 4 hours

const PinLock = {
  buffer: '',
  mode: 'verify',
  firstPin: '',

  async hash(pin) {
    const enc = new TextEncoder();
    const data = enc.encode(pin + ':fit-tracker-salt-2026');
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  hasPin() { return !!localStorage.getItem(PIN_KEY); },

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
      this.updateUI('Set a PIN', 'Choose 4 digits');
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
    if (this.buffer.length === 4) setTimeout(() => this.submit(), 150);
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
    document.getElementById('pin-error').textContent = msg;
    document.getElementById('pin-dots').classList.add('shake');
    setTimeout(() => document.getElementById('pin-dots').classList.remove('shake'), 400);
  },

  clearError() { document.getElementById('pin-error').textContent = ''; },

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
        this.showError("PINs don't match");
        this.mode = 'setup';
        this.firstPin = '';
        setTimeout(() => this.updateUI('Set a PIN', 'Choose 4 digits'), 600);
      }
    } else if (this.mode === 'verify') {
      const hashed = await this.hash(this.buffer);
      if (hashed === localStorage.getItem(PIN_KEY)) {
        this.unlock();
      } else {
        this.showError('Wrong PIN');
        setTimeout(() => { this.buffer = ''; this.renderDots(); }, 400);
      }
    }
  },

  unlock() {
    this.markUnlocked();
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  },

  resetApp() {
    if (!confirm('This deletes your PIN and ALL tracking data. Continue?')) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('fit:') || k.startsWith('meal-override:') || k === PIN_KEY)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    location.reload();
  }
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && PinLock.hasPin() && !PinLock.isUnlocked()) {
    location.reload();
  }
});

// ============================================
// STATE
// ============================================
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
let state = null;

function getDefaultState() {
  return {
    weight: null, sleep: null, caffeine: null,
    energy: 5, mood: 5, sciatica: 0,
    water: 0, tasks: {}, notes: '', symptoms: '',
    dayType: 'normal',  // normal | class | festive | rest
    workoutOverride: null,  // override default workout
    classChoice: null  // which class if dayType=class
  };
}

function loadDay(d) {
  try {
    const raw = localStorage.getItem(`fit:${dateKey(d)}`);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    // Backwards-compat: merge with defaults so missing v5 fields don't break the UI
    return { ...getDefaultState(), ...stored };
  } catch { return null; }
}

function saveDay(d, s) {
  try { localStorage.setItem(`fit:${dateKey(d)}`, JSON.stringify(s)); }
  catch (e) { console.error(e); }
}

// ============================================
// MEAL HELPERS
// ============================================
function getMealForSlot(slot, date) {
  const options = MEAL_LIBRARY[slot];
  const overrideKey = `meal-override:${dateKey(date)}:${slot}`;
  const override = localStorage.getItem(overrideKey);
  if (override) {
    const found = options.find(o => o.id === override);
    if (found) return found;
  }
  return options[date.getDay() % options.length];
}

function setMealOverride(slot, date, mealId) {
  localStorage.setItem(`meal-override:${dateKey(date)}:${slot}`, mealId);
}

function getNutritionPlan(date) {
  return [
    { id: 'n1', slot: 'breakfast', title: 'Breakfast', meal: getMealForSlot('breakfast', date) },
    { id: 'n2', slot: 'midmorning', title: 'Mid-morning', meal: getMealForSlot('midmorning', date) },
    { id: 'n3', slot: 'lunch', title: 'Lunch', meal: getMealForSlot('lunch', date) },
    { id: 'n4', slot: 'preworkout', title: 'Pre-workout', meal: getMealForSlot('preworkout', date) },
    { id: 'n5', slot: 'postworkout', title: 'Post-workout', meal: getMealForSlot('postworkout', date) },
    { id: 'n6', slot: 'dinner', title: 'Dinner', meal: getMealForSlot('dinner', date) }
  ];
}

// ============================================
// WORKOUT HELPERS
// ============================================
function getWorkoutForDate(date) {
  const s = loadDay(date);
  if (s && s.workoutOverride) return WORKOUT_SPLITS[s.workoutOverride];
  if (s && s.dayType === 'class') return WORKOUT_SPLITS.class;
  if (s && s.dayType === 'rest') return WORKOUT_SPLITS.rest;
  if (s && s.dayType === 'festive') return WORKOUT_SPLITS.rest;
  return WORKOUT_SPLITS[getDefaultWorkoutForDate(date)];
}

function getWorkoutTasks(workout) {
  if (!workout || !workout.exercises) return [];
  return workout.exercises.map(exId => {
    const ex = EXERCISES[exId];
    return { id: `w_${exId}`, exerciseId: exId, title: ex ? ex.name : exId, meta: ex ? ex.cue : '', svg: ex ? ex.svg : '', video: ex ? ex.video : null };
  });
}

// ============================================
// RENDERING
// ============================================
function render() {
  const dayNum = dayNumber(currentDate);
  const phase = getCurrentPhase(currentDate);

  document.getElementById('day-title').textContent = `Day ${dayNum}`;
  document.getElementById('day-subtitle').textContent = formatDate(currentDate);

  // Day type buttons
  document.querySelectorAll('.daytype-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === (state.dayType || 'normal'));
  });

  // Stats
  document.getElementById('weight-input').value = state.weight || '';
  document.getElementById('sleep-input').value = state.sleep || '';
  document.getElementById('caffeine-input').value = state.caffeine || '';

  // Sliders
  document.getElementById('energy-slider').value = state.energy;
  document.getElementById('energy-value').textContent = state.energy;
  document.getElementById('mood-slider').value = state.mood;
  document.getElementById('mood-value').textContent = state.mood;
  document.getElementById('sciatica-slider').value = state.sciatica;
  const sci = document.getElementById('sciatica-value');
  sci.textContent = state.sciatica;
  sci.className = 'slider-value sciatica-value' + (state.sciatica >= 7 ? ' high' : state.sciatica >= 4 ? ' medium' : '');

  // Notes
  document.getElementById('notes-input').value = state.notes || '';
  document.getElementById('symptom-input').value = state.symptoms || '';

  renderWater();
  renderWorkout();
  renderNutrition();
  renderHabits();
  updateProgress();
  updateStreak();
  renderDashboard();

  // Why
  const why = localStorage.getItem('fit:why');
  document.getElementById('why-text').textContent = why || 'Tap to set your reason';
}

function renderWater() {
  const grid = document.getElementById('water-grid');
  grid.innerHTML = '';
  for (let i = 1; i <= WATER_CUPS; i++) {
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
  document.getElementById('water-meta').textContent = `${liters} / ${TARGET_WATER_L} L`;
}

function renderWorkout() {
  const workout = getWorkoutForDate(currentDate);
  document.getElementById('workout-type-display').textContent = `${workout.icon} ${workout.name}`;
  document.getElementById('workout-focus').textContent = workout.focus || '';

  const list = document.getElementById('workout-list');
  list.innerHTML = '';

  // Class day - show class picker if no choice yet
  const classOptionsDiv = document.getElementById('class-options');
  if (workout.id === 'class') {
    classOptionsDiv.classList.remove('hidden');
    const optList = document.getElementById('class-options-list');
    optList.innerHTML = '';
    workout.classOptions.forEach(className => {
      const btn = document.createElement('button');
      btn.className = 'class-option-btn' + (state.classChoice === className ? ' selected' : '');
      btn.textContent = className;
      btn.addEventListener('click', () => {
        state.classChoice = className;
        if (!state.tasks['class_attended']) state.tasks['class_attended'] = false;
        saveDay(currentDate, state);
        render();
      });
      optList.appendChild(btn);
    });
    if (state.classChoice) {
      const row = createTaskRow({ id: 'class_attended', title: `Class: ${state.classChoice}`, meta: '45 min instructor-led', svg: '', video: state.classChoice.toLowerCase() + ' fitness class' });
      list.appendChild(row);
    }
    document.getElementById('workout-meta').textContent = state.classChoice ? (state.tasks['class_attended'] ? '✓ Done' : 'Pending') : 'Pick class';
    return;
  } else {
    classOptionsDiv.classList.add('hidden');
  }

  const tasks = getWorkoutTasks(workout);
  let done = 0;
  tasks.forEach(item => {
    if (state.tasks[item.id]) done++;
    const row = createTaskRow(item);
    list.appendChild(row);
  });
  document.getElementById('workout-meta').textContent = tasks.length ? `${done}/${tasks.length}` : '';
}

function createTaskRow(item) {
  const isDone = !!state.tasks[item.id];
  const row = document.createElement('div');
  row.className = 'task-item' + (isDone ? ' done' : '');

  const checkbox = document.createElement('div');
  checkbox.className = 'task-checkbox';
  row.appendChild(checkbox);

  const content = document.createElement('div');
  content.className = 'task-content';
  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = item.title;
  content.appendChild(title);
  if (item.meta) {
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = item.meta;
    content.appendChild(meta);
  }
  row.appendChild(content);

  // SVG diagram preview if available
  if (item.svg) {
    const svgWrap = document.createElement('button');
    svgWrap.className = 'task-svg-btn';
    svgWrap.setAttribute('aria-label', 'View diagram');
    svgWrap.innerHTML = item.svg;
    svgWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      openExerciseModal(item);
    });
    row.appendChild(svgWrap);
  }

  if (item.video) {
    const videoBtn = document.createElement('button');
    videoBtn.className = 'task-video-btn';
    videoBtn.innerHTML = '▶';
    videoBtn.setAttribute('aria-label', 'Watch video');
    videoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(item.video), '_blank', 'noopener');
    });
    row.appendChild(videoBtn);
  }

  row.addEventListener('click', () => {
    state.tasks[item.id] = !state.tasks[item.id];
    saveDay(currentDate, state);
    render();
  });
  return row;
}

function openExerciseModal(item) {
  document.getElementById('exercise-modal-title').textContent = item.title;
  const body = document.getElementById('exercise-modal-body');
  body.innerHTML = `
    <div class="exercise-modal-svg">${item.svg}</div>
    <p class="exercise-modal-cue">${item.meta}</p>
    ${item.video ? `<button class="btn btn-primary" onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(item.video)}','_blank','noopener')">▶ Watch on YouTube</button>` : ''}
  `;
  document.getElementById('exercise-modal').classList.remove('hidden');
}

function closeExerciseModal() {
  document.getElementById('exercise-modal').classList.add('hidden');
}

function renderNutrition() {
  const items = getNutritionPlan(currentDate);
  const list = document.getElementById('nutrition-list');
  list.innerHTML = '';
  let done = 0, totalKcal = 0, totalP = 0, totalC = 0, totalF = 0;

  items.forEach(item => {
    const isDone = !!state.tasks[item.id];
    if (isDone) done++;
    totalKcal += item.meal.kcal;
    totalP += item.meal.protein || 0;
    totalC += item.meal.carbs || 0;
    totalF += item.meal.fat || 0;

    const row = document.createElement('div');
    row.className = 'task-item meal-item' + (isDone ? ' done' : '');

    const checkbox = document.createElement('div');
    checkbox.className = 'task-checkbox';
    row.appendChild(checkbox);

    const content = document.createElement('div');
    content.className = 'task-content';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'task-title meal-eyebrow';
    eyebrow.textContent = `${item.title} · ${item.meal.cuisine} · ${item.meal.kcal} kcal`;
    content.appendChild(eyebrow);

    const name = document.createElement('div');
    name.className = 'meal-name';
    name.textContent = item.meal.name;
    content.appendChild(name);

    const detail = document.createElement('div');
    detail.className = 'task-meta';
    detail.textContent = item.meal.detail;
    content.appendChild(detail);

    const macros = document.createElement('div');
    macros.className = 'meal-macros';
    macros.innerHTML = `<span>P ${item.meal.protein}g</span><span>C ${item.meal.carbs}g</span><span>F ${item.meal.fat}g</span>`;
    content.appendChild(macros);

    row.appendChild(content);

    const swapBtn = document.createElement('button');
    swapBtn.className = 'task-video-btn meal-swap-btn';
    swapBtn.innerHTML = '⇆';
    swapBtn.setAttribute('aria-label', 'Swap meal');
    swapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMealSwap(item.slot, item.meal.id);
    });
    row.appendChild(swapBtn);

    row.addEventListener('click', () => {
      state.tasks[item.id] = !state.tasks[item.id];
      saveDay(currentDate, state);
      render();
    });
    list.appendChild(row);
  });

  document.getElementById('nutrition-meta').textContent = `${done}/${items.length}`;
  document.getElementById('macros-footer').innerHTML = `<strong>${totalKcal}</strong> kcal · <strong>${totalP}g</strong> protein · <strong>${totalC}g</strong> carbs · <strong>${totalF}g</strong> fat · Target ${TARGET_CALORIES}/${TARGET_PROTEIN}g`;
}

function openMealSwap(slot, currentMealId) {
  const options = MEAL_LIBRARY[slot];
  const modal = document.getElementById('meal-swap-modal');
  document.getElementById('meal-swap-title').textContent = `Swap ${slot.charAt(0).toUpperCase() + slot.slice(1)}`;
  const list = document.getElementById('meal-swap-list');
  list.innerHTML = '';
  options.forEach(opt => {
    const row = document.createElement('div');
    row.className = 'meal-swap-option' + (opt.id === currentMealId ? ' selected' : '');
    row.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">${opt.cuisine} ${opt.name}</span>
        <span class="meal-swap-kcal">${opt.kcal} kcal</span>
      </div>
      <div class="meal-swap-detail">${opt.detail}</div>
      <div class="meal-macros"><span>P ${opt.protein}g</span><span>C ${opt.carbs}g</span><span>F ${opt.fat}g</span></div>
    `;
    row.addEventListener('click', () => {
      setMealOverride(slot, currentDate, opt.id);
      closeMealSwap();
      render();
      showToast('Meal swapped');
    });
    list.appendChild(row);
  });
  modal.classList.remove('hidden');
}

function closeMealSwap() {
  document.getElementById('meal-swap-modal').classList.add('hidden');
}

function renderHabits() {
  const list = document.getElementById('habits-list');
  list.innerHTML = '';
  let done = 0;
  HABITS_PLAN.forEach(item => {
    if (state.tasks[item.id]) done++;
    const row = createTaskRow(item);
    list.appendChild(row);
  });
  document.getElementById('habits-meta').textContent = `${done}/${HABITS_PLAN.length}`;
}

// ============================================
// PROGRESS & STREAK
// ============================================
function getAllTasksForDate(d, s) {
  const workout = getWorkoutForDate(d);
  const workoutTasks = workout.id === 'class' ? (s.classChoice ? [{id: 'class_attended'}] : []) : getWorkoutTasks(workout);
  return [...getNutritionPlan(d), ...workoutTasks, ...HABITS_PLAN];
}

function dayAdherencePct(d, s) {
  if (!s) return 0;
  if (s.dayType === 'festive') {
    const water = s.water || 0;
    const water_pct = Math.min(100, (water / WATER_CUPS) * 100);
    const weight_logged = s.weight ? 100 : 0;
    return Math.round((water_pct + weight_logged) / 2);
  }
  const all = getAllTasksForDate(d, s);
  const total = all.length + WATER_CUPS;
  const done = all.filter(t => s.tasks && s.tasks[t.id]).length + (s.water || 0);
  return Math.round((done / total) * 100);
}

function updateProgress() {
  const pct = dayAdherencePct(currentDate, state);
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
    // streak preserves on festive, class, or any day with activity
    if (s.dayType === 'festive' || s.dayType === 'class') {
      if ((s.water || 0) >= 4) { streak++; continue; }
      break;
    }
    const taskCount = Object.values(s.tasks || {}).filter(Boolean).length;
    if (taskCount < 5 && (s.water || 0) < 4) break;
    streak++;
  }
  const el = document.getElementById('dash-streak');
  if (el) el.textContent = streak;
}

// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
  // Phase card
  const phase = getCurrentPhase(currentDate);
  const dayNum = dayNumber(currentDate);
  document.getElementById('dash-phase-name').textContent = `${phase.name} ${phase.icon}`;
  document.getElementById('dash-phase-day').textContent = `Day ${dayNum}/87`;
  const phaseStart = phase.dayStart;
  const phaseEnd = phase.dayEnd;
  const phasePct = Math.min(100, Math.max(0, ((dayNum - phaseStart) / (phaseEnd - phaseStart + 1)) * 100));
  document.getElementById('phase-progress-fill').style.width = phasePct + '%';
  const daysToTarget = daysUntil(TARGET_DATE);
  document.getElementById('dash-phase-meta').textContent = daysToTarget > 0 ? `${daysToTarget} days to Aug 20` : `Past target date`;

  // Weight
  const latestWeight = getLatestWeight();
  document.getElementById('dash-weight').textContent = latestWeight ? `${latestWeight.toFixed(1)} kg` : '—';
  if (latestWeight) {
    const delta = latestWeight - START_WEIGHT;
    const trend = delta < 0 ? `${delta.toFixed(1)} kg` : `+${delta.toFixed(1)} kg`;
    const trendEl = document.getElementById('dash-weight-trend');
    trendEl.textContent = trend;
    trendEl.className = 'dash-trend ' + (delta < 0 ? 'trend-good' : delta > 0 ? 'trend-bad' : '');
  }
  document.getElementById('dash-togo').textContent = latestWeight ? `${(latestWeight - TARGET_WEIGHT).toFixed(1)} kg` : '—';

  // 7-day adherence avg
  document.getElementById('dash-adherence').textContent = `${calculate7DayAdherence()}%`;

  // Charts
  drawWeightChart();
  drawAdherenceBars();
  drawSleepChart();

  // Checkpoint
  renderCheckpoint();
}

function getLatestWeight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 30; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (s && s.weight) return s.weight;
  }
  return null;
}

function calculate7DayAdherence() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let sum = 0, count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (s) {
      sum += dayAdherencePct(d, s);
      count++;
    }
  }
  return count ? Math.round(sum / count) : 0;
}

function drawWeightChart() {
  const canvas = document.getElementById('weight-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 360;
  ctx.clearRect(0, 0, w, h);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const points = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    if (s && s.weight) points.push({ date: d, weight: s.weight });
  }

  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim() || '#3b82f6';
  const success = styles.getPropertyValue('--success').trim() || '#10b981';
  const grid = styles.getPropertyValue('--border').trim() || '#2a2a3a';
  const tert = styles.getPropertyValue('--text-tertiary').trim() || '#6b7280';

  if (points.length < 2) {
    ctx.fillStyle = tert;
    ctx.font = '24px -apple-system, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Log weight on 2+ days to see chart', w / 2, h / 2);
    document.getElementById('weight-summary').textContent = '';
    return;
  }

  const weights = points.map(p => p.weight);
  const minW = Math.min(...weights, TARGET_WEIGHT) - 0.5;
  const maxW = Math.max(...weights, START_WEIGHT) + 0.5;
  const padding = 70;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
    const val = (maxW - ((maxW - minW) / 4) * i).toFixed(1);
    ctx.fillStyle = tert;
    ctx.font = '20px -apple-system, system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(val, padding - 10, y + 7);
  }

  // Target line
  const targetY = padding + chartH - ((TARGET_WEIGHT - minW) / (maxW - minW)) * chartH;
  ctx.strokeStyle = success;
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, targetY);
  ctx.lineTo(w - padding, targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = success;
  ctx.font = '18px -apple-system, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Target 70kg', padding + 4, targetY - 6);

  // Plot line
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - ((p.weight - minW) / (maxW - minW)) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - ((p.weight - minW) / (maxW - minW)) * chartH;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const latest = points[points.length - 1].weight;
  const first = points[0].weight;
  const diff = latest - first;
  const sign = diff > 0 ? '+' : '';
  document.getElementById('weight-summary').textContent =
    `Latest ${latest.toFixed(1)} kg · Δ ${sign}${diff.toFixed(1)} kg in ${points.length} days · ${(latest - TARGET_WEIGHT).toFixed(1)} kg to go`;
}

function drawAdherenceBars() {
  const container = document.getElementById('adherence-bars');
  if (!container) return;
  container.innerHTML = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let any = false;
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    const row = document.createElement('div');
    row.className = 'adherence-row';
    if (!s) {
      row.innerHTML = `<div class="adh-date">${shortDate(d)}</div><div class="adh-bar"><div class="adh-fill empty"></div></div><div class="adh-pct">—</div>`;
    } else {
      any = true;
      const pct = dayAdherencePct(d, s);
      const label = s.dayType === 'festive' ? '🎉' : s.dayType === 'class' ? '🎵' : s.dayType === 'rest' ? '😌' : `${pct}%`;
      row.innerHTML = `<div class="adh-date">${shortDate(d)}</div><div class="adh-bar"><div class="adh-fill" style="width:${pct}%"></div></div><div class="adh-pct">${label}</div>`;
    }
    container.appendChild(row);
  }
  if (!any) container.innerHTML = '<div class="empty-state">Log a day to see adherence</div>';
}

function drawSleepChart() {
  const canvas = document.getElementById('sleep-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 280;
  ctx.clearRect(0, 0, w, h);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const points = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const s = loadDay(d);
    points.push({ date: d, sleep: s ? s.sleep : null, sciatica: s ? s.sciatica : null });
  }

  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim() || '#3b82f6';
  const danger = styles.getPropertyValue('--danger').trim() || '#ef4444';
  const grid = styles.getPropertyValue('--border').trim() || '#2a2a3a';
  const tert = styles.getPropertyValue('--text-tertiary').trim() || '#6b7280';

  const padding = 50;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;
  const maxSleep = 12;

  // Grid
  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  }
  ctx.fillStyle = tert;
  ctx.font = '18px -apple-system, system-ui';
  ctx.textAlign = 'right';
  ctx.fillText('12h', padding - 8, padding + 6);
  ctx.fillText('6h', padding - 8, padding + chartH / 2 + 6);
  ctx.fillText('0h', padding - 8, padding + chartH + 6);

  // Sleep bars
  const barW = chartW / points.length * 0.7;
  points.forEach((p, i) => {
    const x = padding + (i + 0.5) * (chartW / points.length) - barW / 2;
    if (p.sleep) {
      const barH = (p.sleep / maxSleep) * chartH;
      ctx.fillStyle = accent;
      ctx.fillRect(x, padding + chartH - barH, barW, barH);
    }
  });

  // Sciatica overlay line
  ctx.strokeStyle = danger;
  ctx.lineWidth = 3;
  ctx.beginPath();
  let started = false;
  points.forEach((p, i) => {
    if (p.sciatica === null || p.sciatica === undefined) return;
    const x = padding + (i + 0.5) * (chartW / points.length);
    const y = padding + chartH - (p.sciatica / 10) * chartH;
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  ctx.stroke();
  points.forEach((p, i) => {
    if (p.sciatica === null || p.sciatica === undefined) return;
    const x = padding + (i + 0.5) * (chartW / points.length);
    const y = padding + chartH - (p.sciatica / 10) * chartH;
    ctx.fillStyle = danger;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Legend
  ctx.fillStyle = accent;
  ctx.fillRect(padding, 12, 14, 14);
  ctx.fillStyle = tert;
  ctx.font = '20px -apple-system, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Sleep (hrs)', padding + 22, 25);
  ctx.fillStyle = danger;
  ctx.fillRect(padding + 180, 12, 14, 14);
  ctx.fillStyle = tert;
  ctx.fillText('Sciatica (0-10)', padding + 202, 25);
}

function renderCheckpoint() {
  const card = document.getElementById('checkpoint-card');
  if (!card) return;
  const today = new Date();
  const upcoming = CHECKPOINTS.find(c => new Date(c.date) >= today) || CHECKPOINTS[CHECKPOINTS.length - 1];
  document.getElementById('checkpoint-title').textContent = upcoming.title;
  const diff = daysUntil(upcoming.date);
  document.getElementById('checkpoint-countdown').textContent = diff > 0 ? `${diff} days away · ${upcoming.date}` : diff === 0 ? 'TODAY' : `${Math.abs(diff)} days ago`;
  const tasks = document.getElementById('checkpoint-tasks');
  tasks.innerHTML = upcoming.tasks.map(t => `<li>${t}</li>`).join('');
}

// ============================================
// MEALS TAB
// ============================================
function renderMealsTab() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list = document.getElementById('week-meals-list');
  list.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() + i * 86400000);
    const plan = getNutritionPlan(d);
    const totalKcal = plan.reduce((sum, p) => sum + p.meal.kcal, 0);
    const totalP = plan.reduce((sum, p) => sum + (p.meal.protein || 0), 0);
    const day = document.createElement('div');
    day.className = 'week-day-card';
    day.innerHTML = `
      <div class="week-day-header">
        <div>
          <div class="week-day-name">${formatDate(d)}</div>
          <div class="week-day-summary">${totalKcal} kcal · ${totalP}g protein</div>
        </div>
        <button class="link-btn">View →</button>
      </div>
    `;
    day.addEventListener('click', () => openHelperView(d));
    list.appendChild(day);
  }
}

// ============================================
// HELPER VIEW
// ============================================
function openHelperView(date) {
  const d = date || currentDate;
  const plan = getNutritionPlan(d);
  document.getElementById('helper-modal-title').textContent = `Helper handover · ${formatDate(d)}`;
  const content = document.getElementById('helper-content');
  let html = `<div class="helper-intro"><p>Meals to prepare for ${formatDate(d)}. Pack lunch in container for office.</p></div>`;
  plan.forEach(item => {
    if (!item.meal.helper || item.meal.helper === 'No prep.') return; // skip no-prep items
    html += `
      <div class="helper-meal">
        <h4>${item.title}: ${item.meal.name} ${item.meal.cuisine}</h4>
        <p class="helper-ingredients"><strong>What's in it:</strong> ${item.meal.detail}</p>
        <p class="helper-instructions"><strong>How to cook:</strong> ${item.meal.helper}</p>
        ${item.meal.video ? `<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.meal.name + ' recipe')}" target="_blank" class="link-btn">🎥 Recipe video</a>` : ''}
      </div>
    `;
  });
  // Also include no-prep items as a quick list
  const noprep = plan.filter(p => p.meal.helper === 'No prep.');
  if (noprep.length) {
    html += `<div class="helper-meal"><h4>No-prep items (assemble fresh):</h4><ul>`;
    noprep.forEach(p => html += `<li><strong>${p.title}:</strong> ${p.meal.detail}</li>`);
    html += `</ul></div>`;
  }
  content.innerHTML = html;
  document.getElementById('helper-modal').classList.remove('hidden');
}

function closeHelper() {
  document.getElementById('helper-modal').classList.add('hidden');
}

function printHelper() {
  const content = document.getElementById('helper-content').innerHTML;
  const title = document.getElementById('helper-modal-title').textContent;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body{font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:20px auto;padding:20px;color:#000}
    h1{font-size:22px;border-bottom:2px solid #000;padding-bottom:8px}
    h4{font-size:16px;margin-top:18px;margin-bottom:6px}
    p{margin:6px 0;font-size:14px;line-height:1.5}
    .helper-meal{border-bottom:1px solid #ddd;padding-bottom:12px;margin-bottom:12px}
    .link-btn{display:none}
    ul{padding-left:20px}
  </style></head><body><h1>${title}</h1>${content}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

function shareHelper() {
  const content = document.getElementById('helper-content').innerText;
  const title = document.getElementById('helper-modal-title').textContent;
  if (navigator.share) {
    navigator.share({ title: title, text: content }).catch(() => {});
  } else {
    copyToClipboard(`${title}\n\n${content}`);
  }
}

// ============================================
// GROCERY LIST
// ============================================
function openGrocery() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Aggregate ingredients across 7 days
  const ingredients = {};
  const addIng = (name, qty) => {
    ingredients[name] = (ingredients[name] || 0) + qty;
  };
  // Simple heuristic — count occurrence of meals
  const mealCounts = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() + i * 86400000);
    const plan = getNutritionPlan(d);
    plan.forEach(p => {
      mealCounts[p.meal.id] = (mealCounts[p.meal.id] || 0) + 1;
    });
  }

  // Static grocery list (curated by category) - more reliable than NLP on meal text
  const groceryList = {
    'Proteins': [
      'Chicken breast (boneless) — 1.2 kg',
      'Fish fillets (salmon/hammour) — 600g',
      'White fish for soup — 200g',
      'Lean beef strips — 200g',
      'Eggs — 1 dozen',
      'Paneer — 200g',
      'Whey protein isolate (if not on hand)',
      'Cottage cheese — 250g',
      'Tuna in water — 2 small cans'
    ],
    'Grains & Carbs': [
      'Brown rice — 500g (lasts 2 weeks)',
      'Quinoa — 250g',
      'Rolled oats — 500g',
      'Multigrain rotis — 1 pack',
      'Sweet potato — 2 medium',
      'Masoor daal — 500g',
      'Chickpeas (dried or canned) — 500g + 1 can'
    ],
    'Vegetables': [
      'Cucumbers — 6-8',
      'Tomatoes — 8-10',
      'Onions (mix) — 1 kg',
      'Bell peppers (red, green, yellow) — 5-6',
      'Zucchini — 3',
      'Broccoli — 2 heads',
      'Bok choy or Asian greens — 1 bunch',
      'Carrots — 5-6',
      'Spinach — 2 bunches',
      'Cauliflower — 1 head (for cauli rice)',
      'Mixed salad leaves — 1 large bag',
      'Garlic — 1 head',
      'Ginger — 100g',
      'Lemons — 6-8',
      'Green chilies — small pack',
      'Coriander, mint — bunches',
      'Eggplant — 2 medium'
    ],
    'Fats & Pantry': [
      'Extra virgin olive oil — 500ml',
      'Avocados — 4 ripe',
      'Walnuts (raw) — 250g',
      'Almonds (raw) — 250g',
      'Tahini — small jar',
      'Soy sauce (low sodium)',
      'Cumin, turmeric, coriander, garam masala',
      'Tandoori marinade paste'
    ],
    'Dairy': [
      'Greek yogurt — 1 kg tub',
      'Labneh — small tub',
      'Hummus — 250g',
      'Feta (optional) — 100g'
    ],
    'Fruits': [
      'Bananas — 7',
      'Apples — 6',
      'Pears — 3-4',
      'Berries — 1 box',
      'Medjool dates — small box'
    ],
    'Drinks/Misc': [
      'Coffee beans/ground — 250g',
      'Green tea — 1 box',
      'Chamomile or peppermint tea (caffeine taper)',
      'Olives — small jar',
      'Rice cakes (whole grain) — 1 pack'
    ]
  };

  let html = `<div class="grocery-intro"><p>One week's groceries (Tue–Mon). Big shop Sat/Sun, top-up Wed.</p></div>`;
  for (const cat in groceryList) {
    html += `<div class="grocery-category"><h4>${cat}</h4><ul>`;
    groceryList[cat].forEach(item => html += `<li>${item}</li>`);
    html += `</ul></div>`;
  }
  document.getElementById('grocery-content').innerHTML = html;
  document.getElementById('grocery-modal').classList.remove('hidden');
}

function closeGrocery() {
  document.getElementById('grocery-modal').classList.add('hidden');
}

function copyGrocery() {
  const text = document.getElementById('grocery-content').innerText;
  copyToClipboard(text);
  showToast('Grocery list copied');
}

// ============================================
// PLAN TAB
// ============================================
function renderPlanTab() {
  // Goal progress
  const start = new Date(START_DATE);
  const target = new Date(TARGET_DATE);
  const total = Math.round((target - start) / 86400000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const elapsed = Math.round((today - start) / 86400000);
  const remaining = total - elapsed;
  document.getElementById('goal-progress').innerHTML = `<strong>${remaining} days remaining</strong> · Day ${elapsed + 1} of ${total + 1}`;

  // Weekly schedule
  const sched = document.getElementById('weekly-schedule-list');
  sched.innerHTML = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  DEFAULT_WEEKLY_SCHEDULE.forEach((wkId, idx) => {
    const wk = WORKOUT_SPLITS[wkId];
    const row = document.createElement('div');
    row.className = 'sched-row';
    row.innerHTML = `<div class="sched-day">${dayNames[idx]}</div><div class="sched-workout">${wk.icon} ${wk.name}</div><div class="sched-focus">${wk.focus || ''}</div>`;
    sched.appendChild(row);
  });

  // Checkpoints
  const cp = document.getElementById('all-checkpoints');
  cp.innerHTML = '';
  CHECKPOINTS.forEach(c => {
    const diff = daysUntil(c.date);
    const status = diff > 0 ? `${diff} days away` : diff === 0 ? 'TODAY' : `${Math.abs(diff)} days ago`;
    const item = document.createElement('div');
    item.className = 'cp-item';
    item.innerHTML = `<div class="cp-header"><strong>${c.title}</strong><span>${status}</span></div><div class="cp-date">${c.date}</div><ul>${c.tasks.map(t => `<li>${t}</li>`).join('')}</ul>`;
    cp.appendChild(item);
  });
}

// ============================================
// SUMMARY GENERATION
// ============================================
function generateDailySummary() {
  const dayNum = dayNumber(currentDate);
  const phase = getCurrentPhase(currentDate);
  const workout = getWorkoutForDate(currentDate);
  const plan = getNutritionPlan(currentDate);

  const nutDone = plan.filter(p => state.tasks[p.id]);
  const nutMissed = plan.filter(p => !state.tasks[p.id]);

  const workoutTasks = workout.id === 'class' ? (state.classChoice ? [{id: 'class_attended', title: `Class: ${state.classChoice}`}] : []) : getWorkoutTasks(workout);
  const wDone = workoutTasks.filter(t => state.tasks[t.id]);
  const wMissed = workoutTasks.filter(t => !state.tasks[t.id]);
  const habDone = HABITS_PLAN.filter(t => state.tasks[t.id]);
  const habMissed = HABITS_PLAN.filter(t => !state.tasks[t.id]);

  const liters = (state.water * 0.25).toFixed(2).replace(/\.?0+$/, '');
  const dayTypeLabel = state.dayType === 'normal' ? '' : ` [${state.dayType.toUpperCase()} day]`;

  let s = `Day ${dayNum} log (${formatDate(currentDate)})${dayTypeLabel}:\n\n`;
  s += `STATS\n`;
  s += `- Weight: ${state.weight ? state.weight + ' kg' : 'not logged'}\n`;
  s += `- Sleep: ${state.sleep ? state.sleep + ' hrs' : 'not logged'}\n`;
  s += `- Energy: ${state.energy}/10\n- Mood: ${state.mood}/10\n- Sciatica: ${state.sciatica}/10\n`;
  if (state.caffeine !== null && state.caffeine !== '') s += `- Caffeine: ${state.caffeine} cups\n`;
  s += `\nWATER: ${liters}L / ${TARGET_WATER_L}L\n\n`;

  s += `NUTRITION (${nutDone.length}/${plan.length})\n`;
  s += `- Eaten: ${nutDone.map(t => `${t.title} (${t.meal.name})`).join(', ') || 'none'}\n`;
  if (nutMissed.length) s += `- Missed: ${nutMissed.map(t => t.title).join(', ')}\n`;

  const totalKcal = nutDone.reduce((sum, t) => sum + t.meal.kcal, 0);
  const totalP = nutDone.reduce((sum, t) => sum + (t.meal.protein || 0), 0);
  s += `- Approx eaten: ${totalKcal} kcal / ${totalP}g protein\n\n`;

  s += `WORKOUT (${wDone.length}/${workoutTasks.length}) · ${workout.icon} ${workout.name}\n`;
  if (workoutTasks.length === 0) {
    s += `- No workout (rest/festive day)\n`;
  } else if (wDone.length === workoutTasks.length) {
    s += `- Full session completed\n`;
  } else if (wDone.length === 0) {
    s += `- Did not work out\n`;
  } else {
    s += `- Partial — did ${wDone.length} of ${workoutTasks.length}\n`;
    if (wMissed.length) s += `- Skipped: ${wMissed.map(t => t.title).join(', ')}\n`;
  }
  s += `\nHABITS (${habDone.length}/${HABITS_PLAN.length})\n`;
  if (habMissed.length) s += `- Missed: ${habMissed.map(t => t.title).join(', ')}\n`;
  if (state.notes) s += `\nNOTES\n${state.notes}\n`;
  if (state.symptoms) s += `\nSYMPTOMS\n${state.symptoms}\n`;
  s += `\nPlease give me my daily summary (wins, struggles, patterns) and tomorrow's specific plan.`;
  return s;
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
  if (!days.length) return 'No data logged in the last 7 days.';

  const weights = days.filter(d => d.state.weight).map(d => d.state.weight);
  const sleeps = days.filter(d => d.state.sleep).map(d => d.state.sleep);
  const energies = days.map(d => d.state.energy);
  const moods = days.map(d => d.state.mood);
  const sciaticas = days.map(d => d.state.sciatica);
  const waters = days.map(d => (d.state.water * 0.25));
  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—';

  let s = `Weekly review — last ${days.length} days:\n\n`;
  if (weights.length >= 2) {
    s += `WEIGHT: ${weights[0]} → ${weights[weights.length - 1]} kg (Δ ${(weights[weights.length - 1] - weights[0]).toFixed(1)} kg)\n\n`;
  } else if (weights.length === 1) {
    s += `WEIGHT: ${weights[0]} kg (only 1 day logged)\n\n`;
  }
  s += `AVERAGES\n`;
  s += `- Sleep: ${avg(sleeps)} hrs\n- Energy: ${avg(energies)}/10\n- Mood: ${avg(moods)}/10\n- Sciatica: ${avg(sciaticas)}/10\n- Water: ${avg(waters)}L/day\n\n`;
  s += `DAILY ADHERENCE\n`;
  days.forEach(d => {
    const pct = dayAdherencePct(d.date, d.state);
    s += `- ${formatDate(d.date)} [${d.state.dayType || 'normal'}]: ${pct}%\n`;
  });
  const notes = days.filter(d => d.state.notes).map(d => `${formatDate(d.date)}: ${d.state.notes}`);
  if (notes.length) s += `\nNOTES\n${notes.join('\n')}\n`;
  const sympts = days.filter(d => d.state.symptoms).map(d => `${formatDate(d.date)}: ${d.state.symptoms}`);
  if (sympts.length) s += `\nSYMPTOMS\n${sympts.join('\n')}\n`;
  s += `\nPlease give me my weekly deep-dive: trends, what's working, what's not, adjustments for next week, am I on track for Aug 20.`;
  return s;
}

// ============================================
// UTILITIES
// ============================================
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied — paste in Claude chat'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Copied — paste in Claude chat'); }
    catch { showToast('Could not copy'); }
    document.body.removeChild(ta);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'meals') renderMealsTab();
  if (tab === 'plan') renderPlanTab();
  if (tab === 'dashboard') renderDashboard();
  window.scrollTo(0, 0);
}

// ============================================
// WHY / THEME
// ============================================
function openWhy() {
  document.getElementById('why-input').value = localStorage.getItem('fit:why') || '';
  document.getElementById('why-modal').classList.remove('hidden');
}

function closeWhy() {
  document.getElementById('why-modal').classList.add('hidden');
}

function saveWhy() {
  const val = document.getElementById('why-input').value.trim();
  if (val) localStorage.setItem('fit:why', val);
  else localStorage.removeItem('fit:why');
  closeWhy();
  render();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('fit:theme', next);
  // Re-draw charts with new colors
  setTimeout(() => renderDashboard(), 50);
}

function applyStoredTheme() {
  const saved = localStorage.getItem('fit:theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

// ============================================
// INIT
// ============================================
function initApp() {
  applyStoredTheme();
  state = loadDay(currentDate) || getDefaultState();
  render();
  renderMealsTab();
  renderPlanTab();
  bindAppEvents();
}

function bindAppEvents() {
  // Navigation
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
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Day type
  document.querySelectorAll('.daytype-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.dayType = btn.dataset.type;
      if (state.dayType !== 'class') state.classChoice = null;
      saveDay(currentDate, state);
      render();
    });
  });

  // Inputs
  document.getElementById('weight-input').addEventListener('input', e => {
    state.weight = parseFloat(e.target.value) || null;
    saveDay(currentDate, state);
    if (state.weight) updateProgress();
  });
  document.getElementById('weight-input').addEventListener('blur', () => renderDashboard());
  document.getElementById('sleep-input').addEventListener('input', e => {
    state.sleep = parseFloat(e.target.value) || null;
    saveDay(currentDate, state);
  });
  document.getElementById('caffeine-input').addEventListener('input', e => {
    state.caffeine = parseInt(e.target.value) || null;
    saveDay(currentDate, state);
  });

  // Sliders
  document.getElementById('energy-slider').addEventListener('input', e => {
    state.energy = parseInt(e.target.value);
    document.getElementById('energy-value').textContent = state.energy;
    saveDay(currentDate, state);
  });
  document.getElementById('mood-slider').addEventListener('input', e => {
    state.mood = parseInt(e.target.value);
    document.getElementById('mood-value').textContent = state.mood;
    saveDay(currentDate, state);
  });
  document.getElementById('sciatica-slider').addEventListener('input', e => {
    state.sciatica = parseInt(e.target.value);
    const el = document.getElementById('sciatica-value');
    el.textContent = state.sciatica;
    el.className = 'slider-value sciatica-value' + (state.sciatica >= 7 ? ' high' : state.sciatica >= 4 ? ' medium' : '');
    saveDay(currentDate, state);
  });

  // Notes
  document.getElementById('notes-input').addEventListener('input', e => {
    state.notes = e.target.value;
    clearTimeout(window._notesTimer);
    window._notesTimer = setTimeout(() => saveDay(currentDate, state), 400);
  });
  document.getElementById('symptom-input').addEventListener('input', e => {
    state.symptoms = e.target.value;
    clearTimeout(window._symTimer);
    window._symTimer = setTimeout(() => saveDay(currentDate, state), 400);
  });

  // Change workout button
  document.getElementById('change-workout-btn').addEventListener('click', () => {
    const modal = document.getElementById('workout-swap-modal');
    const list = document.getElementById('workout-swap-list');
    list.innerHTML = '';
    Object.values(WORKOUT_SPLITS).forEach(wk => {
      const btn = document.createElement('div');
      btn.className = 'meal-swap-option';
      btn.innerHTML = `<div class="meal-swap-header"><span class="meal-swap-name">${wk.icon} ${wk.name}</span></div><div class="meal-swap-detail">${wk.focus || ''}</div>`;
      btn.addEventListener('click', () => {
        state.workoutOverride = wk.id;
        if (wk.id !== 'class') state.classChoice = null;
        saveDay(currentDate, state);
        closeWorkoutSwap();
        render();
        showToast('Workout changed');
      });
      list.appendChild(btn);
    });
    modal.classList.remove('hidden');
  });

  // Copy buttons
  document.getElementById('copy-summary-btn').addEventListener('click', () => copyToClipboard(generateDailySummary()));
  document.getElementById('weekly-summary-btn').addEventListener('click', () => copyToClipboard(generateWeeklySummary()));

  // Reset
  document.getElementById('reset-day-btn').addEventListener('click', () => {
    if (confirm('Reset all data for this day?')) {
      state = getDefaultState();
      saveDay(currentDate, state);
      render();
    }
  });

  // Export
  document.getElementById('export-btn').addEventListener('click', () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('fit:') || k.startsWith('meal-override:'))) {
        try { data[k] = JSON.parse(localStorage.getItem(k)); }
        catch { data[k] = localStorage.getItem(k); }
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

  // Helper buttons
  document.getElementById('helper-view-btn').addEventListener('click', () => openHelperView(currentDate));
  document.getElementById('full-helper-btn').addEventListener('click', () => openHelperView(currentDate));
  document.getElementById('grocery-list-btn').addEventListener('click', openGrocery);

  // Why
  document.getElementById('why-card').addEventListener('click', openWhy);
}

function closeWorkoutSwap() {
  document.getElementById('workout-swap-modal').classList.add('hidden');
}

// Expose modal closers for inline onclick
window.closeMealSwap = closeMealSwap;
window.closeWorkoutSwap = closeWorkoutSwap;
window.closeHelper = closeHelper;
window.closeGrocery = closeGrocery;
window.closeWhy = closeWhy;
window.closeExerciseModal = closeExerciseModal;
window.printHelper = printHelper;
window.shareHelper = shareHelper;
window.copyGrocery = copyGrocery;
window.saveWhy = saveWhy;

// ============================================
// BOOT
// ============================================
PinLock.init();

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
