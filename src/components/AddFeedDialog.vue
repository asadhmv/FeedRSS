<template>
    <dialog ref="dialogRef" :class="{ 'shake-animation': shakeDialog, 'error-border': showErrorBorder }">
        <button type="button" class="btn-close" @click="closeModal">
            X
        </button>
        <form method="dialog" @submit.prevent="handleSubmit">
            <input v-model="rssURLInputValue" type="text" class="rss_url" placeholder="Enter the RSS URL"
                   :class="{ 'error-input': showErrorInput }" />
            <div> -> </div>
            <select v-model="folderSelectValue" :class="{ 'error-input': showErrorFolder }">
                <option :value="null" disabled selected>Choose a folder</option>
                <option v-for="folder in folders.sort((a, b) => a.name.localeCompare(b.name))" :value="folder.id">{{ folder.name }}</option>
            </select>
            <input type="submit" class="add_button" value="Add">
        </form>
      <div v-show="showErrorInput" class="error-message">URL cannot be empty</div>
      <div v-show="showErrorFeed" class="error-message">Feed already exists in a folder</div>
      <div v-show="showErrorFolder" class="error-message">Please choose a folder</div>

    </dialog>
</template>
  
<script setup lang="ts">
import {computed, ref} from 'vue';
import { useFeedsStore } from "@/stores/feeds";
import { useFoldersStore } from '@/stores/folders';
import type {Feed} from "@/types/custom.d";

const foldersStore = useFoldersStore();
const folders = foldersStore.getFolders;

const feedsStore = useFeedsStore();
const dialogRef = ref(null);
const rssURLInputValue = ref('');
const folderSelectValue = ref(null);
const showErrorInput = ref(false);
const showErrorFolder = ref(false);
const showErrorBorder = ref(false);
const shakeDialog = ref(false);
const showErrorFeed = ref(false);

const showModal = () => {
    if (dialogRef.value) {
        dialogRef.value.showModal();
    }
};

const closeModal = () => {
    if (dialogRef.value) {
        dialogRef.value.close();
        shakeDialog.value = false;
        showErrorBorder.value = false;
        showErrorInput.value = false;
        showErrorFolder.value = false;
        showErrorFeed.value = false;
    }
};

const handleSubmit = async () => {
    showErrorInput.value = false;
    showErrorFolder.value = false;
    showErrorBorder.value = false;
    shakeDialog.value = false;

    if (rssURLInputValue.value.trim() === '') {
        showErrorInput.value = true;
        showErrorBorder.value = true;
        shakeDialog.value = true;
        return;
    }

    if (folderSelectValue.value === null) {
        showErrorFolder.value = true;
        showErrorBorder.value = true;
        shakeDialog.value = true;
        return;
    }


    let urlExists = feedsStore.getFeeds.find((feed) => feed.url === rssURLInputValue.value);

    if (urlExists) {
        console.log('feed already exists in a folder');
        showErrorFeed.value = true;
        return;
    }

    closeModal();

    let newFeed = await addFeed();
    let folderId = folderSelectValue.value

    if (folderId) {
        foldersStore.addFeedToFolder(folderId, newFeed.id);
    }

    rssURLInputValue.value = '';
};

const addFeed = async (): Promise<Feed> => {
    return await feedsStore.addFeed({
        url: rssURLInputValue.value,
        title: "Loading...",
    });
};

defineExpose({
    showModal,
    closeModal,
    inputValue: rssURLInputValue,
});
</script>
  
<style scoped>
dialog {
    position: absolute;
    margin: auto auto;
    background-color: cornflowerblue;
    padding: 16px;
    border-radius: var(--radius-medium);
    border-style: none;
    overflow: hidden;
    box-shadow: 8px 8px 4px rgba(0, 0, 0, 0.5);
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.35);
}

form {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

select {
  background-color: white;
  border: none;
  padding: 6px;
  border-radius: var(--radius-medium);
}

.rss_url {
    width: 35vw;
    height: 30px;
    padding: 10px;
    border-radius: var(--radius-medium);
    border-style: none;
    font-size: 15px;
}

.btn-close {
    width: 40px;
    height: 40px;
    color: white;
    background-color: var(--blue);
    cursor: pointer;
    border-radius: 50%;
    border: none;
}

.btn-close:hover {
    background-color: var(--blue-accent);
}

.add_button {
    width: 5vw;
    height: 30px;
    margin-left: 10px;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    color: white;
    background-color: var(--blue);
}

.add_button:hover {
    background-color: var(--blue-accent);
}

.shake-animation {
    animation: shake 0.5s;
}

.error-input {
    border-color: red;
}

.error-border {
    border: 1px solid red;
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25%,
    75% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }
}
</style>
  