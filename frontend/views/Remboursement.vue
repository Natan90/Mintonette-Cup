<template>
  <div class="mes-billets-page">
    <NavView />
    <div class="content">
      <h1>Remboursement</h1>

      <div v-if="!userStore.isConnected" class="empty">
        <p>Veuillez vous connecter pour consulter vos billets.</p>
      </div>
      <div v-else>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else>
          <div v-if="billets.length === 0" class="empty">
            <p>Vous n'avez aucun billet réservé.</p>
          </div>

          <div v-else>
            <div class="remboursement-section">
              <div class="form-group">
                <label for="raison">Raison du remboursement :</label>
                <select
                  id="raison"
                  v-model="raisonRemboursement"
                  class="select-raison">
                  <option value="">-- Sélectionnez une raison --</option>
                  <option value="annulation_match">Annulation du match</option>
                  <option value="erreur_reservation">
                    Erreur de réservation
                  </option>
                  <option value="empechement">Empêchement personnel</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <table class="billets-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Match</th>
                  <th>Place</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Prix</th>
                  <th>
                    <input
                      type="checkbox"
                      :checked="allSelected"
                      @change="toggleSelectAll" />
                    <span>Sélectionner tout</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(b, index) in billets" :key="index">
                  <td>{{ b.zone }}</td>
                  <td>{{ b.equipe1 }} VS {{ b.equipe2 }}</td>
                  <td>{{ b.numero_colonne }}{{ b.numero_ligne }}</td>
                  <td>{{ formatDate(b.date_match) }}</td>
                  <td>
                    <span v-if="b.date_match">
                      {{
                        new Date(b.date_match).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        })
                      }}
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td>{{ getPrice(b) }} €</td>
                  <td>
                    <input
                      type="checkbox"
                      :value="b"
                      v-model="selectedBillets" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="selectedBillets.length > 0" class="button-section">
              <button
                class="btn-rembourser"
                :disabled="!raisonRemboursement"
                @click="askReimbursementAndSendMailToAdmin()">
                <div v-if="selectedBillets.length <= 1">
                  Demander le remboursement (
                  {{ selectedBillets.length }} billet )
                </div>
                <div v-else-if="selectedBillets.length > 1">
                  Demander le remboursement ( {{ selectedBillets.length }}
                  billets )
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
import { usePanierStore } from "@/services/panier.service";
import { useMailBoxStore } from "@/services/reception_box.service";
import { useGradinStore } from "@/services/gradin.service";
import { useAdminAPIStore } from "@/services/admin.service";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const panierStore = usePanierStore();
const mailBoxStore = useMailBoxStore();
const adminAPIStore = useAdminAPIStore();
const gradinStore = useGradinStore();
const billets = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedBillets = ref([]);
const raisonRemboursement = ref("");
const panier = ref([]);
const userData = ref({
  prenom: "",
  nom: "",
  email: "",
});

const allSelected = computed(() => {
  return (
    billets.value.length > 0 &&
    selectedBillets.value.length === billets.value.length
  );
});
function toggleSelectAll() {
  if (allSelected.value) {
    selectedBillets.value = [];
  } else {
    selectedBillets.value = [...billets.value];
  }
}

function getPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function askReimbursementAndSendMailToAdmin() {
  if (!raisonRemboursement.value) {
    alert("Veuillez sélectionner une raison de remboursement");
    return;
  }

  if (selectedBillets.value.length === 0) {
    alert("Veuillez sélectionner au moins un billet");
    return;
  }

  await sendMailToAdmin();

  await askReimbursement();

  alert("L'administrateur a été averti de votre remboursement avec succès !");
  selectedBillets.value = [];
  raisonRemboursement.value = "";
  router.push({
    name: "MesBillets",
    params: {
      lang: route.params.lang,
    },
  });
}

