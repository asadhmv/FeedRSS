<template>
    <details v-if="allFolder > 0" class="allfolder">
      <summary>
        All
        <span class="nb-notif">{{ feeds.length }}</span>
      </summary>
      <div class="allfolder-content">
        <SidebarItem v-for="feed in feeds" :feed="feed" :folderName="'All'" />
      </div>
    </details>

</template>

<script setup lang="ts">
import { useFoldersStore } from "@/stores/folders";
import { computed, ref, watch } from "vue";
import SidebarItem from "./SidebarItem.vue";
import { useFeedsStore } from "@/stores/feeds";

const foldersStore = useFoldersStore();
const feedsStore = useFeedsStore();
const allFolder = ref(foldersStore.getFolders.length);

const feeds = computed(() => feedsStore.getFeeds);


watch(() => foldersStore.getFolders.length, (newLength) => {
    allFolder.value = newLength;
});

</script>

<style scoped>
.allfolder {
    display: flex;
    margin: 5px;
    cursor: pointer;
}

.allfolder h4 {
    margin-left: 5px;
}

.allfolder-content {
    margin-left: 20px;
}

.nb-notif {
    float: right;
}
</style>