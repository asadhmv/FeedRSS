<template>

  <div class="wrapper">
    <div class="articleList">
      <h1 class="title">{{ currentFeed?.title }}</h1>

      <div class="articles">
        <FeedViewItem
            class="article"
            :article="article"
            v-for="article in currentFeed?.articles"
            :key="article.publicationDate"
            v-memo="[article.id]"
            :feed-id="currentFeed.id"/>
      </div>
    </div>

    <div class="articleView">
      <router-view></router-view>

    </div>
  </div>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {watch} from "vue";
import type {Article, Feed} from "@/types/custom";
import {useFeedsStore} from "@/stores/feeds";
import FeedViewItem from "@/components/FeedViewItem.vue";

const storeFeeds = useFeedsStore();
const router = useRouter()
const route = useRoute()

let currentFeed: Feed;

watch(
    () => route.params.feedId,
    newId => {
      let feed = storeFeeds.getFeedById(newId as string);

      if (!feed) {
        console.log("Invalid feed id, redirecting to /explore...")

        router.replace('/explore');
      } else {
        currentFeed = feed;
      }
    },
    { immediate: true }
)


</script>


<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
  }

  .articleList {
    width: 50%;
    border-right: 1px solid black;
    display: flex;
    flex-direction: column;
  }

  .articles {
    overflow-y: scroll;
  }

  .title {
    margin: 0 auto;

  }

  .articleView {
    width: 50%;
  }
</style>