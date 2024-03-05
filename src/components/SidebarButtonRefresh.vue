<template>
  <div class="btn">
    <div class="center">
      <IconRefresh class="icon"/>
      <span class="text">Rafraîchir</span>
    </div>

  </div>
</template>


<script setup lang="ts">
import IconRefresh from "@/components/icons/IconRefresh.vue";

</script>


<style scoped>
  .btn {
    padding: 8px 16px;
    border: 2px solid var(--blue-accent);
    cursor: pointer;
    background-color: var(--blue);
    color: white;
    border-radius: var(--radius-medium);
  }

  .center {
    align-items: center;
    display: flex;
    width: min-content;
    margin: auto;
  }

  .btn:hover {
    background-color: var(--blue-accent);
  }

  .text {
    padding-left: 8px;
  }
</style>

