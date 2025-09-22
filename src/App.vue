<template>
  <div class="flex h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed top-0 left-0 h-screen z-50 transition-all duration-300 shadow-2xl border-r border-slate-700/50'
      ]"
      :style="{ width: sidebarOpen ? '280px' : '80px' }"
    >
      <!-- Logo -->
      <div class="flex items-center gap-4 p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg text-lg">
          M
        </div>
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
            <button
              v-for="(sub, i) in menu.items"
              :key="i"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group',
                currentPage === sub 
                  ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
              ]"
              @click="navigateTo(sub)"
            >
              <span class="w-1 h-1 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
              {{ sub }}
            </button>
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

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :style="{ marginLeft: sidebarOpen ? '280px' : '80px' }"
    >
      <!-- Top Navbar -->
      <header class="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-5 sticky top-0 w-full z-40">
        <div class="flex items-center justify-between">
          <!-- Left Section -->
          <div class="flex items-center gap-4">
            <!-- Hamburger Menu -->
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <span class="material-icons-round text-slate-600 group-hover:text-slate-800 transition-colors">
                {{ sidebarOpen ? 'menu_open' : 'menu' }}
              </span>
            </button>

            <!-- Page Title with Breadcrumb -->
            <div class="flex flex-col">
              <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
                {{ currentPage || 'Dashboard' }}
              </h1>
              <p class="text-sm text-slate-500 font-medium">
                {{ currentPage ? 'Management Panel' : 'Welcome back to your dashboard' }}
              </p>
            </div>
          </div>

          <!-- Center - Search Bar (only on dashboard) -->
          <div v-if="!currentPage" class="flex-1 max-w-xl mx-8">
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
            <button class="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
              <span class="material-icons-round text-slate-600 group-hover:text-slate-800">settings</span>
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
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
        <!-- Pages -->
        <ChangePassword v-if="currentPage === 'Change Password'" @go-back="currentPage = null" />
        <CreateUserAccount v-if="currentPage === 'Create User Account'" @go-back="currentPage = null" />
        <AssistCapability v-if="currentPage === 'Assist Capability'" @go-back="currentPage = null" />
        <ItemSales v-if="currentPage === 'Item Sales'" @go-back="currentPage = null" />
        <ItemDetails v-if="currentPage === 'Item Details'" @go-back="currentPage = null" />
        <StockUpdate v-if="currentPage === 'Stock Update'" @go-back="currentPage = null" />
        <SupplierDetails v-if="currentPage === 'Supplier Details'" @go-back="currentPage = null" />
        <SupplierInvoice v-if="currentPage === 'Supplier Invoice'" @go-back="currentPage = null" />
        <CustomerReturnRefund v-if="currentPage === 'Customer Return / Refund'" @go-back="currentPage = null" />
        <Creditors v-if="currentPage === 'Creditors'" @go-back="currentPage = null" />
        <DrugMovement v-if="currentPage === 'Drugs Movement'" @go-back="currentPage = null" />
        <InventorySummary v-if="currentPage === 'Inventory Summary'" @go-back="currentPage = null" />

        <!-- Dashboard Cards -->
        <div v-else>
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
              class="group bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-blue-200"
              @click="navigateTo(menu.title)"
            >
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span class="material-icons-round text-2xl text-white">{{ menu.icon }}</span>
              </div>
              <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {{ menu.title }}
              </h3>
              <p class="text-sm text-slate-500 font-medium">{{ menu.items.length }} features</p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Items</p>
                  <p class="text-3xl font-bold text-slate-800">2,847</p>
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
                  <p class="text-3xl font-bold text-slate-800">124</p>
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
                  <p class="text-3xl font-bold text-slate-800">$45.2K</p>
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
                  <p class="text-3xl font-bold text-slate-800">18</p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span class="material-icons-round text-red-600">warning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChangePassword from './ChangePassword.vue';
import CreateUserAccount from './CreateUserAccount.vue';
import AssistCapability from './AssistCapability.vue';
import ItemSales from './ItemSales.vue';
import ItemDetails from './ItemDetails.vue';
import StockUpdate from './StockUpdate.vue';
import SupplierDetails from './SupplierDetails.vue';
import SupplierInvoice from './SupplierInvoice.vue';
import CustomerReturnRefund from './CustomerReturnRefund.vue';
import Creditors from './Creditors.vue';
import DrugMovement from './DrugMovement.vue';
import InventorySummary from './InventorySummary.vue';

const sidebarOpen = ref(true);
const openMenu = ref(null);
const currentPage = ref(null);

const menus = [
  {
    title: "Administrator",
    icon: "admin_panel_settings",
    items: ["Change Password", "Create User Account", "Assist Capability"],
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

function navigateTo(destination) {
  const mainMenuItems = menus.map(menu => menu.title);
  if (mainMenuItems.includes(destination)) {
    const menuIndex = menus.findIndex(menu => menu.title === destination);
    toggleMenu(menuIndex);
    return;
  }

  const supportedPages = [
    "Change Password",
    "Create User Account",
    "Assist Capability",
    "Item Sales",
    "Item Details",
    "Stock Update",
    "Supplier Details",
    "Supplier Invoice",
    "Sales Bill",
    "Customer Return / Refund",
    "Creditors",
    "Drugs Movement",
    "Inventory Summary"
  ];

  if (supportedPages.includes(destination)) {
    currentPage.value = destination;
  } else {
    alert(`Navigating to ${destination} - Page under development`);
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Round");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-track-slate-800::-webkit-scrollbar-track {
  background-color: rgb(30 41 59);
}

.scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
  background-color: rgb(71 85 105);
  border-radius: 6px;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Improved focus states */
button:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>