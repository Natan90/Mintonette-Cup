<template>
    <NavView></NavView>
  <div class="container">
    <div class="panier">
      <h2>Votre panier</h2>
        Aucun article dans le panier
        <div v-for="(item, index) in panier" :key="index" class="item">
          <div></div>
          <div> €</div>
        </div>
    </div>

    <div class="total">
      <h2>Total</h2>
      <div class="montant"> €</div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import NavView from '@/components/NavView.vue';
import Footer from '@/components/Footer.vue';

</script>

<style scoped>
.container {
  display: flex;
  gap: 40px;
  padding: 20px;
}
.panier, .total {
  width: 50%;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.montant {
  font-size: 1.6em;
  font-weight: bold;
}
</style>



