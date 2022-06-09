<script setup lang="ts">
import Card from './Card.vue'
import IceLava from './IceLava.vue'
import LogIndex from './LogIndex.vue'
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
                <IceLava></IceLava>'s homepage. <br /> ζ refactor. <br />
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
            >
                <p>ForkKILLET's logs.</p>

                <LogIndex></LogIndex>
            </Card>
        </masonry>
    </div>
</template>

<style scoped>
.projects {
    margin: 10px;
}

.projects .card-wrapper:not(:last-child) {
    margin-bottom: 30px;
}
</style>