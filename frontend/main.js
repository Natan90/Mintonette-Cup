import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import fr from './langues/fr.json'
import en from './langues/en.json'

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

router.beforeEach((to, from, next) => {
  const lang = to.params.lang
  if (lang && i18n.global.locale !== lang) {
    i18n.global.locale = lang
  }
  next()
})

app.mount('#app')
