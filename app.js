/* ====================================
   Epic Converter - JavaScript
   Luis Lárez - LUANSysten™ 2024
   ==================================== */

// ====================================
// Configuración de APIs
// ====================================
const API_CONFIG = {
  USD_BCV: 'https://ve.dolarapi.com/v1/dolares',
  USD_PAR: 'https://ve.dolarapi.com/v1/dolares/paralelo',
  EUR: 'https://api.exchangerate-api.com/v4/latest/EUR'
};

// ====================================
// Estado Global
// ====================================
const state = {
  rates: {
    usd: null,
    eur: null,
    par: null
  },
  lastUpdate: null,
  manualMode: false,
  autoRefresh: true,
  refreshInterval: null,
  tradeType: 'sell' // 'sell' o 'buy'
};

// ====================================
// Elementos del DOM
// ====================================
const elements = {
  // Inputs
  amount: document.getElementById('amount'),
  fromCurrency: document.getElementById('fromCurrency'),
  toCurrency: document.getElementById('toCurrency'),
  
  // Botones
  convertBtn: document.getElementById('convertBtn'),
  swapBtn: document.getElementById('swapBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  clearBtn: document.getElementById('clearBtn'),
  copyBtn: document.getElementById('copyBtn'),
  
  // Quick buttons
  quickBtns: document.querySelectorAll('.quick-btn'),
  
  // Resultados y tasas
  result: document.getElementById('result'),
  resultValue: document.querySelector('.result-value'),
  usdRate: document.getElementById('usdRate'),
  eurRate: document.getElementById('eurRate'),
  parRate: document.getElementById('parRate'),
  lastUpdate: document.getElementById('lastUpdate'),
  
  // Manual override
  manualToggle: document.getElementById('manualToggle'),
  manualInputs: document.getElementById('manualInputs'),
  usdManual: document.getElementById('usdManual'),
  eurManual: document.getElementById('eurManual'),
  parManual: document.getElementById('parManual'),
  saveManualBtn: document.getElementById('saveManualBtn'),
  
  // Historial
  historyList: document.getElementById('historyList'),
  exportBtn: document.getElementById('exportBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  
  // Compra/Venta
  tradeTypeSell: document.getElementById('tradeTypeSell'),
  tradeTypeBuy: document.getElementById('tradeTypeBuy'),
  tradeAmount: document.getElementById('tradeAmount'),
  tradeRate: document.getElementById('tradeRate'),
  tradeCalculateBtn: document.getElementById('tradeCalculateBtn'),
  tradeResult: document.getElementById('tradeResult'),
  tradeResultLabel: document.getElementById('tradeResultLabel'),
  tradeResultValue: document.getElementById('tradeResultValue'),
  tradeBreakdown: document.getElementById('tradeBreakdown'),
  
  // API Status
  apiStatus: document.getElementById('apiStatus'),
  
  // Modal fallback
  fallbackModal: document.getElementById('fallbackModal'),
  fallbackUSD: document.getElementById('fallbackUSD'),
  fallbackEUR: document.getElementById('fallbackEUR'),
  fallbackPAR: document.getElementById('fallbackPAR'),
  saveFallbackBtn: document.getElementById('saveFallbackBtn')
};

// ====================================
// Inicialización
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Epic Converter iniciado - LUANSysten™');
  
  // Cargar preferencias guardadas
  loadPreferences();
  
  // Cargar tasas
  fetchRates();
  
  // Cargar historial
  renderHistory();
  
  // Configurar auto-refresh
  setupAutoRefresh();
  
  // Event listeners
  setupEventListeners();
});

