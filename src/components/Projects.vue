<script setup lang="ts">
import { ref, Ref } from 'vue'
import Card from './Card.vue'
import IceLava from './IceLava.vue'
import Logs from './Logs.vue'
import Badge from './Badge.vue'
import { version } from '../../package.json'

const fullScreen: Ref<boolean> = ref(false)
</script>

<template>
    <div class="projects">
        <masonry
            :cols="{
                default: 4,
                1440: 3,
                960: 2,
                550: 1
            }"
            gutter="20px"
        >
            <Card
                name="IceLava Top"
                :github="{ user: 'ForkKILLET', repo: 'ForkKILLET.github.io' }"
                :langs="[ 'ts', 'vue' ]"
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
                >
                    A game tells the story of a will trapped in a terminal.
                </Card>

                <Card
                    name="Trolley Problem Emulator"
                    :github="{ user: 'ForkKILLET', repo: 'TrolleyProblemEmulator' }"
                    :langs="[ 'js' ]"
                >
                    Survive the Trolley Problem.
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
            >
                Make <a href="//luogu.com.cn/">Luogu</a> great again.
            </Card>

            <Card
                name="Logs"
                :github="{ user: 'ForkKILLET', repo: 'FkLog' }"
                :langs="[ 'md' ]"
                :class="{ 'full-screen': fullScreen }"
            >
                <Logs @view="fullScreen = true" @end-view="fullScreen = false"></Logs>

                <template #badges>
                    <Badge
                        color="#66CCFF"
                        active
                        @click="fullScreen = ! fullScreen"
                    >
                        {{ fullScreen ? '-' : '+' }}
                    </Badge>
                </template>
            </Card>
        </masonry>
    </div>
</template>

<style scoped>
.projects {
    margin: 10px;
}

.card-wrapper:not(:last-child) {
    margin-bottom: 30px;
}

.card-wrapper.full-screen {
    position: fixed;
    z-index: 1;
    background-color: white;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
}

:deep(.card-wrapper.full-screen .card-inner) {
    overflow-y: scroll;
}
</style>