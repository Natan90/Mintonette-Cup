<template>
    <NavView></NavView>
    <div class="container">
        <div class="content_left">
            <div>
                <div class="title">
                    <p>Ajouter un nouveau prestataire</p>
                </div>

                <p id="target" @dragover="dragover_handler" @drop="drop_handler">
                    Zone pour déposer
                </p>
            </div>

        </div>
        <div class="content_right">
            <div>
                <p id="p1" draggable="true" @dragstart="dragstart_handler">
                    Test déplacement
                </p>
            </div>
        </div>
    </div>

</template>

<script setup>
import NavView from '@/components/NavView.vue';
import { ref } from "vue";


const isInBox = ref(false);

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
    isInBox.value = true;
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 80px);
}

.content_left, .content_right {
    flex: 1;
}

.title {}

#target {
    padding: 20px;
    border: 2px dashed #888;
    min-height: 50px;
}
</style>
