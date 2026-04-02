import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "@/services/axios.service";

export const useCommentaireStore = defineStore("commentaire", () => {
  const commentaires = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const noteMoyenne = computed(() => {
    if (!commentaires.value.length) return 0;

    const total = commentaires.value.reduce(
      (sum, commentaire) => sum + Number(commentaire.note_commentaire || 0),
      0,
    );

    return total / commentaires.value.length;
  });

  function setCommentaires(list) {
    commentaires.value = Array.isArray(list) ? list : [];
  }

  function clearCommentaires() {
    commentaires.value = [];
    error.value = null;
    isLoading.value = false;
  }

  async function fetchCommentaires() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await getRequest("/commentaire/showCommentaire");
      setCommentaires(response?.data ?? []);
      return commentaires.value;
    } catch (err) {
      error.value =
        err?.response?.data?.error ||
        err?.message ||
        "Erreur lors du chargement des commentaires";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function addCommentaire(commentaire) {
    const response = await postRequest("/commentaire/addCommentaire", {
      titre_commentaire: commentaire.titre_commentaire,
      texte_commentaire: commentaire.texte_commentaire,
      note_commentaire: commentaire.note_commentaire,
    });

    await fetchCommentaires();

    return response?.data;
  }

  async function updateCommentaire(id_commentaire, commentaire) {
    const response = await patchRequest(
      `/commentaire/updateCommentaire/${id_commentaire}`,
      {
        titre_commentaire: commentaire.titre_commentaire,
        texte_commentaire: commentaire.texte_commentaire,
        note_commentaire: commentaire.note_commentaire,
      },
    );

    await fetchCommentaires();

    return response?.data;
  }

  async function replyCommentaire(id_commentaire, reponse_commentaire) {
    const response = await patchRequest(
      `/commentaire/replyCommentaire/${id_commentaire}`,
      {
        reponse_commentaire,
      },
    );

    await fetchCommentaires();

    return response?.data;
  }

  async function deleteCommentaire(id_commentaire) {
    const response = await deleteRequest(
      `/commentaire/deleteCommentaire/${id_commentaire}`,
    );

    await fetchCommentaires();

    return response?.data;
  }

  return {
    commentaires,
    isLoading,
    error,
    noteMoyenne,
    setCommentaires,
    clearCommentaires,
    fetchCommentaires,
    addCommentaire,
    updateCommentaire,
    replyCommentaire,
    deleteCommentaire,
  };
});
