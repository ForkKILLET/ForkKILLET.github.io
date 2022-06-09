<script setup lang="ts">
import { ref, Ref } from 'vue'
import yaml from 'js-yaml'
import { marked } from 'marked'
import markedKatex from '../utils/markedKatexExt'
import Fetch from './Fetch.vue'

marked.use(markedKatex)

const emits = defineEmits<{
    (e: 'view', id: string): void
    (e: 'endView'): void
}>()

type Index = {
    id: string,
    name: string
} []

const index: Ref<Index | null> = ref(null)
function loadIndex(data: string) {
    index.value = yaml.load(data!) as Index
}

const activeId: Ref<string | null> = ref(null)
const html: Ref<string | null> = ref(null)
function loadContent(markdown: string) {
    html.value = marked(markdown)
}

const inView = ref(false)
function view(id: string) {
    inView.value = true
    activeId.value = id
    emits('view', id)
}

function endView() {
    inView.value = false
    activeId.value = null
    emits('endView')
}
</script>

<template>
    <div class="log-content" v-if="inView">
        <b>{{ activeId }}
            <a href="javascript:;" @click="endView">&lt;&lt; back</a>
        </b>
        <Fetch
            :url="`/FkLog/${activeId}`"
            :success="loadContent"
        >
            <div class="markdown" v-html="html"></div>
        </Fetch>
    </div>
    <div class="log-index" v-else>
        <Fetch
            url="/FkLog/@meta/index.yml"
            :success="loadIndex"
        >
            <template #default>
                <ul>
                    <li
                        v-for="{ id, name } in index"
                        :key="id"
                        @click="view(id)"
                    >
                        <p class="log-entry">{{ name }}</p>
                    </li>
                </ul>
            </template>
        </Fetch>
    </div>
</template>

<style>
.log-index {
    min-height: 300px;
    padding: 10px;
}

.log-entry {
    color: black;
    transition: color .3s;
}

.log-entry:hover {
    color: #39C5BB;
    text-decoration: underline;
}

.markdown table {
    border-collapse: collapse;
}

.markdown th, .markdown td, .markdown tr {
    border-style: solid;
    border-width: 1px;
    border-color: black #C0C0C0;
}

.markdown th {
    background-color: #EEEEEE;
}
</style>