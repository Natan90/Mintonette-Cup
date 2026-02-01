<template>
  <NavView />
  <div class="checkout-container">
    <div class="checkout-content">
      <h1>Finaliser votre commande</h1>

      <div class="checkout-grid">
        <div class="order-summary">
          <h2>Résumé de commande</h2>
          <div class="summary-items">
            <div
              v-for="(item, index) in panier"
              :key="index"
              class="summary-item">
              <span
                >{{ item.numero_colonne }}{{ item.numero_ligne }} (Zone
                {{ item.zone }})</span
              >
              <span class="price">{{ getPrice(item) }} €</span>
            </div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-total">
            <span>Total :</span>
            <span class="total-price">{{ total }} €</span>
          </div>
        </div>

        <div class="payment-form">
          <h2>Informations de paiement</h2>

          <div class="form-section">
            <h3>Vos coordonnées</h3>
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input
                v-model="form.prenom"
                type="text"
                id="prenom"
                placeholder="Jean" />
            </div>

            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                v-model="form.nom"
                type="text"
                id="nom"
                placeholder="Dupont" />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                placeholder="jean.dupont@email.com" />
            </div>

            <div class="form-group">
              <label for="tel">Téléphone</label>
              <input
                v-model="form.tel"
                type="tel"
                id="tel"
                placeholder="06 12 34 56 78" />
            </div>
          </div>

          <div class="form-section">
            <h3>Adresse de facturation</h3>
            <div class="form-group">
              <label for="adresse">Adresse</label>
              <input
                v-model="form.adresse"
                type="text"
                id="adresse"
                placeholder="123 Rue de la Paix" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="codepostal">Code postal</label>
                <input
                  v-model="form.codepostal"
                  type="text"
                  id="codepostal"
                  placeholder="75000" />
              </div>

              <div class="form-group">
                <label for="ville">Ville</label>
                <input
                  v-model="form.ville"
                  type="text"
                  id="ville"
                  placeholder="Paris" />
              </div>
            </div>
          </div>

          <!-- Informations bancaires -->
          <div class="form-section">
            <h3>Informations bancaires</h3>
            <div class="form-group">
              <label for="nomcarte">Nom du titulaire de la carte</label>
              <input
                v-model="form.nomcarte"
                type="text"
                id="nomcarte"
                placeholder="JEAN DUPONT" />
            </div>

            <div class="form-group">
              <label for="numerocarte">Numéro de carte</label>
              <input
                v-model="form.numerocarte"
                type="text"
                id="numerocarte"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="formatCardNumber" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiration">Date d'expiration</label>
                <input
                  v-model="form.expiration"
                  type="text"
                  id="expiration"
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiration" />
              </div>

              <div class="form-group">
                <label for="cvv">CVV</label>
                <input
                  v-model="form.cvv"
                  type="text"
                  id="cvv"
                  placeholder="123"
                  maxlength="3" />
              </div>
            </div>
          </div>

          <div class="form-group checkbox">
            <input v-model="form.termsAccepted" type="checkbox" id="terms" />
            <label for="terms"
              >J'accepte les conditions d'utilisation et la politique de
              confidentialité</label
            >
          </div>

          <div class="button-group">
            <button @click="goBackToCart" class="btn btn-secondary">
              Retour au panier
            </button>
            <!-- <button
              @click="addTestSeats"
              class="btn btn-test"
              title="Ajouter des places de test (dev)">
              + Test
            </button> -->
            <button
              @click="processPayment"
              class="btn btn-primary"
              :disabled="!isFormValid">
              {{ isProcessing ? "Traitement en cours..." : `Payer ${total} €` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import NavView from "@/components/NavView.vue";
import Footer from "@/components/Footer.vue";
import { usePanierStore } from "@/services/panier.service";
import { useGradinStore } from "@/services/gradin.service";
import { useAdminAPIStore } from "@/services/admin.service";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const panierStore = usePanierStore();
const gradinStore = useGradinStore();
const adminAPIStore = useAdminAPIStore();

const panier = ref([]);
const isProcessing = ref(false);

const form = ref({
  prenom: "",
  nom: "",
  email: "",
  tel: "",
  adresse: "",
  codepostal: "",
  ville: "",
  nomcarte: "",
  numerocarte: "",
  expiration: "",
  cvv: "",
  termsAccepted: false,
});

const total = computed(() => {
  return panier.value.reduce((sum, seat) => sum + getPrice(seat), 0);
});

const isFormValid = computed(() => {
  return (
    form.value.prenom &&
    form.value.nom &&
    form.value.email &&
    form.value.tel &&
    form.value.adresse &&
    form.value.codepostal &&
    form.value.ville &&
    form.value.nomcarte &&
    form.value.numerocarte.length >= 16 &&
    form.value.expiration.length === 5 &&
    form.value.cvv.length === 3 &&
    form.value.termsAccepted
  );
});

async function fetchUserInfo() {
  try {
    if (!userStore.userId) {
      console.log("UserId n'est pas rempli");
    }
    const res = await adminAPIStore.GetUtilisateurById(userStore.userId);
    const user = res.data;

    form.value.prenom = user.prenom_utilisateur || "";
    form.value.nom = user.nom_utilisateur || "";
    form.value.email = user.mail_utilisateur || "";
    form.value.tel = user.tel_utilisateur || "";
    form.value.adresse = user.adresse || "";
    form.value.codepostal = user.code_postal || "";
    form.value.ville = user.ville || "";
  } catch (err) {
    console.error("Erreur fetchUserInfo:", err);
  }
}
function getPrice(seat) {
  if (["I", "H", "G"].includes(seat.numero_colonne)) return 25;
  if (["F", "E", "D"].includes(seat.numero_colonne)) return 18;
  return 12;
}

async function fetchPanier() {
  try {
    const res = await panierStore.GetPanierByUser(userStore.userId);
    panier.value = res.data;
    console.log("Panier chargé:", panier.value);

    if (panier.value.length === 0) {
      console.warn("Le panier est vide");
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du panier:", err);
    const savedSeats = localStorage.getItem("selectedSeats");
    if (savedSeats) {
      try {
        panier.value = JSON.parse(savedSeats);
        console.log("Panier chargé depuis localStorage:", panier.value);
      } catch (e) {
        console.error("Erreur lors du parsing de localStorage:", e);
      }
    }
  }
}

function formatCardNumber(event) {
  let value = form.value.numerocarte.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  form.value.numerocarte = formattedValue;
}

function formatExpiration(event) {
  let value = form.value.expiration.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  form.value.expiration = value;
}

async function processPayment() {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  if (panier.value.length === 0) {
    alert("Votre panier est vide");
    return;
  }

  isProcessing.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Préparer les données pour payPanier
    const sieges = panier.value.map((seat) => ({
      match_id: seat.match_id ?? seat.matchId ?? null,
      numero_colonne: seat.numero_colonne,
      numero_ligne: seat.numero_ligne,
      zone: seat.zone,
      prix: getPrice(seat),
    }));

    const services = [];

    await panierStore.PayPanier(
      userStore.userId,
      sieges,
      services,
      total.value,
    );

    await panierStore.ClearPanier(userStore.userId);

    localStorage.removeItem("selectedSeats");

    alert("Paiement réussi ! Vos billets ont été confirmés.");

    router.push({ name: "MesBillets", params: { lang: route.params.lang } });
  } catch (error) {
    console.error("Erreur lors du paiement:", error);
    alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
  } finally {
    isProcessing.value = false;
  }
}

function goBackToCart() {
  router.back();
}

function addTestSeats() {
  const testSeats = [
    { numero_colonne: "A", numero_ligne: 1, zone: "Nord" },
    { numero_colonne: "B", numero_ligne: 2, zone: "Nord" },
    { numero_colonne: "H", numero_ligne: 5, zone: "Est" },
  ];
  panier.value = testSeats;
  alert(`${testSeats.length} places de test ajoutées`);
}

onMounted(() => {
  fetchPanier();
  fetchUserInfo();
  // if (userStore.userId) {
  //   // Les données devraient être chargées depuis le userStore ou depuis l'API
  //   // Pour l'instant, c'est une placeholder
  // }
});
</script>

<style scoped>
.checkout-container {
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 2em;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  align-items: start;
}

.order-summary {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  height: fit-content;
}

.order-summary h2 {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95em;
}

.summary-item .price {
  font-weight: bold;
  color: #28a745;
}

.summary-divider {
  height: 2px;
  background: #eee;
  margin: 15px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #007bff;
  font-size: 1.5em;
}

.payment-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-form h2 {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 30px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  font-size: 1em;
  color: #666;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.form-group.checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-group.checkbox label {
  cursor: pointer;
  margin: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.95em;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  background: #f8f9ff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
}

.btn-test {
  background: #ffc107;
  color: #333;
  font-size: 0.9em;
  flex: 0 1 auto;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .checkout-container {
    padding: 20px 10px;
  }

  .payment-form,
  .order-summary {
    padding: 20px;
  }

  h1 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