// ====================================
// Fetch de Tasas desde APIs
// ====================================
async function fetchRates() {
  console.log('📡 Obteniendo tasas de cambio...');
  
  try {
    showLoading(true);
    
    // Fetch paralelo de todas las APIs
    const [bcvData, paraleloData, eurData] = await Promise.allSettled([
      fetch(API_CONFIG.USD_BCV).then(r => r.json()),
      fetch(API_CONFIG.USD_PAR).then(r => r.json()),
      fetch(API_CONFIG.EUR).then(r => r.json())
    ]);
    
    // Procesar USD BCV
    if (bcvData.status === 'fulfilled' && bcvData.value) {
      state.rates.usd = parseFloat(bcvData.value.promedio || bcvData.value.precio);
      console.log('✅ USD BCV:', state.rates.usd);
    }
    
    // Procesar USD Paralelo
    if (paraleloData.status === 'fulfilled' && paraleloData.value) {
      state.rates.par = parseFloat(paraleloData.value.promedio || paraleloData.value.precio);
      console.log('✅ USD Paralelo:', state.rates.par);
    }
    
    // Procesar EUR
    if (eurData.status === 'fulfilled' && eurData.value && eurData.value.rates) {
      // El API retorna EUR -> otras monedas, necesitamos EUR -> VES
      // Calculamos usando USD como intermediario
      const eurToUSD = 1 / eurData.value.rates.USD;
      state.rates.eur = state.rates.usd ? state.rates.usd / eurToUSD : null;
      console.log('✅ EUR:', state.rates.eur);
    }
    
    // Verificar si alguna tasa falló
    if (!state.rates.usd || !state.rates.eur || !state.rates.par) {
      console.warn('⚠️ Algunas APIs fallaron');
      handleAPIFailure();
    } else {
      // Todo OK
      state.lastUpdate = new Date();
      updateRatesDisplay();
      hideAPIStatus();
      saveRatesToCache();
    }
    
    showLoading(false);
    
  } catch (error) {
    console.error('❌ Error al obtener tasas:', error);
    showLoading(false);
    handleAPIFailure();
  }
}

// ====================================
// Manejo de Fallo de APIs (CRÍTICO)
// ====================================
function handleAPIFailure() {
  console.warn('⚠️ APIs no disponibles - Verificando cache y fallback');
  
  // Intentar cargar desde cache
  const cachedRates = loadRatesFromCache();
  
  if (cachedRates && cachedRates.usd && cachedRates.eur && cachedRates.par) {
    // Usar cache
    state.rates = cachedRates;
    state.lastUpdate = new Date(cachedRates.timestamp);
    updateRatesDisplay();
    showAPIStatus('Usando tasas en caché');
    console.log('📦 Tasas cargadas desde cache');
  } else {
    // NO HAY CACHE - Mostrar modal para entrada manual
    console.error('❌ No hay tasas disponibles - Solicitando entrada manual');
    showFallbackModal();
  }
}

// ====================================
// Modal de Fallback Manual
// ====================================
function showFallbackModal() {
  elements.fallbackModal.classList.remove('hidden');
  elements.apiStatus.classList.remove('hidden');
  elements.apiStatus.querySelector('.status-text').textContent = 
    'APIs no disponibles - Ingrese tasas manualmente';
  
  // Pre-llenar con valores del cache si existen
  const cached = loadRatesFromCache();
  if (cached) {
    elements.fallbackUSD.value = cached.usd || '';
    elements.fallbackEUR.value = cached.eur || '';
    elements.fallbackPAR.value = cached.par || '';
  }
}

function hideFallbackModal() {
  elements.fallbackModal.classList.add('hidden');
}

// ====================================
// Guardar Tasas Manuales desde Modal
// ====================================
function saveFallbackRates() {
  const usd = parseFloat(elements.fallbackUSD.value);
  const eur = parseFloat(elements.fallbackEUR.value);
  const par = parseFloat(elements.fallbackPAR.value);
  
  // Validar que todas las tasas sean válidas
  if (!usd || usd <= 0 || !eur || eur <= 0 || !par || par <= 0) {
    alert('⚠️ Por favor ingrese todas las tasas con valores válidos');
    return;
  }
  
  // Guardar en el estado
  state.rates.usd = usd;
  state.rates.eur = eur;
  state.rates.par = par;
  state.lastUpdate = new Date();
  
  // Guardar en cache
  saveRatesToCache();
  
  // Actualizar display
  updateRatesDisplay();
  
  // Cerrar modal
  hideFallbackModal();
  
  // Mostrar mensaje de éxito
  showAPIStatus('Tasas manuales guardadas correctamente');
  setTimeout(() => hideAPIStatus(), 3000);
  
  console.log('✅ Tasas manuales guardadas:', state.rates);
}

