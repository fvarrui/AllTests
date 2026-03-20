// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS COMPARTIDOS (sobreescribibles desde config.js)
// ═══════════════════════════════════════════════════════════════════════════

// Raíz del repo: sube desde lib/quiz.js hasta el directorio padre (funciona con file:// y http://)
const _BASE = document.currentScript.src.replace(/\/lib\/[^/]+$/, '/');

// Nombre de la carpeta del tema (definido en config.js o 'default' si no se especifica)
const _THEME = (typeof CONFIG !== 'undefined' && CONFIG.theme) ? CONFIG.theme : 'default';

const QUIZ_DEFAULTS = {

  themes: [
    { file: _BASE + `themes/${_THEME}/dark.css`,  label: '🌙' },
    { file: _BASE + `themes/${_THEME}/light.css`, label: '☀️' },
  ],

  score: {
    thresholds: { excellent: 80, good: 60, average: 40 },
    messages: {
      excellent: '¡Excelente resultado! 🎉',
      good:      'Buen resultado, sigue practicando',
      average:   'Necesitas repasar algunos temas',
      poor:      'Hay que estudiar más 💪',
    },
  },

};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTES HTML
// ═══════════════════════════════════════════════════════════════════════════

function createThemeToggle() {
  return `<button id="themeToggle" title="Cambiar tema"></button>`;
}

function createCorrectionModeCard() {
  return `
    <div class="config-card">
      <h3>Modalidad de corrección</h3>
      <div class="mode-grid">
        <button class="mode-btn selected" data-mode="immediate" onclick="selectMode(this)">
          <div class="mode-icon">⚡</div>
          <div class="mode-name">Inmediata</div>
          <div class="mode-desc">Corrección tras cada respuesta</div>
        </button>
        <button class="mode-btn" data-mode="final" onclick="selectMode(this)">
          <div class="mode-icon">📋</div>
          <div class="mode-name">Final</div>
          <div class="mode-desc">Corrección al terminar el test</div>
        </button>
      </div>
    </div>`;
}

function createQuestionSelectCard() {
  return `
    <div class="config-card">
      <h3>Selección de preguntas</h3>
      <div class="selection-tabs">
        <button class="sel-tab active" onclick="switchSelTab('cantidad', this)">Por cantidad</button>
        <button class="sel-tab" onclick="switchSelTab('rango', this)">Por rango</button>
      </div>
      <div class="sel-panel active" id="panel-cantidad">
        <div class="slider-row">
          <label>Cantidad</label>
          <input type="range" id="numQ" min="5" max="540" step="5" value="30" oninput="updateSlider()">
          <span class="slider-val" id="sliderVal">30</span>
        </div>
        <div id="presetButtons" style="display:flex; gap:.5rem; margin-top:1rem; flex-wrap:wrap;"></div>
      </div>
      <div class="sel-panel" id="panel-rango">
        <div class="range-inputs">
          <div class="range-field">
            <label>Desde pregunta</label>
            <input type="number" id="rangeFrom" min="1" max="540" value="1" oninput="updateRangeInfo()">
          </div>
          <div class="range-field">
            <label>Hasta pregunta</label>
            <input type="number" id="rangeTo" min="1" max="540" value="100" oninput="updateRangeInfo()">
          </div>
        </div>
        <div class="range-info" id="rangeInfo">
          Preguntas <span id="rangeFromLabel">1</span> – <span id="rangeToLabel">100</span> · <span id="rangeCount">100</span> preguntas en este rango
        </div>
        <div class="range-error" id="rangeError">⚠ El valor "desde" debe ser menor que "hasta"</div>
      </div>
    </div>`;
}

function createQuestionOrderCard() {
  return `
    <div class="config-card">
      <h3>Orden de preguntas</h3>
      <div class="mode-grid">
        <button class="mode-btn selected" data-order="random" onclick="selectOrder(this)">
          <div class="mode-icon">🔀</div>
          <div class="mode-name">Aleatorio</div>
          <div class="mode-desc">Preguntas mezcladas</div>
        </button>
        <button class="mode-btn" data-order="sequential" onclick="selectOrder(this)">
          <div class="mode-icon">📑</div>
          <div class="mode-name">Secuencial</div>
          <div class="mode-desc">En orden del PDF</div>
        </button>
      </div>
    </div>`;
}

