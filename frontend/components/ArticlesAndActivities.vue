<template>
  <NavView></NavView>
  <div class="page_wrapper">

    <!-- Bloc Activité -->
    <div v-if="props.isActivityService" class="bloc_container">
      <div class="bloc_header">
        <span class="bloc_icon">🏃</span>
        <h4 class="bloc_title">Activité</h4>
      </div>

      <div class="form_group">
        <label>Nom de l'activité</label>
        <input class="input_text" placeholder="Ex: Initiation escalade" />
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Participants max</label>
          <input type="number" class="input_number" placeholder="0" />
        </div>
        <div class="form_group">
          <label>Prix unitaire (€)</label>
          <input type="number" class="input_number" placeholder="0.00" />
        </div>
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Date</label>
          <input type="date" class="input_text" />
        </div>
        <div class="form_group">
          <label>Heure</label>
          <input type="time" class="input_text" />
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add">+ Ajouter</button>
      </div>

      <!-- Liste des activités ajoutées -->
      <div class="items_list">
        <p class="list_empty">Aucune activité ajoutée pour l'instant.</p>
      </div>
    </div>

    <!-- Bloc Article -->
    <div v-else class="bloc_container">
      <div class="bloc_header">
        <span class="bloc_icon">📦</span>
        <h4 class="bloc_title">Article</h4>
      </div>

      <div class="form_group">
        <label>Nom de l'article</label>
        <input class="input_text" placeholder="Ex: T-shirt XL" />
      </div>

      <div class="row_inputs">
        <div class="form_group">
          <label>Stock</label>
          <input type="number" class="input_number" placeholder="0" />
        </div>
        <div class="form_group">
          <label>Prix (€)</label>
          <input type="number" class="input_number" placeholder="0.00" />
        </div>
      </div>

      <div class="btn_container">
        <button class="btn_add" @click="">+ Ajouter</button>
      </div>

      <!-- Liste des articles ajoutés -->
      <div class="items_list">
        <p class="list_empty">Aucun article ajouté pour l'instant.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import NavView from './NavView.vue';
import { ref } from "vue";

const props = defineProps({
  isActivityService: {
    type: Boolean,
    required: true
  }
});

const itemsList = ref([]);


// async function Add
</script>

<style scoped>
/* ── Variables ── */
.page_wrapper {
  min-height: 100vh;
  background: var(--log-fond);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

/* ── Carte principale ── */
.bloc_container {
  width: 100%;
  max-width: 620px;
  background: var(--log-card-bg);
  border-radius: 18px;
  border: 1.5px solid var(--log-border);
  padding: 32px;
  box-shadow: 0 8px 30px rgba(58, 111, 67, 0.1), 0 2px 8px rgba(232, 99, 122, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── En-tête du bloc ── */
.bloc_header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--log-border);
}

.bloc_icon {
  font-size: 1.6em;
}

.bloc_title {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ── Groupes de champs ── */
.form_group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form_group label {
  font-weight: 700;
  font-size: 0.88em;
  color: var(--primary-dark);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.input_text,
.input_number {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--log-border);
  background: #fff;
  color: #2a3d2e;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.input_text:focus,
.input_number:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(90, 153, 102, 0.15);
}

.input_text::placeholder,
.input_number::placeholder {
  color: #a8bfab;
  font-weight: 400;
}

/* ── Ligne de deux champs ── */
.row_inputs {
  display: flex;
  gap: 16px;
}

.row_inputs .form_group {
  flex: 1;
}

/* ── Bouton ajouter ── */
.btn_container {
  display: flex;
  justify-content: flex-end;
}

.btn_add {
  background: var(--log-gradient-cta);
  color: #fff;
  font-weight: 700;
  font-size: 0.95em;
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(58, 111, 67, 0.25);
  transition: all 0.25s ease;
  letter-spacing: 0.4px;
}

.btn_add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(58, 111, 67, 0.35);
}

.btn_add:active {
  transform: translateY(1px) scale(0.98);
}

/* ── Liste des éléments ajoutés ── */
.items_list {
  margin-top: 4px;
  border-top: 1.5px dashed var(--log-border);
  padding-top: 16px;
}

.list_empty {
  text-align: center;
  color: #a8bfab;
  font-size: 0.9em;
  font-style: italic;
  margin: 0;
}
</style>