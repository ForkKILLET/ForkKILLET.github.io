import { defineStore } from 'pinia' 
import yaml from 'js-yaml'

export type Index = {
    id: string
    name: string
    time: Date
    tags: string[]
}[]

export const useLogStore = defineStore('log', {
    state: () => ({
        index: undefined as Index | undefined
    }),
    actions: {
        async fetchIndex(): Promise<Index> {
            if (! this.index) {
                const text = await (await fetch('/FkLog/@meta/index.yml')).text()
                this.index = yaml.load(text) as Index
            }
            return this.index
        }
    }
})