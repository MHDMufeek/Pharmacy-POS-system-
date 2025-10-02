<template>
  <div class="page-container">
    <div class="header-actions">
      <h2 class="page-header">Assign Capability</h2>
      <div class="theme-toggle-container">
        <button @click="toggleTheme('light')" class="theme-btn light-btn" :class="{ active: currentTheme === 'light' }" title="Light Mode">
          <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </button>
        <button @click="toggleTheme('dark')" class="theme-btn dark-btn" :class="{ active: currentTheme === 'dark' }" title="Dark Mode">
          <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <button @click="toggleTheme('auto')" class="theme-btn auto-btn" :class="{ active: currentTheme === 'auto' }" title="Auto (System Preference)">
          <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="form-container">
      <!-- Success and Error Messages -->
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      
      <!-- User Selection -->
      <div class="form-group">
        <label class="form-label">Select User <span class="text-red-500">*</span></label>
        <select 
          class="form-input" 
          v-model="assignForm.selectedUser" 
          :class="{ 'border-red-500': formErrors.selectedUser }"
          required
        >
          <option value="">Select a user</option>
          <option v-for="user in userList" :key="user.id" :value="user.id">
            {{ user.name }} - {{ user.role }}
          </option>
        </select>
        <span v-if="formErrors.selectedUser" class="text-red-500 text-sm">{{ formErrors.selectedUser }}</span>
      </div>
      
      <!-- Capabilities -->
      <div class="form-group">
        <label class="form-label">
          Assign Capabilities <span class="text-red-500">*</span>
        </label>
        <span v-if="formErrors.capabilities" class="text-red-500 text-sm block mb-2">{{ formErrors.capabilities }}</span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          
          <!-- Items Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Items Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="item-sales" class="checkbox-input" />
                <span>Item Sales</span>
              </label>
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="item-details" class="checkbox-input" />
                <span>Item Details</span>
              </label>
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="stock-update" class="checkbox-input" />
                <span>Stock Update</span>
              </label>
            </div>
          </div>

          <!-- Suppliers Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Suppliers Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="supplier-details" class="checkbox-input" />
                <span>Supplier Details</span>
              </label>
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="supply-invoice" class="checkbox-input" />
                <span>Supply Invoice</span>
              </label>
            </div>
          </div>

          <!-- Sales Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Sales Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="customer-return-refund" class="checkbox-input" />
                <span>Customer Return / Refund</span>
              </label>
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="creditors" class="checkbox-input" />
                <span>Creditors</span>
              </label>
            </div>
          </div>

          <!-- Reports Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Reports Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="drug-movement" class="checkbox-input" />
                <span>Drug Movement</span>
              </label>
              <label class="capability-item">
                <input type="checkbox" v-model="assignForm.capabilities" value="inventory-summary" class="checkbox-input" />
                <span>Inventory Summary</span>
              </label>
            </div>
          </div>

        </div>
      </div>
      
      <!-- Duration -->
      <div class="form-group">
        <label class="form-label">Assignment Duration <span class="text-red-500">*</span></label>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-2">
          <label class="duration-option">
            <input type="radio" v-model="assignForm.duration" value="temporary" class="radio-input">
            <span>Temporary (Until logout)</span>
          </label>
          <label class="duration-option">
            <input type="radio" v-model="assignForm.duration" value="scheduled" class="radio-input">
            <span>Scheduled</span>
          </label>
        </div>
      </div>
      
      <!-- Scheduled Time -->
      <div v-if="assignForm.duration === 'scheduled'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Start Date & Time <span class="text-red-500">*</span></label>
          <input 
            type="datetime-local" 
            class="form-input" 
            :class="{ 'border-red-500': formErrors.startTime }"
            v-model="assignForm.startTime" 
            required
          >
          <span v-if="formErrors.startTime" class="text-red-500 text-sm">{{ formErrors.startTime }}</span>
        </div>
        
        <div class="form-group">
          <label class="form-label">End Date & Time <span class="text-red-500">*</span></label>
          <input 
            type="datetime-local" 
            class="form-input" 
            :class="{ 'border-red-500': formErrors.endTime }"
            v-model="assignForm.endTime" 
            required
          >
          <span v-if="formErrors.endTime" class="text-red-500 text-sm">{{ formErrors.endTime }}</span>
        </div>
      </div>
      
      <!-- Reason -->
      <div class="form-group">
        <label class="form-label">Reason for Assignment <span class="text-red-500">*</span></label>
        <textarea 
          class="form-input" 
          :class="{ 'border-red-500': formErrors.reason }"
          v-model="assignForm.reason" 
          required
          placeholder="Explain why capabilities are being assigned..."
          rows="3"
        ></textarea>
        <span v-if="formErrors.reason" class="text-red-500 text-sm">{{ formErrors.reason }}</span>
      </div>
      
      <!-- Permission Level -->
      <div class="form-group">
        <label class="form-label">Permission Level <span class="text-red-500">*</span></label>
        <select 
          class="form-input" 
          v-model="assignForm.permissionLevel" 
          :class="{ 'border-red-500': formErrors.permissionLevel }"
          required
        >
          <option value="">Select permission level</option>
          <option value="view">View Only</option>
          <option value="assist">Assist (Limited Actions)</option>
          <option value="full">Full Control</option>
        </select>
        <p class="permission-hint">
          <span v-if="assignForm.permissionLevel === 'view'">User can only view screens, no actions allowed</span>
          <span v-else-if="assignForm.permissionLevel === 'assist'">User can perform limited actions with supervision</span>
          <span v-else-if="assignForm.permissionLevel === 'full'">User has full control over selected capabilities</span>
        </p>
        <span v-if="formErrors.permissionLevel" class="text-red-500 text-sm">{{ formErrors.permissionLevel }}</span>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
        <button type="button" class="btn btn-secondary order-2 sm:order-1" @click="goBack">
          Cancel
        </button>
        <button type="button" class="btn btn-primary order-1 sm:order-2" @click="assignCapabilities">
          Assign Capabilities
        </button>
      </div>
      
      <!-- Active Assignments -->
      <div v-if="activeAssignments.length > 0" class="mt-8">
        <h3 class="section-title">Active Capability Assignments</h3>
        <div class="assignments-container">
          <div v-for="assignment in activeAssignments" :key="assignment.id" class="assignment-card">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div class="flex-1">
                <p class="assignment-user">User: {{ assignment.userName }}</p>
                <p class="assignment-detail">
                  <span class="detail-label">Capabilities:</span> 
                  {{ formatCapabilities(assignment.capabilities) }}
                </p>
                <p class="assignment-detail">
                  <span class="detail-label">Permission Level:</span> 
                  <span class="capitalize">{{ assignment.permissionLevel }}</span>
                </p>
                <p class="assignment-detail">
                  <span class="detail-label">Assigned:</span> 
                  {{ formatDate(assignment.startTime) }}
                </p>
                <p v-if="assignment.endTime" class="assignment-detail">
                  <span class="detail-label">Expires:</span> 
                  {{ formatDate(assignment.endTime) }}
                </p>
                <p class="assignment-detail">
                  <span class="detail-label">Reason:</span> 
                  {{ assignment.reason }}
                </p>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <button 
                  @click="removeAssignment(assignment.id)"
                  class="btn btn-danger text-sm py-2 px-4"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Active Assignments -->
      <div v-else class="mt-8 text-center py-8 no-assignments">
        <p>No active capability assignments</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['go-back']);

