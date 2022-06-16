import katex from 'katex'
import 'katex/contrib/mhchem'
import 'katex/dist/katex.min.css'

type mathBlockToken = {
    type: 'math-block',
    raw: string,
    formula: string
}

const tryKatex = (formula: string, options?: any) => {
    try {
        return `<span>${
            katex.renderToString(formula, options)
        }</span>`
    }
    catch {
        return `<span class="katex-error">${formula}</span>`
    }
}

export const mathBlockExt = {
    name: 'math-block',
    level: 'block' as const,
    start(src: string) {
        return src.match(/\${2}(?!\$)/)?.index ?? -1
    },
    tokenizer(src: string) {
        const match = src.match(/^\${2}([^\$]+?)\${2}/)
        return match ? {
            type: 'math-block',
            raw: match[0],
            formula: match[1]
        } : undefined
    },
    renderer(token: mathBlockToken) {
        return tryKatex(token.formula, { displayMode: true })
    }
}

type mathInlineToken = {
    type: 'math-inline',
    raw: string,
    formula: string
}

export const mathInlineExt = {
    name: 'math-inline',
    level: 'inline' as const,
    start(src: string) {
        return src.match(/\$(?!\$)/)?.index ?? -1
    },
    tokenizer(src: string) {
        const match = src.match(/^\$([^\$\n]+?)\$/)
        return match ? {
            type: 'math-inline',
            raw: match[0],
            formula: match[1]
        } : undefined
    },
    renderer(token: mathInlineToken) {
        return tryKatex(token.formula)
    }
}

export default {
    extensions: [ mathBlockExt, mathInlineExt ]
}