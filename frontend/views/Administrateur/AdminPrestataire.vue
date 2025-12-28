<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="main_content">
        <h1 class="page_title">
            Gestion des prestataires de la compétition
        </h1>
        <p class="page_subtitle">
            Bienvenue dans l’espace d’administration dédié aux prestataires intervenant sur nos événements de volley.

            Ici, vous pouvez consulter toutes les prestations proposées : restauration, animations, boutiques et services pour les équipes et spectateurs.
            Les demandes en attente doivent être validées avant que le prestataire ne puisse intervenir sur le terrain ou dans les espaces événementiels.

            Cette gestion vous permet de garantir une expérience optimale et sécurisée pour tous les participants.
        </p>
        <p class="nb_presta toValidate" v-if="prestataires.filter(p => p.waitingforadmin).length > 0">
            Il y a {{ prestataires.filter(p => p.waitingforadmin).length }} prestataires en attente de validation.
        </p>
        <p class="nb_presta valid" v-else>
            Tous les prestataires sont prêts pour le terrain et les espaces événementiels : la compétition peut se dérouler en toute sérénité !
        </p>
        <div class="all_presta">
            <table>
                <thead>
                    <tr>
                        <th>Prestation</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Statut</th>
                        <th>Actions</th>
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
                                <button class="btn_supprimer" @click="deletPrestataire(item.id_prestataire)">
                                    Supprimer
                                </button>
                            </span>
                            <span v-if="item.waitingforadmin">
                                <button class="btn_valider" @click="validPrestataire(item.id_prestataire)">
                                    Valider
                                </button>
                                <button class="btn_refuser">
                                    Refuser
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
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';

const prestataires = ref([]);
const message = ref('message');

onMounted(async () => {
    try {
        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
})


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

async function deletPrestataire(idPresta) {
    try {
        const res = await axios.delete(`http://localhost:3000/admin/prestataire/delete/${idPresta}`);
        message.value = res.data.message;

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
  color: #1e3a8a; /* bleu foncé dynamique */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page_subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: #374151; /* gris foncé */
  margin-bottom: 16px;
  background: #e0f2fe; /* bleu très clair pour encadrer le texte */
  padding: 12px 16px;
  border-left: 4px solid #3b82f6; /* barre bleu vif pour accentuer */
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
    color: #d97706; /* couleur orange pour attirer l’attention */
    background-color: #fef3c7; /* jaune clair pour contraste */
}

.valid {
    color: #059669; /* vert vif pour indiquer que c'est validé */
    background-color: #d1fae5; /* vert très clair en arrière-plan pour contraste */
}

/* Conteneur */
.all_presta {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', sans-serif;
  table-layout: fixed;
  text-align: center;
}

/* Header */
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

/* Lignes */
tbody tr {
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Cellules */
td {
  padding: 14px;
  font-size: 15px;
  color: #333;
  vertical-align: middle;
  word-wrap: break-word;
}

/* Statuts */
.waiting {
  color: #d97706;
  font-weight: 600;
}

.notWaiting {
  color: #059669;
  font-weight: 600;
}

/* Boutons */
td button {
  margin-left: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Bouton valider */
.btn_valider {
  background-color: #10b981;
  color: white;
}

.btn_valider:hover {
  background-color: #059669;
}

/* Bouton refuser */
.btn_refuser {
  background-color: #ef4444;
  color: white;
}

.btn_refuser:hover {
  background-color: #dc2626;
}

/* Bouton supprimer (validé) */
.btn_supprimer {
  background-color: #6b7280;
  color: white;
}

.btn_supprimer:hover {
  background-color: #4b5563;
}

/* Responsive */
@media (max-width: 900px) {
  table {
    font-size: 13px;
  }

  td {
    padding: 10px;
  }

  td button {
    margin-top: 6px;
  }
}

</style>