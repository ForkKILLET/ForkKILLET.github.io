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
    margin: .2em 0 1.2em 0;

    overflow: hidden;
}
h1 > small {
    color: #888;
}

main {
    height: calc(100% - 7.2em);

    padding: 1.2em 2.5em;

    overflow: scroll;
    
    background-color: white;
    box-shadow: 0 0 1.5em #7774;
}
</style>
