<template>
  <NavView></NavView>

  <div class="conteneurCom">
    <header class="header">
      <div>
        <p class="titre">{{ $t("commentaire.petitTitre") }}</p>
        <h1>{{ $t("commentaire.grandTitre") }}</h1>
      </div>
    </header>

    <section class="zoneCommentaire">
      <!-- Coupe la page en deux  -->
      <aside class="panneauResume">
        <div class="carteResume carteMiseEnAvant">
          <p class="titreCarte">{{ $t("commentaire.noteMoyenne") }}</p>
          <div class="ligneNote">
            <span class="noteMoyenne">{{ noteMoyenne.toFixed(1) }}</span>
            <div class="etoiles">
              <span
                v-for="star in 5"
                :key="star"
                class="etoile"
                :class="getStarClass(noteMoyenne, star)">
                ★
              </span>
            </div>
          </div>
        </div>

        <div class="carteResume">
          <p class="titreCarte">{{ $t("commentaire.repartitionNote") }}</p>
          <button
            type="button"
            class="ligneRepartition ligneFiltre all"
            :class="{ active: noteFiltre === 'all' }"
            @click="noteFiltre = 'all'">
            <span class="labelRepartition">{{
              $t("commentaire.touteLesNotes")
            }}</span>
            <div class="barreRepartition">
              <div
                class="remplissageRepartition"
                :style="{ width: '100%' }"></div>
            </div>
            <span class="valeurRepartition">{{ commentaires.length }}</span>
          </button>
          <button
            v-for="group in filterGroups"
            :key="group.key"
            type="button"
            class="ligneRepartition ligneFiltre"
            :class="{ active: noteFiltre === group.key }"
            @click="noteFiltre = group.key">
            <span class="labelRepartition">{{ group.label }}</span>
            <div class="barreRepartition">
              <div
                class="remplissageRepartition"
                :style="{ width: `${getFilterPercent(group)}%` }"></div>
            </div>
            <span class="valeurRepartition">{{ getFilterCount(group) }}</span>
          </button>
        </div>

        <button class="boutonAjouter" type="button" @click="toggleForm">
          {{
            showForm
              ? $t("commentaire.masquerFormulaire")
              : $t("commentaire.ajouterNote")
          }}
        </button>
      </aside>

      <section class="panneauCommentaires">
        <div v-if="commentaireStore.isLoading" class="etatMessage">
          Chargement des commentaires...
        </div>
        <div v-else-if="commentaireStore.error" class="etatMessage erreur">
          {{ commentaireStore.error }}
        </div>
        <div v-else-if="!filteredCommentaires.length" class="etatMessage">
          {{ $t("commentaire.aucunCommentaire") }}
        </div>

        <article
          v-for="commentaire in filteredCommentaires"
          :key="commentaire.id_commentaire"
          class="carteCommentaire"
          :class="{ monCommentaire: isOwnComment(commentaire) }">
          <div class="enteteCommentaire">
            <div>
              <p class="nomCommentaire">
                {{ getCommentAuthor(commentaire) }}
              </p>
              <p class="titreCommentaire">
                {{ getCommentTitle(commentaire) }}
              </p>
            </div>

            <div class="actionsCommentaire">
              <span v-if="isOwnComment(commentaire)" class="badgeAuteur">{{
                $t("commentaire.vous")
              }}</span>
              <button
                v-if="isOwnComment(commentaire)"
                type="button"
                class="boutonModifier pointer"
                @click="openEditForm(commentaire)">
                {{ $t("commentaire.modifierCommentaire") }}
              </button>
              <button
                v-if="isOwnComment(commentaire)"
                type="button"
                class="boutonSupprimer pointer"
                @click="deleteCommentary(commentaire)">
                {{ $t("commentaire.supprimerCommentaire") }}
              </button>
              <div class="noteCommentaire">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="etoile"
                  :class="
                    getStarClass(
                      Number(commentaire.note_commentaire || 0),
                      star,
                    )
                  ">
                  ★
                </span>
              </div>
            </div>
          </div>

          <p class="texteCommentaire">
            {{ commentaire.texte_commentaire || "Aucun texte de commentaire." }}
          </p>

          <div v-if="commentaire.reponse_commentaire" class="reponseBloc">
            <button
              type="button"
              class="boutonDeplierReponse"
              :class="{ ouvert: openReplyId === commentaire.id_commentaire }"
              @click="toggleReply(commentaire.id_commentaire)">
              {{
                openReplyId === commentaire.id_commentaire
                  ? $t("commentaire.masquerReponseAdmin")
                  : $t("commentaire.voirReponseAdmin")
              }}
            </button>

            <div
              v-if="openReplyId === commentaire.id_commentaire"
              class="reponseCommentaire">
              <p class="titreReponse">{{ $t("commentaire.reponseAdmin") }}</p>
              <p class="texteReponse">{{ commentaire.reponse_commentaire }}</p>
            </div>
          </div>
        </article>
      </section>
    </section>

    <section v-if="showForm" ref="formRef" class="zoneFormulaire">
      <div class="carteFormulaire">
        <div class="enteteFormulaire">
          <p class="titreCarte">{{ $t("commentaire.ajouterNote") }}</p>
          <h2>
            {{
              editingCommentId
                ? $t("commentaire.modifierCom")
                : $t("commentaire.publierCom")
            }}
          </h2>
        </div>

        <p v-if="formMessage" class="messageFormulaire succes">
          {{ formMessage }}
        </p>
        <p v-if="formError" class="messageFormulaire erreur">{{ formError }}</p>

        <form class="formCommentaire" @submit.prevent="submitCommentaire">
          <label class="champFormulaire">
            <span>{{ $t("commentaire.titre") }}</span>
            <input
              v-model.trim="commentaireForm.titre_commentaire"
              type="text"
              :placeholder="$t('commentaire.placeholderTitre')"
              required />
          </label>

          <div class="champFormulaire">
            <span>{{ $t("commentaire.note") }}</span>
            <div class="selectEtoiles">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="etoileChoix"
                :class="getStarClass(commentaireForm.note_commentaire, star)"
                @click="setNote($event, star)">
                ★
              </button>
            </div>
            <small class="noteChoisie"
              >{{ $t("commentaire.noteChoisie") }}
              {{ commentaireForm.note_commentaire.toFixed(1) }}/5</small
            >
          </div>

          <label class="champFormulaire">
            <span>{{ $t("commentaire.texte") }}</span>
            <textarea
              v-model.trim="commentaireForm.texte_commentaire"
              rows="5"
              :placeholder="$t('commentaire.placeholderTexte')"
              required></textarea>
          </label>

          <button
            v-if="editingCommentId"
            type="button"
            class="boutonAnnuler"
            @click="cancelEditing">
            Annuler la modification
          </button>

          <button class="boutonEnvoyer" type="submit" :disabled="isSubmitting">
            {{
              isSubmitting
                ? "Envoi en cours..."
                : editingCommentId
                  ? $t("commentaire.modifierLaNote")
                  : $t("commentaire.ajouterLaNote")
            }}
          </button>
        </form>
      </div>
    </section>
  </div>

  <Footer></Footer>
