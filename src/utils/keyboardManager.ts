import { reactive } from 'vue'

export type KeyboardOp = {
    key: string
    description: string
    action: (event: KeyboardEvent) => void
}

export const keyboardOps: Record<string, KeyboardOp> = reactive({})

export const keyboardManager = {
    register: (name: string, op: KeyboardOp): boolean => {
        if (keyboardOps[name]) return false
        keyboardOps[name] = op
        window.addEventListener('keypress', op.action)
        return true
    },
    dispose: (name: string): boolean => {
        if (keyboardOps[name]) {
            window.removeEventListener('keypress', keyboardOps[name].action)
            delete keyboardOps[name]
            return true
        }
        return false
    }
}

keyboardManager.register('focusIceLava', {
    key: 'i',
    description: 'Focus icelava logo',
    action: event => {
        if (event.key === 'i')
            (document.querySelector('.logo-container') as HTMLLinkElement | undefined)?.focus()
    }
})
keyboardManager.register('focusMain', {
    key: 'm',
    description: 'Focus main',
    action: event => {
        if (event.key === 'm')
            document.querySelector('main')?.focus()
    }
})
keyboardManager.register('openGitHub', {
    key: 'G',
    description: 'Open GitHub',
    action: event => {
        if (event.key === 'G')
            window.open('https://github.com/ForkKILLET/ForkKILLET.github.io/')
    }
})