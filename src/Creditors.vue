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
                  <span class="material-icons text-blue-800">business</span>
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
              <!-- 👁️ View History -->
              <button
                class="text-blue-600 hover:text-blue-900 mr-3"
                @click="openHistory(creditor)"
              >
                <span class="material-icons">visibility</span>
              </button>
              <button class="text-green-600 hover:text-green-900 mr-3">
                <span class="material-icons">payment</span>
              </button>
              <button class="text-gray-600 hover:text-gray-900">
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
              <th class="px-4 py-2 text-left">Bill ID</th>
              <th class="px-4 py-2 text-left">Amount</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Status</th>
              
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
const selectedCreditor = ref(null);

// Sample data - replace with API
const creditors = ref([
  {
    id: 1,
    name: "MedSupply Co.",
    contact: "John Smith",
    amount: 2500,
    dueDate: "2023-06-15",
    status: "Active",
    history: [
      { date: "2023-04-10", amount: 1000, status: "Paid" },
      { date: "2023-05-10", amount: 1500, status: "Pending" }
    ]
  },
  {
    id: 2,
    name: "Pharma Distributors",
    contact: "Sarah Johnson",
    amount: 4200,
    dueDate: "2023-05-20",
    status: "Overdue",
    history: [
      { date: "2023-03-01", amount: 2000, status: "Paid" },
      { date: "2023-04-01", amount: 2200, status: "Overdue" }
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
</script>
