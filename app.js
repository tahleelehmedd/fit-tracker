/* ==================
   FIT TRACKER v6 — APP LOGIC
   ================== */

// ============================================
// PIN LOCK
// ============================================
const PIN_KEY = 'fit:pin';
const PIN_SESSION_KEY = 'fit:unlocked';
const SESSION_DURATION = 1000 * 60 * 60 * 4;

const PinLock = {
  buffer: '', mode: 'verify', firstPin: '',

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
  markUnlocked() { sessionStorage.setItem(PIN_SESSION_KEY, Date.now().toString()); },

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

  press(d) {
    if (this.buffer.length >= 4) return;
    this.buffer += d;
    this.renderDots();
    this.clearError();
    if (this.buffer.length === 4) setTimeout(() => this.submit(), 150);
  },
  backspace() { this.buffer = this.buffer.slice(0, -1); this.renderDots(); this.clearError(); },
  renderDots() {
    document.querySelectorAll('.pin-dot').forEach((dot, i) => dot.classList.toggle('filled', i < this.buffer.length));
  },
  showError(msg) {
    document.getElementById('pin-error').textContent = msg;
    document.getElementById('pin-dots').classList.add('shake');
    setTimeout(() => document.getElementById('pin-dots').classList.remove('shake'), 400);
  },
  clearError() { document.getElementById('pin-error').textContent = ''; },
  updateUI(t, s) {
    document.getElementById('lock-title').textContent = t;
    document.getElementById('lock-subtitle').textContent = s;
    this.buffer = ''; this.renderDots(); this.clearError();
  },

  async submit() {
    if (this.mode === 'setup') {
      this.firstPin = this.buffer;
      this.mode = 'confirm';
      this.updateUI('Confirm PIN', 'Re-enter same 4 digits');
    } else if (this.mode === 'confirm') {
      if (this.buffer === this.firstPin) {
        const h = await this.hash(this.buffer);
        localStorage.setItem(PIN_KEY, h);
        this.unlock();
      } else {
        this.showError("PINs don't match");
        this.mode = 'setup'; this.firstPin = '';
        setTimeout(() => this.updateUI('Set a PIN', 'Choose 4 digits'), 600);
      }
    } else {
      const h = await this.hash(this.buffer);
      if (h === localStorage.getItem(PIN_KEY)) this.unlock();
      else { this.showError('Wrong PIN'); setTimeout(() => { this.buffer = ''; this.renderDots(); }, 400); }
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
      if (k && (k.startsWith('fit:') || k.startsWith('meal-override:') || k.startsWith('comp-swap:') || k === PIN_KEY)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    location.reload();
  }
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && PinLock.hasPin() && !PinLock.isUnlocked()) location.reload();
});

// ============================================
// STATE & STORAGE
// ============================================
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
let state = null;

function getDefaultState() {
  return {
    weight: null, sleep: null, caffeine: null,
    energy: 5, mood: 5, sciatica: 0,
    water: 0, tasks: {}, notes: '', symptoms: '',
    dayType: 'normal',
    gymTiming: localStorage.getItem('fit:default-gym-timing') || 'evening',
    classChoice: null, classCustom: '',
    exerciseLog: {}  // exerciseId -> { sets: [{weight, reps, done}], notes }
  };
}

function loadDay(d) {
  try {
    const raw = localStorage.getItem(`fit:${dateKey(d)}`);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    return { ...getDefaultState(), ...stored };
  } catch { return null; }
}

function saveDay(d, s) {
  try {
    // Auto-backup: keep last 3 versions
    const key = `fit:${dateKey(d)}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      localStorage.setItem(`fit-backup:${dateKey(d)}`, existing);
    }
    localStorage.setItem(key, JSON.stringify(s));
  } catch (e) { console.error(e); }
}

// ============================================
// MEAL HELPERS
// ============================================
function getMealForSlot(slot, date) {
  const options = MEAL_LIBRARY[slot];
  if (!options || !options.length) return null;
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

// Component swap: stored per item
function getComponentSwap(date, itemId) {
  return localStorage.getItem(`comp-swap:${dateKey(date)}:${itemId}`);
}
function setComponentSwap(date, itemId, newName) {
  if (newName) localStorage.setItem(`comp-swap:${dateKey(date)}:${itemId}`, newName);
  else localStorage.removeItem(`comp-swap:${dateKey(date)}:${itemId}`);
}

// Get nutrition plan for date, ordered by gym timing preset
function getNutritionPlan(date) {
  const slot_meta = [
    { slot: 'breakfast', id: 'n_breakfast', title: 'Breakfast', recommendedTime: '7:30 AM', gap: '—' },
    { slot: 'midmorning', id: 'n_midmorning', title: 'Mid-morning', recommendedTime: '10:30 AM', gap: '3h after breakfast' },
    { slot: 'lunch', id: 'n_lunch', title: 'Lunch', recommendedTime: '1:00 PM', gap: '2.5h after snack' },
    { slot: 'preworkout', id: 'n_preworkout', title: 'Pre-workout', recommendedTime: '45 min before gym', gap: 'Light & quick' },
    { slot: 'postworkout', id: 'n_postworkout', title: 'Post-workout', recommendedTime: 'Within 45 min of finishing', gap: 'Critical window' },
    { slot: 'snack', id: 'n_snack', title: 'Optional snack', recommendedTime: 'If needed', gap: 'Only if hungry' },
    { slot: 'dinner', id: 'n_dinner', title: 'Dinner', recommendedTime: '8:00 PM', gap: '3h before bed' }
  ];

  const s = loadDay(date) || getDefaultState();
  const timing = s.gymTiming || 'evening';
  const order = GYM_TIMING_PRESETS[timing]?.order || GYM_TIMING_PRESETS.evening.order;

  return order
    .map(slotName => slot_meta.find(m => m.slot === slotName))
    .filter(Boolean)
    .map(meta => ({ ...meta, meal: getMealForSlot(meta.slot, date) }))
    .filter(m => m.meal);
}

// Compute meal item display (applying component swap if any)
function getItemDisplay(item, date) {
  const swapName = getComponentSwap(date, item.id);
  if (swapName && item.swap && COMPONENT_SWAPS[item.swap]) {
    const opt = COMPONENT_SWAPS[item.swap].options.find(o => o.name === swapName);
    if (opt) return { ...item, displayText: opt.name, kcal: opt.kcal, protein: opt.protein, swapped: true };
  }
  return { ...item, displayText: item.text, swapped: false };
}

// ============================================
// WORKOUT HELPERS
// ============================================
function getWorkoutTypeForDate(date) {
  const s = loadDay(date);
  if (s && s.workoutOverride) return s.workoutOverride;
  if (s && s.dayType === 'class') return 'class';
  if (s && s.dayType === 'rest') return 'rest';
  if (s && s.dayType === 'festive') return 'rest';
  return getDefaultWorkoutForDate(date);
}

function getWorkoutSplit(date) {
  return WORKOUT_SPLITS[getWorkoutTypeForDate(date)];
}

function getExerciseListForDate(date) {
  const s = loadDay(date);
  const workoutType = getWorkoutTypeForDate(date);
  // User-customised list for this day?
  if (s && s.customExercises && s.customExercises.length) return s.customExercises;
  return DEFAULT_WORKOUTS[workoutType] || [];
}

function setCustomExercisesForDate(date, list) {
  state.customExercises = list;
  saveDay(date, state);
}

// Get exercise prescription with phase-adjusted weight
function getPrescription(exerciseId, date) {
  const ex = EXERCISES[exerciseId];
  if (!ex) return null;
  const phase = getCurrentPhase(date);
  // Simple phase scaling: Phase 0 = bodyweight/light; Phase 1 = prescribed; Phase 2 = +20%
  let weight = ex.weight;
  if (phase.name === 'Foundation' && typeof weight === 'string' && /\d/.test(weight)) {
    // Reduce numeric weights by 30% for foundation phase
    weight = weight.replace(/(\d+)kg/g, (_, n) => {
      const reduced = Math.max(2, Math.round(parseInt(n) * 0.7));
      return `${reduced}kg`;
    });
  } else if (phase.name === 'Push' && typeof weight === 'string' && /\d/.test(weight)) {
    weight = weight.replace(/(\d+)kg/g, (_, n) => `${Math.round(parseInt(n) * 1.2)}kg`);
  }
  return { ...ex, weight, phaseName: phase.name };
}

// ============================================
// RENDERING — TOP-LEVEL
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

  // Gym timing selector
  renderGymTimingSelector();

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

function renderGymTimingSelector() {
  const sel = document.getElementById('gym-timing-select');
  if (!sel) return;
  if (!sel.dataset.populated) {
    sel.innerHTML = '';
    Object.entries(GYM_TIMING_PRESETS).forEach(([key, val]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${val.icon} ${val.label}`;
      sel.appendChild(opt);
    });
    sel.dataset.populated = 'true';
    sel.addEventListener('change', e => {
      state.gymTiming = e.target.value;
      localStorage.setItem('fit:default-gym-timing', e.target.value);
      saveDay(currentDate, state);
      render();
    });
  }
  sel.value = state.gymTiming || 'evening';
}

