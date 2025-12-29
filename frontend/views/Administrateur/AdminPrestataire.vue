<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="modal-backdrop" v-if="isDelete">
        <div class="modal-content">
            <span class="modal-close" @click="closeModal">&times;</span>
            <div>
                <p>
                    {{ $t('adminPage.prestataire.modal.confirmation') }}
                    <span class="name_delete background_name" v-if="selectedPresta">{{ selectedPresta.nom_prestataire }}</span> ?
                </p>

            </div>
            <div>
                <button @click="deletePrestataire(id_prestataire)" class="btn_modal btn_supprimer">
                    {{ $t('adminPage.prestataire.modal.btn_confirmer') }}
                </button>
            </div>
        </div>
    </div>
    <div class="main_content">
        <h1 class="page_title">
            {{ $t('adminPage.prestataire.title') }}
        </h1>
        <p class="backgroundBorderL page_subtitle">
            {{ $t('adminPage.prestataire.descri') }}
        </p>
        <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
            {{ $t('adminPage.prestataire.nb_presta', { count: prestataires.length }) }}
        </p>
        <p class="nb_presta valid" v-else>
            {{ $t('adminPage.prestataire.nb_prestaVide') }}
        </p>
        <p class="backgroundBorderL message_suppr" v-if="deleting">
            <span class="name_delete">{{ deletedPresta.nom_prestataire }}</span>{{ $t('adminPage.prestataire.messageSuppr') }}
            <span class="modal-close" @click="closeMessageSuppr">&times;</span>
        </p>
        <div class="all_data">
            <table class="adminTable">
                <thead>
                    <tr>
                        <th>{{ $t('adminPage.prestataire.prestation') }}</th>
                        <th>{{ $t('user.prenom') }}</th>
                        <th>{{ $t('user.nom') }}</th>
                        <th>{{ $t('adminPage.prestataire.statuts.nom') }}</th>
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
                            {{ item.waitingforadmin ? $t('adminPage.prestataire.statuts.enAttente') : $t('adminPage.prestataire.statuts.valider') }}
                        </td>
                        <td>
                            <span v-if="!item.waitingforadmin">
                                <button class="btn_info">
                                    Aller voir
                                </button>
                                <button class="btn_supprimer" @click="ModalShow(item)">
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
const deleting = ref(false);

const prestataires = ref([]);
const selectedPresta = ref(null);
const deletedPresta = ref(null);


const id_prestataire = ref(0);

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

const closeMessageSuppr = () =>{
    deleting.value = false;
};

function ModalShow(presta) {
    selectedPresta.value = presta;
    id_prestataire.value = presta.id_prestataire;

    isDelete.value = true;
};




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

        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}

async function deletePrestataire(idPresta) {
    try {
        deletedPresta.value = { ...selectedPresta.value };

        const res = await axios.delete(`http://localhost:3000/admin/prestataire/delete/${idPresta}`);

        isDelete.value = false;
        deleting.value = true;
        prestataires.value = prestataires.value.filter(u => u.id_prestataire !== idPresta);
        router.push({ name: 'Prestataires', params: { lang: locale.value } });

        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}


</script>


<style scoped>


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
    color: #374151;
    background: #e0f2fe;
    border-left: 4px solid #3b82f6;
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

.message_suppr {
    position: relative;
    margin: 20px 0;
    background-color: #fee2e2; /* rouge très clair */
    border-left: 6px solid #ef4444;
    color: #7f1d1d;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 6px 14px rgba(239, 68, 68, 0.15);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.waiting {
    color: #d97706;
    font-weight: 600;
}

.notWaiting {
    color: #059669;
    font-weight: 600;
}



</style>