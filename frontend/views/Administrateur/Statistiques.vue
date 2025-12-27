<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="main_content">
        statistiques
    </div>
</template>


<script setup>
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';


</script>


<style scoped>
.main_content {
    margin-left: 250px;
}
</style>