// ============================================
// WATER
// ============================================
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
      hapticTap();
      render();
    });
    grid.appendChild(cup);
  }
  const liters = (state.water * 0.25).toFixed(2).replace(/\.?0+$/, '');
  document.getElementById('water-meta').textContent = `${liters} / ${TARGET_WATER_L} L`;
}

// ============================================
// WORKOUT RENDERING (with sets/reps/weight/swap)
// ============================================
function renderWorkout() {
  const split = getWorkoutSplit(currentDate);
  document.getElementById('workout-type-display').textContent = `${split.icon} ${split.name}`;
  document.getElementById('workout-focus').textContent = split.focus || '';

  // Show "Change day type" button
  const changeBtn = document.getElementById('change-workout-type-btn');
  if (changeBtn && !changeBtn.dataset.bound) {
    changeBtn.addEventListener('click', openWorkoutTypeSwap);
    changeBtn.dataset.bound = 'true';
  }

  const classOptionsDiv = document.getElementById('class-options');
  const list = document.getElementById('workout-list');
  list.innerHTML = '';

  if (split.id === 'class') {
    classOptionsDiv.classList.remove('hidden');
    const optList = document.getElementById('class-options-list');
    optList.innerHTML = '';
    split.classOptions.forEach(cn => {
      const btn = document.createElement('button');
      btn.className = 'class-option-btn' + (state.classChoice === cn ? ' selected' : '');
      btn.textContent = cn;
      btn.addEventListener('click', () => {
        state.classChoice = cn;
        if (cn === 'Other (type in)') {
          // Show input
          document.getElementById('class-custom-wrap').classList.remove('hidden');
          document.getElementById('class-custom-input').value = state.classCustom || '';
          document.getElementById('class-custom-input').focus();
        } else {
          document.getElementById('class-custom-wrap').classList.add('hidden');
          state.classCustom = '';
        }
        saveDay(currentDate, state);
        render();
      });
      optList.appendChild(btn);
    });

    // Class attended task
    if (state.classChoice) {
      const className = state.classChoice === 'Other (type in)' ? (state.classCustom || 'Class') : state.classChoice;
      const taskId = 'class_attended';
      const isDone = !!state.tasks[taskId];
      const row = document.createElement('div');
      row.className = 'task-item' + (isDone ? ' done' : '');
      row.innerHTML = `
        <div class="task-checkbox"></div>
        <div class="task-content">
          <div class="task-title">Attended: ${className}</div>
          <div class="task-meta">45 min · instructor-led</div>
        </div>
        <button class="task-video-btn" aria-label="Watch class type">▶</button>
      `;
      row.querySelector('.task-video-btn').addEventListener('click', e => {
        e.stopPropagation();
        window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(className + ' fitness class'), '_blank', 'noopener');
      });
      row.addEventListener('click', () => {
        state.tasks[taskId] = !state.tasks[taskId];
        saveDay(currentDate, state);
        hapticTap();
        render();
      });
      list.appendChild(row);
    }
    document.getElementById('workout-meta').textContent = state.classChoice ? (state.tasks['class_attended'] ? '✓ Done' : 'Pending') : 'Pick class';
    return;
  } else {
    classOptionsDiv.classList.add('hidden');
  }

  // Normal workout: list of exercises
  const exerciseIds = getExerciseListForDate(currentDate);
  let done = 0;
  exerciseIds.forEach(exId => {
    const ex = getPrescription(exId, currentDate);
    if (!ex) return;
    const taskId = `w_${exId}`;
    if (state.tasks[taskId]) done++;
    const row = createExerciseRow(exId, ex, taskId);
    list.appendChild(row);
  });

  // Swap button to change exercise list
  const swapAll = document.createElement('button');
  swapAll.className = 'btn btn-secondary';
  swapAll.style.marginTop = '12px';
  swapAll.textContent = '+ Add / swap exercises';
  swapAll.addEventListener('click', () => openExerciseSwap(getWorkoutTypeForDate(currentDate)));
  list.appendChild(swapAll);

  document.getElementById('workout-meta').textContent = exerciseIds.length ? `${done}/${exerciseIds.length}` : '';
}

