<template>
  <NavView v-if="showNav"></NavView>
  <div class="editor_container">
    <div class="form_group">
      <label for="nom">Nom de la prestation :</label>
      <input type="text" id="nom" v-model="nom_presta" />
    </div>

    <div class="form_group">
      <label>Description détaillée :</label>
      <Editor v-model="descri_presta" api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo" :init="{
        height: 300,
        menubar: false,
        plugins: 'lists link image code',
        toolbar: 'undo redo | bold italic underline | bullist numlist | code',
        branding: false
      }" />
    </div>

    <div class="form_group">
      <label for="participants">Nombre maximum de participants :</label>
      <input type="number" id="participants" v-model="nb_participants" min="1" />
    </div>

    <div class="form_group">
      <label for="tarif">Tarif :</label>
      <input type="number" id="tarif" v-model="tarif_presta" />
    </div>

    <div class="form_group">
      <label for="contact">Email :</label>
      <input type="text" id="contact" v-model="mail_presta" placeholder="mail@example.com" />
    </div>

    <div class="form_group">
      <label for="contact">Téléphone :</label>
      <input type="tel" pattern="^0[1-9][0-9]{8}$" id="contact" v-model="tel_presta" placeholder="0123456789" />
    </div>

    <div
      v-if="localMessage"
      class="message"
      :class="localType === 'error' ? 'message-error' : 'message-success'">
      <span class="text">{{ localMessage }}</span>
    </div>


    <div class="button_container" v-if="showNav">
      <button @click="updatePresta">Modifier</button>
    </div>
    <div class="button_container" v-else>
      <button @click="handleSubmit">S’inscrire</button>
    </div>
  </div>




</template>

<script setup>

//=========================
//==== Async functions ====
//=========================

async function getValuesPrestataire() {
  if (prestaId.value === null) return;

  try {
    const res = await axios.get(`http://localhost:3000/prestataire/show/${prestaId.value}`);

    const presta = res.data;

    nom_presta.value = presta.nom_prestataire;
    descri_presta.value = presta.descri_prestataire;
    nb_participants.value = presta.nb_participants;
    tarif_presta.value = presta.tarif_prestataire;
    mail_presta.value = presta.mail_prestataire;
    tel_presta.value = presta.tel_prestataire;

  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
  }
}

async function updatePresta() {
    try {
        const res = await axios.post(`http://localhost:3000/prestataire/updatePresta/${prestaId.value}`, {
            nom: nom_presta.value,
            descri: descri_presta.value,
            nb_participants: nb_participants.value,
            tarif: tarif_presta.value,
            mail: mail_presta.value,
            tel: tel_presta.value,
            type: localType.value
        });
        localMessage.value = res.data.message;
        localType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            localMessage.value = err.response.data.error;
        } else {
            localMessage.value = "Erreur inconnue";
        }
        localType.value = 'error';
    }
}
</script>

<style scoped>
.editor_container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin: auto;
  margin-top: 60px;
}

.tox-tinymce {
  width: 100% !important;
}

.form_group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form_group input,
.form_group select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form_group button {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f7c325, #ffdb59);
  color: #0a1d42;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.form_group button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(247, 195, 37, 0.4);
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 10px;
  animation: fadeIn 0.3s ease;
}

.message-success {
  background: #e6f9f0;
  color: #0f7a4a;
  border: 1px solid #5ad39c;
}

.message-error {
  background: #fdecea;
  color: #b42318;
  border: 1px solid #f5a3a3;
}

</style>