</template>

<script setup>
/* ********************
        IMPORTS
******************** */
import { onMounted, computed, nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

/* ********************
    PAGES IMPORTS
******************** */
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useAdminAPIStore } from "@/services/admin.service";
import { useCommentaireStore } from "@/services/commentaire";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

/* ********************
    Commentaire Values
******************** */
const commentaireStore = useCommentaireStore();
const adminAPIStore = useAdminAPIStore();
const mailBoxStore = useMailBoxStore();
const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();
const { commentaires } = storeToRefs(commentaireStore);
const formRef = ref(null);
const showForm = ref(false);
const isSubmitting = ref(false);
const formMessage = ref("");
const formError = ref("");
const noteFiltre = ref("all");
const currentUser = ref(null);
const editingCommentId = ref(null);
const openReplyId = ref(null);
const commentaireForm = ref({
  titre_commentaire: "",
  texte_commentaire: "",
  note_commentaire: 5,
});
const userData = ref({
  prenom: "",
  nom: "",
  email: "",
});

onMounted(() => {
  commentaireStore.fetchCommentaires();
  loadCurrentUser();
});

const noteMoyenne = computed(() => {
  if (!commentaires.value.length) return 0;

  const total = commentaires.value.reduce(
    (sum, commentaire) => sum + Number(commentaire.note_commentaire || 0),
    0,
  );

  return total / commentaires.value.length;
});

