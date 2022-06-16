<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Waterfall from './Waterfall.vue'
import Card from './Card.vue'
import IceLava from './IceLava.vue'
import Logs from './Logs.vue'
import Mask from './Mask.vue'
import { version } from '../../package.json'

const fullScreen = ref<boolean>(false)
</script>

<template>
    <Mask v-if="fullScreen" />
    <Waterfall :gap="30" class="projects">
        <Card
            name="IceLava Top"
            :github="{ user: 'ForkKILLET', repo: 'ForkKILLET.github.io' }"
            :langs="[ 'ts', 'vue' ]"
            tico="il"
        >
            <IceLava />'s homepage. v{{ version }}-ζ <br />
            Make with &lt;3 by <a href="//github.com/ForkKILLET">ForkKILLET</a> in Vue
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
            name="Logs"
            :github="{ user: 'ForkKILLET', repo: 'FkLog' }"
            :langs="[ 'md' ]"
            scroll
            :class="{ 'full-screen': fullScreen }"
        >
            <Logs @view="fullScreen = true" @end-view="fullScreen = false"></Logs>
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