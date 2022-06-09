<script setup lang="ts">
import Badge from './Badge.vue'
defineProps<{
    name: string,
    github?: {
        user: string,
        repo: string        
    },
    langs?: ('js' | 'ts' | 'rust' | 'vue' | 'md')[]
}>()

const langColors = {
    js: '#F1E05A',
    ts: '#2B7489',
    rust: '#DEA584',
    vue: '#41B883',
    md: '#FFFFFF'
}
</script>

<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="card-inner">
                <p class="card-title">{{ name }}</p>
                <p class="card-content">
                    <slot></slot>
                </p>
            </div>
            <div class="card-badges">
                <a
                    v-if="github"    
                    target="_blank"
                    :href="`//github.com/${github.user}/${github.repo}`"
                >
                    <Badge color="black" active>git</Badge>
                </a>
                <template v-if="langs">
                    <Badge v-for="langName in langs" :color="langColors[langName]">
                        {{ langName }}
                    </Badge>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 1px 1px #39C5BB;
    transition: box-shadow .1s;
}

.card-inner {
    flex: 1;
    font-family: serif;
}

.card-content {
    margin: 0;
}

:slotted(.card .card-wrapper) {
    margin-top: 10px;
}

.card:hover {
    box-shadow: 0 0 2px 2px #39C5BB;
}

.card-badges {
    display: flex;
    flex-direction: column;
    margin-left: 6px;
    opacity: 0;
    transition: .5s opacity;
}

.card:hover > .card-badges {
    opacity: 1;
}

.card-badges > * {
    margin-bottom: 5px;
}

.card-title {
    margin: 0;
    font-weight: bold;
}
</style>
