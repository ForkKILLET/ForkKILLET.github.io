<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'

import Home from './components/views/Home.vue'
import SideBar from './components/views/SideBar.vue'
import SideBarButton from './components/SideBarButton.vue'
import Notifications from './components/views/Notifications.vue'
import KeyboardInstruction from './components/views/KeyboardInstruction.vue'

import { kNotiManager } from './utils/injections'
import { loadMarked } from './utils/markedManager'
import { storageRef } from './utils/storage'
import { keyboardManager } from './utils/keyboardManager'

import { version } from '../package.json'

const matchSidebarFixedWidth = () => window.matchMedia('screen and (min-width: 601px')
const sidebarFixed = ref(matchSidebarFixedWidth().matches)
const sidebarActive = ref(false)
matchSidebarFixedWidth().addEventListener('change', event => {
    sidebarFixed.value = event.matches
    sidebarActive.value = ! event.matches
})
const toggleSidebar = () => {
    sidebarActive.value = ! sidebarActive.value
}

const lastVersion = storageRef<string | undefined>('version', undefined)

const notifications = ref<InstanceType<typeof Notifications>>()
onMounted(() => {
    const notiManager = notifications.value!.notiManager!
    loadMarked({ notiManager })

    if (! lastVersion.value || lastVersion.value !== version) {
        lastVersion.value = version
        notiManager.addNoti({ content: `Welcome to pretty new icelava.top ~ (ζ${version})` })
        notiManager.addNoti({ content: 'Press ? to see keyboard instructions' })
    }

    provide(kNotiManager, notiManager)
})

const router = useRouter()
router.afterEach((from, to) => {
    if (from.path !== to.path)
        document.querySelector('main')?.focus()
})

const showKeyboardIns = ref(false)
keyboardManager.register('toggleKeyboardIns', {
    key: '?',
    description: 'Toggle keyboard instruction',
    action: () => {
        showKeyboardIns.value = ! showKeyboardIns.value
    }
})
</script>

<template>
	<div class="root" :class="{ masked: ! sidebarFixed && sidebarActive }">
		<Transition name="side">
			<SideBar v-show="sidebarFixed || sidebarActive" class="sidebar"></SideBar>
		</Transition>
        <SideBarButton
            @click="toggleSidebar"
            @keypress.enter="toggleSidebar"
            tabindex="0"
        ></SideBarButton>
        <Notifications ref="notifications"></Notifications>
        <Home></Home>
        <Transition name="fade">
            <KeyboardInstruction
                v-show="showKeyboardIns"
                @close="showKeyboardIns = false"
            ></KeyboardInstruction>
        </Transition>
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
	transition: .8s transform ease;
}
.side-enter-from, .side-leave-to {
	transform: translateX(-200px);
}
.side-enter-to, .side-leave-from {
	transform: none;
}

.fade-enter-active, .fade-leave-active {
    transition: .5s opacity ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}
</style>
