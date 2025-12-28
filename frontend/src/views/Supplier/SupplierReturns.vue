<template>
  <div class="container mx-auto p-6 dark:bg-slate-900 dark:text-white">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Supplier Returns</h1>
        <p class="text-gray-600 mt-1 dark:text-gray-300">Returns grouped by supplier and return reason</p>
      </div>
      <div class="flex gap-2">
        <input v-model="search" placeholder="Search supplier or product" class="px-3 py-2 rounded-lg border bg-white dark:bg-slate-700" />
        <button @click="fetchReturns" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">Loading returns…</div>

    <div v-else>
      <div v-if="tableRows.length === 0" class="text-center py-12 text-gray-500">No returns found</div>

      <div v-else class="bg-white rounded-lg shadow overflow-auto dark:bg-slate-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return ID</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
            <tr v-for="row in tableRows" :key="row.key" class="hover:bg-gray-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ supplierName(row.supplierId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ row.reason || 'Unspecified' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ row.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-200">{{ row.qty }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-200">Rs.{{ (row.price||0).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ row.returnId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
const token = localStorage.getItem('token')

const loading = ref(false)
const returns = ref([])
const itemsCache = ref({})
const suppliersMap = ref({})
const search = ref('')

async function fetchReturns() {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}/customerReturns`, { headers: { Authorization: `Bearer ${token}` } })
    returns.value = res.data && res.data.data ? res.data.data : []

    // collect unique item ids to fetch details
    const itemIds = new Set()
    returns.value.forEach(r => {
      (r.items || []).forEach(it => itemIds.add(it.item))
    })

    // fetch each item (to get supplier reference). cache results to avoid duplicate calls
    await Promise.all(Array.from(itemIds).map(async id => {
      if (!id) return
      if (itemsCache.value[id]) return
      try {
        const ir = await axios.get(`${API_BASE}/items/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        itemsCache.value[id] = ir.data || ir.data.data || ir.data.item || ir.data
      } catch (e) {
        itemsCache.value[id] = null
      }
    }))

    // fetch suppliers list once
    try {
      const sr = await axios.get(`${API_BASE}/suppliers`, { headers: { Authorization: `Bearer ${token}` } })
      if (sr.data && Array.isArray(sr.data.data)) {
        sr.data.data.forEach(s => { suppliersMap.value[s._id || s.id] = s })
      }
    } catch (e) {
      // ignore
    }
  } catch (err) {
    console.error('Failed to load returns', err)
    returns.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchReturns)

function supplierName(id) {
  const s = suppliersMap.value[id]
  return s ? s.name : (itemsCache.value[id] && itemsCache.value[id].supplierName) || 'Unknown Supplier'
}

// Build grouped structure: { supplierId: { reason: [items...] } }
const grouped = computed(() => {
  const map = {}
  returns.value.forEach(r => {
    (r.items || []).forEach(it => {
      const itemId = it.item
      const itemDoc = itemsCache.value[itemId] || {}
      const supplierId = itemDoc.supplier || itemDoc.supplierId || 'unknown'
      const reason = it.reason || 'Unspecified'

      if (!map[supplierId]) map[supplierId] = {}
      if (!map[supplierId][reason]) map[supplierId][reason] = []
      map[supplierId][reason].push({ ...it, returnId: r._id || r.id })
    })
  })
  return map
})

const groupedFiltered = computed(() => {
  if (!search.value) return grouped.value
  const out = {}
  Object.keys(grouped.value).forEach(sid => {
    const groups = grouped.value[sid]
    const matched = {}
    Object.keys(groups).forEach(reason => {
      const items = groups[reason].filter(it => (it.name || '').toLowerCase().includes(search.value.toLowerCase()) || (supplierName(sid)||'').toLowerCase().includes(search.value.toLowerCase()))
      if (items.length) matched[reason] = items
    })
    if (Object.keys(matched).length) out[sid] = matched
  })
  return out
})

function totalQtyForSupplier(sid) {
  const groups = grouped.value[sid] || {}
  return Object.values(groups).flat().reduce((s, it) => s + (it.qty || 0), 0)
}

// Flatten grouped data into table rows for display
const tableRows = computed(() => {
  const rows = []
  Object.keys(groupedFiltered.value).forEach(sid => {
    const groups = groupedFiltered.value[sid]
    Object.keys(groups).forEach(reason => {
      groups[reason].forEach(it => {
        rows.push({
          key: `${sid}-${reason}-${it.item}-${it.qty}-${it.returnId}`,
          supplierId: sid,
          reason,
          name: it.name,
          qty: it.qty,
          price: it.price,
          returnId: it.returnId
        })
      })
    })
  })
  return rows
})

// <script setup> used — no default export needed
</script>

<style scoped>
</style>
