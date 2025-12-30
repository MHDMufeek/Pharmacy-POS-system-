<template>
  <div class="min-h-screen bg-gray-100 p-6 dark:bg-slate-900 dark:text-white">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Supplier Returns</h1>
        </div>

        <div class="flex gap-2">
          <input v-model="search" placeholder="Search supplier or product" class="border px-3 py-2 rounded-lg bg-white dark:bg-slate-700 dark:text-white" />
          <button @click="refresh" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Refresh</button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow overflow-hidden text-black dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 text-gray-600 text-sm dark:bg-slate-900 dark:text-gray-300">
            <tr>
              <th class="px-5 py-3 text-left">ID</th>
              <th class="px-5 py-3 text-left">Supplier</th>
              <th class="px-5 py-3 text-left">Product</th>
              <th class="px-5 py-3 text-left">Qty</th>
              <th class="px-5 py-3 text-left">Reason</th>
              <th class="px-5 py-3 text-left">Amount</th>
              <th class="px-5 py-3 text-left">Status</th>
              <th class="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y bg-white dark:bg-transparent" v-if="displayedGroups.length > 0">
            <tr v-for="g in displayedGroups" :key="g.id" class="hover:bg-gray-50 dark:hover:bg-slate-700">
              <td class="px-5 py-3 text-blue-600 font-medium dark:text-blue-300">#{{ g.id.slice(-6) }}</td>
              <td class="px-5 py-3 dark:text-gray-200">{{ g.supplier }}</td>
              <td class="px-5 py-3 dark:text-gray-200">{{ g.product }}</td>
              <td class="px-5 py-3 dark:text-gray-200">{{ g.qty }}</td>
              <td class="px-5 py-3 dark:text-gray-200">{{ g.reason }}</td>
              <td class="px-5 py-3 dark:text-gray-200">{{ g.amount.toFixed(2) }}</td>
              <td class="px-5 py-3">
                <span class="px-3 py-1 rounded-full text-xs" :class="statusClass(g.status)">{{ g.status }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center space-x-2">
                  <button v-if="g.status !== 'Returned'" @click="markGroupReturned(g)" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Return</button>
                  <button @click="confirmDelete(g)" class="text-red-600 hover:text-red-800 p-1 rounded">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else class="divide-y">
            <tr>
              <td colspan="8" class="px-5 py-8 text-center text-gray-500 dark:text-gray-300">No returns yet</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Return / Batch modal -->
      <div v-if="showReturnModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-lg rounded-xl shadow-xl dark:bg-slate-800 dark:text-white">
          <div class="px-6 py-4 border-b flex justify-between items-center dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ editingReturn.returnId ? 'Edit Return' : (editingReturn.isBatch ? 'Batch Return' : 'New Return') }}</h3>
            <button @click="closeReturnModal">Close</button>
          </div>

          <form @submit.prevent="submitReturnForm" class="p-6 space-y-4">
            <div>
              <label class="form-label dark:text-gray-300">Supplier</label>
              <input class="form-input bg-white dark:bg-slate-700 dark:text-white" :value="editingReturn.supplier" readonly />
            </div>

            <div>
              <label class="form-label dark:text-gray-300">Product</label>
              <input class="form-input bg-white dark:bg-slate-700 dark:text-white" :value="editingReturn.product" readonly />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label dark:text-gray-300">Quantity</label>
                <input type="number" min="1" v-model.number="editingReturn.qty" class="form-input bg-white dark:bg-slate-700 dark:text-white" required />
              </div>

              
            </div>

            <div>
              <label class="form-label dark:text-gray-300">Reason</label>
              <select v-model="editingReturn.reason" class="form-input bg-white dark:bg-slate-700 dark:text-white" required>
                <option value="">Select reason</option>
                <option>Expired</option>
                <option>Damaged</option>
                <option>Wrong Item</option>
                <option>Other</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
              <button type="button" @click="closeReturnModal" class="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-blue-600 text-white rounded">{{ editingReturn.isBatch ? 'Return Batch' : 'Return' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-md rounded-xl shadow-xl dark:bg-slate-800 dark:text-white">
          <div class="px-6 py-4 border-b flex justify-between items-center dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Confirm Delete</h3>
            <button @click="showDeleteModal = false">Close</button>
          </div>
          <div class="p-6">
            <p class="text-center mb-4">Are you sure you want to delete this return?</p>
            <div class="flex justify-end gap-3">
              <button @click="showDeleteModal = false" class="px-4 py-2 border rounded">Cancel</button>
              <button @click="deleteReturn" class="px-5 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const search = ref('')
const returns = ref([])
const showDeleteModal = ref(false)
const toDeleteId = ref(null)
const showReturnModal = ref(false)
const editingReturn = ref({ id: null, supplier: '', product: '', qty: 1, reason: '', isBatch: false, returnId: null })

function refresh() {
  // Try to fetch real customer returns from backend; fallback to sample data
  (async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/api/customer-returns', { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
      if (res.ok) {
        const data = await res.json()
        const returnsList = data.data || []

        // collect unique item ids from returns
        const itemIds = new Set()
        returnsList.forEach(r => { (r.items || []).forEach(it => { if (it && (it.item || it.itemId)) itemIds.add((it.item||it.itemId).toString()) }) })

        // fetch item docs
        const itemsMap = {}
        await Promise.all(Array.from(itemIds).map(async id => {
          try {
            const ir = await fetch(`http://localhost:3000/api/items/${id}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
            if (ir.ok) {
              const doc = await ir.json()
              // if supplier was populated in the item doc, capture its name
              if (doc && doc.supplier && typeof doc.supplier === 'object' && doc.supplier.name) doc.supplierName = doc.supplier.name
              itemsMap[id] = doc
            }
          } catch (e) {}
        }))

        // collect supplier ids from items
        const supplierIds = new Set()
        Object.values(itemsMap).forEach(it => { if (it && it.supplier) supplierIds.add(it.supplier.toString()) })

        // fetch suppliers individually and map id -> name
        const suppliersMap = {}
        await Promise.all(Array.from(supplierIds).map(async id => {
          try {
            const sr = await fetch(`http://localhost:3000/api/suppliers/${id}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
            if (sr.ok) {
              const sdoc = await sr.json()
              suppliersMap[id] = sdoc.name || sdoc.contactName || 'Unknown'
            }
          } catch (e) {}
        }))

        const rows = []
        returnsList.forEach(r => {
          ;(r.items || []).forEach(it => {
            // skip wrong medicine returns for supplier view
            if ((it.reason || '').toString().toLowerCase() === 'wrong medicine') return
            const itemId = (it.item || it.itemId || '').toString()
            const itemDoc = itemsMap[itemId] || {}
            const supplierName = it.supplierName || suppliersMap[itemDoc.supplier] || itemDoc.supplierName || itemDoc.supplierName || itemsMap[itemId]?.supplierName || 'Unknown'
            rows.push({ id: r._id || r.id, supplier: supplierName, product: it.name || itemDoc.name || 'Unknown', qty: it.qty || 0, reason: it.reason || 'Unspecified', amount: (it.price||itemDoc.price||0) * (it.qty||0), status: r.status || 'Pending' })
          })
        })
        if (rows.length) {
          returns.value = rows
          return
        }
      }
    } catch (e) {
      // ignore and use sample
    }

    returns.value = [
      { id: 'R1001', supplier: 'Acme Pharma', product: 'Paracetamol 500mg', qty: 10, reason: 'Damaged', amount: 500, status: 'Pending' },
      { id: 'R1002', supplier: 'MediSupplies', product: 'Amoxicillin 250mg', qty: 5, reason: 'Expired', amount: 750, status: 'Completed' },
      { id: 'R1003', supplier: 'Acme Pharma', product: 'Paracetamol 500mg', qty: 2, reason: 'Damaged', amount: 100, status: 'Pending' }
    ]
  })()
}

onMounted(() => {
  refresh()
  window.addEventListener('customer-returns-changed', refresh)
})

onUnmounted(() => {
  window.removeEventListener('customer-returns-changed', refresh)
})

// Group returns by supplier|product|reason and sum qty/amount
const groupedReturns = computed(() => {
  const map = {}
  returns.value.forEach(r => {
    const key = `${r.supplier}||${r.product}||${r.reason}`
    if (!map[key]) map[key] = { id: key, supplier: r.supplier, product: r.product, reason: r.reason, qty: 0, amount: 0, entries: [] }
    map[key].qty += (r.qty || 0)
    map[key].amount += (r.amount || 0)
    map[key].entries.push(r)
  })
  // compute status for each group
  return Object.values(map).map(g => {
    const statuses = new Set(g.entries.map(e => e.status))
    if (statuses.size === 1 && statuses.has('Returned')) g.status = 'Returned'
    else if (statuses.has('Completed')) g.status = 'Completed'
    else if (statuses.has('Processing')) g.status = 'Processing'
    else g.status = 'Pending'
    return g
  })
})

const displayedGroups = computed(() => {
  if (!search.value) return groupedReturns.value
  const q = search.value.toLowerCase()
  return groupedReturns.value.filter(g => (g.supplier||'').toLowerCase().includes(q) || (g.product||'').toLowerCase().includes(q) || (g.id||'').toLowerCase().includes(q))
})

function statusClass(s) {
  if (s === 'Completed') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-300'
  if (s === 'Returned') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  return 'bg-gray-100 text-gray-800 dark:bg-slate-700/20 dark:text-gray-300'
}

function confirmDelete(group) {
  // store the group key (supplier/product/reason) for deletion
  toDeleteId.value = { supplier: group.supplier, product: group.product, reason: group.reason }
  showDeleteModal.value = true
}

async function deleteReturn() {
  const td = toDeleteId.value
  const token = localStorage.getItem('token')
  if (td) {
    const matches = returns.value.filter(r => r.supplier === td.supplier && r.product === td.product && r.reason === td.reason)
    // collect valid DB ids (24 hex chars)
    const ids = matches.map(m => m.id).filter(id => /^[0-9a-fA-F]{24}$/.test(id))
    try {
      await Promise.all(ids.map(id => fetch(`http://localhost:3000/api/customer-returns/${id}`, { method: 'DELETE', headers: token ? { 'Authorization': `Bearer ${token}` } : {} })))
    } catch (e) {
      console.error('Failed deleting some returns', e)
    }
    // remove from local list
    returns.value = returns.value.filter(r => !(r.supplier === td.supplier && r.product === td.product && r.reason === td.reason))
  }
  showDeleteModal.value = false
  toDeleteId.value = null
}

function openReturnForm(row, isBatch = false) {
  editingReturn.value = {
    id: row.id,
    supplier: row.supplier,
    product: row.product,
    qty: row.qty || 1,
    reason: row.reason || '',
    isBatch: !!isBatch,
    returnId: null
  }
  showReturnModal.value = true
}

function markGroupReturned(group) {
  // optimistic UI update
  returns.value.forEach(r => {
    if (r.supplier === group.supplier && r.product === group.product && r.reason === group.reason) {
      r.status = 'Returned'
    }
  })

  // persist to backend for entries that have DB ids
  ;(async () => {
    const token = localStorage.getItem('token')
    const entries = group.entries || []
    const ids = entries.map(e => e.id).filter(id => /^[0-9a-fA-F]{24}$/.test(id))
    if (!ids.length) return
    try {
      await Promise.all(ids.map(id => fetch(`http://localhost:3000/api/customer-returns/${id}`, { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { 'Authorization': `Bearer ${token}` } : {}), body: JSON.stringify({ status: 'Returned' }) })))
      // refresh from server to ensure canonical state
      refresh()
    } catch (e) {
      console.error('Failed to mark returns as Returned', e)
    }
  })()
}

function closeReturnModal() {
  showReturnModal.value = false
  editingReturn.value = { id: null, supplier: '', product: '', qty: 1, reason: '', isBatch: false, returnId: null }
}

function submitReturnForm() {
  const payload = { ...editingReturn.value }
  // UI-only: push/update a return entry in the list and close modal
  const idx = returns.value.findIndex(r => r.id === payload.id)
  const entry = {
    id: payload.id || `R${Math.floor(Math.random()*9000)+1000}`,
    supplier: payload.supplier,
    product: payload.product,
    qty: payload.qty,
    reason: payload.reason,
    amount: ((payload.qty||0) * (returns.value[idx]?.amount || 50)),
    status: 'Processing',
    isBatch: !!payload.isBatch
  }
  if (idx >= 0) {
    returns.value[idx] = { ...returns.value[idx], ...entry }
  } else {
    returns.value.unshift(entry)
  }
  closeReturnModal()
}
</script>

<style scoped>
</style>
