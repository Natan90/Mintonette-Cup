import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import Prestataire from '@/components/Prestataire.vue'

const routes = [
    { path: '/', name: 'Home', component: Index },
    { path: '/Prestataire', name: 'Prestataire', component: Prestataire }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
