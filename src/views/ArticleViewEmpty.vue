<template>
  <div class="wrapper">
    <div ref="commentsElem" class="comments">
      <div v-for="comment in comments">
        <Comment :comment="comment"></Comment>
      </div>
    </div>
    <form v-on:submit.prevent="sendComment" name="commentForm" id="commentForm">
      <input v-model="textAreaValue" placeholder="Type a comment here..." form="commentForm"/>
    </form>
  </div>


</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {onMounted, onUpdated, ref, watch, watchPostEffect} from "vue";
import {type Comment as CommentT} from '@/types/custom.d'
import Comment from "@/components/Comment.vue";

const route = useRoute();
const commentsElem = ref(null);

const comments = ref<CommentT[]>([])
const textAreaValue = ref()

const sendComment = async (e: Event) => {
  console.log("test")
  const content = textAreaValue.value?.trim()
  textAreaValue.value = "";

  if (content.length === 0)
    return;

  const request = await fetch(
      "http://localhost:3000/comment",
      {
        method: "POST",
        body: JSON.stringify({
          feedId: route.params.feedId,
          comment: content,
          author: "Anonymous"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

  if (request.ok) {
    comments.value.push({
      author: "Anonymous",
      date: new Date().toString(),
      comment: content
    })
  }


  e.preventDefault()
}

watch(
    () => route.params.feedId,
    async () => {
      let request = await fetch("http://localhost:3000/comments/" + route.params.feedId)
      comments.value = JSON.parse(await request.text())
      console.log(comments)
    },
    {
      immediate: true,
      flush: 'post' // flush waits for the DOM to be upadted before calling the callback
    }
)

onUpdated(
    () => {
      commentsElem.value!.scrollTo(0, commentsElem.value!.scrollHeight)

    }
)

</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;

  vertical-align: bottom;
}

.comments {
  margin: auto 12px 12px;
  flex-direction: column;
  display: flex;
  overflow-x: scroll;
  gap: 12px;
}

form {
  width: 100%;
  padding: 12px;
  position: relative;
  border-top: 1px solid black;
}

input {
  width: 100%;
}

</style>