const filterGroups = [
  { key: "5", label: "5", min: 5, max: 5 },
  { key: "4", label: "4 - 4.5", min: 4, max: 4.5 },
  { key: "3", label: "3 - 3.5", min: 3, max: 3.5 },
  { key: "2", label: "2 - 2.5", min: 2, max: 2.5 },
  { key: "1", label: "1 - 1.5", min: 1, max: 1.5 },
  { key: "0.5", label: "0.5", min: 0.5, max: 0.5 },
];

const filteredCommentaires = computed(() => {
  if (noteFiltre.value === "all") {
    return commentaires.value;
  }

  const selectedGroup = filterGroups.find(
    (group) => group.key === noteFiltre.value,
  );
  if (!selectedGroup) {
    return commentaires.value;
  }

  return commentaires.value.filter((commentaire) => {
    const note = Number(commentaire.note_commentaire || 0);
    return note >= selectedGroup.min && note <= selectedGroup.max;
  });
});

function getRatingCount(rating) {
  return commentaires.value.filter(
    (commentaire) => Number(commentaire.note_commentaire || 0) === rating,
  ).length;
}

function getRatingPercent(rating) {
  if (!commentaires.value.length) return 0;

  return Math.round((getRatingCount(rating) / commentaires.value.length) * 100);
}

