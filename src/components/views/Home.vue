<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeId = computed(() => route.params.id)

const entering = ref(false)
</script>

<template>
    <div class="home">
        <h1>{{ route.name }}
            <small v-if="routeId">/ {{ routeId }}</small>
        </h1>
        <main :class="{ entering }">
            <RouterView v-slot="{ Component }">
                <Transition
                    name="float"
                    @before-enter="entering = true"
                    @after-enter="entering = false"
                >
                    <component :is="Component"></component>
                </Transition>
            </RouterView>
        </main>
    </div>
</template>

<style scoped>
.home {
    flex-grow: 1;
    width: 0;
    padding: 1.5em;
}

.float-enter-active {
    overflow-x: hidden;
    transition: .5s transform, .5s opacity;
}
.float-enter-from {
    opacity: 0;
    transform: translateX(5vw);
}
.float-enter-to {
    opacity: 1;
    transform: none;
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
    height: calc(100% - 7em);

    padding: 1.5em;

    overflow: auto;
    overflow-anchor: none;
    
    background-color: white;
    box-shadow: 0 0 .5em #aaa;
}
main.entering {
    overflow-x: hidden;
}
</style>
