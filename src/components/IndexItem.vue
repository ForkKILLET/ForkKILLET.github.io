<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Index, getLogUpdateStateNames } from '@store/log'

import dayjs from 'dayjs'

const { t } = useI18n()

const props = defineProps<{
    log: Index[number]
    filterTags?: string[]
    updateState?: number
}>()

const updateStatesNames = computed(() => props.updateState
    ? getLogUpdateStateNames(props.updateState)
    : []
)

defineEmits<{
    (event: 'tag-click', tag: string): void
}>()
</script>

<template>
    <div class="index-item">
        <RouterLink :to="`/log/${log.id}`">{{ log.name }}</RouterLink>
        <small class="index-item-states">
            <span
                v-for="stateName of updateStatesNames"
                class="index-item-state"
                :data-state="stateName"
            >{{ t('msg.update-state.' + stateName) }}</span>
        </small>
        <div class="index-item-detail">
            <span>
                <small class="index-item-time">{{ dayjs(log.time).format('YYYY-MM-DD HH:MM') }}</small>
                <small class="index-item-tags">
                    <template v-if="log.tags?.length">
                        <span
                            v-for="tag of log.tags"
                            @click="$emit('tag-click', tag)"
                            class="log-tag index-item-tag"
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

.index-item-states {
    margin: 0 .5em;
}
.index-item-state {
    padding: 0 .2em;
    margin: 0 .2em;

    color: white;
}
.index-item-state[data-state=unread] {
    background: #39C5BB;
}
.index-item-state[data-state=updated] {
    background: orange;
}
.index-item-state[data-state=recent] {
    background: #FF5B5A;
}

.index-item-id {
    max-width: 15em;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
