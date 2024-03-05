<template>
  <div class="btn" @click="openFilter = true">
        <div class="center">
            <IconFilter class="icon"/>
            <span class="text">Filter</span>
        </div>
  </div>

  <Teleport to="body">
    <div v-if="openFilter" class="modal">
      <form @submit.prevent="handleSubmit">
        <label for="filterName">Ajouter un nouveau filtre: </label>
        <input v-model="filterName" id="filterName">
        <!--
          <label for="firstSelect">Select Category:</label>
        -->
        <select v-model="selectedAppliedOn" id="firstSelect">
          <option v-for="index in getOnlyIndicesFromEnum(FilterOn)" :key="index" :value="index">{{ frenchTranslation.FilterOn.get(index) }}</option>
        </select>

        <!--
          <label for="secondSelect">Select Subcategory:</label>
        -->
        <select v-model="selectedFilterCondition" id="secondSelect">
          <option v-for="index in getOnlyIndicesFromEnum(FilterCondition)" :key="index" :value="index">{{ frenchTranslation.FilterCondition.get(index) }}</option>
        </select>

        <input v-model="value" id ="value">

        <select v-model="selectedAction" id="thirdSelect">
          <option v-for="index in getOnlyIndicesFromEnum(FilterAction)" :key="index" :value="index">{{ frenchTranslation.FilterAction.get(index) }}</option>
        </select>

        <button @click="filtersStore.addFilter({
        name: filterName,
        applied_on: selectedAppliedOn,
        when: selectedFilterCondition,
        when_data: value,
        action: selectedAction}
        );
        openFilter = false" class="btn">Appliquer</button>
        <button @click="openFilter = false">Fermer</button>

      </form>
    </div>
  </Teleport>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import IconFilter from "@/components/icons/IconFilter.vue";
import {useFiltersStore} from "@/stores/filters";
import {FilterAction, FilterCondition, FilterOn} from "@/types/custom.d";

const openFilter = ref(false);

const filtersStore = useFiltersStore();

const filterName =  ref("");
const value = ref("");
const selectedAppliedOn = ref(0);
const selectedFilterCondition = ref(0);
const selectedAction = ref(0);

function handleSubmit(e: any) {
  e.preventDefault();
}

const frenchTranslation = {
  "FilterOn" : new Map<number, string>([
    [0, "Titre"],
    [1, "Description"],
    [2, "Lien"],
    [3, "Date"]
  ]),

  "FilterCondition": new Map<number, string>([
    [0, "Egale"],
    [1, "Contient"],
    [2, "Commence par"],
    [3, "Finit par"]
  ]),

  "FilterAction": new Map<number, string>([
    [0, "Supprimer"],
    [1, "Marquer lu"]
  ])
}

function getOnlyIndicesFromEnum(myEnum: any) {
  return Object.values<number>(myEnum).filter(x => typeof x === "number");
}

</script>

<style scoped>
  .btn {
    padding: 8px 16px;
    border: 2px solid var(--blue-accent);
    cursor: pointer;
    background-color: var(--blue);
    color: white;
    border-radius: var(--radius-medium);
    margin-left: 5%;
    margin-right: 5%;
  }

  .center {
    align-items: center;
    display: flex;
    width: min-content;
    margin: auto;
  }

  .btn:hover {
    background-color: var(--blue-accent);
  }

  .text {
    padding-left: 8px;
  }

  .modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  padding: 40px;
  background-color: white;
}

p {
    color: black;
}

input, button, select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

form {
  display: grid;
  grid-auto-rows: auto;
}
</style>