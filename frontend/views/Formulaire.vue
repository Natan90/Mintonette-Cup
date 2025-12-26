<template>
    <div>
        <div>
            <p>Formulaire de recherche</p>
            <input placeholder="Rechercher par nom ..."></input>

            <p>Catégorie de services</p>
            <ul>
                <li v-for="(item, index) in items" :key="index"></li>
            </ul>

            <p>Choisir par prix</p>
            <div class="prix">
                <input type="number" placeholder="Prix min"></input>
                <input type="number" placeholder="Prix max"></input>
            </div>

            <div>
                <span>
                    <button>Rechercher</button>
                </span>
            </div>
        </div>

    </div>
</template>


<script setup>





</script>


<style>

</style>

<style scoped>




.prix {
    display: flex;
    flex-direction: row;
}

</style>