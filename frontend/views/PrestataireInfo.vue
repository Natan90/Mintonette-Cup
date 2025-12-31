<template>
    <!-- Barre de navigation principale -->
    <NavView id="nav_bar"></NavView>

    <div class="container">
        <!-- Titre principal de la page -->
        <div class="title">
            <p>{{ $t('prestataireInfo.title') }}</p>
        </div>

        <div class="content">
            <!-- Sous-titre indiquant le rôle du prestataire -->
            <div class="subtitle">
                <p>{{ $t('prestataireInfo.role') }}</p>
            </div>

            <!-- Liste des types de prestataires disponibles -->
            <div class="type_prestataire">
                <div
                    v-for="(item, index) in type_prestataire"
                    :key="index"
                    class="boite_type_presta"
                    :id="`p-${index}`">
                    <!-- Bouton de sélection du type de prestataire -->
                    <button
                        class="button_type_presta"
                        @click="selectTypePresta(index)">
                        {{ item.nom_type_prestataire }}
                    </button>
                </div>
            </div>

            <!-- Tableau affichant les spécificités selon le type choisi -->
            <div v-if="selectedType" class="container_table">
                <h1>
                    {{ $t('prestataireInfo.type') }} {{ selectedTypeLabel }} ?
                </h1>

                <table class="table_type_presta">
                    <tbody>
                        <!-- Liste des options possibles -->
                        <tr
                            v-for="(item, index) in selectedItems"
                            :key="index"
                            class="table-row">
                            <td>
                                <!-- Checkbox (une seule sélection autorisée) -->
                                <input
                                    type="checkbox"
                                    :id="`item-${index}`"
                                    :value="index"
                                    @change="onCheckChange($event, item.nom, index)"
                                    :checked="isCheckedWithIndex(index)"
                                    :disabled="continueInscription"/>
                                <label :for="`item-${index}`">
                                    {{ item.nom }}
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Message d'erreur si la sélection des checkbox est invalide -->
    <div class="message_error" v-if="errorMessageCheckBox">
        <p>{{ errorMessageCheckBox }}</p>
    </div>

    <!-- Bouton pour continuer l'inscription (uniquement en mode ajout) -->
    <div class="button_container" v-if="!continueInscription && pathAdd">
        <button
            @click.prevent="showContinueInscription"
            :disabled="!isSelectionValid"
            :class="{ disabled: !isSelectionValid }">
            {{ $t('prestataireInfo.btnContinueInscription') }}
        </button>
    </div>

    <!-- Bouton retour vers la sélection du type -->
    <div class="button_container" v-if="continueInscription && pathAdd">
        <button @click.prevent="hideContinueInscription">
            {{ $t('prestataireInfo.btnRetour') }}
        </button>
    </div>

    <!-- Formulaire de création / modification du prestataire -->
    <div
        class="prestataire_container"
        v-if="continueInscription || !pathAdd"
        id="presta_container">
        <div class="editor_container">

            <!-- Champ : nom du prestataire -->
            <div class="form_group">
                <label for="nom">
                    {{ $t('prestataireInfo.formulaire.nom') }}
                </label>
                <input type="text" id="nom" v-model="nom_presta" />
            </div>

            <!-- Champ : description avec éditeur TinyMCE -->
            <div class="form_group">
                <label>
                    {{ $t('prestataireInfo.formulaire.descri') }}
                </label>
                <Editor
                    v-model="descri_presta"
                    api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo"
                    :init="{
                        height: 600,
                        menubar: false,
                        plugins: 'lists link image table media code preview anchor',
                        toolbar: 'undo redo | bold italic underline | bullist numlist | link | table hr | preview code',
                        branding: false
                    }"
                />
            </div>

            <!-- Champ : nombre de participants -->
            <div class="form_group">
                <label for="participants">
                    {{ $t('prestataireInfo.formulaire.nbParticipants') }}
                </label>
                <input
                    type="number"
                    id="participants"
                    v-model="nb_participants"
                    min="1"
                />
            </div>

            <!-- Champ : tarif -->
            <div class="form_group">
                <label for="tarif">
                    {{ $t('prestataireInfo.formulaire.tarif') }}
                </label>
                <input type="number" id="tarif" v-model="tarif_presta" />
            </div>

            <!-- Champ : email de contact -->
            <div class="form_group">
                <label for="contact">
                    {{ $t('user.mail') }}
                </label>
                <input
                    type="text"
                    id="contact"
                    v-model="mail_presta"
                    placeholder="mail@example.com"
                />
            </div>

            <!-- Champ : téléphone -->
            <div class="form_group">
                <label for="contact">
                    {{ $t('user.tel_utilisateur') }}
                </label>
                <input
                    type="tel"
                    id="contact"
                    v-model="tel_presta"
                    pattern="^0[1-9][0-9]{8}$"
                    placeholder="0123456789"
                />
            </div>

            <!-- Message de succès ou d’erreur après action -->
            <div
                v-if="message"
                class="message"
                :class="messageType === 'error'
                    ? 'message-error'
                    : 'message-success'">
                <span class="text">{{ message }}</span>
            </div>

            <!-- Bouton de modification (mode édition) -->
            <div class="button_container" v-if="!pathAdd">
                <button
                    @click="updatePresta"
                    :disabled="!isSelectionValid"
                    :class="{ disabled: !isSelectionValid }">
                    {{ $t('prestataireInfo.formulaire.btnModifier') }}
                </button>
            </div>

            <!-- Bouton d'inscription (mode ajout) -->
            <div class="button_container" v-else>
                <button @click="addPrestataire">
                    {{ $t('user.buttonInscription') }}
                </button>
            </div>

            <!-- Bouton de suppression du prestataire -->
            <div class="button_container">
                <button @click="delPresta">
                    {{ $t('adminPage.prestataire.btn_suppr') }}
                </button>
            </div>
        </div>
    </div>

    <!-- Pied de page -->
    <Footer></Footer>
