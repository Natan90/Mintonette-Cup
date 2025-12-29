<template>
    <form class="search_form" @submit.prevent="searchPrestataires" id="filtre_presta">
        <p class="title_form">Prestataires – Coupe du Monde de Volley</p>
        <p>
            Retrouvez tous les prestataires officiels présents lors de la Coupe du Monde de volley
            et utilisez les filtres pour organiser votre expérience autour des matchs.
        </p>

        <input v-model="filters.nom" type="text" placeholder="Rechercher par nom..." />

        <p>Catégorie de services</p>
        <ul>
            <li v-for="item in type_prestataire" :key="item.id_type_prestataire">
                <label>
                    <input type="radio" name="categorie" :value="Number(item.id_type_prestataire)"
                        v-model="filters.category" />
                    {{ item.nom_type_prestataire }}
                </label>
            </li>
            <li>
                <label>
                    <input type="radio" name="categorie" :value="0" v-model="filters.category" />
                    Tous
                </label>
            </li>
        </ul>

        <p>Choisir par prix</p>
        <div class="prix">
            <input type="number" v-model="filters.prixMin" placeholder="Prix min" />
            <input type="number" v-model="filters.prixMax" placeholder="Prix max" />
        </div>

        <button type="submit">Rechercher</button>
    </form>
    <button type="submit" @click="resetFilters">Réinitilaiser</button>

    <div class="affichage_presta">
        <div v-for="item in prestataires" :key="item.id_prestataire" class="card">
            <p class="title_presta">{{ item.nom_prestataire }}</p>
            <!-- <img src=""> -->
            <div class="description" v-html="item.descri_prestataire">
            </div>
            <p>{{ item.nb_participants }}</p>
            <p>{{ item.tarif_prestataire }}</p>
            <div class="contact_presta">
                <p class="contact_title"><b>Contact</b></p>
                <p>{{ item.mail_prestataire }}</p>
                <p>{{ item.tel_prestataire }}</p>
            </div>
            <p>{{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}
                <span>
                    <button>
                        En savoir plus
                    </button>
                </span>
            </p>
        </div>
    </div>

</template>



<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const type_prestataire = ref([]);
const prestataires = ref([]);
const filters = ref({
  nom: route.query.nom || '',
  category: route.query.category ? Number(route.query.category) : 0,
  prixMin: route.query.prixMin || null,
  prixMax: route.query.prixMax || null
});


onMounted(async () => {
    try {
        await getValuesTypePrestataire();

        if (Object.keys(route.query).length > 0) {
            await searchPrestataires();
        } else {
            await getValuesPrestataire();
        }
  } catch (err) {
    console.error(err);
  }
});

function resetFilters() {
    filters.value = {
    nom: '',
    category: null,
    prixMin: null,
    prixMax: null
    }
    router.push({ path: "/", hash: '#filtre_presta', query: {} });
    getValuesPrestataire();
}

//=========================
//==== Async functions ====
//=========================
async function getValuesPrestataire() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/show");
        prestataires.value = res.data;
    } catch (err) {
        console.error(err);
    }
}

async function getValuesTypePrestataire() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
}

async function searchPrestataires() {
    router.push({
        path: "/", hash: '#filtre_presta',
        query: {
        nom: filters.value.nom || undefined,
        category: filters.value.category || undefined,
        prixMin: filters.value.prixMin || undefined,
        prixMax: filters.value.prixMax || undefined,
        },
    });

    const res = await axios.get('http://localhost:3000/prestataire/showFilter', {
        params: filters.value
    });

    prestataires.value = res.data;
}


</script>


<style></style>

<style scoped>


.affichage_presta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
}



.prix {
    display: flex;
    flex-direction: row;
}
</style>