<template>
  <div class="mes-billets-page">
    <NavView />
    <div class="content">
      <h1>Remboursement</h1>

      <div v-if="!userStore.isConnected" class="empty">
        <p>Veuillez vous connecter pour consulter vos billets.</p>
      </div>
<!-- ###################################################################################################### finir mail pour admin ###################################################################################################### -->
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
                  <th>Action</th>
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
                @click="sendMailToAdmin()">
                <div v-if="selectedBillets.length <= 1">
                  Demander le remboursement ( {{ selectedBillets.length }} billet
                  )
                </div>
                <div v-else-if="selectedBillets.length > 1">
                  Demander le remboursement ( {{
                    selectedBillets.length
                  }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { usePanierStore } from "@/services/panier.service";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter();
const userStore = useUserStore();
const panierStore = usePanierStore();
const billets = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedBillets = ref([]);
const raisonRemboursement = ref("");

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


async function demanderRemboursement() {
  if (!raisonRemboursement.value) {
    alert("Veuillez sélectionner une raison de remboursement");
    return;
  }

  if (selectedBillets.value.length === 0) {
    alert("Veuillez sélectionner au moins un billet");
    return;
  }

  try {
    alert(
      `Demande de remboursement envoyée pour ${selectedBillets.value.length} billet(s)\nRaison: ${raisonRemboursement.value}`,
    );
    selectedBillets.value = [];
    raisonRemboursement.value = "";
    await fetchBillets();
  } catch (err) {
    console.error("Erreur lors de la demande de remboursement:", err);
    alert("Une erreur est survenue lors de la demande de remboursement");
  } 
}

async function sendMailToAdmin(isModif) {
  const path = isModif
    ? "mailToSend.modifPresta"
    : "mailToSend.demandePresta";

  const subject = t(`${path}.subject`);

  const message = t(`${path}.message`, {
    nom: nom_presta.value,
    email: mail_presta.value,
    telephone: tel_presta.value,
    type: selectedType.value,
    specificite: selectedNames.value.join(", ")
  });
  console.log("USER ID:", userStore.userId);



  const id_admin = 1;
  let id_type_message = isModif ? 2 : 1;
  try {
    const res = await mailBoxStore.sendMessageTo(userStore.userId, { 
      id_user_to: id_admin, 
      subject, 
      message, 
      id_type_message 
    });

  } catch (err) {
    console.error(err);
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

onMounted(() => {
  if (userStore.isConnected) fetchBillets();
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
