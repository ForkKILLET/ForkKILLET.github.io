<!-- I know this should be 'Masonry', but... -->

<script setup lang="ts">
defineProps<{
    gap: number
}>()
</script>

<template>
	<div class="waterfall" :style="{ '--gap': gap + 'px' }">
        <slot></slot>
    </div>
</template>

<style>
.waterfall {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

.waterfall > * {
    break-inside: avoid;
	margin-bottom: var(--gap);
}
</style>
