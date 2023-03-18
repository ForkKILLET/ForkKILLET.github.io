<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { useLogStore, Index } from '../../stores/log'
import { kNotiManager } from '../../utils/injections';

import IndexItem from '../IndexItem.vue'
import ListTransitionGroup from '../transitions/ListTransitionGroup.vue'

const filterTitle = ref<string | undefined>()
const filterTags = ref<string[]>([])
const filterUnreadOnly = ref(false)
const addFilterTag = (tag: string) => {
    if (! filterTags.value.includes(tag)) filterTags.value.push(tag)
}
const removeFilterTag = (tag: string) => {
    const i = filterTags.value.indexOf(tag)
    if (i >= 0) filterTags.value.splice(i, 1)
}

const sortMethods = [ 'default', 'newest', 'oldest' ] as const
const sortFunctions: Record<SortMethod, (a: Index[number], b: Index[number]) => number> = {
    default: () => 0,
    oldest: (a, b) => + a.time - + b.time,
    newest: (a, b) => + b.time - + a.time
}
type SortMethod = (typeof sortMethods)[number]
const sortMethod = ref<SortMethod>('default')

const logStore = useLogStore()
const index = ref<Index | undefined>()
const sortedIndex = computed(
    () => [ ...logStore.index ?? [] ].sort((a, b) => (
        (updateStates.value[b.id] & 0b1110) - (updateStates.value[a.id] & 0b1110) ||
        sortFunctions[sortMethod.value](a, b)
    ))
)
const filteredIndex = computed(
    () => sortedIndex.value?.filter(({ id, name, tags }) =>
        name.includes(filterTitle.value ?? '') &&
        filterTags.value.every(tag => tags.includes(tag)) &&
        (! filterUnreadOnly.value || updateStates.value[id])
    )
)

const updateStates = ref<Record<string, number>>({})

const notiManager = inject(kNotiManager)

onMounted(async () => {
    index.value = await logStore.fetchIndex()
    let updatedCount = 0
    updateStates.value = Object.fromEntries(await Promise.all(
        index.value!.map(async log => {
            const states = await logStore.getLogUpdateState(log)
            if (states & 0b1110) updatedCount ++
            return [ log.id, states ]
        })
    ))
    if (updatedCount) {
        notiManager?.addNoti({ content: `You got ${updatedCount} update(s)!` })
    }
})
</script>

<template>
    <div class="index">
        <div class="toolbar">
            <p class="toolbar-line">
                <b>Filter:</b>
                <input class="filter-input" placeholder="Title" v-model="filterTitle" />
                <span
                    @click="filterUnreadOnly = ! filterUnreadOnly"
                    class="filter-button"
                    :data-checked="filterUnreadOnly"
                >unread only</span>
                <template v-if="filterTags.length">
                    <span
                        v-for="tag of filterTags"
                        @click="removeFilterTag(tag)"
                        class="tag inversed filter-tag"
                    >{{ tag }}</span>
                </template>
            </p>
            <p class="toolbar-line">
                <b>Sort:</b>
                <span
                    v-for="method of sortMethods"
                    @click="sortMethod = method"
                    class="sort-method" :class="{ active: sortMethod === method }"
                >{{ method }}</span>
            </p>
        </div>
        <template v-if="index">
            <small>Found {{ filteredIndex.length }} log(s).</small>
            <div v-for="log of filteredIndex">
                <IndexItem
                    :key="log.id"
                    :log="log"
                    :filter-tags="filterTags"
                    :update-state="updateStates[log.id]"
                    @tag-click="tag => addFilterTag(tag)"
                ></IndexItem>
            </div>
        </template>
    </div>
</template>

<style scoped>
.filter-input {
    margin: 0 1em;
    padding: 0;

    border: solid black;
    border-width: 0 0 1px 0;
    outline: none;

    transition: .3s border-color;
}

.filter-button {
    user-select: none;
    transition: .5s color;
}
.filter-button[data-checked=false] {
    text-decoration: line-through;
    color: #aaa;
}
.filter-button[data-checked=true] {
    text-decoration: underline;
    color: #39C5BB;
}
.filter-button:hover {
    cursor: pointer;
}

.filter-tag {
    line-height: 1rem;
}

.filter-input:focus {
    border-color: #39C5BB;
}

.sort-method {
    margin: 0 .5em;

    transition: .3s color;
}

.sort-method:hover {
    color: #39C5BB;
    cursor: pointer;
}

.sort-method.active {
    color: #39C5BB;
    text-decoration: underline;
}
</style>
