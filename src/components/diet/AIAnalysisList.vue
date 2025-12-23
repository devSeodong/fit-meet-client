<template>
  <div class="mt-12 border-t border-gray-100 pt-10">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="p-2 bg-amber-50 rounded-lg">
          <SparklesIcon class="w-5 h-5 text-amber-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-800">AI 식단 분석 리스트</h3>
      </div>
      <span class="text-sm text-gray-400 font-medium">
        총 {{ analysisList.length }}개의 보고서
      </span>
    </div>

    <div
      v-if="analysisList.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="(item, index) in analysisList"
        :key="item.id || index"
        @click="$emit('rowClick', item)"
        class="group cursor-pointer relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#8A8F6E] transition-all duration-300 overflow-hidden"
      >
        <button
          @click.stop="$emit('deleteClick', item.id)"
          class="absolute top-4 right-4 z-20 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="삭제"
        >
          <TrashIcon class="w-5 h-5" />
        </button>

        <div
          class="absolute -left-16 -bottom-39 text-gray-100/60 group-hover:text-olive-50 transition-colors -z-0"
        >
          <DocumentTextIcon class="w-60 h-60" />
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-4">
            <span
              class="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-md group-hover:bg-[#8A8F6E] group-hover:text-white transition-colors"
            >
              Weekly Report
            </span>
            <span class="text-gray-400 text-xs">
              {{ item.createdAt?.split("T")[0] || "날짜 정보 없음" }}
            </span>
          </div>

          <h4
            class="font-bold text-lg text-gray-800 mb-2 truncate group-hover:text-[#8A8F6E]"
          >
            {{ item.title || "주간 건강 분석 보고서" }}
          </h4>

          <p class="text-sm text-gray-500 line-clamp-2 mb-6 min-h-[40px]">
            {{ item.analysis?.summary }}
          </p>

          <div
            class="flex items-center justify-between pt-4 border-t border-gray-50"
          >
            <span class="text-xs font-bold text-[#8A8F6E]">보고서 보기</span>
            <ArrowRightIcon
              class="w-4 h-4 text-[#8A8F6E] transform group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100"
    >
      <DocumentMagnifyingGlassIcon
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-gray-400 font-medium">생성된 분석 보고서가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import {
  SparklesIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  DocumentMagnifyingGlassIcon,
  TrashIcon, // ✨ 추가
} from "@heroicons/vue/24/outline";

defineProps({
  analysisList: {
    type: Array,
    default: () => [],
  },
});

// ✨ deleteClick 추가
defineEmits(["rowClick", "deleteClick"]);
</script>
