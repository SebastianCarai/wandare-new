import { createApp} from 'vue';
import { store } from './store';
import './style.css'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';

import { registerPWA } from './pwa-register';
registerPWA();

navigator.serviceWorker.addEventListener('controllerchange', () => {
  // When the new service worker takes control, reload the page
  window.location.reload();
});

const app = createApp(App);

app.use(router)
app.use(store);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const reg of registrations) {
      // Defensive cleanup if SW is misbehaving
      if (reg.active && reg.active.scriptURL.includes('/api/callback')) {
        reg.unregister();
      }
    }
  });
}
app.mount('#app');
