import type { marked } from 'marked'
import type { NotiManager } from '@comp/views/Notifications.vue'

type katexWrapper = typeof import('./katexWrapper')
let katexWrapper: Promise<katexWrapper>

type MathBlockToken = {
    type: 'math-block'
    raw: string
    formula: string
    html: string
}

const tryKatex = (katex: katexWrapper['katex'], formula: string, options?: any) => {
    if (! katex) {
    }
    try {
        return `<span>${
            katex.renderToString(formula, options)
        }</span>`
    }
    catch (err) {
        console.error('KaTeX error: %o', err)
        return `<span class="katex-error">${formula}</span>`
    }
}

export const mathBlockExt = {
    name: 'math-block',
    level: 'block' as const,
    start(src: string) {
        return src.match(/\${2}(?!\$)/)?.index ?? -1
    },
    tokenizer(src: string): MathBlockToken | void {
        const match = src.match(/^\${2}([^\$]+?)\${2}/)
        return match ? {
            type: 'math-block',
            raw: match[0],
            formula: match[1],
            html: ''
        } : undefined
    },
    renderer(token: MathBlockToken) {
        return token.html
    }
}

type MathInlineToken = {
    type: 'math-inline'
    raw: string
    formula: string
    html: string
}

export const mathInlineExt = {
    name: 'math-inline',
    level: 'inline' as const,
    start(src: string) {
        return src.match(/\$(?!\$)/)?.index ?? -1
    },
    tokenizer(src: string): MathInlineToken | void {
        const match = src.match(/^\$([^\$\n]+?)\$/)
        return match ? {
            type: 'math-inline',
            raw: match[0],
            formula: match[1],
            html: ''
        } : undefined
    },
    renderer(token: MathInlineToken) {
        return token.html
    }
}

export type Options = {
    onBeforeLoad?: () => void
    onAfterLoad?: () => void
}

export default (options: Options): marked.MarkedExtension => ({
    extensions: [ mathBlockExt, mathInlineExt ],
    async: true,
    walkTokens: (token: marked.Token | MathBlockToken | MathInlineToken) => {
        if (token.type === 'math-block' || token.type === 'math-inline') {
            if (! katexWrapper) {
                options.onBeforeLoad?.()
                katexWrapper = import('./katexWrapper')
            }
            return katexWrapper.then(({ katex }) => {
                options.onAfterLoad?.()
                token.html = tryKatex(katex, token.formula, {
                    strict: false,
                    displayMode: token.type === 'math-block'
                })
            })
        }
    }
})
