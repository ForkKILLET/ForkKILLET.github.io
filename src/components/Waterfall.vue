<!-- I know this should be 'Masonry', but... -->

<script lang="ts">
export const kTypesetWaterfall = Symbol('typesetWaterfall') as InjectionKey<() => void>
</script>

<script setup lang="ts">
import { InjectionKey, onMounted, onUnmounted, provide, ref } from 'vue'

const props = defineProps<{
    gap: number
}>()

const waterfall = ref<HTMLDivElement | null>(null)

function typeset() {
    const self = waterfall.value!
    self
        .querySelectorAll('.waterfall-break')
        .forEach(br => br.remove())
    const children = Array.from(self.children) as HTMLElement[]

    const wAvail = window.innerWidth - 20
    const colNum = [ 550, 960, 1440, Infinity ].findIndex(w => wAvail <= w) + 1
    const wCol = (wAvail - props.gap * (colNum - 1)) / colNum
    children.forEach(el => {
        el.style.width = wCol + 'px'
    })

    const heights: number[] = []
    const hSum = children.reduce((s, el) => {
        if ([ 'fixed', 'absoluted' ].includes(el.style.position)) return s
        const h = + window.getComputedStyle(el).getPropertyValue('height').replace(/px$/, '')
        heights.push(h + props.gap)
        return s + h + props.gap
    }, 0)
    const hMean = hSum / colNum
    let hColMax = 0

    // TODO: optimize the alogorithm of splitting
    for (let col = 0, i = 0; col < colNum; col ++) {
        let hCol = 0
        while (hCol < hMean && i < heights.length) hCol += heights[i ++]
        if (hCol - hMean > hMean - (hCol - heights[i - 1])) {
            hCol -= heights[-- i]
        }

        if (hCol > hColMax) {
            hColMax = hCol
            self.style.height = hCol + 'px'
        }

        if (col === colNum - 1) break
        const br = document.createElement('div')
        br.classList.add('waterfall-break')
        self.insertBefore(br, children[i])
    }
}

onMounted(() => {
    typeset()
    window.addEventListener('resize', typeset)
})
onUnmounted(() => {
    window.removeEventListener('resize', typeset)
})

// Debug: Object.assign(window, { typeset })
provide(kTypesetWaterfall, typeset)
</script>

<template>
    <div ref="waterfall" class="waterfall" :style="{ '--gap': gap + 'px' }">
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
}

.waterfall-break {
    height: 100%;
    width: var(--gap);
}

.waterfall > *:not(.waterfall-break) {
    margin-bottom: var(--gap);
}
</style>