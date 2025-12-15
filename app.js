/* ============================================
   VENEZUELACAMBIO PRO - EPIC APP LOGIC
   By LUAN System™ - Enhanced Edition
   ============================================ */

// ============ CONFIGURATION ============
const CONFIG = {
  API_URL: 'https://ve.dolarapi.com/v1/dolares',
  CACHE_KEY: 'vcpro_cache_v3',
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  ALERT_THRESHOLD: 2, // Alert if rate changes more than 2 Bs
  CONFETTI_THRESHOLD: 1000, // Show confetti for conversions > 1000 USD
  SOUNDS_ENABLED: true,
  VIBRATION_ENABLED: true
};

// ============ STATE ============
let rates = {
  usdBcv: null,
  eur: null,
  usdPar: null
};

let overrides = {
  usdBcv: null,
  eur: null,
  usdPar: null
};

let history = [];
let customHistory = [];
let decimalPlaces = 2;
let rateHistory = []; // For trend chart
let lastRates = {}; // For alerts

// Settings
let settings = {
  theme: 'dark',
  turboMode: false,
  soundsEnabled: true,
  vibrationsEnabled: true
};

// Statistics
let stats = {
  totalConversions: 0,
  totalBsConverted: 0,
  totalUsdConverted: 0,
  favoriteConversion: '',
  firstUseDate: null,
  lastUseDate: null,
  dailyUsage: {}, // { 'YYYY-MM-DD': count }
  currentStreak: 0
};

// Achievements
const ACHIEVEMENTS = {
  first_conversion: {
    id: 'first_conversion',
    name: 'Primera Conversión',
    description: 'Realiza tu primera conversión',
    icon: 'fa-star',
    unlocked: false
  },
  power_user: {
    id: 'power_user',
    name: 'Usuario Power',
    description: 'Realiza 50 conversiones',
    icon: 'fa-fire',
    unlocked: false
  },
  centurion: {
    id: 'centurion',
    name: 'Centurión',
    description: 'Realiza 100 conversiones',
    icon: 'fa-crown',
    unlocked: false
  },
  high_roller: {
    id: 'high_roller',
    name: 'Alto Volumen',
    description: 'Convierte más de 10,000 Bs',
    icon: 'fa-coins',
    unlocked: false
  },
  daily_user: {
    id: 'daily_user',
    name: 'Usuario Diario',
    description: 'Usa la app 7 días seguidos',
    icon: 'fa-calendar-check',
    unlocked: false
  },
  custom_master: {
    id: 'custom_master',
    name: 'Maestro Personalizado',
    description: 'Usa la calculadora personalizada 10 veces',
    icon: 'fa-handshake',
    unlocked: false
  },
  explorer: {
    id: 'explorer',
    name: 'Explorador',
    description: 'Prueba todas las monedas',
    icon: 'fa-compass',
    unlocked: false
  }
};

let achievements = {...ACHIEVEMENTS};

