# Issue #3: PWA化によるオフライン対応

## 概要
Progressive Web App (PWA) として実装し、インストール可能でオフラインでも動作する防災アプリケーションに進化させる。

## 目的
- オフライン環境での完全動作
- ホーム画面へのインストール
- プッシュ通知による緊急情報配信
- 高速な起動とレスポンス
- ネイティブアプリのようなUX

## 背景
災害時は以下の状況が想定される：
- インターネット接続の不安定性
- 通信インフラの障害
- バッテリー残量の制約
- アプリストアへのアクセス困難

PWA化により、事前インストールとオフライン動作で、これらの課題を解決する。

---

## 技術要件

### 必須要件
- [ ] HTTPS配信（開発環境は除く）
- [ ] Service Worker登録
- [ ] Web App Manifestファイル
- [ ] オフラインでの基本機能動作
- [ ] インストール可能

### 推奨要件
- [ ] プッシュ通知対応
- [ ] バックグラウンド同期
- [ ] アプリシェル アーキテクチャ
- [ ] キャッシュ戦略の最適化

---

## 実装計画

### Phase 1: Web App Manifest

**ファイル作成: `public/manifest.json`**

```json
{
  "name": "つながる防災 - Connecting Disaster Prevention",
  "short_name": "つながる防災",
  "description": "地域コミュニティの防災力を高めるアプリケーション",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["utilities", "lifestyle", "health"],
  "shortcuts": [
    {
      "name": "避難所マップ",
      "short_name": "避難所",
      "description": "近くの避難所を確認",
      "url": "/evacuation",
      "icons": [
        {
          "src": "/icons/shortcut-evacuation.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "AIアシスタント",
      "short_name": "AI",
      "description": "防災AIに質問",
      "url": "/ai",
      "icons": [
        {
          "src": "/icons/shortcut-ai.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "チェックリスト",
      "short_name": "リスト",
      "description": "準備状況を確認",
      "url": "/checklist",
      "icons": [
        {
          "src": "/icons/shortcut-checklist.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "related_applications": [],
  "prefer_related_applications": false
}
```

**推定工数:** 2-3時間

---

### Phase 2: Service Worker実装

**ファイル作成: `public/sw.js`**

```javascript
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `bousai-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bousai-dynamic-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/main.css',
  '/assets/main.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/data/disasters/earthquake/during.json',
  '/data/disasters/tsunami/during.json'
];

// インストールイベント
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', event);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// アクティベーションイベント
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// フェッチイベント - キャッシュ戦略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API リクエストは Network First
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 静的アセットは Cache First
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // その他は Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// キャッシュ戦略: Cache First
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  return cached || fetch(request);
}

// キャッシュ戦略: Network First
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || caches.match(OFFLINE_PAGE);
  }
}

// キャッシュ戦略: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
}

// 静的アセット判定
function isStaticAsset(url) {
  return url.endsWith('.css') || 
         url.endsWith('.js') || 
         url.endsWith('.png') || 
         url.endsWith('.jpg') || 
         url.endsWith('.svg') ||
         url.endsWith('.woff2');
}

// プッシュ通知
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '防災アラート';
  const options = {
    body: data.body || '新しい情報があります',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.urgent || false,
    actions: [
      {
        action: 'open',
        title: '開く'
      },
      {
        action: 'close',
        title: '閉じる'
      }
    ],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 通知クリックイベント
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-disaster-info') {
    event.waitUntil(syncDisasterInfo());
  }
});

async function syncDisasterInfo() {
  try {
    const response = await fetch('/api/disaster-info');
    const data = await response.json();
    // データをIndexedDBに保存
    // ... 実装
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}
```

**推定工数:** 6-8時間

---

### Phase 3: Vite PWAプラグイン統合

**パッケージインストール:**
```bash
npm install vite-plugin-pwa workbox-window -D
```

**vite.config.ts 更新:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        // manifest.jsonの内容
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1時間
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});
```

**推定工数:** 3-4時間

---

### Phase 4: オフラインページとUI

**ファイル作成: `public/offline.html`**
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>オフライン - つながる防災</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
    }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    p { font-size: 1.1rem; line-height: 1.6; }
    .icon { font-size: 5rem; margin-bottom: 1rem; }
    button {
      margin-top: 2rem;
      padding: 12px 24px;
      font-size: 1rem;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover { background: #f0f0f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>オフラインモード</h1>
    <p>
      現在、インターネットに接続されていません。<br>
      キャッシュされた防災情報は引き続き利用できます。
    </p>
    <p>
      <strong>利用可能な機能:</strong><br>
      ✓ 基本的な防災情報<br>
      ✓ 避難所マップ（キャッシュ済み）<br>
      ✓ チェックリスト<br>
      ✓ AIアシスタント（ローカルモード）
    </p>
    <button onclick="window.location.reload()">再読み込み</button>
  </div>
</body>
</html>
```

**推定工数:** 2時間

---

### Phase 5: インストールプロンプト

**コンポーネント作成: `components/InstallPrompt.tsx`**
```typescript
import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <h3 className="font-bold text-lg mb-2">アプリをインストール</h3>
      <p className="text-sm mb-3">
        ホーム画面に追加して、オフラインでも使える防災アプリに!
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-100"
        >
          インストール
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 border border-white rounded hover:bg-blue-700"
        >
          後で
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
```

**推定工数:** 3時間

---

### Phase 6: プッシュ通知実装

**通知登録サービス: `services/notificationService.ts`**
```typescript
export class NotificationService {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('このブラウザは通知をサポートしていません');
    }
    return await Notification.requestPermission();
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        process.env.VITE_VAPID_PUBLIC_KEY || ''
      )
    });

    // サーバーに送信
    await this.sendSubscriptionToServer(subscription);
    
    return subscription;
  }

  async sendSubscriptionToServer(subscription: PushSubscription) {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  async showLocalNotification(title: string, options: NotificationOptions) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
  }
}
```

**推定工数:** 5-6時間

---

## テスト計画

### PWAチェックリスト
- [ ] Lighthouseスコア90点以上（PWA項目）
- [ ] Service Worker登録確認
- [ ] オフライン動作確認
- [ ] インストール動作確認
- [ ] プッシュ通知動作確認

### ブラウザ互換性テスト
- [ ] Chrome/Edge（Desktop & Mobile）
- [ ] Safari（iOS）
- [ ] Firefox
- [ ] Samsung Internet

### パフォーマンステスト
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1

---

## マイルストーン

### Week 1: 基本PWA実装
- [ ] Web App Manifest作成
- [ ] アイコン生成
- [ ] Service Worker基本実装

### Week 2: キャッシュ戦略
- [ ] オフラインページ作成
- [ ] キャッシュ戦略実装
- [ ] Workbox統合

### Week 3: 高度な機能
- [ ] インストールプロンプト
- [ ] プッシュ通知
- [ ] バックグラウンド同期

### Week 4: テスト・最適化
- [ ] クロスブラウザテスト
- [ ] パフォーマンス最適化
- [ ] Lighthouse監査

---

## 参考資料

- [PWA公式ドキュメント](https://web.dev/progressive-web-apps/)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## 関連Issue
- #1 ローカルLLMの統合
- #2 防災知識ベースの拡充
- #4 リアルタイム災害情報の取得

---

## ラベル
`enhancement`, `high-priority`, `pwa`, `offline-first`, `mobile`
