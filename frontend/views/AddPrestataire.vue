<template>
    <NavView></NavView>
    <div class="container">
        <div class="content_left">
            <div>
                <p id="target" @dragover="dragover_handler" @drop="drop_handler">
                    Zone pour déposer
                </p>
            </div>

        </div>
        <div class="content_right">
            <div class="title">
                <p>Ajouter un nouveau prestataire</p>
            </div>
            <div class="type_prestataire">
                <div draggable="true" @dragstart="dragstart_handler" v-for="(item, index) in type_prestataire"
                    :key="index" class="boite_type_presta" :class="{ notInBox: !item.inBox }" :id="`p-${index}`">
                    <p class="texte_type_presta">
                        {{ item.nom_type_prestataire }}
                    </p>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup>
import NavView from '@/components/NavView.vue';
import { ref, onMounted } from "vue";
import axios from 'axios';


const isInBox = ref(false);
const type_prestataire = ref([]);

onMounted(async () => {
    try {
        fetchPrestataire();
    } catch (err) {
        console.error(err);
    }
});

async function fetchPrestataire() {
    try {
        const res = await axios.get("http://localhost:3000/prestataire/showTypePrestataire");
        type_prestataire.value = res.data.map(item => ({ ...item, inBox: false }));
    } catch (err) {
        console.error(err);
    }
}

function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function drop_handler(ev) {
    ev.preventDefault();

    const id = ev.dataTransfer.getData("text/plain");
    const element = document.getElementById(id);

    ev.target.appendChild(element);
    const index = parseInt(id.split('-')[1]);
    type_prestataire.value[index].inBox = true;
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
    max-width: 80%;
    margin: 0 auto;
}

.content_left,
.content_right {
    flex: 1;
}

.content_right {
    display: flex;
    flex-direction: column;
}

#target {
    padding: 20px;
    border: 2px dashed #888;
    border-radius: 10px;
    min-height: 50px;
}

.boite_type_presta {
    text-align: center;
}

.type_prestataire {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
}

.texte_type_presta {
    font-size: 1.2em;
    padding: 0px 10px;
}

.notInBox {
    border: 1px solid #888;
    border-radius: 7px;
}
</style>
