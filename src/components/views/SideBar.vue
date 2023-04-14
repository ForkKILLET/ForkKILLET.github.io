<script setup lang="ts">
import { computed } from 'vue'
import { useI18n,  } from 'vue-i18n'
import { langs, locale, MessageLangs } from '@/locales'

import Flag from '@comp/Flag.vue'

import { version } from '@pack'
const buildTime = import.meta.env.VITE_BUILD_TIME ?? 'dev'
const buildEnv = import.meta.env.VITE_BUILD_ENV ?? 'localhost'

const { t, locale: i18nLocale } = useI18n()
const switchLang = (lang: MessageLangs) => {
    i18nLocale.value = locale.value = lang
}

type SideBarItem = {
    name: string
    route: string
}

const items = computed<SideBarItem[]>(() => [
    {
        name: t('sidebar.home'),
        route: '/'
    },
    {
        name: t('sidebar.tags'),
        route: '/tags'
    },
    {
        name: t('route.settings'),
        route: '/settings'
    },
    {
        name: t('sidebar.friends'),
        route: '/log/log-friends'
    }
])
</script>

<template>
    <nav class="sidebar">
        <RouterLink class="logo-container" to="/">
            <img class="logo" :src="'/FkLog/@banner/icelava.jpg'"/>
        </RouterLink>

        <div class="langs">
            <Flag
                v-for="lang of langs"
                :name="lang"
                tabindex="0"
                @click="switchLang(lang)"
                @keypress.enter="switchLang(lang)"
            ></Flag>
        </div>

        <p v-for="item in items">
            <RouterLink
                :to="item.route"
                class="sidebar-item"
            >{{ item.name }}</RouterLink>
        </p>

        <i18n-t scope="global" keypath="msg.build-info" tag="p" class="build-info">
            <a href="https://github.com/ForkKILLET/ForkKILLET.github.io/" tabindex="-1">&zeta;{{ version }}</a>
            <a href="https://github.com/ForkKILLET" tabindex="-1">ForkKILLET</a>
            <u>{{ buildTime }}</u>
            <u>{{ buildEnv }}</u>
        </i18n-t>
    </nav>
</template>

<style scoped>
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

.langs {
    padding: 0 .3em;
    font-size: 1.5em;
}
.langs > .flag {
    margin: 0 .2em;

    user-select: none;
    transition: .5s text-shadow;
}
.langs > .flag:hover, .langs > .flag:focus {
    text-shadow: 0 0 .1em #39C5BB;
    cursor: pointer;
}

.sidebar-item {
    display: inline-block;
    padding: 0 1em;

    color: black;

    text-decoration: none;
    text-shadow: none;

    transition: .2s transform;
}
.sidebar-item::before {
    content: '>';

    padding-right: .5em;

    opacity: 0;
    transition: .3s opacity;
}
.sidebar-item:hover, .sidebar-item:focus {
    color: #39C5BB;
}
.sidebar-item:hover::before, .sidebar-item:focus::before {
    opacity: 1;
}
.sidebar-item:active {
    transform: translateX(1em);
}

.logo-container {
    display: block;
    margin: .7em;

    border-radius: .5em;

    overflow: hidden;
    text-decoration: none;
    text-shadow: none;
}
.logo-container:hover, .logo-container:focus {
    animation: 1.5s pulse infinite;
}

.logo {
    display: block;
    width: 100%;
}

.build-info {
    position: absolute;
    padding: .5em;
    bottom: 0;
    background: white;
}
</style>
