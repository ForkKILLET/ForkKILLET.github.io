<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

let text = ref<string>('')
let tid: number | null = null

onMounted(() => {
    const texts = [
        'Loading',
        'Loading.',
        'Loading..',
        'Loading...'
    ]
    let i = 0
    tid = setInterval(() => {
        text.value = texts[i]
        if (++ i === texts.length) i = 0
    }, 500)
})

onUnmounted(() => {
    if (tid !== null) clearInterval(tid)
})
</script>

<template>
    <span class="loading">{{ text }}</span>
</template>