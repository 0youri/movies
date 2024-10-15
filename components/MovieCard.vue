<template>
  <!-- Lien vers la page de détails du film -->
  <NuxtLink :to="{ name:'movie-id', params: { id: movie.id } }" class="movie-card block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
    <div class="relative">
      <!-- Poster du film -->
      <!-- Affichage de l'image du poster du film via l'URL générée par getImageUrl -->
      <img :src="getImageUrl(movie.poster_path)" alt="Movie poster" class="w-full h-auto" />
      
      <!-- Score circulaire en bas à gauche du poster -->
      <div class="absolute bottom-2 left-2">
        <div class="relative flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
          <svg class="w-full h-full">
            <!-- Cercle de fond gris indiquant le score maximum -->
            <circle
              class="text-gray-300"
              stroke-width="3"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
            <!-- Cercle dynamique indiquant le score réel du film -->
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
          <!-- Affichage du score numérique au centre du cercle -->
          <span class="absolute text-xs font-bold text-white">{{ Math.round(movie.vote_average * 10) }}%</span>
        </div>
      </div>
    </div>

    <!-- Informations du film -->
    <div class="p-4">
      <!-- Affichage du titre du film -->
      <p class="font-bold text-lg">{{ movie.title }}</p>
      <!-- Date de sortie formatée en utilisant toLocaleDateString -->
      <p class="text-gray-500">{{ new Date(movie.release_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
    </div>
  </NuxtLink>
</template>
  
<script setup lang="ts">
  import { defineProps } from 'vue';
  
  // Définition des props du composant, ici l'objet movie
  const props = defineProps({
    movie: {
      type: Object,
      required: true, // Le film doit être fourni au composant
    },
  });

  // Calcul de la circonférence pour le cercle SVG qui représente le score
  const circumference = computed(() => {
    const radius = 16; // Rayon du cercle (20 dans le SVG)
    return 2 * Math.PI * radius; // Formule de la circonférence d'un cercle
  })

  // Fonction utilitaire pour générer l'URL complète de l'image du poster du film
  function getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
</script>
  
<style scoped>
  /* Rotation du SVG pour que l'animation commence en haut */
  svg {
    transform: rotate(-90deg);
  }
</style>