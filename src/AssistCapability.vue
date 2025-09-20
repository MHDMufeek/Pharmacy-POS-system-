<template>
    <div class="page-container">
      <h2 class="page-header">Assist Capability</h2>
      
      <div class="form-container">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        
        <!-- Capability Selection -->
        <div class="form-group">
          <label class="form-label">Select User to Assist <span class="text-red-500">*</span></label>
          <select class="form-input" v-model="assistForm.selectedUser" required>
            <option value="">Select a user</option>
            <option v-for="user in userList" :key="user.id" :value="user.id">
              {{ user.name }} - {{ user.role }}
            </option>
          </select>
        </div>
        
        <!-- Capabilities to Assist With -->
        <div class="form-group">
          <label class="form-label">Capabilities to Assist With <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="inventory" class="mr-2">
              <span class="text-black">Inventory Management</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="sales" class="mr-2">
              <span  class="text-black">Sales Operations</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="reports" class="mr-2">
              <span  class="text-black">Report Generation</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="users" class="mr-2">
              <span  class="text-black">User Management</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="suppliers" class="mr-2">
              <span  class="text-black">Supplier Management</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="assistForm.capabilities" value="customers" class="mr-2">
              <span  class="text-black">Customer Management</span>
            </label>
          </div>
        </div>
        
        <!-- Assistance Duration -->
        <div class="form-group">
          <label class="form-label">Assistance Duration <span class="text-red-500">*</span></label>
          <div class="flex items-center space-x-4 mt-2">
            <label class="flex items-center">
              <input type="radio" v-model="assistForm.duration" value="temporary" class="mr-2">
              <span  class="text-black">Temporary (Until logout)</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="assistForm.duration" value="scheduled" class="mr-2">
              <span  class="text-black">Scheduled</span>
            </label>
          </div>
        </div>
        
        <!-- Scheduled Time (conditional) -->
        <div v-if="assistForm.duration === 'scheduled'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Start Date & Time <span class="text-red-500">*</span></label>
            <input 
              type="datetime-local" 
              class="form-input" 
              v-model="assistForm.startTime" 
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">End Date & Time <span class="text-red-500">*</span></label>
            <input 
              type="datetime-local" 
              class="form-input" 
              v-model="assistForm.endTime" 
              required
            >
          </div>
        </div>
        
        <!-- Assistance Reason -->
        <div class="form-group">
          <label class="form-label">Reason for Assistance <span class="text-red-500">*</span></label>
          <textarea 
            class="form-input" 
            v-model="assistForm.reason" 
            required
            placeholder="Explain why assistance is needed..."
            rows="3"
          ></textarea>
        </div>
        
        <!-- Permission Level -->
        <div class="form-group">
          <label class="form-label">Permission Level <span class="text-red-500">*</span></label>
          <select class="form-input" v-model="assistForm.permissionLevel" required>
            <option value="">Select permission level</option>
            <option value="view">View Only</option>
            <option value="assist">Assist (Limited Actions)</option>
            <option value="full">Full Control</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="assistForm.permissionLevel === 'view'">User can only view screens, no actions allowed</span>
            <span v-else-if="assistForm.permissionLevel === 'assist'">User can perform limited actions with supervision</span>
            <span v-else-if="assistForm.permissionLevel === 'full'">User has full control over selected capabilities</span>
          </p>
        </div>
        
        <div class="flex justify-end mt-6">
          <button type="button" class="btn btn-secondary" @click="goBack">Cancel</button>
          <button type="button" class="btn btn-primary" @click="startAssistance">Start Assistance</button>
        </div>
        
        <!-- Current Active Assistance Sessions -->
        <div v-if="activeSessions.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Active Assistance Sessions</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div v-for="session in activeSessions" :key="session.id" class="bg-white p-4 rounded-md shadow-sm mb-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">Assisting: {{ session.userName }}</p>
                  <p class="text-sm text-gray-600">Capabilities: {{ session.capabilities.join(', ') }}</p>
                  <p class="text-sm text-gray-600">Started: {{ formatDate(session.startTime) }}</p>
                </div>
                <button 
                  @click="endAssistance(session.id)"
                  class="btn btn-secondary text-sm py-1 px-3"
                >
                  End Assistance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const emit = defineEmits(['go-back']);
  
  const successMessage = ref('');
  const errorMessage = ref('');
  
  // Sample user data - in a real app, this would come from an API
  const userList = ref([
    { id: 1, name: 'John Doe', role: 'Pharmacist' },
    { id: 2, name: 'Jane Smith', role: 'Sales Manager' },
    { id: 3, name: 'Mike Johnson', role: 'Inventory Clerk' },
    { id: 4, name: 'Sarah Wilson', role: 'Cashier' }
  ]);
  
  const activeSessions = ref([
    // Sample active session
    {
      id: 1,
      userName: 'Mike Johnson',
      capabilities: ['inventory', 'reports'],
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);
  
  const assistForm = ref({
    selectedUser: '',
    capabilities: [],
    duration: 'temporary',
    startTime: '',
    endTime: '',
    reason: '',
    permissionLevel: ''
  });
  
  onMounted(() => {
    // Set default start time to now
    const now = new Date();
    assistForm.value.startTime = now.toISOString().slice(0, 16);
    
    // Set default end time to 1 hour from now
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    assistForm.value.endTime = endTime.toISOString().slice(0, 16);
  });
  
  function startAssistance() {
    // Reset messages
    successMessage.value = '';
    errorMessage.value = '';
    
    // Validate form
    if (!assistForm.value.selectedUser) {
      errorMessage.value = "Please select a user to assist";
      return;
    }
    
    if (assistForm.value.capabilities.length === 0) {
      errorMessage.value = "Please select at least one capability";
      return;
    }
    
    if (!assistForm.value.reason) {
      errorMessage.value = "Please provide a reason for assistance";
      return;
    }
    
    if (!assistForm.value.permissionLevel) {
      errorMessage.value = "Please select a permission level";
      return;
    }
    
    if (assistForm.value.duration === 'scheduled') {
      if (!assistForm.value.startTime || !assistForm.value.endTime) {
        errorMessage.value = "Please provide both start and end times";
        return;
      }
      
      const start = new Date(assistForm.value.startTime);
      const end = new Date(assistForm.value.endTime);
      
      if (end <= start) {
        errorMessage.value = "End time must be after start time";
        return;
      }
    }
    
    // In a real application, you would make an API call here
    console.log("Starting assistance:", assistForm.value);
    
    // Simulate API call
    setTimeout(() => {
      const selectedUser = userList.value.find(user => user.id == assistForm.value.selectedUser);
      
      // Add to active sessions
      activeSessions.value.push({
        id: Date.now(),
        userName: selectedUser.name,
        capabilities: [...assistForm.value.capabilities],
        startTime: new Date()
      });
      
      successMessage.value = `Assistance session started for ${selectedUser.name}`;
      resetForm();
    }, 1000);
  }
  
  function endAssistance(sessionId) {
    // In a real application, you would make an API call here
    console.log("Ending assistance session:", sessionId);
    
    // Remove from active sessions
    activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId);
    successMessage.value = "Assistance session ended successfully";
  }
  
  function resetForm() {
    assistForm.value = {
      selectedUser: '',
      capabilities: [],
      duration: 'temporary',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      reason: '',
      permissionLevel: ''
    };
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleString();
  }
  
  function goBack() {
    emit('go-back');
  }
  </script>
  
  <style scoped>
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
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
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
    transition: border-color 0.15s ease;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
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
  }
  
  .btn-primary {
    background-color: #1e40af;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #1e3a8a;
  }
  
  .btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.3);
  }
  
  .btn-secondary {
    background-color: #9ca3af;
    color: white;
    margin-right: 0.75rem;
  }
  
  .btn-secondary:hover {
    background-color: #6b7280;
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
  
  @media (max-width: 768px) {
    .form-container {
      padding: 0 1rem;
    }
  }
  </style>