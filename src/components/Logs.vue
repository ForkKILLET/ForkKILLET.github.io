<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import yaml from 'js-yaml'
import { marked } from 'marked'
import Prism from 'prismjs'
import markedKatex from '../utils/markedKatexExt'
import Fetch from './Fetch.vue'

marked.use(markedKatex)
Prism.manual = true
Object.assign(window, { Prism })

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
    html.value = marked(markdown, {
        baseUrl: './FkLog/',
        highlight: (code, lang) => (
            Prism.highlight(code, Prism.languages[lang], lang)
                .split('\n')
                .map((ln, i, lines, n = lines.length.toString().length) =>
                    `<span class="line-number">${
                        ' '.repeat(n - (i + 1).toString().length)
                    }${i + 1}. </span>${ln}`
                )
                .join('\n')
        )
    })
}

const inView = ref(false)
function view(id: string) {
    inView.value = true
    activeId.value = id
    query.log = id
    emits('view', id)
}

function endView() {
    inView.value = false
    activeId.value = null
    delete query.log
    emits('endView')
}

onMounted(() => {
    if ('log' in query) view(query.log)
})
</script>

<template>
    <div class="log-content" v-if="inView">
        <b>{{ activeId }}
            <a href="javascript:;" @click="endView">&lt;&lt; back</a>
        </b>
        <keep-alive>
            <Fetch
                :url="`/FkLog/${activeId}`"
                :success="loadContent"
            >
                <div class="markdown" v-html="html"></div>
            </Fetch>
        </keep-alive>
    </div>
    <div class="log-index" v-else>
        <keep-alive>
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
        </keep-alive>
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

.markdown img {
    max-width: 80%;
}

.markdown pre {
    width: 90%;
    overflow-x: auto;
    background-color: black;
    border-radius: 10px;
    padding: 7px;
    box-shadow: 0 1px 1px 1px black;
}

.markdown code:not(pre > code) {
    display: inline-block;
    margin: 0 1px;
    padding: 0 2px;
    border-radius: 3px;
    color: white;
    background-color: black;
    box-shadow: 0 1px 1px 1px black;
}

.markdown blockquote {
    border-left: 5px solid #C0C0C0;
    margin-left: 10px;
    padding-left: 20px;
}
</style>