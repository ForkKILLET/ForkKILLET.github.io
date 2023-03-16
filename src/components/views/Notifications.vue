<script setup lang="ts">
import { provide, reactive } from 'vue'
import { kNotiManager } from '../../utils/injections'

export type Noti = {
    content: string
}

export type Notis = (Noti | undefined)[]

export type NotiManager = {
    addNoti: (noti: Noti) => number
    removeNoti: (id: number) => void
}

const notis = reactive<Notis>([])

const notiManager: NotiManager = {
    addNoti: (noti) => {
        notis.push(noti)
        return notis.length - 1
    },
    removeNoti: (id) => {
        notis[id] = undefined
    }
}

defineExpose({
    notiManager
})
</script>

<template>
    <div class="notis">
        <template v-for="noti, id of notis">
            <Transition name="fade">
                <div v-if="noti" class="noti">
                    <div class="noti-content">{{ noti.content }}</div>
                    <div class="noti-close" @click="notiManager.removeNoti(id)">x</div>
                </div>
            </Transition>
        </template>
    </div>
</template>

<style scoped>
.notis {
    position: fixed;
    right: 1em;
    top: 1em;
    z-index: 2;

    padding: 1em;
}

.noti {
    display: flex;
    padding: .5em 1em;
    margin-bottom: 1em;

    border-radius: .3em;
    background: white;
    box-shadow: 0 0 1.5em #7774;
}

.noti-close {
    padding-left: 1em;

    color: #aaa;
    transition: .3s transform;
}

.noti-close:hover {
    cursor: pointer;
    transform: rotate(360deg);
}

.fade-enter-active, .fade-leave-active {
    transition: .5s opacity;
}

.fade-enter-to, .fade-leave-from {
    opacity: 1;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>