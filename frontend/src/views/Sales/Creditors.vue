<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Creditors Management</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
      >
        <span class="material-icons mr-2">add</span>
        Add Creditor
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div
          class="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2"
        >
          <span class="material-icons text-gray-400 mr-2">search</span>
          <input
            type="text"
            placeholder="Search creditors..."
            class="bg-transparent outline-none w-full text-sm"
            v-model="searchQuery"
          />
        </div>
        <div class="w-full md:w-48">
          <select
            class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Overdue</option>
            <option>Paid</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Creditors Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creditor
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Owed
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(creditor, index) in filteredCreditors"
            :key="index"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                >
                  <span class="material-icons text-blue-600"></span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">
                    {{ creditor.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ creditor.contact }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-gray-900">
                ${{ creditor.amount.toLocaleString() }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-gray-900">
                {{ formatDate(creditor.dueDate) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-green-100 text-green-800': creditor.status === 'Paid',
                  'bg-yellow-100 text-yellow-800': creditor.status === 'Active',
                  'bg-red-100 text-red-800': creditor.status === 'Overdue'
                }"
              >
                {{ creditor.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <!-- 👁️ View Details -->
              <button
                class="text-blue-600 hover:text-blue-900 mr-3"
                @click="openCreditorDetails(creditor)"
                title="View Creditor Details"
              >
                <span class="material-icons">visibility</span>
              </button>
              
              <!-- 💰 Make Payment -->
              <button 
                class="text-green-600 hover:text-green-900 mr-3"
                title="Make Payment"
              >
                <span class="material-icons">payment</span>
              </button>
              
              <!-- ⋮ More Options -->
              <button 
                class="text-gray-600 hover:text-gray-900"
                title="More Options"
              >
                <span class="material-icons">more_vert</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow"
    >
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">1</span> to
        <span class="font-medium">5</span> of
        <span class="font-medium">20</span> results
      </div>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Previous
        </button>
        <button
          class="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          1
        </button>
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          2
        </button>
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          3
        </button>
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>

    <!-- 🔹 Creditor Details Modal -->
    <div
      v-if="showCreditorDetails"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-800">
            Creditor Details - {{ selectedCreditor?.name }}
          </h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="showCreditorDetails = false"
          >
            <span class="material-icons text-2xl">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-black-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Creditor Name:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Contact Person:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.contact }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Amount Owed:</span>
                  <span class="font-medium text-red-600 text-black">${{ selectedCreditor?.amount?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Due Date:</span>
                  <span class="font-medium text-black">{{ formatDate(selectedCreditor?.dueDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span
                    :class="{
                      'px-2 py-1 text-xs rounded-full font-medium': true,
                      'bg-green-100 text-green-800': selectedCreditor?.status === 'Paid',
                      'bg-yellow-100 text-yellow-800': selectedCreditor?.status === 'Active',
                      'bg-red-100 text-red-800': selectedCreditor?.status === 'Overdue'
                    }"
                  >
                    {{ selectedCreditor?.status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Account Number:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.accountNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Details -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
            <div class="space-y-3">
              <div>
                <span class="text-gray-600 block mb-1">Notes:</span>
                <p class="text-gray-800 bg-white p-3 rounded border min-h-[60px] text-black">
                  {{ selectedCreditor?.notes || 'No additional notes available.' }}
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Credit Limit:</span>
                  <span class="font-medium">${{ (selectedCreditor?.creditLimit || 0).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Terms:</span>
                  <span class="font-medium">{{ selectedCreditor?.terms || 'Net 30' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History -->
          <div class="bg-white border rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 p-4 border-b">Payment History</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(history, index) in selectedCreditor?.history || []"
                    :key="index"
                  >
                    <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(history.date) }}</td>
                    <td class="px-4 py-3 text-sm font-medium">${{ history.amount.toLocaleString() }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span
                        :class="{
                          'px-2 py-1 text-xs rounded-full': true,
                          'bg-green-100 text-green-800': history.status === 'Paid',
                          'bg-yellow-100 text-yellow-800': history.status === 'Pending',
                          'bg-red-100 text-red-800': history.status === 'Overdue'
                        }"
                      >
                        {{ history.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ history.reference || 'N/A' }}</td>
                  </tr>
                  <tr v-if="!selectedCreditor?.history?.length">
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                      No payment history available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            @click="showCreditorDetails = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <span class="material-icons mr-2">payment</span>
            Make Payment
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 History Modal -->
    <div
      v-if="showHistory"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          @click="showHistory = false"
        >
          <span class="material-icons">close</span>
        </button>

        <h2 class="text-xl font-bold mb-4">
          {{ selectedCreditor?.name }} - History
        </h2>

        <table class="w-full border rounded">
          <thead class="bg-black">
            <tr>
              <th class="px-4 py-2 text-left text-white">Date</th>
              <th class="px-4 py-2 text-left text-white">Amount</th>
              <th class="px-4 py-2 text-left text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, i) in selectedCreditor?.history"
              :key="i"
              class="border-t"
            >
              <td class="px-4 py-2">{{ formatDate(h.date) }}</td>
              <td class="px-4 py-2">${{ h.amount.toLocaleString() }}</td>
              <td class="px-4 py-2">{{ h.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const showHistory = ref(false);
const showCreditorDetails = ref(false);
const selectedCreditor = ref(null);

// Enhanced sample data with more details
const creditors = ref([
  {
    id: 1,
    name: "MedSupply Co.",
    contact: "John Smith",
    email: "john@medsupply.com",
    phone: "+1 (555) 123-4567",
    amount: 2500,
    dueDate: "2023-06-15",
    status: "Active",
    accountNumber: "ACC-001",
    creditLimit: 10000,
    terms: "Net 30",
    notes: "Primary medical supplies vendor. Regular deliveries every Tuesday.",
    history: [
      { date: "2023-04-10", amount: 1000, status: "Paid", reference: "INV-001" },
      { date: "2023-05-10", amount: 1500, status: "Pending", reference: "INV-002" }
    ]
  },
  {
    id: 2,
    name: "Pharma Distributors",
    contact: "Sarah Johnson",
    email: "sarah@pharmadist.com",
    phone: "+1 (555) 987-6543",
    amount: 4200,
    dueDate: "2023-05-20",
    status: "Overdue",
    accountNumber: "ACC-002",
    creditLimit: 15000,
    terms: "Net 45",
    notes: "Specialized pharmaceutical products. Bulk orders only.",
    history: [
      { date: "2023-03-01", amount: 2000, status: "Paid", reference: "INV-045" },
      { date: "2023-04-01", amount: 2200, status: "Overdue", reference: "INV-067" }
    ]
  },
  {
    id: 3,
    name: "Lab Equipment Inc.",
    contact: "Mike Wilson",
    email: "mike@labeq.com",
    phone: "+1 (555) 456-7890",
    amount: 1850,
    dueDate: "2023-07-01",
    status: "Active",
    accountNumber: "ACC-003",
    creditLimit: 20000,
    terms: "Net 60",
    notes: "Laboratory equipment and maintenance services.",
    history: [
      { date: "2023-05-15", amount: 3200, status: "Paid", reference: "INV-089" },
      { date: "2023-06-01", amount: 1850, status: "Pending", reference: "INV-101" }
    ]
  }
]);

const filteredCreditors = computed(() => {
  if (!searchQuery.value) {
    return creditors.value;
  }
  const query = searchQuery.value.toLowerCase();
  return creditors.value.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.contact.toLowerCase().includes(query) ||
      c.status.toLowerCase().includes(query)
  );
});

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function openHistory(creditor) {
  selectedCreditor.value = creditor;
  showHistory.value = true;
}

function openCreditorDetails(creditor) {
  selectedCreditor.value = creditor;
  showCreditorDetails.value = true;
}
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>