<script setup lang="ts">
import type { Index } from '../stores/log'

import dayjs from 'dayjs'

defineProps<{
    log: Index[number]
    filterTags?: string[]
}>()

defineEmits<{
    (event: 'tag-click', tag: string): void
}>()
</script>

<template>
    <div class="index-item">
        <RouterLink :to="`/log/${log.id}`">{{ log.name }}</RouterLink>
        <div class="index-item-detail">
            <span>
                <small class="index-item-time">{{ dayjs(log.time).format('YYYY-MM-DD HH:MM') }}</small>
                <small class="index-item-tags">
                    <template v-if="log.tags?.length">
                        <span
                            v-for="tag of log.tags"
                            @click="$emit('tag-click', tag)"
                            class="tag"
                            :class="{
                                filtered: filterTags ? filterTags.includes(tag): false 
                            }"
                        >{{ tag }}</span>
                    </template>
                    <span v-else>None</span>
                </small>
            </span>
            <small class="index-item-id">{{ log.id }}</small>
        </div>
    </div>
</template>

<style scoped>
.index-item {
    padding: .5em;

    transition: .2s background-color;
}
.index-item:hover {
    background-color: #eee;
}

.index-item-detail {
    display: flex;
    justify-content: space-between;
}

.index-item-tags {
    margin: 0 .2em;
}

.index-item-id {
    max-width: 15em;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>