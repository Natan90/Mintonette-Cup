<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="main_content">
        <div class="all_presta">
            <table>
                <thead>

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
                        <td>
                            {{ item.waitingForAdmin }}
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
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';

const prestataires = ref([]);

onMounted(async () => {
    try {
        await getPrestataires();
    } catch (err) {
        console.error(err);
    }
})


async function getPrestataires() {
    try {
        const result = await axios.get("http://localhost:3000/prestataire/show");
        prestataires.value = result.data;


    } catch (err) {
        console.error(err);
    }
}


</script>


<style scoped>
.main_content {
    margin-left: 250px;
}
</style>