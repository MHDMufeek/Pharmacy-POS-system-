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
        class="group bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-blue-200"
        @click="navigateToFirstItem(menu)"
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
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

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
    'Expenses':''
  };
  
  router.push(routeMap[menu.title]);
}
</script>