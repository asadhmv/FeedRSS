<template>
  <details @contextmenu.prevent="showContextMenu" class="folder">
    <summary>
      {{ folderName }}
      <span class="nb-notif">{{ currentFolder?.feeds.length }}</span>
    </summary>
    <div class="folder-content">
      <div>
        <SidebarItem v-for="feedId in currentFolder?.feeds"
                     :feed="feedsOfCurrentFolder.find((feed) => feed.id === feedId)"
                     :folderName="folderName" />
        <!--:folderName="folderName"-->
      </div>
    </div>
  </details>

  <div v-if="contextMenu.visible" class="context-menu"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }">
      <div @click="handleContextMenuOption('delete', folderName)">Delete folder</div>
      <div @click="handleContextMenuOption('read', folderName)">Mark as read</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SidebarItem from "@/components/SidebarItem.vue";
import { useFoldersStore } from "@/stores/folders";
import { useFeedsStore } from '@/stores/feeds';

interface Props {
  folderName: string;
}

let props = defineProps<Props>();


const foldersStore = useFoldersStore();
const feedsStore = useFeedsStore();

const currentFolder = foldersStore.getByName(props.folderName);
const feedsOfCurrentFolder = computed(() => feedsStore.getFeeds.filter(feed => currentFolder.feeds.includes(feed.id)));


const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
});

const showContextMenu = (event: { clientX: any; clientY: any; }) => {
    contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
    };
};

const closeContextMenu = () => {
    contextMenu.value = {
        visible: false,
        x: 0,
        y: 0,
    };
};

const handleContextMenuOption = (option: string, folderName: string) => {
    if (option === 'delete') {
        let feedsOfFolder = foldersStore.getByName(folderName)?.feeds;
        let flux: string;
        if (feedsOfFolder !== undefined) {
            for (flux in feedsOfFolder) {
                //console.log(feedsOfFolder[flux]);
                feedsStore.deleteFeed(feedsOfFolder[flux]);
            }
        }
        foldersStore.deleteFolder(folderName);
        console.log(foldersStore.getFolders);
    }
    else if (option === 'read') {
        console.log('folder ', folderName, ' marked as read');
    }
    closeContextMenu();
};

onMounted(() => {
    document.addEventListener('click', closeContextMenu);
});

</script>

<style scoped>
.folder {
    display: flex;
    margin: 5px;
    cursor: pointer;
}

.folder h4 {
    margin-left: 5px;
}

.folder-content {
    margin-left: 20px;
}

.nb-notif {
    float: right;
}

.context-menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    padding: 5px;
    z-index: 1000;
    cursor: pointer;
}
</style>
