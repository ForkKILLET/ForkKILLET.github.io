import { reactive, Ref } from 'vue'
import { router } from '@/routes'

export type KeyboardOp = {
    key: string
    ctrl?: true
    action: (event: KeyboardEvent) => void
    enabled?: () => boolean
}

export const keyboardOps: Record<string, KeyboardOp> = reactive({})

export const keyboardManager = {
    register: (name: string, op: KeyboardOp): boolean => {
        if (keyboardOps[name]) return false
        keyboardOps[name] = op
        return true
    },
    dispose: (name: string): boolean => {
        return delete keyboardOps[name]
    }
}

window.addEventListener('keydown', (event) => {
    if ((event.target as HTMLElement)?.tagName === 'INPUT') return
    for (const name in keyboardOps) {
        const op = keyboardOps[name]
        if (op.enabled?.() === false) continue
        if (op.key === event.key && (! op.ctrl || event.ctrlKey)) op.action(event)
    }
})

keyboardManager.register('focusMain', {
    key: 'm',
    action: () => {
        document.querySelector('main')?.focus()
    }
})
keyboardManager.register('openGitHub', {
    key: 'G',
    action: () => {
        window.open('https://github.com/ForkKILLET/ForkKILLET.github.io/')
    }
})

keyboardManager.register('gotoSettings', {
    key: ',',
    ctrl: true,
    action: () => {
        router.push('/settings')
    }
})