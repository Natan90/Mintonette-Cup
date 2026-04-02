<template>
  <NavView />

  <div class="admin-layout">
    <MenuAdmin />

    <main class="main_content">
      <header class="page-header">
        <p class="eyebrow">{{ $t('adminCommentaire.eyebrow') }}</p>
        <h1>{{ $t('adminCommentaire.title') }}</h1>
        <p class="subtitle">{{ $t('adminCommentaire.subtitle') }}</p>
      </header>

      <p v-if="feedbackMessage" class="message feedback" :class="feedbackType">
        {{ feedbackMessage }}
      </p>

      <div v-if="commentaireStore.isLoading" class="state-box">
        {{ $t('adminCommentaire.chargement') }}
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
            <p class="reply-label">{{ $t('adminCommentaire.reponseSend') }}</p>
            <p class="reply-text">{{ commentaire.reponse_commentaire }}</p>
          </div>

          <div class="actions">
            <button
              class="btn reply"
              type="button"
              @click="openReply(commentaire)">
              {{ $t('adminCommentaire.btnRepondre') }}
            </button>
            <button
              class="btn delete"
              type="button"
              @click="confirmDelete(commentaire)">
              {{ $t('adminCommentaire.btnSupprimer') }}
            </button>
          </div>
        </article>
      </section>

      <section v-if="showReplyForm" ref="replyFormRef" class="reply-panel">
        <div class="reply-card">
          <div class="reply-header">
            <p class="eyebrow">{{ $t('adminCommentaire.replyEyebrow') }}</p>
            <h2>{{ $t('adminCommentaire.replyTitle') }}</h2>
          </div>

          <p v-if="replyError" class="message error">{{ replyError }}</p>

          <form class="reply-form" @submit.prevent="submitReply">
            <label class="field">
              <span>{{ $t('adminCommentaire.replyTitle') }}</span>
              <textarea
                v-model.trim="replyForm.reponse_commentaire"
                rows="5"
                :placeholder="$t('adminCommentaire.replyPlaceholder')"
                required></textarea>
            </label>

            <div class="reply-actions">
              <button class="btn cancel" type="button" @click="closeReply">
                {{ $t('adminCommentaire.btnAnnuler') }}
              </button>
              <button class="btn submit" type="submit" :disabled="isSaving">
                {{ isSaving ? $t('adminCommentaire.btnEnregistrement') : $t('adminCommentaire.btnEnvoyer') }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import { useI18n } from "vue-i18n";
import NavView from "@/components/NavView.vue";
import { useAdminAPIStore } from "@/services/admin.service";
import { useCommentaireStore } from "@/services/commentaire";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const adminAPIStore = useAdminAPIStore();
const mailBoxStore = useMailBoxStore();
const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();

const commentaireStore = useCommentaireStore();

const showReplyForm = ref(false);
const replyFormRef = ref(null);
const selectedCommentId = ref(null);
const selectedComment = ref(null);
const isSaving = ref(false);
const feedbackMessage = ref("");
const feedbackType = ref("success");
const replyError = ref("");
const replyForm = ref({
  reponse_commentaire: "",
});
let feedbackTimeoutId = null;

onMounted(() => {
  commentaireStore.fetchCommentaires();
});

onBeforeUnmount(() => {
  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
  }
});

function getAuthor(commentaire) {
  const prenom = commentaire.prenom_commentaire || "";
  const nom = commentaire.nom_commentaire || "";
  return `${prenom} ${nom}`.trim() || t("adminCommentaire.anonyme");
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
  selectedComment.value = commentaire;
  replyForm.value.reponse_commentaire = commentaire.reponse_commentaire || "";
  clearFeedbackMessage();
  replyError.value = "";
  showReplyForm.value = true;

  await nextTick();
  replyFormRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeReply(keepFeedback = false) {
  showReplyForm.value = false;
  selectedCommentId.value = null;
  selectedComment.value = null;
  replyForm.value.reponse_commentaire = "";
  if (!keepFeedback) {
    clearFeedbackMessage();
  }
  replyError.value = "";
}

async function submitReply() {
  if (!selectedCommentId.value) return;

  isSaving.value = true;
  clearFeedbackMessage();
  replyError.value = "";

  try {
    await commentaireStore.replyCommentaire(
      selectedCommentId.value,
      replyForm.value.reponse_commentaire,
    );

    await sendMailToUserForResponse();

    showFeedbackMessage(t("adminCommentaire.feedbackReponse"));
    await commentaireStore.fetchCommentaires();
    closeReply(true);
  } catch (error) {
    replyError.value =
      error?.response?.data?.error ||
      error?.message ||
      t("adminCommentaire.erreurReponse");
  } finally {
    isSaving.value = false;
  }
}

async function confirmDelete(commentaire) {
  const ok = confirm(t("adminCommentaire.confirmSupprimer"));
  if (!ok) return;

  selectedComment.value = commentaire;
  clearFeedbackMessage();

  try {
    await commentaireStore.deleteCommentaire(commentaire.id_commentaire);
    await sendMailToUserForDelete();
    showFeedbackMessage(t("adminCommentaire.feedbackSupprimer"), "error");
  } catch (error) {
    alert(
      error?.response?.data?.error ||
        error?.message ||
        t("adminCommentaire.erreurSupprimer"),
    );
  }
}

async function sendMailToUserForResponse() {
  try {
    if (!selectedComment.value?.id_utilisateur) {
      throw new Error("Impossible de retrouver l'auteur du commentaire");
    }

    const subject = t("mailToSend.reponseCommentaire.subject");
    const message = t("mailToSend.reponseCommentaire.message", {
      nomUtilisateur: getAuthor(selectedComment.value),
    });

    const id_type_message = 6;

    await mailBoxStore.sendMessageTo(userStore.userId, {
      id_user_to: selectedComment.value.id_utilisateur,
      subject,
      message,
      id_type_message,
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de commentaire:", err);
  }
}

async function sendMailToUserForDelete() {
  try {
    if (!selectedComment.value?.id_utilisateur) {
      throw new Error("Impossible de retrouver l'auteur du commentaire");
    }

    const subject = t("mailToSend.suppressionCommentaire.subject");
    const message = t("mailToSend.suppressionCommentaire.message", {
      nomUtilisateur: getAuthor(selectedComment.value),
    });

    const id_type_message = 7;

    await mailBoxStore.sendMessageTo(userStore.userId, {
      id_user_to: selectedComment.value.id_utilisateur,
      subject,
      message,
      id_type_message,
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de commentaire:", err);
  }
}

function clearFeedbackMessage() {
  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = null;
  }
  feedbackMessage.value = "";
}

function showFeedbackMessage(message, type = "success") {
  clearFeedbackMessage();
  feedbackType.value = type;
  feedbackMessage.value = message;

  feedbackTimeoutId = window.setTimeout(() => {
    feedbackMessage.value = "";
    feedbackTimeoutId = null;
  }, 2000);
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
  width: 100%;
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
  width: 100%;
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

.feedback {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  margin: 0;
  max-width: min(420px, calc(100vw - 2rem));
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.18);
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
