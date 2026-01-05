<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="modal-backdrop" v-if="isDelete">
        <div class="modal-content">
            <span class="modal-close" @click="closeModal">&times;</span>
            <div>
                <p>
                    {{ $t('adminPage.prestataire.modal.confirmation') }}
                    <span class="name_delete background_name" v-if="selectedPresta">{{ selectedPresta.nom_prestataire
                        }}</span> ?
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
        <div class="textAndFiltre">
            <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
                {{ $t('adminPage.prestataire.nb_presta', { count: prestataires.filter(p => p.waitingforadmin).length, 
                    gotS : prestataires.filter(p => p.waitingforadmin).length > 1  ? 's' : '',
                    verbe : prestataires.filter(p => p.waitingforadmin).length > 1  ? 'are' : 'is' }) }}
            </p>
            <p class="nb_presta valid" v-else>
                {{ $t('adminPage.prestataire.nb_prestaVide') }}
            </p>
            <p>
            <div class="filtre">
                <label for="triAlpha">{{ $t('adminPage.tri.nom') }}</label>
                <select id="triAlpha" v-model="adminStore.typeTriPresta">
                    <option value="az">{{ $t('adminPage.tri.az') }}</option>
                    <option value="za">{{ $t('adminPage.tri.za') }}</option>
                    <option value="attente">{{ $t('adminPage.tri.attente') }}</option>
                    <option value="valide">{{ $t('adminPage.tri.valide') }}</option>
                </select>
            </div>
            </p>
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
                        <td :class="item.refused ? 'refused' : (item.waitingforadmin ? 'waiting' : 'notWaiting')">
                            {{ item.refused ? $t('adminPage.prestataire.statuts.refuse')
                                : (item.waitingforadmin
                                    ? $t('adminPage.prestataire.statuts.enAttente', { changement : item.message_ajout 
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
    </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';
import { useAdminStore } from "@/stores/admin";


const router = useRouter();
const adminStore = useAdminStore();

const isDelete = ref(false);
const deleting = ref(false);
const refusing = ref(false);

const prestataires = ref([]);
const selectedPresta = ref(null);
const deletedPresta = ref(null);
const refusedPresta = ref(null);


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
    router.push({
        name: "ShowPrestataire",
        params: {
            id: idPresta
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

async function validPrestataire(presta) {
    try {
        const res = await axios.patch(`http://localhost:3000/admin/prestataire/validate/${presta.id_prestataire}`);

        await changePresta(true, presta.id_utilisateur);
        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
}

async function refuserPrestataire(presta) {
    try {
        refusedPresta.value = presta;

        const res = await axios.patch(`http://localhost:3000/admin/prestataire/refuser/${presta.id_prestataire}`);

        refusing.value = true;
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

.refused {
    color: #b91c1c;
    font-weight: 600;
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