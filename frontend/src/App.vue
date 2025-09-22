<template>
  <div class="flex h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden">
    <!-- Sidebar Component -->
    <Sidebar 
      :sidebarOpen="sidebarOpen" 
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />
    
    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :style="{ marginLeft: sidebarOpen ? '280px' : '80px' }"
    >
      <!-- Navbar Component -->
      <Navbar 
        :sidebarOpen="sidebarOpen"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <!-- Router View for Pages -->
      <main class="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const sidebarOpen = ref(true);
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

.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>