function createExerciseRow(exId, ex, taskId) {
  const isDone = !!state.tasks[taskId];
  const row = document.createElement('div');
  row.className = 'task-item exercise-item' + (isDone ? ' done' : '');

  const checkbox = document.createElement('div');
  checkbox.className = 'task-checkbox';
  row.appendChild(checkbox);

  const content = document.createElement('div');
  content.className = 'task-content';

  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = ex.name;
  content.appendChild(title);

  // Prescription line: sets x reps @ weight, rest
  const prescription = document.createElement('div');
  prescription.className = 'exercise-prescription';
  const parts = [];
  if (ex.sets > 1) parts.push(`${ex.sets} × ${ex.reps}`);
  else parts.push(ex.reps);
  if (ex.weight && ex.weight !== 'bodyweight' && ex.weight !== '') parts.push(`@ ${ex.weight}`);
  if (ex.rest && ex.rest > 0) parts.push(`rest ${ex.rest}s`);
  prescription.textContent = parts.join(' · ');
  content.appendChild(prescription);

  if (ex.cue) {
    const cue = document.createElement('div');
    cue.className = 'task-meta';
    cue.textContent = ex.cue;
    content.appendChild(cue);
  }

  // Actual weight lifted field (only for weighted exercises)
  if (ex.weight && /\d/.test(ex.weight) && ex.weight !== 'bodyweight') {
    const actualLog = state.exerciseLog?.[exId];
    const lastWeight = actualLog?.actualWeight || '';
    const logRow = document.createElement('div');
    logRow.className = 'exercise-log-row';
    logRow.innerHTML = `
      <span class="log-label">Actually lifted:</span>
      <input type="text" class="log-input" placeholder="e.g. 5kg" value="${lastWeight}">
      <span class="log-unit"></span>
    `;
    const input = logRow.querySelector('.log-input');
    input.addEventListener('click', e => e.stopPropagation());
    input.addEventListener('input', e => {
      if (!state.exerciseLog) state.exerciseLog = {};
      if (!state.exerciseLog[exId]) state.exerciseLog[exId] = {};
      state.exerciseLog[exId].actualWeight = e.target.value;
      clearTimeout(window._logTimer);
      window._logTimer = setTimeout(() => saveDay(currentDate, state), 400);
    });
    content.appendChild(logRow);
  }

  row.appendChild(content);

  // Swap button (per exercise)
  const swapBtn = document.createElement('button');
  swapBtn.className = 'task-action-btn';
  swapBtn.innerHTML = '⇆';
  swapBtn.setAttribute('aria-label', 'Swap this exercise');
  swapBtn.addEventListener('click', e => {
    e.stopPropagation();
    openExerciseReplace(exId);
  });
  row.appendChild(swapBtn);

  if (ex.video) {
    const videoBtn = document.createElement('button');
    videoBtn.className = 'task-video-btn';
    videoBtn.innerHTML = '▶';
    videoBtn.setAttribute('aria-label', 'Watch demo');
    videoBtn.addEventListener('click', e => {
      e.stopPropagation();
      window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.video), '_blank', 'noopener');
    });
    row.appendChild(videoBtn);
  }

  row.addEventListener('click', () => {
    state.tasks[taskId] = !state.tasks[taskId];
    saveDay(currentDate, state);
    hapticTap();
    render();
  });
  return row;
}

function openExerciseReplace(currentExId) {
  const workoutType = getWorkoutTypeForDate(currentDate);
  const pool = EXERCISE_POOLS[workoutType] || [];
  const modal = document.getElementById('exercise-swap-modal');
  document.getElementById('exercise-swap-title').textContent = `Replace: ${EXERCISES[currentExId]?.name || ''}`;
  const list = document.getElementById('exercise-swap-list');
  list.innerHTML = '';
  pool.forEach(exId => {
    const ex = EXERCISES[exId];
    if (!ex) return;
    const row = document.createElement('div');
    row.className = 'meal-swap-option' + (exId === currentExId ? ' selected' : '');
    row.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">${ex.name}</span>
        <span class="meal-swap-kcal">${ex.cat}</span>
      </div>
      <div class="meal-swap-detail">${ex.sets > 1 ? ex.sets + ' × ' + ex.reps : ex.reps} ${ex.weight && ex.weight !== 'bodyweight' ? '· ' + ex.weight : ''}</div>
    `;
    row.addEventListener('click', () => {
      const list = getExerciseListForDate(currentDate).slice();
      const idx = list.indexOf(currentExId);
      if (idx >= 0) list[idx] = exId;
      else list.push(exId);
      setCustomExercisesForDate(currentDate, list);
      closeExerciseSwap();
      render();
      showToast('Exercise swapped');
    });
    list.appendChild(row);
  });
  modal.classList.remove('hidden');
}

function openWorkoutTypeSwap() {
  const modal = document.getElementById('exercise-swap-modal');
  document.getElementById('exercise-swap-title').textContent = 'Change workout type';
  const list = document.getElementById('exercise-swap-list');
  list.innerHTML = '<p class="modal-hint">Pick a different workout for today. This replaces the day\'s plan.</p>';

  const currentType = getWorkoutTypeForDate(currentDate);
  const types = ['legs','push','pull','mobility','fullbody_hiit','class','rest'];

  types.forEach(typeId => {
    const wk = WORKOUT_SPLITS[typeId];
    if (!wk) return;
    const row = document.createElement('div');
    row.className = 'meal-swap-option' + (typeId === currentType ? ' selected' : '');
    row.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">${wk.icon} ${wk.name}</span>
        ${typeId === currentType ? '<span class="meal-swap-kcal">current</span>' : ''}
      </div>
      <div class="meal-swap-detail">${wk.focus || ''}</div>
    `;
    row.addEventListener('click', () => {
      // Set override + reset day type if switching to/from class/rest
      state.workoutOverride = typeId;
      if (typeId === 'class') state.dayType = 'class';
      else if (typeId === 'rest') state.dayType = 'rest';
      else state.dayType = 'normal';
      // Clear any customized exercise list since we're changing day type entirely
      state.customExercises = null;
      saveDay(currentDate, state);
      closeExerciseSwap();
      render();
      showToast(`Switched to ${wk.name}`);
    });
    list.appendChild(row);
  });

  // Reset to default option
  if (state.workoutOverride) {
    const resetRow = document.createElement('div');
    resetRow.className = 'meal-swap-option';
    resetRow.style.marginTop = '12px';
    resetRow.style.borderTop = '1px dashed var(--border)';
    resetRow.style.paddingTop = '12px';
    resetRow.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">↺ Reset to default for this day</span>
      </div>
      <div class="meal-swap-detail">Use the weekly schedule default (${WORKOUT_SPLITS[getDefaultWorkoutForDate(currentDate)].name})</div>
    `;
    resetRow.addEventListener('click', () => {
      state.workoutOverride = null;
      state.dayType = 'normal';
      state.customExercises = null;
      saveDay(currentDate, state);
      closeExerciseSwap();
      render();
      showToast('Reset to default');
    });
    list.appendChild(resetRow);
  }

  modal.classList.remove('hidden');
}

function openExerciseSwap(workoutType) {
  const pool = EXERCISE_POOLS[workoutType] || [];
  const current = new Set(getExerciseListForDate(currentDate));
  const modal = document.getElementById('exercise-swap-modal');
  document.getElementById('exercise-swap-title').textContent = `Add exercises to ${workoutType} day`;
  const list = document.getElementById('exercise-swap-list');
  list.innerHTML = '<p class="modal-hint">Tap to add or remove from today\'s workout</p>';
  pool.forEach(exId => {
    const ex = EXERCISES[exId];
    if (!ex) return;
    const inList = current.has(exId);
    const row = document.createElement('div');
    row.className = 'meal-swap-option' + (inList ? ' selected' : '');
    row.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">${inList ? '✓ ' : ''}${ex.name}</span>
        <span class="meal-swap-kcal">${ex.cat}</span>
      </div>
      <div class="meal-swap-detail">${ex.sets > 1 ? ex.sets + ' × ' + ex.reps : ex.reps} ${ex.weight && ex.weight !== 'bodyweight' ? '· ' + ex.weight : ''}</div>
    `;
    row.addEventListener('click', () => {
      const newList = getExerciseListForDate(currentDate).slice();
      if (current.has(exId)) {
        const idx = newList.indexOf(exId);
        if (idx >= 0) newList.splice(idx, 1);
        current.delete(exId);
      } else {
        newList.push(exId);
        current.add(exId);
      }
      setCustomExercisesForDate(currentDate, newList);
      render();
      openExerciseSwap(workoutType);  // refresh
    });
    list.appendChild(row);
  });
  modal.classList.remove('hidden');
}