function createMenuScreen() {
  return `
    <div id="menu" class="screen active">
      <div class="menu-body">
        <div class="menu-inner">
          <div class="logo-badge" id="logoBadge"></div>
          <h1 id="appName"></h1>
          <h2 id="appSubtitle"></h2>
          <p class="subtitle"><span id="processType"></span> · <strong><span id="totalQuestions">…</span> preguntas</strong> disponibles <a id="docLink" href="#" target="_blank" rel="noopener" style="display:none; font-size:1rem; text-decoration:none; opacity:.7; vertical-align:middle;">📄</a></p>
          ${createCorrectionModeCard()}
          ${createQuestionSelectCard()}
          ${createQuestionOrderCard()}
          <button class="start-btn" onclick="startQuiz()">Comenzar test →</button>
        </div>
      </div>
      <footer>Made with ❤️ by @fvarrui</footer>
    </div>`;
}

function createQuizScreen() {
  return `
    <div id="quiz" class="screen">
      <div class="quiz-header">
        <div class="quiz-header-left">
          <div class="q-counter">Pregunta <span id="qNum">1</span> de <span id="qTotal">30</span></div>
          <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
        </div>
        <button class="cancel-btn" id="themeToggleQuiz" title="Cambiar tema"></button>
        <button class="cancel-btn" onclick="confirmCancel()">✕ Cancelar</button>
      </div>
      <div class="quiz-body">
        <div class="q-number-tag" id="qTag">Q1</div>
        <div class="question-text" id="questionText"></div>
        <div class="options-list" id="optionsList"></div>
        <div id="feedbackBox" style="display:none"></div>
      </div>
      <div class="quiz-footer">
        <button class="next-btn" id="nextBtn" onclick="nextQuestion()" disabled>Siguiente →</button>
      </div>
    </div>`;
}

function createResultsScreen() {
  return `
    <div id="results" class="screen">
      <div class="results-inner">
        <div class="results-badge">📊 Informe de resultados</div>
        <h1 style="font-size:2rem; margin-bottom:.3rem;" id="resultsTitle">Test completado</h1>
        <p style="color:var(--muted); margin-bottom:1.5rem;" id="resultsSubtitle"></p>
        <div class="score-hero">
          <div class="score-ring">
            <svg viewBox="0 0 100 100">
              <circle class="ring-bg" cx="50" cy="50" r="42"/>
              <circle class="ring-fill" id="ringFill" cx="50" cy="50" r="42"
                stroke-dasharray="263.9" stroke-dashoffset="263.9"/>
            </svg>
            <div class="score-label">
              <div class="score-pct" id="scorePct">0%</div>
              <div style="font-size:.65rem; color:var(--muted); margin-top:2px;">nota</div>
            </div>
          </div>
          <div class="score-info">
            <h2 id="scorePoints">0 / 0 pts</h2>
            <p class="score-subtitle" id="scoreDesc"></p>
            <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
              <span id="modeBadge" style="background:var(--accent)20; border:1px solid var(--accent)40; border-radius:6px; padding:.2rem .6rem; font-size:.75rem; color:var(--accent);"></span>
            </div>
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-card green"><div class="stat-val" id="statsCorrect">0</div><div class="stat-label">✓ Correctas</div></div>
          <div class="stat-card red"><div class="stat-val" id="statsWrong">0</div><div class="stat-label">✗ Incorrectas</div></div>
          <div class="stat-card yellow"><div class="stat-val" id="statsSkipped">0</div><div class="stat-label">— Sin contestar</div></div>
        </div>
        <div class="detail-section" id="wrongDetail">
          <div class="detail-header" onclick="toggleDetail('wrongList', this)">
            <h3>❌ Preguntas falladas</h3><span class="detail-toggle">▼</span>
          </div>
          <div class="detail-body" id="wrongList"></div>
        </div>
        <div class="detail-section" id="skippedDetail">
          <div class="detail-header" onclick="toggleDetail('skippedList', this)">
            <h3>— Preguntas sin contestar</h3><span class="detail-toggle">▼</span>
          </div>
          <div class="detail-body" id="skippedList"></div>
        </div>
        <div class="results-actions">
          <button class="btn-primary" onclick="goHome()">🏠 Menú principal</button>
          <button class="btn-secondary" onclick="restartSame()">🔁 Repetir test</button>
        </div>
      </div>
    </div>`;
}

