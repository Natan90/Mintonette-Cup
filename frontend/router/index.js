import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import ShowPrestataire from "@/views/ShowPrestataire.vue";
import Reserver from "@/views/Reserver.vue";
import PresentationMintonette from "@/views/PresentationMintonette.vue";
import PolygonCreation from "@/views/PolygonCreation.vue";
import LogPage from "@/components/LogPage.vue";
import ModifyAccount from "@/views/ModifyAccount.vue";
import ShowAccount from "@/views/ShowAccount.vue";
import PrestataireInfo from "@/views/PrestataireInfo.vue";
import Panier from "@/views/Panier.vue";
import Checkout from "@/views/Checkout.vue";
import Gradin from "@/views/Gradin.vue";
import MesBillets from "@/views/MesBillets.vue";
import RecherchePrestataire from "@/views/RecherchePrestataire.vue";
import App from "@/App.vue";
import { useUserStore } from "@/stores/user";
import Evenement from "@/views/Administrateur/Evenement.vue";
import Utilisateur from "@/views/Administrateur/Utilisateur.vue";
import AdminPrestataire from "@/views/Administrateur/AdminPrestataire.vue";
import Statistiques from "@/views/Administrateur/Statistiques.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import Terrain from "@/views/Terrain.vue";
import ZoneMap from "@/components/ZoneMap.vue";
import Information from "@/views/Information.vue";

const routes = [
  {
    path: "/:lang(fr|en)",
    name: "App",
    component: App,
    children: [
      {
        path: "",
        name: "Home",
        component: Index,
        props: (route) => ({
          showModal: route.query.showModal === "true",
        }),
      },
      {
        path: "RecherchePresta",
        name: "RecherchePresta",
        component: RecherchePrestataire,
      },
      {
        path: "ShowPrestataire/:id",
        name: "ShowPrestataire",
        component: ShowPrestataire,
      },
      {
        path: "Prestataire/Add/:id?",
        name: "AddPrestataire",
        component: PrestataireInfo,
        props: true,
      },
      {
        path: "Prestataire/Edit/:id?",
        name: "EditPrestataire",
        component: PrestataireInfo,
        props: true,
      },
      {
        path: "Reserver",
        name: "Reserver",
        component: Reserver,
      },
      {
        path: "admin",
        name: "admin",
        children: [
          {
            path: "evenement",
            name: "Evenement",
            component: Evenement,
          },
          {
            path: "utilisateurs",
            name: "Utilisateurs",
            component: Utilisateur,
          },
          {
            path: "prestataires",
            name: "Prestataires",
            component: AdminPrestataire,
          },
          {
            path: "statistiques",
            name: "Statistiques",
            component: Statistiques,
          },
        ],
      },
      {
        path: "utilisateur",
        name: "utilisateur",
        children: [
          {
            path: "inscription",
            name: "Inscription_utilisateur",
            component: LogPage,
          },
          {
            path: "connexion",
            name: "Connexion_utilisateur",
            component: LogPage,
          },
          {
            path: "profil/:userId",
            name: "ShowAccount",
            component: ShowAccount,
            props: true,
          },
          {
            path: "billets",
            name: "MesBillets",
            component: MesBillets,
          },
          {
            path: "profil/modifier/:userId",
            name: "ModifyAccount",
            component: ModifyAccount,
          },
        ],
      },
      {
        path: "Presentation_Mintonette_Cup",
        name: "Presentation_Mintonette_Cup",
        component: PresentationMintonette,
      },
      {
        path: "PolygoneCreation",
        name: "PolygoneCreation",
        component: PolygonCreation,
      },
      {
        path: "terrain/:id",
        name: "Terrain",
        component: Terrain,
        props: true,
      },
      {
        path: "Gradin/:zone",
        name: "Gradin",
        component: Gradin,
      },
      {
        path: "Panier",
        name: "Panier",
        component: Panier,
      },
      {
        path: "Checkout",
        name: "Checkout",
        component: Checkout,
      },
      {
        path: "Information",
        name: "Information",
        component: Information,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/fr",
  },
];
Panier;
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;
