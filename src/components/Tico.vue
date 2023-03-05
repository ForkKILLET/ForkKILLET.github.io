<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
    file: string,
    pixelSize?: number
}>(), {
    pixelSize: 3
})

const canvas = ref<HTMLCanvasElement | null>(null)

const colors = {
    '#': 'black',
    ' ': 'white',
    'R': 'red',
    'r': 'darksalmon',
    'B': 'blue',
    'b': 'cornflowerblue',
    'M': 'rebeccapurple',
    'm': 'magenta',
    '9': 'grey',
    'G': 'green',
    'g': 'lightgreen'
}

onMounted(() => {
    const lines = props.file.split('\n')
    const config = lines[0] === '<<<' ? {} : JSON.parse(lines[0])
    const main = lines.slice(
        lines.findIndex(l => l === '<<<') + 1,
        lines.findIndex(l => l === '>>>')
    )
    if (config.color) Object.assign(colors, config.color)
    
    const board = main.map(l => l.split('').map(ch => colors[ch as keyof typeof colors]))

    const cvs = canvas.value!
    const ctx = cvs.getContext('2d')!
    const p = props.pixelSize

    cvs.width = board[0].length * p
    cvs.height = board.length * p
    for (let y = 0; y < board.length; y ++)
        for (let x = 0; x < board[y].length; x ++) {
            ctx.fillStyle = board[y][x]
            ctx.fillRect(x * p, y * p, p, p)
        }
})
</script>

<template>
    <canvas class="tico-canvas" ref="canvas"></canvas>
</template>
