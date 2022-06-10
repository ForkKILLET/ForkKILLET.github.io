import { createApp } from 'vue'
import App from './App.vue'
import masonry from 'vue-next-masonry'
import 'normalize.css'
import './utils/query'

createApp(App)
    .use(masonry)
    .mount('#app')