const successMessage = ref('');
const errorMessage = ref('');
const formErrors = reactive({});
const currentTheme = ref('auto'); // 'light', 'dark', or 'auto'

// Sample user data
const userList = ref([
  { id: 1, name: 'John Doe', role: 'Pharmacist' },
  { id: 2, name: 'Jane Smith', role: 'Sales Manager' },
  { id: 3, name: 'Mike Johnson', role: 'Inventory Clerk' },
  { id: 4, name: 'Sarah Wilson', role: 'Cashier' }
]);

const activeAssignments = ref([
  {
    id: 1,
    userName: 'Mike Johnson',
    capabilities: ['stock-update', 'inventory-summary'],
    permissionLevel: 'assist',
    reason: 'Temporary inventory management support',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from start
  }
]);

const assignForm = ref({
  selectedUser: '',
  capabilities: [],
  duration: 'temporary',
  startTime: '',
  endTime: '',
  reason: '',
  permissionLevel: ''
});

// Theme management
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('light-theme', 'dark-theme', 'auto-theme');
  
  if (theme === 'auto') {
    const systemTheme = getSystemTheme();
    root.classList.add('auto-theme', `${systemTheme}-theme`);
    currentTheme.value = 'auto';
  } else {
    root.classList.add(`${theme}-theme`);
    currentTheme.value = theme;
  }
  
  // Save to localStorage
  localStorage.setItem('preferred-theme', theme);
}

