<template>
  <div class="mes-billets-page">
    <NavView />
    <div class="content">
      <h1>{{ $t("billet.mesBillets") }}</h1>

      <div v-if="!userStore.isConnected" class="empty">
        <p>Veuillez vous connecter pour consulter vos billets.</p>
      </div>

      <div v-else>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else>
          <div v-if="billets.length === 0" class="empty">
            <p>{{ $t("billet.aucunBillets") }}</p>
          </div>

          <table v-else class="billets-table">
            <thead>
              <tr>
                <th>{{ $t("billet.Zone") }}</th>
                <th>{{ $t("billet.Match") }}</th>
                <th>{{ $t("billet.Place") }}</th>
                <th>{{ $t("billet.Date") }}</th>
                <th>{{ $t("billet.Heure") }}</th>
                <th>{{ $t("billet.Prix") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, index) in billets" :key="index">
                <td>{{ b.zone }}</td>
                <!-- <td>{{ b }}</td> -->
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
               
              </tr>
            </tbody>
          </table>
          <div v-if="billets.length == 0">
            <p></p>
          </div>
          <div v-else>
            <router-link
              :to="{
                name: 'Remboursement',
                params: { lang: $route.params.lang },
              }"
              class="btn btn-checkout">
              {{ $t("billet.remboursement") }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- #######################      terrain_id INTEGER REFERENCES Terrain(id_terrain), ca ligne 183 init.js #######################-->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { usePanierStore } from "@/services/panier.service";
import { useI18n } from "vue-i18n";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter();
const { locale } = useI18n();
const userStore = useUserStore();
const panierStore = usePanierStore();
const billets = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(() => {
  if (userStore.isConnected) fetchBillets();
});

/**
 * Calcule le prix d’un billet en fonction de la colonne du siège.
 *
 * Règles :
 * - Colonnes I / H / G → 25€
 * - Colonnes F / E / D → 18€
 * - Autres colonnes → 12€
 *
 * @param {Object} seat - Objet représentant un siège
 * @param {string} seat.numero_colonne - Lettre de la colonne
 * @returns {number} Prix du billet en euros
 */
function getPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}
/**
 * Formate une date en fonction de la langue active (i18n).
 *
 * - Format français : "27 mars 2026"
 * - Format anglais : "27 March 2026"
 *
 * Utilise le fuseau UTC pour éviter les décalages.
 *
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date formatée selon la locale
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const currentLocale = locale.value === "en" ? "en-GB" : "fr-FR";

  return date.toLocaleDateString(currentLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
/**
 * Redirige l’utilisateur vers la page d’un match spécifique.
 *
 * Vérifie que l'identifiant du match est valide avant navigation.
 *
 * @param {number|string} idTerrain - Identifiant du terrain
 * @param {number|string} idMatch - Identifiant du match
 */
function goToMatch(idTerrain, idMatch) {
  if (!idMatch) {
    console.log("Je suis dans le if de goToMatch");
    return;
  }
  router.push({ name: "Terrain", params: { id: idTerrain, idMatch: idMatch } });
}
/**
 * Récupère les billets de l’utilisateur connecté depuis l’API.
 *
 * - Vérifie que l’utilisateur est connecté
 * - Appelle le service panier
 * - Met à jour la liste des billets
 * - Gère les erreurs d’appel API
 *
 * @async
 */
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

.empty {
  padding: 1rem;
  background: #fff6e6;
  border-radius: 8px;
}

.error {
  color: red;
}

.btn-checkout {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 0.9rem 1.4rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #3a6f43 0%, #2a5232 100%);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(42, 82, 50, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(42, 82, 50, 0.26);
  filter: brightness(1.05);
}
</style>
