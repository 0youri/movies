<!-- components/CommentForm.vue -->
<template>
    <form @submit.prevent="submitComment" class="comment-form">
      <input v-model="userName" placeholder="Nom d’utilisateur" required minlength="3" maxlength="50" class="input-field" />
      <textarea v-model="message" placeholder="Message" required minlength="3" maxlength="500" class="input-field"></textarea>
      <input type="number" v-model="rating" min="1" max="10" required class="input-field" />
      <button type="submit" class="submit-button">Envoyer le commentaire</button>
    </form>
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p class="comment-author">{{ comment.userName }}:</p>
        <p class="comment-message">{{ comment.message }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const userName = ref('');
  const message = ref('');
  const rating = ref(1);
  const comments = ref(JSON.parse(localStorage.getItem('comments') || '[]'));
  
  function submitComment() {
    comments.value.unshift({ userName: userName.value, message: message.value, rating: rating.value });
    localStorage.setItem('comments', JSON.stringify(comments.value));
    userName.value = '';
    message.value = '';
    rating.value = 1;
  }
  </script>
  
  <style scoped>
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .input-field {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .submit-button {
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .comment-list {
    margin-top: 2rem;
  }
  
  .comment {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .comment-author {
    font-weight: bold;
  }
  </style>