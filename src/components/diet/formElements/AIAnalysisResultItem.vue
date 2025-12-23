<template>
  <div
    class="border border-amber-100 rounded-xl overflow-hidden bg-white mb-4 shadow-sm"
  >
    <div
      class="p-3 bg-amber-50/50 border-b border-amber-100 flex items-center gap-2"
    >
      <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
      <span class="text-xs font-bold text-amber-700"
        >AI 인식: {{ item.uiName }}</span
      >
    </div>

    <div class="divide-y divide-gray-50">
      <div v-for="cand in item.candidates" :key="cand.foodCode" class="p-3">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">
              {{ cand.foodNmKr }}
            </p>
            <p class="text-[11px] text-gray-500">{{ cand.category }}</p>
          </div>

          <button
            v-if="selectedFoodCode !== cand.foodCode"
            @click="selectCandidate(cand)"
            class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold hover:bg-amber-200 transition"
          >
            선택
          </button>
        </div>

        <Transition name="slide-up">
          <div
            v-if="selectedFoodCode === cand.foodCode"
            class="mt-3 p-3 bg-gray-50 rounded-lg flex items-end gap-3 border border-gray-100"
          >
            <div class="flex-1">
              <label class="text-[10px] font-bold text-gray-400 block mb-1"
                >섭취량 입력(g)</label
              >
              <input
                type="number"
                v-model.number="intake"
                class="w-full p-2 bg-white border border-gray-200 rounded text-sm outline-none focus:border-[#8A8F6E]"
                placeholder="100"
              />
            </div>
            <div class="flex gap-1">
              <button
                @click="selectedFoodCode = null"
                class="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
              <button
                @click="confirmAdd"
                :disabled="isProcessing"
                class="px-4 py-2 bg-[#8A8F6E] text-white rounded text-sm font-bold disabled:bg-gray-300"
              >
                {{ isProcessing ? "..." : "확인" }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["item"]);
const emit = defineEmits(["add-food"]);

const selectedFoodCode = ref(null);
const selectedCandidate = ref(null);
const intake = ref(100);
const isProcessing = ref(false);

const selectCandidate = (cand) => {
  selectedFoodCode.value = cand.foodCode;
  selectedCandidate.value = cand;
};

const confirmAdd = async () => {
  if (intake.value <= 0) return;
  isProcessing.value = true;

  // 부모에게 선택된 음식 정보와 입력한 그램 수 전달
  await emit("add-food", {
    foodCode: selectedCandidate.value.foodCode,
    foodNmKr: selectedCandidate.value.foodNmKr,
    intakeGram: intake.value,
    sourceType: "IMAGE",
  });

  isProcessing.value = false;
  selectedFoodCode.value = null;
};
</script>
