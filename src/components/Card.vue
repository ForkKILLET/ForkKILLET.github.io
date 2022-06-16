<script setup lang="ts">
import { ref } from 'vue'
import Badge from './Badge.vue'
import Fetch from './Fetch.vue'
import Tico from './Tico.vue'

defineProps<{
    name: string,
    github?: {
        user: string,
        repo: string        
    },
    langs?: ('js' | 'ts' | 'rust' | 'vue' | 'md')[],
    tico?: string
    scroll?: boolean
}>()

const langColors = {
    js: '#F1E05A',
    ts: '#2B7489',
    rust: '#DEA584',
    vue: '#41B883',
    md: '#FFFFFF'
}

const inner = ref<HTMLDivElement | null>(null)
</script>

<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="card-inner-wrapper">
                <div
                    ref="inner"
                    class="card-inner"
                    :style="{ overflowY: scroll ? 'scroll' : undefined }"
                >
                    <p class="card-title">{{ name }}</p>
                    <div class="card-content">
                        <div v-if="tico" class="card-tico">
                            <Fetch
                                :url="`/FkLog/@icon/${tico}.tico`"
                                #default="{ data }"
                            >
                                <Tico :file="data!"></Tico>
                            </Fetch>
                        </div>
                        <slot></slot>
                    </div>
                </div>
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
                <slot name="badges"></slot>
                <Badge
                    v-if="scroll"
                    color="#66CCFF"
                    active
                    @click="inner!.scrollTo(0, 0)"
                >
                    ^
                </Badge>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    flex: 1;
    justify-content: space-between;
    height: calc(100% - 20px);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 1px 1px #39C5BB;
    transition: box-shadow .1s;
}

.card-inner {
    flex: 1;
    font-family: serif;
    height: 100%;
}

.card-inner-wrapper {
    position: relative;
}

.card-content {
    padding: 5px;
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

.card-tico {
    float: left;
    margin-right: 5px;
}

.card:hover > .card-badges {
    opacity: 1;
}

:deep(.card-badges > *) {
    margin-bottom: 5px;
}

.card-title {
    margin: 0;
    font-weight: bold;
}
</style>
