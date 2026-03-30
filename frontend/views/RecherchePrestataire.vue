<template>
  <section class="recherche" id="liste_prestataires">
    <div class="titreFiltre">
      <div class="titreFiltre-inner">
        <span class="titre-label">Annuaire</span>
        <h2 class="titre-main">{{ $t("filter.titleFilter") }}</h2>
      </div>
      <div class="content_slider">
        <span :class="{ active: !isServiceView }">{{
          $t("filter.slider.prestataire")
        }}</span>
        <label class="switch">
          <input type="checkbox" v-model="isServiceView" />
          <span class="slider round"></span>
        </label>
        <span :class="{ active: isServiceView }">{{
          $t("filter.slider.service")
        }}</span>
      </div>
    </div>

    <section class="filtreEtListe">
      <form
        class="filtrePrestataire"
        @submit.prevent="searchPrestataires"
        id="filtre_presta">
        <div class="blocFiltre">
          <span class="filtre-label">{{ $t("filter.name.title") }}</span>
          <div class="input-wrap">
            <svg
              class="input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              v-model="filters.nom"
              type="text"
              :placeholder="$t('filter.name.nameInput')" />
          </div>
        </div>

        <div class="blocFiltre">
          <span class="filtre-label">{{ $t("filter.categorie.title") }}</span>
          <div class="radio-group">
            <label
              class="radio-item pointer"
              :class="{ selected: filters.category === 0 }">
              <input
                type="radio"
                name="categorie"
                :value="0"
                v-model="filters.category" />
              <span>{{ $t("filter.categorie.all") }}</span>
            </label>
            <label
              class="radio-item pointer"
              :class="{
                selected: filters.category === Number(item.id_type_prestataire),
              }"
              v-for="item in type_prestataire"
              :key="item.id_type_prestataire">
              <input
                type="radio"
                name="categorie"
                :value="Number(item.id_type_prestataire)"
                v-model="filters.category" />
              <span>{{ item.nom_type_prestataire[locale] }}</span>
            </label>
          </div>
        </div>

        <div class="blocFiltre" v-if="isServiceView">
          <span class="filtre-label">{{ $t("filter.price.title") }}</span>
          <div class="prix">
            <div class="input-wrap">
              <input
                type="number"
                v-model="filters.prixMin"
                :placeholder="$t('filter.price.minPrice')" />
              <span class="prix-suffix">€</span>
            </div>
            <div class="input-wrap">
              <input
                type="number"
                v-model="filters.prixMax"
                :placeholder="$t('filter.price.maxPrice')" />
              <span class="prix-suffix">€</span>
            </div>
          </div>
        </div>

        <div class="boutonsFiltre">
          <button class="btn-search pointer" type="submit">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              width="16"
              height="16">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {{ $t("filter.button.search") }}
          </button>
          <button class="btn-reset pointer" type="button" @click="resetFilters">
            {{ $t("filter.button.reset") }}
          </button>
        </div>
      </form>

      <section class="listePrestataire">
        <div
          v-for="(item, i) in prestatairesFiltres"
          :key="item.id_prestataire || item.id_service"
          class="blocListePrestataire"
          :style="{ '--i': i }">
          <div class="enTetePrestataire">
            <div class="titrePrestataire">
              <span class="nom-presta">{{
                isServiceView ? item.nom_service : item.nom_prestataire
              }}</span>
            </div>
            <div class="typePrestataire">
              <span>{{ item.nom_type_prestataire[locale] }}</span>
            </div>
          </div>

          <div class="descriptionPrestataire" v-if="!isServiceView">
            <span class="section-label">{{ $t("filter.description") }}</span>
            <div class="descri-content" v-html="item.descri_prestataire"></div>
          </div>
          <div class="blocBasPrestataire">
            <div class="infosPrestataire">
              <span class="section-label">{{ $t("filter.info.title") }}</span>
              <span v-if="!isServiceView">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="13"
                  height="13">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                {{ $t("filter.info.service") }} :
                <strong>{{ item.nb_services }}</strong>
              </span>
              <span v-else>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="13"
                  height="13">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                {{ $t("filter.info.tarif") }} :
                <strong>{{ item.prix }} €</strong>
              </span>
              <span v-if="isServiceView">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="13"
                  height="13">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {{ $t("filter.info.capacite") }} :
                <strong>{{ item.nb_participants }}</strong>
                {{ $t("filter.info.people") }}
              </span>
            </div>

            <div class="contactPrestataire" v-if="!isServiceView">
              <span class="section-label">{{ $t("filter.contact") }}</span>
              <span
                >{{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}</span
              >
              <a :href="'mailto:' + item.mail_prestataire">{{
                item.mail_prestataire
              }}</a>
              <span>{{ item.tel_prestataire }}</span>
            </div>
          </div>
          <div
            class="boutonListe"
            @click="
              goToSpecificPrestataire(item.id_prestataire || item.id_service)
            ">
            <span class="pointer">
              {{ $t("filter.more") }}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="14"
                height="14">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
        <div class="empty-state" v-if="prestatairesFiltres.length === 0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            width="48"
            height="48">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p>Aucun résultat trouvé</p>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNavigationStore } from "@/stores/navigation";
