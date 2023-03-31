<script setup lang="ts">
import { reactive } from 'vue'

import ListTransitionGroup from '../transitions/ListTransitionGroup.vue'

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
    <div>
        <ListTransitionGroup offset="50px" class="notis">
            <template v-for="noti, i of notis" :key="i">
                <div v-if="noti" class="noti-wrapper">
                    <div class="noti">
                        <div class="noti-content">{{ noti.content }}</div>
                        <div class="noti-close" @click="notiManager.removeNoti(i)">x</div>
                    </div>
                </div>
            </template>
        </ListTransitionGroup>
    </div>
</template>

<style scoped>
.notis {
    position: fixed;
    right: 1em;
    top: 1em;
    z-index: 2;

    width: 40vw;
    max-width: 400px;
    min-width: 10vw;
}

.noti-wrapper {
    display: flex;
    width: 100%;
    justify-content: end;
}

.noti {    
    display: inline-flex;
    justify-content: space-between;

    max-width: 100%;
    margin: 1em 1em 0 1em;
    padding: .5em 1em;

    border-radius: .3em;
    background: white;
    box-shadow: 0 0 1.5em #7774;
}

.noti-content {
    word-break: break-all;
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
</style>