function toggleTheme(theme) {
  applyTheme(theme);
}

// Watch for system theme changes
function setupThemeListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (currentTheme.value === 'auto') {
      applyTheme('auto');
    }
  });
}

onMounted(() => {
  initializeForm();
  
  // Initialize theme
  const savedTheme = localStorage.getItem('preferred-theme') || 'auto';
  applyTheme(savedTheme);
  setupThemeListener();
});

function initializeForm() {
  const now = new Date();
  assignForm.value.startTime = now.toISOString().slice(0, 16);
  const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  assignForm.value.endTime = endTime.toISOString().slice(0, 16);
}

function validateForm() {
  // Clear previous errors
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  
  let isValid = true;

  if (!assignForm.value.selectedUser) {
    formErrors.selectedUser = "Please select a user";
    isValid = false;
  }

  if (assignForm.value.capabilities.length === 0) {
    formErrors.capabilities = "Please select at least one capability";
    isValid = false;
  }

  if (!assignForm.value.reason.trim()) {
    formErrors.reason = "Please provide a reason for assignment";
    isValid = false;
  }

  if (!assignForm.value.permissionLevel) {
    formErrors.permissionLevel = "Please select a permission level";
    isValid = false;
  }

  if (assignForm.value.duration === 'scheduled') {
    if (!assignForm.value.startTime) {
      formErrors.startTime = "Please provide a start time";
      isValid = false;
    }
    if (!assignForm.value.endTime) {
      formErrors.endTime = "Please provide an end time";
      isValid = false;
    }
    
    if (assignForm.value.startTime && assignForm.value.endTime) {
      const start = new Date(assignForm.value.startTime);
      const end = new Date(assignForm.value.endTime);
      
      if (end <= start) {
        formErrors.endTime = "End time must be after start time";
        isValid = false;
      }
      
      if (start < new Date()) {
        formErrors.startTime = "Start time cannot be in the past";
        isValid = false;
      }
    }
  }

  return isValid;
}

function assignCapabilities() {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validateForm()) {
    errorMessage.value = "Please fix the errors in the form";
    return;
  }

  const selectedUser = userList.value.find(user => user.id == assignForm.value.selectedUser);

  const newAssignment = {
    id: Date.now(),
    userName: selectedUser.name,
    capabilities: [...assignForm.value.capabilities],
    permissionLevel: assignForm.value.permissionLevel,
    reason: assignForm.value.reason,
    startTime: new Date(),
    endTime: assignForm.value.duration === 'scheduled' ? new Date(assignForm.value.endTime) : null
  };

  activeAssignments.value.push(newAssignment);

  successMessage.value = `Capabilities successfully assigned to ${selectedUser.name}`;
  
  // Auto-hide success message after 5 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);

  resetForm();
}

function removeAssignment(assignmentId) {
  activeAssignments.value = activeAssignments.value.filter(a => a.id !== assignmentId);
  successMessage.value = "Capability assignment removed successfully";
  
  // Auto-hide success message after 3 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
}

