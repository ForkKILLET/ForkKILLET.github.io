<script setup lang="ts">
import { ref, watch } from 'vue'
import Waterfall from './Waterfall.vue'
import Card from './Card.vue'
import IceLava from './IceLava.vue'
import Logs from './Logs.vue'
import Mask from './Mask.vue'
import { version } from '../../package.json'
import Badge from './Badge.vue'

const buildTime = import.meta.env.VITE_BUILD_TIME ?? 'DEV'

const inLogView = ref<boolean>(false)
const logs = ref<typeof Logs | null>(null)

watch(inLogView, val => {
    document.body.className = val ? 'masked' : ''
})

</script>

<template>
    <Mask v-if="inLogView" />
    <Waterfall :gap="30" class="projects">
        <Card
            name="IceLava Top"
            :github="{ user: 'ForkKILLET', repo: 'ForkKILLET.github.io' }"
            :langs="[ 'ts', 'vue' ]"
            tico="il"
        >
            <IceLava />'s homepage. v{{ version }}-ζ <br />
            Make with &lt;3 by <a href="//github.com/ForkKILLET">ForkKILLET</a> in Vue on <u>{{ buildTime }}</u>
        </Card>

        <Card name="Chat">
            <Card
                name="WillBot"
                :github="{ user: 'ForkKILLET', repo: 'WillBot' }"
                :langs="[ 'js' ]"
            >
                A chat Bot with concise and free Will.
            </Card>

            <Card
                name="icalingua++"
                :github="{ user: 'icalingua-plus-plus', repo: 'icalingua-plus-plus' }"
                :langs="[ 'ts', 'js' ]"
            >
                A client for QQ and more.
            </Card>
        </Card>

        <Card name="Games">
            <Card
                name="Sudoer Of Myself"
                :github="{ user: 'ForkKILLET', repo: 'SudoerOfMyself' }"
                :langs="[ 'js', 'rust' ]"
                tico="som"
            >
                A game tells the story of a will trapped in a terminal. (WIP)<br />
                <a href="/SudoerOfMyself/">&gt;&gt; play</a>
            </Card>

            <Card
                name="Trolley Problem Emulator"
                :github="{ user: 'ForkKILLET', repo: 'TrolleyProblemEmulator' }"
                :langs="[ 'js' ]"
                tico="tpe"
            >
                Survive the Trolley Problem. (WIP)<br />
                <a href="/TrolleyProblemEmulator/">&gt;&gt; play</a>
            </Card>
        </Card>

        <Card name="Novels">
            <Card
                name="Terminal Xbqg"
                :github="{ user: 'ForkKILLET', repo: 'TerminalXbqg' }"
                :langs="[ 'js' ]"
            >
                A fancy CLI novel reader.
            </Card>
        </Card>

        <Card
            name="Extend Luogu"
            :github="{ user: 'extend-luogu', repo: 'extend-luogu' }"
            :langs="[ 'js', 'ts' ]"
            tico="exlg"
        >
            Make <a href="//luogu.com.cn/">Luogu</a> great again.
        </Card>

        <Card
            name="Cuiping.js"
            :github="{ user: 'ForkKILLET', repo: 'cuiping.js' }"
            :langs="[ 'ts', 'vue' ]"
        >
            A TypeScript library rendering chemistry strutures to SVG <br />
            <a href="/cuiping.js/">&gt;&gt; Try</a>
        </Card>

        <Card
            name="Logs"
            :github="{ user: 'ForkKILLET', repo: 'FkLog' }"
            :langs="[ 'md' ]"
            scroll
            :class="{ 'full-screen': inLogView }"
        >
            <Logs
                ref="logs"
                @view="inLogView = true"
                @end-view="inLogView = false"
            />
            <template #badges>
                <Badge
                    v-if="inLogView"
                    color="#66CCFF"
                    active
                    @click="logs?.toggleToc()"
                >
                    toc
                </Badge>
            </template>
        </Card>
    </Waterfall>
</template>

<style scoped>
.projects {
    margin: 10px;
}

.card-wrapper.full-screen {
    position: fixed;
    z-index: 1;
    background-color: white;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px) !important;
    height: calc(100% - 20px) !important;
}
</style>
