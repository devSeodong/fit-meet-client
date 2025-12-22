<template>
  <div class="min-h-screen pb-20">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 gap-8 items-start">
        <CompletedVideos />
        <RecommendVideos />
        <AllVideos />
      </div>
    </div>
  </div>
  <!-- <NavBar /> -->
  <GoToTopBtn />
</template>

<script setup>
import RecommendVideos from "./RecommendVideos.vue";
import CompletedVideos from "./CompletedVideos.vue";
import AllVideos from "./AllVideos.vue";
import NavBar from "../community/NavBar.vue";
import GoToTopBtn from "../common/GoToTopBtn.vue";
</script>
