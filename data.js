/* ==================
   FIT TRACKER v5 — DATA
   ================== */

const APP_VERSION = '5.0';
const START_DATE = '2026-05-25';
const TARGET_DATE = '2026-08-20';
const START_WEIGHT = 78.0;
const TARGET_WEIGHT = 70.0;
const TARGET_CALORIES = 1750;
const TARGET_PROTEIN = 160;
const TARGET_WATER_L = 4.0;
const WATER_CUPS = 16; // 16 × 250ml = 4L

// ===== EXERCISE LIBRARY WITH SVG DIAGRAMS =====
// Each diagram is a clean stick-figure showing the movement
const EXERCISES = {
  // ----- MOBILITY / WARM-UP -----
  cat_cow: {
    name: 'Cat-Cow',
    cue: '10 slow reps · arch up, sag down with breath',
    video: 'cat cow stretch beginner tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M30,80 Q60,40 110,50 Q145,55 160,80" /><circle cx="160" cy="75" r="6" fill="currentColor"/><line x1="40" y1="80" x2="40" y2="100"/><line x1="50" y1="80" x2="50" y2="100"/><line x1="140" y1="80" x2="140" y2="100"/><line x1="150" y1="80" x2="150" y2="100"/><path d="M30,95 Q60,110 110,105 Q145,103 160,95" stroke-dasharray="3,3" opacity="0.4"/></g></svg>`
  },
  childs_pose: {
    name: "Child's pose",
    cue: 'Hold 45 sec · knees wide, sit back on heels',
    video: 'childs pose yoga stretch beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M30,90 Q40,40 80,40 L150,40 L160,80 L170,95"/><circle cx="160" cy="50" r="6" fill="currentColor"/><line x1="40" y1="95" x2="170" y2="95" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  hip_flexor_stretch: {
    name: 'Kneeling hip flexor stretch',
    cue: '45 sec each side · push hips forward · sciatica critical',
    video: 'kneeling hip flexor stretch sciatica',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="20" r="7" fill="currentColor"/><line x1="100" y1="27" x2="100" y2="65"/><line x1="100" y1="65" x2="60" y2="100"/><line x1="100" y1="65" x2="150" y2="80"/><line x1="150" y1="80" x2="170" y2="100"/><line x1="100" y1="45" x2="80" y2="55"/><line x1="100" y1="45" x2="120" y2="55"/><line x1="40" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  piriformis_stretch: {
    name: 'Seated piriformis stretch',
    cue: '45 sec each side · sciatica direct relief',
    video: 'seated piriformis stretch sciatica',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="80" cy="30" r="7" fill="currentColor"/><line x1="80" y1="37" x2="85" y2="70"/><line x1="85" y1="70" x2="140" y2="80"/><line x1="140" y1="80" x2="160" y2="65"/><line x1="85" y1="70" x2="110" y2="60"/><line x1="110" y1="60" x2="130" y2="50"/><line x1="80" y1="50" x2="60" y2="65"/><line x1="80" y1="50" x2="105" y2="65"/></g></svg>`
  },
  glute_bridge: {
    name: 'Glute bridge',
    cue: '15 reps · squeeze glutes, hold 2 sec at top',
    video: 'glute bridge proper form beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="80" r="7" fill="currentColor"/><path d="M47,80 L100,55 L140,80"/><line x1="140" y1="80" x2="160" y2="100"/><line x1="140" y1="80" x2="160" y2="60"/><line x1="60" y1="80" x2="100" y2="55"/><line x1="60" y1="80" x2="50" y2="70"/><line x1="80" y1="68" x2="100" y2="55"/><line x1="30" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  dead_bug: {
    name: 'Dead bug',
    cue: '10 each side · opposite arm + leg, lower back stays flat',
    video: 'dead bug exercise tutorial beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="60" r="7" fill="currentColor"/><line x1="47" y1="60" x2="130" y2="60"/><line x1="130" y1="60" x2="160" y2="30"/><line x1="130" y1="60" x2="155" y2="80"/><line x1="80" y1="60" x2="60" y2="35"/><line x1="100" y1="60" x2="120" y2="80"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  bird_dog: {
    name: 'Bird dog',
    cue: '10 each side · slow and controlled',
    video: 'bird dog exercise tutorial proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="50" cy="50" r="7" fill="currentColor"/><line x1="57" y1="50" x2="130" y2="60"/><line x1="60" y1="50" x2="40" y2="90"/><line x1="130" y1="60" x2="160" y2="100"/><line x1="80" y1="55" x2="60" y2="100"/><line x1="120" y1="60" x2="170" y2="30"/><line x1="30" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  wall_angels: {
    name: 'Wall angels',
    cue: '10 reps · back flat against wall, slide arms up and down',
    video: 'wall angels posture exercise tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="30" y1="10" x2="30" y2="115" stroke-width="3"/><circle cx="60" cy="30" r="7" fill="currentColor"/><line x1="60" y1="37" x2="60" y2="90"/><line x1="60" y1="90" x2="50" y2="115"/><line x1="60" y1="90" x2="75" y2="115"/><line x1="55" y1="50" x2="30" y2="35"/><line x1="65" y1="50" x2="90" y2="35"/><path d="M40,55 Q35,50 35,40" stroke-dasharray="2,2" opacity="0.4"/><path d="M80,55 Q85,50 85,40" stroke-dasharray="2,2" opacity="0.4"/></g></svg>`
  },
  foam_roll: {
    name: 'Foam roller — full body',
    cue: '8-10 min · quads, glutes, hamstrings, IT band, back',
    video: 'foam roller full body routine',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="50" r="7" fill="currentColor"/><line x1="47" y1="50" x2="120" y2="65"/><line x1="120" y1="65" x2="160" y2="65"/><rect x="120" y="75" width="50" height="14" rx="7" stroke="currentColor" fill="none"/><line x1="60" y1="55" x2="50" y2="40"/><line x1="80" y1="60" x2="90" y2="40"/><line x1="30" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  forward_fold: {
    name: 'Standing forward fold',
    cue: 'Hold 45 sec · loosen hamstrings',
    video: 'standing forward fold stretch',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="80" r="7" fill="currentColor"/><line x1="100" y1="73" x2="100" y2="40"/><line x1="100" y1="40" x2="100" y2="20"/><line x1="100" y1="73" x2="90" y2="100"/><line x1="100" y1="73" x2="110" y2="100"/><line x1="100" y1="80" x2="80" y2="90"/><line x1="100" y1="80" x2="120" y2="90"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  figure4: {
    name: 'Figure-4 stretch (lying)',
    cue: '45 sec each side · glute/piriformis stretch',
    video: 'figure 4 stretch lying down',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="60" r="7" fill="currentColor"/><line x1="47" y1="60" x2="100" y2="60"/><line x1="100" y1="60" x2="130" y2="40"/><line x1="130" y1="40" x2="155" y2="55"/><line x1="115" y1="50" x2="100" y2="80"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },

  // ----- LOWER BODY / GLUTES -----
  bodyweight_squat: {
    name: 'Bodyweight squat',
    cue: '12 reps · sit back, chest up, knees track over toes',
    video: 'bodyweight squat proper form beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="25" r="7" fill="currentColor"/><line x1="100" y1="32" x2="100" y2="65"/><line x1="100" y1="65" x2="75" y2="80"/><line x1="75" y1="80" x2="80" y2="100"/><line x1="100" y1="65" x2="125" y2="80"/><line x1="125" y1="80" x2="120" y2="100"/><line x1="100" y1="45" x2="80" y2="35"/><line x1="100" y1="45" x2="120" y2="35"/><line x1="50" y1="100" x2="150" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  goblet_squat: {
    name: 'Goblet squat',
    cue: '3 × 10 · dumbbell at chest, slow descent',
    video: 'goblet squat proper form tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="25" r="7" fill="currentColor"/><line x1="100" y1="32" x2="100" y2="65"/><line x1="100" y1="65" x2="78" y2="82"/><line x1="78" y1="82" x2="82" y2="100"/><line x1="100" y1="65" x2="122" y2="82"/><line x1="122" y1="82" x2="118" y2="100"/><line x1="100" y1="42" x2="90" y2="50"/><line x1="100" y1="42" x2="110" y2="50"/><rect x="92" y="48" width="16" height="14" rx="2" fill="currentColor"/><line x1="50" y1="100" x2="150" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  reverse_lunge: {
    name: 'Reverse lunge',
    cue: '8 each leg · step BACK (sciatica safer than forward)',
    video: 'reverse lunge tutorial proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="80" cy="25" r="7" fill="currentColor"/><line x1="80" y1="32" x2="80" y2="70"/><line x1="80" y1="70" x2="70" y2="100"/><line x1="80" y1="70" x2="130" y2="100"/><line x1="80" y1="50" x2="65" y2="60"/><line x1="80" y1="50" x2="95" y2="60"/><line x1="40" y1="100" x2="160" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  romanian_deadlift: {
    name: 'Romanian deadlift (light)',
    cue: '3 × 10 · hinge at hips, slight knee bend, neutral spine',
    video: 'dumbbell romanian deadlift form beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="120" cy="30" r="7" fill="currentColor"/><line x1="115" y1="35" x2="80" y2="55"/><line x1="80" y1="55" x2="80" y2="100"/><line x1="80" y1="55" x2="75" y2="85"/><line x1="80" y1="55" x2="85" y2="85"/><line x1="100" y1="45" x2="100" y2="70"/><rect x="92" y="68" width="16" height="6" fill="currentColor"/><line x1="40" y1="100" x2="160" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  step_up: {
    name: 'Step-up',
    cue: '3 × 10 each leg · use bench, drive through heel',
    video: 'dumbbell step up exercise tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="110" y="75" width="60" height="25" stroke="currentColor" fill="none"/><circle cx="80" cy="20" r="7" fill="currentColor"/><line x1="80" y1="27" x2="80" y2="60"/><line x1="80" y1="60" x2="60" y2="100"/><line x1="80" y1="60" x2="130" y2="75"/><line x1="80" y1="45" x2="65" y2="55"/><line x1="80" y1="45" x2="95" y2="55"/><line x1="40" y1="100" x2="110" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  hip_thrust: {
    name: 'Hip thrust',
    cue: '3 × 12 · back on bench, drive hips up, squeeze glutes',
    video: 'hip thrust glute exercise tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="20" y="60" width="40" height="20" stroke="currentColor" fill="none"/><circle cx="50" cy="50" r="7" fill="currentColor"/><line x1="55" y1="55" x2="110" y2="60"/><line x1="110" y1="60" x2="150" y2="100"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  leg_curl: {
    name: 'Lying leg curl',
    cue: '3 × 12 · machine · hamstring isolation',
    video: 'lying leg curl machine tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="60" r="7" fill="currentColor"/><line x1="47" y1="60" x2="130" y2="60"/><line x1="130" y1="60" x2="170" y2="30"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/><line x1="125" y1="60" x2="165" y2="35" stroke-dasharray="3,3" opacity="0.4"/></g></svg>`
  },
  calf_raise: {
    name: 'Standing calf raise',
    cue: '3 × 15 · up on toes, slow down',
    video: 'standing calf raise tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="20" r="7" fill="currentColor"/><line x1="100" y1="27" x2="100" y2="70"/><line x1="100" y1="70" x2="85" y2="95"/><line x1="100" y1="70" x2="115" y2="95"/><line x1="85" y1="95" x2="95" y2="95"/><line x1="105" y1="95" x2="115" y2="95"/><line x1="100" y1="45" x2="85" y2="55"/><line x1="100" y1="45" x2="115" y2="55"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  hip_abduction: {
    name: 'Hip abduction (machine or band)',
    cue: '3 × 15 · glute med activation · right-side asymmetry',
    video: 'hip abduction machine seated form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="30" r="7" fill="currentColor"/><line x1="100" y1="37" x2="100" y2="65"/><line x1="100" y1="65" x2="70" y2="100"/><line x1="100" y1="65" x2="130" y2="100"/><line x1="100" y1="50" x2="80" y2="60"/><line x1="100" y1="50" x2="120" y2="60"/><line x1="40" y1="100" x2="160" y2="100" stroke-width="1" opacity="0.3"/><path d="M70,100 Q60,90 65,80" stroke-dasharray="2,2" opacity="0.5"/><path d="M130,100 Q140,90 135,80" stroke-dasharray="2,2" opacity="0.5"/></g></svg>`
  },

  // ----- UPPER PUSH -----
  incline_pushup: {
    name: 'Incline push-up',
    cue: '8-10 reps · hands on bench, body straight',
    video: 'incline push up beginner bench tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="120" y="60" width="50" height="10" stroke="currentColor" fill="none"/><circle cx="55" cy="80" r="7" fill="currentColor"/><line x1="60" y1="78" x2="140" y2="68"/><line x1="60" y1="80" x2="50" y2="100"/><line x1="65" y1="83" x2="55" y2="100"/><line x1="135" y1="68" x2="130" y2="100"/><line x1="140" y1="68" x2="145" y2="100"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  pushup: {
    name: 'Push-up',
    cue: '3 × max · chest to floor',
    video: 'how to do a proper push up',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="60" r="7" fill="currentColor"/><line x1="47" y1="60" x2="160" y2="55"/><line x1="50" y1="60" x2="40" y2="85"/><line x1="55" y1="62" x2="45" y2="85"/><line x1="155" y1="55" x2="155" y2="85"/><line x1="160" y1="55" x2="165" y2="85"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  db_bench_press: {
    name: 'Dumbbell bench press',
    cue: '3 × 10 · controlled descent, full extension',
    video: 'dumbbell bench press proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="40" y="65" width="120" height="15" stroke="currentColor" fill="none"/><circle cx="50" cy="55" r="7" fill="currentColor"/><line x1="100" y1="65" x2="100" y2="50"/><line x1="100" y1="50" x2="80" y2="35"/><line x1="100" y1="50" x2="120" y2="35"/><rect x="74" y="30" width="12" height="10" fill="currentColor"/><rect x="114" y="30" width="12" height="10" fill="currentColor"/><line x1="150" y1="80" x2="160" y2="100"/><line x1="150" y1="80" x2="140" y2="100"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  incline_db_press: {
    name: 'Incline DB press',
    cue: '3 × 10 · 30° incline, focus on upper chest',
    video: 'incline dumbbell bench press form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="40" y1="90" x2="160" y2="50" stroke-width="3"/><circle cx="55" cy="83" r="7" fill="currentColor"/><line x1="100" y1="68" x2="100" y2="48"/><line x1="100" y1="48" x2="80" y2="35"/><line x1="100" y1="48" x2="120" y2="35"/><rect x="74" y="30" width="12" height="10" fill="currentColor"/><rect x="114" y="30" width="12" height="10" fill="currentColor"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  shoulder_press: {
    name: 'Standing shoulder press',
    cue: '3 × 10 · core tight, press overhead',
    video: 'standing dumbbell shoulder press form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="35" r="7" fill="currentColor"/><line x1="100" y1="42" x2="100" y2="75"/><line x1="100" y1="75" x2="90" y2="100"/><line x1="100" y1="75" x2="110" y2="100"/><line x1="100" y1="50" x2="80" y2="25"/><line x1="100" y1="50" x2="120" y2="25"/><rect x="72" y="18" width="14" height="12" fill="currentColor"/><rect x="114" y="18" width="14" height="12" fill="currentColor"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  lateral_raise: {
    name: 'Lateral raise',
    cue: '3 × 12 · light dumbbells, raise to shoulder height',
    video: 'dumbbell lateral raise proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="35" r="7" fill="currentColor"/><line x1="100" y1="42" x2="100" y2="75"/><line x1="100" y1="75" x2="90" y2="100"/><line x1="100" y1="75" x2="110" y2="100"/><line x1="100" y1="50" x2="60" y2="50"/><line x1="100" y1="50" x2="140" y2="50"/><rect x="52" y="46" width="14" height="10" fill="currentColor"/><rect x="134" y="46" width="14" height="10" fill="currentColor"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  tricep_pushdown: {
    name: 'Tricep pushdown (cable)',
    cue: '3 × 12 · elbows pinned, full extension',
    video: 'cable tricep pushdown rope form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="100" y1="10" x2="100" y2="30" stroke-dasharray="3,3"/><circle cx="100" cy="40" r="7" fill="currentColor"/><line x1="100" y1="47" x2="100" y2="80"/><line x1="100" y1="80" x2="90" y2="100"/><line x1="100" y1="80" x2="110" y2="100"/><line x1="100" y1="55" x2="90" y2="65"/><line x1="100" y1="55" x2="110" y2="65"/><line x1="90" y1="65" x2="90" y2="80"/><line x1="110" y1="65" x2="110" y2="80"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },

  // ----- UPPER PULL -----
  lat_pulldown: {
    name: 'Lat pulldown',
    cue: '3 × 12 · pull to upper chest, squeeze lats',
    video: 'lat pulldown proper form beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="60" y1="10" x2="140" y2="10" stroke-width="3"/><line x1="80" y1="10" x2="100" y2="40" stroke-dasharray="2,2"/><line x1="120" y1="10" x2="100" y2="40" stroke-dasharray="2,2"/><circle cx="100" cy="50" r="7" fill="currentColor"/><line x1="100" y1="57" x2="100" y2="90"/><line x1="100" y1="90" x2="90" y2="100"/><line x1="100" y1="90" x2="110" y2="100"/><line x1="100" y1="42" x2="80" y2="25"/><line x1="100" y1="42" x2="120" y2="25"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  standing_cable_row: {
    name: 'Standing cable row',
    cue: '3 × 12 · squeeze shoulder blades',
    video: 'standing cable row tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="160" y="40" width="15" height="40" stroke="currentColor" fill="none"/><line x1="160" y1="60" x2="120" y2="60" stroke-dasharray="2,2"/><circle cx="80" cy="40" r="7" fill="currentColor"/><line x1="80" y1="47" x2="80" y2="80"/><line x1="80" y1="80" x2="70" y2="100"/><line x1="80" y1="80" x2="90" y2="100"/><line x1="80" y1="55" x2="120" y2="60"/><line x1="20" y1="100" x2="160" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  db_row: {
    name: 'Dumbbell row (one arm)',
    cue: '3 × 10 each · braced on bench, pull to hip',
    video: 'dumbbell row single arm proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="40" y="70" width="80" height="12" stroke="currentColor" fill="none"/><circle cx="55" cy="55" r="7" fill="currentColor"/><line x1="60" y1="55" x2="120" y2="60"/><line x1="55" y1="60" x2="55" y2="70"/><line x1="80" y1="55" x2="80" y2="70"/><line x1="120" y1="60" x2="140" y2="80"/><rect x="135" y="80" width="12" height="14" fill="currentColor"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  face_pull: {
    name: 'Face pulls',
    cue: '3 × 15 · pull to face, external rotation · posture gold',
    video: 'face pull cable rear delt form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="170" y1="20" x2="170" y2="60" stroke-width="3"/><line x1="170" y1="40" x2="140" y2="40" stroke-dasharray="2,2"/><circle cx="100" cy="40" r="7" fill="currentColor"/><line x1="100" y1="47" x2="100" y2="80"/><line x1="100" y1="80" x2="90" y2="100"/><line x1="100" y1="80" x2="110" y2="100"/><line x1="100" y1="40" x2="120" y2="30"/><line x1="100" y1="40" x2="120" y2="50"/><line x1="120" y1="30" x2="140" y2="40"/><line x1="120" y1="50" x2="140" y2="40"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  dead_hang: {
    name: 'Dead hang',
    cue: '3 × 20 sec · just hang · spine decompression for sciatica',
    video: 'dead hang exercise benefits form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="40" y1="15" x2="160" y2="15" stroke-width="3"/><line x1="85" y1="15" x2="85" y2="25"/><line x1="115" y1="15" x2="115" y2="25"/><circle cx="100" cy="40" r="7" fill="currentColor"/><line x1="100" y1="33" x2="85" y2="25"/><line x1="100" y1="33" x2="115" y2="25"/><line x1="100" y1="47" x2="100" y2="90"/><line x1="100" y1="90" x2="90" y2="110"/><line x1="100" y1="90" x2="110" y2="110"/></g></svg>`
  },
  bicep_curl: {
    name: 'Dumbbell bicep curl',
    cue: '3 × 12 · alternate arms, controlled tempo',
    video: 'dumbbell bicep curl proper form',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="25" r="7" fill="currentColor"/><line x1="100" y1="32" x2="100" y2="75"/><line x1="100" y1="75" x2="90" y2="100"/><line x1="100" y1="75" x2="110" y2="100"/><line x1="100" y1="45" x2="80" y2="60"/><line x1="80" y1="60" x2="90" y2="45"/><line x1="100" y1="45" x2="120" y2="60"/><line x1="120" y1="60" x2="110" y2="45"/><rect x="83" y="40" width="14" height="10" fill="currentColor"/><rect x="103" y="40" width="14" height="10" fill="currentColor"/><line x1="60" y1="100" x2="140" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },

  // ----- CORE -----
  plank: {
    name: 'Plank',
    cue: '3 × 30-45 sec · straight line head to heels',
    video: 'how to do a proper plank',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="40" cy="70" r="7" fill="currentColor"/><line x1="47" y1="70" x2="160" y2="70"/><line x1="50" y1="70" x2="40" y2="95"/><line x1="55" y1="73" x2="45" y2="95"/><line x1="155" y1="70" x2="155" y2="95"/><line x1="160" y1="70" x2="165" y2="95"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  side_plank: {
    name: 'Side plank',
    cue: '2 × 20 sec each side · oblique work',
    video: 'side plank proper form tutorial',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="40" y1="95" x2="50" y2="70"/><line x1="50" y1="70" x2="160" y2="70"/><circle cx="160" cy="70" r="7" fill="currentColor"/><line x1="160" y1="63" x2="160" y2="40"/><line x1="160" y1="77" x2="170" y2="95"/><line x1="20" y1="100" x2="180" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },
  pallof_press: {
    name: 'Pallof press',
    cue: '3 × 10 each side · cable, anti-rotation core',
    video: 'pallof press cable anti rotation',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="160" y="40" width="15" height="40" stroke="currentColor" fill="none"/><circle cx="80" cy="35" r="7" fill="currentColor"/><line x1="80" y1="42" x2="80" y2="75"/><line x1="80" y1="75" x2="70" y2="100"/><line x1="80" y1="75" x2="90" y2="100"/><line x1="80" y1="55" x2="130" y2="55"/><line x1="130" y1="55" x2="160" y2="60" stroke-dasharray="2,2"/><rect x="125" y="50" width="10" height="10" fill="currentColor"/><line x1="20" y1="100" x2="160" y2="100" stroke-width="1" opacity="0.3"/></g></svg>`
  },

  // ----- CARDIO -----
  treadmill_walk: {
    name: 'Treadmill walk',
    cue: '5.0 km/h, 2% incline · warm-up pace',
    video: null,
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="30" y="75" width="140" height="20" stroke="currentColor" fill="none"/><circle cx="100" cy="25" r="7" fill="currentColor"/><line x1="100" y1="32" x2="100" y2="65"/><line x1="100" y1="65" x2="85" y2="80"/><line x1="100" y1="65" x2="115" y2="80"/><line x1="100" y1="45" x2="85" y2="55"/><line x1="100" y1="45" x2="115" y2="55"/></g></svg>`
  },
  incline_walk: {
    name: 'Incline walk',
    cue: '5.5 km/h, 6% incline · liver-friendly cardio',
    video: null,
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="30" y1="95" x2="170" y2="55" stroke-width="3"/><circle cx="100" cy="28" r="7" fill="currentColor"/><line x1="100" y1="35" x2="100" y2="68"/><line x1="100" y1="68" x2="85" y2="80"/><line x1="100" y1="68" x2="115" y2="78"/></g></svg>`
  },
  hiit_intervals: {
    name: 'HIIT intervals',
    cue: '30s sprint / 60s walk · 10 rounds · visceral fat burner',
    video: 'HIIT treadmill workout beginner',
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="30" y="75" width="140" height="20" stroke="currentColor" fill="none"/><circle cx="100" cy="20" r="7" fill="currentColor"/><line x1="100" y1="27" x2="100" y2="55"/><line x1="100" y1="55" x2="75" y2="75"/><line x1="100" y1="55" x2="130" y2="70"/><line x1="100" y1="38" x2="80" y2="48"/><line x1="100" y1="38" x2="125" y2="30"/><line x1="40" y1="65" x2="50" y2="60" stroke-dasharray="2,2"/><line x1="155" y1="65" x2="165" y2="60" stroke-dasharray="2,2"/></g></svg>`
  },
  cycle_bike: {
    name: 'Stationary bike',
    cue: 'Moderate pace, level 5-7 · zero impact',
    video: null,
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="60" cy="85" r="15"/><circle cx="140" cy="85" r="15"/><line x1="60" y1="85" x2="100" y2="60"/><line x1="100" y1="60" x2="140" y2="85"/><line x1="100" y1="60" x2="100" y2="35"/><line x1="100" y1="35" x2="85" y2="25"/><line x1="100" y1="35" x2="115" y2="25"/><circle cx="115" cy="20" r="7" fill="currentColor"/></g></svg>`
  },
  elliptical: {
    name: 'Elliptical',
    cue: 'Moderate-high resistance · zero impact',
    video: null,
    svg: `<svg viewBox="0 0 200 120"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="100" cy="25" r="7" fill="currentColor"/><line x1="100" y1="32" x2="100" y2="70"/><line x1="100" y1="70" x2="70" y2="90"/><line x1="100" y1="70" x2="130" y2="90"/><ellipse cx="100" cy="90" rx="50" ry="8"/><line x1="100" y1="45" x2="75" y2="55"/><line x1="100" y1="45" x2="125" y2="50"/></g></svg>`
  }
};

// ===== 5-DAY WORKOUT SPLIT =====
// Mon=Legs/Glutes, Tue=Push, Wed=Mobility/Cardio, Thu=Pull, Fri=Class/Flex, Sat=Full+HIIT, Sun=Rest

const WORKOUT_SPLITS = {
  legs: {
    id: 'legs',
    name: 'Lower Body & Glutes',
    icon: '🦵',
    focus: 'Glute activation · sciatica protection · right-side asymmetry',
    exercises: ['treadmill_walk','glute_bridge','hip_flexor_stretch','bodyweight_squat','reverse_lunge','romanian_deadlift','step_up','hip_thrust','hip_abduction','leg_curl','calf_raise','plank','figure4','incline_walk']
  },
  push: {
    id: 'push',
    name: 'Upper Push',
    icon: '💪',
    focus: 'Chest · shoulders · triceps',
    exercises: ['treadmill_walk','wall_angels','cat_cow','incline_db_press','db_bench_press','shoulder_press','lateral_raise','incline_pushup','tricep_pushdown','plank','side_plank','foam_roll']
  },
  mobility: {
    id: 'mobility',
    name: 'Mobility & Recovery',
    icon: '🧘',
    focus: 'Active recovery · sciatica · stress relief',
    exercises: ['treadmill_walk','foam_roll','cat_cow','childs_pose','hip_flexor_stretch','piriformis_stretch','glute_bridge','dead_bug','bird_dog','wall_angels','figure4','incline_walk','forward_fold']
  },
  pull: {
    id: 'pull',
    name: 'Upper Pull',
    icon: '🎯',
    focus: 'Back · biceps · posture correction',
    exercises: ['treadmill_walk','cat_cow','wall_angels','lat_pulldown','db_row','standing_cable_row','face_pull','bicep_curl','dead_hang','plank','foam_roll']
  },
  fullbody_hiit: {
    id: 'fullbody_hiit',
    name: 'Full Body + HIIT',
    icon: '🔥',
    focus: 'Visceral fat burn · metabolic conditioning',
    exercises: ['treadmill_walk','cat_cow','glute_bridge','goblet_squat','db_bench_press','db_row','shoulder_press','romanian_deadlift','plank','hiit_intervals','foam_roll']
  },
  class: {
    id: 'class',
    name: 'Group Class',
    icon: '🎵',
    focus: 'Instructor-led · variety · sciatica-safe options',
    classOptions: ['Cycling / My Ride','Rhythm n Ride','Brazil Butt Blast','Flow Yoga','Core (skip sit-ups, Russian twists)','Belly Dance','Fusion'],
    exercises: []
  },
  rest: {
    id: 'rest',
    name: 'Rest Day',
    icon: '😌',
    focus: 'Recovery · 30-min walk only',
    exercises: ['incline_walk','forward_fold','figure4']
  }
};

// Day-of-week → workout assignment (0=Sun, 1=Mon, ...)
// Mon=Legs, Tue=Push, Wed=Mobility, Thu=Pull, Fri=Class, Sat=FullBody+HIIT, Sun=Rest
const DEFAULT_WEEKLY_SCHEDULE = ['rest','legs','push','mobility','pull','class','fullbody_hiit'];

function getDefaultWorkoutForDate(date) {
  return DEFAULT_WEEKLY_SCHEDULE[date.getDay()];
}

// ===== MEAL LIBRARY (DESI-LEANING, NO GRILL REQUIRED) =====
// All meals achievable with pan, oven, stovetop
const MEAL_LIBRARY = {
  breakfast: [
    { id: 'b1', name: 'Masala oats with eggs', cuisine: '🇮🇳', kcal: 420, protein: 28, carbs: 38, fat: 16, detail: '½ cup oats cooked with onion, tomato, green chili, turmeric, ginger · 2 boiled eggs · black coffee', helper: 'Cook oats in water (1:2 ratio). Add diced onion/tomato/chili while cooking. Finish with chopped coriander. Eggs boiled separately, 8 min.' },
    { id: 'b2', name: 'Veg paratha-free + eggs', cuisine: '🇵🇰', kcal: 440, protein: 30, carbs: 36, fat: 18, detail: '1 multigrain roti + 3 scrambled eggs (in 1 tsp olive oil) + sliced cucumber/tomato salad', helper: 'Eggs scrambled in NON-STICK pan with 1 tsp olive oil. NO butter/ghee. Multigrain roti from market or atta.' },
    { id: 'b3', name: 'Anda bhurji + roti', cuisine: '🇮🇳', kcal: 430, protein: 26, carbs: 32, fat: 20, detail: '3 eggs scrambled with onion, tomato, green chili, turmeric, coriander · 1 multigrain roti · green tea', helper: '1 tsp olive oil only. Onion + tomato + chili first, then eggs. NO cream, NO ghee.' },
    { id: 'b4', name: 'Greek yogurt bowl', cuisine: '🌍', kcal: 410, protein: 24, carbs: 42, fat: 14, detail: '200g Greek yogurt · 30g rolled oats · 5 walnut halves · cinnamon · ½ banana · black coffee', helper: 'No prep — assemble in bowl.' },
    { id: 'b5', name: 'Egg paneer scramble', cuisine: '🇮🇳', kcal: 460, protein: 34, carbs: 18, fat: 28, detail: '2 eggs + 60g paneer crumbled with spinach, onion, turmeric, cumin · 1 multigrain roti · black coffee', helper: 'Pan-scramble eggs + paneer + greens in 1 tsp olive oil.' },
    { id: 'b6', name: 'Chana chaat + boiled eggs', cuisine: '🇵🇰', kcal: 420, protein: 28, carbs: 44, fat: 12, detail: '1 cup boiled chickpeas + diced onion/tomato/cucumber + lemon + chaat masala · 2 boiled eggs · green tea', helper: 'Boil chickpeas day before or use canned (rinsed). Assemble cold.' },
    { id: 'b7', name: 'Shakshuka style', cuisine: '🇦🇪', kcal: 440, protein: 26, carbs: 24, fat: 26, detail: '3 eggs poached in tomato-pepper-onion sauce with cumin · 1 slice multigrain · black coffee', helper: 'Pan: 1 tsp olive oil, sauté onion+pepper+tomato, crack eggs on top, cover and cook 5 min.' }
  ],
  midmorning: [
    { id: 'm1', name: 'Yogurt + walnuts + apple', cuisine: '🌍', kcal: 280, protein: 16, carbs: 28, fat: 12, detail: '150g Greek yogurt · 5 walnut halves · small apple', helper: 'No prep.' },
    { id: 'm2', name: 'Hummus + veg sticks', cuisine: '🇦🇪', kcal: 240, protein: 10, carbs: 22, fat: 14, detail: '3 tbsp hummus · cucumber, carrot, bell pepper sticks · 5 almonds', helper: 'Hummus from Spinneys/Carrefour. Cut veg sticks fresh.' },
    { id: 'm3', name: 'Boiled eggs + fruit', cuisine: '🌍', kcal: 220, protein: 14, carbs: 18, fat: 11, detail: '2 boiled eggs · small pear or apple · green tea', helper: 'Boil eggs 8 min, store in fridge for 3 days.' },
    { id: 'm4', name: 'Cottage cheese bowl', cuisine: '🌍', kcal: 260, protein: 22, carbs: 16, fat: 12, detail: '½ cup cottage cheese · handful berries · 5 almonds', helper: 'No prep.' },
    { id: 'm5', name: 'Roasted chana', cuisine: '🇮🇳', kcal: 250, protein: 12, carbs: 32, fat: 8, detail: '½ cup roasted chickpeas (lightly spiced) · small apple · green tea', helper: 'Roast chickpeas in oven 200°C for 25 min with paprika + salt + 1 tsp olive oil. Stores 1 week.' },
    { id: 'm6', name: 'Protein smoothie', cuisine: '🌍', kcal: 270, protein: 26, carbs: 22, fat: 8, detail: '1 scoop whey + water · ½ banana · 1 tbsp peanut butter blended with ice', helper: 'Blend.' },
    { id: 'm7', name: 'Labneh + cucumber', cuisine: '🇦🇪', kcal: 230, protein: 12, carbs: 8, fat: 16, detail: '3 tbsp labneh · cucumber slices · 5 olives · 5 almonds · drizzle olive oil', helper: 'No prep.' }
  ],
  lunch: [
    { id: 'l1', name: 'Chicken tikka + roti + salad', cuisine: '🇮🇳', kcal: 510, protein: 44, carbs: 38, fat: 18, detail: '150g chicken tikka (oven-baked) · 1 multigrain roti · large salad with olive oil-lemon', helper: 'Tikka marinade: 1 tbsp yogurt + lemon + red chili + cumin + coriander + ginger-garlic. Bake at 200°C for 18 min on tray.' },
    { id: 'l2', name: 'Daal + brown rice + chicken', cuisine: '🇵🇰', kcal: 530, protein: 42, carbs: 56, fat: 12, detail: '1 cup masoor daal (1 tsp oil) · ½ cup brown rice · 100g shredded chicken · cucumber salad', helper: 'Daal: 1 tsp olive oil tarka with cumin seeds, NO ghee. Chicken: boil + shred with salt + black pepper.' },
    { id: 'l3', name: 'Chicken karahi (lean) + cauli rice', cuisine: '🇵🇰', kcal: 490, protein: 46, carbs: 18, fat: 26, detail: '150g chicken karahi (2 tsp oil max, no cream) · 1 cup cauliflower rice · raita (yogurt + cucumber)', helper: 'Karahi: 2 tsp olive oil, onion + tomato + ginger-garlic + green chili + spices. NO butter, NO cream. Cauli rice: grate cauliflower, dry-fry 5 min.' },
    { id: 'l4', name: 'Salmon + quinoa + greens', cuisine: '🌍', kcal: 520, protein: 38, carbs: 36, fat: 22, detail: '150g pan-seared salmon · ½ cup quinoa · sautéed spinach + garlic', helper: 'Salmon: pan-sear skin-side down 4 min, flip 3 min. 1 tsp olive oil.' },
    { id: 'l5', name: 'Beef stir-fry + brown rice', cuisine: '🇨🇳', kcal: 510, protein: 40, carbs: 42, fat: 18, detail: '120g lean beef strips stir-fried with broccoli, bok choy, ginger, soy · ⅓ cup brown rice', helper: 'High heat, 1 tsp sesame oil. Beef first 2 min, remove, then veg 3 min, combine.' },
    { id: 'l6', name: 'Chicken biryani (lean)', cuisine: '🇮🇳', kcal: 530, protein: 38, carbs: 58, fat: 14, detail: '150g chicken + ½ cup brown rice biryani style (minimal oil) · cucumber raita', helper: 'Cook chicken in pressure cooker with biryani masala + 1 tsp olive oil. Add cooked brown rice + saffron water. NO ghee.' },
    { id: 'l7', name: 'Chickpea curry + roti', cuisine: '🇮🇳', kcal: 500, protein: 26, carbs: 62, fat: 16, detail: '1 cup chana masala (no cream) · 1 multigrain roti · 100g shredded chicken or paneer · onion-tomato salad', helper: 'Chana masala: 1 tsp oil, no cream, lots of tomato-onion. Add chicken or paneer separately.' }
  ],
  preworkout: [
    { id: 'p1', name: 'Banana + coffee', cuisine: '🌍', kcal: 110, protein: 1, carbs: 26, fat: 0, detail: '1 banana · black coffee · 45 min before gym', helper: 'No prep.' },
    { id: 'p2', name: 'Dates + coffee', cuisine: '🇦🇪', kcal: 100, protein: 1, carbs: 24, fat: 0, detail: '3 medjool dates · black coffee · 45 min before gym', helper: 'No prep.' },
    { id: 'p3', name: 'Apple + peanut butter', cuisine: '🌍', kcal: 180, protein: 5, carbs: 22, fat: 9, detail: '1 small apple · 1 tbsp natural peanut butter', helper: 'No prep.' },
    { id: 'p4', name: 'Rice cake + honey', cuisine: '🌍', kcal: 130, protein: 2, carbs: 28, fat: 1, detail: '2 rice cakes · 1 tsp honey · black coffee', helper: 'No prep.' },
    { id: 'p5', name: 'Banana + 5 almonds', cuisine: '🌍', kcal: 150, protein: 3, carbs: 28, fat: 5, detail: '1 banana · 5 almonds · green tea', helper: 'No prep.' },
    { id: 'p6', name: 'Dates + walnuts', cuisine: '🇦🇪', kcal: 160, protein: 3, carbs: 24, fat: 7, detail: '2 dates · 4 walnut halves · black coffee', helper: 'No prep.' },
    { id: 'p7', name: 'Oat energy bites', cuisine: '🌍', kcal: 150, protein: 4, carbs: 22, fat: 6, detail: '2 tbsp oats + 1 mashed date + 1 tsp peanut butter rolled into bites', helper: 'Mix, roll into balls, refrigerate. Prep batch weekly.' }
  ],
  postworkout: [
    { id: 'po1', name: 'Whey shake', cuisine: '🌍', kcal: 130, protein: 25, carbs: 4, fat: 1, detail: '1 scoop whey isolate + 250ml water · within 45 min', helper: 'Shaker bottle.' },
    { id: 'po2', name: 'Yogurt + walnuts', cuisine: '🌍', kcal: 240, protein: 18, carbs: 16, fat: 12, detail: '150g Greek yogurt · 5 walnut halves · 1 tsp honey', helper: 'No prep.' },
    { id: 'po3', name: 'Cottage cheese + berries', cuisine: '🌍', kcal: 200, protein: 22, carbs: 14, fat: 6, detail: '½ cup cottage cheese · handful berries · drizzle honey', helper: 'No prep.' },
    { id: 'po4', name: 'Egg + banana', cuisine: '🌍', kcal: 220, protein: 14, carbs: 22, fat: 10, detail: '2 boiled eggs · ½ banana · water', helper: 'Eggs from fridge.' },
    { id: 'po5', name: 'Tuna + cucumber', cuisine: '🌍', kcal: 180, protein: 26, carbs: 4, fat: 6, detail: '1 small can tuna in water · cucumber slices · lemon', helper: 'No prep.' },
    { id: 'po6', name: 'Chicken bites + fruit', cuisine: '🌍', kcal: 200, protein: 24, carbs: 14, fat: 6, detail: '80g cooked chicken pieces · 1 small fruit', helper: 'Pre-cooked chicken from lunch prep.' },
    { id: 'po7', name: 'Protein smoothie', cuisine: '🌍', kcal: 200, protein: 26, carbs: 16, fat: 3, detail: '1 scoop whey + ½ banana + ice + water', helper: 'Blend.' }
  ],
  dinner: [
    { id: 'd1', name: 'Pan-seared fish + sabzi', cuisine: '🇮🇳', kcal: 470, protein: 42, carbs: 18, fat: 26, detail: '150g pan-seared white fish · zucchini-onion sabzi · cucumber-tomato salad', helper: 'Fish: pan-sear 1 tsp olive oil, 3 min each side. Sabzi: sauté veg with cumin + turmeric.' },
    { id: 'd2', name: 'Chicken karahi (light) + salad', cuisine: '🇵🇰', kcal: 480, protein: 44, carbs: 14, fat: 26, detail: '150g chicken karahi (2 tsp oil, no cream) · large salad NO chapati/rice', helper: 'Same as lunch karahi. Skip carbs at dinner.' },
    { id: 'd3', name: 'Daal soup + chicken', cuisine: '🇮🇳', kcal: 460, protein: 38, carbs: 32, fat: 14, detail: '1 bowl masoor daal (soupy) · 120g shredded chicken · steamed greens', helper: 'Daal thinned to soup consistency. Chicken boiled + shredded.' },
    { id: 'd4', name: 'Egg + paneer scramble', cuisine: '🇮🇳', kcal: 470, protein: 32, carbs: 14, fat: 28, detail: '2 eggs + 60g paneer scrambled with spinach, onion, turmeric · large salad', helper: '1 tsp olive oil. Pan-scramble.' },
    { id: 'd5', name: 'Beef + greens stir-fry', cuisine: '🇨🇳', kcal: 480, protein: 40, carbs: 16, fat: 24, detail: '120g lean beef stir-fried with broccoli, bok choy, garlic · NO rice', helper: '1 tsp sesame oil, high heat, quick stir-fry.' },
    { id: 'd6', name: 'Oven-baked chicken + sweet potato', cuisine: '🌍', kcal: 490, protein: 44, carbs: 32, fat: 16, detail: '150g oven-baked chicken (herbs/lemon) · small baked sweet potato · steamed greens', helper: 'Marinate chicken with lemon-garlic-herbs. Bake at 200°C 22 min. Sweet potato wrapped in foil, bake same time.' },
    { id: 'd7', name: 'Tandoori-style chicken (oven) + salad', cuisine: '🇮🇳', kcal: 470, protein: 46, carbs: 12, fat: 22, detail: '150g oven-baked chicken (tandoori marinade) · large salad · raita', helper: 'Tandoori paste + yogurt + lemon marinade. Oven 220°C 18-20 min. Raita: yogurt + cucumber + mint.' }
  ]
};

// ===== HABITS =====
const HABITS_PLAN = [
  { id: 'h1', title: 'Morning weight log', meta: 'Same time, before food' },
  { id: 'h5', title: 'No soft drinks/juice/fried', meta: 'Liver-critical · zero compromises' },
  { id: 'h6', title: 'Morning mobility (10 min)', meta: 'Hip flexor + glute bridge + dead bug' },
  { id: 'h7', title: '7+ hours sleep', meta: 'Recovery happens here' },
  { id: 'h8', title: '7,000+ steps', meta: 'Walking helps liver fat reduction' },
  { id: 'h9', title: 'Caffeine before 4:30pm only', meta: 'Wellbutrin + sleep interaction' }
];

// ===== PHASES =====
const PHASES = [
  { name: 'Foundation', icon: '🌱', dayStart: 1, dayEnd: 21, description: 'Mobility, posture, bodyweight. Wake the body up safely.' },
  { name: 'Build', icon: '🏗', dayStart: 22, dayEnd: 49, description: 'Light weights, compound movements, form-focused.' },
  { name: 'Push', icon: '🔥', dayStart: 50, dayEnd: 87, description: 'Progressive overload. Heavier loads, shorter rest.' }
];

function getCurrentPhase(date) {
  const dayNum = dayNumber(date);
  return PHASES.find(p => dayNum >= p.dayStart && dayNum <= p.dayEnd) || PHASES[2];
}

// ===== CHECKPOINTS =====
const CHECKPOINTS = [
  { week: 4, date: '2026-06-22', title: 'Week 4 Reassessment', tasks: ['Book Fitness First InBody re-scan','Take front/side/back photos','Compare weight: target 74.5-75.5kg','Compare body fat %: target -1.5-2%','Verify muscle mass unchanged (>31kg)'] },
  { week: 8, date: '2026-07-20', title: 'Week 8 Bloodwork', tasks: ['Get ALT/AST liver panel re-test','Get thyroid panel re-test','InBody scan #3','Photos #3','Target weight: 73kg','Verify ALT trending down'] },
  { week: 12, date: '2026-08-17', title: 'Final Assessment', tasks: ['Final InBody scan','Final bloodwork','Final photos','Compare to Day 1','Target: 70kg, <22% body fat','Plan next phase'] }
];

// ===== DAY UTILITIES =====
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

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function shortDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(targetDateStr) {
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}
