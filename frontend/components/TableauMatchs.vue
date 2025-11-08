<template>
    <div class="tableau" v-if="Object.keys(paysLeft).length && Object.keys(paysRight).length">
        <div class="bracket_left">
            <div class="round8">
                <div class="match_group" v-for="(match, gIndex) in Object.values(paysLeft)" :key="'groupeL:' + gIndex">
                    <div class="match">
                        <div class="equipe">{{ match.equipe1.nom_pays }}</div>
                        <div class="equipe">{{ match.equipe2.nom_pays }}</div>
                    </div>
                </div>
            </div>

            <div class="round4">
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
            </div>

            <div class="round2">
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Finale -->
        <div class="final">
            <div class="match">
                <div class="equipe">test</div>
                <div class="equipe">test</div>
            </div>
            <div class="winner">test</div>
        </div>

        <div class="bracket_right">
            <div class="round8">
                <div class="match_group" v-for="(match, gIndex) in Object.values(paysRight)" :key="'groupeR:' + gIndex">
                    <div class="match">
                        <div class="equipe">{{ match.equipe1.nom_pays }}</div>
                        <div class="equipe">{{ match.equipe2.nom_pays }}</div>
                    </div>
                </div>
            </div>

            <div class="round4">
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
            </div>

            <div class="round2">
                <div class="match_group">
                    <div class="match">
                        <div class="equipe">test</div>
                        <div class="equipe">test</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        Chargement des équipes...
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const paysLeft = ref({});
const paysRight = ref({});

onMounted(async () => {
    try {
        const res = await axios.get("http://localhost:3000/pays/huitiemeFinale");
        console.log("Data backend:", res.data);
        paysLeft.value = res.data.left;
        paysRight.value = res.data.right;
    } catch (err) {
        console.error("Erreur fetch pays:", err);
    }
});

</script>





<style>
:root {
    /* Coordonnées à laquelle commencent les barres */
    --verticalVal: 30px;
    --horizontalVal: -50px;

    /* Le gap entre les deux matchs du round4  */
    --gapBetweenRound4Matchs: 130px;
    /* Le padding en hauteur entre les deux matchs du round4 */
    --paddingBottomRound4Matchs: 50px;
    /* La taille de la barre horizontale qui reçoitle gagnant du round8 */
    --widthHorizontalBar: 2px;
    /* La couleur de la barre */
    --barColor: #005bbb;
    /* Longueur de la barre horizontale */
    --horizontalBarLength: 50px;
    /* Hauteur et largeur de la barre horizontale */
    --horizontalBarHeightWidth: 2px;

    /* Calcul de la hauteur de la barre verticale */
    --heightVerticalBarRound4: calc(100% + var(--gapBetweenRound4Matchs) + var(--paddingBottomRound4Matchs) + var(--widthHorizontalBar));

    /* Calcul de la hauteur des matchs du round2 */
    --heightVerticalMatchsRound2: calc(var(var(--heightVerticalBarRound4) - 100%));
}
</style>


<style scoped>
.tableau {
    display: flex;
    flex-direction: row;
    margin: 50px 70px;
    padding: 30px 0px;
    border: 2px solid black;
    border-radius: 10px;
    justify-content: center;
}

.bracket_left {
    display: flex;
    flex-direction: row;
    padding: 0px 50px;
}

.final {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.final .match {
    display: flex;
    flex-direction: row;
}

.bracket_right {
    display: flex;
    flex-direction: row-reverse;
    padding: 0px 50px;
}

.round2,
.round4,
.round8 {
    display: flex;
    flex-direction: column;
    padding: 0px 50px;
}

.round8 {
    justify-content: space-between;
    height: 100%;
}

.round4 {
    justify-content: space-evenly;
    padding: 0px var(--paddingBottomRound4Matchs);
    gap: var(--gapBetweenRound4Matchs);
}

.round2 {
    justify-content: center;
    position: relative;
    height: var(--heightVerticalMatchsRound2);
}

.bracket_left .round2 .match,
.bracket_right .round2 .match {
    margin: auto 0;
}

.match_group {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

}

.round8 .match_group {
    height: 20%;
}

.match {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 60px;
}

.equipe {
    font-size: 0.7em;
    width: 90px;
    margin: 0px 10px;
    padding: 8px 5px;
    /* Padding vertical fixe */
    border-left: 2px solid var(--barColor);
    border-right: 2px solid var(--barColor);
    line-height: 1.4em;
    /* Hauteur de ligne fixe */
}

.equipe:first-child {
    border-top: 2px solid var(--barColor);
}

.equipe:nth-child(2) {
    border-bottom: 2px solid var(--barColor);
}

.round8 .match {
    margin-bottom: 40px;
}

.round4 .match {
    margin-bottom: 0px;
}

/* Barre verticale entre les matchs du round8 */
.round8 .match_group::before {
    content: '';
    position: absolute;
    top: var(--verticalVal);
    bottom: calc(30px + 1px);
    width: 2px;
    background-color: var(--barColor);
}


.bracket_left .round8 .match_group::before {
    right: var(--horizontalVal);
}

.bracket_right .round8 .match_group::before {
    left: var(--horizontalVal);
}

.bracket_right .match_group::before {
    left: var(--horizontalVal);
}

/* Barre horizontale qui envoie le résultat du match */
.bracket_left .match::after {
    content: '';
    position: absolute;
    right: var(--horizontalVal);
    top: var(--verticalVal);
    width: var(--horizontalBarLength);
    height: var(--horizontalBarHeightWidth);
    background-color: var(--barColor);
}

/* Barre horizontale qui reçoit le résultat du match (sauf pour round8 car c'est le premier) */
.bracket_left .match:not(.round8 .match)::before {
    content: '';
    position: absolute;
    left: var(--horizontalVal);
    top: var(--verticalVal);
    width: var(--horizontalBarLength);
    height: var(--horizontalBarHeightWidth);
    background-color: var(--barColor);
}

/* Pareil pour côté droit */
.bracket_right .match::after {
    content: '';
    position: absolute;
    left: var(--horizontalVal);
    top: var(--verticalVal);
    width: var(--horizontalBarLength);
    height: var(--horizontalBarHeightWidth);
    background-color: var(--barColor);
}

.bracket_right .match:not(.round8 .match)::before {
    content: '';
    position: absolute;
    right: var(--horizontalVal);
    top: var(--verticalVal);
    width: var(--horizontalBarLength);
    height: var(--horizontalBarHeightWidth);
    background-color: var(--barColor);
}

/* Bracket gauche : barre verticale pour round4 */
.bracket_left .round4 .match_group:first-child::before {
    content: '';
    position: absolute;
    right: var(--horizontalVal);
    top: var(--verticalVal);
    height: var(--heightVerticalBarRound4);
    width: var(--widthHorizontalBar);
    background-color: var(--barColor);
}

/* Bracket droite : barre verticale pour round4 */
.bracket_right .round4 .match_group:first-child::before {
    content: '';
    position: absolute;
    left: var(--horizontalVal);
    top: var(--verticalVal);
    height: var(--heightVerticalBarRound4);
    width: var(--widthHorizontalBar);
    background-color: var(--barColor);
}
</style>