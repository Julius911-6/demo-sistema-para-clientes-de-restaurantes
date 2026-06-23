// Service Worker para El Sabroso - Soporte Offline y PWA
const CACHE_NAME = 'el-sabroso-v1';
const URLS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        }).catch(error => {
            console.log('Error durante instalación del Service Worker:', error);
        })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
    // Solo cachear solicitudes GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // Devolver respuesta en caché si existe
            if (response) {
                return response;
            }
            
            return fetch(event.request).then(response => {
                // No cachear respuestas no válidas
                if (!response || response.status !== 200) {
                    return response;
                }
                
                // Cachear la respuesta
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                
                return response;
            }).catch(() => {
                // Si falla la solicitud, devolver página offline si es HTML
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Sincronización en segundo plano (opcional)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-sales') {
        event.waitUntil(syncSales());
    }
});

async function syncSales() {
    try {
        // Aquí irían acciones de sincronización
        console.log('Sincronizando ventas...');
    } catch (error) {
        console.error('Error en sincronización:', error);
        throw error;
    }
}
