import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