function closeExerciseSwap() {
  document.getElementById('exercise-swap-modal').classList.add('hidden');
}

// ============================================
// NUTRITION (sub-items + component swap)
// ============================================
function renderNutrition() {
  const items = getNutritionPlan(currentDate);
  const list = document.getElementById('nutrition-list');
  list.innerHTML = '';
  let mealsDone = 0;
  let totalKcal = 0, totalP = 0, totalC = 0, totalF = 0;

  items.forEach((slotItem, idx) => {
    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';

    // Header (slot, name, cuisine, kcal, swap meal button)
    const header = document.createElement('div');
    header.className = 'meal-header';

    const overallTaskId = `${slotItem.id}_full`;
    const subTasks = slotItem.meal.items.map(it => `${slotItem.id}_${it.id}`);
    const allDone = subTasks.every(t => state.tasks[t]);
    const someDone = subTasks.some(t => state.tasks[t]);
    if (allDone) mealsDone++;

    header.innerHTML = `
      <div class="meal-header-left">
        <div class="meal-slot-label">${slotItem.title} <span class="meal-slot-time">· ${slotItem.recommendedTime}</span></div>
        <div class="meal-name">${slotItem.meal.cuisine} ${slotItem.meal.name}</div>
        <div class="meal-macros-line"><strong>${slotItem.meal.kcal}</strong> kcal · P${slotItem.meal.protein}g · C${slotItem.meal.carbs}g · F${slotItem.meal.fat}g</div>
        ${slotItem.gap !== '—' ? `<div class="meal-gap-hint">⏱ ${slotItem.gap}</div>` : ''}
      </div>
      <button class="meal-swap-btn-large" aria-label="Swap meal">⇆</button>
    `;
    header.querySelector('.meal-swap-btn-large').addEventListener('click', () => openMealSwap(slotItem.slot, slotItem.meal.id));
    mealCard.appendChild(header);

    // Sub-items
    slotItem.meal.items.forEach(item => {
      const display = getItemDisplay(item, currentDate);
      const subTaskId = `${slotItem.id}_${item.id}`;
      const isDone = !!state.tasks[subTaskId];

      const subRow = document.createElement('div');
      subRow.className = 'sub-item' + (isDone ? ' done' : '');
      subRow.innerHTML = `
        <div class="sub-checkbox"></div>
        <div class="sub-text">${display.displayText}${display.swapped ? ' <span class="sub-swap-tag">swapped</span>' : ''}</div>
        ${item.swap ? '<button class="sub-swap-btn" aria-label="Swap component">⇆</button>' : ''}
      `;

      if (item.swap) {
        subRow.querySelector('.sub-swap-btn').addEventListener('click', e => {
          e.stopPropagation();
          openComponentSwap(item);
        });
      }

      subRow.addEventListener('click', () => {
        state.tasks[subTaskId] = !state.tasks[subTaskId];
        saveDay(currentDate, state);
        hapticTap();
        render();
      });

      mealCard.appendChild(subRow);

      if (state.tasks[subTaskId]) {
        totalKcal += display.kcal || 0;
        totalP += display.protein || 0;
      }
    });

    list.appendChild(mealCard);
  });

  document.getElementById('nutrition-meta').textContent = `${mealsDone}/${items.length}`;
  document.getElementById('macros-footer').innerHTML = `Eaten: <strong>${totalKcal}</strong> kcal · <strong>${totalP}g</strong> protein · Target ${TARGET_CALORIES}/${TARGET_PROTEIN}g`;
}

