<template>
  <NuxtLink :to="`/movie/${movie.id}`" class="movie-card block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
    <div class="relative">
      <!-- Poster du film -->
      <img :src="getImageUrl(movie.poster_path)" alt="Movie poster" class="w-full h-auto" />
      
      <!-- Score circulaire en bas à gauche du poster -->
      <div class="absolute bottom-2 left-2">
        <div class="relative flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
          <svg class="w-full h-full">
            <circle
              class="text-gray-300"
              stroke-width="3"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
            <circle
              class="text-green-500"
              stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (movie.vote_average * 10 / 100) * circumference"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
          </svg>
          <span class="absolute text-xs font-bold text-white">{{ Math.round(movie.vote_average * 10) }}%</span>
        </div>
      </div>
    </div>

    <!-- Informations du film -->
    <div class="p-4">
      <p class="font-bold text-lg">{{ movie.title }}</p>
      <p class="text-gray-500">{{ new Date(movie.release_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
    </div>
  </NuxtLink>
</template>
  
<script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps({
    movie: {
      type: Object,
      required: true,
    },
  });

  const circumference = computed(() => {
    const radius = 16;
    return 2 * Math.PI * radius;
  })


  function getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
</script>
  
<style scoped>
  svg {
    transform: rotate(-90deg); /* Rotation pour commencer en haut */
  }
</style>