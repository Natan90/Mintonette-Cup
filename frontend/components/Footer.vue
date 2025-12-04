<template>
  <footer>
    <section class="remerciement">
        <span>AVEC LA COLLABORATION ET UN GRAND MERCI :</span>
        <div class="logos">
            <img src="../images/logo_herault.png" />
            <img src="../images/logo_montpellier.png" />
            <img src="../images/logo_vnl.jpg" />
            <img src="../images/federation_volley.png" />
        </div>

    </section>

    <section class="groupes">

        <div class="groupe">
            <span>PRESTATIARES</span>

            <div class="elements">
                <span class="pointer">À propos</span>
                <span class="pointer">Services</span>
            </div>

        </div>

        <div class="groupe">
            <span>PRODUITS DÉRIVÉS</span>

            <div class="elements">
                <span class="pointer">Produits</span>
                <span class="pointer">Où se rendre ?</span>
            </div>
        </div>

        <div class="groupe">
            <span>CONTACT</span>

            <div class="elements">
                <span class="pointer">Plus d'informations</span>
                <span class="pointer">Où nous trouver ?</span>
                <span class="pointer">Nous contacter</span>
            </div>
        </div>

    </section>

    <section>
        <div class="reseaux">
            <img class="pointer" src="../images/icon_youtube.svg" />
            <img class="pointer" src="../images/icon_instagram.svg" />
            <img class="pointer" src="../images/icon_x.svg" />
            <img class="pointer" src="../images/icon_facebook.svg" />
        </div>
    </section>
  </footer>
</template>

<style scoped>

.pointer{
  cursor: pointer;
}

footer {
    width: 100%;
    background-color: black;

    padding: 20px 0;
}

.remerciement {

    display: flex;
    flex-direction: column;

    gap: 10px;

    margin: 0 30px 30px 30px;
}

.remerciement>span {
    text-align: center;
    font-weight: bold;
    color: white;
}

.logos {
    margin-top: 1.5em;
    margin-bottom: 2em;
    display: flex;
    justify-content: center;
    gap: 40px;
}

.logos img {
    width: 80px;
    height: 80px;
    background-color: white;
}

.groupes {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 15px;
}

.groupe {
    padding: 10px;
    background-color: none;
    border-radius: 10px;
    color: white;
}

.groupe>span {
    font-weight: bold;
}

.elements {
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5em;
}

.elements span {
    margin-left: 0.5em;
}

.elements span:hover {
    color: grey;
    transition: var(--transition-fast);
}

.reseaux {

    background-color: white;

    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 30px;
}

.reseaux img {

    width: 100%;
    width: 50px;

    opacity: 0.8;
}

.reseaux img:hover {
    opacity: 1;
    transition: var(--transition-fast);
}
</style>

<script>
</script>