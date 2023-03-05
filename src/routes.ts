import type { RouteRecordRaw } from 'vue-router'

import IndexView from './components/Index.vue'
import LogView from './components/Log.vue'

export default [
    {
        path: '/',
        component: IndexView,
        name: 'Home'
    },
    {
        path: '/log/:id',
        component: LogView,
        name: 'Log'
    }
] as RouteRecordRaw[]