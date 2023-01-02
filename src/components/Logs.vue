<script setup lang="ts">
import { ref, onMounted, nextTick, createApp } from 'vue'
import yaml from 'js-yaml'
import { marked } from 'marked'
import Prism from 'prismjs'
import markedKatex from '../utils/markedKatexExt'
import markedEmoji from '../utils/markedEmojiExt'
import markedCuiping from '../utils/markedCuipingExt'
import Fetch from './Fetch.vue'
import Giscus from '@giscus/vue'
import { Cuiping } from 'cuiping-component'
import 'cuiping-component/dist/style.css'

marked.use(markedCuiping, markedKatex, markedEmoji)
Prism.manual = true

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
    setTimeout(() => {
        toc.value = Array
            .from(markdownArea.value!.querySelectorAll('h1, h2') as NodeListOf<HTMLHeadElement>)
            .map(head => ({
                lv: + head.tagName.slice(1),
                id: head.id,
                html: head.innerHTML
            }))

        const cuipings = markdownArea.value!.querySelectorAll('.cuiping') as NodeListOf<HTMLDivElement>
        cuipings.forEach(el => {
            if (el.dataset.vApp !== "") createApp(Cuiping, {
                molecule: el.dataset.molecule
            }).mount(el)
        })
    }, 0)
}

const logContent = ref<typeof Fetch | null>(null)
async function view(id: string, doUpdate: boolean = false) {
    activeId.value = id
    if (doUpdate) query.log = id
    emits('view', id)
    nextTick(() => logContent.value!.load())
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

const markdownArea = ref<HTMLDivElement | null>(null)

type LogToc = Array<{
    lv: number,
    id: string,
    html: string
}>

const toc = ref<LogToc | null>(null)
const inTocView = ref(false)
function toggleToc() {
    inTocView.value = ! inTocView.value
}

function gotoHeading(id: string) {
    markdownArea.value?.querySelector(`[id="${id}"]`)?.scrollIntoView()
}

defineExpose({ toggleToc, gotoHeading })
</script>

<template>
    <div class="log-content" v-if="activeId">
        <b>{{ activeId }}
            <a href="javascript:;" @click="endView(true)">&lt;&lt; back</a>
        </b>
        <Fetch
            ref="logContent"
            :url="`/FkLog/${activeId}`"
            :success="loadContent"
        >
            <div class="log-toc markdown" v-if="inTocView">
                <ul>
                    <li
                        v-for="{ lv, id, html } in toc"
                        v-html="html"
                        :key="id"
                        :class="[ `log-toc-item-${lv}`, 'implict-link' ]"
                        @click="gotoHeading(id)"
                    ></li>
                </ul>
            </div>
            <div ref="markdownArea" class="markdown" v-html="html"></div>
            <div class="giscus-container">
                <Giscus
                    repo="ForkKILLET/FkLog"
                    repo-id="R_kgDOHeN7yQ"
                    category="Announcements"
                    category-id="DIC_kwDOHeN7yc4CTXKN"
                    mapping="specific"
                    :term="activeId"
                    theme="preferred_color_scheme"
                    lang="zh-CN"
                />
            </div>
        </Fetch>
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
                            <p class="implict-link">{{ name }} <small class="log-id"><br />{{ id }}</small></p>
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

.implict-link {
    color: black;
    transition: color .3s;
}

.implict-link:hover {
    color: #39C5BB;
    text-decoration: underline;
}

.log-id {
    color: #7D7D7D;
}

.log-toc {
    position: absolute;
    top: 5px;
    padding: 10px 5px;
    right: 25px;
    z-index: 1;
    border-radius: 10px;
    background: white;
    box-shadow: 0 0 1px 1px #39C5BB;
}

.log-toc > ul {
    padding: 0 10px 0 20px;
    list-style-type: disclosure-closed;
}

.log-toc-item-2 {
    margin-left: 15px;
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

.markdown .katex {
    display: inline-block;
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

.giscus-container {
    width: 90%;
}
</style>