function openMealSwap(slot, currentMealId) {
  const options = MEAL_LIBRARY[slot] || [];
  const modal = document.getElementById('meal-swap-modal');
  document.getElementById('meal-swap-title').textContent = `Swap ${slot.charAt(0).toUpperCase() + slot.slice(1)}`;

  // Cuisine filter
  const cuisines = [...new Set(options.map(o => o.cuisine))];
  const filterDiv = document.getElementById('meal-swap-filter');
  filterDiv.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'cuisine-filter-btn active';
  allBtn.textContent = 'All';
  allBtn.dataset.cuisine = 'all';
  filterDiv.appendChild(allBtn);
  cuisines.forEach(c => {
    const b = document.createElement('button');
    b.className = 'cuisine-filter-btn';
    b.textContent = c;
    b.dataset.cuisine = c;
    filterDiv.appendChild(b);
  });

  function renderList(filter) {
    const list = document.getElementById('meal-swap-list');
    list.innerHTML = '';
    options.filter(o => filter === 'all' || o.cuisine === filter).forEach(opt => {
      const row = document.createElement('div');
      row.className = 'meal-swap-option' + (opt.id === currentMealId ? ' selected' : '');
      row.innerHTML = `
        <div class="meal-swap-header">
          <span class="meal-swap-name">${opt.cuisine} ${opt.name}</span>
          <span class="meal-swap-kcal">${opt.kcal} kcal</span>
        </div>
        <div class="meal-swap-detail">${opt.items.map(i => i.text).join(' · ')}</div>
        <div class="meal-swap-macros"><span>P ${opt.protein}g</span><span>C ${opt.carbs}g</span><span>F ${opt.fat}g</span></div>
      `;
      row.addEventListener('click', () => {
        setMealOverride(slot, currentDate, opt.id);
        closeMealSwap();
        render();
        showToast('Meal swapped');
      });
      list.appendChild(row);
    });
  }

  filterDiv.querySelectorAll('.cuisine-filter-btn').forEach(b => {
    b.addEventListener('click', e => {
      filterDiv.querySelectorAll('.cuisine-filter-btn').forEach(x => x.classList.remove('active'));
      e.target.classList.add('active');
      renderList(b.dataset.cuisine);
    });
  });

  renderList('all');
  modal.classList.remove('hidden');
}

function closeMealSwap() {
  document.getElementById('meal-swap-modal').classList.add('hidden');
}

function openComponentSwap(item) {
  const pool = COMPONENT_SWAPS[item.swap];
  if (!pool) return;
  const modal = document.getElementById('component-swap-modal');
  document.getElementById('component-swap-title').textContent = `Swap ${pool.label}`;
  const list = document.getElementById('component-swap-list');
  list.innerHTML = '';
  const currentSwap = getComponentSwap(currentDate, item.id);
  // Show original first
  const origRow = document.createElement('div');
  origRow.className = 'meal-swap-option' + (!currentSwap ? ' selected' : '');
  origRow.innerHTML = `
    <div class="meal-swap-header">
      <span class="meal-swap-name">Original: ${item.text}</span>
      <span class="meal-swap-kcal">${item.kcal} kcal</span>
    </div>
  `;
  origRow.addEventListener('click', () => {
    setComponentSwap(currentDate, item.id, null);
    closeComponentSwap();
    render();
    showToast('Reverted to original');
  });
  list.appendChild(origRow);

  pool.options.forEach(opt => {
    if (opt.name === item.text) return;
    const row = document.createElement('div');
    row.className = 'meal-swap-option' + (opt.name === currentSwap ? ' selected' : '');
    row.innerHTML = `
      <div class="meal-swap-header">
        <span class="meal-swap-name">${opt.name}</span>
        <span class="meal-swap-kcal">${opt.kcal} kcal</span>
      </div>
      <div class="meal-swap-macros"><span>P ${opt.protein}g</span><span>C ${opt.carbs}g</span><span>F ${opt.fat}g</span></div>
    `;
    row.addEventListener('click', () => {
      setComponentSwap(currentDate, item.id, opt.name);
      closeComponentSwap();
      render();
      showToast('Component swapped');
    });
    list.appendChild(row);
  });
  modal.classList.remove('hidden');
}

function closeComponentSwap() {
  document.getElementById('component-swap-modal').classList.add('hidden');
}

// ============================================
// HABITS
// ============================================
function renderHabits() {
  const list = document.getElementById('habits-list');
  list.innerHTML = '';
  let done = 0;
  HABITS_PLAN.forEach(item => {
    if (state.tasks[item.id]) done++;
    const isDone = !!state.tasks[item.id];
    const row = document.createElement('div');
    row.className = 'task-item' + (isDone ? ' done' : '');
    row.innerHTML = `
      <div class="task-checkbox"></div>
      <div class="task-content">
        <div class="task-title">${item.title}</div>
        <div class="task-meta">${item.meta}</div>
      </div>
    `;
    row.addEventListener('click', () => {
      state.tasks[item.id] = !state.tasks[item.id];
      saveDay(currentDate, state);
      hapticTap();
      render();
    });
    list.appendChild(row);
  });
  document.getElementById('habits-meta').textContent = `${done}/${HABITS_PLAN.length}`;
}

// ============================================
// PROGRESS & STREAK
// ============================================
function dayAdherencePct(d, s) {
  if (!s) return 0;
  if (s.dayType === 'festive') {
    const water = s.water || 0;
    const water_pct = Math.min(100, (water / WATER_CUPS) * 100);
    const weight_logged = s.weight ? 100 : 0;
    return Math.round((water_pct + weight_logged) / 2);
  }

  let total = 0, done = 0;
  // Nutrition sub-items
  const plan = getNutritionPlan(d);
  plan.forEach(slotItem => {
    slotItem.meal.items.forEach(it => {
      total++;
      if (s.tasks?.[`${slotItem.id}_${it.id}`]) done++;
    });
  });
  // Workout
  const workoutType = getWorkoutTypeForDate(d);
  if (workoutType === 'class') {
    if (s.classChoice) { total++; if (s.tasks?.['class_attended']) done++; }
  } else {
    const exList = s.customExercises && s.customExercises.length ? s.customExercises : (DEFAULT_WORKOUTS[workoutType] || []);
    exList.forEach(exId => {
      total++;
      if (s.tasks?.[`w_${exId}`]) done++;
    });
  }
  // Habits
  HABITS_PLAN.forEach(h => { total++; if (s.tasks?.[h.id]) done++; });
  // Water (count as cups out of 16)
  total += WATER_CUPS;
  done += s.water || 0;

  return total > 0 ? Math.round((done / total) * 100) : 0;
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
  const phase = getCurrentPhase(currentDate);
  const dayNum = dayNumber(currentDate);
  const phaseEl = document.getElementById('dash-phase-name');
  if (phaseEl) phaseEl.textContent = `${phase.name} ${phase.icon}`;
  const phaseDayEl = document.getElementById('dash-phase-day');
  if (phaseDayEl) phaseDayEl.textContent = `Day ${dayNum}/87`;
  const phaseFill = document.getElementById('phase-progress-fill');
  if (phaseFill) {
    const pct = Math.min(100, Math.max(0, ((dayNum - phase.dayStart) / (phase.dayEnd - phase.dayStart + 1)) * 100));
    phaseFill.style.width = pct + '%';
  }
  const phaseMeta = document.getElementById('dash-phase-meta');
  if (phaseMeta) {
    const dt = daysUntil(TARGET_DATE);
    phaseMeta.textContent = dt > 0 ? `${dt} days to Aug 20` : 'Past target date';
  }

  const latestWeight = getLatestWeight();
  const dwEl = document.getElementById('dash-weight');
  if (dwEl) dwEl.textContent = latestWeight ? `${latestWeight.toFixed(1)} kg` : '—';
  if (latestWeight) {
    const delta = latestWeight - START_WEIGHT;
    const trend = delta < 0 ? `${delta.toFixed(1)} kg` : `+${delta.toFixed(1)} kg`;
    const trendEl = document.getElementById('dash-weight-trend');
    if (trendEl) {
      trendEl.textContent = trend;
      trendEl.className = 'dash-trend ' + (delta < 0 ? 'trend-good' : delta > 0 ? 'trend-bad' : '');
    }
  }
  const togoEl = document.getElementById('dash-togo');
  if (togoEl) togoEl.textContent = latestWeight ? `${(latestWeight - TARGET_WEIGHT).toFixed(1)} kg` : '—';

  const adhEl = document.getElementById('dash-adherence');
  if (adhEl) adhEl.textContent = `${calculate7DayAdherence()}%`;

  drawWeightChart();
  drawAdherenceBars();
  drawSleepChart();
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
    if (s) { sum += dayAdherencePct(d, s); count++; }
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

  const today = new Date(); today.setHours(0, 0, 0, 0);
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
    ctx.fillText('Log weight on 2+ days to see trend', w / 2, h / 2);
    const sumEl = document.getElementById('weight-summary');
    if (sumEl) sumEl.textContent = '';
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

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - ((p.weight - minW) / (maxW - minW)) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

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
  const sumEl = document.getElementById('weight-summary');
  if (sumEl) sumEl.textContent = `Latest ${latest.toFixed(1)} kg · Δ ${sign}${diff.toFixed(1)} kg in ${points.length} days · ${(latest - TARGET_WEIGHT).toFixed(1)} kg to go`;
}

