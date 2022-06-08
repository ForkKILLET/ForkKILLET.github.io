<script setup lang="ts">
defineProps<{
    color: string,
    active?: boolean
}>()
</script>

<template>
    <span
        class="badge"
        :class="{ active }"
        :style="{ backgroundColor: color }"
    >
        <span class="badge-inner"><slot></slot></span>
    </span>
</template>

<style scoped>
.badge {
    display: inline-block;
    padding: .5px 6px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 1px 2px 1px grey;
    transition: transform .2s;
}

.badge-inner {
    color: white;
    mix-blend-mode: difference;
}

.badge.active:active {
    transform: scale(.9);
}
</style>