</template>


<script setup>
import NavView from '@/components/NavView.vue';
import { ref, onMounted, computed, nextTick } from "vue";
import { useUserStore } from '@/stores/user';
import { useRoute } from "vue-router";
import axios from 'axios';

import Editor from "@tinymce/tinymce-vue";
import Footer from '@/components/Footer.vue';


const userStore = useUserStore();
const route = useRoute();

const prestaId = computed(() => route.params.id);
const pathAdd = computed(() => route.name === "AddPrestataire");

const message = ref('');
const messageType = ref('success');


//=========================
//=== Type prestataire ====
//=========================
const type_prestataire = ref([]);
const type_animation = ref([]);
const type_restauration = ref([]);
const type_boutique = ref([]);


const selectedType = ref("animation");
const selectedTypeId = ref(1);
const continueInscription = ref(false);
const checkedItems = ref([]);


//=========================
//===== Inputs fields =====
//=========================
const nom_presta = ref('');
const descri_presta = ref('');
const nb_participants = ref(1);
const tarif_presta = ref(0);
const mail_presta = ref('');
const tel_presta = ref('');



const selectedNames = computed(() => checkedItems.value.map(item => item.nom));

const isSelectionValid = computed(() => {
    return checkedItems.value.length == 1;
});

onMounted(async () => {
    try {
        await getValuesTypePresta();
        await getValuesEveryType();
        if (!pathAdd.value)
            await getValuesPrestataire();
    } catch (err) {
        console.error(err);
    }
});


const errorMessageCheckBox = computed(() => {
    if (checkedItems.value.length === 0) {
        return 'Veuillez sélectionner une option.'
    }
    if (checkedItems.value.length > 1) {
        return 'Veuillez sélectionner une seule option.'
    }
    return ''
})


const selectedItems = computed(() => {
    switch (selectedType.value) {
        case "animation":
            return type_animation.value.map(item => ({ nom: item.nom_type_animation }));
        case "boutique":
            return type_boutique.value.map(item => ({ nom: item.nom_type_boutique }));
        case "reservation":
            return type_restauration.value.map(item => ({ nom: item.nom_type_restauration }));
        default:
            return [];
    }
});

const selectedTypeLabel = computed(() => {
    switch (selectedType.value) {
        case "animation":
            return "d'animation";
        case "boutique":
            return "de boutique";
        case "reservation":
            return "de restauration";
        default:
            return "";
    }
});


//=========================
//======== Events =========
//=========================
function isCheckedWithIndex(index) {
    return checkedItems.value.some(i => i.index === index);
}

function onCheckChange(event, nom, index) {
    if (event.target.checked) {
        checkedItems.value.push({ nom, index });
    } else {
        checkedItems.value = checkedItems.value.filter(i => i.index !== index);
    }
    console.log("checkedItems :", checkedItems.value);
}

function showContinueInscription() {
    continueInscription.value = true;

    nextTick(() => {
        const element = document.getElementById("presta_container");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    });
}

function hideContinueInscription() {
    continueInscription.value = false;

    nextTick(() => {
        const element = document.getElementById("nav_bar");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    });
}


function selectTypePresta(index) {
    const typeObj = type_prestataire.value[index];
    if (typeObj) {
        selectedType.value = typeObj.nom_type_prestataire.toLowerCase();
        selectedTypeId.value = typeObj.id_type_prestataire;
    }
}

function delPresta() {
    userStore.delPresta();
}

//=========================
//= Async functions types =
//=========================
async function getValuesTypePresta() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
}

async function getValuesEveryType() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showEveryType");
        type_animation.value = res.data.animations;
        type_restauration.value = res.data.restaurations;
        type_boutique.value = res.data.boutiques;
    } catch (err) {
        console.error(err);
    }
}


