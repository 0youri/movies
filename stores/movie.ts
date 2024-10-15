import { defineStore } from "pinia";

// Définition des types pour les réponses de l'API
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  [key: string]: any; // Permet d'inclure d'autres propriétés possibles
}

interface CastMember {
  name: string;
  order: number;
}

interface ApiResponse {
  results: Movie[]; // La réponse de l'API contient un tableau de films
}

export const useMovieStore = defineStore("movieStore", () => {
  // Init
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;

  // State
  const movies = ref<Movie[]>([]); // Spécifie un tableau de films (Movie[])
  const movie = ref<Movie>(); // Le film actuel est de type Movie ou null si non chargé
  const cast = ref<CastMember[]>([]); // Tableau des membres du casting
  const director = ref<string>("");

  // Actions & getters

  // Fonction pour récupérer les films
  async function getMovies(page: number) {
    try {
      const data = await $fetch<ApiResponse>("https://api.themoviedb.org/3/discover/movie", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: "fr-FR",
          page: page,
        },
      });

      // Maintenant que data est typé, on peut accéder à data.results
      if (page === 1) {
        movies.value = data.results;
      } else {
        movies.value.push(...data.results);
      }
    } catch (e) {
      throw e;
    }
  }

  // Fonction pour rechercher des films
  async function searchMovies(title: string, page: number) {
    try {
      const data = await $fetch<ApiResponse>("https://api.themoviedb.org/3/search/movie", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          query: title,
          language: "fr-FR",
          page: page,
        },
      });

      // Même traitement que getMovies
      if (page === 1) {
        movies.value = data.results;
      } else {
        movies.value.push(...data.results);
      }
    } catch (e) {
      throw e;
    }
  }

  // Fonction pour récupérer les détails d'un film
  async function getMovieDetails(idMovie: number) {
    try {
      const data = await $fetch<Movie>(`https://api.themoviedb.org/3/movie/${idMovie}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: "fr-FR",
        },
      });
      movie.value = data; // data est de type Movie ici
    } catch (e) {
      throw e;
    }
  }

  // Fonction pour récupérer le casting d'un film
  async function getMovieCast(idMovie: number) {
    try {
      const data = await $fetch<any>(`https://api.themoviedb.org/3/movie/${idMovie}/credits`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: "fr-FR",
        },
      });

      // Filtrage des têtes d'affiche du film
      const maxOrder = 5;
      const headliners = data.cast
        .filter((member: CastMember) => member.order < maxOrder)
        .map((member: CastMember) => member.name);
      cast.value = headliners;
      director.value = data.crew[0]?.name || ""; // Vérifie que le réalisateur existe
    } catch (e) {
      throw e;
    }
  }

  return {
    getMovies,
    searchMovies,
    getMovieDetails,
    getMovieCast,
    movies,
    movie,
    cast,
    director,
  };
});