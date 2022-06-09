<script setup lang="ts">
import Card from './Card.vue'
import IceLava from './IceLava.vue'
import LogIndex from './LogIndex.vue'
</script>

<template>
    <div class="projects">
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
            ForkKILLET's logs.

            <LogIndex></LogIndex>
        </Card>
    </div>
</template>

<style scoped>
.projects {
    margin: 10px;
    column-gap: 30px;
}

@media screen and (min-width: 1440px) {
    .projects {
        columns: 4;
    }
}

@media screen and (min-width: 960px) and (max-width: 1440px) {
    .projects {
        columns: 3;
    }
}

@media screen and (min-width: 448px) and (max-width: 960px) {
    .projects {
        columns: 2;
    }
}

@media screen and (max-width: 448px) {
    .projects {
        columns: 1;
    }
}

.projects > * {
    width: 100%;
    break-inside: avoid;
    margin-bottom: 30px;
    margin-right: 20px;
}
</style>