// ====================================
// Cache de Tasas (localStorage)
// ====================================
function saveRatesToCache() {
  const cacheData = {
    usd: state.rates.usd,
    eur: state.rates.eur,
    par: state.rates.par,
    timestamp: state.lastUpdate.toISOString()
  };
  localStorage.setItem('epic_converter_rates', JSON.stringify(cacheData));
  console.log('💾 Tasas guardadas en cache');
}

function loadRatesFromCache() {
  try {
    const cached = localStorage.getItem('epic_converter_rates');
    if (cached) {
      const data = JSON.parse(cached);
      console.log('📦 Cache encontrado:', data);
      return data;
    }
  } catch (error) {
    console.error('Error al cargar cache:', error);
  }
  return null;
}

// ====================================
// Actualizar Display de Tasas
// ====================================
function updateRatesDisplay() {
  if (state.rates.usd) {
    elements.usdRate.textContent = `Bs. ${state.rates.usd.toFixed(2)}`;
  }
  if (state.rates.eur) {
    elements.eurRate.textContent = `Bs. ${state.rates.eur.toFixed(2)}`;
  }
  if (state.rates.par) {
    elements.parRate.textContent = `Bs. ${state.rates.par.toFixed(2)}`;
  }
  
  if (state.lastUpdate) {
    const time = state.lastUpdate.toLocaleTimeString('es-VE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    elements.lastUpdate.textContent = `Actualizado: ${time}`;
  }
}

// ====================================
// Conversión de Monedas
// ====================================
function convertCurrency() {
  const amount = parseFloat(elements.amount.value);
  const from = elements.fromCurrency.value;
  const to = elements.toCurrency.value;
  
  // Validaciones
  if (!amount || amount <= 0) {
    showError('Ingrese un monto válido');
    return;
  }
  
  if (!state.rates.usd || !state.rates.eur || !state.rates.par) {
    showError('Tasas no disponibles. Refresque o ingrese manualmente.');
    return;
  }
  
  if (from === to) {
    showResult(amount, from);
    return;
  }
  
  // Convertir a Bolívares primero (hub)
  let amountInBs = 0;
  
  switch(from) {
    case 'USD':
      amountInBs = amount * state.rates.usd;
      break;
    case 'EUR':
      amountInBs = amount * state.rates.eur;
      break;
    case 'PAR':
      amountInBs = amount * state.rates.par;
      break;
    case 'BS':
      amountInBs = amount;
      break;
  }
  
  // Convertir de Bolívares a moneda destino
  let result = 0;
  
  switch(to) {
    case 'USD':
      result = amountInBs / state.rates.usd;
      break;
    case 'EUR':
      result = amountInBs / state.rates.eur;
      break;
    case 'PAR':
      result = amountInBs / state.rates.par;
      break;
    case 'BS':
      result = amountInBs;
      break;
  }
  
  // Mostrar resultado
  showResult(result, to);
  
  // Agregar al historial
  addToHistory(amount, from, result, to);
  
  console.log(`💱 Conversión: ${amount} ${from} = ${result.toFixed(2)} ${to}`);
}

// ====================================
// Mostrar Resultado
// ====================================
function showResult(value, currency) {
  const formatted = formatCurrency(value, currency);
  elements.resultValue.textContent = formatted;
  elements.result.classList.remove('hidden');
  
  // Animar
  elements.result.style.animation = 'none';
  setTimeout(() => {
    elements.result.style.animation = 'fadeIn 0.5s ease';
  }, 10);
}

function formatCurrency(value, currency) {
  const decimals = currency === 'BS' ? 2 : 4;
  const symbol = getCurrencySymbol(currency);
  return `${symbol} ${value.toFixed(decimals)}`;
}

function getCurrencySymbol(currency) {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'PAR': '$',
    'BS': 'Bs.'
  };
  return symbols[currency] || '';
}

