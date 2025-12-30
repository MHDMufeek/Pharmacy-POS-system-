<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Item Details</h1>
      
    </div>

    <div v-if="loadingItems" class="text-sm text-gray-500 mb-4">Loading items...</div>
    <div v-else-if="itemsError" class="text-sm text-red-600 mb-4">{{ itemsError }}</div>

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
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
            <th class="px-6 py-3 text-left text-2xl font-bold text-gray-500 uppercase tracking-wider">Add Date</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-black">
          <tr v-for="item in paginatedItems" :key="item.id" class="cursor-pointer hover:bg-gray-50" @click="showItemDetails(item)">
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

            <td class="px-6 py-4 text-sm text-gray-600">{{ item.latestExpiry ? formatDate(item.latestExpiry) : (item.expiryDate || '—') }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.addDate ? formatDate(item.addDate) : '—' }}</td>
            
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loadingItems && stockItems.length === 0" class="text-center py-12">
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

    <!-- Item Details Modal (redesigned) -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-3xl">
        <h3 class="text-lg font-semibold mb-4">Item Details</h3>
        <div class="flex flex-col md:flex-row gap-4 items-start text-sm text-gray-700">
          <div class="w-full md:w-44 flex-shrink-0">
            <div class="w-full h-44 bg-gray-100 rounded-md overflow-hidden border flex items-center justify-center">
              <img v-if="selectedItem.image" :src="selectedItem.image" :alt="selectedItem.name" class="w-full h-full object-cover" />
              <div v-else class="text-gray-400">No image</div>
            </div>
          </div>

          <div class="flex-1 space-y-3 text-left">
            <div>
              <span class="text-gray-600">Name:</span>
              <div class="font-bold text-lg">{{ selectedItem.name }}</div>
            </div>

            <div v-if="selectedItem.genericName">
              <span class="text-gray-600">Generic Name:</span>
              <div class="font-bold">{{ selectedItem.genericName }}</div>
            </div>

            <div v-if="selectedItem.manufacturer">
              <span class="text-gray-600">Brand Name:</span>
              <div class="font-bold">{{ selectedItem.manufacturer }}</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="text-gray-600">Category:</span>
                <div class="font-bold">{{ selectedItem.category }}</div>
              </div>
              <div>
                <span class="text-gray-600">Code:</span>
                <div class="font-bold">{{ selectedItem.code || selectedItem.sku || selectedItem.id || selectedItem._id || '—' }}</div>
              </div>
            </div>

            <div>
              <span class="text-gray-600">Stock:</span>
              <div class="font-bold" :class="getStockStatus(selectedItem) === 'Low' ? 'text-red-600' : 'text-green-600'">{{ selectedItem.currentStock }} units</div>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span class="text-gray-600">Batch Date:</span>
                <div class="font-bold">{{ selectedItem.metadata?.batchDate ? new Date(selectedItem.metadata.batchDate).toLocaleDateString() : (selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : '—') }}</div>
              </div>
              <div>
                <span class="text-gray-600">Expiry Date:</span>
                <div class="font-bold">{{ selectedItem.metadata?.expiryDate || selectedItem.expiryDate || selectedItem.expiry || '—' }}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="text-gray-600">Cost Price:</span>
                <div class="font-bold">Rs.{{ selectedItem.costPrice?.toFixed(2) || '0.00' }}</div>
              </div>
              <div>
                <span class="text-gray-600">Selling Price:</span>
                <div class="font-bold">Rs.{{ selectedItem.sellingPrice?.toFixed(2) || '0.00' }}</div>
              </div>
            </div>

            <div v-if="selectedItem.metadata?.dose || selectedItem.dose">
              <span class="text-gray-600">Dose Form:</span>
              <div class="font-bold">{{ selectedItem.metadata?.dose || selectedItem.dose }}</div>
            </div>

            <div v-if="selectedItem.metadata?.packageSize || selectedItem.packageSize">
              <span class="text-gray-600">Package Size:</span>
              <div class="font-bold">{{ selectedItem.metadata?.packageSize || selectedItem.packageSize }}</div>
            </div>

            <div v-if="selectedItem.expiryDate || selectedItem.expiry">
              <span class="text-gray-600">Expiry:</span>
              <div class="font-bold">{{ selectedItem.expiryDate || selectedItem.expiry }}</div>
            </div>

            <div v-if="selectedItem.description">
              <span class="text-gray-600">Description:</span>
              <div class="font-bold">{{ selectedItem.description }}</div>
            </div>

            <div v-if="selectedItem.supplier">
              <span class="text-gray-600">Supplier:</span>
              <div class="font-bold">{{ resolveSupplier(selectedItem.supplier) }}</div>
            </div>

            <div v-if="itemStockHistory.length" class="mt-4">
              <span class="text-gray-600">Added Stock History:</span>
              <div class="mt-2 bg-gray-50 rounded p-3 text-sm">
                <table class="min-w-full text-left">
                  <thead>
                    <tr>
                      <th class="text-xs text-gray-500 px-2">Date</th>
                      <th class="text-xs text-gray-500 px-2">Expiry Date</th>
                      <th class="text-xs text-gray-500 px-2">Quantity</th>
                      <th class="text-xs text-gray-500 px-2">Performed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(h, idx) in itemStockHistory" :key="idx" class="border-t">
                      <td class="px-2 py-1">{{ h.date }}</td>
                      <td class="px-2 py-1">{{ h.expiryDate || h.expiryAlertDate || '—' }}</td>
                      <td class="px-2 py-1">{{ h.quantity }}</td>
                      <td class="px-2 py-1">{{ h.performedBy || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
import { useRouter, useRoute } from 'vue-router';

// stock items (fetched from backend). Fallback to empty array for local dev
const stockItems = ref([]);
const loadingItems = ref(false);
const itemsError = ref(null);

// Supplier name cache
const suppliersMap = ref({})

async function fetchSupplierName(id) {
  if (!id) return null
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/suppliers/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) return null
    const data = await res.json()
    const name = data && data.name
    if (name) suppliersMap.value[id] = name
    return name
  } catch (err) {
    console.error('Failed to fetch supplier', id, err)
    return null
  }
}

