<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<template>
    <div class="home">
        <h1>{{ route.name }}
            <small v-if="route.params.id">/ {{ route.params.id }}</small>
        </h1>
        <main>
            <RouterView></RouterView>
        </main>
    </div>
</template>

<style scoped>
.home {
    flex: 1;
    padding: 1.5em;
}

h1 {
    height: 1em;
    margin: 0 0 1em 0;
}

h1 > small {
    color: #aaa;
}

main {
    height: calc(100% - 5em);

    padding: 1em;

    overflow-y: scroll;
    scrollbar-width: none;
    
    background-color: white;
    box-shadow: 0 0 .5em #aaa;
}

main::-webkit-scrollbar {
    width: 0;
}
</style>
