<template>
  <NavView />

  <div class="admin-layout">
    <MenuAdmin />

    <main class="main_content">
      <header class="page-header">
        <p class="eyebrow">Administration</p>
        <h1>Gestion des commentaires</h1>
        <p class="subtitle">
          Supprime un commentaire ou réponds directement aux utilisateurs.
        </p>
      </header>

      <div v-if="commentaireStore.isLoading" class="state-box">
        Chargement des commentaires...
      </div>

      <div v-else-if="commentaireStore.error" class="state-box error">
        {{ commentaireStore.error }}
      </div>

      <section v-else class="admin-grid">
        <article
          v-for="commentaire in commentaireStore.commentaires"
          :key="commentaire.id_commentaire"
          class="comment-card">
          <div class="comment-head">
            <div>
              <p class="author">{{ getAuthor(commentaire) }}</p>
              <p class="title">{{ commentaire.titre_commentaire }}</p>
            </div>

            <div class="rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="getStarClass(commentaire.note_commentaire, star)">
                ★
              </span>
            </div>
          </div>

          <p class="content">{{ commentaire.texte_commentaire }}</p>

          <div v-if="commentaire.reponse_commentaire" class="reply-box">
            <p class="reply-label">Réponse envoyée</p>
            <p class="reply-text">{{ commentaire.reponse_commentaire }}</p>
          </div>

          <div class="actions">
            <button
              class="btn reply"
              type="button"
              @click="openReply(commentaire)">
              Répondre
            </button>
            <button
              class="btn delete"
              type="button"
              @click="confirmDelete(commentaire.id_commentaire)">
              Supprimer
            </button>
          </div>
        </article>
      </section>

      <section v-if="showReplyForm" ref="replyFormRef" class="reply-panel">
        <div class="reply-card">
          <div class="reply-header">
            <p class="eyebrow">Réponse admin</p>
            <h2>Répondre au commentaire</h2>
          </div>

          <p v-if="replyMessage" class="message success">{{ replyMessage }}</p>
          <p v-if="replyError" class="message error">{{ replyError }}</p>

          <form class="reply-form" @submit.prevent="submitReply">
            <label class="field">
              <span>Réponse</span>
              <textarea
                v-model.trim="replyForm.reponse_commentaire"
                rows="5"
                placeholder="Écris ta réponse ici"
                required></textarea>
            </label>

            <div class="reply-actions">
              <button class="btn cancel" type="button" @click="closeReply">
                Annuler
              </button>
              <button class="btn submit" type="submit" :disabled="isSaving">
                {{ isSaving ? "Enregistrement..." : "Envoyer la réponse" }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import NavView from "@/components/NavView.vue";
import { useCommentaireStore } from "@/stores/commentaire";

const commentaireStore = useCommentaireStore();

const showReplyForm = ref(false);
const replyFormRef = ref(null);
const selectedCommentId = ref(null);
const isSaving = ref(false);
const replyMessage = ref("");
const replyError = ref("");
const replyForm = ref({
  reponse_commentaire: "",
});

onMounted(() => {
  commentaireStore.fetchCommentaires();
});

function getAuthor(commentaire) {
  const prenom = commentaire.prenom_commentaire || "";
  const nom = commentaire.nom_commentaire || "";
  return `${prenom} ${nom}`.trim() || "Anonyme";
}

function getStarClass(value, star) {
  const rating = Number(value || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  if (star <= fullStars) return "filled";
  if (star === fullStars + 1 && hasHalfStar) return "half";
  return "";
}

async function openReply(commentaire) {
  selectedCommentId.value = commentaire.id_commentaire;
  replyForm.value.reponse_commentaire = commentaire.reponse_commentaire || "";
  replyMessage.value = "";
  replyError.value = "";
  showReplyForm.value = true;

  await nextTick();
  replyFormRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeReply() {
  showReplyForm.value = false;
  selectedCommentId.value = null;
  replyForm.value.reponse_commentaire = "";
  replyMessage.value = "";
  replyError.value = "";
}

async function submitReply() {
  if (!selectedCommentId.value) return;

  isSaving.value = true;
  replyMessage.value = "";
  replyError.value = "";

  try {
    await commentaireStore.replyCommentaire(
      selectedCommentId.value,
      replyForm.value.reponse_commentaire,
    );

    replyMessage.value = "Réponse enregistrée.";
    await commentaireStore.fetchCommentaires();
  } catch (error) {
    replyError.value =
      error?.response?.data?.error ||
      error?.message ||
      "Impossible d'enregistrer la réponse.";
  } finally {
    isSaving.value = false;
  }
}

async function confirmDelete(id_commentaire) {
  const ok = confirm("Supprimer ce commentaire ?");
  if (!ok) return;

  try {
    await commentaireStore.deleteCommentaire(id_commentaire);
  } catch (error) {
    alert(
      error?.response?.data?.error ||
        error?.message ||
        "Impossible de supprimer le commentaire.",
    );
  }
}
</script>

<style scoped>

.admin-layout{
  height: fit-content;
  display: flex;
}

.main_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  padding: 20px;
  width: 100%;
}

.page-header {
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: var(--primary-dark);
}

.page-header h1,
.reply-header h2 {
  margin: 0;
  color: var(--primary-dark);
}

.subtitle {
  margin: 0.4rem 0 0;
  color: #556;
}

.admin-grid {
  display: grid;
  gap: 1rem;
}

.comment-card,
.reply-card,
.state-box {
  background: var(--log-card-bg);
  border: 1px solid var(--log-border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(58, 111, 67, 0.08);
  padding: 1.25rem;
}

.comment-card {
  background: linear-gradient(180deg, #fff4f7 0%, #fffafc 100%);
  border-color: rgba(232, 99, 122, 0.32);
}

.comment-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.author {
  margin: 0;
  font-weight: 700;
  color: var(--primary-dark);
}

.title {
  margin: 0.25rem 0 0;
  color: #334155;
}

.rating {
  display: flex;
  gap: 0.15rem;
}

.star {
  color: rgba(42, 82, 50, 0.2);
  font-size: 1.15rem;
}

.star.filled {
  color: var(--rose);
}

.star.half {
  background: linear-gradient(
    90deg,
    var(--rose) 50%,
    rgba(42, 82, 50, 0.2) 50%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.content {
  margin: 0.9rem 0 0;
  line-height: 1.6;
  color: #334155;
}

.reply-box {
  margin-top: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  background: rgba(58, 111, 67, 0.08);
  border: 1px solid rgba(58, 111, 67, 0.16);
}

.reply-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-dark);
}

.reply-text {
  margin: 0.4rem 0 0;
  color: #334155;
}

.actions,
.reply-actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.btn.reply,
.btn.submit {
  background: var(--log-gradient-cta);
  color: #fff;
}

.btn.delete,
.btn.cancel {
  background: #fff;
  color: var(--rose-hover);
  border: 1px solid rgba(232, 99, 122, 0.28);
}

.reply-panel {
  margin-top: 2rem;
}

.message {
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
}

.message.success {
  background: #eef7f0;
  color: var(--primary-dark);
}

.message.error {
  background: #fff0f4;
  color: #8f1d35;
}

.field {
  display: grid;
  gap: 0.5rem;
  color: #334155;
  font-weight: 600;
}

.field textarea {
  width: 100%;
  min-height: 140px;
  resize: vertical;
  border: 1px solid rgba(58, 111, 67, 0.18);
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font: inherit;
}

@media(max-width: 1000px){
  .admin-layout{
    flex-direction: column;
  }

  .main_content{
    padding-top: 0;
    width: 100vw;
  }
}
</style>
