import { defineStore } from 'pinia' 

export type Index = {
    id: string
    name: string
    time: Date
    tags: string[]
}[]

export const useLogStore = defineStore('log', {
    state: () => ({
        index: undefined as Index | undefined
    })
})