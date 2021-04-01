import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

// vue-toastification options
const options = {
  position: 'bottom-left',
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false //right to left
};

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(Toast, options)
  .mount('#app');
