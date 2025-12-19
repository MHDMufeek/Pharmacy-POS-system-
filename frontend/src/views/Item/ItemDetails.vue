<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Item Details</h1>
      <div class="flex gap-2">
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <span class="material-icons mr-1">arrow_back</span> Back
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="bg-blue-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-blue-600">inventory</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Items</p>
            <p class="text-2xl font-bold text-black">{{ stockItems.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="bg-red-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-red-600">warning</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Low Stock Items</p>
            <p class="text-2xl font-bold text-black">{{ lowStockItems }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="bg-green-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-green-600">attach_money</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Stock Value</p>
            <p class="text-2xl font-bold text-black">Rs.{{ totalStockValue.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider ">Item</th>
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider">Min Level</th>
            <th class="px-6 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in paginatedItems" :key="item.id">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">inventory_2</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                  <div v-if="item.code" class="text-xs text-gray-500">Code: {{ item.code }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.category }}</td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ item.currentStock }} units</div>
              <div v-if="item.maxLevel" class="text-xs text-gray-500">
                Max: {{ item.maxLevel }} units
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.minLevel }}</td>
            <td class="px-6 py-4">
              <span 
                :class="[
                  'px-3 py-1 text-xs rounded-full font-medium',
                  getStockStatus(item) === 'Low' ? 'bg-red-100 text-red-700' :
                  getStockStatus(item) === 'Adequate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                ]"
              >
                {{ getStockStatus(item) }}
              </span>
              <div v-if="getStockStatus(item) === 'Low'" class="text-xs text-red-500 mt-1">
                ⚠️ Needs restock
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="stockItems.length === 0" class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span class="material-icons text-gray-400 text-2xl">inventory_2</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p class="text-gray-500 mb-4">Add your first item to get started</p>
        <button 
          @click="showAddItemModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <span class="material-icons text-sm mr-1">add</span>
          Add First Item
        </button>
      </div>

      <!-- Your Specific Pagination Panel -->
      <div v-if="stockItems.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing 
              <span class="font-medium">{{ startItem }}</span> 
              to 
              <span class="font-medium">{{ endItem }}</span> 
              of
              <span class="font-medium">{{ stockItems.length }}</span> 
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">previous</span>
                <span class="material-icons">chevron_left</span>
              </button>
              
              <!-- Page Numbers -->
              <button 
                v-for="pageNumber in visiblePageNumbers"
                :key="pageNumber"
                @click="goToPage(pageNumber)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium',
                  pageNumber === currentPage 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ pageNumber }}
              </button>
              
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">next</span>
                <span class="material-icons">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Mobile view -->
        <div class="sm:hidden flex-1 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
              ]"
            >
              Prev
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Item Details</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Name:</span>
            <span class="font-medium">{{ selectedItem.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium">{{ selectedItem.category }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Current Stock:</span>
            <span class="font-medium" :class="getStockStatus(selectedItem) === 'Low' ? 'text-red-600' : 'text-green-600'">
              {{ selectedItem.currentStock }} units
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Min Level:</span>
            <span class="font-medium">{{ selectedItem.minLevel }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Cost Price:</span>
            <span class="font-medium">${{ selectedItem.costPrice?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Selling Price:</span>
            <span class="font-medium">${{ selectedItem.sellingPrice?.toFixed(2) || '0.00' }}</span>
          </div>
          <div v-if="selectedItem.supplier" class="flex justify-between">
            <span class="text-gray-600">Supplier:</span>
            <span class="font-medium">{{ selectedItem.supplier }}</span>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="showDetailsModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

const stockItems = ref([]);

async function loadItems() {
  try {
    const res = await api.get('/items');
    const items = (res.data && res.data.data) || [];
    stockItems.value = items.map(it => ({
      id: it._id || it.id,
      _id: it._id,
      name: it.name,
      category: it.category,
      currentStock: it.stock ?? it.currentStock ?? 0,
      minLevel: (it.metadata && it.metadata.minLevel) || it.minLevel || 0,
      maxLevel: it.maxLevel || it.maximumLevel || null,
      costPrice: it.cost || it.costPrice || 0,
      sellingPrice: it.price || it.sellingPrice || 0,
      supplier: it.supplier || '',
      code: it.code || it.itemCode || '',
      ...it
    }));
  } catch (e) {
    console.error('Failed to load items', e);
  }
} 

const categories = ref(["Pain Relief", "Antibiotics", "Supplements", "Diabetes", "Allergy", "Steroids", "Acidity", "Hormones", "Vitamins", "First Aid"]);
const suppliers = ref(["PharmaCorp", "MediLife", "HealthPharma", "BioMed", "Global Pharma", "MediPlus", "PharmaWorld"]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

// Modal states
const showAddItemModal = ref(false);
const showUpdateModal = ref(false);
const showDetailsModal = ref(false);

// Form data for new item
const newItem = ref({
  name: "",
  category: "",
  manufacturer: "",
  code: "",
  currentStock: 0,
  minLevel: 10,
  maxLevel: 1000,
  costPrice: 0,
  sellingPrice: 0,
  supplier: "",
  expiryDate: ""
});

// Stock update modal data
const selectedItem = ref({});
const adjustmentType = ref("add");
const adjustmentQuantity = ref(0);

// Computed properties
const lowStockItems = computed(() => {
  return stockItems.value.filter(item => item.currentStock <= item.minLevel).length;
});

const totalStockValue = computed(() => {
  return stockItems.value.reduce((sum, item) => {
    return sum + (item.currentStock * item.costPrice);
  }, 0);
});

const profitMargin = computed(() => {
  if (newItem.value.costPrice > 0 && newItem.value.sellingPrice > 0) {
    return ((newItem.value.sellingPrice - newItem.value.costPrice) / newItem.value.costPrice) * 100;
  }
  return 0;
});

const totalPages = computed(() => Math.ceil(stockItems.value.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return stockItems.value.slice(start, start + itemsPerPage);
});

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, stockItems.value.length));

const visiblePageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 3; // Show only 3 page numbers as in your design
  
  if (totalPages.value <= maxVisible) {
    // Show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Show current page and neighbors
    let start = Math.max(1, currentPage.value - 1);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    // Adjust if we're at the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// Functions
function getStockStatus(item) {
  if (item.currentStock <= item.minLevel) return "Low";
  if (item.currentStock <= item.minLevel * 2) return "Adequate";
  return "Good";
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function generateItemCode() {
  const prefix = 'MED';
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  newItem.value.code = `${prefix}-${random}`;
}

function addNewItem() {
  if (!newItem.value.name || !newItem.value.category) {
    alert("Please fill in all required fields");
    return;
  }

  const newId = stockItems.value.length > 0 ? Math.max(...stockItems.value.map(item => item.id)) + 1 : 1;
  
  const itemToAdd = {
    id: newId,
    name: newItem.value.name,
    category: newItem.value.category,
    manufacturer: newItem.value.manufacturer || "",
    code: newItem.value.code || `MED-${String(newId).padStart(3, '0')}`,
    currentStock: Number(newItem.value.currentStock) || 0,
    minLevel: Number(newItem.value.minLevel) || 10,
    maxLevel: Number(newItem.value.maxLevel) || 1000,
    costPrice: Number(newItem.value.costPrice) || 0,
    sellingPrice: Number(newItem.value.sellingPrice) || 0,
    supplier: newItem.value.supplier || "",
    expiryDate: newItem.value.expiryDate || ""
  };

  stockItems.value.push(itemToAdd);
  
  // Reset form
  newItem.value = {
    name: "",
    category: "",
    manufacturer: "",
    code: "",
    currentStock: 0,
    minLevel: 10,
    maxLevel: 1000,
    costPrice: 0,
    sellingPrice: 0,
    supplier: "",
    expiryDate: ""
  };
  
  showAddItemModal.value = false;
  alert("Item added successfully!");
}

function editStock(item) {
  selectedItem.value = { ...item };
  adjustmentType.value = "add";
  adjustmentQuantity.value = "";
  showUpdateModal.value = true;
}

function quickRestock(item) {
  selectedItem.value = { ...item };
  adjustmentType.value = "add";
  adjustmentQuantity.value = 50;
  showUpdateModal.value = true;
}

function showItemDetails(item) {
  selectedItem.value = { ...item };
  showDetailsModal.value = true;
}

function updateStock() {
  const index = stockItems.value.findIndex(i => i.id === selectedItem.value.id);
  if (index === -1) return;

  let quantity = Number(adjustmentQuantity.value);
  if (isNaN(quantity) || quantity < 0) {
    alert("Please enter a valid quantity");
    return;
  }

  if (adjustmentType.value === "add") {
    stockItems.value[index].currentStock += quantity;
  } else if (adjustmentType.value === "subtract") {
    stockItems.value[index].currentStock = Math.max(0, stockItems.value[index].currentStock - quantity);
  } else if (adjustmentType.value === "set") {
    stockItems.value[index].currentStock = Math.max(0, quantity);
  }

  showUpdateModal.value = false;
  adjustmentQuantity.value = 0;
}

// Initialize data
onMounted(async () => {
  await loadItems();
  console.log("Table should display", stockItems.value.length, "items");
});
</script>

<style scoped>
.container {
  max-width: 100%;
}

/* Ensure table displays properly */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Custom styles for pagination */
nav button:focus {
  outline: none;
  ring: 2px;
 
}
</style>