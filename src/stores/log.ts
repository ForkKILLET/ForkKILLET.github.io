import { defineStore } from 'pinia' 
import yaml from 'js-yaml'

export type Index = {
    id: string
    name: string
    time: Date
    tags: string[]
    lastRead?: Date
}[]

export const LogUpdateStateNames = [ 'Unread', 'Updated', 'Recent' ]
export const LogUpdateStates = Object.fromEntries(
    LogUpdateStateNames.map((name, i) => [ name, 1 << i ])
)

export const getLogUpdateStateNames = (states: number) => LogUpdateStateNames
    .filter((_, i) => states & (1 << i))

export const useLogStore = defineStore('log', {
    state: () => {
        const lastIndexJSON = localStorage.getItem('icelavaLastIndex')
        const getLastIndex = () => lastIndexJSON ? JSON.parse(lastIndexJSON) as Index : undefined
        return {
            index: undefined as Index | undefined,
            lastIndex: getLastIndex(),
            origLastIndex: getLastIndex()
        }
    },
    actions: {
        async fetchIndex(): Promise<Index> {
            if (! this.index) {
                const text = await (await fetch('/FkLog/@meta/index.yml')).text()
                this.index = (yaml.load(text) as Index).map(log => ({
                    ...log,
                    lastRead: this.lastIndex?.find(i => i.id === log.id)?.lastRead
                }))
                this.updateLastIndex()
            }
            return this.index
        },
        updateLastIndex() {
            localStorage.setItem('icelavaLastIndex', JSON.stringify(this.index))
        },
        async getLogById(id: string) {
            if (! this.index) await this.fetchIndex()
            return this.index?.find(i => i.id === id)
        },
        async getLogUpdateState(log: Index[number]): Promise<number> {
            let state = 0
            if (! this.lastIndex) return LogUpdateStates.Unread

			const origLastLog = this.origLastIndex?.find(i => i.id === log.id)
            if (! origLastLog) state |= LogUpdateStates.Recent

            const lastLog = (await this.getLogById(log.id))!
            if (! lastLog.lastRead) state |= LogUpdateStates.Unread
            if (new Date(lastLog.lastRead ?? origLastLog?.time ?? log.time) < new Date(log.time)) state |= LogUpdateStates.Updated

            return state
        }
    }
})