function resolveSupplier(id) {
  if (!id) return ''
  const cached = suppliersMap.value[id]
  if (cached) return cached
  // background fetch, return id as fallback
  fetchSupplierName(id).catch(() => {})
  return id
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function fetchItems(page = 1, limit = 100) {
  loadingItems.value = true;
  itemsError.value = null;
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/items?page=${page}&limit=${limit}`, { headers });
    if (!res.ok) {
      if (res.status === 401) {
        itemsError.value = 'Unauthorized - please login';
      } else {
        itemsError.value = `Failed to load items (${res.status})`;
      }
      console.error('Fetch items error', res.statusText);
      return;
    }
    const body = await res.json();
    const items = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : (body.data || []));
    stockItems.value = items.map(it => ({
      id: it._id || it.id,
      name: it.name,
      category: it.category || '',
      currentStock: it.stock ?? it.currentStock ?? 0,
      minLevel: (it.metadata && it.metadata.minLevel) ?? it.minLevel ?? 10,
      maxLevel: (it.metadata && it.metadata.maxLevel) ?? it.maxLevel ?? 1000,
      costPrice: it.cost ?? it.costPrice ?? 0,
      sellingPrice: it.price ?? it.sellingPrice ?? 0,
      supplier: it.supplier || '',
      code: it.sku || it.code || '',
      // placeholders that will be filled by fetching history
      latestExpiry: null,
      addDate: null
    }));

    // kick off loading history for visible items (non-blocking)
    await loadPageHistory();
  } catch (err) {
    console.error('Error fetching items', err);
    itemsError.value = 'Failed to load items';
  } finally {
    loadingItems.value = false;
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
const itemStockHistory = ref([]);

const emit = defineEmits(['go-back']);
const router = useRouter();
const route = useRoute();

function goBack() {
  try { emit('go-back'); } catch (e) {}
  try { router.back(); } catch (e) {}
}

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
const adjustmentPrice = ref(0);

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

// Format a date string (YYYY-MM-DD or ISO) into a locale date, fall back to the original string
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
}

// Fetch latest history for a single item and attach addDate and latestExpiry to the item object
async function fetchAndAttachHistory(item) {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const id = item.id || item._id || item.code;
    if (!id) return;

    const res = await fetch(`${API_BASE}/items/${id}/history`, { headers });
    if (res.ok) {
      const body = await res.json();
      const arr = Array.isArray(body) ? body : [];
      if (arr.length > 0) {
        const entry = arr.find(e => (e.type || '').toLowerCase().includes('restock') || (e.type || '').toLowerCase().includes('add')) || arr[0];
        if (entry) {
          const rawExpiry = entry.expiryDate || entry.expiryAlertDate || null;
          const rawAdd = entry.date || entry.createdAt || null;
          item.latestExpiry = rawExpiry ? formatDate(rawExpiry) : null;
          item.addDate = rawAdd ? formatDate(rawAdd) : null;
          return;
        }
      }
    }

    // Fallback: check localStorage 'stockHistory' if server didn't return usable data
    try {
      const raw = localStorage.getItem('stockHistory');
      const all = raw ? JSON.parse(raw) : {};
      const entries = Array.isArray(all && all[id]) ? all[id] : [];
      if (entries && entries.length > 0) {
        const e = entries[0];
        const rawExpiry = e.expiryDate || e.expiryAlertDate || null;
        const rawAdd = e.date || e.createdAt || null;
        item.latestExpiry = rawExpiry ? formatDate(rawExpiry) : null;
        item.addDate = rawAdd ? formatDate(rawAdd) : null;
      }
    } catch (ex) {
      // no local fallback
    }
  } catch (err) {
    console.warn('Failed to fetch history for item', item.id, err);
    // last-resort fallback to localStorage
    try {
      const raw = localStorage.getItem('stockHistory');
      const all = raw ? JSON.parse(raw) : {};
      const id = item.id || item._id || item.code;
      const entries = Array.isArray(all && all[id]) ? all[id] : [];
      if (entries && entries.length > 0) {
        const e = entries[0];
        const rawExpiry = e.expiryDate || e.expiryAlertDate || null;
        const rawAdd = e.date || e.createdAt || null;
        item.latestExpiry = rawExpiry ? formatDate(rawExpiry) : null;
        item.addDate = rawAdd ? formatDate(rawAdd) : null;
      }
    } catch (ex2) {
      // give up
    }
  }
}

// Load history for all items on the current page (non-blocking)
async function loadPageHistory() {
  // operate on the currently visible items to avoid fetching for entire dataset
  const items = paginatedItems.value || [];
  await Promise.all(items.map(i => fetchAndAttachHistory(i)));
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // load history for the new page
    loadPageHistory();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadPageHistory();
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadPageHistory();
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
  adjustmentPrice.value = selectedItem.value.sellingPrice ?? selectedItem.value.costPrice ?? 0;
  showUpdateModal.value = true;
}

function quickRestock(item) {
  selectedItem.value = { ...item };
  adjustmentType.value = "add";
  adjustmentQuantity.value = 50;
  adjustmentPrice.value = selectedItem.value.sellingPrice ?? selectedItem.value.costPrice ?? 0;
  showUpdateModal.value = true;
}

async function loadItemDetails(item) {
  selectedItem.value = { ...item };
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/items/${item.id}`, { headers });
    if (res.ok) {
      const body = await res.json();
      selectedItem.value = {
        id: body._id || body.id,
        name: body.name,
        genericName: body.genericName || body.generic || undefined,
        manufacturer: body.manufacturer || body.brand || body.company || undefined,
        category: body.category || '',
        currentStock: body.stock ?? body.currentStock ?? 0,
        minLevel: (body.metadata && body.metadata.minLevel) ?? body.minLevel ?? 10,
        maxLevel: (body.metadata && body.metadata.maxLevel) ?? body.maxLevel ?? 1000,
        costPrice: body.cost ?? body.costPrice ?? 0,
        sellingPrice: body.price ?? body.sellingPrice ?? 0,
        supplier: body.supplier || '',
        code: body.sku || body.code || '',
        image: body.image || body.imageUrl || undefined,
        expiryDate: body.expiryDate || body.expiry || undefined,
        metadata: body.metadata || {},
        description: body.description || body.note || undefined
      };
    }
  } catch (err) {
    console.error('Failed to load item details', err);
  } finally {
    // attempt to load server-side history; fall back to localStorage
    try {
      const hid = selectedItem.value.id || selectedItem.value._id || selectedItem.value.code;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const resHist = await fetch(`${API_BASE}/items/${hid}/history`, { headers });
      if (resHist.ok) {
        const body = await resHist.json();
        const entries = Array.isArray(body) ? body.filter(e => (e.type || '').toLowerCase().includes('restock') || (e.type || '').toLowerCase().includes('add')).map(e => ({
          id: e._id || e.id,
          type: e.type || 'add',
          date: e.date || e.createdAt || null,
          expiryDate: e.expiryDate || e.expiryAlertDate || null,
          quantity: e.quantity || 0,
          performedBy: e.performedBy || null,
          note: e.note || ''
        })) : [];
        // format dates for display
        itemStockHistory.value = entries.map(e => ({
          ...e,
          date: e.date ? formatDate(e.date) : '—',
          expiryDate: e.expiryDate ? formatDate(e.expiryDate) : '—'
        }));

        // if server returned an empty list, remove any stale localStorage entry for this item
        if (Array.isArray(body) && body.length === 0) {
          try {
            const raw = localStorage.getItem('stockHistory');
            const all = raw ? JSON.parse(raw) : {};
            const hid = selectedItem.value.id || selectedItem.value._id || selectedItem.value.code;
            if (all && all[hid]) {
              delete all[hid];
              localStorage.setItem('stockHistory', JSON.stringify(all));
            }
          } catch (e) {
            console.warn('Failed to clear stale local stockHistory', e);
          }
        }
      } else {
        // fallback to localStorage
        const raw = localStorage.getItem('stockHistory');
        const all = raw ? JSON.parse(raw) : {};
        const entries = Array.isArray(all && all[hid]) ? all[hid].map(e => ({
          id: e._id || e.id,
          type: e.type || 'add',
          date: e.date || e.createdAt || null,
          expiryDate: e.expiryDate || e.expiryAlertDate || null,
          quantity: e.quantity || 0,
          performedBy: e.performedBy || null,
          note: e.note || ''
        })) : [];
        itemStockHistory.value = entries.map(e => ({
          ...e,
          date: e.date ? formatDate(e.date) : '—',
          expiryDate: e.expiryDate ? formatDate(e.expiryDate) : '—'
        }));
      }
    } catch (e) {
      try {
        const hid = selectedItem.value.id || selectedItem.value._id || selectedItem.value.code;
        const raw = localStorage.getItem('stockHistory');
        const all = raw ? JSON.parse(raw) : {};
        const entries = Array.isArray(all && all[hid]) ? all[hid] : [];
        itemStockHistory.value = entries.filter(e => (e.type || '').toLowerCase().includes('restock') || (e.type || '').toLowerCase().includes('add'));
      } catch (ex) {
        itemStockHistory.value = [];
      }
    }
    showDetailsModal.value = true;
  }
}

function showItemDetails(item) {
  loadItemDetails(item);
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
  // update selling price if price field used
  if (typeof adjustmentPrice.value !== 'undefined') {
    stockItems.value[index].sellingPrice = Number(adjustmentPrice.value);
  }
}

// Initialize data
onMounted(() => {
  fetchItems();
  // If navigated with ?id=<itemId>, open details for that item
  try {
    const qid = route && route.query && route.query.id;
    if (qid) {
      loadItemDetails({ id: qid });
    }
  } catch (e) {}
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