// ============ DOM ELEMENTS ============
const els = {
  // Header
  themeToggle: document.getElementById('themeToggle'),
  turboToggle: document.getElementById('turboToggle'),
  soundToggle: document.getElementById('soundToggle'),
  achievementsBtn: document.getElementById('achievementsBtn'),
  statsBtn: document.getElementById('statsBtn'),
  
  // Status
  statusMsg: document.getElementById('statusMsg'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnReset: document.getElementById('btnReset'),
  decimalPlaces: document.getElementById('decimalPlaces'),
  
  // Rates
  usdBcvValue: document.getElementById('usdBcvValue'),
  usdBcvMeta: document.getElementById('usdBcvMeta'),
  usdBcvToggle: document.getElementById('usdBcvToggle'),
  usdBcvEdit: document.getElementById('usdBcvEdit'),
  usdBcvManual: document.getElementById('usdBcvManual'),
  usdBcvSave: document.getElementById('usdBcvSave'),
  usdBcvUnlock: document.getElementById('usdBcvUnlock'),
  
  eurValue: document.getElementById('eurValue'),
  eurMeta: document.getElementById('eurMeta'),
  eurToggle: document.getElementById('eurToggle'),
  eurEdit: document.getElementById('eurEdit'),
  eurManual: document.getElementById('eurManual'),
  eurSave: document.getElementById('eurSave'),
  eurUnlock: document.getElementById('eurUnlock'),
  
  parValue: document.getElementById('parValue'),
  parMeta: document.getElementById('parMeta'),
  parToggle: document.getElementById('parToggle'),
  parEdit: document.getElementById('parEdit'),
  parManual: document.getElementById('parManual'),
  parSave: document.getElementById('parSave'),
  parUnlock: document.getElementById('parUnlock'),
  
  trendChart: document.getElementById('trendChart'),
  
  // Calculator
  amountFrom: document.getElementById('amountFrom'),
  currencyFrom: document.getElementById('currencyFrom'),
  currencyTo: document.getElementById('currencyTo'),
  swapBtn: document.getElementById('swapBtn'),
  
  quick10: document.getElementById('quick10'),
  quick50: document.getElementById('quick50'),
  quick100: document.getElementById('quick100'),
  quick500: document.getElementById('quick500'),
  clearBtn: document.getElementById('clearBtn'),
  
  resultDisplay: document.getElementById('resultDisplay'),
  resultDetail: document.getElementById('resultDetail'),
  copyResult: document.getElementById('copyResult'),
  shareResult: document.getElementById('shareResult'),
  
  // History
  historyList: document.getElementById('historyList'),
  exportHistory: document.getElementById('exportHistory'),
  
  // Custom
  customRate: document.getElementById('customRate'),
  customUsdAmount: document.getElementById('customUsdAmount'),
  customCalc: document.getElementById('customCalc'),
  customClear: document.getElementById('customClear'),
  customResult: document.getElementById('customResult'),
  customDetail: document.getElementById('customDetail'),
  customRateValue: document.getElementById('customRateValue'),
  customHistory: document.getElementById('customHistory'),
  
  // Comparator
  comp1Usd: document.getElementById('comp1Usd'),
  comp100Usd: document.getElementById('comp100Usd'),
  compDiff: document.getElementById('compDiff'),
  compBest: document.getElementById('compBest'),
  
  // Modals
  statsModal: document.getElementById('statsModal'),
  statsClose: document.getElementById('statsClose'),
  achievementsModal: document.getElementById('achievementsModal'),
  achievementsClose: document.getElementById('achievementsClose'),
  achievementsList: document.getElementById('achievementsList'),
  achievementToast: document.getElementById('achievementToast'),
  achievementDesc: document.getElementById('achievementDesc'),
  
  // Stats elements
  statConversions: document.getElementById('statConversions'),
  statTotalBs: document.getElementById('statTotalBs'),
  statTotalUsd: document.getElementById('statTotalUsd'),
  statFavorite: document.getElementById('statFavorite'),
  statDays: document.getElementById('statDays'),
  statStreak: document.getElementById('statStreak'),
  usageChart: document.getElementById('usageChart'),
  
  // Backup
  backupBtn: document.getElementById('backupBtn'),
  restoreBtn: document.getElementById('restoreBtn'),
  qrContainer: document.getElementById('qrContainer')
};

// ============ CHARTS ============
let trendChartInstance = null;
let usageChartInstance = null;

// ============ SOUNDS ============
const SOUNDS = {
  convert: () => playTone(440, 100),
  achievement: () => playTone(880, 200),
  button: () => playTone(220, 50),
  error: () => playTone(110, 150)
};

function playTone(frequency, duration) {
  if (!settings.soundsEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio not supported');
  }
}

// ============ VIBRATION ============
function vibrate(pattern = [50]) {
  if (!settings.vibrationsEnabled) return;
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// ============ GESTURES ============
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Horizontal swipe on calculator area
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
    const target = e.target.closest('.calc-grid');
    if (target) {
      swapCurrencies();
      vibrate([30]);
    }
  }
});

// ============ UTILITY FUNCTIONS ============
function toFixed(n) {
  return Number(n).toFixed(decimalPlaces);
}

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
}

function nowDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function setStatus(msg) {
  els.statusMsg.textContent = msg;
}

function showTemp(msg, type = 'success') {
  const sp = document.createElement('div');
  sp.className = 'pill';
  sp.style.position = 'fixed';
  sp.style.right = '20px';
  sp.style.bottom = '24px';
  sp.style.zIndex = '9999';
  sp.style.padding = '12px 20px';
  sp.style.borderRadius = '12px';
  sp.style.fontWeight = '800';
  sp.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
  
  if (type === 'success') {
    sp.style.background = 'rgba(74,222,128,0.9)';
    sp.style.color = '#000';
  } else if (type === 'error') {
    sp.style.background = 'rgba(239,68,68,0.9)';
    sp.style.color = '#fff';
  }
  
  sp.textContent = msg;
  document.body.appendChild(sp);
  
  setTimeout(() => {
    sp.style.opacity = '0';
    sp.style.transform = 'translateY(20px)';
    setTimeout(() => sp.remove(), 300);
  }, 2500);
}

// ============ STORAGE ============
function saveCache() {
  try {
    const data = {
      rates,
      overrides,
      history,
      customHistory,
      settings,
      stats,
      achievements,
      rateHistory,
      lastSave: Date.now()
    };
    localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Cache save failed:', e);
  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CONFIG.CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Cache load failed:', e);
    return null;
  }
}

