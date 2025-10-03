import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import PrestatairePublic from '@/components/PrestatairePublic.vue'

const routes = [
    { path: '/', name: 'Home', component: Index },
    { path: '/PrestatairePublic', name: 'PrestatairePublic', component: PrestatairePublic }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