//==========================
//= Async functions presta =
//==========================
async function getValuesPrestataire() {
    if (prestaId.value === null) return;

    try {
        const res = await axios.get(`http://localhost:3000/prestataire/show/${prestaId.value}`);
        const presta = res.data;

        nom_presta.value = presta.nom_prestataire;
        descri_presta.value = presta.descri_prestataire;
        nb_participants.value = presta.nb_participants;
        tarif_presta.value = presta.tarif_prestataire;
        mail_presta.value = presta.mail_prestataire;
        tel_presta.value = presta.tel_prestataire;

        const typeObj = type_prestataire.value.find(t => t.id_type_prestataire === presta.type_prestataire_id);
        if (typeObj) {
            selectedType.value = typeObj.nom_type_prestataire.toLowerCase();
            selectedTypeId.value = typeObj.id_type_prestataire;
        }
        await nextTick();

        let spec = presta.specificite;

        // Pour suppirmer tous les trucs chiants
        if (typeof spec === 'string') {
            spec = spec.replace(/[\{\}"]/g, '').trim();
        }

        const index = selectedItems.value.findIndex(
            item => item.nom.trim().toLowerCase() === spec.toLowerCase()
        );
        if (index !== -1) {
            checkedItems.value = [{ nom: selectedItems.value[index].nom, index }];
        } else {
            checkedItems.value = [];
        }

        console.log("checkedItems :", checkedItems.value);
        console.log(presta.specificite);

    } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
    }
}

async function addPrestataire() {
    try {
        const res = await axios.post(`http://localhost:3000/prestataire/becomePrestataire/${prestaId.value}`, {
            nom: nom_presta.value,
            descri: descri_presta.value,
            nb_participants: Number(nb_participants.value),
            tarif: Number(tarif_presta.value),
            mail: mail_presta.value,
            tel: tel_presta.value,
            specificite: selectedNames.value,
            type: Number(selectedTypeId.value)
        });
        // changePresta(true);
        message.value = res.data.message;
        messageType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            message.value = err.response.data.error;
        } else {
            message.value = "Erreur inconnue";
        }
        messageType.value = 'error';
    }
}

async function updatePresta() {
    try {
        const res = await axios.put(`http://localhost:3000/prestataire/updatePresta/${prestaId.value}`, {
            nom: nom_presta.value,
            descri: descri_presta.value,
            nb_participants: Number(nb_participants.value),
            tarif: Number(tarif_presta.value),
            mail: mail_presta.value,
            tel: tel_presta.value,
            specificite: selectedNames.value,
            type: Number(selectedTypeId.value)
        });
        message.value = res.data.message;
        messageType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            message.value = err.response.data.error;
        } else {
            message.value = "Erreur inconnue";
        }
        messageType.value = 'error';
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #0a1d42;
}

.title p {
    text-align: center;
    font-size: 2.5em;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--primary-color);
}

.subtitle p {
    font-size: 1.3em;
    text-align: center;
    margin-bottom: 30px;
    color: black;
}

.type_prestataire {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
}

.button_type_presta {
    background: linear-gradient(135deg, #f7c325, #ffdb59);
    color: #0a1d42;
    font-weight: 700;
    font-size: 1.1em;
    padding: 15px 30px;
    border: none;
    border-radius: 30px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 6px 15px rgba(247, 195, 37, 0.4);
    transition: all 0.3s ease;
}

.button_type_presta:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 0 20px rgba(247, 195, 37, 0.6), 0 0 8px rgba(247, 195, 37, 0.4) inset;
}

.button_type_presta:active {
    transform: translateY(2px) scale(0.98);
    box-shadow: 0 3px 10px rgba(0, 87, 255, 0.3);
}

.container_table {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.table_type_presta {
    width: 400px;
    max-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.table_type_presta td {
    padding: 15px 20px;
    font-size: 1em;
}

.table-row {
    border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
    border-bottom: none;
}

.other-option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.other-option input[type="text"] {
    flex: 1;
    padding: 6px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.container_table h1 {
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #1b2e59;
}

.prestataire_container {
    display: flex;
    justify-content: center;
    padding-top: 80px;
    width: 100%;
    box-sizing: border-box;
}

.editor_container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    margin-top: 60px;
}

.tox-tinymce {
    width: 100% !important;
}

.form_group label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
}

.form_group input,
.form_group select {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.form_group button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #f7c325, #ffdb59);
    color: #0a1d42;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

.form_group button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(247, 195, 37, 0.4);
}

.message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    margin-top: 10px;
    animation: fadeIn 0.3s ease;
}

.message-success {
    background: #e6f9f0;
    color: #0f7a4a;
    border: 1px solid #5ad39c;
}

.message-error {
    background: #fdecea;
    color: #b42318;
    border: 1px solid #f5a3a3;
}

.message_error {
    display: flex;
    justify-content: center;
    color: red;
    font-weight: bold;
    font-size: 1.2em;
}
</style>
