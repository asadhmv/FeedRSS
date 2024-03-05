<template>
    <li>
        <div>
            <div class="info_category">
                <img :src="imagesrc" alt="Icone du feed" style="width: 30px; height: 30px;">
                <h3>{{ category.name }}</h3>
            </div>
            <div class="img_feed">
                <img :src="category.img" alt="icone catégorie" style="width: 105%; height: 100px; object-fit:cover;">
            </div>
            <p>{{ category.description }}</p>
        </div>
    </li>
</template>

<script setup lang="ts">
defineProps(['category', 'imagesrc']);
</script>

<style scoped>
li {
    display: flex;
}

.info_category {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}

.info_category img {
    margin-right: 10px;
}

.img_feed{
    display: flex;
    justify-content: center;
    margin: 10px;
}
</style>