function drawAdherenceBars() {
  const container = document.getElementById('adherence-bars');
  if (!container) return;
  container.innerHTML = '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
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

  const today = new Date(); today.setHours(0, 0, 0, 0);
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

  const barW = chartW / points.length * 0.7;
  points.forEach((p, i) => {
    const x = padding + (i + 0.5) * (chartW / points.length) - barW / 2;
    if (p.sleep) {
      const barH = (p.sleep / maxSleep) * chartH;
      ctx.fillStyle = accent;
      ctx.fillRect(x, padding + chartH - barH, barW, barH);
    }
  });

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

  ctx.fillStyle = accent;
  ctx.fillRect(padding, 12, 14, 14);
  ctx.fillStyle = tert;
  ctx.font = '20px -apple-system, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Sleep (hrs)', padding + 22, 25);
  ctx.fillStyle = danger;
  ctx.fillRect(padding + 180, 12, 14, 14);
  ctx.fillStyle = tert;
  ctx.fillText('Discomfort (0-10)', padding + 202, 25);
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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const list = document.getElementById('week-meals-list');
  if (!list) return;
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
    if (!item.meal.helper || item.meal.helper === 'No prep.') return;
    html += `
      <div class="helper-meal">
        <h4>${item.title}: ${item.meal.name} ${item.meal.cuisine}</h4>
        <p class="helper-ingredients"><strong>What's in it:</strong> ${item.meal.items.map(i => i.text).join(' · ')}</p>
        <p class="helper-instructions"><strong>How to cook:</strong> ${item.meal.helper}</p>
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.meal.name + ' recipe')}" target="_blank" class="link-btn">🎥 Recipe video</a>
      </div>
    `;
  });
  const noprep = plan.filter(p => p.meal.helper === 'No prep.');
  if (noprep.length) {
    html += `<div class="helper-meal"><h4>No-prep items (assemble fresh):</h4><ul>`;
    noprep.forEach(p => html += `<li><strong>${p.title}:</strong> ${p.meal.items.map(i => i.text).join(' · ')}</li>`);
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
  if (navigator.share) navigator.share({ title, text: content }).catch(() => {});
  else copyToClipboard(`${title}\n\n${content}`);
}

