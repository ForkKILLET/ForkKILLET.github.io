import type { Ref } from 'vue'
import { watch, ref, reactive } from 'vue'

export const storageRef = <T>(name: string, def: T) => {
    name = 'icelava' + name.replace(/^[a-z]/, s => s.toUpperCase())

    let r: Ref<T>

    const saved = localStorage.getItem(name)
    if (saved) r = ref(JSON.parse(saved))
    else r = ref(def) as Ref<T>

    watch(r, () => {
        localStorage.setItem(name, JSON.stringify(r.value))
    }, { immediate: true })

    return r
}

export const storageReactive = <T extends object>(name: string, def: T) => {
    let r: T

    name = 'cuiping' + name.replace(/^[a-z]/, s => s.toUpperCase())

    const saved = localStorage.getItem(name)
    if (saved) r = reactive(JSON.parse(saved))
    else r = reactive(def) as T

    watch(r, () => {
        localStorage.setItem(name, JSON.stringify(r))
    }, { immediate: true })

    return r
}

