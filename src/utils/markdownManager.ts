import { marked } from 'marked'
import Prism from 'prismjs'

import markedEmoji from './markedEmojiExt'
import markedCuiping from './markedCuipingExt'

Prism.manual = true

marked.use(markedCuiping, markedEmoji)

let katexLoaded = false
export const loadKatexExt = async () => {
    if (! katexLoaded) {
        const markedKatex = await import('./markedKatexExt')
        katexLoaded = true
        marked.use(markedKatex.default)
    }
}

export const markedOption = {
    baseUrl: './FkLog/',
    highlight: (code: string, lang: string) => (
        Prism.highlight(code, Prism.languages[lang], lang)
            .split('\n')
            .map((ln, i, lines, n = lines.length.toString().length) =>
                `<span class="line-number">${
                    ' '.repeat(n - (i + 1).toString().length)
                }${i + 1}. </span>${ln}`
            )
            .join('\n')
    )
}

export {
    Prism,
    marked
}