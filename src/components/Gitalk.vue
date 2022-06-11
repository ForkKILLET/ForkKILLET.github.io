<script setup lang="ts">
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import { onMounted, ref } from 'vue'

const props = defineProps<{
    config: Gitalk.GitalkOptions
}>()

const gitalk = new Gitalk(props.config)

const gitalkContainer = ref<HTMLDivElement | null>(null)

onMounted(() => gitalk.render(gitalkContainer.value!))
</script>

<template>
    <div class="gitalk-container" ref="gitalkContainer"></div>
</template>