function createConfirmDialog() {
  return `
    <div class="confirm-overlay" id="confirmOverlay">
      <div class="confirm-box">
        <h3>¿Cancelar el test?</h3>
        <p>Las preguntas no respondidas contarán como 0 puntos y se mostrará el informe de resultados hasta donde hayas llegado.</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="closeConfirm()" style="flex:1">Continuar</button>
          <button class="btn-primary" onclick="cancelQuiz()" style="flex:1; background:linear-gradient(135deg,var(--red),#c0392b)">Cancelar test</button>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER + INIT
// ═══════════════════════════════════════════════════════════════════════════

document.body.insertAdjacentHTML('beforeend', createThemeToggle());
document.body.insertAdjacentHTML('beforeend',
  `<a id="backBtn" href="../" title="Volver al menú principal" style="position:fixed;top:1rem;left:1rem;z-index:200;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:.4rem .85rem;font-size:.85rem;font-weight:600;color:var(--muted);text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:border-color .2s,color .2s;">← Volver</a>`);
document.body.insertAdjacentHTML('beforeend', createMenuScreen());
document.body.insertAdjacentHTML('beforeend', createQuizScreen());
document.body.insertAdjacentHTML('beforeend', createResultsScreen());
document.body.insertAdjacentHTML('beforeend', createConfirmDialog());

// ── THEME ────────────────────────────────────────────────────────────────────
(function initTheme() {
  const themes = CONFIG.themes ?? QUIZ_DEFAULTS.themes;
  const link   = document.getElementById('appTheme');

  function currentIndex() {
    return localStorage.getItem('quizThemeMode') === 'light' ? 1 : 0;
  }

  function applyTheme(idx) {
    link.href = themes[idx].file;
    localStorage.setItem('quizThemeMode', idx === 0 ? 'dark' : 'light');
    const nextLabel = themes[(idx + 1) % themes.length].label;
    document.querySelectorAll('#themeToggle, #themeToggleQuiz')
      .forEach(b => { b.textContent = nextLabel; });
  }

  function cycle() { applyTheme((currentIndex() + 1) % themes.length); }

  document.getElementById('themeToggle').addEventListener('click', cycle);
  document.getElementById('themeToggleQuiz').addEventListener('click', cycle);
  applyTheme(currentIndex());
})();

// ── APLICAR CONFIG ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const total = ALL_QUESTIONS.length;

  document.title                                        = CONFIG.title;
  document.getElementById('logoBadge').textContent      = CONFIG.badge;
  document.getElementById('appName').textContent        = CONFIG.appName;
  document.getElementById('appSubtitle').innerHTML      = CONFIG.appSubtitle;
  document.getElementById('processType').textContent    = CONFIG.processType;
  document.getElementById('totalQuestions').textContent = total;
  if (CONFIG.docLink) {
    const a = document.getElementById('docLink');
    a.href = CONFIG.docLink;
    a.style.display = 'inline';
  }

  const numQEl = document.getElementById('numQ');
  numQEl.min   = CONFIG.defaults.sliderMin;
  numQEl.max   = total;
  numQEl.step  = CONFIG.defaults.sliderStep;
  numQEl.value = CONFIG.defaults.numQuestions;
  document.getElementById('sliderVal').textContent = CONFIG.defaults.numQuestions;

  const container = document.getElementById('presetButtons');
  CONFIG.defaults.presets.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'cancel-btn';
    btn.textContent = n;
    btn.onclick = () => setPreset(n);
    container.appendChild(btn);
  });
  const allBtn = document.createElement('button');
  allBtn.className = 'cancel-btn';
  allBtn.textContent = 'Todas';
  allBtn.onclick = () => setPreset(ALL_QUESTIONS.length);
  container.appendChild(allBtn);

  const rFrom = document.getElementById('rangeFrom');
  const rTo   = document.getElementById('rangeTo');
  rFrom.max = rTo.max = total;
  rFrom.value = CONFIG.defaults.rangeFrom;
  rTo.value   = CONFIG.defaults.rangeTo;
});

// ═══════════════════════════════════════════════════════════════════════════
// LÓGICA DEL TEST
// ═══════════════════════════════════════════════════════════════════════════

let mode          = 'immediate';
let order         = 'random';
let selectionMode = 'cantidad';
let questions     = [];
let current       = 0;
let answers       = [];
let numQuestions  = CONFIG.defaults.numQuestions;
let rangeFrom     = CONFIG.defaults.rangeFrom;
let rangeTo       = CONFIG.defaults.rangeTo;
let lastConfig    = {};

// ── MENU ─────────────────────────────────────────────────────────────────────
function selectMode(btn) {
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  mode = btn.dataset.mode;
}

function selectOrder(btn) {
  document.querySelectorAll('[data-order]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  order = btn.dataset.order;
}

function switchSelTab(tab, btn) {
  selectionMode = tab;
  document.querySelectorAll('.sel-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.sel-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

function updateSlider() {
  numQuestions = +document.getElementById('numQ').value;
  document.getElementById('sliderVal').textContent = numQuestions;
}

function setPreset(n) {
  document.getElementById('numQ').value = n;
  numQuestions = n;
  document.getElementById('sliderVal').textContent = n;
}

function updateRangeInfo() {
  const from   = +document.getElementById('rangeFrom').value;
  const to     = +document.getElementById('rangeTo').value;
  const err    = document.getElementById('rangeError');
  const fromIn = document.getElementById('rangeFrom');
  const toIn   = document.getElementById('rangeTo');
  if (from >= to) {
    err.style.display = 'block';
    fromIn.classList.add('error'); toIn.classList.add('error');
  } else {
    err.style.display = 'none';
    fromIn.classList.remove('error'); toIn.classList.remove('error');
    const count = ALL_QUESTIONS.filter(q => q.id >= from && q.id <= to).length;
    document.getElementById('rangeFromLabel').textContent = from;
    document.getElementById('rangeToLabel').textContent   = to;
    document.getElementById('rangeCount').textContent     = count;
  }
  rangeFrom = from; rangeTo = to;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  let pool;
  if (selectionMode === 'rango') {
    const from = +document.getElementById('rangeFrom').value;
    const to   = +document.getElementById('rangeTo').value;
    if (from >= to) { updateRangeInfo(); return; }
    rangeFrom = from; rangeTo = to;
    pool = ALL_QUESTIONS.filter(q => q.id >= from && q.id <= to);
    if (order === 'random') pool = shuffle(pool);
    questions = pool;
  } else {
    pool = order === 'random' ? shuffle(ALL_QUESTIONS) : [...ALL_QUESTIONS];
    questions = pool.slice(0, numQuestions);
  }
  answers = new Array(questions.length).fill(null);
  current = 0;
  lastConfig = { mode, order, numQuestions, selectionMode, rangeFrom, rangeTo };
  showScreen('quiz');
  renderQuestion();
}

// ── QUIZ ─────────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('themeToggle').style.display = id === 'quiz' ? 'none' : '';
  document.getElementById('backBtn').style.display     = id === 'quiz' ? 'none' : '';
  window.scrollTo(0, 0);
}

function renderQuestion() {
  const q     = questions[current];
  const total = questions.length;

  document.getElementById('qNum').textContent          = current + 1;
  document.getElementById('qTotal').textContent        = total;
  document.getElementById('qTag').textContent          = 'Q' + (current + 1) + ' · #' + q.id;
  document.getElementById('progressFill').style.width  = (current / total * 100).toFixed(1) + '%';
  document.getElementById('questionText').textContent  = q.question;
  document.getElementById('feedbackBox').style.display = 'none';

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled    = true;
  nextBtn.textContent = current === total - 1 ? 'Finalizar test ✓' : 'Siguiente →';

  const list       = document.getElementById('optionsList');
  list.innerHTML   = '';
  const answeredIdx = answers[current];

  ['A','B','C','D'].forEach(letter => {
    const btn = document.createElement('button');
    btn.className      = 'option-btn';
    btn.dataset.letter = letter;
    btn.innerHTML      = `<span class="option-key">${letter}</span><span>${q.options[letter]}</span>`;

    if (mode === 'immediate' && answeredIdx !== null) {
      btn.classList.add('disabled');
      if (letter === q.correct)                               btn.classList.add('correct');
      if (letter === answeredIdx && answeredIdx !== q.correct) btn.classList.add('wrong');
      showFeedback(answeredIdx === q.correct);
      nextBtn.disabled = false;
    } else {
      btn.onclick = () => chooseAnswer(letter);
    }
    list.appendChild(btn);
  });

  if (mode === 'final' && answeredIdx !== null) {
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.letter === answeredIdx) {
        b.style.borderColor = 'var(--accent)';
        b.style.background  = '#1e2d4a';
      }
    });
    nextBtn.disabled = false;
  }
}

function chooseAnswer(letter) {
  answers[current] = letter;
  const q    = questions[current];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => { b.onclick = null; b.classList.add('disabled'); });

  if (mode === 'immediate') {
    btns.forEach(b => {
      if (b.dataset.letter === q.correct)                       b.classList.add('correct');
      if (b.dataset.letter === letter && letter !== q.correct)  b.classList.add('wrong');
    });
    showFeedback(letter === q.correct);
  } else {
    btns.forEach(b => {
      if (b.dataset.letter === letter) {
        b.style.borderColor = 'var(--accent)';
        b.style.background  = '#1e2d4a';
        b.classList.remove('disabled');
        b.onclick = () => { answers[current] = null; renderQuestion(); };
      } else {
        b.classList.remove('disabled');
        b.onclick = () => chooseAnswer(b.dataset.letter);
      }
    });
  }
  document.getElementById('nextBtn').disabled = false;
}

function showFeedback(isCorrect) {
  const box = document.getElementById('feedbackBox');
  box.style.display = 'flex';
  box.className     = 'feedback-box ' + (isCorrect ? 'correct' : 'wrong');
  box.innerHTML     = `
    <span class="feedback-icon">${isCorrect ? '✓' : '✗'}</span>
    <span>${isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta. La opción correcta está marcada en verde.'}</span>`;
}

function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
    window.scrollTo(0, 0);
  } else {
    showResults();
  }
}

