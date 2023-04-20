<script setup lang="ts">
import Loading from './Loading.vue'
import useFetch, { FetchRes } from '@util/useFetch'
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
    <slot v-if="loading" name="load">
        <Loading />
    </slot>
    <slot v-else-if="res.err" name="error" :error="res.err">
        <span style="color: red">{{ res.err }}</span>
    </slot>
    <slot v-else :data="res.data"></slot>
</template>
