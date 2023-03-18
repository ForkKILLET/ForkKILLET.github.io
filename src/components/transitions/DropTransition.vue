<script setup lang="ts">
defineProps<{
    height?: string
}>()
</script>

<template>
    <div :style="{ '--height': height }">
        <Transition name="drop">
            <slot></slot>
        </Transition>
    </div>
</template>

<style>
.drop-enter-active {
    transition: .5s max-height ease-in, .5s opacity;
}

.drop-leave-active {
    transition: .5s max-height ease-out, .5s opacity;
}

.drop-enter-from, .drop-leave-to {
    max-height: 0;
    opacity: 0;
}

.drop-enter-to, .drop-leave-from {
    max-height: var(--height);
    opacity: 1;
}
</style>
