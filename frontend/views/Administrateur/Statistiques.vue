<template>
  <NavView />
  <section class="admin-layout">
    <MenuAdmin />
    <div class="main_content">
      <div class="chart_wrapper">
        <Chart type="bar" :data="barData" :options="barOptions" />
      </div>
      <div class="chart_wrapper">
        <Chart type="polarArea" :data="polarData" :options="polarOptions" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch} from "vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import NavView from "@/components/NavView.vue";
import { useAdminAPIStore } from "@/services/admin.service";
import { useI18n } from "vue-i18n";
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

const { locale, t } = useI18n();
const adminAPIStore = useAdminAPIStore();

onMounted(() => {
  barOptions.value = setBarChatOptions();
  polarOptions.value = setPolarOptions();
  getDashboardStats();
});

watch(locale, () => {
  barOptions.value = setBarChatOptions();
  polarOptions.value = setPolarOptions();
  getDashboardStats();
});

//==========================
//======== BarChat =========
//==========================
const barData = ref({
  labels: ["Prestataires (%)"],
  datasets: [],
});

const barOptions = ref({});

/**
 * Configure les options du graphique en barres :
 * - Style général
 * - Tooltip personnalisé
 * - Axes avec format en pourcentage
 * @returns {Object} Configuration Chart.js du bar chart
*/
const setBarChatOptions = () => ({
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: t("adminStats.barTitle"),
      color: "#333",
      font: { size: 16, weight: "bold" },
      padding: { bottom: 20 },
    },
    legend: {
      position: "bottom",
      labels: { color: "#333", padding: 20 },
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

/**
 * Configure les options du graphique polar area :
 * - Légende
 * - Grille radiale
 * @returns {Object} Configuration Chart.js du polar chart
*/
const setPolarOptions = () => ({
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: t("adminStats.polarTitle"),
      color: "#333",
      font: { size: 16, weight: "bold" },
      padding: { bottom: 20 },
    },
    legend: {
      position: "bottom",
      labels: { color: "#333", padding: 20 },
    },
  },
  scales: {
    r: {
      grid: { color: "#e0e0e0" },
      ticks: { display: false },
    },
  },
});
/**
 * Récupère les statistiques du dashboard :
 * - Nombre total d'utilisateurs
 * - Nombre de prestataires
 * - Répartition des services par type
 *
 * Met à jour les données des graphiques (bar + polar).
*/
async function getDashboardStats() {
  try {
    const res = await adminAPIStore.GetStatistiques();
    const { totalUsers, totalPrestataires, servicesByType } = res.data;
    const pourcentage =
      totalUsers > 0
        ? ((totalPrestataires / totalUsers) * 100).toFixed(1)
        : 0;

    barData.value = {
      labels: [t("adminStats.barLegend")],
      datasets: [
        {
          label: t("adminStats.barLabel"),
          data: [pourcentage],
          backgroundColor: ["lightgreen"],
        },
      ],
    };

    polarData.value = {
      labels: servicesByType.map((s) => s.nom_type_prestataire[locale.value]),
      datasets: [
        {
          label: t("adminStats.polarLabel"),
          data: servicesByType.map((s) => Number(s.nb_services)),
          backgroundColor: [
            "#7c3aed",
            "#ef4444",
            "#22c55e",
            "#f97316",
            "#eab308",
          ],
          borderWidth: 1,
        },
      ],
    };
  } catch (err) {
    console.error("Erreur dashboard stats:", err);
  }
}

</script>

<style scoped>
.admin-layout{
  height: fit-content;
  display: flex;
}

.main_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: fit-content;
  width: 100%;
}

.chart_wrapper {
  width: 100%;
  max-width: 600px;
  height: 600px;
  padding: 30px;
}

@media(max-width: 1000px){
  .admin-layout{
    flex-direction: column;
  }

  .main_content{
    padding-top: 0;
    width: 100vw;
  }
}
</style>
