<template>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Inventory Summary</h1>
        <!-- Export/Print removed from Inventory Summary header -->
      </div>
  
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">As of Date</label>
            <input type="date" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600" v-model="filterDate">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600" v-model="filterCategory">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
            <select class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600" v-model="filterSupplier">
              <option value="">All Suppliers</option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-md w-full dark:bg-blue-500 dark:text-white" @click="applyFilters">Apply Filters</button>
          </div>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-4 rounded-lg shadow dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3 mr-4 dark:bg-blue-900/20">
              <span class="material-icons text-blue-600">inventory_2</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">Total Items</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData.totalItems }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
          <div class="flex items-center">
            <div class="rounded-full bg-green-100 p-3 mr-4 dark:bg-green-900/10">
              <span class="material-icons text-green-600">check_circle</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">In Stock</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData.inStock }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
          <div class="flex items-center">
            <div class="rounded-full bg-yellow-100 p-3 mr-4 dark:bg-yellow-900/10">
              <span class="material-icons text-yellow-600">warning</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">Low Stock</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData.lowStock }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
          <div class="flex items-center">
            <div class="rounded-full bg-red-100 p-3 mr-4 dark:bg-red-900/10">
              <span class="material-icons text-red-600">cancel</span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">Out of Stock</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData.outOfStock }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Inventory Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900 align-center">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
              <tr v-for="(item, index) in paginatedInventory" :key="item.id || item.code || index" class="cursor-pointer hover:bg-gray-50" @click="goToItem(item)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ item.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ item.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <a v-if="item.supplierId || item.supplierName" @click.stop.prevent="goToSupplierById(item.supplierId)" class="text-blue-600 hover:underline dark:text-blue-300 cursor-pointer">{{ item.supplierName || item.supplierId }}</a>
                  <span v-else class="text-gray-500">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ item.stock }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Rs.{{ item.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Rs.{{ (item.stock * item.price).toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['px-2 py-1 text-xs rounded-full', 
                    item.stock === 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/10 dark:text-red-300' : (item.stock <= (item.metadata?.minLevel || 10) ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300') ]">
                    {{ item.stock === 0 ? 'Out of Stock' : (item.stock <= (item.metadata?.minLevel || 10) ? 'Low Stock' : 'In Stock') }}
                  </span>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination (visible only when items exceed page size) -->
        <div v-if="totalItems > pageSize" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 dark:bg-slate-800 dark:border-t dark:border-slate-700 dark:text-gray-300">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ displayedFrom }}</span> to <span class="font-medium">{{ displayedTo }}</span> of
                <span class="font-medium">{{ totalItems }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click.prevent="changePage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700">
                  <span class="sr-only">Previous</span>
                  <span class="material-icons text-sm">chevron_left</span>
                </button>
                <button v-for="p in pageNumbers" :key="p" @click.prevent="changePage(p)" :class="['relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium', p === currentPage ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700']">{{ p }}</button>
                <button @click.prevent="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700">
                  <span class="sr-only">Next</span>
                  <span class="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
  
  // Real data loaded from backend
  const inventoryData = ref([]);
  const filterDate = ref('');
  const filterCategory = ref('');
  const filterSupplier = ref('');
  
  const categories = ref(['Pain Relief', 'Antibiotics', 'Vitamins', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Acid Reflux']);
  // Suppliers will be loaded from backend
  const suppliers = ref([]);
  const suppliersMap = ref({});

  async function loadSuppliers() {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // fetch many suppliers so user can filter by any
      const res = await fetch(`${API_BASE}/suppliers?limit=1000`, { headers });
      if (!res.ok) return;
      const body = await res.json();
      const data = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : (body.data || []));
      suppliers.value = data.map(s => ({ id: s._id || s.id, name: s.name }));
      const map = {};
      for (const s of suppliers.value) map[s.id] = s.name;
      suppliersMap.value = map;
    } catch (e) {
      console.error('Failed to load suppliers', e);
    }
  }

  // load suppliers on mounted
  onMounted(async () => {
    await loadSuppliers();
    await loadInventory();
  });

  
  async function loadInventory() {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params = [];
      if (filterCategory.value) params.push(`category=${encodeURIComponent(filterCategory.value)}`);
      if (filterSupplier.value) params.push(`supplier=${encodeURIComponent(filterSupplier.value)}`);
      const qs = params.length ? `?${params.join('&')}` : '?limit=1000';
      const url = `${API_BASE}/items${qs}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Failed to load items (${res.status})`);
      const body = await res.json();
      const items = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : (body.data || []));
      inventoryData.value = items.map(it => {
        const supplierRaw = it.supplier;
        let supplierId = null;
        let supplierName = '';
        if (supplierRaw && typeof supplierRaw === 'object') {
          supplierId = supplierRaw._id || supplierRaw.id || null;
          supplierName = supplierRaw.name || '';
        } else if (supplierRaw) {
          supplierId = String(supplierRaw);
          supplierName = suppliersMap.value[supplierId] || '';
        }

        return {
          id: it._id || it.id,
          code: it.sku || it.code || (it._id ? String(it._id).slice(-6) : ''),
          name: it.name || '',
          category: it.category || '',
          stock: it.stock ?? it.currentStock ?? 0,
          price: Number(it.price ?? it.sellingPrice ?? 0) || 0,
          metadata: it.metadata || {},
          supplierId,
          supplierName
        };
      });

      // If there are supplierIds we couldn't resolve to names yet, fetch them
      const unresolved = inventoryData.value.map(i => i.supplierId).filter(Boolean).filter(id => !suppliersMap.value[id]);
      if (unresolved.length) {
        // fetch each supplier and populate the map (attempt to reduce extra requests)
        await Promise.all(Array.from(new Set(unresolved)).map(async id => {
          try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const r = await fetch(`${API_BASE}/suppliers/${id}`, { headers });
            if (!r.ok) return;
            const data = await r.json();
            suppliersMap.value[data._id || data.id] = data.name;
            // update any rows
            inventoryData.value.forEach(row => {
              if (row.supplierId === data._id || row.supplierId === data.id) row.supplierName = data.name;
            });
          } catch (e) {
            // ignore
          }
        }));
      }
    } catch (e) {
      console.error('Failed to load inventory', e);
    }
  }
  
  const applyFilters = async () => {
    await loadInventory();
  };
  
  const summaryData = computed(() => {
    const totalItems = inventoryData.value.length;
    const inStock = inventoryData.value.filter(item => item.stock > (item.metadata?.minLevel ?? 0)).length;
    const lowStock = inventoryData.value.filter(item => item.stock > 0 && item.stock <= (item.metadata?.minLevel ?? 10)).length;
    const outOfStock = inventoryData.value.filter(item => item.stock === 0).length;
    return { totalItems, inStock, lowStock, outOfStock };
  });
  
  // Pagination state: show 5 rows per page, show controls only when totalItems > pageSize
  const totalItems = computed(() => inventoryData.value.length);
  const pageSize = ref(5);
  const currentPage = ref(1);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)));
  const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
  const paginatedInventory = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return inventoryData.value.slice(start, start + pageSize.value);
  });
  const displayedFrom = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1);
  const displayedTo = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));

  watch([filterDate, filterCategory, filterSupplier], () => { currentPage.value = 1; });
  watch(totalItems, () => { if (currentPage.value > totalPages.value) currentPage.value = totalPages.value; });

  function changePage(n) {
    if (n < 1 || n > totalPages.value) return;
    currentPage.value = n;
  }

  const router = useRouter();
  function goToItem(item) {
    router.push({ name: 'ItemDetails', query: { id: item.id } });
  }
  function goToStockUpdate(item, e) {
    if (e) e.stopPropagation();
    router.push({ name: 'StockUpdate', query: { id: item.id } });
  }

  function goToSupplierById(id) {
    if (!id) return;
    router.push({ name: 'SupplierDetails', query: { id } });
  }
  
  onMounted(loadInventory);

  function escapeCSVField(val) {
    if (val == null) return '';
    const s = String(val);
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function exportReport() {
    if (!inventoryData.value || inventoryData.value.length === 0) {
      alert('No items to export.');
      return;
    }

    const headers = ['Item Code','Item Name','Category','Current Stock','Unit Price','Total Value','Status'];
    const rows = [headers];

    for (const it of inventoryData.value) {
      const price = Number(it.price) || 0;
      const stock = Number(it.stock) || 0;
      const status = stock === 0 ? 'Out of Stock' : (stock <= (it.metadata?.minLevel || 10) ? 'Low Stock' : 'In Stock');
      rows.push([
        it.code || '',
        it.name || '',
        it.category || '',
        String(stock),
        price.toFixed(2),
        (price * stock).toFixed(2),
        status
      ]);
    }

    const csv = rows.map(r => r.map(c => escapeCSVField(c)).join(',')).join('\n');
    const filename = `inventory-report-${new Date().toISOString().slice(0,10)}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    window.print();
  }
  </script>