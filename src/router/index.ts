import { createRouter, createWebHistory } from 'vue-router'
import FeedView from "@/views/FeedView.vue";
import ArticleView from "@/views/ArticleView.vue";
import ArticleViewEmpty from "@/views/ArticleViewEmpty.vue";
import ExploreView from '@/views/ExploreView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/explore"
    },
    {
      path: "/feed/:feedId",
      component: FeedView,
      children: [
        {
          path: "",
          name: "empty",
          component: ArticleViewEmpty
        },
        {
          path: "article/:articleId",
          name: "article",
          component: ArticleView
        }
      ]
    },
    {
      path: "/explore",
      name: "explore",
      component: ExploreView
    }
  ]
})

export default router
