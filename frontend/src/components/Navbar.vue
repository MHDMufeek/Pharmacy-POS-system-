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
        <button class="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
          <span class="material-icons-round text-slate-600 group-hover:text-slate-800">notifications</span>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <!-- Settings -->
        <button class="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group dark:hover:bg-gray-800">
          <span class="material-icons-round text-slate-600 group-hover:text-slate-800 dark:text-slate-200">settings</span>
        </button>

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
            <p class="font-bold text-slate-800 text-sm">Dr. Sarah Johnson</p>
            <p class="text-xs text-slate-500 font-medium">Senior Administrator</p>
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
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  sidebarOpen: Boolean
});

const emit = defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();

const currentRouteName = computed(() => route.name);

// Logout function
function logout() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    // ignore
  }
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
</script>