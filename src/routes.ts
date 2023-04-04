import type { RouteRecordRaw } from 'vue-router'

import IndexView from './components/views/Index.vue'
import LogView from './components/views/Log.vue'
import TagsView from './components/views/Tags.vue'
import NotFoundView from './components/views/NotFoundView.vue'

export default [
    {
        path: '/',
        component: IndexView,
        name: 'home'
    },
    {
        path: '/log/:id',
        component: LogView,
        name: 'log'
    },
    {
        path: '/tags',
        component: TagsView,
        name: 'tags'
    },
    {
        path: '/:anyway(.*)*',
        component: NotFoundView,
        name: 'not-found'
    }
] as RouteRecordRaw[]