// ====================================
// Historial
// ====================================
function addToHistory(amountFrom, currencyFrom, amountTo, currencyTo) {
  const timestamp = new Date().toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const entry = {
    id: Date.now(),
    timestamp,
    from: `${amountFrom.toFixed(2)} ${currencyFrom}`,
    to: `${amountTo.toFixed(2)} ${currencyTo}`,
    rate: currencyFrom === 'BS' ? 
      (amountTo / amountFrom).toFixed(4) : 
      (amountFrom / amountTo).toFixed(4)
  };
  
  // Obtener historial actual
  let history = getHistory();
  
  // Agregar al inicio
  history.unshift(entry);
  
  // Limitar a 50 entradas
  if (history.length > 50) {
    history = history.slice(0, 50);
  }
  
  // Guardar
  localStorage.setItem('epic_converter_history', JSON.stringify(history));
  
  // Re-renderizar
  renderHistory();
}

function getHistory() {
  try {
    const history = localStorage.getItem('epic_converter_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error al cargar historial:', error);
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  
  if (history.length === 0) {
    elements.historyList.innerHTML = '<li class="empty-state">No hay conversiones recientes</li>';
    return;
  }
  
  elements.historyList.innerHTML = history.map(entry => `
    <li data-id="${entry.id}">
      <strong>${entry.from}</strong> → <strong>${entry.to}</strong>
      <br>
      <small>${entry.timestamp}</small>
    </li>
  `).join('');
}

function clearHistory() {
  if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
    localStorage.removeItem('epic_converter_history');
    renderHistory();
    console.log('🗑️ Historial borrado');
  }
}

function exportHistoryToCSV() {
  const history = getHistory();
  
  if (history.length === 0) {
    alert('No hay historial para exportar');
    return;
  }
  
  // Crear CSV
  let csv = 'Fecha,Desde,Hacia,Tasa\n';
  
  history.forEach(entry => {
    csv += `"${entry.timestamp}","${entry.from}","${entry.to}","${entry.rate}"\n`;
  });
  
  // Descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `epic_converter_historial_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('📥 Historial exportado a CSV');
}

// ====================================
// Override Manual
// ====================================
function toggleManualMode() {
  state.manualMode = elements.manualToggle.checked;
  
  if (state.manualMode) {
    elements.manualInputs.classList.remove('hidden');
    // Pre-llenar con tasas actuales
    elements.usdManual.value = state.rates.usd || '';
    elements.eurManual.value = state.rates.eur || '';
    elements.parManual.value = state.rates.par || '';
  } else {
    elements.manualInputs.classList.add('hidden');
  }
  
  savePreferences();
}

function saveManualRates() {
  const usd = parseFloat(elements.usdManual.value);
  const eur = parseFloat(elements.eurManual.value);
  const par = parseFloat(elements.parManual.value);
  
  if (usd && usd > 0) state.rates.usd = usd;
  if (eur && eur > 0) state.rates.eur = eur;
  if (par && par > 0) state.rates.par = par;
  
  state.lastUpdate = new Date();
  updateRatesDisplay();
  saveRatesToCache();
  
  showAPIStatus('Tasas manuales aplicadas correctamente');
  setTimeout(() => hideAPIStatus(), 2000);
  
  console.log('✅ Tasas manuales aplicadas');
}

// ====================================
// Auto-Refresh
// ====================================
function setupAutoRefresh() {
  // Refrescar cada 5 minutos
  state.refreshInterval = setInterval(() => {
    if (state.autoRefresh && !state.manualMode) {
      console.log('🔄 Auto-refresh ejecutado');
      fetchRates();
    }
  }, 5 * 60 * 1000); // 5 minutos
}

