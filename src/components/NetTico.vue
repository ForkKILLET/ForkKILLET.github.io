<script setup lang="ts">
import Fetch from './Fetch.vue'
import Tico from './Tico.vue'

defineProps<{
    name: string
}>()
</script>

<template>
    <div>
        <Fetch
            :url="`/FkLog/@icon/${name}.tico`"
            #default="{ data }"
        >
            <Tico :file="data!" />
        </Fetch>
    </div>
</template>
