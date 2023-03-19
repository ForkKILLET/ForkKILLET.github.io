<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useLogStore, Index } from '../../stores/log'

import { kNotiManager } from '../../utils/injections';
import { keyboardManager } from '../../utils/keyboardManager'

import IndexItem from '../IndexItem.vue'

const route = useRoute()
const { title, tags: origTags, unreadOnly, sort } = route.query
const tags = Array.isArray(origTags) || ! origTags ? origTags : [ origTags ]

const filterTitle = ref(typeof title === 'string' ? title : undefined)
const filterTags = reactive(Array.isArray(tags) ? tags.map(String) : [])
const addFilterTag = (tag: string) => {
    if (! filterTags.includes(tag)) filterTags.push(tag)
}
const removeFilterTag = (tag: string) => {
    const i = filterTags.indexOf(tag)
    if (i >= 0) filterTags.splice(i, 1)
}
const filterUnreadOnly = ref(typeof unreadOnly === 'boolean' ? unreadOnly : false)
const toggleUnreadOnly = () => {
    filterUnreadOnly.value = ! filterUnreadOnly.value
}

const sortMethods = [ 'default', 'newest', 'oldest' ] as const
const sortFunctions: Record<SortMethod, (a: Index[number], b: Index[number]) => number> = {
    default: () => 0,
    oldest: (a, b) => + a.time - + b.time,
    newest: (a, b) => + b.time - + a.time
}
type SortMethod = (typeof sortMethods)[number]
const isSortMethod = (x: any): x is SortMethod => sortMethods.includes(x)
const sortMethod = ref(isSortMethod(sort) ? sort : 'default')

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
        filterTags.every(tag => tags.includes(tag)) &&
        (! filterUnreadOnly.value || updateStates.value[id])
    )
)

const router = useRouter()
const generateQuery = () => ({
    title: filterTitle.value,
    tags: filterTags,
    unreadOnly: filterUnreadOnly.value ? 'yes' : 'no',
    sort: sortMethod.value
})
watch([ filterTitle, filterTags, filterUnreadOnly, sortMethod ], () => {
    router.replace({
        query: generateQuery()
    })
})

const updateStates = ref<Record<string, number>>({})

const notiManager = inject(kNotiManager)

const filterInputEl = ref<HTMLInputElement | undefined>()
const onKeyFilter = 

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

watch(route, () => {
    if (route.path === '/') keyboardManager.register('keypress', {
        key: '/',
        description: 'Focus filter',
        action: (event) => {
            if (event.key === '/') {
                filterInputEl.value?.focus()
                event.preventDefault()
            }
        }
    })
    else keyboardManager.dispose('keypress')
}, { immediate: true })
</script>

<template>
    <div class="index">
        <div class="toolbar">
            <p class="toolbar-line">
                <b>Filter:</b>
                <input
                    v-model="filterTitle"
                    ref="filterInputEl"
                    class="filter-input"
                    placeholder="Title"
                />
                <span
                    @click="toggleUnreadOnly"
                    @keypress.enter="toggleUnreadOnly"
                    :data-checked="filterUnreadOnly"
                    class="filter-button"
                    tabindex="0"
                >unread only</span>
                <span v-if="filterTags.length" class="filter-tags">
                    <span
                        v-for="tag of filterTags"
                        @click="removeFilterTag(tag)"
                        @keypress.enter="removeFilterTag(tag)"
                        class="tag inversed filter-tag"
                        tabindex="0"
                    >{{ tag }}</span>
                </span>
            </p>
            <p class="toolbar-line">
                <b>Sort:</b>
                <span
                    v-for="method of sortMethods"
                    @click="sortMethod = method"
                    @keypress.enter="sortMethod = method"
                    class="sort-method" :class="{ active: sortMethod === method }"
                    tabindex="0"
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
}

.filter-button {
    display: inline-block;

	white-space: nowrap;
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
.filter-button:hover, .filter-button:focus {
    animation: .3s hop;
}

.filter-tags {
	margin-left: .8em;
}
.filter-tag {
    line-height: 1rem;
}

.sort-method {
    display: inline-block;
    margin: 0 .5em;

    transition: .3s color;
}

.sort-method:hover {
    cursor: pointer;
}

.sort-method:hover, .sort-method:focus {
    color: #39C5BB;
    animation: .3s hop;
}

.sort-method.active {
    color: #39C5BB;
    text-decoration: underline;
}
</style>
