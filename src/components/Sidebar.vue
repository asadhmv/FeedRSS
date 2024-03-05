<template>
  <aside>
    <SidebarButtonRefresh class="refresh-button" @click='async () => {await store.refreshFeeds()}' />


    <Explore />
    <div class="folders">
      <NewFolder />
      <AllFeeds />
      <Folder v-for="folderName in foldersName.sort()" :folderName="folderName" />
    </div>
    <div class="feeds">
    </div>

    <Dialog ref="dialogComponent"></Dialog>
    <SideBarButtonAddFeed class="add-feed-button" @click="openDialog" v-if="foldersStore.getFolders.length > 0" />
    <SideBarButtonFilter class="filter-button" v-if="foldersStore.getFolders.length > 0"  />

  </aside>
</template>



<script setup lang="ts">
import SidebarButtonRefresh from "@/components/SidebarButtonRefresh.vue";
import { useFeedsStore } from "@/stores/feeds";
import { useFoldersStore } from "@/stores/folders";
import { computed, ref } from "vue";
import SideBarButtonAddFeed from "@/components/SideBarButtonAddFeed.vue";
import Dialog from "@/components/AddFeedDialog.vue";
import NewFolder from "@/components/NewFolder.vue"
import Folder from "@/components/Folder.vue";
import Explore from "./Explore.vue";
import AllFeeds from "./AllFeeds.vue";
import SideBarButtonFilter from "./SideBarButtonFilter.vue";
//import Filter from "./Filter.vue";


const foldersStore = useFoldersStore();
const foldersName = computed(() => foldersStore.getFoldersName);
const store = useFeedsStore()


const dialogComponent = ref(null);

const openDialog = () => {
  if (dialogComponent.value)
    dialogComponent.value.showModal();
};

</script>



<style scoped>
aside {
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
  margin-bottom: 2vh;
}

.refresh-button {
  margin: 16px;
}

.feeds {
  margin-bottom: 16px;
}

.add-feed-button {
  margin: auto 16px 16px 16px;
}

.folders {
  overflow-x: hide;
}
</style>

