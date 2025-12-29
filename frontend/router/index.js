import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import PrestatairePublic from "@/views/PrestatairePublic.vue";
import Commander from "@/views/Commander.vue";
import Reserver from "@/views/Reserver.vue";
import PresentationMintonette from "@/views/PresentationMintonette.vue";
import PolygonCreation from "@/views/PolygonCreation.vue";
import LogPage from "@/components/LogPage.vue";
import ModifyAccount from "@/views/ModifyAccount.vue";
import ShowAccount from "@/views/ShowAccount.vue";
import terrain1 from "@/views/Terrains/terrain1.vue";
import terrain2 from "@/views/Terrains/terrain2.vue";
import terrain3 from "@/views/Terrains/terrain3.vue";
import terrain4 from "@/views/Terrains/terrain4.vue";
import PrestataireInfo from "@/views/PrestataireInfo.vue";
import Panier from "@/views/Panier.vue";
import Gradin from "@/views/Gradin.vue";
import RecherchePrestataire from "@/views/RecherchePrestataire.vue";
import App from "@/App.vue";
import Evenement from "@/views/Administrateur/Evenement.vue";
import Utilisateur from "@/views/Administrateur/Utilisateur.vue";
import AdminPrestataire from "@/views/Administrateur/AdminPrestataire.vue";
import Statistiques from "@/views/Administrateur/Statistiques.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";

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
        path: "PrestatairePublic",
        name: "PrestatairePublic",
        component: PrestatairePublic,
      },
      {
        path: "Prestataire/Add/:id",
        name: "AddPrestataire",
        component: PrestataireInfo,
        props: true,
      },
      {
        path: "Prestataire/Edit/:id",
        name: "EditPrestataire",
        component: PrestataireInfo,
        props: true,
      },

      {
        path: "Commander",
        name: "Commander",
        component: Commander,
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
            path: "profil/modifier",
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
        path: "Terrains/terrain1",
        name: "Terrain1",
        component: terrain1,
      },
      {
        path: "Terrains/terrain2",
        name: "Terrain2",
        component: terrain2,
      },
      {
        path: "Terrains/terrain3",
        name: "Terrain3",
        component: terrain3,
      },
      {
        path: "Terrains/terrain4",
        name: "Terrain4",
        component: terrain4,
      },
      {
        path: "Gradins/Gradin/:zone",
        name: "Gradin",
        component: Gradin,
      },
      {
        path: "Panier",
        name: "Panier",
        component: Panier,
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
