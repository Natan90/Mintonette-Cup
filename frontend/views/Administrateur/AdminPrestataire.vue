<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="modal-backdrop" v-if="isDelete">
        <div class="modal-content">
            <span class="modal-close" @click="closeModal">&times;</span>
            <div>
                <p>
                    Êtes-vous sûr de vouloir supprimer le prestataire 
                    <span class="name_presta">{{ prestataires[indexPresta].nom_prestataire }}</span> ?
                </p>

            </div>
            <div>
                <button @click="deletePrestataire(id_prestataire)" class="btn_modal btn_supprimer">
                    Confirmer
                </button>
            </div>

        </div>
    </div>
    <div class="main_content">
        <h1 class="page_title">
            {{ $t('adminPage.prestataire.title') }}
        </h1>
        <p class="page_subtitle">
            {{ $t('adminPage.prestataire.descri') }}
        </p>
        <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
            {{ $t('adminPage.prestataire.nb_presta1') }} {{prestataires.filter(p => p.waitingforadmin).length}} {{
                $t('adminPage.prestataire.nb_presta2') }}
        </p>
        <p class="nb_presta valid" v-else>
            {{ $t('adminPage.prestataire.nb_prestaVide') }}
        </p>
        <div class="all_presta">
            <table>
                <thead>
                    <tr>
                        <th>{{ $t('adminPage.prestataire.prestation') }}</th>
                        <th>{{ $t('user.prenom') }}</th>
                        <th>{{ $t('user.nom') }}</th>
                        <th>{{ $t('adminPage.prestataire.statut') }}</th>
                        <th>{{ $t('adminPage.prestataire.action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in prestataires" :key="item.id_prestataire">
                        <td>
                            {{ item.nom_prestataire }}
                        </td>
                        <td>
                            {{ item.prenom_utilisateur }}
                        </td>
                        <td>
                            {{ item.nom_utilisateur }}
                        </td>
                        <td :class="item.waitingforadmin ? 'waiting' : 'notWaiting'">
                            {{ item.waitingforadmin ? 'En attente de validation' : 'Validé' }}
                        </td>
                        <td>
                            <span v-if="!item.waitingforadmin">
                                <button class="btn_info">
                                    Aller voir
                                </button>
                                <button class="btn_supprimer" @click="ModalShow(item.id_prestataire, index)">
                                    {{ $t('adminPage.prestataire.btn_suppr') }}
                                </button>
                            </span>
                            <span v-if="item.waitingforadmin">
                                <button class="btn_valider" @click="validPrestataire(item.id_prestataire)">
                                    {{ $t('adminPage.prestataire.btn_valid') }}
                                </button>
                                <button class="btn_refuser">
                                    {{ $t('adminPage.prestataire.btn_refuser') }}
                                </button>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            {{ message }}
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';

const router = useRouter();

const isDelete = ref(false);

const prestataires = ref([]);
const message = ref('message');

const id_prestataire = ref(0);
const indexPresta = ref(0);

onMounted(async () => {
    try {
        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
});

const closeModal = () => {
    isDelete.value = false;
};

function ModalShow(id, index) {
    id_prestataire.value = id;
    indexPresta.value = index;

    isDelete.value = true;
}


//==========================
//= Async functions presta =
//==========================
async function getPrestataires() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/show");
        prestataires.value = res.data;

    } catch (err) {
        console.error(err);
    }
}

async function validPrestataire(idPresta) {
    try {
        const res = await axios.patch(`http://localhost:3000/admin/prestataire/validate/${idPresta}`);
        message.value = res.data.message;

        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}

async function deletePrestataire(idPresta) {
    try {
        const res = await axios.delete(`http://localhost:3000/admin/prestataire/delete/${idPresta}`);
        message.value = res.data.message;

        isDelete.value = false;
        router.push({ name: 'Prestataires' });

        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}


</script>


<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 300px;
    width: 90%;
    text-align: center;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: #ff0000;
}

.name_presta {
    font-weight: 700;
    color: #1e3a8a;
    background-color: #dbeafe;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
}


.main_content {
    margin-left: 250px;
    padding: 30px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.page_title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.page_subtitle {
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin-bottom: 16px;
    background: #e0f2fe;
    padding: 12px 16px;
    border-left: 4px solid #3b82f6;
    border-radius: 6px;
}

.nb_presta {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    display: inline-block;
    padding: 6px 12px;
    border-radius: 6px;
}

.toValidate {
    color: #d97706;
    background-color: #fef3c7;
}

.valid {
    color: #059669;
    background-color: #d1fae5;
}

.all_presta {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Segoe UI', sans-serif;
    table-layout: fixed;
    text-align: center;
}

thead tr {
    background-color: #f0f2f5;
}

thead th {
    text-align: center;
    padding: 14px;
    font-size: 14px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

tbody tr {
    border-bottom: 1px solid #eaeaea;
    transition: background-color 0.2s ease;
}

tbody tr:hover {
    background-color: #f9fafb;
}

td {
    padding: 14px;
    font-size: 15px;
    color: #333;
    vertical-align: middle;
    word-wrap: break-word;
}

.waiting {
    color: #d97706;
    font-weight: 600;
}

.notWaiting {
    color: #059669;
    font-weight: 600;
}

td button, .btn_modal {
    color: white;
    margin-left: 8px;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn_valider {
    background-color: #10b981;
}

.btn_valider:hover {
    background-color: #059669;
}

.btn_refuser {
    background-color: #f59e0b;
}

.btn_refuser:hover {
    background-color: #d97706;
}

.btn_supprimer {
    background-color: #ef4444;
}

.btn_supprimer:hover {
    background-color: #dc2626;
}

.btn_info {
    background-color: #1e40af;
}

.btn_info:hover {
    background-color: #1e3a8a;
}

</style>