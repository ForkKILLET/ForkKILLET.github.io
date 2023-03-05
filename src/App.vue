<script setup lang="ts">
import Home from './components/Home.vue';
import SideBar from './components/SideBar.vue'
</script>

<template>
    <div class="root">
        <SideBar class="sidebar"></SideBar>
        <Home></Home>
    </div>
</template>

<style scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100vw;

    background: aliceblue;
}
</style>

<style>
body {
    margin: 0;
}

a {
    text-decoration: none;
    color: #39C5BB;
    transition: color .2s;
    text-shadow: 0 0 1px #66CCFF;
}
a:hover {
    text-decoration: underline;        
}
a:active {
    color: black
}
</style>
