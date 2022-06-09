<script setup lang="ts">
import Loading from './Loading.vue'
import useFetch, { FetchRes } from '../utils/useFetch'
import { onMounted, reactive, ref, Ref } from 'vue'

const props = defineProps<{
    url: string,
    success?: (data: string) => void | Promise<void>
}>()

const loading: Ref<boolean> = ref(true)

const res = reactive<FetchRes>({})

onMounted(async () => {
    await useFetch(props.url, res)
    if (! res.err) {
        try {
            await props.success?.(res.data!)
        }
        catch (err) {
            res.err = err
        }
    }
    loading.value = false
})

</script>

<template>
    <Loading v-if="loading"></Loading>
    <div v-else-if="res.err" style="color: red">
        {{ res.err }}
    </div>
    <slot v-else :data="res.data"></slot>
</template>