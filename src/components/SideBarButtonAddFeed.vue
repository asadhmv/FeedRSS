<template>
  <div class="btn">
    <div class="center">
      <IconPlus class="icon"/>
      <div class="text">Ajouter un feed</div>
    </div>

  </div>
</template>


<script setup lang="ts">
import IconPlus from "@/components/icons/IconPlus.vue";

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
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.btn:hover {
  background-color: var(--blue-accent);
}

.text {
  padding-left: 8px;
}
</style>

