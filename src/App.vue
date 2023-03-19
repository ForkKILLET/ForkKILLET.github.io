<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'

import Home from './components/views/Home.vue'
import SideBar from './components/views/SideBar.vue'
import SideBarButton from './components/SideBarButton.vue'
import Notifications from './components/views/Notifications.vue'

import { kNotiManager } from './utils/injections'
import { loadMarked } from './utils/markedManager'
import { storageRef } from './utils/storage'

const matchSidebarFixedWidth = () => window.matchMedia('screen and (min-width: 601px')
const sidebarFixed = ref(matchSidebarFixedWidth().matches)
const sidebarActive = ref(false)
matchSidebarFixedWidth().addEventListener('change', event => {
    console.log(event)
    sidebarFixed.value = event.matches
    sidebarActive.value = ! event.matches
})

const welcomed = storageRef('welcomed', false)

const notifications = ref<InstanceType<typeof Notifications>>()
onMounted(() => {
    const notiManager = notifications.value!.notiManager!
    loadMarked({ notiManager })

    if (! welcomed.value) {
        welcomed.value = true
        notiManager.addNoti({ content: 'Welcome to icelava.top ~' })
    }

    provide(kNotiManager, notiManager)
})

const router = useRouter()
router.afterEach(() => {
    document.querySelector('main')?.focus()
})
</script>

<template>
	<div class="root" :class="{ masked: ! sidebarFixed && sidebarActive }">
		<Transition name="side">
			<SideBar v-show="sidebarFixed || sidebarActive" class="sidebar"></SideBar>
		</Transition>
        <SideBarButton @click="sidebarActive = ! sidebarActive"></SideBarButton>
        <Notifications ref="notifications"></Notifications>
        <Home></Home>
    </div>
</template>

<style scoped>
@media screen and (max-width: 600px) {
	.sidebar {
		position: fixed;
		z-index: 3;
	}
}

.root {
    display: flex;
    height: 100vh;
    width: 100vw;

    background: #E6F8FF;
    font-family: 'Times New Roman', 'Simsun', serif;
}
.home {
    transition: .8s filter;
}
.root.masked .home {
	filter: blur(1px);
}

.side-enter-active, .side-leave-active {
	transition: transform .8s ease;
}
.side-enter-from, .side-leave-to {
	transform: translateX(-200px);
}
.side-enter-to, .side-leave-from {
	transform: none;
}
</style>

<style>
* {
    outline: none;
}

body {
    margin: 0;

	overflow: hidden;
}

a {
    text-decoration: none;
    color: #40CAC1;
    transition: color .2s;
    text-shadow: 0 0 1px #66CCFF;
}
a:hover, a:focus {
    text-decoration: underline;        
}
a:active {
    color: #2C918B;
}
</style>