// ============================================
// GROCERY LIST
// ============================================
function openGrocery() {
  const groceryList = {
    'Proteins': [
      'Chicken breast (boneless) — 1.2 kg',
      'Fish fillets (salmon/hammour) — 600g',
      'White fish — 300g',
      'Lean beef strips — 200g',
      'Eggs — 1 dozen',
      'Paneer — 200g',
      'Whey protein isolate (if not on hand)',
      'Cottage cheese — 250g',
      'Tuna in water — 2 small cans',
      'Tofu — 200g (optional)'
    ],
    'Grains & Carbs': [
      'Brown rice — 500g',
      'Quinoa — 250g',
      'Rolled oats — 500g',
      'Multigrain rotis — 1 pack',
      'Sweet potato — 2 medium',
      'Masoor daal — 500g',
      'Chickpeas (dried or canned) — 500g + 1 can',
      'Whole grain rice cakes — 1 pack',
      'Farro — 250g (optional)'
    ],
    'Vegetables': [
      'Cucumbers — 6-8',
      'Tomatoes — 8-10',
      'Onions (mix) — 1 kg',
      'Bell peppers — 5-6',
      'Zucchini — 3',
      'Eggplant — 2',
      'Broccoli — 2 heads',
      'Bok choy or Asian greens — 1 bunch',
      'Carrots — 5-6',
      'Spinach — 2 bunches',
      'Cauliflower — 1 head',
      'Mixed salad leaves — 1 large bag',
      'Garlic — 1 head',
      'Ginger — 100g',
      'Lemons — 6-8',
      'Green chilies — small pack',
      'Coriander, mint, basil — bunches'
    ],
    'Fats & Pantry': [
      'Extra virgin olive oil — 500ml',
      'Avocados — 4 ripe',
      'Walnuts (raw) — 250g',
      'Almonds (raw) — 250g',
      'Tahini — small jar',
      'Soy sauce (low sodium)',
      'Cumin, turmeric, coriander, garam masala',
      'Tandoori marinade paste',
      'Green curry paste',
      'Sesame oil (small bottle)',
      'Olives — small jar'
    ],
    'Dairy': [
      'Greek yogurt — 1 kg tub',
      'Labneh — small tub',
      'Hummus — 250g',
      'Feta (optional) — 100g',
      'Fresh mozzarella — 200g (optional)'
    ],
    'Fruits': [
      'Bananas — 7',
      'Apples — 6',
      'Pears — 3',
      'Berries — 1 box',
      'Medjool dates — small box'
    ],
    'Drinks/Misc': [
      'Coffee beans/ground — 250g',
      'Green tea — 1 box',
      'Chamomile or peppermint tea',
      'Honey (raw)'
    ]
  };

  let html = `<div class="grocery-intro"><p>One week's groceries. Big shop Sat/Sun, top-up Wed.</p></div>`;
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
  const start = new Date(START_DATE);
  const target = new Date(TARGET_DATE);
  const total = Math.round((target - start) / 86400000);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const elapsed = Math.round((today - start) / 86400000);
  const remaining = total - elapsed;
  const goalEl = document.getElementById('goal-progress');
  if (goalEl) goalEl.innerHTML = `<strong>${remaining} days remaining</strong> · Day ${elapsed + 1} of ${total + 1}`;

  const sched = document.getElementById('weekly-schedule-list');
  if (sched) {
    sched.innerHTML = '';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    DEFAULT_WEEKLY_SCHEDULE.forEach((wkId, idx) => {
      const wk = WORKOUT_SPLITS[wkId];
      const row = document.createElement('div');
      row.className = 'sched-row';
      row.innerHTML = `<div class="sched-day">${dayNames[idx]}</div><div class="sched-workout">${wk.icon} ${wk.name}</div><div class="sched-focus">${wk.focus || ''}</div>`;
      sched.appendChild(row);
    });
  }

  const cp = document.getElementById('all-checkpoints');
  if (cp) {
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
}

// ============================================
// SUMMARY GENERATION
// ============================================
function generateDailySummary() {
  const dayNum = dayNumber(currentDate);
  const workoutType = getWorkoutTypeForDate(currentDate);
  const split = WORKOUT_SPLITS[workoutType];
  const plan = getNutritionPlan(currentDate);

  let mealsDone = [], mealsMissed = [];
  let totalKcal = 0, totalP = 0;
  plan.forEach(slotItem => {
    const allItemsDone = slotItem.meal.items.every(it => state.tasks[`${slotItem.id}_${it.id}`]);
    const someItemsDone = slotItem.meal.items.some(it => state.tasks[`${slotItem.id}_${it.id}`]);
    if (allItemsDone) {
      mealsDone.push(`${slotItem.title} (${slotItem.meal.name})`);
      totalKcal += slotItem.meal.kcal;
      totalP += slotItem.meal.protein;
    } else if (someItemsDone) {
      const partialItems = slotItem.meal.items.filter(it => state.tasks[`${slotItem.id}_${it.id}`]).map(it => {
        const d = getItemDisplay(it, currentDate);
        return d.displayText;
      });
      mealsDone.push(`${slotItem.title} (partial: ${partialItems.join(', ')})`);
      partialItems.forEach(p => {
        const it = slotItem.meal.items.find(i => i.text === p);
        if (it) { totalKcal += it.kcal || 0; totalP += it.protein || 0; }
      });
    } else {
      mealsMissed.push(slotItem.title);
    }
  });

  let workoutDoneList = [], workoutMissedList = [];
  if (workoutType === 'class') {
    if (state.classChoice) {
      const cn = state.classChoice === 'Other (type in)' ? (state.classCustom || 'Custom class') : state.classChoice;
      if (state.tasks['class_attended']) workoutDoneList.push(cn);
      else workoutMissedList.push(cn);
    }
  } else {
    const exList = state.customExercises && state.customExercises.length ? state.customExercises : (DEFAULT_WORKOUTS[workoutType] || []);
    exList.forEach(exId => {
      const ex = EXERCISES[exId];
      if (!ex) return;
      const actual = state.exerciseLog?.[exId]?.actualWeight;
      const label = ex.name + (actual ? ` (lifted ${actual})` : '');
      if (state.tasks[`w_${exId}`]) workoutDoneList.push(label);
      else workoutMissedList.push(ex.name);
    });
  }

  const habsDone = HABITS_PLAN.filter(h => state.tasks[h.id]);
  const habsMissed = HABITS_PLAN.filter(h => !state.tasks[h.id]);

  const liters = (state.water * 0.25).toFixed(2).replace(/\.?0+$/, '');
  const dayTypeLabel = state.dayType === 'normal' ? '' : ` [${state.dayType.toUpperCase()} day]`;

  let s = `Day ${dayNum} log (${formatDate(currentDate)})${dayTypeLabel}:\n\n`;
  s += `STATS\n- Weight: ${state.weight ? state.weight + ' kg' : 'not logged'}\n- Sleep: ${state.sleep ? state.sleep + ' hrs' : 'not logged'}\n- Energy: ${state.energy}/10\n- Mood: ${state.mood}/10\n- Discomfort/sciatica: ${state.sciatica}/10\n`;
  if (state.caffeine !== null && state.caffeine !== '') s += `- Caffeine: ${state.caffeine} cups\n`;
  s += `\nWATER: ${liters}L / ${TARGET_WATER_L}L\n\n`;
  s += `NUTRITION (${mealsDone.length}/${plan.length} meals fully done)\n`;
  if (mealsDone.length) s += `- Eaten: ${mealsDone.join(', ')}\n`;
  if (mealsMissed.length) s += `- Missed: ${mealsMissed.join(', ')}\n`;
  s += `- Approx eaten: ${totalKcal} kcal / ${totalP}g protein\n\n`;

  s += `WORKOUT (${workoutDoneList.length}/${workoutDoneList.length + workoutMissedList.length}) · ${split.icon} ${split.name}\n`;
  if (workoutDoneList.length === 0 && workoutMissedList.length === 0) s += `- No workout (rest/festive day)\n`;
  else if (workoutMissedList.length === 0) s += `- Full session completed\n  Exercises: ${workoutDoneList.join(', ')}\n`;
  else if (workoutDoneList.length === 0) s += `- Did not work out\n`;
  else s += `- Partial — did ${workoutDoneList.length} of ${workoutDoneList.length + workoutMissedList.length}\n  Done: ${workoutDoneList.join(', ')}\n  Skipped: ${workoutMissedList.join(', ')}\n`;

  s += `\nHABITS (${habsDone.length}/${HABITS_PLAN.length})\n`;
  if (habsMissed.length) s += `- Missed: ${habsMissed.map(h => h.title).join(', ')}\n`;
  if (state.notes) s += `\nNOTES\n${state.notes}\n`;
  if (state.symptoms) s += `\nSYMPTOMS / FLAGS\n${state.symptoms}\n`;
  s += `\nPlease give me my daily summary (wins, struggles, patterns) and tomorrow's specific plan.`;
  return s;
}

function generateWeeklySummary() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
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
  if (weights.length >= 2) s += `WEIGHT: ${weights[0]} → ${weights[weights.length - 1]} kg (Δ ${(weights[weights.length - 1] - weights[0]).toFixed(1)} kg)\n\n`;
  else if (weights.length === 1) s += `WEIGHT: ${weights[0]} kg (only 1 day logged)\n\n`;
  s += `AVERAGES\n- Sleep: ${avg(sleeps)} hrs\n- Energy: ${avg(energies)}/10\n- Mood: ${avg(moods)}/10\n- Discomfort: ${avg(sciaticas)}/10\n- Water: ${avg(waters)}L/day\n\n`;
  s += `DAILY ADHERENCE\n`;
  days.forEach(d => {
    const pct = dayAdherencePct(d.date, d.state);
    s += `- ${formatDate(d.date)} [${d.state.dayType || 'normal'}]: ${pct}%\n`;
  });
  const notes = days.filter(d => d.state.notes).map(d => `${formatDate(d.date)}: ${d.state.notes}`);
  if (notes.length) s += `\nNOTES\n${notes.join('\n')}\n`;
  const sympts = days.filter(d => d.state.symptoms).map(d => `${formatDate(d.date)}: ${d.state.symptoms}`);
  if (sympts.length) s += `\nFLAGS/SYMPTOMS\n${sympts.join('\n')}\n`;
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

function hapticTap() {
  // Subtle haptic on supported devices
  if (navigator.vibrate) navigator.vibrate(10);
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

// Why
function openWhy() {
  document.getElementById('why-input').value = localStorage.getItem('fit:why') || '';
  document.getElementById('why-modal').classList.remove('hidden');
}
function closeWhy() { document.getElementById('why-modal').classList.add('hidden'); }
function saveWhy() {
  const v = document.getElementById('why-input').value.trim();
  if (v) localStorage.setItem('fit:why', v); else localStorage.removeItem('fit:why');
  closeWhy();
  render();
}

// Theme
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const nxt = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nxt);
  localStorage.setItem('fit:theme', nxt);
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

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll('.daytype-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.dayType = btn.dataset.type;
      if (state.dayType !== 'class') state.classChoice = null;
      saveDay(currentDate, state);
      render();
    });
  });

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

  // Class custom input
  const classInput = document.getElementById('class-custom-input');
  if (classInput) {
    classInput.addEventListener('input', e => {
      state.classCustom = e.target.value;
      clearTimeout(window._classTimer);
      window._classTimer = setTimeout(() => saveDay(currentDate, state), 400);
    });
  }

  document.getElementById('copy-summary-btn').addEventListener('click', () => copyToClipboard(generateDailySummary()));
  document.getElementById('weekly-summary-btn').addEventListener('click', () => copyToClipboard(generateWeeklySummary()));

  document.getElementById('reset-day-btn').addEventListener('click', () => {
    if (confirm('Reset all data for this day?')) {
      state = getDefaultState();
      saveDay(currentDate, state);
      render();
    }
  });

  document.getElementById('export-btn').addEventListener('click', exportAllData);
  const backupBtn = document.getElementById('backup-btn');
  if (backupBtn) backupBtn.addEventListener('click', exportAllData);

  // Import data from JSON backup
  const pasteBtn = document.getElementById('paste-restore-btn');
  if (pasteBtn) pasteBtn.addEventListener('click', openPasteRestore);

  const importBtn = document.getElementById('import-btn');
  const importInput = document.getElementById('import-file-input');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (confirm('Restore data from this backup? Any existing data will be merged (new data wins on conflicts).')) {
          importData(file);
        }
        e.target.value = '';
      }
    });
  }

  document.getElementById('helper-view-btn').addEventListener('click', () => openHelperView(currentDate));
  document.getElementById('full-helper-btn').addEventListener('click', () => openHelperView(currentDate));
  document.getElementById('grocery-list-btn').addEventListener('click', openGrocery);

  document.getElementById('why-card').addEventListener('click', openWhy);
}