async function askReimbursement() {
  try {
    for (const seat of selectedBillets.value) {
      await gradinStore.UpdateGradin({
        matchId: seat.match_id,
        numero_colonne: seat.numero_colonne,
        numero_ligne: seat.numero_ligne,
        zone: seat.zone,
        est_reserve: false,
        id_utilisateur: null,
      });

      await panierStore.RemoveBillet(userStore.userId, seat);
    }

    selectedBillets.value.forEach((seat) => {
      const index = billets.value.findIndex(
        (b) =>
          b.match_id === seat.match_id &&
          b.numero_colonne === seat.numero_colonne &&
          b.numero_ligne === seat.numero_ligne &&
          b.zone === seat.zone,
      );
      if (index !== -1) {
        billets.value.splice(index, 1);
      }
    });
  } catch (err) {
    console.error("Erreur lors de la demande de remboursement:", err);
    alert("Une erreur est survenue lors de la demande de remboursement");
  }
}

async function sendMailToAdmin() {
  try {
    let detailsBillets = "";
    let montantTotal = 0;

    selectedBillets.value.forEach((billet, index) => {
      const prix = getPrice(billet);
      montantTotal += prix;
      detailsBillets += `${index + 1}. ${billet.equipe1} VS ${billet.equipe2} - Zone ${billet.zone} - Place ${billet.numero_colonne}${billet.numero_ligne} - ${formatDate(billet.date_match)} - ${prix}€\n`;
    });

    const raisonsTraduction = {
      annulation_match: t("Annulation du match", "Annulation du match"),
      erreur_reservation: t("Erreur de réservation", "Erreur de réservation"),
      empechement: t("Empêchement personnel", "Empêchement personnel"),
      autre: t("Autre", "Autre"),
    };

    const raisonTexte =
      raisonsTraduction[raisonRemboursement.value] || raisonRemboursement.value;

    const subject = t("mailToSend.demandeRemboursement.subject");
    const message = t("mailToSend.demandeRemboursement.message", {
      nbBillets: selectedBillets.value.length,
      nomUtilisateur: userData.value.prenom + " " + userData.value.nom,
      emailUtilisateur: userData.value.email,
      raison: raisonTexte,
      detailsBillets: detailsBillets,
      montantTotal: montantTotal,
    });

    const id_admin = 1;
    const id_type_message = 4;

    await mailBoxStore.sendMessageTo(userStore.userId, {
      id_user_to: id_admin,
      subject,
      message,
      id_type_message,
    });
  } catch (err) {
    console.error(
      "Erreur lors de l'envoi de la demande de remboursement:",
      err,
    );
    alert(
      "Une erreur est survenue lors de l'envoi de la demande de remboursement",
    );
  }
}

async function fetchBillets() {
  if (!userStore.userId) return;
  error.value = null;
  try {
    const res = await panierStore.GetBilletsByUser(userStore.userId);
    billets.value = res.data;
  } catch (err) {
    console.error("Erreur en récupérant les billets :", err);
    error.value = "Impossible de récupérer vos billets pour le moment.";
  }
}

async function fetchUserData() {
  try {
    const response = await adminAPIStore.GetCurrentUser();
    userData.value = {
      prenom: response.data.prenom_utilisateur || "",
      nom: response.data.nom_utilisateur || "",
      email: response.data.mail_utilisateur || "",
    };
  } catch (err) {
    console.error("Erreur en récupérant les données utilisateur :", err);
  }
}

onMounted(() => {
  if (userStore.isConnected) {
    fetchBillets();
    fetchUserData();
  }
});
</script>

<style scoped>
.mes-billets-page {
  min-height: calc(100vh - 200px);
}

.content {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
}

.billets-table {
  width: 100%;
  border-collapse: collapse;
}

.billets-table th,
.billets-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.remboursement-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.button-section {
  margin-top: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.select-raison {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.select-raison:hover {
  border-color: #888;
}

.select-raison:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn-rembourser {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-rembourser:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-rembourser:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.empty {
  padding: 1rem;
  background: #fff6e6;
  border-radius: 8px;
}

.error {
  color: red;
}
</style>
