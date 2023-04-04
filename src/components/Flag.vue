<script setup lang="ts">
const flags = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸'
}

defineProps<{
    name: keyof typeof flags
}>()
</script>

<template>
    <span class="flag">{{ flags[name] }}</span>
</template>