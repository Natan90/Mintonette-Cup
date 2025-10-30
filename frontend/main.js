import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import fr from './locales/fr.json'
import en from './locales/en.json'

// Configuration i18n
const messages = { fr, en }

const i18n = createI18n({
  locale: 'fr',           
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)  

app.mount('#app')
