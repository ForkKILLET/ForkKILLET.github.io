import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { i18n } from './locales'
import { router } from './routes'

import './styles/base.css'
import './styles/tag.css'
import './styles/toolbar.css'
import './styles/animations.css'
import 'normalize.css'

createApp(App)
    .use(i18n)
    .use(router)
    .use(createPinia())
    .mount('#app')
