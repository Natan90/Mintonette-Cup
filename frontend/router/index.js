import { createRouter, createWebHistory } from "vue-router";
import Index from "@/components/Index.vue";
import PrestatairePublic from "@/components/PrestatairePublic.vue";
import PrestatairePresta from "@/components/PrestatairePresta.vue";
import Commander from "@/components/Commander.vue";
import Reserver from "@/components/Reserver.vue";
import Utilisateur from "@/components/Utilisateur.vue";
import InscriptionUser from "@/components/InscriptionUser.vue";
import PresentationMintonette from "@/components/PresentationMintonette.vue";
import ConnexionUser from "@/components/ConnexionUser.vue";
import PolygonCreation from "@/components/PolygonCreation.vue";

const routes = [
  { path: "/", name: "Home", component: Index },
  {
    path: "/PrestatairePublic",
    name: "PrestatairePublic",
    component: PrestatairePublic,
  },
  {
    path: "/PrestatairePresta",
    name: "PrestatairePresta",
    component: PrestatairePresta,
  },
  { path: "/Commander", name: "Commander", component: Commander },
  { path: "/Reserver", name: "Reserver", component: Reserver },
  { path: "/Utilisateur", name: "Utilisateur", component: Utilisateur },
  {
    path: "/utilisateur/inscription",
    name: "Inscription_utilisateur",
    component: InscriptionUser,
  },
  {
    path: "/utilisateur/connexion",
    name: "Connexion_utilisateur",
    component: ConnexionUser,
  },
  {
    path: "/Presentation_Mintonette_Cup",
    name: "Presentation_Mintonette_Cup",
    component: PresentationMintonette,
  },
  {
    path: "/PolygoneCreation",
    name: "PolygoneCreation",
    component: PolygonCreation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
