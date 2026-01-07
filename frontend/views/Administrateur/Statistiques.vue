<template>
    <NavView />
    <MenuAdmin />
    <div class="main_content">
        <Chart type="bar" :data="barData" :options="barOptions" />

        <Chart type="polarArea" :data="polarData" :options="polarOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';

import { Chart } from 'vue-chartjs';
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
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, RadialLinearScale, ArcElement);

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
    labels: ['Prestataires (%)'],
    datasets: []
});

const barOptions = ref({});

const setBarChatOptions = () => ({
    maintainAspectRatio: false,
    //   aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
                color: '#333'
            }
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.dataset.data[0] + '%';
                }
            }
        }
    },
    scales: {
        x: {
            ticks: { color: '#666', font: { weight: 500 } },
            grid: { display: false, drawBorder: false }
        },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#666', callback: (value) => value + '%' },
            grid: { color: '#e0e0e0', drawBorder: false }
        }
    }
});


//==========================
//======= PolarChat ========
//==========================
const polarData = ref({
    labels: [],
    datasets: []
})

const polarOptions = ref({});

const setPolarOptions = () => ({
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#333' } } },
  scales: { r: { grid: { color: '#e0e0e0' } } }
});


onMounted(async () => {
    barOptions.value = setBarChatOptions();
    polarOptions.value = setPolarOptions();

    await getValuesUtilisateurs();
    await getPrestataires();
    await getTypePresta();
    await getCountServicesByType();

    const totalUsers = utilisateurs.value.length;
    const totalPrestataires = prestataires.value.length;
    const pourcentage = totalUsers > 0 ? ((totalPrestataires / totalUsers) * 100).toFixed(1) : 0;

    console.log(totalUsers, totalPrestataires, pourcentage);

    barData.value = {
        labels: ['Prestataires (%)'],
        datasets: [
            {
                label: '% Prestataires vs Utilisateurs',
                data: [pourcentage],
                backgroundColor: ['lightgreen'],
                borderColor: ['green'],
                borderWidth: 1
            }
        ]
    };

    const labels = type_prestataire.value.map(t => t.nom_type_prestataire);
    const data = countType_presta.value.map(c => Number(c.nb_prestataires));

    // polarData.value = {
    //     labels,
    //     datasets: [
    //         {
    //         label: 'Nombre de prestataire par type',
    //         data,
    //         backgroundColor: [
    //             'red', 'blue', 'green', 'orange', 'purple'
    //         ],
    //         borderWidth: 1
    //         }
    //     ]
    // };
});


async function getCountServicesByType() {
  try {
    const res = await axios.get("http://localhost:3000/prestataire/countServicesByType");
    countServicesByType.value = res.data;

    polarData.value = {
      labels: countServicesByType.value.map(c => c.nom_type_prestataire),
      datasets: [
        {
          label: "Nombre de services par catégorie",
          data: countServicesByType.value.map(c => Number(c.nb_services)),
          backgroundColor: [
            'red', 'blue', 'green', 'orange', 'purple'
          ],
          borderWidth: 1
        }
      ]
    };
  } catch (err) {
    console.error("Erreur fetch countServicesByType:", err);
  }
}


async function getValuesUtilisateurs() {
    try {
        const res = await axios.get('http://localhost:3000/admin/utilisateur/show');
        utilisateurs.value = res.data;
    } catch (err) {
        console.error('Erreur fetch utilisateurs:', err);
    }
}

async function getPrestataires() {
    try {
        const res = await axios.get('http://localhost:3000/prestataire/show');
        prestataires.value = res.data;
    } catch (err) {
        console.error('Erreur fetch prestataires:', err);
    }
}


//=========================
//= Async functions types =
//=========================
async function getTypePresta() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.result;
        countType_presta.value = res.data.count;
    } catch (err) {
        console.error(err);
    }
}


async function getEveryType() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
        type_animation.value = res.data.animations;
        type_restauration.value = res.data.restaurations;
        type_boutique.value = res.data.boutiques;
    } catch (err) {
        console.error(err);
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
