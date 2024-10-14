import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movieStore', () => {
  // Init
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;

  // State
  const movies = ref([])
  const movie = ref()
  const cast = ref([])
  const director = ref('')

  // Actions & getters
  async function getMovies(page: Number) {
    try {
      const data = await $fetch('https://api.themoviedb.org/3/discover/movie', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: 'fr-FR',
          page: page,
        },
      });

      if (page === 1) {
        movies.value = data.results
      } else {
        movies.value.push(...data.results)
      }
    } catch (e) {
        throw e;
    }
  }
  
  async function searchMovies(title: string, page: number) {
    try {
      const data = await $fetch('https://api.themoviedb.org/3/search/movie', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          query: title,
          language: 'fr-FR',
          page: page,
        },
      });

      if (page === 1) {
        movies.value = data.results
      } else {
        movies.value.push(...data.results)
      }
    } catch (e) {
        throw e;
    }
  }

  async function getMovieDetails(idMovie: number) {
    // https://api.themoviedb.org/3/movie/111?
    try {
      const data = await $fetch(`https://api.themoviedb.org/3/movie/${idMovie}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: 'fr-FR',
        },
      });
      movie.value = data
    } catch (e) {
        throw e;
    }
  }

  async function getMovieCast(idMovie: number) {
    // https://api.themoviedb.org/3/movie/111?
    try {
      const data = await $fetch(`https://api.themoviedb.org/3/movie/${idMovie}/credits`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: 'fr-FR',
        },
      });
      console.log(data)
      
      const maxOrder = 5
      const headliners = data.cast
        .filter((member: { order: number; }) => member.order < maxOrder)
        .map((member: { name: string; }) => member.name)
      cast.value = headliners
      director.value = data.crew[0].name
    } catch (e) {
        throw e;
    }
  }

  
  
  return { 
      getMovies, searchMovies, getMovieDetails, getMovieCast,
      movies, movie, cast, director
    
  }
})