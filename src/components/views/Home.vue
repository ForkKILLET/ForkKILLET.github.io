<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const routeId = computed(() => route.params.id)
</script>

<template>
    <div class="home">
        <h1>{{ route.name }}
            <small v-if="routeId">/ {{ routeId }}</small>
        </h1>
        <main>
            <RouterView></RouterView>
        </main>
    </div>
</template>

<style scoped>
@media screen and (max-width: 500px) {
    .home {
        width: calc(100% - 3em);
    }
}
@media screen and (min-width: 501px) {
    .home {
        width: calc(100% - 200px - 3em);
    }
}
.home {
    padding: 1.5em 2em;
}

h1 {
    height: 1em;
    margin: 0 0 1em 0;
    padding: .2em 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
}
h1 > small {
    color: #888;
}

main {
    height: calc(100% - 7.2em);

    padding: 1.2em 2.5em;

    overflow: auto;
    
    background-color: white;
    box-shadow: 0 0 1.5em #7774;
}
</style>
