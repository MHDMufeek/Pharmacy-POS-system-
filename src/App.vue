<template>
  <div class="flex h-screen w-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-screen z-50 transition-all duration-300',
        sidebarOpen ? 'w-72' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 p-6 border-b border-blue-800">
        <div class="w-10 h-10 bg-white text-blue-900 rounded-full flex items-center justify-center font-bold">
          M
        </div>
        <h1 v-show="sidebarOpen" class="text-lg font-semibold">Medicite</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-4 text-sm">
        <div v-for="(menu, index) in menus" :key="index" class="mb-3">
          <!-- Main Item -->
          <button
            @click="toggleMenu(index)"
            class="flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-blue-800"
          >
            <div class="flex items-center gap-3">
              <span class="material-icons">{{ menu.icon }}</span>
              <span v-show="sidebarOpen" class="font-semibold uppercase">{{ menu.title }}</span>
            </div>
            <span v-show="sidebarOpen" class="material-icons text-sm">
              {{ openMenu === index ? "expand_less" : "expand_more" }}
            </span>
          </button>

          <!-- Submenu -->
          <ul
            v-show="openMenu === index && sidebarOpen"
            class="ml-10 mt-1 space-y-1 text-blue-100 transition-all"
          >
            <li
              v-for="(sub, i) in menu.items"
              :key="i"
              class="hover:text-white cursor-pointer"
            >
              › {{ sub }}
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col ml-20 md:ml-72 transition-all duration-300">
      <!-- Top Navbar -->
      <header class="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 w-full">
        <!-- Hamburger for mobile -->
        <button class="md:hidden" @click="sidebarOpen = !sidebarOpen">
          <span class="material-icons text-gray-700">menu</span>
        </button>

        <!-- Search Bar -->
        <div class="flex items-center w-1/2 max-w-lg">
          <div class="flex items-center w-full bg-gray-100 rounded-lg px-3 py-2">
            <span class="material-icons text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Search..."
              class="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <!-- User Profile -->
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="font-semibold text-gray-800">User name</p>
            <p class="text-xs text-gray-500">Position</p>
          </div>npm
          <div class="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
            <span class="material-icons text-blue-800">person</span>
          </div>
        </div>
      </header>

      <!-- Dashboard Buttons -->
      <main class="flex-1 p-6 overflow-y-auto">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="(menu, index) in menus"
            :key="'card-' + index"
            class="bg-blue-100 hover:bg-blue-200 shadow-md rounded-xl p-16 text-center cursor-pointer"
          >
            <span class="text-2xl font-semibold text-blue-900">{{ menu.title }}</span>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(true);
const openMenu = ref(null);

const menus = [
  {
    title: "Administrator",
    icon: "admin_panel_settings",
    items: ["Change Password", "Create User Account", "Assist Capability"],
  },
  {
    title: "Item",
    icon: "inventory_2",
    items: ["Item Category", "Item Details", "Stock Update"],
  },
  {
    title: "Supplier",
    icon: "local_shipping",
    items: ["Supplier Details", "Supplier Invoice"],
  },
  {
    title: "Sales",
    icon: "point_of_sale",
    items: ["Sales Bill", "Customer Return / Refund", "Creditors"],
  },
  {
    title: "Reports",
    icon: "bar_chart",
    items: ["Drugs Movement", "Inventory Summary"],
  },
  {
    title: "Credit",
    icon: "bar_chart",
    items: ["Credit Sale", "Credit History"],
  },

  
];

function toggleMenu(index) {
  openMenu.value = openMenu.value === index ? null : index;
}
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

/* FIX black background issues */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #f9fafb; /* Tailwind gray-50 */
}
</style>
