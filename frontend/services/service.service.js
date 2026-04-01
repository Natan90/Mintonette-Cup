import { defineStore } from "pinia";
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "./axios.service";

export const useServiceStore = defineStore("service", () => {

  async function GetServices() {
    return getRequest(`/prestataire/service/show`);
  }

  async function GetServiceByIdService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return getRequest(`/prestataire/service/show/service/${id_service}`);
  }

  async function GetServiceByIdPrestataire(id_presta) {
    if (!id_presta) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return getRequest(`/prestataire/service/show/prestataire/${id_presta}`);
  }

  async function GetArticleByIdService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return getRequest(`/prestataire/service/${id_service}/article/show`);
  }

  async function GetActiviteByIdService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return getRequest(`/prestataire/service/${id_service}/activite/show`);
  }

  async function GetArticleByIdArticle(id_article) {
    if (!id_article) {
      throw new Error("L'id de l'article est obligatoire");
    }
    return getRequest(`/prestataire/service/article/${id_article}/show`);
  }

  async function GetActiviteByIdActivite(id_activite) {
    if (!id_activite) {
      throw new Error("L'id de l'activité est obligatoire");
    }
    return getRequest(`/prestataire/service/activite/${id_activite}/show`);
  }

  async function ActivateService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return patchRequest(`/prestataire/service/${id_service}/activate`);
  }

  async function CreateService(id_prestataire, data) {
    if (!id_prestataire) {
      throw new Error("L'id du prestataire est obligatoire");
    }
    return postRequest(`/prestataire/service/${id_prestataire}/add`, {
      ...data
    });
  }

  async function DeleteService(id_service) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return deleteRequest(`/prestataire/service/${id_service}/delete`);
  }

  async function DeleteArticle(id_article) {
    if (!id_article) {
      throw new Error("L'id de l'article est obligatoire");
    }
    return deleteRequest(`/prestataire/service/article/${id_article}/delete`);
  }

  async function DeleteActivite(id_activite) {
    if (!id_activite) {
      throw new Error("L'id de l'activite est obligatoire");
    }
    return deleteRequest(`/prestataire/service/activite/${id_activite}/delete`);
  }

  async function AddArticles(id_service, data) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return postRequest(`/prestataire/service/articles/${id_service}/add`, {
      ...data
    });
  }  

  async function AddActivites(id_service, data) {
    if (!id_service) {
      throw new Error("L'id du service est obligatoire");
    }
    return postRequest(`/prestataire/service/activites/${id_service}/add`, {
      ...data
    });
  }

  async function EditArticleById(id_article, data) {
    if (!id_article) {
      throw new Error("L'id de l'article est obligatoire");
    }
    return putRequest(`/prestataire/service/article/${id_article}/edit`, {
  ...data
});
  }

  async function EditActiviteById(id_activite, data) {
    if (!id_activite) {
      throw new Error("L'id de l'activite est obligatoire");
    }
    return putRequest(`/prestataire/service/activite/${id_activite}/edit`, {
      ...data
    });
  }

  return {
    GetServices,
    GetServiceByIdService,
    GetServiceByIdPrestataire,
    GetActiviteByIdService,
    GetArticleByIdService,
    GetActiviteByIdActivite,
    GetArticleByIdArticle,
    ActivateService,
    CreateService,
    DeleteService,
    DeleteArticle,
    DeleteActivite,
    AddArticles,
    AddActivites,
    EditActiviteById,
    EditArticleById,
  };
});
