const CACHE_NAME = 'rovix-cache-v1';

// ইনস্টল করার সময় সাথে সাথে নতুন সার্ভিস ওয়ার্কার একটিভ করতে skipWaiting ব্যবহার করা হয়েছে
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// পুরনো ক্যাশ ডিলিট করে সাথে সাথে কন্ট্রোল নেওয়ার জন্য
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// নেটওয়ার্ক ফার্স্ট স্ট্র্যাটেজি (স্লো নেটওয়ার্কেও ফাস্ট রেসপন্স ও আপডেট নিশ্চিত করতে)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
