<script setup lang="ts">
import { keyboardOps } from '../../utils/keyboardManager'

const emit = defineEmits<{
    (event: 'close'): void
}>()
</script>

<template>
    <div class="keyboard-ins">
        <h3>Keyboard Instruction</h3>
        <span class="toolbar-close" @click="emit('close')">x</span>
        <div class="ins-table">
            <p v-for="op of keyboardOps" class="ins-item">
                <kbd>{{ op.key }}</kbd> <span>{{ op.description }}</span>
            </p>
        </div>
    </div>
</template>

<style scoped>
.keyboard-ins {
    position: fixed;
    z-index: 4;

    width: 70vw;
    max-width: 600px;
    height: 50vh;
    top: 25vh;
    left: 50%;
    transform: translateX(-50%);

    padding: 1em;

    border-radius: 1em;
    background-color: white;
    box-shadow: 0 0 1.5em #7774;
}

h3 {
    display: inline-block;
    margin: 0;
    text-align: center;
}

.toolbar-close {
    float: right;
}

.ins-table {
    display: flex;
    flex-direction: column;

    margin-top: 1em;
}

.ins-item {
    margin: .2em 0;
}

kbd {
    background: #222;
    color: white;
    padding: 0 .3em;
    border-radius: .2em;
}
</style>