<template>
  <div>
    

    <!-- Welcome Section -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold mb-2">Welcome back, Dr. Johnson</h2>
            <p class="text-blue-100 text-lg font-medium">Your healthcare management hub awaits</p>
          </div>
          <div class="hidden md:block">
            <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span class="material-icons-round text-4xl text-white">medical_services</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <div
        v-for="(menu, index) in menus"
        :key="'card-' + index"
        class="group relative overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 text-center cursor-pointer transition-transform duration-300 transform-gpu hover:-translate-y-1 hover:scale-105 border border-gray-200/50 hover:border-blue-200/40 hover:ring-4 hover:ring-blue-200/20"
        @click="navigateToFirstItem(menu)"
      >
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-6">
          <span class="material-icons-round text-2xl text-white transition-transform duration-300">{{ menu.icon }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {{ menu.title }}
        </h3>
        <p class="text-sm text-slate-500 font-medium">{{ menu.items.length }} features</p>

        <!-- Hover preview: shows full feature list on hover (clickable) -->
        <ul class="mt-3 text-sm text-slate-500 space-y-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <li
            v-for="(it, i2) in menu.items"
            :key="'preview-'+i2"
            class="truncate cursor-pointer hover:bg-blue-50 rounded px-2 py-1"
            @click.stop="goToFeature(menu.title, it)"
          >
            {{ it || '—' }}
          </li>
        </ul>
        <!-- Decorative glowing accent -->
        <div class="pointer-events-none absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Items</p>
            <p class="text-3xl font-bold text-slate-800">{{ totalItems.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span class="material-icons-round text-green-600">inventory</span>
          </div>
        </div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Active Users</p>
            <p class="text-3xl font-bold text-slate-800">{{ activeUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span class="material-icons-round text-blue-600">people</span>
          </div>
        </div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Monthly Sales</p>
            <p class="text-3xl font-bold text-slate-800">{{ formatCurrency(monthlySales) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span class="material-icons-round text-purple-600">trending_up</span>
          </div>
        </div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Low Stock</p>
            <p class="text-3xl font-bold text-slate-800">{{ lowStockCount }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <span class="material-icons-round text-red-600">warning</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter();

const totalItems = ref(0);
const activeUsers = ref(0);
const monthlySales = ref(0);
const lowStockCount = ref(0);

function formatCurrency(v) {
  const n = Number(v || 0);
  return 'Rs.' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

onMounted(async () => {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/reports/overview`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) {
      const text = await res.text();
      console.error('Dashboard metrics fetch failed', res.status, text);
      return;
    }
    const body = await res.json();
    totalItems.value = body.totalItems || 0;
    activeUsers.value = body.activeUsers || 0;
    monthlySales.value = body.monthlySales || 0;
    lowStockCount.value = body.lowStockCount || 0;
  } catch (err) {
    console.error('Failed to load dashboard metrics', err);
  }
});

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
   {
    title: "Expenses",
    icon: "analytics",
    items: ["", ""],
  },
];

function navigateToFirstItem(menu) {
  const routeMap = {
    'Administrator': '/admin/change-password',
    'Item': '/item/sales',
    'Supplier': '/supplier/details',
    'Sales': '/sales/return-refund',
    'Reports': '/reports/drug-movement',
    'Expenses': '/expenses/view'
  };
  
  if (routeMap[menu.title]) {
    router.push(routeMap[menu.title]);
  }
}

const featureRouteMap = {
  Administrator: {
    'Change Password': '/admin/change-password',
    'Create User Account': '/admin/create-user',
    'Assign Capability': '/admin/assign-capability',
  },
  Item: {
    'Item Sales': '/item/sales',
    'Item Details': '/item/details',
    'Stock Update': '/item/stock-update',
  },
  Supplier: {
    'Supplier Details': '/supplier/details',
    'Supplier Invoice': '/supplier/invoice',
  },
  Sales: {
    'Customer Return / Refund': '/sales/return-refund',
    'Creditors': '/sales/creditors',
  },
  Reports: {
    'Drugs Movement': '/reports/drug-movement',
    'Inventory Summary': '/reports/inventory-summary',
  },
  Expenses: {
    '': '/expenses/view',
  },
};

function goToFeature(menuTitle, feature) {
  if (!feature) {
    // fallback to menu-level route
    navigateToFirstItem({ title: menuTitle });
    return;
  }

  const route = featureRouteMap[menuTitle] && featureRouteMap[menuTitle][feature];
  if (route) {
    router.push(route);
  } else {
    // fallback: try menu-level route
    navigateToFirstItem({ title: menuTitle });
  }
}

function logout() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    // ignore
  }
  router.push({ name: 'Login' });
}
</script>