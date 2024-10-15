<template>
  <div class="flex flex-col lg:flex-row lg:space-x-8 mt-8">
    <!-- Liste des commentaires à gauche avec un scroll -->
    <div class="lg:w-2/3 h-96 overflow-y-auto space-y-4 pr-4 border-r border-gray-300">
      <!-- Skeletons pour les commentaires en cours de chargement -->
      <!-- Affiche des placeholders pendant que les données des commentaires sont chargées -->
      <div v-if="loading" v-for="n in 3" :key="n" class="p-4 bg-gray-100 rounded-lg shadow-lg animate-pulse">
        <div class="flex justify-between items-center mb-2">
          <!-- Skeleton pour le nom et la note -->
          <div class="w-1/4 h-4 bg-gray-300 rounded"></div>
          <div class="w-1/6 h-4 bg-gray-300 rounded"></div>
        </div>
        <!-- Skeleton pour le message -->
        <div class="w-full h-4 bg-gray-300 rounded mb-2"></div>
        <div class="w-3/4 h-4 bg-gray-300 rounded"></div>
      </div>

      <!-- Affichage des commentaires après chargement -->
      <!-- Liste des commentaires stockés dans le localStorage, chaque commentaire a un nom d'utilisateur, une note et un message -->
      <div v-else v-for="comment in comments" :key="comment.id" class="p-4 bg-gray-100 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-2">
          <p class="font-bold text-gray-800">{{ comment.userName }}</p>
          <p class="text-sm text-gray-600">Note : {{ comment.rating }}/10</p>
        </div>
        <p class="text-gray-700">{{ comment.message }}</p>
      </div>
    </div>

    <!-- Formulaire d'ajout de commentaire à droite -->
    <!-- Permet à l'utilisateur d'ajouter son commentaire avec son nom, un message et une note -->
    <div class="lg:w-1/3 flex flex-col gap-4 text-black">
      <!-- Nom d’utilisateur -->
      <!-- Champ texte pour le nom d'utilisateur avec validation de longueur -->
      <input 
        v-model="userName" 
        placeholder="Nom d’utilisateur" 
        required 
        minlength="3" 
        maxlength="50" 
        class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown.enter="handleEnter"
      />

      <!-- Message -->
      <!-- Champ de texte pour le message avec validation de longueur -->
      <textarea 
        v-model="message" 
        placeholder="Message" 
        required 
        minlength="3" 
        maxlength="500" 
        class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown.enter="handleEnter"
      ></textarea>

      <!-- Note -->
      <!-- Champ pour la note avec une valeur numérique entre 1 et 10 -->
      <input 
        type="number" 
        v-model="rating" 
        min="1" 
        max="10" 
        required 
        class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown.enter="handleEnter"
      />

      <!-- Bouton d'envoi -->
      <!-- Bouton pour soumettre le commentaire -->
      <button 
        type="submit" 
        @click.prevent="submitComment"
        class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Ajouter le commentaire
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Récupération des paramètres de la route pour identifier le film en cours
  const route = useRoute();
  // Définir le type pour un commentaire
  interface Comment {
    userName: string;
    message: string;
    rating: number;
  }
  // Définition des variables réactives pour les données du formulaire et les commentaires
  const userName = ref<string>('');
  const message = ref<string>('');
  const rating = ref<number>(5);
  const loading = ref<boolean>(true); // Indicateur de chargement
  const comments = ref<Comment[]>([]); // Tableau de commentaires

  // Exécuter ce code lorsque le composant est monté
  onMounted(() => {
    setTimeout(() => {
      // Simuler un délai de chargement pour récupérer les commentaires depuis le localStorage
      comments.value = JSON.parse(localStorage.getItem(`comments-${route.params.id}`) || '[]');
      loading.value = false; // Indicateur de fin de chargement
    }, 2000); // Délai simulé de 2 secondes
  });

  // Fonction pour soumettre un commentaire
  function submitComment() {
    // Vérification que tous les champs sont remplis
    if (!userName.value.trim() || !message.value.trim() || !rating.value) {
      alert('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }

    // Ajouter le commentaire à la liste des commentaires
    comments.value.unshift({
      userName: userName.value.trim(),
      message: message.value.trim(),
      rating: rating.value
    });

    // Stocker les commentaires dans le localStorage avec une clé unique pour chaque film
    localStorage.setItem(`comments-${route.params.id}`, JSON.stringify(comments.value));

    // Réinitialisation des champs du formulaire après soumission
    userName.value = '';
    message.value = '';
    rating.value = 5;
  }

  // Fonction pour gérer la touche "Entrée"
  function handleEnter(event: { key: string; preventDefault: () => void; }) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Empêcher le comportement par défaut de la touche "Enter"
      submitComment(); // Soumettre le commentaire lorsque l'utilisateur appuie sur "Enter"
    }
  }
</script>