/* ====================================
   Epic Converter - Service Worker
   Luis Lárez - LUANSysten™ 2024
   ==================================== */

const CACHE_NAME = 'epic-converter-v1.0.0';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ====================================
// Instalación del Service Worker
// ====================================
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Archivos en caché');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ====================================
// Activación del Service Worker
// ====================================
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Borrando caché viejo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ====================================
// Intercepción de Requests (Fetch)
// ====================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Solo cachear requests GET
  if (request.method !== 'GET') return;
  
  // No cachear APIs externas
  if (request.url.includes('dolarapi.com') || 
      request.url.includes('exchangerate-api.com') ||
      request.url.includes('exchangemonitor.net')) {
    // Para APIs: Network First, Cache Fallback
    event.respondWith(
      fetch(request)
        .catch(() => {
          console.log('⚠️ API offline, sin fallback de cache para APIs');
          return new Response(
            JSON.stringify({ error: 'Offline' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }
  
  // Para assets locales: Cache First, Network Fallback
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Sirviendo desde caché:', request.url);
          return cachedResponse;
        }
        
        // No está en caché, hacer fetch
        return fetch(request)
          .then((response) => {
            // Clonar la respuesta
            const responseClone = response.clone();
            
            // Guardar en caché
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('❌ Error en fetch:', error);
            
            // Si es una página HTML y falla, mostrar offline page
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// ====================================
// Mensajes desde la aplicación
// ====================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          console.log('🗑️ Caché borrado');
          return self.clients.claim();
        })
    );
  }
});

console.log('✅ Service Worker cargado - Epic Converter by LUANSysten™');
