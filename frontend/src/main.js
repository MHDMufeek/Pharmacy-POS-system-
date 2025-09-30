import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import 'material-icons/iconfont/material-icons.css';

createApp(App).use(router).mount('#app')