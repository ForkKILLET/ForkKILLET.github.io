import { createApp } from 'vue'
import App from './App.vue'
import Masonry from 'vue-next-masonry'
import 'normalize.css'
import './utils/query'

createApp(App)
    .use(Masonry)
    .mount('#app')
