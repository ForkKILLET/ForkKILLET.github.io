<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const routeId = computed(() => route.params.id)

const entering = ref(false)

onMounted(() => {
    document.querySelector('main')?.focus()
})
</script>

<template>
    <div class="home">
        <h1>
            <span v-if="route.name">{{ t('route.' + (route.name as string)) }}</span>
            <small v-if="routeId">/ {{ routeId }}</small>
        </h1>
        <main :class="{ entering }" tabindex="0">
            <RouterView v-slot="{ Component }">
                <Transition
                    name="float"
                    @before-enter="entering = true"
                    @after-enter="entering = false"
                >
                    <KeepAlive>
                        <component :is="Component" :key="route.path"></component>
                    </KeepAlive>
                </Transition>
            </RouterView>
        </main>
    </div>
</template>

<style scoped>
.home {
    flex-grow: 1;
    width: 0;
    padding: 1.5em 2em;
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
    margin-bottom: 0 0 1em 0;
    padding: .2em 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
}
@media screen and (max-width: 600px) {
    .home {
        padding: .5em 1em;
    }
    h1 {
        margin: 0 0 .5em 0;
    }
}
h1 > small {
    color: #888;
}

main {
    height: calc(100% - 7.2em);

    padding: 1.2em 1.5em;

    overflow: auto;
    
    background-color: white;
    box-shadow: 0 0 1.5em #7774;

    transition: box-shadow .5s;
}
main:focus {
    box-shadow: 0 0 .5em #39C5BB;
}
main.entering {
    overflow-x: hidden;
}
</style>
