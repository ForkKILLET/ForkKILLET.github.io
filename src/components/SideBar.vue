<script setup lang="ts">
const buildTime = import.meta.env.VITE_BUILD_TIME ?? 'dev'
const buildEnv = import.meta.env.VITE_BUILD_ENV ?? 'localhost'
</script>

<template>
    <nav class="sidebar">
        <RouterLink to="/">
            <img class="logo" :src="'/FkLog/@banner/icelava.jpg'" />
        </RouterLink>

        <p class="build-info">
            Ver &zeta;2.0.0
            <br>
            Made by <a href="https://github.com/ForkKILLET">ForkKILLET</a>
            <br>
            with <span class="meta">Vue</span>
            <br>
            at <span class="meta">{{ buildTime }}</span>
            <br>
            on <span class="meta">{{ buildEnv }}</span>
        </p>
    </nav>
</template>

<style scoped>
.sidebar {
    display: none;
}

@media screen and (min-width: 500px) {
    .sidebar {
        display: block;
        position: relative;
        flex-shrink: 0;
        height: 100%;
        width: 200px;

        background: white;
        box-shadow: 0 0 1.5em #7774;
    }
}

.logo {
    width: 100%;
    text-align: center;
}

.build-info {
    position: absolute;
    padding: 0 1em;
    bottom: 0;
}

.meta {
    color: #bbbabb;
}
</style>