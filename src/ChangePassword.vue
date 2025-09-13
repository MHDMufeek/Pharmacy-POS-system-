<template>
    <div class="page-container">
      <h2 class="page-header">Change Password</h2>
      
      <div class="form-container">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <div class="password-input-container">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'" 
                class="form-input" 
                v-model="passwordForm.currentPassword" 
                required
              >
              <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
                <span class="material-icons">{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="password-input-container">
              <input 
                :type="showNewPassword ? 'text' : 'password'" 
                class="form-input" 
                v-model="passwordForm.newPassword" 
                required
              >
              <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
                <span class="material-icons">{{ showNewPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters with a mix of letters, numbers and symbols</p>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <div class="password-input-container">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                class="form-input" 
                v-model="passwordForm.confirmPassword" 
                required
              >
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <span class="material-icons">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="btn btn-secondary" @click="goBack">Cancel</button>
            <button type="submit" class="btn btn-primary">update Password</button>
          </div>
        </form>
      </div>        
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['go-back']);
  
  const successMessage = ref('');
  const errorMessage = ref('');
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  function changePassword() {
    // Reset messages
    successMessage.value = '';
    errorMessage.value = '';
    
    // Validate passwords match
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      errorMessage.value = "New passwords don't match";
      return;
    }
    
    // Validate password strength
    if (passwordForm.value.newPassword.length < 8) {
      errorMessage.value = "Password must be at least 8 characters long";
      return;
    }
    
    // In a real application, you would make an API call here
    console.log("Changing password:", passwordForm.value);
    
    // Simulate API call
    setTimeout(() => {
      successMessage.value = "Password changed successfully!";
      resetForm();
    }, 1000);
  }
  
  function resetForm() {
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    showCurrentPassword.value = false;
    showNewPassword.value = false;
    showConfirmPassword.value = false;
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
    max-width: 500px;
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
  
  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
  }
  
  .password-input-container {
    position: relative;
  }
  
  @media (max-width: 768px) {
    .form-container {
      padding: 0 1rem;
    }
  }
  </style>