// ── CANCEL ───────────────────────────────────────────────────────────────────
function confirmCancel() { document.getElementById('confirmOverlay').classList.add('active'); }
function closeConfirm()  { document.getElementById('confirmOverlay').classList.remove('active'); }
function cancelQuiz()    { closeConfirm(); showResults(true); }

// ── RESULTS ──────────────────────────────────────────────────────────────────
function showResults(cancelled = false) {
  showScreen('results');

  const total = questions.length;
  let correct = 0, wrong = 0, skipped = 0;
  const wrongItems = [], skippedItems = [];

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (ans === null)           { skipped++; skippedItems.push({ q, i }); }
    else if (ans === q.correct) { correct++; }
    else                        { wrong++;   wrongItems.push({ q, i, ans }); }
  });

  const pct = total > 0 ? Math.round(correct / total * 100) : 0;

  document.getElementById('resultsTitle').textContent    = cancelled ? 'Test cancelado' : 'Test completado';
  document.getElementById('resultsSubtitle').textContent = cancelled
    ? `Respondiste ${total - skipped} de ${total} preguntas antes de cancelar`
    : `Has respondido las ${total} preguntas`;

  const ring = document.getElementById('ringFill');
  const { thresholds, messages } = CONFIG.score ?? QUIZ_DEFAULTS.score;
  const { excellent, good, average } = thresholds;
  const scoreColor = pct >= good ? 'var(--green)' : pct >= average ? 'var(--yellow)' : 'var(--red)';
  ring.style.stroke = scoreColor;
  setTimeout(() => { ring.style.strokeDashoffset = 263.9 - (pct / 100) * 263.9; }, 100);
  document.getElementById('scorePct').textContent = pct + '%';
  document.getElementById('scorePct').style.color = scoreColor;

  document.getElementById('scorePoints').textContent = `${correct} / ${total} pts`;
  document.getElementById('scoreDesc').textContent =
    pct >= excellent ? messages.excellent :
    pct >= good      ? messages.good      :
    pct >= average   ? messages.average   : messages.poor;

  const selInfo = lastConfig.selectionMode === 'rango'
    ? ` · 📌 Rango #${lastConfig.rangeFrom}–#${lastConfig.rangeTo}` : '';
  document.getElementById('modeBadge').textContent =
    (lastConfig.mode === 'immediate' ? '⚡ Modalidad inmediata' : '📋 Modalidad final') +
    ' · ' + (lastConfig.order === 'random' ? '🔀 Aleatorio' : '📑 Secuencial') + selInfo;

  document.getElementById('statsCorrect').textContent = correct;
  document.getElementById('statsWrong').textContent   = wrong;
  document.getElementById('statsSkipped').textContent = skipped;

  const wrongList = document.getElementById('wrongList');
  document.getElementById('wrongDetail').style.display = wrongItems.length ? '' : 'none';
  wrongList.innerHTML = wrongItems.map(({ q, i, ans }) => `
    <div class="detail-item">
      <span class="detail-icon">❌</span>
      <span class="detail-q-num">Q${i+1}·#${q.id}</span>
      <div class="detail-content">
        <div class="detail-q-text">${q.question}</div>
        <div class="detail-ans">
          <span class="your-ans">Tu respuesta: ${ans}) ${q.options[ans]}</span><br>
          <span class="correct-ans">✓ Correcta: ${q.correct}) ${q.options[q.correct]}</span>
        </div>
      </div>
    </div>`).join('');

  const skippedList = document.getElementById('skippedList');
  document.getElementById('skippedDetail').style.display = skippedItems.length ? '' : 'none';
  skippedList.innerHTML = skippedItems.map(({ q, i }) => `
    <div class="detail-item">
      <span class="detail-icon">—</span>
      <span class="detail-q-num">Q${i+1}·#${q.id}</span>
      <div class="detail-content">
        <div class="detail-q-text">${q.question}</div>
        <div class="detail-ans">
          <span class="skipped">Sin contestar · Correcta: ${q.correct}) ${q.options[q.correct]}</span>
        </div>
      </div>
    </div>`).join('');
}

