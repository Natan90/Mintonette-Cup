<template>
    <nav class="barre-nav">
      <img src="../images/logo.png" alt="logo" id="logo">
      <div class="log">
        <span>
          <img src="../images/france.png" alt="france" class="drapeau"> /
          <img src="../images/grande-bretagne.png" alt="grande-bretagne" class="drapeau">
        </span>
        <span><strong>Se connecter / S'identifier</strong></span>
      </div>
    </nav>


</template>




<style>
body{
  margin: 0;
  height: 100vh;
  top: 0;
}
</style>

<style scoped>
.barre-nav{
  padding: 0;
  background-color: #00167a;
  display: flex;
  justify-content: space-between; /*space-around*/
  color: white;
  font-size: 1.2em;
}
#logo{
  height: 100px;
}
.log{
  align-content: center;
}
.log span{
  padding: 0px 25px;
}
.drapeau{
  height: 25px;
  width: 40px;
}

</style>

<script setup>
</script>