<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-blue-900">Customer Return / Refund</h1>
        <p class="text-gray-600 mt-1">Manage medicine returns and customer refunds</p>
      </div>

      <!-- Action Bar -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex gap-3">
          <button
            @click="showNewReturnForm = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow">
            <span class="material-icons mr-2">assignment_return</span>
            New Return
          </button>

          <button
            @click="showNewCustomerForm = true"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow">
            <span class="material-icons mr-2">person_add</span>
            New Customer
          </button>
        </div>

        <input
          v-model="searchQuery"
          placeholder="Search by customer name..."
          class="border px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Returns Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden text-black">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th class="px-5 py-3 text-left">ID</th>
              <th class="px-5 py-3 text-left">Customer</th>
              <th class="px-5 py-3 text-left">Medicine</th>
              <th class="px-5 py-3 text-left">Qty</th>
              <th class="px-5 py-3 text-left">Reason</th>
              <th class="px-5 py-3 text-left">Amount</th>
              <th class="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody class="divide-y" v-if="returns.length > 0">
            <tr v-for="r in filteredReturns" :key="r._id" class="hover:bg-gray-50">
              <td class="px-5 py-3 text-blue-600 font-medium">#{{ r._id?.slice(-6) || r.id }}</td>
              <td class="px-5 py-3">{{ r.customer }}</td>
              <td class="px-5 py-3">{{ r.items?.[0]?.name || 'N/A' }}</td>
              <td class="px-5 py-3">{{ r.items?.[0]?.qty || 0 }}</td>
              <td class="px-5 py-3">{{ r.items?.[0]?.reason || 'N/A' }}</td>
              <td class="px-5 py-3">{{ ((r.totalRefund != null ? r.totalRefund : (r.items?.reduce((s,it) => s + ((it.price||0)*(it.qty||0)),0) || 0))).toFixed(2) }}</td>
              <td class="px-5 py-3">
                <span :class="{
                  'bg-green-100 text-green-800': r.status === 'Completed',
                  'bg-yellow-100 text-yellow-800': r.status === 'Pending',
                  'bg-blue-100 text-blue-800': r.status === 'Processing',
                  'bg-red-100 text-red-800': r.status === 'Rejected'
                }" class="px-3 py-1 rounded-full text-xs">
                  {{ r.status }}
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y">
            <tr>
              <td colspan="6" class="px-5 py-8 text-center text-gray-500">No returns yet</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ================= RETURN FORM ================= -->
      <div
        v-if="showNewReturnForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-xl rounded-xl shadow-xl">
          <div class="px-6 py-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">New Return</h3>
            <button @click="showNewReturnForm=false">
              <span class="material-icons text-gray-500">close</span>
            </button>
          </div>

          <form @submit.prevent="submitReturn" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Customer</label>
                <select v-model="returnForm.customer" class="form-input" required>
                  <option value="">Select customer</option>
                  <option v-for="c in customers" :key="c.id" :value="c.name">{{ c.name }}</option>
                  <option value="Other">Other (specify)</option>
                </select>

                <div v-if="isOtherCustomer" class="mt-2">
                  <input type="text" v-model="returnForm.customerOther" placeholder="Enter customer name" class="form-input" />
                </div>
              </div>

              <div>
                <label class="form-label">Medicine</label>
                <select v-model="returnForm.medicine" class="form-input" :disabled="isLoadingMedicines" required>
                  <option value="">{{ isLoadingMedicines ? 'Loading medicines...' : 'Select medicine' }}</option>
                  <option v-for="m in medicines" :key="m._id || m.id" :value="m.name">{{ m.name }} (Stock: {{ m.stock || '-' }})</option>
                </select>
                <div v-if="medicines.length === 0" class="text-red-500 text-xs mt-1">No medicines found</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Quantity</label>
                <input type="number" min="1" v-model="returnForm.qty" class="form-input" required />
              </div>

              <div>
                <label class="form-label">Return Reason</label>
                <select v-model="returnForm.reason" class="form-input" required>
                  <option value="">Select reason</option>
                  <option>Expired</option>
                  <option>Damaged</option>
                  <option>Wrong Medicine</option>
                  <option>Customer Request</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="button" @click="showNewReturnForm=false" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button :disabled="isSubmitting" class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {{ isSubmitting ? 'Saving...' : 'Save Return' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ================= CUSTOMER FORM ================= -->
      <div
        v-if="showNewCustomerForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-lg rounded-xl shadow-xl">
          <div class="px-6 py-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">Add Customer</h3>
            <button @click="showNewCustomerForm=false">
              <span class="material-icons text-gray-500">close</span>
            </button>
          </div>

          <form @submit.prevent="addCustomer" class="p-6 space-y-4">
            <div>
              <label class="form-label">Customer Name</label>
              <input v-model="newCustomer.name" class="form-input" required />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Phone</label>
                <input v-model="newCustomer.phone" class="form-input" />
              </div>
              <div>
                <label class="form-label">Email</label>
                <input v-model="newCustomer.email" class="form-input" />
              </div>
            </div>

            <div>
              <label class="form-label">Address</label>
              <textarea v-model="newCustomer.address" rows="2" class="form-input"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">NIC / ID</label>
                <input v-model="newCustomer.nic" class="form-input" />
              </div>
              <div>
                <label class="form-label">Customer Type</label>
                <select v-model="newCustomer.type" class="form-input">
                  <option value="">Select type</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>Corporate</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">Notes</label>
              <textarea v-model="newCustomer.notes" rows="2" class="form-input"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="button" @click="showNewCustomerForm=false" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ isSubmitting ? 'Processing...' : 'Process Return' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const showNewReturnForm = ref(false)
const showNewCustomerForm = ref(false)
const searchQuery = ref('')
const isSubmitting = ref(false)
const isLoadingMedicines = ref(false)

const customers = ref([
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Maria Garcia' },
  { id: 3, name: 'Robert Johnson' },
  { id: 4, name: 'Sarah Williams' }
])

const medicines = ref([
  { id: 1, name: 'Paracetamol 500mg', stock: 50 },
  { id: 2, name: 'Amoxicillin 250mg', stock: 20 },
  { id: 3, name: 'Ibuprofen 200mg', stock: 30 }
])

const returns = ref([])

const returnForm = ref({ customer: '', customerOther: '', medicine: '', qty: 1, reason: '', saleRef: '' })
const newCustomer = ref({ name: '', phone: '', email: '', address: '', nic: '', type: '', notes: '' })

const filteredReturns = computed(() => {
  if (!searchQuery.value) return returns.value
  return returns.value.filter(r => r.customer.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const isOtherCustomer = computed(() => returnForm.value.customer === 'Other')

async function fetchReturns() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/api/customer-returns', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    if (res.status === 401) {
      alert('Session expired. Please log in again.')
      localStorage.removeItem('token')
      window.location.href = '/login'
      return
    }
    if (res.ok) {
      const data = await res.json()
      returns.value = data.data || []
      console.log('✓ Loaded', returns.value.length, 'returns')
    } else {
      console.error('Failed to fetch returns:', res.status)
    }
  } catch (err) {
    console.error('Error fetching returns:', err.message)
  }
}

async function fetchItems() {
  isLoadingMedicines.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/api/items', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    if (res.status === 401) {
      console.warn('Token invalid, clearing and using default medicines')
      localStorage.removeItem('token')
      return
    }
    if (res.ok) {
      const data = await res.json()
      medicines.value = data.data || medicines.value
      console.log('✓ Loaded', medicines.value.length, 'medicines')
    } else {
      console.error('Failed to load medicines, using defaults')
    }
  } catch (err) {
    console.error('Error fetching medicines:', err.message)
  } finally {
    isLoadingMedicines.value = false
  }
}

