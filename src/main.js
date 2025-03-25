import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <- Make sure this path is correct
import { createPinia } from 'pinia'
import './assets/main.css' // or wherever your CSS lives
/** add pinia to vue 3 app */


const app = createApp(App)

app.use(createPinia())
app.use(router) // <- This is the key part!
app.mount('#app')