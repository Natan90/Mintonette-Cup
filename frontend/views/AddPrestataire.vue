<template>
    <NavView></NavView>
    <div>
        <div>
            <p id="p1" draggable="true" @dragstart="dragstart_handler">
                Test déplacement
            </p>
        </div>

        <p id="target" @dragover="dragover_handler" @drop="drop_handler">
            Zone pour déposer
        </p>
    </div>
</template>

<script setup>
import NavView from '@/components/NavView.vue';

function dragstart_handler(ev) {
    // On stocke l'ID de l'élément
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
}
</script>

<style scoped>
#target {
    padding: 20px;
    border: 2px dashed #888;
    min-height: 50px;
}
</style>
