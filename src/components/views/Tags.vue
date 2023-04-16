<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Index, useLogStore } from '@store/log'
import { useSettings } from '@/stores/settings'

import IndexItem from '@comp/IndexItem.vue'
import DropTransition from '@comp/transitions/DropTransition.vue'
import vClickEnter from '@dir/clickenter'

const { t } = useI18n()
const settings = useSettings()

type TagGroups = Record<string, {
    paddings: [ number, number ]
    logs: Index
}>
const logStore = useLogStore()
const tagGroups = ref<TagGroups>()
const maxGroupSize = ref<number>()

const mainEl = document.querySelector('main')!
const showTagGraph = ref(false)
const openTagGraph = () => {
    showTagGraph.value = true
    mainEl.scrollTo({ top: 0 })
}
const closeTagGraph = () => {
    showTagGraph.value = false
}

const gotoTag = (tag: string) => {
    const tagEl = document.querySelector(`[data-tag=${tag}]`) as HTMLElement
    const mainEl = document.querySelector('main')!
    const offsetTop = - 40
    mainEl.scrollTo({
        top: tagEl.offsetTop - mainEl.offsetTop + offsetTop,
        behavior: settings.scrollBehavior
    })
}

onMounted(async () => {
    const index = await logStore.fetchIndex()
    const groups: TagGroups = {}
    const initGroup = (tag: string) => (
        groups[tag] ??= {
            logs: [],
            paddings: [
                5 + (Math.random() * 1e5 | 0) % 10,
                (Math.random() * 1e5 | 0) % 25
            ]
        }
    )
    index.forEach(log => {
        if (log.tags.length) log.tags.forEach(tag => {
            initGroup(tag).logs.push(log)
        })
        else {
            initGroup('No tags').logs.push(log)
        }
    })
    tagGroups.value = groups
    maxGroupSize.value = Object.values(tagGroups.value)
        .reduce((a, c) => Math.max(a, c.logs.length), 0)
})
</script>

<template>
    <div>
        <div class="toolbar">
            <b
                v-click-enter="openTagGraph"
                class="toolbar-button"
            >{{ t('op.tag-cloud') }}</b>
            <b
                v-if="showTagGraph"
                v-click-enter="closeTagGraph"
                class="toolbar-close"
            >x</b>
        </div>

        <DropTransition name="drop" height="50vh">
            <div v-show="showTagGraph" class="tag-graph">
                <div
                    v-for="{ logs, paddings: [ paddingX, paddingY ] }, tag in tagGroups"
                    @click="gotoTag(tag)"
                    class="tag-cloud"
                    :key="tag"
                    :style="{
                        padding: `${paddingX}px ${paddingY}px`
                    }"
                >
                    <span class="log-tag" :style="{
                        fontSize: 0.8 + (1.2 * logs.length / maxGroupSize!) + 'em'
                    }">{{ tag }} &middot; {{ logs.length }}</span>
                </div>
            </div>
        </DropTransition>

        <div v-for="{ logs }, tag in tagGroups" class="tag-group">
            <div class="tag-group-header">
                <span class="log-tag" :data-tag="tag">{{ tag }}</span> <span>({{ logs.length }})</span>
            </div>
            <template v-for="log of logs">
                <IndexItem :log="log" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.tag-group {
    margin: 1em 0;
}

.tag-group-header {
    margin-bottom: .5em;
}

.tag-graph {
    width: 50%;
    min-width: 300px;

    margin: 0 auto;
    padding: .5em;

    overflow: hidden;
    border-radius: .5em;
    box-shadow: 0 0 .5em inset #aaa;
}

.tag-cloud {
    display: inline-block;
    vertical-align: top;
}
</style>
