<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLogStore, Index } from '../stores/log'

import Fetch from './Fetch.vue'

import yaml from 'js-yaml'
import dayjs from 'dayjs'

const logStore = useLogStore()
function loadIndex(data: string | undefined) {
    logStore.index = yaml.load(data!) as Index
}

const filterTitle = ref<string | undefined>()
const filterTags = ref<string[]>([])
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

const sortedIndex = computed(
    () => [ ...logStore.index ?? [] ].sort(sortFunctions[sortMethod.value])
)
const filteredIndex = computed(
    () => sortedIndex.value?.filter(({ name, tags }) =>
        name.includes(filterTitle.value ?? '') && filterTags.value.every(tag => tags.includes(tag))
    )
)
</script>

<template>
    <div class="index">
        <div>
            <b>Filter:</b>
            <input class="filter-input" placeholder="Title" v-model="filterTitle" />
            <template v-if="filterTags.length">
                <span v-for="tag of filterTags" @click="removeFilterTag(tag)" class="filter-tag">
                    &middot; {{ tag }}
                </span>
            </template>
            <br />
            <b>Sort:</b>
            <span
                v-for="method of sortMethods"
                @click="sortMethod = method"
                class="sort-method" :class="{ active: sortMethod === method }"
            >{{ method }}</span>
        </div>
        <Fetch
            url="/FkLog/@meta/index.yml"
            :noLoad="logStore.index !== undefined"
            :success="loadIndex"
        >
            <template #default>
                <div>
                    <template
                        v-for="{ id, name, time, tags } in filteredIndex"
                        :key="id"
                    >
                        <div class="index-item">
                            <RouterLink :to="`/log/${id}`">{{ name }}</RouterLink>
                            <div class="index-item-detail">
                                <span>
                                    <small class="index-item-time">{{ dayjs(time).format('YYYY-MM-DD HH:MM') }}</small>
                                    <small class="index-item-tags">
                                        <template v-if="tags?.length">
                                            <span v-for="tag of tags" @click="addFilterTag(tag)" class="index-item-tag">
                                                &middot; {{ tag }}
                                            </span>
                                        </template>
                                        <span v-else>None</span>
                                    </small>
                                </span>
                                <small>{{ id }}</small>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </Fetch>
    </div>
</template>

<style scoped>
.index-item {
    padding: .5em;

    transition: .2s background-color;
}
.index-item:hover {
    background-color: #eee;
}

.index-item-detail {
    display: flex;
    justify-content: space-between;
}

.index-item-tag {
    color: #888;
}

.filter-input {
    outline: none;
    margin: 0 1em;
}

.sort-method {
    margin: 0 .5em;

    transition: .3s color;
}

.sort-method:hover {
    color: #39C5BB;
}

.sort-method.active {
    text-decoration: underline;
}
</style>