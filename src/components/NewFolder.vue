<template>
    <div class="new_folder" @mousedown="handleClick">
        <span v-if="!isEditing" @click="startEditing">Nouveau Dossier</span>
        <span v-else>
            <input class="input_folder" type="text" ref="folderInput" v-model="folderName"
                :class="{ 'folder-exists': folderExists, 'shake-animation': folderExists }" @blur="cancelEdit"
                @keyup.enter="createFolder" />
            <div v-if="folderExists" class="error-message">Folder already exists</div>
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useFoldersStore } from "@/stores/folders";

const isEditing = ref(false);
const folderName = ref('');
const folderInput = ref<HTMLInputElement | null>(null);
const folderExists = ref(false);

const store = useFoldersStore();

const startEditing = async () => {
    isEditing.value = true;
    folderExists.value = false;
    await nextTick();
    folderInput.value?.focus();
};

const handleClick = (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    const isInsideInput = clickedElement.tagName === 'INPUT';

    if (!isInsideInput && isEditing.value) {
        folderName.value = '';
        isEditing.value = false;
        folderExists.value = false;
    }
};

const cancelEdit = () => {
    if (isEditing.value && !folderName.value.trim()) {
        isEditing.value = false;
        folderExists.value = false;
    }
};

const createFolder = () => {
    const foldersName = ref(store.getFoldersName);
    if (folderName.value.trim() !== '') {
        if (!foldersName.value.includes(folderName.value)) {
            store.createFolder(folderName.value);
            folderName.value = '';
            isEditing.value = false;
            folderExists.value = false;
        } else {
            folderExists.value = true;
        }
    }
};
</script>

<style scoped>
.new_folder {
    cursor: pointer;
    padding-left: 10px;
    background-color: rgb(175, 188, 255);
    transition-duration: 1s;
    color: black;
}

.new_folder:hover{
    background-color: rgb(135, 155, 255);
}

.folder-exists {
    border: 1px solid red;
}

.shake-animation {
    animation: shake 0.5s;
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

.error-message {
    color: rgb(110, 8, 8);
    font-size: 12px;
    font-weight: bolder;
    margin-top: 5px;
}

.input_folder{
    width:95%;
}
</style>
