<script setup lang="ts">
import { ref } from 'vue'
import { useLogStore, Index } from '../stores/log'

import Fetch from './Fetch.vue'

import yaml from 'js-yaml'
import dayjs from 'dayjs'

const logStore = useLogStore()
function loadIndex(data: string | undefined) {
    logStore.index = yaml.load(data!) as Index
}

const filterTitle = ref<string | undefined>()
</script>

<template>
    <div class="index">
        <div>
            <b>Filter:</b>
            <input class="filter-input" placeholder="Title" v-model="filterTitle" />
        </div>
        <Fetch
            url="/FkLog/@meta/index.yml"
            :noLoad="logStore.index !== undefined"
            :success="loadIndex"
        >
            <template #default>
                <div>
                    <template
                        v-for="{ id, name, time } in logStore.index"
                        :key="id"
                    >
                        <div
                            v-if="name.includes(filterTitle ?? '')"
                            class="index-item"
                        >
                            <RouterLink :to="`/log/${id}`">{{ name }}</RouterLink>
                            <div class="index-item-detail">
                                <small class="index-item-time">{{ dayjs(time).format('YYYY-MM-DD HH:MM') }}</small>
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
    background-color: #eee
}

.index-item-detail {
    display: flex;
    justify-content: space-between;
}

.index-item-time {
    margin: 0 1em;
}

.filter-input {
    outline: none;
    margin: 0 1em;
}
</style>