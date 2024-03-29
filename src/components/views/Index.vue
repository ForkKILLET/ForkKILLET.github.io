<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useLogStore, Index } from '@store/log'

import { kNotiManager } from '@util/injections'
import { keyboardManager } from '@util/keyboardManager'

import IndexItem from '@comp/IndexItem.vue'
import vClickEnter from '@dir/clickenter'

const { t } = useI18n()

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
const filterUnreadOnly = ref(unreadOnly === 'true' ? true : false)
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
    unreadOnly: String(filterUnreadOnly.value),
    sort: sortMethod.value
})
watch([ filterTitle, filterTags, filterUnreadOnly, sortMethod ], () => {
    router.replace({
        query: generateQuery()
    })
})

const filterInputEl = ref<HTMLInputElement | undefined>()

let updateNotified = false
let updatedCount = 0
const updateStates = ref<Record<string, number>>({})
const notiManager = inject(kNotiManager)!

const checkUpdate = async () => {
    index.value = await logStore.fetchIndex()

    updateStates.value = Object.fromEntries(await Promise.all(
        index.value!.map(async log => {
            const states = await logStore.getLogUpdateState(log)
            if (states & 0b1110) updatedCount ++
            return [ log.id, states ]
        })
    ))

    if (! updateNotified && updatedCount) {
        updateNotified = true
        notiManager.addNoti({ content: () => t('noti.update', [ updatedCount ]) })
    }
}

onMounted(async () => {
    await checkUpdate()
})

watch(route, async () => {
    if (route.path === '/') {
        keyboardManager.register('focusFilter', {
            key: '/',
            action: (event) => {
                filterInputEl.value?.focus()
                event.preventDefault()
            }
        })
        await checkUpdate()
    }
    else {
        keyboardManager.dispose('focusFilter')
    }
}, { immediate: true })
</script>

<template>
    <div class="index">
        <div class="toolbar">
            <p class="toolbar-line">
                <b>{{ t('op.filter') }}:</b>
                <input
                    v-model="filterTitle"
                    ref="filterInputEl"
                    class="filter-input"
                    :placeholder="t('msg.log-title')"
                />
                <span
                    v-click-enter="toggleUnreadOnly"
                    :data-checked="filterUnreadOnly"
                    class="filter-button"
                >{{ t('op.unread-only') }}</span>
                <span v-if="filterTags.length" class="filter-tags">
                    <span
                        v-for="tag of filterTags"
                        v-click-enter="() => removeFilterTag(tag)"
                        class="log-tag inversed filter-tag"
                    >{{ tag }}</span>
                </span>
            </p>
            <p class="toolbar-line">
                <b>{{ t('op.sort') }}:</b>
                <span
                    v-for="method of sortMethods"
                    v-click-enter="() => sortMethod = method"
                    class="sort-method" :class="{ active: sortMethod === method }"
                >{{ t('op.sort-method.' + method) }}</span>
            </p>
        </div>
        <template v-if="index">
            <small>{{ t('msg.log-count', [ filteredIndex.length ]) }}</small>
            <div v-for="log of filteredIndex">
                <IndexItem
                    :key="log.id"
                    :log="log"
                    :filter-tags="filterTags"
                    :update-state="updateStates[log.id]"
                    @tag-click="tag => addFilterTag(tag)"
                />
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
