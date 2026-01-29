<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <Modal v-model="isDelete">
        <template #content>
            <p>
                {{ $t('adminPage.prestataire.modal.confirmation') }}
                <span class="name_delete background_name">
                    {{ selectedPresta.nom_prestataire }}
                </span>
                ?
            </p>

            <button @click="deletePrestataire(id_prestataire)" class="btn_modal btn_supprimer">
                {{ $t('adminPage.prestataire.modal.btn_confirmer') }}
            </button>
        </template>

    </Modal>

    <div class="main_content">
        <h1 class="page_title">
            {{ $t('adminPage.prestataire.title') }}
        </h1>
        <p class="backgroundBorderL page_subtitle">
            {{ $t('adminPage.prestataire.descri') }}
        </p>
        <div class="textAndFiltre">
            <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
                {{$t('adminPage.prestataire.nb_presta', {
                    count: prestataires.filter(p => p.waitingforadmin).length,
                    gotS: prestataires.filter(p => p.waitingforadmin).length > 1 ? 's' : '',
                    verbe: prestataires.filter(p => p.waitingforadmin).length > 1 ? 'are' : 'is'
                })}}
            </p>
            <p class="nb_presta valid" v-else>
                {{ $t('adminPage.prestataire.nb_prestaVide') }}
            </p>
            <div class="filtre">
                <label for="triAlpha">{{ $t('adminPage.tri.nom') }}</label>
                <select id="triAlpha" v-model="adminStore.typeTriPresta">
                    <option value="az">{{ $t('adminPage.tri.az') }}</option>
                    <option value="za">{{ $t('adminPage.tri.za') }}</option>
                    <option value="attente">{{ $t('adminPage.tri.attente') }}</option>
                    <option value="valide">{{ $t('adminPage.tri.valide') }}</option>
                </select>
            </div>
        </div>
        <p class="backgroundBorderL message suppr" v-if="deleting">
            <span class="name_delete">{{ deletedPresta.nom_prestataire }}</span>{{
                $t('adminPage.prestataire.messageSuppr') }}
            <span class="modal-close" @click="closeMessageSuppr">&times;</span>
        </p>
        <p class="backgroundBorderL message refus" v-else-if="refusing">
            <span class="name_delete">{{ refusedPresta.nom_prestataire }}</span>{{
                $t('adminPage.prestataire.messageRefus') }}
            <span class="modal-close" @click="closeMessageRefus">&times;</span>
        </p>

        <div class="tabs-container">
            <button :class="['tab-button', { active: activeTab === 'table' }]" @click="activeTab = 'table'">
                <span>📋</span> Liste des prestataires
            </button>
            <button :class="['tab-button', { active: activeTab === 'map' }]" @click="activeTab = 'map'">
                <span>🗺️</span> Carte des zones
            </button>
        </div>

        <div v-show="activeTab === 'table'" class="all_data">
            <table class="adminTable">
                <thead>
                    <tr>
                        <th>{{ $t('adminPage.prestataire.prestation') }}</th>
                        <th>{{ $t('user.prenom') }}</th>
                        <th>{{ $t('user.nom') }}</th>
                        <th>Zone</th>
                        <th>{{ $t('adminPage.prestataire.statuts.nom') }}</th>
                        <th>{{ $t('adminPage.prestataire.action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in prestatairesFiltres" :key="item.id_prestataire">
                        <td>
                            <b>{{ item.nom_prestataire }}</b>
                        </td>
                        <td>
                            {{ item.prenom_utilisateur }}
                        </td>
                        <td>
                            {{ item.nom_utilisateur }}
                        </td>
                        <td>
                            <span v-if="item.id_zone" class="zone-badge assigned">
                                Zone {{ item.id_zone }}
                            </span>
                            <span v-else class="zone-badge unassigned">
                                Non attribuée
                            </span>
                        </td>
                        <td :class="item.refused ? 'refused' : (item.waitingforadmin ? 'waiting' : 'notWaiting')">
                            {{ item.refused ? $t('adminPage.prestataire.statuts.refuse')
                                : (item.waitingforadmin
                                    ? $t('adminPage.prestataire.statuts.enAttente', {
                                        changement: item.message_ajout
                                            ? $t('adminPage.prestataire.statuts.messageAjout')
                                            : $t('adminPage.prestataire.statuts.messageModif')
                                    })
                                    : $t('adminPage.prestataire.statuts.valider')) }}
                        </td>
                        <td>
                            <span v-if="!item.waitingforadmin">
                                <button class="btn_info" @click="goToSpecificPrestataire(item.id_prestataire)">
                                    {{ $t('adminPage.bouton.btn_voir') }}
                                </button>
                                <button class="btn_supprimer" @click="ModalShow(item)">
                                    {{ $t('adminPage.bouton.btn_suppr') }}
                                </button>
                            </span>
                            <span v-if="item.waitingforadmin">
                                <button class="btn_valider" @click="validPrestataire(item)">
                                    {{ $t('adminPage.bouton.btn_valid') }}
                                </button>
                                <button class="btn_refuser" @click="refuserPrestataire(item)">
                                    {{ $t('adminPage.bouton.btn_refuser') }}
                                </button>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-show="activeTab === 'map'" class="map-view">
            <ZoneMap :key="zoneMapKey" />
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';
import ZoneMap from '@/components/ZoneMap.vue';
import { useAdminStore } from "@/stores/admin";
import { useNavigationStore } from "@/stores/navigation";
import { useAdminAPIStore } from '@/services/admin.service.js';
import { usePrestataireStore } from '@/services/prestataire.service.js';
import Modal from '@/components/Modal.vue';
import { useI18n } from 'vue-i18n';


const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const navStore = useNavigationStore();
const adminAPIStore = useAdminAPIStore();
const prestataireStore = usePrestataireStore();

const isDelete = ref(false);
const deleting = ref(false);
const refusing = ref(false);
const activeTab = ref('table');
const zoneMapKey = ref(0);

const prestataires = ref([]);
const selectedPresta = ref(null);
const deletedPresta = ref(null);
const refusedPresta = ref(null);

const locale = useI18n();


const id_prestataire = ref(0);

onMounted(() => {
    try {
        getPrestataires();
        if (!adminStore.typeTriPresta) adminStore.typeTriPresta = "az";
    } catch (err) {
        console.error(err);
    }
});

watch(activeTab, (newTab) => {
    if (newTab === 'table') {
        getPrestataires();
    }
});

const closeModal = () => {
    isDelete.value = false;
};

const closeMessageSuppr = () => {
    deleting.value = false;
};

const closeMessageRefus = () => {
    refusing.value = false;
};

function ModalShow(presta) {
    selectedPresta.value = presta;
    id_prestataire.value = presta.id_prestataire;

    isDelete.value = true;
};

function goToSpecificPrestataire(idPresta) {
    navStore.previousRoute = route.fullPath;
    router.push({
        name: "ShowPrestataire",
        params: {
            id: idPresta
        },
        state: {
            from: route.fullPath
        }
    });
}

const prestatairesFiltres = computed(() => {
    let liste = [...prestataires.value];

    // Tri alphabétique
    liste.sort((a, b) => {
        if (adminStore.typeTriPresta === "attente") {
            if (a.waitingforadmin && !b.waitingforadmin) return -1;
            if (!a.waitingforadmin && b.waitingforadmin) return 1;
        }

        if (adminStore.typeTriPresta === "valide") {
            if (a.waitingforadmin && !b.waitingforadmin) return 1;
            if (!a.waitingforadmin && b.waitingforadmin) return -1;
        }


        const nomA = a.nom_prestataire?.toLowerCase() || "";
        const nomB = b.nom_prestataire?.toLowerCase() || "";

        if (adminStore.typeTriPresta === "za")
            return nomB.localeCompare(nomA);

        return nomA.localeCompare(nomB);

    });

    return liste;
});



async function getPrestataires() {
    try {
        const res = await prestataireStore.GetPrestataires();
        prestataires.value = res.data;
    } catch (err) {
        console.error(err);
    }
}


async function validPrestataire(presta) {
    try {
        const res = await adminAPIStore.ValidePrestataire(presta.id_prestataire);

        await changePresta(true, presta.id_utilisateur);
        await getPrestataires();
        zoneMapKey.value++; // Force le rechargement de ZoneMap
    } catch (err) {
        console.error(err);
    }
}


async function refuserPrestataire(presta) {
    try {
        refusedPresta.value = presta;

        const res = await adminAPIStore.RefuserPrestataire(presta.id_prestataire);

        refusing.value = true;
        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}
// //         const res = await axios.patch(`http://localhost:3000/admin/prestataire/validate/${presta.id_prestataire}`);
//
//         await changePresta(true, presta.id_utilisateur);
//         await getPrestataires();


async function deletePrestataire(idPresta) {
    try {
        deletedPresta.value = { ...selectedPresta.value };

        const res = await adminAPIStore.DeletePrestataire(idPresta);

        isDelete.value = false;
        deleting.value = true;
        prestataires.value = prestataires.value.filter(u => u.id_prestataire !== idPresta);
        router.push({ name: 'Prestataires', params: { lang: locale.value } });

        getPrestataires();
        zoneMapKey.value++; // Force le rechargement de ZoneMap

        console.log("Prestataire supprimé (zone libérée):", deletedPresta.value.nom_prestataire);
    } catch (err) {
        console.error(err);
    }
}

async function changePresta(newValue, idPresta) {
    try {
        const res = await axios.patch(`http://localhost:3000/admin/utilisateur/changePresta/${idPresta}`, {
            valueChange: newValue
        });
        console.log(res.data.message);
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

.tabs-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
}

.tab-button {
    padding: 12px 24px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tab-button span {
    font-size: 18px;
}

.tab-button:hover {
    color: #00167a;
    background: #f3f4f6;
}

.tab-button.active {
    color: #00167a;
    border-bottom-color: #00167a;
    background: #e0e7ff;
}

.map-view {
    margin-top: 20px;
}

.zone-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
}

.zone-badge.assigned {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #10b981;
}

.zone-badge.unassigned {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
}
</style>