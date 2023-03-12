<script setup lang="ts">
import { version } from '../../../package.json'

const buildTime = import.meta.env.VITE_BUILD_TIME ?? 'dev'
const buildEnv = import.meta.env.VITE_BUILD_ENV ?? 'localhost'

type SideBarItem = {
    name: string
    route: string
}

const items: SideBarItem[] = [
    {
        name: 'Home',
        route: '/'
    },
    {
        name: 'Tags',
        route: '/tags'
    },
    {
        name: 'Friends',
        route: '/log/log-friends'
    }
]
</script>

<template>
    <nav class="sidebar">
        <RouterLink class="logo-container" to="/">
            <img class="logo" :src="'/FkLog/@banner/icelava.jpg'"/>
        </RouterLink>

        <p v-for="item in items">
            <RouterLink
                :to="item.route"
                class="sidebar-item"
            >{{ item.name }}</RouterLink>
        </p>

        <p class="build-info">
            Ver <a href="https://github.com/ForkKILLET/ForkKILLET.github.io/">&zeta;{{ version }}</a> made by <a href="https://github.com/ForkKILLET">ForkKILLET</a>
            with Vue at <u>{{ buildTime }}</u> on <u>{{ buildEnv }}</u>
        </p>
    </nav>
</template>

<style scoped>
@media screen and (max-width: 600px) {
    .sidebar:not(.active) {
        opacity: 0;
        max-width: 0;
    }
    .sidebar.active {
        opacity: 1;
        max-width: 200px;
    }
}

.sidebar {
    position: relative;
    flex-shrink: 0;
    height: 100%;
    width: 200px;

    overflow: hidden;

    background: white;
    box-shadow: 0 0 1.5em #7774;

    transition: .5s max-width, .5s opacity;
}

.sidebar-item {
    padding: 0 1em;

    color: black;

    text-decoration: none;
    text-shadow: none;
}
.sidebar-item::before {
    content: '>';

    padding-right: .5em;

    opacity: 0;
    transition: .3s opacity;
}
.sidebar-item:hover {
    color: #39C5BB;
}
.sidebar-item:hover::before {
    opacity: 1;
}

.logo-container {
    display: block;
    margin: .7em;

    border-radius: .5em;

    overflow: hidden;
    text-decoration: none;
    text-shadow: none;
}

.logo {
    display: block;
    width: 100%;
}

.build-info {
    position: absolute;
    padding: .5em;
    bottom: 0;
}
</style>