function resetForm() {
  assignForm.value = {
    selectedUser: '',
    capabilities: [],
    duration: 'temporary',
    startTime: '',
    endTime: '',
    reason: '',
    permissionLevel: ''
  };
  initializeForm();
  
  // Clear form errors
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCapabilities(capabilities) {
  const capabilityLabels = {
    'item-sales': 'Item Sales',
    'item-details': 'Item Details',
    'stock-update': 'Stock Update',
    'supplier-details': 'Supplier Details',
    'supply-invoice': 'Supply Invoice',
    'customer-return-refund': 'Customer Return/Refund',
    'creditors': 'Creditors',
    'drug-movement': 'Drug Movement',
    'inventory-summary': 'Inventory Summary'
  };
  
  return capabilities.map(cap => capabilityLabels[cap] || cap).join(', ');
}

function goBack() {
  emit('go-back');
}
</script>

<style scoped>
/* Header Actions */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.theme-toggle-container {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.theme-btn:hover {
  background: #e5e7eb;
}

.theme-btn.active {
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 1.5;
}

.light-btn .theme-icon {
  color: #f59e0b;
}

.dark-btn .theme-icon {
  color: #4b5563;
}

.auto-btn .theme-icon {
  color: #6b7280;
}

.theme-btn.active .theme-icon {
  color: #1e40af;
}

/* Light Mode (Default) */
.page-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.page-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.15s ease;
  background-color: white;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-input::placeholder {
  color: #9ca3af;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
}

@media (min-width: 640px) {
  .btn {
    width: auto;
  }
}

.btn-primary {
  background-color: #1e40af;
  color: white;
}

.btn-primary:hover {
  background-color: #1e3a8a;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.alert-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.text-red-500 {
  color: #ef4444;
}

.border-red-500 {
  border-color: #ef4444;
}

.capability-module {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

.module-header {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
}

.capability-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  color: #374151;
}

.capability-item:hover {
  background-color: #f1f5f9;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
}

.radio-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background-color: white;
}

.duration-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
  color: #374151;
}

.duration-option:hover {
  background-color: #f1f5f9;
}

.permission-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.assignments-container {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.assignment-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.75rem;
  transition: box-shadow 0.15s ease;
}

