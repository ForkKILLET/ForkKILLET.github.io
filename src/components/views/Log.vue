<script setup lang="ts">
import { ref, computed, createApp, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useLogStore } from '@store/log'

import Fetch from '@comp/Fetch.vue'
import Giscus from '@giscus/vue'

import { marked, markedOption } from '@util/marked/markedManager'
import { kNotiManager } from '@/utils/injections'
import { keyboardManager } from '@util/keyboardManager'
import { cuiping, loadCuiping } from '@util/cuipingManager'

const devMode = import.meta.env.DEV

const notiManager = inject(kNotiManager)!
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const logId = computed(() => route.params.id as string)

const logStore = useLogStore()
const { showToc } = storeToRefs(logStore)

const html = ref<string | null>(null)
const markdownArea = ref<HTMLDivElement | null>(null)
const loadContent = async (markdown: string) => {
    html.value = await (marked(markdown, markedOption) as unknown as Promise<string>)
}

type LogToc = {
    lv: number,
    id: string,
    html: string
} []

const toc = ref<LogToc>()
const toggleToc = () => {
    if (logStore.showToc = ! logStore.showToc) {
        (document.querySelector('.log-toc') as HTMLDivElement)?.focus()
    }
}

const gotoHeading = (id: string) => {
    if (! markdownArea.value) return

    const headingEl = markdownArea.value.querySelector(`[id="${id}"]`) as HTMLElement | undefined
    if (! headingEl) return

    const mainEl = document.querySelector('main')!
    const offsetTop = headingEl.tagName === 'SPAN' ? - 10 : 0
    mainEl.scrollTo({
        top: headingEl.offsetTop - mainEl.offsetTop + offsetTop,
        behavior: 'smooth'
    })

    router.replace({ query: { anchor: id } })
}

const gotoAnchor = () => {
    const { anchor } = route.query
    if (typeof anchor === 'string') {
        setTimeout(() => gotoHeading(anchor), 600)
    }
}

const renderToc = (container: HTMLDivElement) => {
    toc.value = Array
        .from(container.querySelectorAll('h1, h2, .anchor') as NodeListOf<HTMLHeadElement | HTMLSpanElement>)
        .map(head => ({
            lv: head.tagName === 'SPAN' ? 3 : + head.tagName.slice(1),
            id: head.id,
            html: head.innerHTML
        }))
}

const renderCuiping = async (container: HTMLDivElement) => {
    const cuipingEls = container.querySelectorAll('.cuiping') as NodeListOf<HTMLDivElement>
    if (cuipingEls.length) {
        let nid: number | null = null
        if (! cuiping) {
            nid = notiManager.addNoti({ content: () => t('msg.loading-cuiping') })
            loadCuiping()
        }
        const { Cuiping } = await cuiping
        if (nid !== null) notiManager.removeNoti(nid)
        cuipingEls.forEach(el => {
            if (! el.dataset.vApp) createApp(Cuiping, {
                molecule: el.dataset.molecule
            }).mount(el)
        })
    }
}

watch(markdownArea, () => {
    if (! markdownArea.value) return

    renderToc(markdownArea.value)
    renderCuiping(markdownArea.value)
    gotoAnchor()
})

watch(route, async () => {
    if (route.path.startsWith('/log/')) {
        gotoAnchor()

        keyboardManager.dispose('toggleToc')
        keyboardManager.register('toggleToc', {
            key: 't',
            action: () => toggleToc()
        })
    }
    else {
        keyboardManager.dispose('toggleToc')
    }
}, { immediate: true })

onMounted(async () => {
    const logItem = (await logStore.getLogById(logId.value))!
    logItem.lastRead = new Date
    logStore.updateLastIndex()
})
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
    left: 0;
    top: 0;
    z-index: 2;

    display: inline-flex;
    padding: .6em;

    background: white;
    box-shadow: 0 0 .5em #7774;
    opacity: .5;
    transition: .5s box-shadow, .5s opacity;
}
.log-toc:hover, .log-toc:focus-within {
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
.log-toc-item[data-lv='3'] {
    margin-left: 2em;
    list-style-type: disc;
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

.markdown .anchor::after {
    content: '#';
    margin: 0 .3em;
    color: #39C5BB;
}

.giscus-container {
    width: 90%;
}
</style>
