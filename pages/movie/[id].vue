<template>
  <!-- Affichage des détails du film si disponibles -->
  <div v-if="movie" class="p-8 bg-gray-900 text-white min-h-screen">
    <div class="flex flex-col lg:flex-row lg:space-x-12">
      <!-- Poster à gauche, avec animation au survol -->
      <!-- getImageUrl génère l'URL complète pour l'image du poster -->
      <img :src="getImageUrl(movie.poster_path)" 
           alt="Movie poster" 
           class="w-full lg:w-1/4 h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" />
      
      <!-- Détails du film à droite du poster -->
      <div class="mt-6 lg:mt-0 lg:flex-1">
        <!-- Affichage du titre et de l'année de sortie -->
        <h2 class="text-4xl font-bold">{{ movie.title }} <span class="text-gray-400 text-xl">({{ movie.release_date.split('-')[0] }})</span></h2>
        
        <!-- Affichage du score sous forme de cercle SVG -->
        <div class="mt-4 flex items-center">
          <div class="relative flex items-center justify-center w-16 h-16">
            <!-- Cercle de fond gris représentant le score maximum -->
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
              <!-- Cercle dynamique représentant le score du film -->
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
            <!-- Score numérique affiché au centre du cercle -->
            <span class="absolute text-lg font-bold text-white">{{ Math.round(movie.vote_average * 10) }}%</span>
          </div>
          <!-- Affichage du nombre total de votes -->
          <span class="ml-4 text-gray-400">{{ movie.vote_count }} votes</span>
        </div>

        <!-- Slogan du film (ou un texte par défaut si non disponible) -->
        <p v-if="movie.tagline" class="mt-6 italic text-lg text-gray-300">{{ movie.tagline }}</p>

        <!-- Affichage du résumé du film -->
        <h3 class="mt-8 text-2xl font-bold">Synopsis</h3>
        <p class="mt-2 text-gray-300">{{ movie.overview }}</p>

        <!-- Informations supplémentaires : réalisateur, stars, catégories -->
        <div class="mt-8">
          <h3 class="text-2xl font-bold">Informations supplémentaires</h3>
          <p><strong>Réalisateur :</strong> {{ director }}</p>
          <p><strong>Stars :</strong> {{ cast.join(', ') }}</p>
          <p><strong>Catégories :</strong> {{ genres.join(', ') }}</p>
        </div>
      </div>
    </div>

    <!-- Section Commentaires sous les détails du film -->
    <div class="mt-16">
      <h3 class="text-2xl font-bold">Commentaires</h3>
      <!-- Composant CommentForm pour gérer l'ajout et l'affichage des commentaires -->
      <CommentForm />
    </div>
  </div>

  <!-- Skeletons affichés pendant le chargement -->
  <div v-else class="p-8 bg-gray-900 text-white min-h-screen">
    <div class="flex flex-col lg:flex-row lg:space-x-12">
      <!-- Skeleton pour le poster du film (chargement) -->
      <div class="w-full lg:w-1/4 h-96 bg-gray-700 animate-pulse rounded-lg"></div>

      <!-- Skeleton pour les détails du film (chargement) -->
      <div class="mt-6 lg:mt-0 lg:flex-1 space-y-4">
        <!-- Skeleton pour le titre du film -->
        <div class="h-8 w-1/2 bg-gray-700 animate-pulse rounded"></div>

        <!-- Skeleton pour le score et les votes -->
        <div class="flex items-center mt-4 space-x-4">
          <div class="w-16 h-16 bg-gray-700 animate-pulse rounded-full"></div>
          <div class="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
        </div>

        <!-- Skeleton pour le slogan -->
        <div class="h-6 w-3/4 bg-gray-700 animate-pulse rounded mt-6"></div>

        <!-- Skeleton pour le résumé du film -->
        <div class="space-y-2">
          <div class="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
          <div class="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
          <div class="h-4 w-3/4 bg-gray-700 animate-pulse rounded"></div>
        </div>

        <!-- Skeleton pour les informations supplémentaires -->
        <div class="mt-8 space-y-2">
          <div class="h-4 w-1/3 bg-gray-700 animate-pulse rounded"></div>
          <div class="h-4 w-2/3 bg-gray-700 animate-pulse rounded"></div>
          <div class="h-4 w-1/2 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMovieStore } from '~/stores/movie' // Importation du store de films via Pinia

// Récupération des actions et données du store
const { getMovieDetails, getMovieCast } = useMovieStore() 
const { movie, cast, director } = storeToRefs(useMovieStore()) // Utilisation de storeToRefs pour rendre les données réactives

// Utilisation des paramètres de la route pour récupérer l'ID du film
const route = useRoute()

// Calcul des genres du film en tant que tableau de chaînes de caractères
const genres = computed(() => {
  return movie.value.genres.map((member: { name: string; }) => member.name)
})

// Calcul de la circonférence du cercle SVG pour le score (rayon fixe de 28)
const circumference = computed(() => {
  const radius = 28;
  return 2 * Math.PI * radius;
})

// Une fois le composant monté, récupération des détails et du casting du film via l'ID de la route
onMounted(async () => {
  const idMovie = Number(route.params.id)
  getMovieDetails(idMovie)
  getMovieCast(idMovie)
})

// Fonction utilitaire pour générer l'URL des images de poster
function getImageUrl(path: string) {
  return `https://image.tmdb.org/t/p/w500${path}`;
}
</script>

<style scoped>
  /* Rotation du SVG pour faire démarrer le cercle en haut */
  svg {
    transform: rotate(-90deg);
  }
</style>