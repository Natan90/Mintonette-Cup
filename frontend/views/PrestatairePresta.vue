<template>
  <NavView v-if="showNav"></NavView>
  <div class="editor_container">
    <div class="form_group">
      <label for="nom">Nom de la prestation :</label>
      <input type="text" id="nom" v-model="nom_presta" />
    </div>

    <div class="form_group">
      <label>Description détaillée :</label>
      <Editor v-model="descri_presta" api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo" :init="{
        height: 300,
        menubar: false,
        plugins: 'lists link image code',
        toolbar: 'undo redo | bold italic underline | bullist numlist | code',
        branding: false
      }" />
    </div>

    <div class="form_group">
      <label for="participants">Nombre maximum de participants :</label>
      <input type="number" id="participants" v-model="nb_participants" min="1" />
    </div>

    <div class="form_group">
      <label for="tarif">Tarif :</label>
      <input type="number" id="tarif" v-model="tarif_presta" />
    </div>

    <div class="form_group">
      <label for="contact">Email :</label>
      <input type="text" id="contact" v-model="mail_presta" placeholder="mail@example.com" />
    </div>

    <div class="form_group">
      <label for="contact">Téléphone :</label>
      <input type="tel" pattern="^0[1-9][0-9]{8}$" id="contact" v-model="tel_presta" placeholder="0123456789" />
    </div>

    <div
      v-if="props.message"
      class="message"
      :class="props.type === 'error' ? 'message-error' : 'message-success'">
      <span class="text">{{ props.message }}</span>
    </div>


    <div class="button_container" v-if="showNav">
      <button @click="handleSubmit">Modifier</button>
    </div>
    <div class="button_container" v-else>
      <button @click="handleSubmit">S’inscrire</button>
    </div>
  </div>




</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import axios from "axios";


import Editor from "@tinymce/tinymce-vue";
import NavView from "@/components/NavView.vue";

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String, // success ou error
    default: 'success'
  }
});



const userStore = useUserStore();
const route = useRoute();

const showNav = computed(() => route.path === "/Prestataire/Edit");

const content = ref('');

const nom_presta = ref('');
const descri_presta = ref('');
const nb_participants = ref(1);
const tarif_presta = ref(0);
const mail_presta = ref('');
const tel_presta = ref('');

const emit = defineEmits(["submitPrestataire"]);

async function saveArticle() {
  try {
    const res = await axios.post("http://localhost:3000/PrestatairePresta", {
      contenu: content.value,
      utilisateur_id: userStore.userId,
    });
    console.log("Article sauvegardé :", res.data);
    alert("Article sauvegardé avec succès !");
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    alert("Erreur lors de la sauvegarde !");
  }
}

function handleSubmit() {
  console.log({
    nom: nom_presta.value,
    descri: descri_presta.value,
    nb_participants: nb_participants.value,
    tarif: tarif_presta.value,
    mail: mail_presta.value,
    tel: tel_presta.value
  });
  emit("submitPrestataire", {
    nom: nom_presta.value,
    descri: descri_presta.value,
    nb_participants: nb_participants.value,
    tarif: tarif_presta.value,
    mail: mail_presta.value,
    tel: tel_presta.value
  });
}
</script>

<style scoped>
.editor_container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin: auto;
  margin-top: 60px;
}

.tox-tinymce {
  width: 100% !important;
}

.form_group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form_group input,
.form_group select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form_group button {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f7c325, #ffdb59);
  color: #0a1d42;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.form_group button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(247, 195, 37, 0.4);
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 10px;
  animation: fadeIn 0.3s ease;
}

.message-success {
  background: #e6f9f0;
  color: #0f7a4a;
  border: 1px solid #5ad39c;
}

.message-error {
  background: #fdecea;
  color: #b42318;
  border: 1px solid #f5a3a3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
