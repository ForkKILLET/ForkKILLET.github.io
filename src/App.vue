<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

import Home from './components/views/Home.vue'
import SideBar from './components/views/SideBar.vue'
import SideBarButton from './components/SideBarButton.vue'
import Notifications from './components/views/Notifications.vue'

import { kNotiManager } from './utils/injections'
import { loadMarked } from './utils/markedManager'
import { storageRef } from './utils/storage'

const sideBarActive = ref(false)

const welcomed = storageRef('welcomed', false)

const notifications = ref<InstanceType<typeof Notifications>>()
onMounted(() => {
    const notiManager = notifications.value!.notiManager!
    loadMarked({ notiManager })

    if (! welcomed.value) {
        welcomed.value = true
        notiManager.addNoti({ content: 'Welcome to icelava.top' })
    }

    provide(kNotiManager, notiManager)
})
</script>

<template>
    <div class="root">
        <SideBar class="sidebar" :class="{ active: sideBarActive }"></SideBar>
        <SideBarButton @click="sideBarActive = ! sideBarActive"></SideBarButton>
        <Notifications ref="notifications"></Notifications>
        <Home></Home>
    </div>
</template>

<style scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100vw;

    background: #E6F8FF;
    font-family: 'Times New Roman', 'Simsun', serif;
}
</style>

<style>
body {
    margin: 0;
}

a {
    text-decoration: none;
    color: #40CAC1;
    transition: color .2s;
    text-shadow: 0 0 1px #66CCFF;
}
a:hover {
    text-decoration: underline;        
}
a:active {
    color: #2C918B;
}
</style>
