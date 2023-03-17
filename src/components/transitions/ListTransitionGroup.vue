<script setup lang="ts">
defineProps<{
    offset?: string
}>()
</script>

<template>
    <div :style="{ '--offset': offset }">
        <TransitionGroup name="list">
            <slot></slot>
        </TransitionGroup>
    </div>
</template>

<style>
.list-move, .list-enter-active, .list-leave-active {
    transition: all 1s ease;
}
.list-leave-active {
    position: absolute;
}
.list-enter-to, .list-leave-from {
    opacity: 1;
}
.list-enter-from, .list-leave-to {
    opacity: 0;
    transform: translateX(var(--offset));
}
</style>