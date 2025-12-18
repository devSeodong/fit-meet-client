<template>
  <div v-for="diet in diets" @click="$emit('select-diet', diet.id)">
    {{ diet.mealType }} - {{ diet.description }}
  </div>
</template>
<script setup>
import { useDietStore } from '@/stores/Diet';

const props = defineProps({ date: String });
const dietStore = useDietStore();

const diets = computed(() => dietStore.getDietByDate(props.date));
</script>
