<template>
  <div class="page-container">

    <div class="form-card">
      <div class="form-header">
        <h2 class="page-header">Change Password</h2>
        <p class="page-subtitle">Secure your account with a new password</p>
      </div>

      <!-- Success / Error -->
      <div v-if="successMessage" class="alert alert-success">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
      <div v-if="errorMessage" class="alert alert-error">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <div class="password-input-container">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.currentPassword"
              placeholder=""
              required
            />
            <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
              <svg v-if="showCurrentPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4306 8.99731 11.1379 8.99731 11.9161C8.99731 13.4854 10.2651 14.7582 11.8344 14.7582C12.5997 14.7582 13.303 14.4364 13.8174 13.9175M6.49946 6.64715C4.59971 7.90006 3.15305 9.783 2.45703 11.9606C2.31668 12.4031 2.31668 12.8917 2.45703 13.3342C3.09823 15.3686 4.35861 17.2149 6.09114 18.6135C7.82367 20.012 9.93893 20.8856 12.1593 21.1149C14.3797 21.3442 16.593 20.9188 18.5277 19.8965C20.4624 18.8742 22.0222 17.3025 22.999 15.4018C23.1393 14.9593 23.1393 14.4707 22.999 14.0282C22.6153 12.8856 21.9179 11.8488 21.0005 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="form-group">
          <label class="form-label">New Password</label>
          <div class="password-input-container">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.newPassword"
              placeholder=""
              required
            />
            <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
              <svg v-if="showNewPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4306 8.99731 11.1379 8.99731 11.9161C8.99731 13.4854 10.2651 14.7582 11.8344 14.7582C12.5997 14.7582 13.303 14.4364 13.8174 13.9175M6.49946 6.64715C4.59971 7.90006 3.15305 9.783 2.45703 11.9606C2.31668 12.4031 2.31668 12.8917 2.45703 13.3342C3.09823 15.3686 4.35861 17.2149 6.09114 18.6135C7.82367 20.012 9.93893 20.8856 12.1593 21.1149C14.3797 21.3442 16.593 20.9188 18.5277 19.8965C20.4624 18.8742 22.0222 17.3025 22.999 15.4018C23.1393 14.9593 23.1393 14.4707 22.999 14.0282C22.6153 12.8856 21.9179 11.8488 21.0005 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="password-strength">
            <div class="strength-bar">
              <div class="strength-fill" :class="getPasswordStrengthClass"></div>
            </div>
            <p class="helper-text">Minimum 8 characters, include letters, numbers & symbols</p>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <div class="password-input-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.confirmPassword"
              placeholder=""
              required
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4306 8.99731 11.1379 8.99731 11.9161C8.99731 13.4854 10.2651 14.7582 11.8344 14.7582C12.5997 14.7582 13.303 14.4364 13.8174 13.9175M6.49946 6.64715C4.59971 7.90006 3.15305 9.783 2.45703 11.9606C2.31668 12.4031 2.31668 12.8917 2.45703 13.3342C3.09823 15.3686 4.35861 17.2149 6.09114 18.6135C7.82367 20.012 9.93893 20.8856 12.1593 21.1149C14.3797 21.3442 16.593 20.9188 18.5277 19.8965C20.4624 18.8742 22.0222 17.3025 22.999 15.4018C23.1393 14.9593 23.1393 14.4707 22.999 14.0282C22.6153 12.8856 21.9179 11.8488 21.0005 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="password-match-error">
            Passwords do not match
          </div>
        </div>

        <!-- User Selection -->
        <div class="form-group">
          <label class="form-label">Select User</label>
          <div class="select-container">
            <select v-model="selectedUser" class="form-input" required>
              <option value="" disabled>Select User</option>
              <option v-for="u in userList" :key="u._id || u.id" :value="u._id || u.id">{{ u.name }} - {{ u.role }}</option>
            </select>
            <svg class="select-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button type="button" class="btn btn-secondary" @click="goBack">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isFormInvalid">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Update Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['go-back'])

const successMessage = ref('')
const errorMessage = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const selectedUser = ref('')
const userList = ref([])

