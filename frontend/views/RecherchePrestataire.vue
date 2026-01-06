<template>

    <section class="recherche">

        <span>Retrouvez les Prestataires de la Mintonette Cup 2026 !</span>

        <section class="filtreEtListe">

            <form class="filtrePrestataire" @submit.prevent="searchPrestataires" id="filtre_presta">
                
                <div class="blocFiltre">
                    <span>Nom</span>
                    <input v-model="filters.nom" type="text" placeholder="Nom de Prestataire" />
                </div>

                <div class="blocFiltre">
                <span>Catégorie de services</span>
                        <div v-for="item in type_prestataire" :key="item.id_type_prestataire">
                            <label class="pointer">
                                <input type="radio" name="categorie" :value="Number(item.id_type_prestataire)"
                                    v-model="filters.category" />
                                {{ item.nom_type_prestataire }}
                            </label>
                        </div>

                        <label class="pointer">
                            <input type="radio" name="categorie" :value="0" v-model="filters.category"/>
                            Tous
                        </label>
                </div>

                <div class="blocFiltre">
                    <span>prix</span>
                    <div class="prix">
                        <input type="number" v-model="filters.prixMin" placeholder="Prix min" />
                        <input type="number" v-model="filters.prixMax" placeholder="Prix max" />
                    </div>
                </div>

                <div class="boutonsFiltre">
                    <button class="pointer" type="submit">Rechercher</button>
                    <button class="pointer" type="submit" @click="resetFilters">Réinitilaiser</button>
                </div>
            </form>


            <section class="listePrestataire">
                <div v-for="item in prestataires" :key="item.id_prestataire" class="card">
                    <p class="title_presta">{{ item.nom_prestataire }}</p>
                    <!-- <img src=""> -->
                    <div class="description" v-html="item.descri_prestataire">
                    </div>
                    <p>Capacité : <span>{{ Number(item.nb_participants) }}</span></p>
                    <p>Tarif : <span>{{ item.tarif_prestataire }}</span></p>
                    <p>Nombre de services : <span>{{ item.nb_services }}</span></p>
                    <div class="contact_presta">
                        <p class="contact_title"><b>Contact</b></p>
                        <p>{{ item.mail_prestataire }}</p>
                        <p>{{ item.tel_prestataire }}</p>
                    </div>
                    <p>{{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}
                        <span>
                            <button @click="goToSpecificPrestataire(item.id_prestataire)">
                                En savoir plus
                            </button>
                        </span>
                    </p>
                </div>
            </section>
        </section>
    </section>
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
    router.push({ path: "/", query: {} });
    getValuesPrestataire();
}

function goToSpecificPrestataire(idPresta) {
    router.push({
        name: "ShowPrestataire",
        params: {
            id: idPresta
        }
    });
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
        path: "/",
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

.recherche{
    background-color: var(--jaune-logo);
    opacity: 0.9;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.recherche > span{
    font-size: 2.6em;
    font-weight: 800;
    color: #0a1d42;
    padding-top: 60px;
    margin: 50px 0;
    letter-spacing: 1px;
}

.filtreEtListe{
    width: 100%;
    display: flex;
    justify-content: space-between;

    margin-top: 30px;
}

.filtrePrestataire{
    width: 30%;
    display: flex;
    flex-direction: column;

    padding: 15px calc(5px + 1%);
    gap: 1.5em;

    color: #0a1d42;
    background-color: var(--jaune-logo);

    margin-bottom: 20px;
}

.blocFiltre{
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 3px;
}

.blocFiltre span{
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 500;
}

.blocFiltre input{
    border:none;
    border-radius: 10px;
    padding: 4px;

    max-width: 17em;
}

.prix {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.boutonsFiltre{
    display: flex;
    justify-content: space-around;
}

.boutonsFiltre{
  font-size: 15px;
  text-align: center;
  align-items: baseline;
  display: flex;
  justify-content: space-evenly;
  padding: 10px;

  border-radius: 0 0 10px 10px;
}

.boutonsFiltre button{

  font-size: 16px;

  font-weight: bolder;

  color:#0a1d42;
  background-color: var(--jaune-logo);
  border: none;
  border-radius: 10px;
  padding: 6px;
}

.boutonsFiltre button:hover{
    background-color: var(--jaune-logo);
    color: black;
    background-color: white;
    opacity: 0.9;
    transition: var(--transition-fast);
}





.listePrestataire {
    width: 65%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;

    padding: 20px;

    background-color: white;
}

</style>