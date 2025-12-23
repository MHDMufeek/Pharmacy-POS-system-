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
          <label class="form-label">Select User <span class="text-red-500">*</span></label>
          <select v-model="selectedUser" required class="form-input">
            <option value="">Select User</option>
            <option v-for="u in userList" :key="u._id || u.id" :value="u._id || u.id">{{ u.name }} - {{ u.role }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Current Password</label>
          <div class="password-input-container">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              v-model="passwordForm.currentPassword"
              placeholder="Enter current password"
              class="form-input"
            />
            <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
              <span class="text-lg">{{ showCurrentPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">New Password <span class="text-red-500">*</span></label>
          <div class="password-input-container">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="passwordForm.newPassword"
              placeholder="Enter new password"
              class="form-input"
              required
            />
            <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
              <span class="text-lg">{{ showNewPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Confirm New Password <span class="text-red-500">*</span></label>
          <div class="password-input-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="passwordForm.confirmPassword"
              placeholder="Confirm new password"
              class="form-input"
              required
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <span class="text-lg">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
          <div v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="password-match-error">
            Passwords do not match
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button type="button" class="btn btn-secondary" @click="goBack">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Password</button>
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
// password strength indicator removed; no computed helper needed

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
/* Borrowed styling from CreateUserAccount for consistent UI */
.page-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  min-height: 100vh;
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
  max-width: 700px;
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
  transition: all 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.15s ease;
  background-color: #f9fafb;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #ffffff;
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

.btn-primary:hover { background-color: #1e3a8a; }
.btn-secondary { background-color: #9ca3af; color: white; margin-right: 0.75rem; }
.btn-secondary:hover { background-color: #6b7280; }

.alert { padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem; transition: all 0.3s ease; }
.alert-success { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.alert-error { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

.password-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; transition: all 0.3s ease; }
.password-input-container { position: relative; }
.password-hint { font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; }

/* password strength styles removed */

.password-match-error { color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem; }

.text-red-500 { color: #ef4444; }

.flex { display: flex; }
.justify-end { justify-content: flex-end; }
.mt-6 { margin-top: 1.5rem; }

/* Responsive */
@media (max-width: 640px) {
  .form-container { padding: 0 1rem; }
}
</style>