.assignment-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assignment-user {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.assignment-detail {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-label {
  font-weight: 500;
  color: #374151;
}

.no-assignments {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: #6b7280;
}

/* Dark Mode */
.dark-theme .page-container {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-theme .page-header {
  color: #60a5fa;
}

.dark-theme .header-actions {
  border-bottom-color: #374151;
}

.dark-theme .theme-toggle-container {
  background: #374151;
  border-color: #4b5563;
}

.dark-theme .theme-btn:hover {
  background: #4b5563;
}

.dark-theme .theme-btn.active {
  background: #6b7280;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.dark-theme .theme-btn.active .theme-icon {
  color: #60a5fa;
}

.dark-theme .form-label {
  color: #d1d5db;
}

.dark-theme .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark-theme .form-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.dark-theme .form-input::placeholder {
  color: #9ca3af;
}

.dark-theme select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

.dark-theme .btn-primary {
  background-color: #2563eb;
}

.dark-theme .btn-primary:hover {
  background-color: #1d4ed8;
}

.dark-theme .btn-secondary {
  background-color: #4b5563;
}

.dark-theme .btn-secondary:hover {
  background-color: #374151;
}

.dark-theme .btn-danger {
  background-color: #dc2626;
}

.dark-theme .btn-danger:hover {
  background-color: #b91c1c;
}

.dark-theme .alert-success {
  background-color: #064e3b;
  color: #a7f3d0;
  border-color: #047857;
}

.dark-theme .alert-error {
  background-color: #7f1d1d;
  color: #fecaca;
  border-color: #b91c1c;
}

.dark-theme .capability-module {
  background-color: #374151;
  border-color: #4b5563;
}

.dark-theme .module-header {
  color: #f9fafb;
}

.dark-theme .capability-item {
  color: #d1d5db;
}

.dark-theme .capability-item:hover {
  background-color: #4b5563;
}

.dark-theme .checkbox-input,
.dark-theme .radio-input {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark-theme .duration-option {
  color: #d1d5db;
}

.dark-theme .duration-option:hover {
  background-color: #4b5563;
}

.dark-theme .permission-hint {
  color: #9ca3af;
}

.dark-theme .section-title {
  color: #f9fafb;
}

.dark-theme .assignments-container {
  background-color: #374151;
  border-color: #4b5563;
}

.dark-theme .assignment-card {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark-theme .assignment-user {
  color: #f9fafb;
}

.dark-theme .assignment-detail {
  color: #d1d5db;
}

.dark-theme .detail-label {
  color: #e5e7eb;
}

.dark-theme .no-assignments {
  background-color: #374151;
  color: #9ca3af;
}

/* System preference for auto mode */
.auto-theme {
  /* System will handle via media query */
}

@media (prefers-color-scheme: dark) {
  .auto-theme .page-container {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .auto-theme .page-header {
    color: #60a5fa;
  }

  .auto-theme .header-actions {
    border-bottom-color: #374151;
  }

  .auto-theme .theme-toggle-container {
    background: #374151;
    border-color: #4b5563;
  }

  .auto-theme .theme-btn:hover {
    background: #4b5563;
  }

  .auto-theme .theme-btn.active {
    background: #6b7280;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .auto-theme .theme-btn.active .theme-icon {
    color: #60a5fa;
  }

  .auto-theme .form-label {
    color: #d1d5db;
  }

  .auto-theme .form-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .auto-theme .form-input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }

  .auto-theme .form-input::placeholder {
    color: #9ca3af;
  }

  .auto-theme select.form-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  }

  .auto-theme .btn-primary {
    background-color: #2563eb;
  }

  .auto-theme .btn-primary:hover {
    background-color: #1d4ed8;
  }

  .auto-theme .btn-secondary {
    background-color: #4b5563;
  }

  .auto-theme .btn-secondary:hover {
    background-color: #374151;
  }

  .auto-theme .btn-danger {
    background-color: #dc2626;
  }

  .auto-theme .btn-danger:hover {
    background-color: #b91c1c;
  }

  .auto-theme .alert-success {
    background-color: #064e3b;
    color: #a7f3d0;
    border-color: #047857;
  }

  .auto-theme .alert-error {
    background-color: #7f1d1d;
    color: #fecaca;
    border-color: #b91c1c;
  }

  .auto-theme .capability-module {
    background-color: #374151;
    border-color: #4b5563;
  }

  .auto-theme .module-header {
    color: #f9fafb;
  }

  .auto-theme .capability-item {
    color: #d1d5db;
  }

  .auto-theme .capability-item:hover {
    background-color: #4b5563;
  }

  .auto-theme .checkbox-input,
  .auto-theme .radio-input {
    background-color: #4b5563;
    border-color: #6b7280;
  }

  .auto-theme .duration-option {
    color: #d1d5db;
  }

  .auto-theme .duration-option:hover {
    background-color: #4b5563;
  }

  .auto-theme .permission-hint {
    color: #9ca3af;
  }

  .auto-theme .section-title {
    color: #f9fafb;
  }

  .auto-theme .assignments-container {
    background-color: #374151;
    border-color: #4b5563;
  }

  .auto-theme .assignment-card {
    background-color: #4b5563;
    border-color: #6b7280;
  }

  .auto-theme .assignment-user {
    color: #f9fafb;
  }

  .auto-theme .assignment-detail {
    color: #d1d5db;
  }

  .auto-theme .detail-label {
    color: #e5e7eb;
  }

  .auto-theme .no-assignments {
    background-color: #374151;
    color: #9ca3af;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 0 0.5rem;
  }
  
  .page-container {
    padding: 1rem;
    margin-top: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .theme-toggle-container {
    align-self: stretch;
    justify-content: center;
  }
}
</style>