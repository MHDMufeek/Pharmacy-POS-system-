<template>
  <header class="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-5 sticky top-0 w-full z-40 dark:bg-gray-900/70 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- Hamburger Menu -->
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
        >
          <span class="material-icons-round text-slate-600 group-hover:text-slate-800 transition-colors">
            {{ sidebarOpen ? 'menu_open' : 'menu' }}
          </span>
        </button>

        <!-- Page Title with Breadcrumb -->
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
            {{ currentRouteName || 'Dashboard' }}
          </h1>
          <p class="text-sm text-slate-500 font-medium dark:text-slate-400">
            {{ currentRouteName ? 'Management Panel' : 'Welcome back to your dashboard' }}
          </p>
        </div>
      </div>

      <!-- Center - Search Bar (only on dashboard) -->
      <div v-if="!currentRouteName" class="flex-1 max-w-xl mx-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="material-icons-round text-slate-400 text-xl">search</span>
          </div>
          <input
            type="text"
            placeholder="Search patients, medications, reports..."
            class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <div class="relative">
          <button @click="toggleNotif" class="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
            <span class="material-icons-round text-slate-600 group-hover:text-slate-800">notifications</span>
            <span v-if="notifCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 text-xs flex items-center justify-center bg-red-500 rounded-full border-2 border-white text-white">{{ notifCount }}</span>
          </button>

          <!-- Dropdown -->
          <div v-if="showNotif" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-3 border-b flex items-center justify-between">
              <div class="font-medium">Notifications</div>
              <button @click="fetchNotifications" class="text-sm text-blue-600">Refresh</button>
            </div>
            <div class="max-h-64 overflow-auto">
              <div v-if="notifItems.length === 0" class="p-4 text-sm text-gray-500">No alerts</div>
              <div v-for="(n, i) in notifItems" :key="n._id || i" class="p-3 hover:bg-gray-50 border-b last:border-b-0">
                <div v-if="n.type === 'expiry-alert'" class="flex items-center justify-between">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">Expiry alert: {{ n.name }}</div>
                  <div v-if="(daysUntil(n.expiryDate || n.expiryAlertDate) !== null)" class="text-xs ml-2 px-2 py-0.5 rounded-full text-white" :class="daysUntil(n.expiryDate || n.expiryAlertDate) < 0 ? 'bg-red-500' : 'bg-yellow-600'">
                    <span v-if="daysUntil(n.expiryDate || n.expiryAlertDate) < 0">Expired</span>
                    <span v-else>{{ daysUntil(n.expiryDate || n.expiryAlertDate) }}d</span>
                  </div>
                </div>
                <div v-if="n.type === 'expiry-alert'" class="text-xs text-gray-500">Expires: {{ n.expiryDate || n.expiryAlertDate || 'N/A' }} — Category: {{ n.category || 'N/A' }}</div>

                <div v-if="n.type === 'low-stock'" class="text-sm font-medium text-gray-900 dark:text-white">Low stock: {{ n.name }}</div>
                <div v-if="n.type === 'low-stock'" class="text-xs text-gray-500">Category: {{ n.category || 'N/A' }} — Remaining stock: {{ n.stock }}</div>
              </div>
            </div>
          </div>
        </div>

        

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group dark:hover:bg-gray-800"
        >
          <span class="material-icons-round text-slate-600 group-hover:text-slate-800 dark:text-slate-200">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- User Profile -->
        <div class="flex items-center gap-3 ml-2">
            <div class="text-right hidden sm:block">
              <p class="font-bold text-slate-800 text-sm">{{ userName }}</p>
              <p class="text-xs text-slate-500 font-medium">{{ userRoleLabel }}</p>
            </div>
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
            <span class="material-icons-round text-white text-lg">person</span>
          </div>
        </div>
        <!-- Logout -->
        <button
          @click="logout"
          class="ml-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
          title="Logout"
        >
          <span class="material-icons-round text-red-600 text-base">logout</span>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  sidebarOpen: Boolean
});

const emit = defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();

const currentRouteName = computed(() => route.name);

// Current user (from localStorage)
const user = ref({ name: 'Guest', role: '' });
// handler reference so we can remove it on unmount
let storageHandler = null;
// custom auth event name: 'authChanged'
const userName = computed(() => (user.value && user.value.name) ? user.value.name : 'Guest');
const userRoleLabel = computed(() => {
  const r = (user.value && user.value.role) ? (user.value.role || '') : '';
  if (!r) return '';
  return r.charAt(0).toUpperCase() + r.slice(1);
});

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    user.value = raw ? JSON.parse(raw) : { name: 'Guest', role: '' };
  } catch (e) {
    user.value = { name: 'Guest', role: '' };
  }
}

// Logout function
function logout() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    // ignore
  }
  try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
  router.push({ name: 'Login' });
}

// Theme state
const isDark = ref(false);
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  try { localStorage.setItem('theme', isDark.value ? 'dark' : 'light'); } catch (e) {}
}

// Notifications state
const notifItems = ref([]);
const showNotif = ref(false);
const notifCount = computed(() => notifItems.value.length);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

  function parseDate(val) {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d;
  }

  function daysUntil(val) {
    const d = parseDate(val);
    if (!d) return null;
    // compute days from today to end of day
    const now = new Date();
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    const diff = end - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

async function fetchNotifications() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/notifications/alerts?lowStock=10&limit=10`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) {
      const text = await res.text();
      console.error('Failed to fetch notifications', res.status, text);
      return;
    }
    const body = await res.json();
    // normalize items: backend sets _type to 'low-stock' or 'expiry-alert'
    notifItems.value = (body.items || []).map(it => ({
      ...it,
      type: it._type || it.type || 'low-stock'
    }));
  } catch (err) {
    console.error('Error fetching notifications', err);
  }
}

function toggleNotif() {
  showNotif.value = !showNotif.value;
  if (showNotif.value) fetchNotifications();
}

onMounted(() => {
  // initial load (no dropdown open)
  fetchNotifications();
  // listen for stock updates elsewhere in the app
  window.addEventListener('low-stock-updated', fetchNotifications);
  // watch for storage changes (other tabs or auth updates)
  loadUserFromStorage();
  // listen for cross-tab storage events
  storageHandler = (ev) => { if (ev.key === 'user') loadUserFromStorage(); };
  window.addEventListener('storage', storageHandler);
  // also listen for same-tab auth changes dispatched within the app
  window.addEventListener('authChanged', loadUserFromStorage);
});

onUnmounted(() => {
  window.removeEventListener('low-stock-updated', fetchNotifications);
  window.removeEventListener('storage', storageHandler);
  window.removeEventListener('authChanged', loadUserFromStorage);
});
</script>