import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import 'material-icons/iconfont/material-icons.css';

// Apply saved theme preference early so components render correctly
try {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
} catch(e) {}

createApp(App).use(router).mount('#app')