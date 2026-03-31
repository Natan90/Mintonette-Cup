import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePrestataireInfoStore = defineStore("prestataireInfo", () => {
  const lastUserId = ref(sessionStorage.getItem("lastUserId") || null);
  const selectedIndex = ref(Number(sessionStorage.getItem("selectedIndex")) || 0);
  const selectedTypeId = ref(Number(sessionStorage.getItem("selectedTypeId")) || 1);
  const checkedItem = ref(JSON.parse(sessionStorage.getItem("checkedItem") || "[]"));
  const continueInscription = ref(sessionStorage.getItem("continueInscription") === "true");
  const nom = ref(sessionStorage.getItem("nom") || "");
  const descri = ref(sessionStorage.getItem("descri") || "");
  const mail = ref(sessionStorage.getItem("mail") || "");
  const tel = ref(sessionStorage.getItem("tel") || "");
  const nomService = ref(sessionStorage.getItem("nomService") || "");
  const descriService = ref(JSON.parse(sessionStorage.getItem("descriService") || '{"fr":"","en":""}'));
  const besoinService = ref(JSON.parse(sessionStorage.getItem("besoinService") || '{"fr":"","en":""}'));
  const visiblePublic = ref(sessionStorage.getItem("visiblePublic") === "true");
  const activate = ref(sessionStorage.getItem("activate") === "true");
  const oneService = ref(JSON.parse(sessionStorage.getItem("oneService") || "null"));
  const existingActivitesList = ref(JSON.parse(sessionStorage.getItem("existingActivitesList") || "[]"));
  const existingArticlesList = ref(JSON.parse(sessionStorage.getItem("existingArticlesList") || "[]"));
  const alreadyClosed = ref(sessionStorage.getItem("alreadyClosed") === "true");

  // Activité
  const nom_activite = ref(sessionStorage.getItem("nom_activite") || "");
  const nb_participants = ref(Number(sessionStorage.getItem("nb_participants")) || 0);
  const prix_activite = ref(Number(sessionStorage.getItem("prix_activite")) || 0);
  const date_activite = ref(sessionStorage.getItem("date_activite") || null);
  const heure_activite = ref(sessionStorage.getItem("heure_activite") || null);
  const activitesList = ref(JSON.parse(sessionStorage.getItem("activitesList") || "[]"));

  // Article
  const nom_article = ref(sessionStorage.getItem("nom_article") || "");
  const stock_article = ref(Number(sessionStorage.getItem("stock_article")) || 0);
  const prix_article = ref(Number(sessionStorage.getItem("prix_article")) || 0);
  const articlesList = ref(JSON.parse(sessionStorage.getItem("articlesList") || "[]"));

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
    alreadyClosed.value = false;

    clearItemsStore();

    sessionStorage.removeItem("alreadyClosed");
    sessionStorage.removeItem("selectedIndex");
    sessionStorage.removeItem("selectedTypeId");
    sessionStorage.removeItem("checkedItem");
    sessionStorage.removeItem("continueInscription");
    sessionStorage.removeItem("nom");
    sessionStorage.removeItem("descri");
    sessionStorage.removeItem("mail");
    sessionStorage.removeItem("tel");
    sessionStorage.removeItem("nomService");
    sessionStorage.removeItem("descriService");
    sessionStorage.removeItem("besoinService");
    sessionStorage.removeItem("visiblePublic");
    sessionStorage.removeItem("activate");
    sessionStorage.removeItem("oneService");
  }

  function clearItemsStore() {
    nom_activite.value = "";
    nb_participants.value = 0;
    prix_activite.value = 0;
    date_activite.value = null;
    heure_activite.value = null;
    activitesList.value = [];
    existingActivitesList.value = [];

    nom_article.value = "";
    stock_article.value = 0;
    prix_article.value = 0;
    articlesList.value = [];
    existingArticlesList.value = [];

    sessionStorage.removeItem("nom_activite");
    sessionStorage.removeItem("nb_participants");
    sessionStorage.removeItem("prix_activite");
    sessionStorage.removeItem("date_activite");
    sessionStorage.removeItem("heure_activite");
    sessionStorage.removeItem("activitesList");
    sessionStorage.removeItem("existingActivitesList");
    sessionStorage.removeItem("nom_article");
    sessionStorage.removeItem("stock_article");
    sessionStorage.removeItem("prix_article");
    sessionStorage.removeItem("articlesList");
    sessionStorage.removeItem("existingArticlesList");
  }

  watch(lastUserId, (v) => {
    if (v) sessionStorage.setItem("lastUserId", v);
    else sessionStorage.removeItem("lastUserId");
  });
  watch(selectedIndex, (v) => sessionStorage.setItem("selectedIndex", v));
  watch(checkedItem, (v) => sessionStorage.setItem("checkedItem", JSON.stringify(v)), { deep: true });
  watch(selectedTypeId, (v) => sessionStorage.setItem("selectedTypeId", v));
  watch(continueInscription, (v) => sessionStorage.setItem("continueInscription", v));
  watch(nom, (v) => sessionStorage.setItem("nom", v));
  watch(descri, (v) => sessionStorage.setItem("descri", v));
  watch(mail, (v) => sessionStorage.setItem("mail", v));
  watch(tel, (v) => sessionStorage.setItem("tel", v));
  watch(nomService, (v) => sessionStorage.setItem("nomService", v));
  watch(descriService, (v) => sessionStorage.setItem("descriService", JSON.stringify(v)), { deep: true });
  watch(besoinService, (v) => sessionStorage.setItem("besoinService", JSON.stringify(v)), { deep: true });
  watch(visiblePublic, (v) => sessionStorage.setItem("visiblePublic", v));
  watch(activate, (v) => sessionStorage.setItem("activate", v));
  watch(oneService, (v) => {
    if (v) sessionStorage.setItem("oneService", JSON.stringify(v));
    else sessionStorage.removeItem("oneService");
  });
  watch(existingActivitesList, (v) => sessionStorage.setItem("existingActivitesList", JSON.stringify(v)), { deep: true });
  watch(existingArticlesList, (v) => sessionStorage.setItem("existingArticlesList", JSON.stringify(v)), { deep: true });

  watch(nom_activite, (v) => sessionStorage.setItem("nom_activite", v));
  watch(nb_participants, (v) => sessionStorage.setItem("nb_participants", v));
  watch(prix_activite, (v) => sessionStorage.setItem("prix_activite", v));
  watch(date_activite, (v) => {
    if (v) sessionStorage.setItem("date_activite", v);
    else sessionStorage.removeItem("date_activite");
  });
  watch(heure_activite, (v) => {
    if (v) sessionStorage.setItem("heure_activite", v);
    else sessionStorage.removeItem("heure_activite");
  });
  watch(activitesList, (v) => sessionStorage.setItem("activitesList", JSON.stringify(v)), { deep: true });

  watch(nom_article, (v) => sessionStorage.setItem("nom_article", v));
  watch(stock_article, (v) => sessionStorage.setItem("stock_article", v));
  watch(prix_article, (v) => sessionStorage.setItem("prix_article", v));
  watch(articlesList, (v) => sessionStorage.setItem("articlesList", JSON.stringify(v)), { deep: true });
  watch(alreadyClosed, (v) => sessionStorage.setItem("alreadyClosed", v));

  return {
    lastUserId,
    selectedTypeId,
    selectedIndex, checkedItem, continueInscription,
    oneService, existingActivitesList, existingArticlesList,
    nom, descri, mail, tel,
    nomService, descriService, besoinService,
    visiblePublic, activate,
    alreadyClosed,
    nom_activite, nb_participants, prix_activite, date_activite, heure_activite, activitesList, 
    nom_article, stock_article, prix_article, articlesList,
    clearStore, clearItemsStore
  };
});