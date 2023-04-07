import { reactive } from 'vue'

export type KeyboardOp = {
    key: string
    action: (event: KeyboardEvent) => void
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

window.addEventListener('keypress', (event) => {
    if ((event.target as HTMLElement)?.tagName === 'INPUT') return
    for (const name in keyboardOps) {
        const op = keyboardOps[name]
        if (op.key === event.key) op.action(event)
    }
})

keyboardManager.register('focusIceLava', {
    key: 'i',
    action: () => {
        (document.querySelector('.logo-container') as HTMLLinkElement | undefined)?.focus()
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