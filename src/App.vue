<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SidebarView from "@/components/Sidebar.vue";
</script>

<template>
  <SidebarView class="sidebar"/>

  <RouterView class="router" />
</template>

<style scoped>
.sidebar {
  width: 280px;
}

.router {
  flex-grow: 1;
  width: calc(100vw - 280px);
  overflow-y: scroll;
}
</style>
