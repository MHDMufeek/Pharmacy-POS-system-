<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Item Details</h1>
      
    </div>

    <div v-if="loadingItems" class="text-sm text-gray-500 mb-4">Loading items...</div>
    <div v-else-if="itemsError" class="text-sm text-red-600 mb-4">{{ itemsError }}</div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      
    </div>

    <!-- Item list removed as requested -->

    <!-- Quick Actions removed -->

    <!-- Global Restocked Table -->
    <div class="bg-white rounded-lg shadow mt-6 p-4">
      <h2 class="text-lg font-semibold mb-4">Restocked History</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY Restocked</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(r, idx) in restockEntries" :key="idx" class="hover:bg-gray-50">
              <td class="px-6 py-3 text-sm text-gray-700">{{ r.date ? r.date : '—' }}</td>
              <td class="px-6 py-3 text-sm text-gray-700">{{ r.productName || r.productId }}</td>
              <td class="px-6 py-3 text-sm text-gray-700">{{ r.quantity ?? 0 }}</td>
              <td class="px-6 py-3 text-sm text-gray-700">Rs. {{ formatMoney(getStockValueForRestock(r)) }}</td>
              <td class="px-6 py-3 text-sm text-gray-700">{{ r.performedBy || '—' }}</td>
              <td class="px-6 py-3 text-sm text-gray-700">{{ r.expiryDate ? r.expiryDate : '—' }}</td>
            </tr>
            <tr v-if="restockEntries.length === 0">
              <td class="px-6 py-4 text-sm text-gray-500" colspan="6">No restock entries found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const stockItems = ref([])
