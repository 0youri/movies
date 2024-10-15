<template>
  <!-- Conteneur principal avec fond sombre -->
  <div class="min-h-screen p-10 bg-gray-900 text-white">
    
    <!-- Champ de recherche pour filtrer les films -->
    <input
      v-model="searchQuery"
      @input="search"
      placeholder="Rechercher un film..."
      class="w-full p-2 mb-4 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    
    <!-- Grille d'affichage des films -->
    <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 mt-5">
      <!-- Affichage des skeletons pendant le chargement -->
      <!-- Si le chargement est en cours, afficher 12 placeholders sous forme de skeletons -->
      <div v-if="loading" v-for="n in 12" :key="n" class="animate-pulse bg-gray-700 h-72 rounded-lg"></div>
      
      <!-- Une fois le chargement terminé, afficher la liste des films -->
      <MovieCard v-else v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>

    <!-- Composant de chargement infini pour récupérer plus de films -->
    <InfiniteLoading @infinite="loadMoreMovies" />
  </div>
</template>

<script setup lang="ts">
  import InfiniteLoading from 'v3-infinite-loading' // Importation du composant pour le défilement infini
  import { useMovieStore } from '~/stores/movie' // Importation du store de films via Pinia

  // Déclaration des variables réactives
  const searchQuery = ref<string>('') // Requête de recherche de l'utilisateur
  const { getMovies, searchMovies } = useMovieStore() // Actions du store pour récupérer les films ou effectuer une recherche
  const { movies } = storeToRefs(useMovieStore()) // Liste réactive des films
  const page = ref<number>(1) // Compteur pour la pagination
  const loading = ref<boolean>(true) // Etat de chargement

  // Récupérer les films lors du montage du composant
  onMounted(async () => {
    await getMovies(page.value) // Charger la première page de films
    loading.value = false // Indiquer que le chargement est terminé
  })

  // Fonction pour charger plus de films lors du défilement infini
  function loadMoreMovies() {
    page.value++ // Incrémenter la page
    getMovies(page.value) // Récupérer les films de la page suivante
  }

  // Fonction pour rechercher des films en fonction de la requête
  function search() {
    page.value = 1 // Réinitialiser la page à 1 lors d'une nouvelle recherche
    if (searchQuery.value !== '') {
      searchMovies(searchQuery.value, page.value) // Si une recherche est en cours, effectuer une requête pour trouver les films
    } else {
      getMovies(page.value) // Sinon, charger la première page des films par défaut
    }
  }
</script>