import { useI18n } from "vue-i18n";
import { useServiceStore } from "@/services/service.service";
import { usePrestataireStore } from "@/services/prestataire.service";
import { useTypePrestataireStore } from "@/services/type_prestataire.service";

const router = useRouter();
const route = useRoute();
const navStore = useNavigationStore();
const serviceStore = useServiceStore();
const prestataireStore = usePrestataireStore();
const typePrestataireStore = useTypePrestataireStore();
const { t, locale } = useI18n();

const isServiceView = ref(false);
watch(isServiceView, (newValue) => {
  try {
    filters.value.prixMin = null;
    filters.value.prixMax = null;

    searchPrestataires();
  } catch (err) {
    console.error(err);
  }
});
const type_prestataire = ref([]);
const prestataires = ref([]);
const filters = ref({
  nom: route.query.nom || "",
  category: route.query.category ? Number(route.query.category) : 0,
  prixMin: route.query.prixMin || null,
  prixMax: route.query.prixMax || null,
});

const appliedFilters = ref({
  nom: "",
  category: 0,
  prixMin: null,
  prixMax: null,
});

const prestatairesFiltres = computed(() => {
  return prestataires.value
    .filter((p) => !p.waitingforadmin)

    .filter((p) => {
      if (!appliedFilters.value.nom) return true;

      const nom = isServiceView.value ? p.nom_service : p.nom_prestataire;

      return nom
        ?.toLowerCase()
        .includes(appliedFilters.value.nom.toLowerCase());
    })

    .filter((p) => {
      if (!appliedFilters.value.category || appliedFilters.value.category === 0)
        return true;

      return (
        Number(p.id_type_prestataire) === Number(appliedFilters.value.category)
      );
    })

    .filter((p) => {
      if (!isServiceView.value) return true;

      if (appliedFilters.value.prixMin && p.prix < appliedFilters.value.prixMin)
        return false;

      if (appliedFilters.value.prixMax && p.prix > appliedFilters.value.prixMax)
        return false;

      return true;
    });
});

onMounted(() => {
  try {
    getValuesTypePrestataire();

    if (Object.keys(route.query).length > 0) {
      searchPrestataires();
    } else {
      getValuesPrestataire();
    }
  } catch (err) {
    console.error(err);
  }
});

/**
 * Réinitialise les filtres de recherche et recharge la liste complète des prestataires.
*/
function resetFilters() {
  filters.value = {
    nom: "",
    category: 0,
    prixMin: null,
    prixMax: null,
  };

  appliedFilters.value = { ...filters.value };

  router.push({ path: "/", query: {}, hash: "#liste_prestataires" });
  getValuesPrestataire();
}
/**
 * Redirige vers la page de détail d’un prestataire ou d’un service
 * tout en sauvegardant la route actuelle dans le store de navigation.
*/
function goToSpecificPrestataire(idPresta) {
  navStore.previousRoute = {
    path: route.path,
    query: route.query,
    hash: "#liste_prestataires",
  };
  router.push({
    name: "ShowPrestataire",
    params: {
      id: idPresta,
    },
  });
}

//=========================
//==== Async functions ====
//=========================
/**
 * Récupère la liste des services depuis l’API et met à jour la liste locale des prestataires.
*/
async function getValuesServices() {
  try {
    const res = await serviceStore.GetServices();
    // Vérifier que res.data est un tableau
    if (res && res.data && Array.isArray(res.data)) {
      prestataires.value = res.data.services;
    } else {
      console.error("Les données reçues ne sont pas un tableau:", res);
      prestataires.value = [];
    }
  } catch (err) {
    console.error(err);
    prestataires.value = [];
  }
}
/**
 * Récupère la liste des prestataires depuis l’API et met à jour la liste locale.
*/
async function getValuesPrestataire() {
  try {
    const res = await prestataireStore.GetPrestataires();
    // Vérifier que res.data est un tableau
    if (res && res.data && Array.isArray(res.data)) {
      prestataires.value = res.data;
    } else {
      console.error("Les données reçues ne sont pas un tableau:", res);
      prestataires.value = [];
    }
  } catch (err) {
    console.error(err);
    prestataires.value = [];
  }
}
/**
 * Récupère la liste des types de prestataires depuis l’API.
*/
async function getValuesTypePrestataire() {
  try {
    const res = await typePrestataireStore.GetTypePrestataires();
    // Vérifier que res.data.result est un tableau
    if (res && res.data && res.data.result && Array.isArray(res.data.result)) {
      type_prestataire.value = res.data.result;
    } else {
      console.error("Les données reçues ne sont pas valides:", res);
      type_prestataire.value = [];
    }
  } catch (err) {
    console.error(err);
    type_prestataire.value = [];
  }
}
/**
 * Applique les filtres de recherche et met à jour l’URL avec les paramètres sélectionnés.
*/
async function searchPrestataires() {
  appliedFilters.value = {
    nom: filters.value.nom,
    category: filters.value.category,
    prixMin: filters.value.prixMin,
    prixMax: filters.value.prixMax,
  };

  router.push({
    path: "/",
    query: {
      nom: filters.value.nom || undefined,
      category: filters.value.category || undefined,
      prixMin: filters.value.prixMin || undefined,
      prixMax: filters.value.prixMax || undefined,
    },
    hash: "#liste_prestataires",
  });
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  transition: 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 3px;
  background: #fff;
  transition: 0.3s;
}

