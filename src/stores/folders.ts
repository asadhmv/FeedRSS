import { defineStore } from "pinia";
import type { FeedId, Folder } from "@/types/custom.d";

interface State {
    folders: Folder[]
}

export const useFoldersStore = defineStore("folders", {
    state: (): State => {
        let initialFolders: Folder[] = JSON.parse(localStorage.getItem('folders') || '[]');
        return {
            folders: initialFolders,
        };
    },

    getters: {
        getFolders(): Folder[] {
            return this.folders;
        },
        getFoldersName(): string[] {
            return this.folders.map(folder => folder.name);
        },
        getByName: (state): (name: string) => (Folder | null) => {
            return (name: string): (Folder | null) => state.folders.find((folder) => folder.name === name) || null
        },
        isEmpty: (state) => {
            return (name: string): boolean | true => state.folders.find((folder) => folder.name === name)?.feeds.length === 0
        }

    },

    actions: {
        createFolder(name: string): void {
            const newFolder: Folder = {
                id: Date.now().toString(),
                name,
                feeds: [],
            };
            this.folders.push(newFolder);
            this.saveToLocalStorage();
            console.log('Nombre de dossiers :', this.getFolders.length);
        },

        deleteFolder(folderName: string): void {
            this.folders = this.folders.filter((folder) => folder.name !== folderName);
            this.saveToLocalStorage();
        },

        addFeedToFolder(folderId: string, feedId: FeedId): void {
            const folder = this.folders.find((folder) => folder.id === folderId);
            if (folder) {
                folder.feeds.push(feedId);
                this.saveToLocalStorage();
            }
        },

        removeFeedFromFolder(folderName: string, feedId: FeedId): void {
            const folder = this.folders.find((folder) => folder.name === folderName);
            if (folder) {
                folder.feeds = folder.feeds.filter((fId) => fId !== feedId);
                this.saveToLocalStorage();
                console.log('Voici les feeds du dossier', folder.name, ': ', folder.feeds);
            }
        },

        getIdByName(name: string): string | null {
            const nameFolder = this.folders.find((folder) => folder.name == name);
            if (nameFolder)
                return nameFolder.id;

            return null;
        },

        saveToLocalStorage(): void {
            localStorage.setItem("folders", JSON.stringify(this.folders));
        },
    },
});

