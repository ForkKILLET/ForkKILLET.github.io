<script setup lang="ts">
import Loading from './Loading.vue'
import useFetch, { FetchRes } from '../utils/useFetch'
import { onMounted, reactive, ref } from 'vue'

const props = defineProps<{
    url: string
    noLoad?: boolean
    success?: (data: string) => void | Promise<void>
}>()

const loading = ref<boolean>(true)
const res = reactive<FetchRes>({})

async function load() {
    if (! props.noLoad) {
        await useFetch(props.url, res)
        if (! res.err) {
            try {
                await props.success?.(res.data!)
            }
            catch (err) {
                res.err = err
            }
        }
    }
    loading.value = false
}
defineExpose({ load })

onMounted(load)
</script>

<template>
    <p v-if="loading"><Loading /></p>
    <div v-else-if="res.err" style="color: red">
        {{ res.err }}
    </div>
    <slot v-else :data="res.data"></slot>
</template>