// ============ API FETCHING ============
async function fetchRates() {
  setStatus('🔄 Actualizando tasas...');
  
  try {
    const response = await fetch(CONFIG.API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse rates from API
    const bcvItem = data.find(item => item.source && item.source.toLowerCase().includes('bcv'));
    const eurItem = data.find(item => item.title && item.title.toLowerCase().includes('eur'));
    const parItem = data.find(item => 
      (item.source && item.source.toLowerCase().includes('enparalelovzla')) ||
      (item.title && item.title.toLowerCase().includes('paralelo'))
    );
    
    const newRates = {
      usdBcv: bcvItem ? bcvItem.promedio : null,
      eur: eurItem ? eurItem.promedio : null,
      usdPar: parItem ? parItem.promedio : null
    };
    
    // Check for rate changes (alerts)
    checkRateAlerts(newRates);
    
    // Update rates
    Object.assign(rates, newRates);
    
    // Save to history for trend
    addToRateHistory(newRates);
    
    updateUI();
    saveCache();
    setStatus('✅ Tasas actualizadas exitosamente');
    
    return true;
  } catch (error) {
    console.error('API fetch error:', error);
    setStatus('⚠️ Error al cargar tasas. Usando valores guardados.');
    showTemp('Error de conexión. Verifica tu internet.', 'error');
    SOUNDS.error();
    return false;
  }
}

function addToRateHistory(newRates) {
  const timestamp = Date.now();
  rateHistory.push({
    timestamp,
    ...newRates
  });
  
  // Keep only last 24 hours
  const dayAgo = timestamp - (24 * 60 * 60 * 1000);
  rateHistory = rateHistory.filter(r => r.timestamp > dayAgo);
}

function checkRateAlerts(newRates) {
  if (!lastRates.usdBcv) {
    lastRates = {...newRates};
    return;
  }
  
  const diff = Math.abs(newRates.usdBcv - lastRates.usdBcv);
  
  if (diff >= CONFIG.ALERT_THRESHOLD) {
    const direction = newRates.usdBcv > lastRates.usdBcv ? '📈 SUBIÓ' : '📉 BAJÓ';
    showTemp(`${direction} ${toFixed(diff)} Bs - Nueva tasa: ${toFixed(newRates.usdBcv)} Bs`);
    vibrate([100, 50, 100]);
    SOUNDS.achievement();
  }
  
  lastRates = {...newRates};
}

// ============ UI UPDATES ============
function updateUI() {
  const getRate = (key) => overrides[key] !== null ? overrides[key] : rates[key];
  
  const usdBcv = getRate('usdBcv');
  const eur = getRate('eur');
  const usdPar = getRate('usdPar');
  
  // USD BCV
  if (usdBcv) {
    els.usdBcvValue.textContent = toFixed(usdBcv) + ' Bs';
    els.usdBcvMeta.textContent = overrides.usdBcv ? '🔒 Manual' : '🌐 API';
  }
  
  // EUR
  if (eur) {
    els.eurValue.textContent = toFixed(eur) + ' Bs';
    els.eurMeta.textContent = overrides.eur ? '🔒 Manual' : '🌐 API';
  }
  
  // Paralelo
  if (usdPar) {
    els.parValue.textContent = toFixed(usdPar) + ' Bs';
    els.parMeta.textContent = overrides.usdPar ? '🔒 Manual' : '🌐 API';
  }
  
  // Update comparator
  updateComparator();
  
  // Update trend chart
  updateTrendChart();
}

function updateComparator() {
  const usdBcv = overrides.usdBcv !== null ? overrides.usdBcv : rates.usdBcv;
  const usdPar = overrides.usdPar !== null ? overrides.usdPar : rates.usdPar;
  
  if (usdBcv) {
    els.comp1Usd.textContent = toFixed(usdBcv) + ' Bs';
    els.comp100Usd.textContent = toFixed(usdBcv * 100) + ' Bs';
  }
  
  if (usdBcv && usdPar) {
    const diff = Math.abs(usdBcv - usdPar);
    els.compDiff.textContent = toFixed(diff) + ' Bs';
    
    const best = usdBcv > usdPar ? 'BCV' : 'Paralelo';
    els.compBest.textContent = best + ' (' + toFixed(Math.max(usdBcv, usdPar)) + ' Bs)';
  }
}

function updateTrendChart() {
  if (!trendChartInstance) {
    const ctx = els.trendChart.getContext('2d');
    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'USD BCV',
          data: [],
          borderColor: '#60A5FA',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  }
  
  // Update data
  const labels = rateHistory.map(r => new Date(r.timestamp).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }));
  const data = rateHistory.map(r => r.usdBcv);
  
  trendChartInstance.data.labels = labels.slice(-20);
  trendChartInstance.data.datasets[0].data = data.slice(-20);
  trendChartInstance.update('none');
}

