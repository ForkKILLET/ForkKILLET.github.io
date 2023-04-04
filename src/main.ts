import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import routes from './routes'
import { messages, locale, MessageSchema, MessageLangs } from './locales'

import './styles/base.css'
import './styles/tag.css'
import './styles/toolbar.css'
import './styles/animations.css'
import 'normalize.css'

createApp(App)
    .use(createI18n<MessageSchema, MessageLangs>({
        legacy: false,
        locale: locale.value,
        messages
    }))
    .use(createRouter({
        history: createWebHashHistory(),
        routes
    }))
    .use(createPinia())
    .mount('#app')
