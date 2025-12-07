<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">평소 활동량</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(name, key) in levels"
        :key="key"
        @click="select(key)"
        class="p-4 border rounded-lg text-center cursor-pointer transition hover:bg-blue-50"
        :class="
          model.activity_level === key ? 'bg-blue-600 text-white' : 'bg-white'
        "
      >
        {{ name }}
      </div>
    </div>
  </div>
</template>

<script setup>
const model = defineModel();

const levels = {
  NONE: '거의 없음',
  LOW: '적음',
  MID: '보통',
  HIGH: '많음',
};

const select = key => {
  model.activity_level = key;
};
</script>