// ====================================
// Utilidades UI
// ====================================
function swapCurrencies() {
  const temp = elements.fromCurrency.value;
  elements.fromCurrency.value = elements.toCurrency.value;
  elements.toCurrency.value = temp;
  
  // Re-convertir si hay un monto
  if (elements.amount.value) {
    convertCurrency();
  }
}

function clearAmount() {
  elements.amount.value = '';
  elements.result.classList.add('hidden');
  elements.amount.focus();
}

function copyResult() {
  const text = elements.resultValue.textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    // Cambiar texto temporalmente
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = '✅ Copiado';
    elements.copyBtn.style.background = 'var(--gold)';
    
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
      elements.copyBtn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar el resultado');
  });
}

function addQuickAmount(value) {
  const current = parseFloat(elements.amount.value) || 0;
  elements.amount.value = current + value;
  
  // Auto-convertir si las monedas están seleccionadas
  if (elements.fromCurrency.value && elements.toCurrency.value) {
    convertCurrency();
  }
}

// ====================================
// Estados de UI
// ====================================
function showLoading(show) {
  elements.refreshBtn.style.opacity = show ? '0.5' : '1';
  elements.refreshBtn.style.pointerEvents = show ? 'none' : 'auto';
  if (show) {
    elements.refreshBtn.textContent = '⏳';
  } else {
    elements.refreshBtn.textContent = '🔄';
  }
}

function showError(message) {
  alert('⚠️ ' + message);
}

function showAPIStatus(message) {
  elements.apiStatus.classList.remove('hidden');
  elements.apiStatus.querySelector('.status-text').textContent = message;
}

function hideAPIStatus() {
  elements.apiStatus.classList.add('hidden');
}

// ====================================
// Preferencias
// ====================================
function savePreferences() {
  const prefs = {
    manualMode: state.manualMode,
    autoRefresh: state.autoRefresh
  };
  localStorage.setItem('epic_converter_prefs', JSON.stringify(prefs));
}

