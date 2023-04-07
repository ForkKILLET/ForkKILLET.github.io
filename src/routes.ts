import type { RouteRecordRaw } from 'vue-router'

import IndexView from '@comp/views/Index.vue'
import LogView from '@comp/views/Log.vue'
import TagsView from '@comp/views/Tags.vue'
import NotFoundView from '@comp/views/NotFoundView.vue'

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
