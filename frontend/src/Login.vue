<template>
  <div
    class="flex items-center justify-center min-h-screen transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
  >
    <div
      class="w-full max-w-md p-8 rounded-2xl shadow-lg"
      :class="isDark ? 'bg-gray-800' : 'bg-white'"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Login</h2>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 rounded-lg text-sm"
        :class="isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'"
      >
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-4 p-3 rounded-lg text-sm"
        :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'"
      >
        {{ successMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Username Input -->
        <div>
          <label class="block mb-1 font-medium">Username or Email</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            :class="isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-400' : 'bg-gray-100 border-gray-300 focus:ring-blue-600'"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label class="block mb-1 font-medium">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              :class="isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-400' : 'bg-gray-100 border-gray-300 focus:ring-blue-600'"
              required
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-2 text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
        >
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      isDark: false,
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async handleLogin() {
      this.errorMessage = "";
      this.successMessage = "";
      this.isLoading = true;

      try {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
  const response = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: this.username,
            email: this.username,
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token and user info
          if (data.token) localStorage.setItem('token', data.token);
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

          // notify other components in same tab to refresh auth state
          try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}

          this.successMessage = "Login successful 🎉 Redirecting...";
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 1000);
        } else {
          this.errorMessage = data.message || "Invalid username or password";
        }
      } catch (err) {
        console.error("Login error:", err);
        this.errorMessage = "Server not responding. Please try again later.";
      } finally {
        this.isLoading = false;
      }
    },

    loadThemePreference() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDark = savedTheme === 'dark';
      } else {
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (this.isDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    },
  },
  mounted() {
    this.loadThemePreference();
    // listen for global theme changes (from Navbar toggle)
    this._themeHandler = (ev) => {
      try { this.isDark = !!(ev && ev.detail && ev.detail.isDark); } catch(e) {}
    }
    window.addEventListener('themeChanged', this._themeHandler);
    localStorage.removeItem("user"); // Clear previous user
  },
  beforeUnmount() {
    try { window.removeEventListener('themeChanged', this._themeHandler); } catch(e) {}
  },
};
</script>

<style scoped>
* {
  transition: background-color 0.3s, color 0.3s;
}
</style>