input:checked + .slider {
  background: var(--rose-logo);
  border-color: var(--rose-logo);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* =====================
   HEADER SECTION
===================== */
.recherche {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #242424cc, black);
}

.titreFiltre {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 50px 60px 40px;
  background: linear-gradient(135deg, --primary-color 0%, --couleur-fond 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.titreFiltre::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: var(--rose-logo);
  opacity: 0.06;
  pointer-events: none;
}

.titreFiltre-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.titre-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--rose-logo);
}

.titre-main {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.content_slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content_slider span {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.2s;
}

.content_slider span.active {
  color: #fff;
  font-weight: 700;
}

.filtreEtListe {
  display: flex;
  min-height: 600px;
}

.filtrePrestataire {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 32px 24px;
  background: linear-gradient(to bottom, #3e3e3e, black);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  height: fit-content;
  position: sticky;
  top: 0;
}

.filtre-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
}

.blocFiltre {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.blocFiltre input[type="text"],
.blocFiltre input[type="number"] {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  color: #fff;
  font-size: 0.88rem;
  transition:
    border-color 0.2s,
    background 0.2s;
  outline: none;
}

.blocFiltre input[type="number"] {
  padding-left: 12px;
}

.blocFiltre input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.blocFiltre input:focus {
  border-color: var(--rose-logo);
  background: rgba(255, 255, 255, 0.1);
}

.prix {
  display: flex;
  gap: 10px;
}

.prix-suffix {
  position: absolute;
  right: 10px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.82rem;
  pointer-events: none;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.88rem;
  transition: all 0.2s;
  cursor: pointer;
}

.radio-item input {
  display: none;
}

.radio-item::before {
  content: "";
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  transition: all 0.2s;
}

.radio-item.selected {
  background: rgba(232, 80, 130, 0.12);
  border-color: rgba(232, 80, 130, 0.4);
  color: #fff;
}

.radio-item.selected::before {
  background: var(--rose-logo);
  border-color: var(--rose-logo);
  box-shadow: 0 0 8px rgba(232, 80, 130, 0.5);
}

.boutonsFiltre {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.btn-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  background: var(--rose-logo);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(232, 80, 130, 0.35);
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(232, 80, 130, 0.5);
}

.btn-reset {
  padding: 10px 20px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.82rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.25);
}

.listePrestataire {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 20px;
  padding: 32px;
  background: linear-gradient(to bottom, #3e3e3e, black);
}

.blocListePrestataire {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 380px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    border-color 0.3s;
  animation: cardIn 0.4s ease both;
  animation-delay: calc(var(--i, 0) * 0.06s);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blocListePrestataire:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: rgba(232, 80, 130, 0.3);
  box-shadow:
    0 0 0 1px rgba(232, 80, 130, 0.15),
    0 12px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(232, 80, 130, 0.08);
}

.enTetePrestataire {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.nom-presta {
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.typePrestataire {
  flex-shrink: 0;
  padding: 4px 10px;
  background: rgba(232, 80, 130, 0.15);
  border: 1px solid rgba(232, 80, 130, 0.3);
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rose-logo);
}

.descriptionPrestataire {
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.section-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 6px;
}

.descri-content {
  font-size: 0.83rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blocBasPrestataire {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.infosPrestataire,
.contactPrestataire {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 140px;
}

.infosPrestataire span,
.contactPrestataire span,
.contactPrestataire a {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.contactPrestataire a:hover {
  color: var(--rose-logo);
}

.infosPrestataire span:not(:first-child) strong,
.infosPrestataire span strong {
  color: #fff;
}

.boutonListe {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
}

.boutonListe span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rose-logo);
  transition: gap 0.2s ease;
}

.boutonListe span:hover {
  gap: 10px;
}

.empty-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.2);
}

.empty-state p {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}
</style>
