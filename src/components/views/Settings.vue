<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettings, settingsSchemas, SettingsValues } from '@/stores/settings'

import vClickEnter from '@dir/clickenter'

const { t } = useI18n()
const settings = useSettings()

const setItem = <T extends keyof SettingsValues>(name: T, value: SettingsValues[T]) => {
    // @ts-ignore
    settings[name] = value
    settings.updateSettings()
}
</script>

<template>
    <div class="settings">
        <div class="setting-item" v-for="schema, name in settingsSchemas">
            <b class="setting-name">{{ t('settings.names.' + name) }}</b>
            <div class="setting-options" v-if="schema.type === 'union'">
                <span v-for="option, i of schema.options" class="setting-option">
                    {{ i ? ' · ' : '' }}
                    <span
                        :class="{
                            'setting-option-button': true,
                            active: settings[name] === option
                        }"
                        v-click-enter="() => setItem(name, option)"
                    >{{ t('settings.options.' + option) }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.setting-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: .5em;
}

.setting-option-button {
    display: inline-block;
    transition: .3s color;
}

.setting-option-button:hover {
    cursor: pointer;
}
.setting-option-button:hover, .setting-option-button:focus {
    color: #39C5BB;
    animation: .3s hop;
}

.setting-option-button.active {
    color: #39C5BB;
    text-decoration: underline;
}
</style>