<script setup lang="ts">
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import { onMounted, ref, Ref } from 'vue'

const props = defineProps<{
    config: Gitalk.GitalkOptions
}>()

const gitalk = new Gitalk(props.config)

const gitalkContainer: Ref<HTMLDivElement | null> = ref(null)

onMounted(() => gitalk.render(gitalkContainer.value!))
</script>

<template>
    <div class="gitalk-container" ref="gitalkContainer"></div>
</template>