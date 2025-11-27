<template>
    <NavView></NavView>
    <div class="container">
        <!-- <div class="content_left">
            <div>
                <p id="target" @dragover="dragover_handler" @drop="drop_handler">
                    Zone pour déposer
                </p>
            </div> 

        </div> -->
        <div class="title">
            <p>Devenez membre à part de la Mintonette Cup ! </p>
        </div>
        <div class="content">
            <div class="subtitle">
                <p>Votre rôle dans l’événement : choisissez votre catégorie :</p>
            </div>
            <div class="type_prestataire">
                <!-- <div draggable="true" @dragstart="dragstart_handler" v-for="(item, index) in type_prestataire"
                    :key="index" class="boite_type_presta" :class="{ notInBox: !item.inBox }" :id="`p-${index}`">
                    <p class="texte_type_presta">
                        {{ item.nom_type_prestataire }}
                    </p>
                </div> -->
                <div v-for="(item, index) in type_prestataire" :key="index" class="boite_type_presta"
                    :id="`p-${index}`">
                    <button class="button_type_presta" @click="selectTypePresta(index)">
                        {{ item.nom_type_prestataire }}
                    </button>
                </div>

            </div>
            <div v-if="selectedType === 'animation'">
                test1
            </div>

            <div v-if="selectedType === 'boutique'">
                test2
            </div>

            <div v-if="selectedType === 'equipe'">
                test3
            </div>

            <div v-if="selectedType === 'reservation'">
                test4
            </div>

        </div>
    </div>

</template>

<script setup>
import NavView from '@/components/NavView.vue';
import { ref, onMounted } from "vue";
import axios from 'axios';

const type_prestataire = ref([]);
const selectedType = ref(null);

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

function selectTypePresta(index) {
    const types = ["animation", "boutique", "equipe", "reservation"];
    selectedType.value = types[index] || null;
}


// function dragstart_handler(ev) {
//     ev.dataTransfer.setData("text/plain", ev.target.id);
// }

// function dragover_handler(ev) {
//     ev.preventDefault();
//     ev.dataTransfer.dropEffect = "move";
// }

// function drop_handler(ev) {
//     ev.preventDefault();

//     const id = ev.dataTransfer.getData("text/plain");
//     const element = document.getElementById(id);

//     ev.target.appendChild(element);
//     const index = parseInt(id.split('-')[1]);
//     type_prestataire.value[index].inBox = true;
// }
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    padding: 50px;
}

.title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
}

.subtitle {
    font-size: 1.4em;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.type_prestataire {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
}

.button_type_presta {
    /* background: linear-gradient(135deg, #0057ff 0%, #003bbd 50%, #f7c325 100%); */
    /* background: linear-gradient(135deg, #0057ff, #003bbd); */
    /* color: white; */
    background: linear-gradient(135deg, #f7c325, #ffdb59);
    color: #0a1d42;
    font-weight: 700;
    font-size: 1.1em;
    padding: 12px 26px;
    border: none;
    border-radius: 30px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;

    box-shadow: 0 5px 12px rgba(247, 195, 37, 0.4);
    transition: 0.25s ease-out;
}

.button_type_presta:hover {
    transform: translateY(-4px) scale(1.04);
    box-shadow:
        0 0 18px rgba(247, 195, 37, 0.55),
        0 0 6px rgba(247, 195, 37, 0.6) inset;
    filter: brightness(1.1);
}

.button_type_presta:active {
    transform: translateY(1px) scale(0.97);
    box-shadow: 0 3px 8px rgba(0, 87, 255, 0.3);
}
</style>
