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
import axios from 'axios';
import MenuAdmin from "@/components/MenuAdmin.vue";
import NavView from "@/components/NavView.vue";
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

const { locale } = useI18n();

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
  getDashboardStats();
});


async function getDashboardStats() {
  try {
    const res = await axios.get(
      "http://localhost:3000/admin/dashboard/stats"
    );

    const { totalUsers, totalPrestataires, servicesByType } = res.data;

    const pourcentage =
      totalUsers > 0
        ? ((totalPrestataires / totalUsers) * 100).toFixed(1)
        : 0;

    barData.value = {
      labels: ["Prestataires (%)"],
      datasets: [
        {
          label: "% Prestataires vs Utilisateurs",
          data: [pourcentage],
          backgroundColor: ["lightgreen"],
        },
      ],
    };

    polarData.value = {
  labels: servicesByType.map(
    (s) => s.nom_type_prestataire[locale.value]
  ),
  datasets: [
    {
      label: "Nombre de services par catégorie",
      data: servicesByType.map((s) => Number(s.nb_services)),
      backgroundColor: [
        "#7c3aed", // violet
        "#ef4444", // rouge
        "#22c55e", // vert
        "#f97316", // orange
        "#eab308", // jaune
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
.main_content {
  margin-left: 250px;
  height: 400px;
  width: auto;
}
</style>
