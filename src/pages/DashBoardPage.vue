<template>
  <div class="min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <AlertFillBodyInfo v-if="!authStore.userInfo.bodyInfoVal" class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:items-start">
        <div class="lg:col-span-7 grid grid-cols-1 gap-6">
          <TodayNutritions class="h-62" />

          <TotalScores class="h-112" />

          <!-- <DietCalender /> -->
        </div>

        <div class="lg:col-span-3 grid grid-cols-1 gap-6">
          <AiAnalysisCard @analysis-complete="openAiModal" class="" />

          <AiAnalysisModal
            v-if="aiModalData"
            :is-visible="isAiModalOpen"
            :data="aiModalData"
            @close="isAiModalOpen = false"
          />

          <MyStreak class="" />
        </div>
      </div>

      <!-- 작성버튼 -->
      <button
        @click="isOptionModalVisible = true"
        class="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#8A8F6E] text-white shadow-xl hover:bg-[#6e7256] transition z-40 cursor-pointer"
      >
        <PlusIcon class="w-8 h-8 mx-auto" />
      </button>
      <CreateDietFormOptionModal
        :is-visible="isOptionModalVisible"
        @update:isVisible="isOptionModalVisible = $event"
        @selectOption="handleSelectOption"
      />
    </div>
  </div>
</template>

<script setup>
import AiAnalysisCard from "@/components/dashboard/AiAnalysisCard.vue";
import AlertFillBodyInfo from "@/components/dashboard/AlertFillBodyInfo.vue";
import DietCalender from "@/components/dashboard/calender/DietCalender.vue";
import MyStreak from "@/components/dashboard/MyStreak.vue";
import TodayNutritions from "@/components/dashboard/nutrition/TodayNutritions.vue";
import TotalScores from "@/components/dashboard/score/TotalScores.vue";
import CreateDietFormOptionModal from "@/components/diet/CreateDietFormOptionModal.vue";
import { PlusIcon } from "@heroicons/vue/24/outline";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/Auth";
import AiAnalysisModal from "@/components/dashboard/AiAnalysisModal.vue";

const router = useRouter();

const authStore = useAuthStore();
const isOptionModalVisible = ref(false);

const handleSelectOption = (option) => {
  let methodParam;

  if (option === "manual") {
    // URL: /diet/form/manual
    methodParam = "manual";
  } else if (option === "public-api") {
    // URL: /diet/form/public-api
    methodParam = "public-api";
  } else if (option === "image") {
    // URL: /diet/form/image
    methodParam = "image";
  } else {
    return;
  }
  router.push({
    name: "dietForm",
    params: {
      method: methodParam,
    },
  });
};

const isAiModalOpen = ref(false);
const aiModalData = ref(null);

const openAiModal = (data) => {
  aiModalData.value = data;
  isAiModalOpen.value = true;
};
</script>
