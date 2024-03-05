<template>
  <div class="wrapper">
    <div class="title">
      {{ currentArticle?.title }}
    </div>
    <a :href="currentArticle?.link" class="link"
       target="_blank" referrerpolicy="no-referrer">
      Clique ici pour ouvrir l'article dans un nouvel onglet
    </a>
    <hr>
    <div class="article">
      <div v-html="currentArticle?.description"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useFeedsStore} from "@/stores/feeds";
import {watch, ref, type Ref} from "vue";
import type {Article} from "@/types/custom";

let route = useRoute();
let router = useRouter();
let feedsStore = useFeedsStore();
let currentArticle: Ref<Article | null> = ref(null);



const findArticle = (): Article | null => {
  let feed = feedsStore.getFeedById(route.params.feedId as string);

  if (!feed) {
    console.log("Invalid feed id");

    return null;
  } else {
    let articleFound = feed.articles.find(art => art.id  === route.params.articleId)

    if (!articleFound) {
      console.log("Invalid article id");

      return null;
    } else {
      if (!articleFound.hasBeenRead) {
        articleFound.hasBeenRead = true;
        feedsStore.saveToLocalStorage();
      }

      return articleFound;
    }
  }
}

watch(
    () => route.params.articleId,
    () => {
      let article = findArticle();

      if (article) {
        currentArticle.value = article;
      } else {
        console.log("Article can't be found");

        router.push("/explore")
      }
    },
    {
      immediate: true,
      flush: 'post' // flush waits for the DOM to be upadted before calling the callback
    }
)





</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin: auto;
}

.link {
  margin: auto auto 16px;
}

.article {
  flex: 1;
  overflow-x: scroll;
  padding: 8px
}
</style>
