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
        <div class="index-toolbar">
            <b class="field-name">Filter</b>
            <input class="filter-input" placeholder="Title" v-model="filterTitle" />
            <template v-if="filterTags.length">
                &middot; <span
                    v-for="tag of filterTags"
                    @click="removeFilterTag(tag)"
                    class="filter-tag tag"
                >{{ tag }}</span>
            </template>
            <br />
            <b class="field-name">Sort</b>
            <div class="sort-methods">
                <span
                    v-for="method of sortMethods"
                    @click="sortMethod = method"
                    class="sort-method" :class="{ active: sortMethod === method }"
                >{{ method }}</span>
            </div>
        </div>
        <Fetch
            url="/FkLog/@meta/index.yml"
            :noLoad="logStore.index !== undefined"
            :success="loadIndex"
        >
            <template #default>
                <small>Found {{ filteredIndex.length }} log(s).</small>
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
                                            &middot; <span
                                                v-for="tag of tags"
                                                @click="addFilterTag(tag)"
                                                class="index-item-tag tag"
                                                :class="{ filtered: filterTags.includes(tag) }"
                                            >{{ tag }}</span>
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
.index-toolbar {
    position: sticky;
    top: -1.5em;
    padding: .5em 0;

    background: white;

    line-height: 1.8em;
}

.field-name {
    display: inline-block;
    min-width: 3em;
    padding-right: 1.2em;
}

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

.tag {
    margin: 0 .15em;
    padding: .1em .4em;

    border-radius: .8em;

    color: white;
    transition: .3s background-color;
}
.tag:hover {
    cursor: pointer;
}
.index-item-tag, .filter-tag:hover {
    background: #bbb;
}
.filter-tag, .index-item-tag:hover, .index-item-tag.filtered {
    background: #39C5BB;
}

.filter-input {
    padding: 0;

    border: solid black;
    border-width: 0 0 1px 0;
    outline: none;

    transition: .3s border-color;
}

.filter-input:focus {
    border-color: #39C5BB;
}

.sort-methods {
    display: inline-block;
}

.sort-method:not(:first-child) {
    margin-left: .5em;
}

.sort-method:not(:last-child) {
    margin-right: .5em;
}

.sort-method {
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