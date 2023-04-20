<script setup lang="ts">
import { onMounted, provide, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettings } from './stores/settings'

import Home from '@comp/views/Home.vue'
import SideBar from '@comp/views/SideBar.vue'
import SideBarButton from '@comp/SideBarButton.vue'
import Notifications from '@comp/views/Notifications.vue'
import KeyboardInstruction from '@comp/views/KeyboardInstruction.vue'
import vClickEnter from '@dir/clickenter'

import { kNotiManager } from '@util/injections'
import { loadMarked } from '@util/marked/markedManager'
import { storageRef } from '@util/storage'
import { keyboardManager } from '@util/keyboardManager'

import { version } from '@pack'

const { t } = useI18n()
const settings = useSettings()

const matchLargeScreen = window.matchMedia('screen and (min-width: 601px')
const autoSidebar = computed(() => settings.sidebarMode === 'auto')
const isLargeScreen = ref(matchLargeScreen.matches)
const sidebarFixed = computed(() => autoSidebar.value && isLargeScreen.value)
const sidebarActive = ref(false)
matchLargeScreen.addEventListener('change', event => {
    if (! autoSidebar.value) return
    isLargeScreen.value = event.matches
    sidebarActive.value = ! event.matches
})
const toggleSidebar = () => {
    sidebarActive.value = ! sidebarActive.value
}

const lastVersion = storageRef<string | undefined>('version', undefined)

const notifications = ref<InstanceType<typeof Notifications>>()
onMounted(() => {
    const notiManager = notifications.value!.notiManager!

    keyboardManager.register('clearNotis', {
        key: 'c',
        action: () => {
            notiManager.removeAllNotis()
        }
    })

    {
        let nid: number
        loadMarked({
            onBeforeLoad: () => {
                nid = notiManager.addNoti({ content: () => t('msg.loading-katex') })
            },
            onAfterLoad: () => {
                notiManager.removeNoti(nid)
            }
        })
    }

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
    action: () => {
        showKeyboardIns.value = ! showKeyboardIns.value
    }
})
keyboardManager.register('focusSidebar', {
    key: 's',
    action: () => {
        if (! sidebarFixed.value && ! sidebarActive.value) sidebarActive.value = true
        nextTick(() => {
            (document.querySelector('.sidebar-item') as HTMLLinkElement)?.focus()
        })
    }
})
keyboardManager.register('closeSidebar', {
    key: 'Escape',
    action: event => {
        if (sidebarActive.value) {
            event.preventDefault()
            sidebarActive.value = false
        }
    },
    enabled: () => sidebarActive.value
})
</script>

<template>
	<div class="root">
        <div class="mask" :class="{ active: ! sidebarFixed && sidebarActive }"></div>
		<Transition name="side">
			<SideBar
                v-show="sidebarFixed || sidebarActive"
                :class="{ docking: ! autoSidebar || ! sidebarFixed }"
            />
		</Transition>
        <SideBarButton v-click-enter="toggleSidebar" />
        <Notifications ref="notifications" />
        <Home />
        <Transition name="fade">
            <KeyboardInstruction
                v-show="showKeyboardIns"
                @close="showKeyboardIns = false"
            />
        </Transition>
    </div>
</template>

<style scoped>
.sidebar.docking {
    position: fixed;
    z-index: 3;
}

.sidebar:not(.docking) + .sidebar-button {
    display: none;
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
