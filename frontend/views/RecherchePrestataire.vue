<template>

    <section class="recherche" id="liste_prestataires">

        <div class="titreFiltre">
            <span>{{ $t('filter.titleFilter') }}</span>
        </div>

        <section class="filtreEtListe">

            <form class="filtrePrestataire" @submit.prevent="searchPrestataires" id="filtre_presta">
                <div class="content_slider">
                    <p>Prestataire</p>
                    <label class="switch">
                        <input type="checkbox" v-model="isServiceView">
                        <span class="slider round"></span>
                    </label>
                    <p>Services</p>
                </div>

                <div class="blocFiltre">
                    <span>{{ $t('filter.name.title') }}</span>
                    <input v-model="filters.nom" type="text" v-bind:placeholder="$t('filter.name.nameInput')" />
                </div>

                <div class="blocFiltre">
                <span>{{ $t('filter.categorie.title') }}</span>
                        <div v-for="item in type_prestataire" :key="item.id_type_prestataire">
                            <label class="pointer">
                                <input type="radio" name="categorie" :value="Number(item.id_type_prestataire)"
                                    v-model="filters.category" />
                                {{ item.nom_type_prestataire }}
                            </label>
                        </div>

                        <label class="pointer">
                            <input type="radio" name="categorie" :value="0" v-model="filters.category"/>
                            {{ $t('filter.categorie.all') }}
                        </label>
                </div>

                <div class="blocFiltre" v-if="isServiceView">
                    <span>{{ $t('filter.price.title') }}</span>
                    <div class="prix">
                        <input type="number" v-model="filters.prixMin" v-bind:placeholder="$t('filter.price.minPrice')" />
                        <input type="number" v-model="filters.prixMax" v-bind:placeholder="$t('filter.price.maxPrice')" />
                    </div>
                </div>

                <div class="boutonsFiltre">
                    <button class="pointer" type="submit">{{ $t('filter.button.search') }}</button>
                    <button class="pointer" type="submit" @click="resetFilters">{{ $t('filter.button.reset') }}</button>
                </div>
            </form>

            <section class="listePrestataireBorder">

                <div class="listePrestataire">
                    <div v-for="item in prestatairesFiltres" :key="item.id_prestataire || item.id_service" 
                        class="blocListePrestataire">
                        
                        <div class="enTetePrestataire">
                        <div class="titrePrestataire">
                            <span>
                            {{ isServiceView ? item.nom_service : item.nom_prestataire }}
                            </span>
                        </div>

                        <div class="typePrestataire">
                            <span>
                            {{ isServiceView ? item.nom_type_prestataire : item.nom_type_prestataire }}
                            </span>
                        </div>
                        </div>

                        <div class="descriptionPrestataire">
                        <span>{{ $t('filter.description') }}</span>
                        <div v-html="isServiceView ? item.descri_service : item.descri_prestataire"></div>
                        </div>

                        <div class="blocBasPrestataire">
                        <div class="infosPrestataire">
                            <span>{{ $t('filter.info.title') }}</span>
                            <span v-if="!isServiceView">
                            {{ $t('filter.info.service') }} : {{ item.nb_services }}
                            </span>
                            <span v-else>
                            {{ $t('filter.info.price') }} : {{ item.prix }} €
                            </span>
                            <span v-if="isServiceView">
                            {{ $t('filter.info.participants') }} : {{ item.nb_participants }}
                            </span>
                        </div>

                        <div class="contactPrestataire" v-if="!isServiceView">
                            <span>{{ $t('filter.contact') }}</span>
                            <span>{{ item.prenom_utilisateur }} {{ item.nom_utilisateur }}</span>
                            <span>{{ item.mail_prestataire }}</span>
                            <span>{{ item.tel_prestataire }}</span>
                        </div>
                        </div>

                        <div class="boutonListe" @click="goToSpecificPrestataire(item.id_prestataire || item.id_service)">
                        <span class="pointer">{{ $t('filter.more') }}</span>
                        </div>
                    </div>
                    </div>

            </section>
        </section>
    </section>
</template>



<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useNavigationStore } from '@/stores/navigation';
import { useI18n } from "vue-i18n";


const router = useRouter();
const route = useRoute();
const navStore = useNavigationStore();
const { t } = useI18n();


const isServiceView = ref(false);
watch(isServiceView, async (newValue) => {
  try {
    if (newValue) {
      await getValuesServices();
    } else {
      await getValuesPrestataire();
    }
  } catch (err) {
    console.error(err);
  }
});
const type_prestataire = ref([]);
const prestataires = ref([]);
const filters = ref({
    nom: route.query.nom || '',
    category: route.query.category ? Number(route.query.category) : 0,
    prixMin: route.query.prixMin || null,
    prixMax: route.query.prixMax || null
});

const prestatairesFiltres = computed(() =>
  prestataires.value.filter(p => !p.waitingforadmin)
);

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
    router.push({ path: "/", query: {}, hash: "#liste_prestataires" });
    getValuesPrestataire();
}

