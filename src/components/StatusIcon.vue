<script setup lang="ts">
import {FeedStatus} from "@/types/custom.d";
import {ref, shallowRef, watch} from "vue";
import IconTime from "@/components/icons/IconTime.vue";
import IconError from "@/components/icons/IconError.vue";
import IconRefresh from "@/components/icons/IconRefresh.vue";

interface Props {
  status: FeedStatus,
  iconUrl: string,
}

let props = defineProps<Props>();

let icon = shallowRef();
let color = ref()

watch(
    () => props.status,
    () => {
      switch (props.status) {
        case FeedStatus.Outdated:
          icon.value = IconTime;
          color.value = '#FFFF00';
          break;
        case FeedStatus.UpToDate:
          icon.value = '';
          color.value = '#00FF00';
          break;
        case FeedStatus.UpdateFailed:
          icon.value = IconError;
          color.value = '#FF0000';
          break;
        case FeedStatus.Updating:
          icon.value = IconRefresh;
          color.value = '#000000';
          break;
      }
    },
    { immediate: true}
)



</script>

<template>
  <img v-if="props.status === FeedStatus.UpToDate" :src="props.iconUrl">
  <component v-else :is="icon" :style="'color: ' + color"/>
</template>
