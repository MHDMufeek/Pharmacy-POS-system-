<template>
  <aside
    :class="[
      'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed top-0 left-0 h-screen z-50 transition-all duration-300 shadow-2xl border-r border-slate-700/50'
    ]"
    :style="{ width: sidebarOpen ? '280px' : '80px' }"
  >
    <!-- Logo as Dashboard Button -->
    <div class="flex items-center gap-4 p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
      <router-link 
        to="/dashboard" 
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            'w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
            isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''
          ]"
          :title="sidebarOpen ? 'Go to Dashboard' : 'Dashboard'"
        >
          M
        </button>
      </router-link>
      <div v-show="sidebarOpen" class="flex flex-col">
        <h1 class="text-xl font-bold tracking-tight text-white">Medicite</h1>
        <p class="text-xs text-slate-400 font-medium">Healthcare Management</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4 text-sm scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
      <div v-for="(menu, index) in menus" :key="index" class="mb-3">
        <!-- Main Item -->
        <button
          @click="toggleMenu(index)"
          :class="[
            'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group',
            openMenu === index 
              ? 'bg-blue-600/20 text-blue-300 shadow-lg border border-blue-500/30' 
              : 'hover:bg-slate-700/50 hover:text-white text-slate-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="material-icons-round text-xl transition-colors duration-200" 
                  :class="openMenu === index ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'">
              {{ menu.icon }}
            </span>
            <span v-show="sidebarOpen" class="font-semibold text-sm tracking-wide">{{ menu.title }}</span>
          </div>
          <span v-show="sidebarOpen" class="material-icons-round text-lg transition-transform duration-200"
                :class="openMenu === index ? 'rotate-180 text-blue-400' : 'text-slate-500'">
            expand_more
          </span>
        </button>

        <!-- Submenu -->
        <div
          v-show="openMenu === index && sidebarOpen"
          class="ml-6 mt-2 space-y-1 animate-fade-in"
        >
          <router-link
            v-for="(sub, i) in menu.items"
            :key="i"
            :to="getRoutePath(menu.title, sub)"
            custom
            v-slot="{ navigate, isActive }"
          >
            <button
              :class="[
                'w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group',
                isActive 
                  ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
              ]"
              @click="navigate"
            >
              <span class="w-1 h-1 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
              {{ sub }}
            </button>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div v-show="sidebarOpen" class="p-4 border-t border-slate-700/50 bg-slate-800/30">
      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span class="material-icons-round text-sm">info</span>
        <span>Version 2.1.0</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps({
  sidebarOpen: Boolean
});

const emit = defineEmits(['toggle-sidebar']);

const router = useRouter();
const openMenu = ref(null);

const menus = [
  {
    title: "Administrator",
    icon: "admin_panel_settings",
    items: ["Change Password", "Create User Account", "Assign Capability"],
  },
  {
    title: "Item",
    icon: "category",
    items: ["Item Sales", "Item Details", "Stock Update"],
  },
  {
    title: "Supplier",
    icon: "local_mall",
    items: ["Supplier Details", "Supplier Invoice"],
  },
  {
    title: "Sales",
    icon: "shopping_cart_checkout",
    items: ["Customer Return / Refund", "Creditors"],
  },
  {
    title: "Reports",
    icon: "analytics",
    items: ["Drugs Movement", "Inventory Summary"],
  },
];

function toggleMenu(index) {
  openMenu.value = openMenu.value === index ? null : index;
}

function getRoutePath(menuTitle, subItem) {
  const routeMap = {
    'Administrator': {
      'Change Password': '/admin/change-password',
      'Create User Account': '/admin/create-user',
      'Assign Capability': '/admin/assist'
    },
    'Item': {
      'Item Sales': '/item/sales',
      'Item Details': '/item/details',
      'Stock Update': '/item/stock-update'
    },
    'Supplier': {
      'Supplier Details': '/supplier/details',
      'Supplier Invoice': '/supplier/invoice'
    },
    'Sales': {
      'Customer Return / Refund': '/sales/return-refund',
      'Creditors': '/sales/creditors'
    },
    'Reports': {
      'Drugs Movement': '/reports/drug-movement',
      'Inventory Summary': '/reports/inventory-summary'
    }
  };
  
  return routeMap[menuTitle]?.[subItem] || '/';
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-track-slate-800::-webkit-scrollbar-track {
  background: #1e293b;
}

.scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 2px;
}

.scrollbar-thumb-slate-600::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>