import { defineStore } from 'pinia' 

export type Schema = {
    type: 'boolean'
} | {
    type: 'number'
    min?: number
    max?: number
} | {
    type: 'union'
    options: readonly string[]
}

export type Schemas = Record<string, Schema>

export type SchemaToValue<S extends Schema>
    = S extends { type: 'boolean' } ? boolean
    : S extends { type: 'union' }   ? S['options'][number]
    : S extends { type: 'number' }  ? number
    : never

export type SchemasToValues<SS extends Schemas> = {
    [K in keyof SS]: SchemaToValue<SS[K]>
}

export const settingsSchemas = {
    scrollBehavior: {
        type: 'union',
        options: [ 'smooth', 'auto' ]
    },
    sidebarMode: {
        type: 'union',
        options: [ 'manual', 'auto' ]
    }
} as const

export const defaultSettings: SettingsValues = {
    scrollBehavior: 'smooth',
    sidebarMode: 'auto'
}

export type SettingsSchemas = typeof settingsSchemas
export type SettingsValues = SchemasToValues<SettingsSchemas>

export const useSettings = defineStore('settings', {
    state: (): SettingsValues => {
        const currentSettingsJSON = localStorage.getItem('icelavaSettings')
        const currentSettings = currentSettingsJSON ? JSON.parse(currentSettingsJSON) : {}
        return {
            ...defaultSettings,
            ...currentSettings
        }
    },
    actions: {
        updateSettings() {
            localStorage.setItem('icelavaSettings', JSON.stringify(this.$state))
        }
    }
})
