<script setup lang="ts">
import { ref, computed, createApp, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLogStore } from '../../stores/log'

import Fetch from '../Fetch.vue'
import Giscus from '@giscus/vue'
import { Cuiping } from 'cuiping-component'
import 'cuiping-component/dist/style.css'

import { marked, markedOption } from '../../utils/markedManager'

const devMode = import.meta.env.DEV
const router = useRouter()
const route = useRoute()
const logId = computed(() => route.params.id as string)

onMounted(async () => {
    const logStore = useLogStore()
    const logItem = (await logStore.getLogById(logId.value))!
    logItem.lastRead = new Date
    logStore.updateLastIndex()
})

const html = ref<string | null>(null)
const markdownArea = ref<HTMLDivElement | null>(null)
async function loadContent(markdown: string) {
    html.value = await marked(markdown, markedOption)
}

watch(markdownArea, () => {
    if (! markdownArea.value) return

    toc.value = Array
        .from(markdownArea.value.querySelectorAll('h1, h2') as NodeListOf<HTMLHeadElement>)
        .map(head => ({
            lv: + head.tagName.slice(1),
            id: head.id,
            html: head.innerHTML
        }))

    const { anchor } = route.query
    if (typeof anchor === 'string') gotoHeading(anchor)

    const cuipings = markdownArea.value.querySelectorAll('.cuiping') as NodeListOf<HTMLDivElement>
    cuipings.forEach(el => {
        if (el.dataset.vApp) createApp(Cuiping, {
            molecule: el.dataset.molecule
        }).mount(el)
    })
})

type LogToc = {
    lv: number,
    id: string,
    html: string
} []

const toc = ref<LogToc | null>(null)
const showToc = ref(true)
function toggleToc() {
    showToc.value = ! showToc.value
}

function gotoHeading(id: string) {
    markdownArea.value?.querySelector(`[id="${id}"]`)?.scrollIntoView({
        behavior: 'smooth',
        inline: 'start'
    })

    router.replace({ query: { anchor: id } })
}
</script>

<template>
    <div class="log-content">
        <Fetch
            :key="logId"
            :url="`/FkLog/${logId}`"
            :success="loadContent"
        >
            <div class="log-toc markdown" tabindex="0">
                <span
                    class="log-toc-button"
                    tabindex="0"
                    @click="toggleToc"
                    @keypress.enter="toggleToc"
                >#</span>
                <ul class="log-toc-content" v-if="showToc">
                    <li
                        v-for="{ lv, id, html } in toc"
                        v-html="html"
                        :key="id"
                        :data-lv="lv"
                        class="log-toc-item"
                        tabindex="0"
                        @click="gotoHeading(id)"
                        @keypress.enter="gotoHeading(id)"
                    ></li>
                </ul>
            </div>
            <div ref="markdownArea" class="log-text markdown" v-html="html"></div>
            <div class="giscus-container" v-if="! devMode">
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
.log-content {
	min-width: 500px;
}

.log-toc {
    position: sticky;
    top: 0;
    z-index: 2;

    display: inline-flex;
    padding: .6em;

    background: white;
    box-shadow: 0 0 .5em #7774;
    opacity: .5;
    transition: .5s box-shadow, .5s opacity;
}
.log-toc:hover, .log-toc:focus {
    opacity: 1;
    box-shadow: 0 0 .5em #39C5BB;
}

.log-toc-button {
    display: inline-block;
    width: 1em;
    z-index: 1;

    user-select: none;
    text-align: center;
    transition: color;
}
.log-toc-button:hover {
    cursor: pointer;
}
.log-toc-button:hover, .log-toc-button:focus {
    animation: .3s hop;
    color: #39C5BB;
}
.log-toc-content {
    margin: 0 -1em 0;
    padding-right: 1em;
    list-style-type: disclosure-closed;
}
.log-toc-item {
    transition: .3s color;
}
.log-toc-item:hover, .log-toc-item:focus {
    color: #39C5BB;
    text-decoration: underline;
    cursor: pointer;
}
.log-toc-item[data-lv='2'] {
    margin-left: 1em;
}
</style>

<style>
@media screen and (max-width: 600px) {
    .markdown {
        font-size: .9em;
    }

    .log-text li {
        margin-left: -1em;
    }
}

.markdown h1, .markdown h2 {
    padding-top: .3em;
    margin-left: -1.2em;
    padding-left: 1.2em;
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

.markdown .prism-line-number {
	color: #aaa;
}

.giscus-container {
    width: 90%;
}
</style>
