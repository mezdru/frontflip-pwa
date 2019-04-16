module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,json,js,css}'
  ],
  globIgnores: ['**/index.html'],
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  swDest: 'build/service-worker.js',
  maximumFileSizeToCacheInBytes: 5000000,

  runtimeCaching: [
    {
        // Match any request ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
    
        // Apply a cache-first strategy.
        handler: 'CacheFirst',
    
        options: {
          // Use a custom cache name.
          cacheName: 'images',
          cacheableResponse: {
            statuses: [0, 200]
          },
    
    
          // Only cache 10 images.
          expiration: {
            maxEntries: 50,
          },
        },
      },
      {
        urlPattern: new RegExp('^https://ucarecdn\.com/'),
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          cacheableResponse: {
            statuses: [0, 200]
          }
        },
        expiration: {
          maxEntries: 100,
        },
      }
  ]
};
