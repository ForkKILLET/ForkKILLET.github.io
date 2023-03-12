<script setup lang="ts">
import { ref } from 'vue'

import Home from './components/views/Home.vue'
import SideBar from './components/views/SideBar.vue'
import SideBarButton from './components/SideBarButton.vue'

const sideBarActive = ref(false)
</script>

<template>
    <div class="root">
        <SideBar class="sidebar" :class="{ active: sideBarActive }"></SideBar>
        <SideBarButton @click="sideBarActive = ! sideBarActive"></SideBarButton>
        <Home></Home>
    </div>
</template>

<style scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100vw;

    background: #E6F8FF;
    font-family: 'Times New Roman', 'Simsun', serif;
}
</style>

<style>
body {
    margin: 0;
}

a {
    text-decoration: none;
    color: #40CAC1;
    transition: color .2s;
    text-shadow: 0 0 1px #66CCFF;
}
a:hover {
    text-decoration: underline;        
}
a:active {
    color: #2C918B;
}
</style>
