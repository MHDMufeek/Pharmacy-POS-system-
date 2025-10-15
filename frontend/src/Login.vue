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

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-full transition"
          :class="isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button>
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
          <label class="block mb-1 font-medium">Username</label>
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
              :disabled="isLoading"
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

        <!-- Demo Credentials -->
        <div
          class="mt-6 p-4 rounded-lg"
          :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
        >
          <h3 class="font-semibold mb-2 text-sm">Demo Credentials:</h3>
          <div class="text-xs space-y-1">
            <p><strong>Admin:</strong> admin / 1234</p>
            <p><strong>Pharmacist:</strong> pharmacist1 / 1234</p>
            <p><strong>Store Manager:</strong> manager1 / 1234</p>
            <p><strong>Inventory Clerk:</strong> clerk1 / 1234</p>
          </div>
        </div>
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
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("preferred-theme", this.isDark ? "dark" : "light");
    },
    async handleLogin() {
      this.errorMessage = "";
      this.successMessage = "";
      this.isLoading = true;

      if (!this.username.trim() || !this.password.trim()) {
        this.errorMessage = "Please enter both username and password";
        this.isLoading = false;
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store auth data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("capabilities", JSON.stringify(data.capabilities));
          localStorage.setItem("permissionLevel", data.permissionLevel);

          this.successMessage = "Login successful 🎉 Redirecting...";

          // Redirect
          this.redirectBasedOnCapabilities(data.capabilities);
        } else {
          this.errorMessage = data.message || data.error || "Login failed. Please check your credentials.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "Network error. Please check if the server is running.";
      } finally {
        this.isLoading = false;
      }
    },

    redirectBasedOnCapabilities(capabilities) {
      const redirect = (path) => setTimeout(() => this.$router.push(path), 1000);

      if (!capabilities || capabilities.length === 0) return redirect("/no-access");

      // Item
      if (capabilities.includes("item-sales")) return redirect("/item/sales");
      if (capabilities.includes("item-details")) return redirect("/item/details");
      if (capabilities.includes("stock-update")) return redirect("/item/stock-update");

      // Supplier
      if (capabilities.includes("supplier-details")) return redirect("/supplier/details");
      if (capabilities.includes("supply-invoice")) return redirect("/supplier/invoice");

      // Sales
      if (capabilities.includes("customer-return-refund")) return redirect("/sales/return-refund");
      if (capabilities.includes("creditors")) return redirect("/sales/creditors");

      // Reports
      if (capabilities.includes("drug-movement")) return redirect("/reports/drug-movement");
      if (capabilities.includes("inventory-summary")) return redirect("/reports/inventory-summary");

      // Admin
      if (capabilities.includes("change-password")) return redirect("/admin/change-password");
      if (capabilities.includes("create-user")) return redirect("/admin/create-user");
      if (capabilities.includes("assist-capability")) return redirect("/admin/assist-capability");

      // Fallback
      return redirect("/dashboard");
    },

    loadThemePreference() {
      const savedTheme = localStorage.getItem("preferred-theme");
      if (savedTheme) {
        this.isDark = savedTheme === "dark";
      } else {
        this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    },
  },
  mounted() {
    this.loadThemePreference();

    // Clear old auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("capabilities");
    localStorage.removeItem("permissionLevel");
  },
};
</script>

<style scoped>
* {
  transition: background-color 0.3s, color 0.3s;
}
</style>
