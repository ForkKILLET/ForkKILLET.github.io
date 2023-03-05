import { defineStore } from 'pinia' 

export type Index = {
    id: string
    name: string
    time: Date
}[]

export const useLogStore = defineStore('log', {
    state: () => ({
        index: undefined as Index | undefined
    })
})