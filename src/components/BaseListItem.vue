<script setup lang="ts">
interface Props {
  destination: object,
}

const props = defineProps<Props>();
</script>

<template>
  <RouterLink :to="props.destination" class="base-list-item">
    <div v-if="$slots.leftIcon" class="leftIcon">
      <slot name="leftIcon"></slot>
    </div>
    <div class="text">
      <slot name="text"></slot>
    </div>
    <div class="rightFloat">
      <slot name="rightFloat"></slot>
    </div>
  </RouterLink>
</template>

<style scoped>
  .base-list-item {
    padding: 4px;
    display: flex;
    cursor: default;
    text-decoration: none;
    color: var(--color-text);
    overflow: hidden;
  }

  .base-list-item.router-link-active {
    background-color: var(--blue-accent);
  }

  .leftIcon {
    height: 20px;
    width: 20px;
    margin: auto 4px auto 0;
  }

  .text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-height: min-content;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .rightFloat {
    float: right;
    margin: auto 0;
    display: flex;
  }

</style>