function exportAllData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('fit:') || k.startsWith('meal-override:') || k.startsWith('comp-swap:') || k.startsWith('fit-backup:'))) {
      try { data[k] = JSON.parse(localStorage.getItem(k)); }
      catch { data[k] = localStorage.getItem(k); }
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fit-tracker-backup-${dateKey(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup downloaded');
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    restoreFromJSONString(e.target.result);
  };
  reader.onerror = function() {
    alert('Could not read the file. Please try again.');
  };
  reader.readAsText(file);
}

function restoreFromJSONString(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    let imported = 0;
    let skipped = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (!key.startsWith('fit:') && !key.startsWith('meal-override:') && !key.startsWith('comp-swap:') && !key.startsWith('fit-backup:')) {
        skipped++;
        return;
      }
      try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        imported++;
      } catch (err) {
        skipped++;
      }
    });

    if (imported === 0) {
      alert('No valid entries found. Make sure you pasted the complete JSON from your backup file.');
      return;
    }
    showToast(`✓ Restored ${imported} entries`);
    closePasteRestore();
    setTimeout(() => {
      state = loadDay(currentDate) || getDefaultState();
      render();
    }, 500);
  } catch (err) {
    alert('Could not parse the JSON. Make sure you copied the COMPLETE text including the outer { and }.\n\nError: ' + err.message);
  }
}

function openPasteRestore() {
  document.getElementById('paste-restore-input').value = '';
  document.getElementById('paste-restore-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('paste-restore-input').focus(), 100);
}

function closePasteRestore() {
  document.getElementById('paste-restore-modal').classList.add('hidden');
}

function restoreFromPaste() {
  const text = document.getElementById('paste-restore-input').value.trim();
  if (!text) {
    alert('Please paste the JSON text first.');
    return;
  }
  if (!confirm('Restore data from this paste? Any existing data with same keys will be overwritten.')) return;
  restoreFromJSONString(text);
}

// Expose closers for inline onclick
window.closeMealSwap = closeMealSwap;
window.closeComponentSwap = closeComponentSwap;
window.closeExerciseSwap = closeExerciseSwap;
window.closeHelper = closeHelper;
window.closeGrocery = closeGrocery;
window.closeWhy = closeWhy;
window.printHelper = printHelper;
window.shareHelper = shareHelper;
window.copyGrocery = copyGrocery;
window.saveWhy = saveWhy;
window.closePasteRestore = closePasteRestore;
window.restoreFromPaste = restoreFromPaste;

// BOOT
PinLock.init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
