import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useFiltreStore = defineStore("filtre", () => {
  const isServiceViewFilter = ref(
    sessionStorage.getItem("isServiceViewFilter") === "true",
  );
  const nomFilter = ref(sessionStorage.getItem("nomFilter") || "");
  const id_categorieFilter = ref(
    sessionStorage.getItem("id_categorieFilter") || null,
  );
  const id_type_serviceFilter = ref(
    sessionStorage.getItem("id_type_serviceFilter") || null,
  );

  function clearStore() {
    isServiceViewFilter.value = false;
    nomFilter.value = "";
    id_categorieFilter.value = null;
    id_type_serviceFilter.value = null;
  }

  watch(isServiceViewFilter, (v) =>
    sessionStorage.setItem("isServiceViewFilter", v),
  );
  watch(nomFilter, (v) => sessionStorage.setItem("nomFilter", v ?? ""));
  watch(id_categorieFilter, (v) =>
    sessionStorage.setItem("id_categorieFilter", v ?? ""),
  );
  watch(id_type_serviceFilter, (v) =>
    sessionStorage.setItem("id_type_serviceFilter", v ?? ""),
  );

  return {
    isServiceViewFilter,
    nomFilter,
    id_categorieFilter,
    id_type_serviceFilter,
    clearStore,
  };
});