function toggleDetail(listId, header) {
  document.getElementById(listId).classList.toggle('open');
  header.querySelector('.detail-toggle').classList.toggle('open');
}

function goHome() { showScreen('menu'); }

function restartSame() {
  mode          = lastConfig.mode;
  order         = lastConfig.order;
  numQuestions  = lastConfig.numQuestions;
  selectionMode = lastConfig.selectionMode || 'cantidad';
  rangeFrom     = lastConfig.rangeFrom || 1;
  rangeTo       = lastConfig.rangeTo   || 100;

  document.getElementById('numQ').value            = numQuestions;
  document.getElementById('sliderVal').textContent  = numQuestions;
  document.getElementById('rangeFrom').value        = rangeFrom;
  document.getElementById('rangeTo').value          = rangeTo;
  updateRangeInfo();

  document.querySelectorAll('[data-mode]').forEach(b =>
    b.classList.toggle('selected', b.dataset.mode === mode));
  document.querySelectorAll('[data-order]').forEach(b =>
    b.classList.toggle('selected', b.dataset.order === order));

  document.querySelectorAll('.sel-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sel-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + selectionMode).classList.add('active');
  document.querySelectorAll('.sel-tab')[selectionMode === 'rango' ? 1 : 0].classList.add('active');

  startQuiz();
}
