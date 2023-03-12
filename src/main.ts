import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from './App.vue'
import routes from './routes'

import './styles/tag.css'
import './styles/toolbar.css'
import './styles/animations.css'
import 'normalize.css'

createApp(App)
    .use(createRouter({
        history: createWebHashHistory(),
        routes
    }))
    .use(createPinia())
    .mount('#app')
