<script setup lang="ts">
import { ref, computed, createApp } from 'vue'
import { useRoute } from 'vue-router'

import { marked } from 'marked'
import Prism from 'prismjs'
import markedKatex from '../utils/markedKatexExt'
import markedEmoji from '../utils/markedEmojiExt'
import markedCuiping from '../utils/markedCuipingExt'

import Fetch from './Fetch.vue'
import Giscus from '@giscus/vue'
import { Cuiping } from 'cuiping-component'

import 'cuiping-component/dist/style.css'

const route = useRoute()
const logId = computed(() => route.params.id as string)

marked.use(markedCuiping, markedKatex, markedEmoji)
Prism.manual = true

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

const markdownArea = ref<HTMLDivElement | null>(null)

type LogToc = {
    lv: number,
    id: string,
    html: string
} []

const toc = ref<LogToc | null>(null)
const showToc = ref(false)
function toggleToc() {
    showToc.value = ! showToc.value
}

function gotoHeading(id: string) {
    markdownArea.value?.querySelector(`[id="${id}"]`)?.scrollIntoView()
}
</script>

<template>
    <div class="log-content">
        <Fetch
            :key="logId"
            :url="`/FkLog/${logId}`"
            :success="loadContent"
        >
            <div class="log-toc markdown" v-if="showToc">
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
                    :term="logId"
                    theme="preferred_color_scheme"
                    lang="zh-CN"
                />
            </div>
        </Fetch>
    </div>
</template>

<style scoped>
.log-toc {
    position: absolute;
    top: 5px;
    right: 25px;
    z-index: 1;

    padding: 10px 5px;

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
</style>

<style>
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
    vertical-align: text-top;
    font-size: 0.8em;
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