function goToSpecificPrestataire(idPresta) {
    navStore.previousRoute = {
        path: route.path,
        query: route.query,
        hash: '#liste_prestataires'
    }
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
async function getValuesServices() {
  try {
    const res = await axios.get('http://localhost:3000/prestataire/services/show');
    prestataires.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

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
        hash: "#liste_prestataires"
    });

    const res = await axios.get('http://localhost:3000/prestataire/showFilter', {
        params: {
            ...filters.value,
            type: isServiceView.value ? 'services' : 'prestataires'
        }
    });

    prestataires.value = res.data;
}


</script>


<style scoped>
.content_slider {
    display: flex;
    align-items: center;
    gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.recherche{
    display: flex;
    flex-direction: column;
}

.titreFiltre{
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: var(--jaune-logo);
    opacity: 0.9;

    text-align: center;
}

.titreFiltre  span{
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
}

/* FILTRE */

.filtrePrestataire{
    width: 30%;
    display: flex;
    flex-direction: column;

    padding: 15px calc(5px + 1%);
    gap: 1.5em;

    height: fit-content; /* C'EST MERVEILLEUX */

    color: #0a1d42;
    background-color: var(--jaune-logo);
    opacity: 0.9;

    border-radius: 0 0 10px 10px;
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
    flex-wrap: wrap;

    row-gap: 1em;
}

.prix input{
    min-width: 6em;
}

.boutonsFiltre{
    font-size: 15px;
    text-align: center;
    align-items: baseline;
    display: flex;
    justify-content: space-evenly;
    padding: 10px;
    flex-wrap: wrap;
    row-gap: 1em;
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

/* FILTRE */

/* LISTE */

.listePrestataireBorder{
    width: 70%;
    background-color: var(--jaune-logo);
    opacity: 0.9;
}

.listePrestataire {
    width: calc(100% - 40px);
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;

    padding: 20px;

    border-radius: 10px 10px 0 0;

    background-color: var(--couleur-fond);

}

.blocListePrestataire{

    display: flex;
    flex-direction: column;
    gap: 1em;

    width: 430px;
    height: fit-content;

    padding: 12px 10px 10px 10px;

    border-radius: 10px;

    opacity: 0.9;
}

.blocListePrestataire:nth-child(2n+1){
    color: #0a1d42;
    background-color: var(--jaune-logo);
}

.blocListePrestataire:nth-child(2n){
    color: #0a1d42;
    background-color: var(--jaune-logo);

    .typePrestataire{
        color: var(--bleu-logo);
        background-color: var(--jaune-logo);
    }

    .blocBasPrestataire{
        color: var(--bleu-logo);
        background-color: var(--jaune-logo);
    }

    .infosPrestataire :not(:first-child),
    .contactPrestataire :not(:first-child){
        border-left: 4px solid var(--bleu-logo);
    }

    .boutonListe span{
        color: var(--jaune-logo);
    }

    .boutonListe span:hover{
        color: orangered;
        transition: var(--transition-fast);
    }
}

.blocListePrestataire:nth-child(2n){
    color: var(--jaune-logo);
    background-color: var(--bleu-logo);
}

.blocListePrestataire:hover{
    opacity: 1;
    transform: scale(1.05);
    transition: var(--transition-fast);
}

.enTetePrestataire{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    
    margin-bottom: 1em;

    font-weight: 500;
}

.typePrestataire{
    padding: 3px;
    text-align: end;

    border-radius: 2px;

    color: var(--jaune-logo);
    background-color: var(--bleu-logo);
}

.titrePrestataire{
    width: 30%;
    display: flex;
    flex-direction: column;

    font-size: 1.25em;
    font-weight: 1000;
    gap: 0.5em;
    text-align: center;
}

.titrePrestataire img{
    width: 100%;
    object-fit: contain;
}

.descriptionPrestataire{
    margin-bottom: 1.3em;
}

.descriptionPrestataire div{
    font-weight: 500;
    padding-left: 1em;
}

.blocBasPrestataire{
    width: 100%;

    display: flex;
    flex-direction: row;

    flex-wrap: wrap;


    gap: 2em;

    padding: 6px 0 10px 0;

    border-radius: 2px;

    color: var(--jaune-logo);
    background-color: var(--bleu-logo);
}

.descriptionPrestataire,
.infosPrestataire,
.contactPrestataire{
    display: flex;
    flex-direction: column;

    padding: 0 0.2em 0 1em ;
}

.descriptionPrestataire :first-child,
.infosPrestataire :first-child,
.contactPrestataire :first-child{
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.5em;
}

.infosPrestataire :not(:first-child),
.contactPrestataire :not(:first-child){
    font-weight: 500;
    padding-left: 0.8em;
    border-left: 4px solid var(--jaune-logo);
}

.boutonListe {
    text-align: right;
}

.boutonListe span{

    font-weight: 600;

    text-decoration: underline;

    color: #0a1d42;
}

.boutonListe span:hover{
    color: purple;
    transition: var(--transition-fast);
}



/* LISTE */


</style>