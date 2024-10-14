<template>
  <div class="min-h-screen p-10 bg-gray-900 text-white">
    <input
      v-model="searchQuery"
      @input="search"
      placeholder="Rechercher un film..."
      class="w-full p-2 mb-4 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    <div class="grid grid-cols-3 gap-6 md:grid-cols-4 lg:grid-cols-6 mt-5">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
    <InfiniteLoading @infinite="loadMoreMovies" />
  </div>
</template>
  
  <script setup lang="ts">
  import InfiniteLoading from 'v3-infinite-loading'
  import { useMovieStore } from '~/stores/movie'
  
  const searchQuery = ref('')
  const { getMovies, searchMovies } = useMovieStore()
  const { movies } = storeToRefs(useMovieStore())
  const page = ref(1)
  onMounted( async () => {
    getMovies(page.value)
  });
  
  function loadMoreMovies() {
    page.value++
    getMovies(page.value)
  }
  
  function search() {
    page.value = 1
    if (searchQuery.value !== '') {
      searchMovies(searchQuery.value, page.value)
    } else {
      getMovies(page.value)
    }
  }
  </script>
  
  <style scoped>
  .search-input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  </style>