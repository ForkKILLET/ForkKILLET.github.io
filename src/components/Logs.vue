<script setup lang="ts">
import { ref, onMounted } from 'vue'
import yaml from 'js-yaml'
import { marked } from 'marked'
import Prism from 'prismjs'
import markedKatex from '../utils/markedKatexExt'
import Fetch from './Fetch.vue'
import Gitalk from './Gitalk.vue'

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

const index = ref<Index | null>(null)
function loadIndex(data: string) {
    index.value = yaml.load(data!) as Index
}

const activeId = ref<string | null>(null)
const html = ref<string | null>(null)
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

function view(id: string, doUpdate: boolean = false) {
    activeId.value = id
    if (doUpdate) {
        query.log = id
    }
    emits('view', id)
}

function endView(doUpdate: boolean = false) {
    activeId.value = null
    if (doUpdate) delete query.log
    emits('endView')
}

function route() {
    if (query.log) view(query.log)
    else endView()
} 

onMounted(route)
window.addEventListener('hashchange', route)
</script>

<template>
    <div class="log-content" v-if="activeId">
        <b>{{ activeId }}
            <a href="javascript:;" @click="endView(true)">&lt;&lt; back</a>
        </b>
        <keep-alive>
            <Fetch
                :url="`/FkLog/${activeId}`"
                :success="loadContent"
            >
                <div class="markdown" v-html="html"></div>
                <Gitalk
                    :config="{
                        clientID: '3405c3c0316a15a2b35c',
                        clientSecret: '9c7f69f4397ec2021cc5391c29abfd4f511c6313',
                        repo: 'FkLog',
                        owner: 'ForkKILLET',
                        admin: [ 'ForkKILLET' ],
                        id: activeId,
                        title: activeId,
                        language: 'zh-CN'
                    }"
                />
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
                            @click="view(id, true)"
                        >
                            <p class="log-entry">{{ name }} <small class="log-id"><br />{{ id }}</small></p>
                        </li>
                    </ul>
                </template>
            </Fetch>
        </keep-alive>
    </div>
</template>

<style>
.log-index {
    height: 350px;
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

.log-id {
    color: #7D7D7D;
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

.markdown .katex-error {
    position: relative;
    color: red;
}

.markdown .katex-error::before {
    content: '[';
    color: black;
}

.markdown .katex-error::after {
    content: ']';
    color: black;
}

.gitalk-container {
    width: 90%;
}
</style>