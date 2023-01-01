import katex from 'katex'
import 'katex/contrib/mhchem'
import 'katex/contrib/copy-tex'
import 'katex/dist/katex.min.css'

type MathBlockToken = {
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
    tokenizer(src: string): MathBlockToken | void {
        const match = src.match(/^\${2}([^\$]+?)\${2}/)
        return match ? {
            type: 'math-block',
            raw: match[0],
            formula: match[1]
        } : undefined
    },
    renderer(token: MathBlockToken) {
        return tryKatex(token.formula, { displayMode: true, strict: false })
    }
}

type MathInlineToken = {
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
    tokenizer(src: string): MathInlineToken | void {
        const match = src.match(/^\$([^\$\n]+?)\$/)
        return match ? {
            type: 'math-inline',
            raw: match[0],
            formula: match[1]
        } : undefined
    },
    renderer(token: MathInlineToken) {
        return tryKatex(token.formula, { strict: false })
    }
}

export default {
    extensions: [ mathBlockExt, mathInlineExt ]
}