// fetch users for selection
async function fetchUsers() {
  try {
    const token = localStorage.getItem('token')
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
    const res = await fetch(`${API_BASE}/capabilities/users`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (res.ok) {
      userList.value = await res.json()
      // if selectedUser not set, default to current user
      if (!selectedUser.value) {
        const raw = localStorage.getItem('user')
        if (raw) {
          try { selectedUser.value = JSON.parse(raw).id || JSON.parse(raw)._id || '' } catch (e) { }
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

// Initialize selectedRole from currently authenticated user (stored in localStorage)
onMounted(() => {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const u = JSON.parse(raw)
      if (u && (u.id || u._id)) selectedUser.value = u.id || u._id
    }
  } catch (e) {
    // ignore parse errors
  }
  fetchUsers()
})
// Computed properties
const getPasswordStrengthClass = computed(() => {
  const password = passwordForm.value.newPassword
  if (!password) return ''
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  if (strength <= 1) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
})

const isSelfChange = computed(() => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return false
    const me = JSON.parse(raw)
    const myId = me.id || me._id
    return myId && selectedUser.value && (myId === selectedUser.value)
  } catch (e) {
    return false
  }
})

const isFormInvalid = computed(() => {
  return !passwordForm.value.currentPassword || 
         !passwordForm.value.newPassword || 
         !passwordForm.value.confirmPassword || 
         !selectedUser.value ||
         passwordForm.value.newPassword !== passwordForm.value.confirmPassword
})

// Theme is controlled globally via navbar; local toggle removed

async function changePassword() {
  successMessage.value = ''
  errorMessage.value = ''
  if (!selectedUser.value) { errorMessage.value = 'Please select a user'; return }
  // If user is changing their own password, require current password
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const me = JSON.parse(raw)
      const myId = me.id || me._id
      if (myId && myId === selectedUser.value && !passwordForm.value.currentPassword) {
        errorMessage.value = 'Please enter your current password';
        return
      }
    }
  } catch (e) { /* ignore */ }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) { errorMessage.value = "New passwords don't match"; return }
  if (passwordForm.value.newPassword.length < 8) { errorMessage.value = 'Password must be at least 8 characters long'; return }
  // Call backend to update password
  try {
    const token = localStorage.getItem('token')
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
    const payload = { newPassword: passwordForm.value.newPassword }
    // if the current user is changing their own password, include currentPassword for verification
    try {
      const raw = localStorage.getItem('user')
      const me = raw ? JSON.parse(raw) : null
      if (me && (me.id || me._id) === selectedUser.value) {
        payload.currentPassword = passwordForm.value.currentPassword
      }
    } catch (e) { /* ignore */ }

    const res = await fetch(`${API_BASE}/users/${selectedUser.value}/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    })

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      errorMessage.value = body.message || body.error || `Failed to change password (${res.status})`
      return
    }

    const user = userList.value.find(u => (u._id || u.id) === selectedUser.value)
    const name = user ? user.name : selectedUser.value
    successMessage.value = body.message || `Password changed successfully for ${name}.`
    resetForm()
  } catch (err) {
    console.error('Error calling change password API', err)
    errorMessage.value = 'Network error. Please try again.'
  }
}

function resetForm() {
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  // restore selectedRole to current user's role
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const u = JSON.parse(raw)
      selectedUser.value = u && (u.id || u._id) ? (u.id || u._id) : ''
    } else {
      selectedUser.value = ''
    }
  } catch (e) {
    selectedUser.value = ''
  }
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

function goBack() {
  emit('go-back')
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  transition: background 0.3s ease;
  position: relative;
}

/* Theme toggle */
.theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 10;
}
.icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #facc15;
  position: relative;
  transition: all 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.icon.dark { background: #fbbf24; }
.icon .sun-rays {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  border-radius: 50%;
  box-shadow: 0 -12px #fbbf24, 0 12px #fbbf24, 12px 0 #fbbf24, -12px 0 #fbbf24,
              8px 8px #fbbf24, -8px 8px #fbbf24, 8px -8px #fbbf24, -8px -8px #fbbf24;
  opacity: 1;
  transition: opacity 0.5s ease;
}
.icon.dark .sun-rays { opacity: 0; }
.icon .moon {
  position: absolute;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  background: #1f2937;
  border-radius: 50%;
  transform: rotate(45deg);
  transition: all 0.5s ease;
}
.icon.light .moon { background: transparent; }

/* Form card */
.form-card {
  width: 100%;
  max-width: 480px;
  border-radius: 1.5rem;
  padding: 2.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

/* Dark & Light Themes */
.dark { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #f9fafb; }
.dark .form-card { background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.05); }
.light { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #111827; }
.light .form-card { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(0, 0, 0, 0.05); }

/* Form header */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1.5rem;
}
.form-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: block;
  font-size: 0.9rem;
}
.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.dark .form-input {
  background: rgba(31, 41, 55, 0.7);
  color: #f9fafb;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.light .form-input {
  background: rgba(255, 255, 255, 0.7);
  color: #111827;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.password-input-container {
  position: relative;
}
.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.password-strength {
  margin-top: 0.5rem;
}
.strength-bar {
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}
.dark .strength-bar {
  background: rgba(255, 255, 255, 0.1);
}
.light .strength-bar {
  background: rgba(0, 0, 0, 0.1);
}
.strength-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}
.strength-fill.weak {
  width: 33%;
  background: #ef4444;
}
.strength-fill.medium {
  width: 66%;
  background: #f59e0b;
}
.strength-fill.strong {
  width: 100%;
  background: #10b981;
}

.helper-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.password-match-error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.select-container {
  position: relative;
}
.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  pointer-events: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}
.btn {
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}
.btn-secondary {
  background: rgba(107, 114, 128, 0.2);
  color: inherit;
}
.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.3);
}
.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease;
}
.alert-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.alert-error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-container {
    padding: 1rem;
  }
  .form-card {
    padding: 1.5rem;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>