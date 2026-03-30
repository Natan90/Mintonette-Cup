import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePrestataireInfoStore = defineStore("prestataireInfo", () => {
  const lastUserId = ref(localStorage.getItem("lastUserId") || null);
  const selectedIndex = ref(Number(localStorage.getItem("selectedIndex")) || 0);
  const selectedTypeId = ref(Number(localStorage.getItem("selectedTypeId")) || 1);
  const checkedItem = ref(JSON.parse(localStorage.getItem("checkedItem") || "[]"));
  const continueInscription = ref(localStorage.getItem("continueInscription") === "true");
  const nom = ref(localStorage.getItem("nom") || "");
  const descri = ref(localStorage.getItem("descri") || "");
  const mail = ref(localStorage.getItem("mail") || "");
  const tel = ref(localStorage.getItem("tel") || "");
  const nomService = ref(localStorage.getItem("nomService") || "");
  const descriService = ref(JSON.parse(localStorage.getItem("descriService") || '{"fr":"","en":""}'));
  const besoinService = ref(JSON.parse(localStorage.getItem("besoinService") || '{"fr":"","en":""}'));
  const visiblePublic = ref(localStorage.getItem("visiblePublic") === "true");
  const activate = ref(localStorage.getItem("activate") === "true");

  // Activité
  const nom_activite = ref(localStorage.getItem("nom_activite") || "");
  const nb_participants = ref(Number(localStorage.getItem("nb_participants")) || 0);
  const prix_activite = ref(Number(localStorage.getItem("prix_activite")) || 0);
  const date_activite = ref(localStorage.getItem("date_activite") || null);
  const heure_activite = ref(localStorage.getItem("heure_activite") || null);
  const activitesList = ref(JSON.parse(localStorage.getItem("activitesList") || "[]"));

  // Article
  const nom_article = ref(localStorage.getItem("nom_article") || "");
  const stock_article = ref(Number(localStorage.getItem("stock_article")) || 0);
  const prix_article = ref(Number(localStorage.getItem("prix_article")) || 0);
  const articlesList = ref(JSON.parse(localStorage.getItem("articlesList") || "[]"));

  function clearStore() {
    selectedIndex.value = 0;
    selectedTypeId.value = 1;
    checkedItem.value = [];
    continueInscription.value = false;
    nom.value = "";
    descri.value = "";
    mail.value = "";
    tel.value = "";
    nomService.value = "";
    descriService.value = { fr: "", en: "" };
    besoinService.value = { fr: "", en: "" };
    visiblePublic.value = true;
    activate.value = false;

    clearItemsStore();

    localStorage.removeItem("selectedIndex");
    localStorage.removeItem("selectedTypeId");
    localStorage.removeItem("checkedItem");
    localStorage.removeItem("continueInscription");
    localStorage.removeItem("nom");
    localStorage.removeItem("descri");
    localStorage.removeItem("mail");
    localStorage.removeItem("tel");
    localStorage.removeItem("nomService");
    localStorage.removeItem("descriService");
    localStorage.removeItem("besoinService");
    localStorage.removeItem("visiblePublic");
    localStorage.removeItem("activate");
  }

  function clearItemsStore() {
  nom_activite.value = "";
  nb_participants.value = 0;
  prix_activite.value = 0;
  date_activite.value = null;
  heure_activite.value = null;
  activitesList.value = [];

  nom_article.value = "";
  stock_article.value = 0;
  prix_article.value = 0;
  articlesList.value = [];

  localStorage.removeItem("nom_activite");
  localStorage.removeItem("nb_participants");
  localStorage.removeItem("prix_activite");
  localStorage.removeItem("date_activite");
  localStorage.removeItem("heure_activite");
  localStorage.removeItem("activitesList");
  localStorage.removeItem("nom_article");
  localStorage.removeItem("stock_article");
  localStorage.removeItem("prix_article");
  localStorage.removeItem("articlesList");
}

  watch(lastUserId, (v) => {
    if (v) localStorage.setItem("lastUserId", v);
    else localStorage.removeItem("lastUserId");
  });
  watch(selectedIndex, (v) => localStorage.setItem("selectedIndex", v));
  watch(checkedItem, (v) => localStorage.setItem("checkedItem", JSON.stringify(v)), { deep: true });
  watch(selectedTypeId, (v) => localStorage.setItem("selectedTypeId", v));
  watch(continueInscription, (v) => localStorage.setItem("continueInscription", v));
  watch(nom, (v) => localStorage.setItem("nom", v));
  watch(descri, (v) => localStorage.setItem("descri", v));
  watch(mail, (v) => localStorage.setItem("mail", v));
  watch(tel, (v) => localStorage.setItem("tel", v));
  watch(nomService, (v) => localStorage.setItem("nomService", v));
  watch(descriService, (v) => localStorage.setItem("descriService", JSON.stringify(v)), { deep: true });
  watch(besoinService, (v) => localStorage.setItem("besoinService", JSON.stringify(v)), { deep: true });
  watch(visiblePublic, (v) => localStorage.setItem("visiblePublic", v));
  watch(activate, (v) => localStorage.setItem("activate", v));

  watch(nom_activite, (v) => localStorage.setItem("nom_activite", v));
  watch(nb_participants, (v) => localStorage.setItem("nb_participants", v));
  watch(prix_activite, (v) => localStorage.setItem("prix_activite", v));
  watch(date_activite, (v) => {
    if (v) localStorage.setItem("date_activite", v);
    else localStorage.removeItem("date_activite");
  });
  watch(heure_activite, (v) => {
    if (v) localStorage.setItem("heure_activite", v);
    else localStorage.removeItem("heure_activite");
  });
  watch(activitesList, (v) => localStorage.setItem("activitesList", JSON.stringify(v)), { deep: true });

  watch(nom_article, (v) => localStorage.setItem("nom_article", v));
  watch(stock_article, (v) => localStorage.setItem("stock_article", v));
  watch(prix_article, (v) => localStorage.setItem("prix_article", v));
  watch(articlesList, (v) => localStorage.setItem("articlesList", JSON.stringify(v)), { deep: true });

  return {
    lastUserId,
    selectedTypeId,
    selectedIndex, checkedItem, continueInscription,
    nom, descri, mail, tel,
    nomService, descriService, besoinService,
    visiblePublic, activate,
    nom_activite, nb_participants, prix_activite, date_activite, heure_activite, activitesList, 
    nom_article, stock_article, prix_article, articlesList,
    clearStore, clearItemsStore
  };
});