<template>
    <div>
        <NavBar />

        <main class="gradin-nord">
            <h1>Gradin Nord</h1>
        </main>

        <section class="seating-container">
            <p class="legend">Cliquez sur une place pour réserver / annuler</p>

            <div class="seating-grid">
                <button
                    v-for="n in 40"
                    :key="n"
                    class="seat"
                    @click="$event.currentTarget.classList.toggle('reserved')"
                    :title="`Place ${n} — cliquer pour réserver / annuler`"
                >
                    <img
                        :src="require('@/assets/seat.png')"
                        :alt="`Place ${n} — cliquer pour réserver / annuler`"
                        class="seat-icon"
                        draggable="false"
                    />
                    {{ n }}
                </button>
            </div>

            <Footer />
        </section>
    </div>
</template>

<script>
import NavBar from '../NavView.vue'
import Footer from '../Footer.vue'

export default {
    name: 'GradinNord',
    components: {
        NavBar,
        Footer
    }
}
</script>

<style scoped>
.gradin-nord {
    padding: 16px;
}
</style>