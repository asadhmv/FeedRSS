<script setup lang="ts">
import type {Article, FeedId} from "@/types/custom.d";
import IconTrash from "@/components/icons/IconTrash.vue";
import {useFeedsStore} from "@/stores/feeds";
import BaseListItem from "@/components/BaseListItem.vue";

interface Props {
  article: Article,
  feedId: FeedId
}

const props = defineProps<Props>()
const feedsStore = useFeedsStore();

function deleteFeed(e: Event) {
  feedsStore.deleteArticleFromFeed(props.feedId, props.article.id)
  e.preventDefault();
}

</script>

<template>
  <BaseListItem :destination="{ name: 'article', params: { articleId: props.article.id}}" class="feed-item">
    <template #text>
        <div :class="article.hasBeenRead ? 'title' : 'title unread'">
          {{article.title}}
        </div>
    </template>
    <template #rightFloat>
      <IconTrash class="delete-button" @click="deleteFeed" />
    </template>
  </BaseListItem>
</template>

<style scoped>
  .unread {
    font-weight: bold;
  }

  .delete-button {
    display: none;
    height: 20px;
  }

  .feed-item:hover .delete-button {
    display: block;
  }

  .feed-item:hover .delete-button:hover {
    color: red;
  }
</style>