// ============ INPUT COLORS ============
function updateInputColors() {
  const from = els.currencyFrom.value;
  const to = els.currencyTo.value;
  
  els.amountFrom.className = `input-${from}`;
  els.currencyFrom.className = `input-${from}`;
  els.currencyTo.className = `input-${to}`;
}

// ============ CONVERSION ============
function computeConversion(amount, from, to) {
  const getRate = (key) => overrides[key] !== null ? overrides[key] : rates[key];
  
  const usdBcv = getRate('usdBcv');
  const eur = getRate('eur');
  const usdPar = getRate('usdPar');
  
  const rateMap = {
    bs: 1,
    usd: usdBcv,
    eur: eur,
    par: usdPar
  };
  
  const fromRate = rateMap[from];
  const toRate = rateMap[to];
  
  if (!fromRate || !toRate) {
    return { ok: false, error: 'Tasas no disponibles' };
  }
  
  const valueInBs = amount * fromRate;
  const result = valueInBs / toRate;
  
  return { ok: true, value: result };
}

function recalcAndShow() {
  const amount = Number(els.amountFrom.value || 0);
  const from = els.currencyFrom.value;
  const to = els.currencyTo.value;
  
  if (amount <= 0) {
    els.resultDisplay.textContent = '--';
    els.resultDetail.textContent = '—';
    return;
  }
  
  const res = computeConversion(amount, from, to);
  
  if (!res.ok) {
    els.resultDisplay.textContent = '⚠️';
    els.resultDetail.textContent = res.error;
    SOUNDS.error();
    return;
  }
  
  const symbols = { bs: 'Bs', usd: 'USD', eur: 'EUR', par: 'USD Paralelo' };
  
  els.resultDisplay.textContent = toFixed(res.value) + ' ' + symbols[to];
  els.resultDetail.textContent = `${toFixed(amount)} ${symbols[from]} → ${toFixed(res.value)} ${symbols[to]}`;
  
  // Add to history
  if (amount > 0) {
    const item = {
      timestamp: nowTime(),
      fromAmount: toFixed(amount),
      from,
      toAmount: toFixed(res.value),
      to
    };
    pushHistory(item);
    
    // Update stats
    updateStats(amount, from, res.value, to);
    
    // Show confetti for large conversions
    if (to === 'usd' && res.value >= CONFIG.CONFETTI_THRESHOLD) {
      fireConfetti();
    }
    
    SOUNDS.convert();
    vibrate([50]);
  }
}

// ============ HISTORY ============
function pushHistory(item) {
  const last = history[0];
  if (last && last.fromAmount === item.fromAmount && last.toAmount === item.toAmount && last.from === item.from && last.to === item.to) {
    return;
  }
  
  history.unshift(item);
  if (history.length > 12) history.pop();
  renderHistory();
  saveCache();
}

