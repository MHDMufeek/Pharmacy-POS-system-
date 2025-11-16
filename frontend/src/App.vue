<template>
  <div class="flex h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar 
      :sidebarOpen="sidebarOpen" 
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out"
      :class="sidebarMargin"
    >
      <!-- Navbar -->
      <Navbar 
        :sidebarOpen="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Router View -->
      <main class="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30 animate-fade-in">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";

const sidebarOpen = ref(true);

// ✅ Computed class for margin adjustment
const sidebarMargin = computed(() => 
  sidebarOpen.value ? "ml-[280px]" : "ml-[80px]"
);

// ✅ Toggle function for both Navbar and Sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// ✅ Auto collapse on small screens
const handleResize = () => {
  if (window.innerWidth < 1024) sidebarOpen.value = false;
  else sidebarOpen.value = true;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Round");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-track-slate-800::-webkit-scrollbar-track {
  background-color: rgb(30 41 59);
}
.scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
  background-color: rgb(71 85 105);
  border-radius: 6px;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Glass Effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Accessibility */
button:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Smooth Transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
