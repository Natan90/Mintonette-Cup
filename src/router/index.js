import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import PrestatairePublic from '@/components/PrestatairePublic.vue'
import PrestatairePresta from "@/components/PrestatairePresta.vue";

const routes = [
    { path: '/', name: 'Home', component: Index },
    { path: '/PrestatairePublic', name: 'PrestatairePublic', component: PrestatairePublic },
    { path: '/PrestatairePresta', name: 'PrestatairePresta', component: PrestatairePresta }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
