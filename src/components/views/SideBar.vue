<script setup lang="ts">
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
            Ver &zeta;2.0.0 made by <a href="https://github.com/ForkKILLET">ForkKILLET</a>
            with Vue at <u>{{ buildTime }}</u> on <u>{{ buildEnv }}</u>
        </p>
    </nav>
</template>

<style scoped>
@media screen and (max-width: 500px) {
    .sidebar {
        display: none;
    }
}

@media screen and (min-width: 501px) {
    .sidebar {
        position: relative;
        flex-shrink: 0;
        height: 100%;
        width: 200px;

        background: white;
        box-shadow: 0 0 .5em #aaa;
    }
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