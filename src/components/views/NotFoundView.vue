<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const next = ref(route.path.slice(1))
const goToNext = () => {
    router.replace('/' + next.value)
}
</script>

<template>
    <div class="root">
        <p>
            Sorry but we don't have <input type="text" v-model="next" @keypress.enter="goToNext" /> :(
        </p>
        <p v-if="route.path === '/anything'">
            Nah. At least we do have a <RouterLink to="/">Home</RouterLink>!
        </p>
        <p v-else-if="route.path.toLowerCase() === '/miku'">
            Nah. <span style="color: #39C5BB;">Miku</span> is real!
        </p>
        <div
            v-if="next !== route.path.slice(1)"
            class="go-to-next"
            @click="goToNext"
            @keypress.enter="goToNext"
            tabindex="0"
        >Next step!</div>
    </div>
</template>

<style scoped>
.root {
    text-align: center;
}

.go-to-next {
    color: #39C6BB;
}
.go-to-next:hover, .go-to-next:focus {
    text-decoration: underline;
    animation: .3s hop;
}
</style>