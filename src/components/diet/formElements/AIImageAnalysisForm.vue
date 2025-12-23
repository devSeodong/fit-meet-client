<template>
  <div class="flex flex-col gap-6">
    <div
      class="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all"
      :class="{
        'border-[#8A8F6E] bg-olive-50': isUploading || formData.imageUrl,
      }"
    >
      <label
        v-if="!formData.imageUrl && !isUploading"
        class="cursor-pointer flex flex-col items-center"
      >
        <PhotoIcon
          class="w-12 h-12 text-gray-400 group-hover:text-[#8A8F6E] transition-colors"
        />
        <span class="mt-2 text-sm font-medium text-gray-500"
          >사진을 업로드하여 AI 분석 시작</span
        >
        <input
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleFileUpload"
        />
      </label>

      <div v-if="isUploading" class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A8F6E]"
        ></div>
        <p class="mt-4 text-sm font-bold text-[#8A8F6E] animate-pulse">
          AI가 식단을 정밀 분석 중입니다...
        </p>
      </div>

      <template v-if="formData.imageUrl && !isUploading">
        <img :src="formData.imageUrl" class="w-full h-full object-cover" />
        <button
          @click="resetImage"
          class="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </template>
    </div>

    <Transition name="fade">
      <div v-if="matchedItems.length > 0 && !isUploading" class="space-y-4">
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
            <SparklesIcon class="w-4 h-4 text-amber-400" /> AI 분석 결과 (항목을
            선택해 주세요)
          </h4>
        </div>
        <AIAnalysisResultItem
          v-for="(item, idx) in matchedItems"
          :key="idx"
          :item="item"
          @add-food="handleFoodAdded"
        />
      </div>

      <div
        v-else-if="
          formData.imageUrl && !isUploading && matchedItems.length === 0
        "
        class="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200"
      >
        <p class="text-gray-500 mb-4">분석된 음식 정보가 없습니다.</p>
        <router-link
          to="/diet/form/manual"
          class="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
        >
          직접 입력하러 가기
        </router-link>
      </div>
    </Transition>

    <div
      v-if="formData.foods.length > 0"
      class="space-y-2 pt-4 border-t border-gray-100"
    >
      <h4 class="text-xs font-bold text-gray-400 uppercase ml-1">
        현재 추가된 식단
      </h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(food, index) in formData.foods"
          :key="index"
          class="flex items-center gap-2 px-3 py-1.5 bg-[#8A8F6E] text-white rounded-full text-sm shadow-sm"
        >
          <span class="font-medium">{{ food.foodNmKr }}</span>
          <span class="opacity-80 text-xs">{{ food.intakeGram }}g</span>
          <XMarkIcon
            class="w-4 h-4 cursor-pointer hover:text-red-200"
            @click="removeFood(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useDietStore } from "@/stores/Diet";
import { PhotoIcon, XMarkIcon, SparklesIcon } from "@heroicons/vue/24/solid";
import AIAnalysisResultItem from "./AIAnalysisResultItem.vue"; // 위에서 만든 컴포넌트

const props = defineProps(["formData", "mode"]);
const emit = defineEmits(["update:form-data"]);

const dietStore = useDietStore();
const isUploading = ref(false);
const matchedItems = ref([]);

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  matchedItems.value = [];

  try {
    const presign = await dietStore.getPresignedUrl(file.name);
    await axios.put(presign.uploadUrl, file, {
      headers: { "Content-Type": file.type || "image/jpeg" },
    });

    // 1. 부모의 formData.imageUrl 업데이트 (스캔용 이미지 저장)
    emit("update:form-data", {
      ...props.formData,
      imageUrl: presign.publicUrl,
    });

    // 2. AI 분석 요청
    const response = await dietStore.analyzeImage(presign.publicUrl);
    matchedItems.value = response.matchedItems || [];
  } catch (error) {
    console.error(error);
    alert("이미지 분석 실패");
  } finally {
    isUploading.value = false;
  }
}

async function handleFoodAdded(selection) {
  try {
    const requestArray = [
      {
        foodCode: selection.foodCode,
        foodNmKr: selection.foodNmKr,
        intakeGram: selection.intakeGram,
        sourceType: "IMAGE",
      },
    ];

    const responseData = await dietStore.fetchDietNutrition(requestArray);

    if (responseData && responseData.foods) {
      const updatedFoods = [...props.formData.foods, responseData.foods[0]];
      emit("update:form-data", { ...props.formData, foods: updatedFoods });
    }
  } catch (error) {
    alert("영양 정보 조회 실패");
  }
}

function removeFood(index) {
  const updatedFoods = props.formData.foods.filter((_, i) => i !== index);
  emit("update:form-data", { ...props.formData, foods: updatedFoods });
}

function resetImage() {
  matchedItems.value = [];
  emit("update:form-data", { ...props.formData, imageUrl: "", foods: [] });
}
</script>
