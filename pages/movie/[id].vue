<template>
  <div v-if="movie" class="p-8 bg-gray-900 text-white min-h-screen">
    <div class="flex flex-col lg:flex-row lg:space-x-12">
      <!-- Poster à gauche, avec animation au survol -->
      <img :src="getImageUrl(movie.poster_path)" 
           alt="Movie poster" 
           class="w-full lg:w-1/4 h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" />
      
      <!-- Détails à droite -->
      <div class="mt-6 lg:mt-0 lg:flex-1">
        <h2 class="text-4xl font-bold">{{ movie.title }} <span class="text-gray-400 text-xl">({{ movie.release_date.split('-')[0] }})</span></h2>
        
        <!-- Score circulaire -->
        <div class="mt-4 flex items-center">
          <div class="relative flex items-center justify-center w-16 h-16">
            <!-- Cercle SVG -->
            <svg class="w-full h-full">
              <circle
                class="text-gray-300"
                stroke-width="4"
                stroke="currentColor"
                fill="transparent"
                r="28"
                cx="32"
                cy="32"
              />
              <circle
                class="text-green-500"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (movie.vote_average * 10 / 100) * circumference"
                stroke="currentColor"
                fill="transparent"
                r="28"
                cx="32"
                cy="32"
              />
            </svg>
            <!-- Score au centre -->
            <span class="absolute text-lg font-bold text-white">{{ Math.round(movie.vote_average * 10) }}%</span>
          </div>
          <span class="ml-4 text-gray-400">{{ movie.vote_count }} votes</span>
        </div>

        <p class="mt-6 italic text-lg text-gray-300">{{ movie.tagline || "Aucun slogan disponible." }}</p>

        <h3 class="mt-8 text-2xl font-bold">Overview</h3>
        <p class="mt-2 text-gray-300">{{ movie.overview }}</p>

        <div class="mt-8">
          <h3 class="text-2xl font-bold">Informations supplémentaires</h3>
          <p><strong>Réalisateur :</strong> {{ director }}</p>
          <p><strong>Stars :</strong> {{ cast.join(', ') }}</p>
          <p><strong>Catégories :</strong> {{ genres.join(', ') }}</p>
        </div>
      </div>
    </div>

    <!-- Section Commentaires sous les détails et l'image -->
    <div class="mt-16">
      <h3 class="text-2xl font-bold">Commentaires</h3>
      <!-- <CommentForm /> -->
    </div>
  </div>

  <div v-else class="text-center p-8">
    <p>Chargement...</p>
  </div>
</template>

<script setup lang="ts">
  import { useMovieStore } from '~/stores/movie'

  const { getMovieDetails, getMovieCast } = useMovieStore()
  const { movie, cast, director } = storeToRefs(useMovieStore())

  const route = useRoute()

  const genres = computed(() => {
    return movie.value.genres.map((member: { name: string; }) => member.name)
  })

  const circumference = computed(() => {
    const radius = 28;
    return 2 * Math.PI * radius;
  })

  onMounted(async () => {
    const idMovie = Number(route.params.id)
    getMovieDetails(idMovie)
    getMovieCast(idMovie)
  })

  function getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
</script>

<style scoped>
  svg {
    transform: rotate(-90deg); /* Pour faire commencer le cercle en haut */
  }
</style>