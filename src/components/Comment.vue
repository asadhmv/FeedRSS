<script setup lang="ts">
import {type Comment} from '@/types/custom.d'

interface Props {
  comment: Comment
}

const props = defineProps<Props>();

let formatted_date = new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
  timeZone: "America/New_York",
}).format(new Date(props.comment.date))

</script>


<template>
  <div class="wrapper">
    <div class="head">
      <div class="author">
        {{props.comment.author}}
      </div>
      <div class="date">
        {{formatted_date}}
      </div>
    </div>

    <div class="comment">
      {{props.comment.comment}}
    </div>
  </div>



</template>

<style scoped>
  .wrapper {
    border: 1px solid black;
    padding: 8px;
    border-radius: var(--radius-medium);
  }

  .head {
    display: flex;
  }

  .author {
    font-weight: bold;
    font-size: 18px;
  }

  .date {
    margin: auto 0 auto 4px;
    font-size: 13px;
    color: #6c6c6c;
  }

  .date::before {
    content: "- ";
  }

</style>