function getStarClass(value, star) {
  const rating = Number(value || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  if (star <= fullStars) return "remplie";
  if (star === fullStars + 1 && hasHalfStar) return "demie";
  return "";
}

function getCommentAuthor(commentaire) {
  const prenom = commentaire.prenom_commentaire || "";
  const nom = commentaire.nom_commentaire || "";
  const fullName = `${prenom} ${nom}`.trim();

  return fullName || "Anonyme";
}

function getCommentTitle(commentaire) {
  return commentaire.titre_commentaire || "Commentaire";
}

function getFilterCount(group) {
  return commentaires.value.filter((commentaire) => {
    const note = Number(commentaire.note_commentaire || 0);
    return note >= group.min && note <= group.max;
  }).length;
}

function getFilterPercent(group) {
  if (!commentaires.value.length) return 0;

  return Math.round((getFilterCount(group) / commentaires.value.length) * 100);
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isOwnComment(commentaire) {
  if (!currentUser.value) return false;

  if (
    commentaire.id_utilisateur != null &&
    currentUser.value.id_utilisateur != null
  ) {
    return (
      Number(commentaire.id_utilisateur) ===
      Number(currentUser.value.id_utilisateur)
    );
  }

  return (
    normalizeText(currentUser.value.prenom_utilisateur) ===
      normalizeText(commentaire.prenom_commentaire) &&
    normalizeText(currentUser.value.nom_utilisateur) ===
      normalizeText(commentaire.nom_commentaire)
  );
}

function toggleReply(idCommentaire) {
  openReplyId.value =
    openReplyId.value === idCommentaire ? null : idCommentaire;
}

async function toggleForm() {
  showForm.value = !showForm.value;

  if (showForm.value) {
    await nextTick();
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    resetCommentForm();
    formMessage.value = "";
    formError.value = "";
  }
}

function setNote(event, star) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const clickOnLeftHalf = event.clientX - rect.left < rect.width / 2;

  commentaireForm.value.note_commentaire = clickOnLeftHalf ? star - 0.5 : star;
}

/**
 * Charge les informations de l'utilisateur connecté
 * et les stocke dans `currentUser`.
 * En cas d'erreur, la valeur est mise à null.
 */
async function loadCurrentUser() {
  try {
    const response = await adminAPIStore.GetCurrentUser();
    currentUser.value = response.data;
  } catch {
    currentUser.value = null;
  }
}
/**
 * Réinitialise les champs du formulaire de commentaire
 * et désactive le mode édition.
 */
function resetCommentForm() {
  commentaireForm.value.titre_commentaire = "";
  commentaireForm.value.texte_commentaire = "";
  commentaireForm.value.note_commentaire = 5;
  editingCommentId.value = null;
}
/**
 * Ouvre le formulaire en mode édition et pré-remplit
 * les champs avec les données du commentaire sélectionné.
 * @param {Object} commentaire - Commentaire à modifier
 */
async function openEditForm(commentaire) {
  editingCommentId.value = commentaire.id_commentaire;
  commentaireForm.value.titre_commentaire = commentaire.titre_commentaire || "";
  commentaireForm.value.texte_commentaire = commentaire.texte_commentaire || "";
  commentaireForm.value.note_commentaire = Number(
    commentaire.note_commentaire || 5,
  );
  formMessage.value = "";
  formError.value = "";
  showForm.value = true;

  await nextTick();
  formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
/**
 * Supprime un commentaire après confirmation utilisateur.
 * Réinitialise l'édition si le commentaire supprimé est en cours de modification.
 * @param {Object} commentaire - Commentaire à supprimer
 */
async function deleteCommentary(commentaire) {
  const ok = window.confirm("Supprimer ce commentaire ?");
  if (!ok) return;

  formMessage.value = "";
  formError.value = "";

  try {
    await commentaireStore.deleteCommentaire(commentaire.id_commentaire);

    if (editingCommentId.value === commentaire.id_commentaire) {
      cancelEditing();
    }

    if (openReplyId.value === commentaire.id_commentaire) {
      openReplyId.value = null;
    }
  } catch (error) {
    formError.value =
      error?.response?.data?.error ||
      error?.message ||
      "Impossible de supprimer le commentaire.";
  }
}

/**
 * Annule l'édition, réinitialise le formulaire
 * et ferme l'affichage du formulaire.
 */
function cancelEditing() {
  resetCommentForm();
  showForm.value = false;
  formMessage.value = "";
  formError.value = "";
}

/**
 * Envoie un nouveau commentaire ou met à jour un existant.
 * Réinitialise le formulaire puis déclenche l'envoi d'un mail à l'admin.
 */
async function submitCommentaire() {
  isSubmitting.value = true;
  formMessage.value = "";
  formError.value = "";

  try {
    const payload = {
      titre_commentaire: commentaireForm.value.titre_commentaire,
      texte_commentaire: commentaireForm.value.texte_commentaire,
      note_commentaire: commentaireForm.value.note_commentaire,
    };

    if (editingCommentId.value) {
      await commentaireStore.updateCommentaire(editingCommentId.value, payload);
      // formMessage.value = "Votre commentaire a bien été modifié.";
    } else {
      await commentaireStore.addCommentaire(payload);
      // formMessage.value = "Votre commentaire a bien été ajouté.";
    }

    resetCommentForm();
    showForm.value = false;
    sendMailToAdmin();
  } catch (error) {
    formError.value =
      error?.response?.data?.error ||
      error?.message ||
      "Impossible d'ajouter le commentaire.";
  } finally {
    isSubmitting.value = false;
  }

  /**
   * Récupère les informations de l'utilisateur courant
   * nécessaires pour la construction du mail.
   */
  async function fetchUserData() {
    try {
      // console.log("dans le fetch user data");
      const response = await adminAPIStore.GetCurrentUser();
      userData.value = {
        prenom: response.data.prenom_utilisateur || "",
        nom: response.data.nom_utilisateur || "",
        email: response.data.mail_utilisateur || "",
      };
      // console.log("fin du fetch user data");
    } catch (err) {
      console.error("Erreur en récupérant les données utilisateur :", err);
    }
  }

  /**
   * Envoie un mail à l'administrateur après ajout ou modification d'un commentaire.
   * Construit dynamiquement le contenu avec les informations utilisateur.
   */
  async function sendMailToAdmin() {
    try {
      // console.log("ici");

      await fetchUserData();
      // console.log("et là");

      const subject = t("mailToSend.commentaire.subject");
      const message = t("mailToSend.commentaire.message", {
        nomUtilisateur: userData.value.prenom + " " + userData.value.nom,
        emailUtilisateur: userData.value.email,
        lienVersCommentaire,
      });

      const id_admin = 1;
      const id_type_message = 5;

      await mailBoxStore.sendMessageTo(userStore.userId, {
        id_user_to: id_admin,
        subject,
        message,
        id_type_message,
        is_html: true,
      });
      // console.log("Mail bien envoyé");
    } catch (err) {
      console.error("Erreur lors de l'envoi de commentaire:", err);
    }
  }
  const lienVersCommentaire =
    window.location.origin +
    router.resolve({
      name: "AdminCommentaire",
    }).href;
}
</script>

<style scoped>
.conteneurCom {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 3rem;
  background: linear-gradient(
    180deg,
    rgba(58, 111, 67, 0.04),
    rgba(232, 99, 122, 0.03)
  );
}

.header {
  margin-bottom: 1.5rem;
}

.titre {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: var(--primary-dark);
}

.header h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.zoneCommentaire {
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 1.5rem;
  align-items: start;
}

.panneauResume,
.panneauCommentaires {
  display: grid;
  gap: 1rem;
}

.panneauCommentaires {
  max-height: min(42rem, 85vh);
  overflow-y: auto;
  padding-right: 0.35rem;
  scrollbar-gutter: stable;
}

.carteResume,
.carteCommentaire,
.etatMessage {
  background: var(--log-card-bg);
  border: 1px solid var(--log-border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(58, 111, 67, 0.08);
}

.carteResume {
  padding: 1.25rem;
}

.ligneFiltre {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 14px;
  border: 1px solid rgba(58, 111, 67, 0.18);
  padding: 0.85rem 1rem;
  font: inherit;
  color: var(--primary-dark);
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.ligneFiltre:hover {
  transform: translateY(-1px);
  border-color: var(--primary-color);
}

.ligneFiltre.active {
  background: rgba(58, 111, 67, 0.08);
  border-color: var(--primary-color);
}

.ligneFiltre.all {
  background: linear-gradient(
    90deg,
    rgba(58, 111, 67, 0.08),
    rgba(232, 99, 122, 0.08)
  );
}

.boutonAjouter,
.boutonEnvoyer {
  border: 0;
  border-radius: 999px;
  padding: 0.95rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.boutonAjouter {
  background: var(--log-gradient-cta);
  color: #fff;
}

.boutonEnvoyer {
  background: var(--log-gradient-cta);
  color: #fff;
  justify-self: start;
}

.boutonAjouter:hover,
.boutonEnvoyer:hover {
  transform: translateY(-1px);
}

.carteMiseEnAvant {
  background: linear-gradient(
    180deg,
    var(--primary-color) 0%,
    var(--primary-dark) 100%
  );
  color: #fff;
}

.titreCarte {
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.ligneScore {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.noteMoyenne {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
}

.nombreNote {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.etoiles {
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
}

.etoile {
  --star-empty: rgba(255, 255, 255, 0.28);
  --star-filled: var(--rose);
  color: rgba(255, 255, 255, 0.28);
  font-size: 1.25rem;
}

.carteResume:not(.carteMiseEnAvant) .etoile {
  --star-empty: rgba(42, 82, 50, 0.2);
}

.etoile.remplie {
  color: var(--star-filled);
}

.etoile.demie {
  background: linear-gradient(
    90deg,
    var(--star-filled) 50%,
    var(--star-empty) 50%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ligneRepartition {
  display: grid;
  grid-template-columns: 90px 1fr 28px;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.8rem;
}

.ligneRepartition:first-of-type {
  margin-top: 0;
}

.labelRepartition,
.valeurRepartition,
.titreCommentaire,
.texteCommentaire {
  color: #334155;
}

.barreRepartition {
  height: 10px;
  border-radius: 999px;
  background: rgba(16, 24, 40, 0.08);
  overflow: hidden;
}

.remplissageRepartition {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--rose) 100%);
}

.etatMessage {
  padding: 1.25rem;
}

.etatMessage.erreur {
  color: #8f1d35;
  background: #fff0f4;
}

.carteCommentaire {
  padding: 1.25rem 1.35rem;
}

.carteCommentaire.monCommentaire {
  background: linear-gradient(180deg, #fff4f7 0%, #fffafc 100%);
  border-color: rgba(232, 99, 122, 0.35);
}

.panneauCommentaires::-webkit-scrollbar {
  width: 10px;
}

.panneauCommentaires::-webkit-scrollbar-track {
  background: rgba(58, 111, 67, 0.08);
  border-radius: 999px;
}

.panneauCommentaires::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--primary-color), var(--rose));
  border-radius: 999px;
}

.enteteCommentaire {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.actionsCommentaire {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badgeAuteur {
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  background: rgba(232, 99, 122, 0.12);
  color: var(--rose-hover);
  font-size: 0.75rem;
  font-weight: 700;
}

.boutonModifier,
.boutonAnnuler {
  border: 1px solid rgba(232, 99, 122, 0.22);
  border-radius: 999px;
  background: #fff;
  color: var(--rose-hover);
  padding: 0.45rem 0.8rem;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
}
.boutonSupprimer {
  border: 1px solid rgba(232, 99, 122, 0.22);
  border-radius: 999px;
  background: #fb5656;
  color: #fff;
  padding: 0.45rem 0.8rem;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
}
.boutonSupprimer:hover {
  background: #f3b3b3;
}

.boutonModifier:hover,
.boutonAnnuler:hover {
  background: rgba(232, 99, 122, 0.08);
}

.nomCommentaire {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--primary-dark);
}

.titreCommentaire {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

.noteCommentaire {
  display: flex;
  gap: 0.15rem;
  flex-shrink: 0;
}

.boutonAnnuler {
  justify-self: start;
}

.texteCommentaire {
  margin: 0.9rem 0 0;
  line-height: 1.6;
}

.reponseBloc {
  margin-top: 1rem;
}

.boutonDeplierReponse {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(58, 111, 67, 0.22);
  border-radius: 14px;
  background: rgba(58, 111, 67, 0.08);
  color: var(--primary-dark);
  padding: 0.6rem 0.85rem;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.boutonDeplierReponse:hover {
  transform: translateY(-1px);
  background: rgba(58, 111, 67, 0.12);
  border-color: rgba(58, 111, 67, 0.34);
}

.boutonDeplierReponse.ouvert {
  color: var(--rose-hover);
  background: rgba(232, 99, 122, 0.08);
  border-color: rgba(232, 99, 122, 0.26);
}

.boutonDeplierReponse.ouvert:hover {
  background: rgba(232, 99, 122, 0.12);
  border-color: rgba(232, 99, 122, 0.38);
}

.reponseCommentaire {
  margin-top: 0.75rem;
  padding: 1rem 1.05rem;
  border-radius: 14px;
  background: rgba(58, 111, 67, 0.12);
  border: 1px solid rgba(58, 111, 67, 0.24);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.titreReponse {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-dark);
}

.texteReponse {
  margin: 0.5rem 0 0;
  line-height: 1.6;
  color: #163524;
  font-weight: 500;
}

.zoneFormulaire {
  margin-top: 1.5rem;
}

.carteFormulaire {
  margin-top: 1rem;
  padding: 1.4rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.enteteFormulaire h2 {
  margin: 0;
  font-size: 1.35rem;
  color: var(--primary-dark);
}

.messageFormulaire {
  margin: 1rem 0 0;
  padding: 0.85rem 1rem;
  border-radius: 12px;
}

.messageFormulaire.succes {
  background: #eef7f0;
  color: var(--primary-dark);
}

.messageFormulaire.erreur {
  background: #fff0f4;
  color: #8f1d35;
}

.formCommentaire {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.champFormulaire {
  display: grid;
  gap: 0.5rem;
  color: #334155;
  font-weight: 600;
}

.champFormulaire input,
.champFormulaire textarea {
  width: 100%;
  border: 1px solid rgba(58, 111, 67, 0.18);
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font: inherit;
  color: var(--primary-dark);
  background: #fff;
}

.champFormulaire textarea {
  resize: vertical;
  min-height: 130px;
}

.selectEtoiles {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.etoileChoix {
  border: 0;
  background: transparent;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: rgba(42, 82, 50, 0.2);
  padding: 0;
}

.etoileChoix.remplie {
  color: var(--rose);
}

.etoileChoix.demie {
  background: linear-gradient(
    90deg,
    var(--rose) 50%,
    rgba(42, 82, 50, 0.2) 50%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.noteChoisie {
  color: var(--primary-dark);
  font-weight: 500;
}

@media (max-width: 900px) {
  .zoneCommentaire {
    grid-template-columns: 1fr;
  }

  .conteneurCom {
    width: min(100% - 1rem, 1200px);
  }
}
</style>
