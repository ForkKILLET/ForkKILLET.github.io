<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Home from './components/views/Home.vue'
import SideBar from './components/views/SideBar.vue'
import SideBarButton from './components/SideBarButton.vue'
import Notifications from './components/views/Notifications.vue'
import KeyboardInstruction from './components/views/KeyboardInstruction.vue'

import { kNotiManager } from './utils/injections'
import { loadMarked } from './utils/marked/markedManager'
import { storageRef } from './utils/storage'
import { keyboardManager } from './utils/keyboardManager'

import { version } from '../package.json'

const { t } = useI18n()

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

	const showDevNoti = () => {
		if (import.meta.env.DEV) notiManager.addNoti({
			content: () => t('noti.dev', [ new Date().toLocaleString() ]),
			onClose: () => showDevNoti()
		})
	}
	showDevNoti()

    if (! lastVersion.value || lastVersion.value !== version) {
        lastVersion.value = version
        notiManager.addNoti({ content: () => t('noti.welcome', [ version ]) })
        notiManager.addNoti({ content: () => t('noti.keyboard-ins') })
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
	<div class="root">
        <div class="mask" :class="{ active: ! sidebarFixed && sidebarActive }"></div>
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
    position: relative;
    display: flex;
    height: 100vh;
    width: 100vw;

    background: #E6F8FF;
    font-family: 'Times New Roman', 'Simsun', serif;
}

.mask {
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;

    pointer-events: none;
    transition: .8s background-color;
}
.mask.active {
    pointer-events: all;
    background: #7774;
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