function loadPreferences() {
  try {
    const prefs = localStorage.getItem('epic_converter_prefs');
    if (prefs) {
      const data = JSON.parse(prefs);
      state.manualMode = data.manualMode || false;
      state.autoRefresh = data.autoRefresh !== false; // default true
      
      elements.manualToggle.checked = state.manualMode;
      if (state.manualMode) {
        elements.manualInputs.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Error al cargar preferencias:', error);
  }
}

// ====================================
// Compra/Venta de Dólares
// ====================================
function toggleTradeType(type) {
  state.tradeType = type;
  
  if (type === 'sell') {
    elements.tradeTypeSell.classList.add('active');
    elements.tradeTypeBuy.classList.remove('active');
    elements.tradeResultLabel.textContent = 'Recibirás:';
  } else {
    elements.tradeTypeBuy.classList.add('active');
    elements.tradeTypeSell.classList.remove('active');
    elements.tradeResultLabel.textContent = 'Pagarás:';
  }
  
  // Recalcular si hay valores
  if (elements.tradeAmount.value && elements.tradeRate.value) {
    calculateTrade();
  }
}

function calculateTrade() {
  const amount = parseFloat(elements.tradeAmount.value);
  const rate = parseFloat(elements.tradeRate.value);
  
  // Validaciones
  if (!amount || amount <= 0) {
    showError('Ingrese una cantidad válida de USD');
    return;
  }
  
  if (!rate || rate <= 0) {
    showError('Ingrese una tasa válida (Bs/$)');
    return;
  }
  
  // Calcular total en Bolívares
  const totalBs = amount * rate;
  
  // Mostrar resultado
  elements.tradeResultValue.textContent = `Bs. ${totalBs.toLocaleString('es-VE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
  
  // Mostrar breakdown
  const operation = state.tradeType === 'sell' ? 'Vendo' : 'Compro';
  elements.tradeBreakdown.textContent = `${amount} USD × ${rate} Bs/USD = ${totalBs.toLocaleString('es-VE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} Bs`;
  
  // Mostrar resultado
  elements.tradeResult.classList.remove('hidden');
  
  // Animar
  elements.tradeResult.style.animation = 'none';
  setTimeout(() => {
    elements.tradeResult.style.animation = 'fadeIn 0.5s ease';
  }, 10);
  
  console.log(`💰 ${operation}: ${amount} USD a ${rate} Bs/USD = ${totalBs} Bs`);
  
  // Agregar al historial
  addTradeToHistory(amount, rate, totalBs, state.tradeType);
}

function addTradeToHistory(amount, rate, totalBs, type) {
  const timestamp = new Date().toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const operation = type === 'sell' ? 'Venta' : 'Compra';
  const action = type === 'sell' ? 'Recibirás' : 'Pagarás';
  
  const entry = {
    id: Date.now(),
    timestamp,
    from: `${operation}: ${amount.toFixed(2)} USD a ${rate.toFixed(2)} Bs/USD`,
    to: `${action}: ${totalBs.toFixed(2)} Bs`,
    rate: rate.toFixed(2)
  };
  
  // Obtener historial actual
  let history = getHistory();
  
  // Agregar al inicio
  history.unshift(entry);
  
  // Limitar a 50 entradas
  if (history.length > 50) {
    history = history.slice(0, 50);
  }
  
  // Guardar
  localStorage.setItem('epic_converter_history', JSON.stringify(history));
  
  // Re-renderizar
  renderHistory();
}

// ====================================
// Event Listeners
// ====================================
function setupEventListeners() {
  // Conversión
  elements.convertBtn.addEventListener('click', convertCurrency);
  elements.amount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertCurrency();
  });
  
  // Swap
  elements.swapBtn.addEventListener('click', swapCurrencies);
  
  // Clear
  elements.clearBtn.addEventListener('click', clearAmount);
  
  // Copy
  elements.copyBtn.addEventListener('click', copyResult);
  
  // Refresh
  elements.refreshBtn.addEventListener('click', () => {
    fetchRates();
  });
  
  // Quick buttons
  elements.quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = parseFloat(btn.dataset.value);
      addQuickAmount(value);
    });
  });
  
  // Manual mode
  elements.manualToggle.addEventListener('change', toggleManualMode);
  elements.saveManualBtn.addEventListener('click', saveManualRates);
  
  // Historial
  elements.exportBtn.addEventListener('click', exportHistoryToCSV);
  elements.clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Compra/Venta
  elements.tradeTypeSell.addEventListener('click', () => toggleTradeType('sell'));
  elements.tradeTypeBuy.addEventListener('click', () => toggleTradeType('buy'));
  elements.tradeCalculateBtn.addEventListener('click', calculateTrade);
  
  // Auto-calcular en tiempo real
  elements.tradeAmount.addEventListener('input', () => {
    if (elements.tradeAmount.value && elements.tradeRate.value) {
      calculateTrade();
    }
  });
  elements.tradeRate.addEventListener('input', () => {
    if (elements.tradeAmount.value && elements.tradeRate.value) {
      calculateTrade();
    }
  });
  
  // Enter key para calcular
  elements.tradeAmount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateTrade();
  });
  elements.tradeRate.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateTrade();
  });
  
  // Fallback modal
  elements.saveFallbackBtn.addEventListener('click', saveFallbackRates);
  
  // Auto-convert on currency change
  elements.fromCurrency.addEventListener('change', () => {
    if (elements.amount.value) convertCurrency();
  });
  elements.toCurrency.addEventListener('change', () => {
    if (elements.amount.value) convertCurrency();
  });
}

// ====================================
// Service Worker Registration
// ====================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('✅ Service Worker registrado'))
      .catch(err => console.error('❌ Error al registrar SW:', err));
  });
}

console.log('✅ Epic Converter cargado completamente');
