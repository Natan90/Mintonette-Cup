import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePrestataireInfoStore = defineStore("prestataireInfo", () => {
  const lastUserId = ref(localStorage.getItem("lastUserId") || null);
  const selectedIndex = ref(Number(localStorage.getItem("selectedIndex")) || 0);
  const checkedItem = ref(JSON.parse(localStorage.getItem("checkedItem") || "[]"));
  const continueInscription = ref(localStorage.getItem("continueInscription") === "true");
  const nom = ref(localStorage.getItem("nom") || "");
  const descri = ref(localStorage.getItem("descri") || "");
  const mail = ref(localStorage.getItem("mail") || "");
  const tel = ref(localStorage.getItem("tel") || "");
  const isModalService = ref(localStorage.getItem("isModalService") === "true");
  const nomService = ref(localStorage.getItem("nomService") || "");
  const descriService = ref(JSON.parse(localStorage.getItem("descriService") || '{"fr":"","en":""}'));
  const besoinService = ref(JSON.parse(localStorage.getItem("besoinService") || '{"fr":"","en":""}'));
  const visiblePublic = ref(localStorage.getItem("visiblePublic") === "true");
  const activate = ref(localStorage.getItem("activate") === "true");

  function clearStore() {
    selectedIndex.value = 0;
    checkedItem.value = [];
    continueInscription.value = false;
    nom.value = "";
    descri.value = "";
    mail.value = "";
    tel.value = "";
    isModalService.value = false;
    nomService.value = "";
    descriService.value = { fr: "", en: "" };
    besoinService.value = { fr: "", en: "" };
    visiblePublic.value = true;
    activate.value = false;
    localStorage.removeItem("selectedIndex");
    localStorage.removeItem("checkedItem");
    localStorage.removeItem("continueInscription");
    localStorage.removeItem("nom");
    localStorage.removeItem("descri");
    localStorage.removeItem("mail");
    localStorage.removeItem("tel");
    localStorage.removeItem("isModalService");
    localStorage.removeItem("nomService");
    localStorage.removeItem("descriService");
    localStorage.removeItem("besoinService");
    localStorage.removeItem("visiblePublic");
    localStorage.removeItem("activate");
  }

  watch(lastUserId, (v) => {
    if (v) localStorage.setItem("lastUserId", v);
    else localStorage.removeItem("lastUserId");
  });
  watch(selectedIndex, (v) => localStorage.setItem("selectedIndex", v));
  watch(checkedItem, (v) => localStorage.setItem("checkedItem", JSON.stringify(v)), { deep: true });
  watch(continueInscription, (v) => localStorage.setItem("continueInscription", v));
  watch(nom, (v) => localStorage.setItem("nom", v));
  watch(descri, (v) => localStorage.setItem("descri", v));
  watch(mail, (v) => localStorage.setItem("mail", v));
  watch(tel, (v) => localStorage.setItem("tel", v));
  watch(isModalService, (v) => localStorage.setItem("isModalService", v));
  watch(nomService, (v) => localStorage.setItem("nomService", v));
  watch(descriService, (v) => localStorage.setItem("descriService", JSON.stringify(v)), { deep: true });
  watch(besoinService, (v) => localStorage.setItem("besoinService", JSON.stringify(v)), { deep: true });
  watch(visiblePublic, (v) => localStorage.setItem("visiblePublic", v));
  watch(activate, (v) => localStorage.setItem("activate", v));

  return {
    lastUserId,
    selectedIndex, checkedItem, continueInscription,
    nom, descri, mail, tel,
    isModalService, nomService, descriService, besoinService,
    visiblePublic, activate,
    clearStore,
  };
});
