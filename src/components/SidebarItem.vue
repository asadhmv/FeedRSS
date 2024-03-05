<script setup lang="ts">
import type { Feed } from "@/types/custom.d";
import { useFeedsStore } from "@/stores/feeds";
import StatusIcon from "@/components/StatusIcon.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import { useFoldersStore } from "@/stores/folders";
import BaseListItem from "@/components/BaseListItem.vue";

interface Props {
  feed: Feed,
  folderName: string
}

const props = defineProps<Props>();
const store = useFeedsStore();
const foldersStore = useFoldersStore();


const onDeleteFeed = (e: Event) => {
  foldersStore.removeFeedFromFolder(props.folderName, props.feed.id);
  store.deleteFeed(props.feed.id);
  e.preventDefault();
}

</script>

<template>
  <BaseListItem :destination="{name: 'empty', params: { feedId: feed.id }}" class="sidebar-item">
    <template #leftIcon>
      <StatusIcon :status='feed.status' class="icon" :icon-url="feed.faviconUrl" />
    </template>

    <template #text>
      <div>{{feed.title}}</div>
    </template>

    <template #rightFloat>
      <IconTrash class="delete icon" v-if="folderName !== 'All'" @click="onDeleteFeed" />
      <span class="nb-notifs">{{feed.articles.filter(article => article.hasBeenRead === false).length}}</span>
    </template>
  </BaseListItem>
</template>

<style scoped>
.favicon {
  width: 100%;
  height: 100%;
}

.icon {
  width: 20px;
  margin: auto 0;
}

.nb-notifs{
  margin-left: 7px;
}

.delete {
  cursor: pointer;
  color: var(--color-text);
  display: none;
}

.sidebar-item:hover .delete {
  display: block;
}

.sidebar-item:hover .delete:hover {
  color: red;
}

</style>