function renderHistory() {
  els.historyList.innerHTML = '';
  
  if (history.length === 0) {
    els.historyList.innerHTML = `<div class="tiny" style="text-align:center;padding:20px;">Sin conversiones aún</div>`;
    return;
  }
  
  history.forEach((h, idx) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div>${h.fromAmount} ${h.from.toUpperCase()} → ${h.toAmount} ${h.to.toUpperCase()}</div>
      <div style="display:flex;gap:10px;align-items:center">
        <div class="tiny">${h.timestamp}</div>
        <button class="outline-btn" onclick="reapplyHistory(${idx})" title="Reaplicar">➡</button>
      </div>
    `;
    els.historyList.appendChild(div);
  });
}

function reapplyHistory(i) {
  const h = history[i];
  if (!h) return;
  
  els.amountFrom.value = h.fromAmount;
  els.currencyFrom.value = h.from;
  els.currencyTo.value = h.to;
  updateInputColors();
  recalcAndShow();
  
  SOUNDS.button();
  vibrate([30]);
}

// ============ CUSTOM CALCULATOR ============
function calculateCustomRate() {
  const rate = Number(els.customRate.value || 0);
  const usdAmount = Number(els.customUsdAmount.value || 0);
  
  if (rate <= 0 || usdAmount <= 0) {
    showTemp('⚠️ Ingresa tasa y cantidad válidas', 'error');
    SOUNDS.error();
    return;
  }
  
  const bsTotal = rate * usdAmount;
  
  els.customResult.textContent = toFixed(bsTotal) + ' Bs';
  els.customDetail.textContent = `${toFixed(usdAmount)} USD × ${toFixed(rate)} Bs/USD`;
  els.customRateValue.textContent = toFixed(rate) + ' Bs';
  
  const item = {
    timestamp: nowTime(),
    rate: toFixed(rate),
    usd: toFixed(usdAmount),
    bs: toFixed(bsTotal)
  };
  
  pushCustomHistory(item);
  
  // Update stats
  stats.totalConversions++;
  checkAchievements();
  
  showTemp('✅ Calculado exitosamente');
  SOUNDS.convert();
  vibrate([50]);
  fireConfetti();
  saveCache();
}

function pushCustomHistory(item) {
  const last = customHistory[0];
  if (last && last.rate === item.rate && last.usd === item.usd) return;
  
  customHistory.unshift(item);
  if (customHistory.length > 8) customHistory.pop();
  renderCustomHistory();
  saveCache();
}

function renderCustomHistory() {
  els.customHistory.innerHTML = '';
  
  if (customHistory.length === 0) {
    els.customHistory.innerHTML = `<div class="tiny" style="text-align:center;padding:20px;">Sin cálculos personalizados aún</div>`;
    return;
  }
  
  customHistory.forEach((h, idx) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.style.borderColor = 'var(--custom-border)';
    div.innerHTML = `
      <div style="color:var(--custom-color)">${h.usd} USD × ${h.rate} = ${h.bs} Bs</div>
      <div style="display:flex;gap:10px;align-items:center">
        <div class="tiny">${h.timestamp}</div>
        <button class="outline-btn" onclick="reapplyCustom(${idx})" title="Reaplicar">➡</button>
      </div>
    `;
    els.customHistory.appendChild(div);
  });
}

function reapplyCustom(i) {
  const h = customHistory[i];
  if (!h) return;
  
  els.customRate.value = h.rate;
  els.customUsdAmount.value = h.usd;
  calculateCustomRate();
}

// ============ MANUAL OVERRIDES ============
function setOverride(key, val) {
  overrides[key] = Number(val) || null;
  saveCache();
  updateUI();
  SOUNDS.button();
  vibrate([30]);
}

function clearOverride(key) {
  overrides[key] = null;
  saveCache();
  updateUI();
  SOUNDS.button();
  vibrate([30]);
}

// ============ STATISTICS ============
function updateStats(fromAmount, fromCurrency, toAmount, toCurrency) {
  stats.totalConversions++;
  
  // Convert to Bs and USD for totals
  const getRate = (key) => overrides[key] !== null ? overrides[key] : rates[key];
  const usdBcv = getRate('usdBcv');
  
  if (fromCurrency === 'bs') {
    stats.totalBsConverted += fromAmount;
  } else if (usdBcv) {
    stats.totalBsConverted += fromAmount * usdBcv;
  }
  
  if (fromCurrency === 'usd') {
    stats.totalUsdConverted += fromAmount;
  } else if (usdBcv) {
    stats.totalUsdConverted += fromAmount / usdBcv;
  }
  
  // Track favorite conversion
  const key = `${fromCurrency}-${toCurrency}`;
  if (!stats.favoriteConversion) {
    stats.favoriteConversion = key;
  }
  
  // Track daily usage
  const today = nowDate();
  stats.dailyUsage[today] = (stats.dailyUsage[today] || 0) + 1;
  stats.lastUseDate = today;
  
  if (!stats.firstUseDate) {
    stats.firstUseDate = today;
  }
  
  // Calculate streak
  calculateStreak();
  
  // Check achievements
  checkAchievements();
  
  saveCache();
}

function calculateStreak() {
  const dates = Object.keys(stats.dailyUsage).sort().reverse();
  if (dates.length === 0) {
    stats.currentStreak = 0;
    return;
  }
  
  let streak = 1;
  const today = nowDate();
  
  if (dates[0] !== today) {
    stats.currentStreak = 0;
    return;
  }
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  stats.currentStreak = streak;
}

function getDaysUsing() {
  if (!stats.firstUseDate) return 0;
  
  const first = new Date(stats.firstUseDate);
  const today = new Date();
  const diff = Math.floor((today - first) / (1000 * 60 * 60 * 24));
  
  return diff + 1;
}

// ============ ACHIEVEMENTS ============
function checkAchievements() {
  let newUnlocks = [];
  
  // First conversion
  if (!achievements.first_conversion.unlocked && stats.totalConversions >= 1) {
    achievements.first_conversion.unlocked = true;
    newUnlocks.push(achievements.first_conversion);
  }
  
  // Power user
  if (!achievements.power_user.unlocked && stats.totalConversions >= 50) {
    achievements.power_user.unlocked = true;
    newUnlocks.push(achievements.power_user);
  }
  
  // Centurion
  if (!achievements.centurion.unlocked && stats.totalConversions >= 100) {
    achievements.centurion.unlocked = true;
    newUnlocks.push(achievements.centurion);
  }
  
  // High roller
  if (!achievements.high_roller.unlocked && stats.totalBsConverted >= 10000) {
    achievements.high_roller.unlocked = true;
    newUnlocks.push(achievements.high_roller);
  }
  
  // Daily user
  if (!achievements.daily_user.unlocked && stats.currentStreak >= 7) {
    achievements.daily_user.unlocked = true;
    newUnlocks.push(achievements.daily_user);
  }
  
  // Custom master
  if (!achievements.custom_master.unlocked && customHistory.length >= 10) {
    achievements.custom_master.unlocked = true;
    newUnlocks.push(achievements.custom_master);
  }
  
  // Explorer - check if all currencies used
  const usedCurrencies = new Set([...history.map(h => h.from), ...history.map(h => h.to)]);
  if (!achievements.explorer.unlocked && usedCurrencies.size >= 4) {
    achievements.explorer.unlocked = true;
    newUnlocks.push(achievements.explorer);
  }
  
  // Show achievement toasts
  newUnlocks.forEach(ach => {
    showAchievementToast(ach);
    fireConfetti();
  });
  
  saveCache();
}

function showAchievementToast(achievement) {
  els.achievementDesc.textContent = achievement.name + ': ' + achievement.description;
  els.achievementToast.classList.add('show');
  
  SOUNDS.achievement();
  vibrate([100, 50, 100, 50, 100]);
  
  setTimeout(() => {
    els.achievementToast.classList.remove('show');
  }, 3000);
}

function renderAchievements() {
  els.achievementsList.innerHTML = '';
  
  Object.values(achievements).forEach(ach => {
    const div = document.createElement('div');
    div.className = `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
    div.innerHTML = `
      <div class="achievement-icon-big">
        <i class="fas ${ach.icon}"></i>
      </div>
      <div class="achievement-name">${ach.name}</div>
      <div class="achievement-desc-small">${ach.description}</div>
    `;
    els.achievementsList.appendChild(div);
  });
}

