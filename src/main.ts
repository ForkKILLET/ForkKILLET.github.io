import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from './App.vue'
import routes from './routes'

import 'normalize.css'

createApp(App)
    .use(createRouter({
        history: createWebHashHistory(),
        routes
    }))
    .use(createPinia())
    .mount('#app')