const loadingItems = ref(false)
const itemsError = ref('')
const itemStockHistory = ref([])
const showDetailsModal = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function fetchItems() {
  loadingItems.value = true
  itemsError.value = ''
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}/items`, { headers })
    if (res.ok) {
      const body = await res.json()
      stockItems.value = Array.isArray(body) ? body.map(b => ({
        id: b._id || b.id,
        name: b.name || b.productName || b.title || '',
        code: b.sku || b.code || '',
        category: b.category || '',
        currentStock: b.stock ?? b.currentStock ?? 0,
        minLevel: (b.metadata && b.metadata.minLevel) ?? b.minLevel ?? 10,
        costPrice: b.cost ?? b.costPrice ?? 0,
        sellingPrice: b.price ?? b.sellingPrice ?? 0,
        expiryDate: b.expiryDate || b.expiry || ''
      })) : []
      // also persist a local copy for offline fallback
      try { localStorage.setItem('items', JSON.stringify(stockItems.value)) } catch (e) {}
    } else {
      // fallback to localStorage
      const raw = localStorage.getItem('items')
      stockItems.value = raw ? JSON.parse(raw) : []
      itemsError.value = `Failed to load items from server (${res.status})`
    }
  } catch (err) {
    console.error('Error fetching items', err)
    const raw = localStorage.getItem('items')
    stockItems.value = raw ? JSON.parse(raw) : []
    itemsError.value = 'Failed to load items (offline fallback)'
  } finally {
    loadingItems.value = false
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

function formatMoney(value, decimals = 2) {
  const n = Number(value)
  if (!isFinite(n)) return '0.00'
  return (Math.round((n + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
}

function getStockValueForRestock(r) {
  try {
    const pid = r.productId || r.productId;
    const p = stockItems.value.find(s => String(s.id) === String(pid) || String(s._id) === String(pid) || String(s.code) === String(pid));
    const stock = p ? (p.currentStock ?? p.stock ?? p.quantity ?? 0) : (r.newStock ?? 0);
    const cost = p ? (p.costPrice ?? p.cost ?? 0) : 0;
    return Number(stock) * Number(cost || 0)
  } catch (e) {
    return 0
  }
}

// Global restock entries loader: fetch from backend reports endpoint, fallback to localStorage
const restockEntries = ref([]);
async function loadGlobalRestocks() {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/reports/drug-movement`, { headers });
    if (res.ok) {
      const body = await res.json();
      const movements = Array.isArray(body.recentMovements) ? body.recentMovements : [];
      // Map backend recentMovements to restockEntries shape
      const arr = movements.map(m => ({
        date: m.date || m.createdAt || '',
        productId: m.id || m.itemId || '',
        productName: m.drugName || m.productName || '—',
        quantity: m.quantity ?? 0,
        newStock: m.newStock ?? null,
        performedBy: m.performedBy || '',
        expiryDate: m.expiryDate || ''
      }));
      arr.sort((a,b) => (b.date||'').localeCompare(a.date||''));
      restockEntries.value = arr;
      return;
    }
  } catch (err) {
    // ignore and fallback
  }

  // fallback to localStorage if API call failed
  try {
    const raw = localStorage.getItem('stockHistory');
    const all = raw ? JSON.parse(raw) : {};
    const arr = [];
    for (const id of Object.keys(all || {})) {
      const entries = Array.isArray(all[id]) ? all[id] : [];
      for (const e of entries) {
        const t = (e.type || '').toLowerCase();
        if (t.includes('restock') || t.includes('add')) {
          const product = stockItems.value.find(s => String(s.id) === String(id));
          arr.push({
            date: e.date || e.createdAt || '',
            productId: id,
            productName: product ? product.name : (e.productName || id),
            quantity: e.quantity || 0,
            newStock: e.newStock,
            performedBy: e.performedBy || e.performedByName || '',
            expiryDate: e.expiryDate || e.expiryAlertDate || ''
          });
        }
      }
    }
    arr.sort((a,b) => (b.date||'').localeCompare(a.date||''));
    restockEntries.value = arr;
  } catch (err) {
    restockEntries.value = [];
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // refresh global restock entries
    loadGlobalRestocks();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadGlobalRestocks();
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadGlobalRestocks();
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

// quick restock removed (Quick Actions UI disabled)

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

async function updateStock() {
  const index = stockItems.value.findIndex(i => String(i.id) === String(selectedItem.value.id) || String(i._id) === String(selectedItem.value.id));
  if (index === -1) return;

  let quantity = Number(adjustmentQuantity.value);
  if (isNaN(quantity) || quantity < 0) {
    alert("Please enter a valid quantity");
    return;
  }

  const oldStock = Number(stockItems.value[index].currentStock ?? stockItems.value[index].stock ?? 0);
  let newStock = oldStock;
  if (adjustmentType.value === "add") {
    newStock = oldStock + quantity;
  } else if (adjustmentType.value === "subtract") {
    newStock = Math.max(0, oldStock - quantity);
  } else if (adjustmentType.value === "set") {
    newStock = Math.max(0, quantity);
  }

  // Prepare update payload (only include price when user provided a non-empty numeric value)
  const payload = { stock: newStock };
  // Only include price if user explicitly entered a value different from current selling price
  const currentPrice = stockItems.value[index].sellingPrice ?? stockItems.value[index].price ?? selectedItem.value.sellingPrice ?? selectedItem.value.price ?? null;
  const priceRaw = (adjustmentPrice.value === null || adjustmentPrice.value === undefined) ? '' : String(adjustmentPrice.value).trim();
  const priceProvided = priceRaw !== '' && priceRaw !== null && priceRaw !== undefined && !isNaN(Number(priceRaw)) && Number(priceRaw) !== Number(currentPrice);
  if (priceProvided) {
    const parsed = Number(priceRaw);
    if (!isNaN(parsed)) payload.price = parsed;
  }

  // Try to update backend; fall back to local-only update
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    // PUT update item
    const id = selectedItem.value.id || selectedItem.value._id || selectedItem.value.code;
    const res = await fetch(`${API_BASE}/items/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
    if (res.ok) {
      const updated = await res.json();
      // refresh full items list from server to ensure canonical data
      try { await fetchItems(); } catch (e) { 
        // fallback to merging updated fields when fetch fails
        stockItems.value[index] = {
          ...stockItems.value[index],
          currentStock: updated.stock ?? newStock,
          stock: updated.stock ?? newStock,
          sellingPrice: (typeof updated.price !== 'undefined') ? updated.price : (stockItems.value[index].sellingPrice ?? stockItems.value[index].price)
        };
      }
      // ensure selectedItem reflects latest
      selectedItem.value = { ...selectedItem.value, ...(updated || {}) };
    } else {
      // fallback local update on non-OK response
      stockItems.value[index].currentStock = newStock;
      stockItems.value[index].stock = newStock;
      if (priceProvided) {
        const parsed = Number(adjustmentPrice.value);
        if (!isNaN(parsed)) stockItems.value[index].sellingPrice = parsed;
      }
    }

    // Create stock history entry on backend
    try {
      const userRaw = localStorage.getItem('user');
      let username = null;
      if (userRaw) {
        try { const u = JSON.parse(userRaw); username = u.name || u.email || null } catch(e) {}
      }
      const historyBody = {
        type: adjustmentType.value || 'add',
        quantity: quantity,
        date: new Date().toISOString().slice(0,10),
        expiryDate: selectedItem.value.expiryDate || null,
        expiryAlertDate: null,
        performedBy: username,
        note: ''
      };
      await fetch(`${API_BASE}/items/${id}/history`, { method: 'POST', headers, body: JSON.stringify(historyBody) });
    } catch (e) {
      // ignore history POST failures
      console.warn('Failed to post stock history', e);
    }

    // Refresh restock entries and selected item details
    try { await loadGlobalRestocks(); } catch(e) {}
    try { await loadItemDetails(stockItems.value[index]); } catch(e) {}

  } catch (err) {
    console.error('Failed to sync with server, performing local update', err);
    stockItems.value[index].currentStock = newStock;
    stockItems.value[index].stock = newStock;
    if (priceProvided) {
      const parsed = Number(adjustmentPrice.value);
      if (!isNaN(parsed)) stockItems.value[index].sellingPrice = parsed;
    }
  }

  showUpdateModal.value = false;
  adjustmentQuantity.value = 0;
}

// Initialize data
onMounted(async () => {
  await fetchItems();
  // populate global restock table after items are loaded so product names resolve
  try { loadGlobalRestocks(); } catch (e) {}
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
 
}
</style>