// ============ STATS MODAL ============
function showStatsModal() {
  els.statConversions.textContent = stats.totalConversions;
  els.statTotalBs.textContent = toFixed(stats.totalBsConverted) + ' Bs';
  els.statTotalUsd.textContent = toFixed(stats.totalUsdConverted) + ' USD';
  els.statFavorite.textContent = stats.favoriteConversion ? stats.favoriteConversion.toUpperCase() : '--';
  els.statDays.textContent = getDaysUsing();
  els.statStreak.textContent = stats.currentStreak + ' días';
  
  updateUsageChart();
  
  els.statsModal.classList.add('show');
  SOUNDS.button();
  vibrate([30]);
}

function updateUsageChart() {
  if (!usageChartInstance) {
    const ctx = els.usageChart.getContext('2d');
    usageChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Conversiones',
          data: [],
          backgroundColor: 'rgba(102, 118, 234, 0.5)',
          borderColor: '#667eea',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push({
      date: dateStr,
      label: date.toLocaleDateString('es-VE', { weekday: 'short' }),
      count: stats.dailyUsage[dateStr] || 0
    });
  }
  
  usageChartInstance.data.labels = last7Days.map(d => d.label);
  usageChartInstance.data.datasets[0].data = last7Days.map(d => d.count);
  usageChartInstance.update();
}

// ============ THEME & SETTINGS ============
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('light-mode');
  
  const icon = els.themeToggle.querySelector('i');
  icon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  
  saveCache();
  SOUNDS.button();
  vibrate([30]);
}

function toggleTurbo() {
  settings.turboMode = !settings.turboMode;
  document.body.classList.toggle('turbo-mode');
  els.turboToggle.classList.toggle('active');
  
  saveCache();
  SOUNDS.button();
  vibrate([30]);
  showTemp(settings.turboMode ? '⚡ Modo Turbo ON' : 'Modo Normal');
}

function toggleSound() {
  settings.soundsEnabled = !settings.soundsEnabled;
  els.soundToggle.classList.toggle('active');
  
  const icon = els.soundToggle.querySelector('i');
  icon.className = settings.soundsEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  
  saveCache();
  SOUNDS.button();
  vibrate([30]);
}

// ============ CONFETTI ============
function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 10000
  };
  
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// ============ BACKUP & RESTORE ============
function generateBackup() {
  const backupData = {
    version: 1,
    timestamp: Date.now(),
    data: {
      history,
      customHistory,
      stats,
      achievements,
      settings
    }
  };
  
  const json = JSON.stringify(backupData);
  const base64 = btoa(json);
  
  // Generate QR
  els.qrContainer.innerHTML = '';
  els.qrContainer.style.display = 'block';
  
  new QRCode(els.qrContainer, {
    text: base64,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff'
  });
  
  showTemp('📱 QR generado. Escanea para backup.');
  SOUNDS.button();
  vibrate([50]);
}

