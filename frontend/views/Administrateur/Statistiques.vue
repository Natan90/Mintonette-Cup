<template>
  <NavView />
  <MenuAdmin />
  <div class="main_content">
    <Chart type="bar" :data="barData" :options="barOptions" />

    <Chart type="polarArea" :data="polarData" :options="polarOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import axios from 'axios';
import MenuAdmin from "@/components/MenuAdmin.vue";
import NavView from "@/components/NavView.vue";
import { useI18n } from "vue-i18n";

import utilisateurData from "../../../backend/database/jsonData/Utilisateur.json";
import prestataireData from "../../../backend/database/jsonData/Prestataire.json";
import typePrestaData from "../../../backend/database/jsonData/Type_prestataire.json";
import servicesData from "../../../backend/database/jsonData/Services.json";

import { Chart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  ArcElement
);

const { locale } = useI18n();
const utilisateurs = ref([]);
const prestataires = ref([]);

//=========================
//=== Type prestataire ====
//=========================
const type_prestataire = ref([]);
const countServicesByType = ref([]);
const countServices = ref([]);
const type_animation = ref([]);
const type_restauration = ref([]);
const type_boutique = ref([]);
const countType_presta = ref([]);

//==========================
//======== BarChat =========
//==========================
const barData = ref({
  labels: ["Prestataires (%)"],
  datasets: [],
});

const barOptions = ref({});

const setBarChatOptions = () => ({
  maintainAspectRatio: false,
  //   aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: "#333",
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.dataset.data[0] + "%";
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#666", font: { weight: 500 } },
      grid: { display: false, drawBorder: false },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { color: "#666", callback: (value) => value + "%" },
      grid: { color: "#e0e0e0", drawBorder: false },
    },
  },
});

//==========================
//======= PolarChat ========
//==========================
const polarData = ref({
  labels: [],
  datasets: [],
});

const polarOptions = ref({});

const setPolarOptions = () => ({
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#333" } } },
  scales: { r: { grid: { color: "#e0e0e0" } } },
});

onMounted(() => {
  barOptions.value = setBarChatOptions();
  polarOptions.value = setPolarOptions();

  getValuesUtilisateurs();
  getPrestataires();
  getTypePresta();
  getCountServicesByType();

  const totalUsers = utilisateurs.value.length;
  const totalPrestataires = prestataires.value.length;
  const pourcentage =
    totalUsers > 0 ? ((totalPrestataires / totalUsers) * 100).toFixed(1) : 0;

  console.log("Stats:", { totalUsers, totalPrestataires, pourcentage });

  barData.value = {
    labels: ["Prestataires (%)"],
    datasets: [
      {
        label: "% Prestataires vs Utilisateurs",
        data: [pourcentage],
        backgroundColor: ["lightgreen"],
        borderColor: ["green"],
        borderWidth: 1,
      },
    ],
  };
});

function getCountServicesByType() {
  try {
    // Calculer le nombre de services par type de prestataire
    const servicesByType = typePrestaData.map((type) => {
      // Trouver tous les prestataires de ce type
      const prestasOfType = prestataireData.filter(
        (p) => p.type_prestataire_id === type.id_type_prestataire
      );
      const prestaIds = prestasOfType.map((p) => p.id_prestataire);

      // Compter les services de ces prestataires (utiliser prestataire_id et non id_prestataire)
      const nbServices = servicesData.filter((s) =>
        prestaIds.includes(s.prestataire_id)
      ).length;

      return {
        nom_type_prestataire: type.nom_type_prestataire,
        nb_services: nbServices,
      };
    });

    countServicesByType.value = servicesByType;

    polarData.value = {
      labels: countServicesByType.value.map(
        (c) => c.nom_type_prestataire[locale.value]
      ),
      datasets: [
        {
          label: "Nombre de services par catégorie",
          data: countServicesByType.value.map((c) => Number(c.nb_services)),
          backgroundColor: ["purple", "red", "green", "orange", "yellow"],
          borderWidth: 1,
        },
      ],
    };
  } catch (err) {
    console.error("Erreur fetch countServicesByType:", err);
  }
}

// async function getCountServicesByType() {
//   try {
//     const res = await axios.get("http://localhost:3000/prestataire/countServicesByType");
//     countServicesByType.value = res.data;
//
//     polarData.value = {
//       labels: countServicesByType.value.map(c => c.nom_type_prestataire[locale.value]),
//       datasets: [
//         {
//           label: "Nombre de services par catégorie",
//           data: countServicesByType.value.map(c => Number(c.nb_services)),
//           backgroundColor: [
//             'purple', 'red', 'green', 'orange', 'yellow'
//           ],
//           borderWidth: 1
//         }
//       ]
//     };
//   } catch (err) {
//     console.error("Erreur fetch countServicesByType:", err);
//   }
// }

function getValuesUtilisateurs() {
  try {
    utilisateurs.value = utilisateurData;
  } catch (err) {
    console.error("Erreur fetch utilisateurs:", err);
  }
}

// async function getValuesUtilisateurs() {
//     try {
//         const res = await axios.get('http://localhost:3000/admin/utilisateur/show');
//         utilisateurs.value = res.data;
//     } catch (err) {
//         console.error('Erreur fetch utilisateurs:', err);
//     }
// }

function getPrestataires() {
  try {
    prestataires.value = prestataireData;
  } catch (err) {
    console.error("Erreur fetch prestataires:", err);
  }
}

// async function getPrestataires() {
//     try {
//         const res = await axios.get('http://localhost:3000/prestataire/show');
//         prestataires.value = res.data;
//     } catch (err) {
//         console.error('Erreur fetch prestataires:', err);
//     }
// }

//=========================
//= Async functions types =
//=========================
function getTypePresta() {
  try {
    type_prestataire.value = typePrestaData;

    // Calculer le nombre de prestataires par type
    countType_presta.value = typePrestaData.map((type) => {
      const count = prestataireData.filter(
        (p) => p.type_prestataire_id === type.id_type_prestataire
      ).length;
      return {
        id_type_prestataire: type.id_type_prestataire,
        nom_type_prestataire: type.nom_type_prestataire,
        nb_prestataires: count,
      };
    });
  } catch (err) {
    console.error(err);
  }
}

// async function getTypePresta() {
//     try {
//         const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
//         type_prestataire.value = res.data.result;
//         countType_presta.value = res.data.count;
//     } catch (err) {
//         console.error(err);
//     }
// }

function getEveryType() {
  try {
    // Ces données ne sont pas utilisées pour les graphiques actuels
    // mais on peut les charger si nécessaire
  } catch (err) {
    console.error(err);
  }
}

// async function getEveryType() {
//     try {
//         const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
//         type_animation.value = res.data.animations;
//         type_restauration.value = res.data.restaurations;
//         type_boutique.value = res.data.boutiques;
//     } catch (err) {
//         console.error(err);
//     }
// }
</script>

<style scoped>
.main_content {
  margin-left: 250px;
  height: 400px;
  width: auto;
}
</style>
