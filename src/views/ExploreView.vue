<template>
    <div class="explore-view">
        <div class="header_explore">
            <h1>Explorer</h1>
            <h2>Suivez vos sites Web préférés</h2>
        </div>
        <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="Recherche par sujet, site Web ou lien RSS" @input="search">
            <button class="search_button" @click="search">Rechercher</button>
        </div>

        <div class="explore-content">
            <ul class="categories">
                <Category v-for="category in filteredCategories" :key="category.id" :category="category"
                    :imagesrc="category.icon" />
            </ul>
        </div>

        <div class="rss-feeds" ref="rssFeeds">
            <h2>All feeds</h2>
            <ul>
                <li v-for="feed in visibleFeeds" :key="feed.id">
                    <a :href="feed.url" target="_blank">{{ feed.title }}</a>
                </li>
            </ul>
            <div v-if="loading" class="loading">Loading...</div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { topics } from "@/components/explore/topics";
import Category from '@/components/Category.vue';

const categories = topics;

const feeds = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const visibleFeeds = ref([]);
const itemsPerLoad = 10;

const search = () => {

};

const filteredCategories = computed(() => {
    return categories.filter(category => {
        const lowerCaseQuery = searchQuery.value.toLowerCase();

        return (
            category.name.toLowerCase().includes(lowerCaseQuery) ||
            category.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))
        );
    });
});


const loadMoreFeeds = () => {
    const startIndex = visibleFeeds.value.length;
    const endIndex = startIndex + itemsPerLoad;
    visibleFeeds.value = [...visibleFeeds.value, ...feeds.value.slice(startIndex, endIndex)];
    loading.value = false;
    if (endIndex >= feeds.value.length) {
        console.log(visibleFeeds.value);
        loading.value = false;
    }
};

const handleScroll = () => {
  const exploreView = document.querySelector('.explore-view') as Element;
  const bottomOfWindow = Math.abs(exploreView.scrollHeight - exploreView.scrollTop - exploreView.clientHeight) < 1;

  if (bottomOfWindow && !loading.value) {
      loading.value = true;
      loadMoreFeeds();
  }
};

onMounted(() => {
  const exploreView = document.querySelector('.explore-view') as Element;

  exploreView.addEventListener('scroll', handleScroll);
    import('@/components/pressefrancaise.json')
        .then(response => {
            feeds.value = response.default;
            loadMoreFeeds();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des feeds :', error);
        });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.explore-view {
    padding: 20px;
}

.header_explore {
    text-justify: center;
    text-align: center;
}

.search-bar {
    margin-top: 5vh;
    margin-bottom: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-bar input {
    padding: 8px;
    font-size: 16px;
    width: 80%;
}

.search-bar button {
    padding: 8px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
}

.search-bar button:hover {
    background-color: #45a049;
}

.explore-content ul {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.explore-content li {
    flex: 0 0 calc(32%);
    /*padding: 10px;*/
    margin-top: 0px;
    margin-bottom: 0px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.3s;
}


.explore-content ul,
.rss-feeds ul {
    list-style-type: none;
    padding: 0;
}

.explore-content li,
.rss-feeds li {
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.3s;
}

.explore-content li:hover,
.rss-feeds li:hover {
    background-color: #e3e3e3;
}

.loading {
    margin-top: 10px;
    text-align: center;
}

.rss-feeds h2{
    text-align: center;
    margin: 5vh 5vh;
}

.search_button{
    margin-left: 20px;
}
</style>