function restoreBackup() {
  const input = prompt('Pega el código de backup:');
  if (!input) return;
  
  try {
    const json = atob(input);
    const backupData = JSON.parse(json);
    
    if (backupData.version !== 1) {
      throw new Error('Versión de backup no compatible');
    }
    
    // Restore data
    history = backupData.data.history || [];
    customHistory = backupData.data.customHistory || [];
    stats = backupData.data.stats || stats;
    achievements = backupData.data.achievements || achievements;
    settings = backupData.data.settings || settings;
    
    renderHistory();
    renderCustomHistory();
    saveCache();
    
    showTemp('✅ Backup restaurado exitosamente');
    SOUNDS.achievement();
    vibrate([100, 50, 100]);
    fireConfetti();
  } catch (e) {
    showTemp('❌ Error al restaurar backup', 'error');
    SOUNDS.error();
    vibrate([200]);
  }
}

// ============ SHARE ============
function shareResult() {
  const text = `${els.resultDisplay.textContent}\n${els.resultDetail.textContent}\n\n🔗 VenezuelaCambio Pro by LUAN System™`;
  
  if (navigator.share) {
    navigator.share({
      title: 'VenezuelaCambio Pro',
      text: text
    }).then(() => {
      showTemp('✅ Compartido');
      SOUNDS.button();
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => {
      showTemp('📋 Copiado al portapapeles');
      SOUNDS.button();
    });
  }
}

// ============ SWAP ============
function swapCurrencies() {
  const temp = els.currencyFrom.value;
  els.currencyFrom.value = els.currencyTo.value;
  els.currencyTo.value = temp;
  updateInputColors();
  recalcAndShow();
  
  SOUNDS.button();
  vibrate([30]);
}

// ============ EVENT BINDINGS ============
// Header
els.themeToggle.addEventListener('click', toggleTheme);
els.turboToggle.addEventListener('click', toggleTurbo);
els.soundToggle.addEventListener('click', toggleSound);
els.achievementsBtn.addEventListener('click', () => {
  renderAchievements();
  els.achievementsModal.classList.add('show');
  SOUNDS.button();
  vibrate([30]);
});
els.statsBtn.addEventListener('click', showStatsModal);

// Status
els.btnRefresh.addEventListener('click', async () => {
  els.btnRefresh.disabled = true;
  await fetchRates();
  els.btnRefresh.disabled = false;
});

els.btnReset.addEventListener('click', async () => {
  if (!confirm('¿Resetear todas las tasas manuales?')) return;
  
  overrides = { usdBcv: null, eur: null, usdPar: null };
  await fetchRates();
  saveCache();
  updateUI();
  setStatus('✅ Reset completado');
  SOUNDS.button();
  vibrate([50]);
});

els.decimalPlaces.addEventListener('change', () => {
  decimalPlaces = Number(els.decimalPlaces.value);
  updateUI();
  recalcAndShow();
  SOUNDS.button();
});

// Rate edit toggles
els.usdBcvToggle.addEventListener('click', () => {
  els.usdBcvEdit.style.display = els.usdBcvEdit.style.display === 'none' ? 'flex' : 'none';
  SOUNDS.button();
});
els.eurToggle.addEventListener('click', () => {
  els.eurEdit.style.display = els.eurEdit.style.display === 'none' ? 'flex' : 'none';
  SOUNDS.button();
});
els.parToggle.addEventListener('click', () => {
  els.parEdit.style.display = els.parEdit.style.display === 'none' ? 'flex' : 'none';
  SOUNDS.button();
});

// Manual rate saves
els.usdBcvSave.addEventListener('click', () => {
  setOverride('usdBcv', els.usdBcvManual.value);
  showTemp('✅ Tasa USD(BCV) actualizada');
});
els.usdBcvUnlock.addEventListener('click', () => {
  clearOverride('usdBcv');
  showTemp('🔓 Override eliminado');
});

els.eurSave.addEventListener('click', () => {
  setOverride('eur', els.eurManual.value);
  showTemp('✅ Tasa EUR actualizada');
});
els.eurUnlock.addEventListener('click', () => {
  clearOverride('eur');
  showTemp('🔓 Override eliminado');
});

els.parSave.addEventListener('click', () => {
  setOverride('usdPar', els.parManual.value);
  showTemp('✅ Tasa Paralela actualizada');
});
els.parUnlock.addEventListener('click', () => {
  clearOverride('usdPar');
  showTemp('🔓 Override eliminado');
});

// Calculator
els.amountFrom.addEventListener('input', recalcAndShow);
els.currencyFrom.addEventListener('change', () => {
  updateInputColors();
  recalcAndShow();
});
els.currencyTo.addEventListener('change', () => {
  updateInputColors();
  recalcAndShow();
});

els.swapBtn.addEventListener('click', swapCurrencies);

// Quick buttons
els.quick10.addEventListener('click', () => {
  els.amountFrom.value = (Number(els.amountFrom.value || 0) + 10);
  recalcAndShow();
  SOUNDS.button();
  vibrate([30]);
});
els.quick50.addEventListener('click', () => {
  els.amountFrom.value = (Number(els.amountFrom.value || 0) + 50);
  recalcAndShow();
  SOUNDS.button();
  vibrate([30]);
});
els.quick100.addEventListener('click', () => {
  els.amountFrom.value = (Number(els.amountFrom.value || 0) + 100);
  recalcAndShow();
  SOUNDS.button();
  vibrate([30]);
});
els.quick500.addEventListener('click', () => {
  els.amountFrom.value = (Number(els.amountFrom.value || 0) + 500);
  recalcAndShow();
  SOUNDS.button();
  vibrate([30]);
});

els.clearBtn.addEventListener('click', () => {
  els.amountFrom.value = '';
  els.resultDisplay.textContent = '--';
  els.resultDetail.textContent = '—';
  SOUNDS.button();
  vibrate([30]);
});

// Result actions
els.copyResult.addEventListener('click', () => {
  const txt = els.resultDisplay.textContent + ' — ' + els.resultDetail.textContent;
  navigator.clipboard?.writeText(txt).then(() => {
    showTemp('📋 Resultado copiado');
    SOUNDS.button();
    vibrate([30]);
  });
});

els.shareResult.addEventListener('click', shareResult);

// History
els.exportHistory.addEventListener('click', () => {
  const csv = history.map(h => `${h.timestamp},${h.fromAmount},${h.from},${h.toAmount},${h.to}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vcpro_history.csv';
  a.click();
  URL.revokeObjectURL(url);
  showTemp('📥 Historial exportado');
  SOUNDS.button();
  vibrate([30]);
});

// Custom calculator
els.customCalc.addEventListener('click', calculateCustomRate);
els.customClear.addEventListener('click', () => {
  els.customRate.value = '';
  els.customUsdAmount.value = '';
  els.customResult.textContent = '--';
  els.customDetail.textContent = '—';
  SOUNDS.button();
  vibrate([30]);
});

// Modals
els.statsClose.addEventListener('click', () => {
  els.statsModal.classList.remove('show');
  SOUNDS.button();
});
els.achievementsClose.addEventListener('click', () => {
  els.achievementsModal.classList.remove('show');
  SOUNDS.button();
});

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      SOUNDS.button();
    }
  });
});

// Backup
els.backupBtn.addEventListener('click', generateBackup);
els.restoreBtn.addEventListener('click', restoreBackup);

// ============ INITIALIZATION ============
async function init() {
  // Load cache
  const cache = loadCache();
  if (cache) {
    if (cache.rates) Object.assign(rates, cache.rates);
    if (cache.overrides) Object.assign(overrides, cache.overrides);
    if (cache.history) history = cache.history;
    if (cache.customHistory) customHistory = cache.customHistory;
    if (cache.settings) Object.assign(settings, cache.settings);
    if (cache.stats) Object.assign(stats, cache.stats);
    if (cache.achievements) Object.assign(achievements, cache.achievements);
    if (cache.rateHistory) rateHistory = cache.rateHistory;
  }
  
  // Apply theme
  if (settings.theme === 'light') {
    document.body.classList.add('light-mode');
    els.themeToggle.querySelector('i').className = 'fas fa-sun';
  }
  
  if (settings.turboMode) {
    document.body.classList.add('turbo-mode');
    els.turboToggle.classList.add('active');
  }
  
  if (!settings.soundsEnabled) {
    els.soundToggle.classList.remove('active');
    els.soundToggle.querySelector('i').className = 'fas fa-volume-mute';
  }
  
  // Render UI
  updateUI();
  renderHistory();
  renderCustomHistory();
  updateInputColors();
  
  // Fetch rates
  await fetchRates();
  recalcAndShow();
  
  // Auto refresh
  setInterval(async () => {
    await fetchRates();
    updateUI();
    recalcAndShow();
  }, CONFIG.REFRESH_INTERVAL);
  
  console.log('✅ VenezuelaCambio Pro initialized');
}

// Start app
init();

// Export for inline functions
window.reapplyHistory = reapplyHistory;
window.reapplyCustom = reapplyCustom;
