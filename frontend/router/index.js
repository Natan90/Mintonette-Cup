import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import ShowPrestataire from "@/views/ShowPrestataire.vue";
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
import Evenement from "@/views/Administrateur/Evenement.vue";
import Utilisateur from "@/views/Administrateur/Utilisateur.vue";
import AdminPrestataire from "@/views/Administrateur/AdminPrestataire.vue";
import Statistiques from "@/views/Administrateur/Statistiques.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import Terrain from "@/views/Terrain.vue";
import ZoneMap from "@/components/ZoneMap.vue";
import Information from "@/views/Information.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import ReceptionBox from "@/views/ReceptionBox.vue";

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
        meta: { requiresUserId: true },
      },
      {
        path: "Prestataire/Edit/:id?",
        name: "EditPrestataire",
        component: PrestataireInfo,
        props: true,
        meta: { requiresUserId: true },
      },
      {
        path: "admin",
        name: "admin",
        children: [
          {
            path: "evenement",
            name: "Evenement",
            component: Evenement,
            meta: { requiresUserId: true },
          },
          {
            path: "utilisateurs",
            name: "Utilisateurs",
            component: Utilisateur,
            meta: { requiresUserId: true },
          },
          {
            path: "prestataires",
            name: "Prestataires",
            component: AdminPrestataire,
            meta: { requiresUserId: true },
          },
          {
            path: "statistiques",
            name: "Statistiques",
            component: Statistiques,
            meta: { requiresUserId: true },
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
            meta: { requiresUserId: true },
          },
          {
            path: "billets",
            name: "MesBillets",
            component: MesBillets,
            meta: { requiresUserId: true },
          },
          {
            path: "profil/modifier/:userId",
            name: "ModifyAccount",
            component: ModifyAccount,
            meta: { requiresUserId: true },
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
        path: "terrain/:id/:idMatch",
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
        meta: { requiresUserId: true },
      },
      {
        path: "Checkout",
        name: "Checkout",
        component: Checkout,
        meta: { requiresUserId: true },
      },
      {
        path: "Information",
        name: "Information",
        component: Information,
      },
      {
        path: "reset-password",
        name: "ResetPasswordRequest",
        component: ResetPassword,
      },
      {
        path: "reset-password/:token",
        name: "ResetPasswordConfirm",
        component: ResetPassword,
      },
      {
        path: "mailbox/reception",
        name: "ReceptionBox",
        component: ReceptionBox,
        meta: { requiresUserId: true },
      }
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

router.beforeEach((to, from, next) => {
  const requiresUserId = to.meta.requiresUserId;
  if (requiresUserId && !userStore.userId) {
    next({ name: "Connexion_utilisateur" });
  } else {
    next();
  }
});


export default router;
