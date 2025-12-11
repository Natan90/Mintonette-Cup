import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import PrestatairePublic from "@/views/PrestatairePublic.vue";
import PrestatairePresta from "@/views/PrestatairePresta.vue";
import Commander from "@/views/Commander.vue";
import Reserver from "@/views/Reserver.vue";
import Utilisateur from "@/components/Utilisateur.vue";
import PresentationMintonette from "@/views/PresentationMintonette.vue";
import PolygonCreation from "@/views/PolygonCreation.vue";
import LogPage from "@/components/LogPage.vue";
import ModifyAccount from "@/views/ModifyAccount.vue";
import terrain1 from "@/views/Terrains/terrain1.vue";
import terrain2 from "@/views/Terrains/terrain2.vue";
import terrain3 from "@/views/Terrains/terrain3.vue";
import terrain4 from "@/views/Terrains/terrain4.vue";
import AddPrestataire from "@/views/AddPrestataire.vue";
import GradinNord from "@/components/gradins/GradinNord.vue";
import GradinSud from "@/components/gradins/GradinSud.vue";
import GradinOuest from "@/components/gradins/GradinOuest.vue";
import GradinEst from "@/components/gradins/GradinEst.vue";
import countUp from "@/components/CountUp.vue";
import GradinReservationNord from "@/components/gradins/ReservationNord.vue"
import GradinReservationEst from "@/components/gradins/ReservationEst.vue"
import GradinReservationSud from "@/components/gradins/ReservationSud.vue"
import GradinReservationOuest from "@/components/gradins/ReservationOuest.vue"
import Panier from "@/views/Panier.vue"



const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
    props: (route) => ({
      showModal: route.query.showModal === "true",
    }),
  },
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
  {
    path: "/Prestataire/Add",
    name: "AddPrtestataire",
    component: AddPrestataire,
  },

  { path: "/Commander", name: "Commander", component: Commander },
  { path: "/Reserver", name: "Reserver", component: Reserver },
  { path: "/admin", name: "admin", component: Utilisateur },
  {
    path: "/utilisateur/inscription",
    name: "Inscription_utilisateur",
    component: LogPage,
  },
  {
    path: "/utilisateur/connexion",
    name: "Connexion_utilisateur",
    component: LogPage,
  },
  {
    path: "/utilisateur/modifier",
    name: "ModifyAccount",
    component: ModifyAccount,
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
  {
    path: "/Terrains/terrain_1",
    name: "Terrain 1",
    component: terrain1,
  },
  {
    path: "/Terrains/terrain_2",
    name: "Terrain 2",
    component: terrain2,
  },
  {
    path: "/Terrains/terrain_3",
    name: "Terrain 3",
    component: terrain3,
  },
  {
    path: "/Terrains/terrain_4",
    name: "Terrain 4",
    component: terrain4,
  },
  {
    path: "/Gradins/GradinNord",
    name: "Gradin Nord",
    component: GradinNord,
  },
  {
    path: "/Gradins/GradinEst",
    name: "Gradin Est",
    component: GradinEst,
  },
  {
    path: "/Gradins/GradinSud",
    name: "Gradin Sud",
    component: GradinSud,
  },
  {
    path: "/Gradins/GradinOuest",
    name: "Gradin Ouest",
    component: GradinOuest,
  },
  {
    path: "/Gradins/ReservationNord",
    name: "GradinReservationNord",
    component: GradinReservationNord,
  },
  {
    path: "/Gradins/ReservationEst",
    name: "GradinReservationEst",
    component: GradinReservationEst,
  },
  {
    path: "/Gradins/ReservationSud",
    name: "GradinReservationSud",
    component: GradinReservationSud,
  },
  {
    path: "/Gradins/ReservationOuest",
    name: "GradinReservationOuest",
    component: GradinReservationOuest,
  },
  {
    path: "/Panier",
    name: "Panier",
    component: Panier,
  },
  
];
Panier
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
