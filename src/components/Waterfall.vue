<!-- I know this should be 'Masonry', but... -->

<script setup lang="ts">
import { ref } from 'vue'

const waterfall = ref<HTMLDivElement | null>(null)
</script>

<template>
    <div ref="waterfall" class="waterfall">
        <slot></slot>
    </div>
</template>

<style>
.waterfall {
    column-gap: 30px;
}

.waterfall > * {
    break-inside: avoid;
}

@media screen and (min-width: 1440px) {
    .waterfall {
        columns: 4;
    }
}
@media screen and (min-width: 960px) and (max-width: 1440px) {
    .waterfall {
        columns: 3;
    }
}
@media screen and (min-width: 448px) and (max-width: 960px) {
    .waterfall {
        columns: 2;
    }
}
@media screen and (max-width: 448px) {
    .waterfall {
        columns: 1;
    }
}
</style>