async function submitReturn() {
  if ((!returnForm.value.customer || returnForm.value.customer === '') && !returnForm.value.customerOther) {
    alert('Please fill required fields')
    return
  }
  
  isSubmitting.value = true
  try {
    const token = localStorage.getItem('token')
    const selectedMedicine = medicines.value.find(m => m.name === returnForm.value.medicine)
    
    const customerName = returnForm.value.customer === 'Other' ? (returnForm.value.customerOther || 'Other') : returnForm.value.customer

    const payload = {
      customer: customerName,
      items: [{
        itemId: selectedMedicine?._id || selectedMedicine?.id,
        qty: parseInt(returnForm.value.qty, 10),
        reason: returnForm.value.reason
      }],
      refundMethod: 'cash',
      notes: ''
    }
    
    if (returnForm.value.saleRef) {
      payload.saleRef = returnForm.value.saleRef
    }
    
    const res = await fetch('http://localhost:3000/api/customer-returns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      alert('Return processed successfully!')
      returnForm.value = { customer: '', medicine: '', qty: 1, reason: '', saleRef: '' }
      showNewReturnForm.value = false
      await fetchReturns()
    } else {
      const err = await res.text()
      alert('Error: ' + err)
    }
  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

function addCustomer() {
  if (!newCustomer.value.name) return
  customers.value.push({ id: Date.now(), name: newCustomer.value.name })
  newCustomer.value = { name: '', phone: '', email: '', address: '', nic: '', type: '', notes: '' }
  showNewCustomerForm.value = false
}

onMounted(() => {
  fetchReturns()
  fetchItems()
})
</script>

<style>
.form-label { font-size: 0.875rem; font-weight: 500; color: #4b5563; margin-bottom: 4px; display: block; }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.form-input:focus { outline: none; border-color: #2563eb; }
</style>
