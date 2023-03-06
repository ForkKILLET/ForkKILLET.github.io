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
        height: 100%;
        width: 15%;
        min-width: 200px;

        background: white;
        box-shadow: 0 0 .5em #aaa;
    }
}

.logo {
    width: 100%;
    text-align: center;
}

.build-info {
    position: absolute;
    padding: .5em;
    bottom: 0;
}
</style>