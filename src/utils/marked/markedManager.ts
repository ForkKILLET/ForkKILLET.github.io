import { marked } from 'marked'
import Prism from 'prismjs'

import markedEmoji from './markedEmojiExt'
import markedCuiping from './markedCuipingExt'
import markedKatex from './markedKatexExt'
import type { Options as MarkedKateXOptions } from './markedKatexExt'
import markedAnchor from './markedAnchorExt'

Prism.manual = true

export const loadMarked = (options: MarkedKateXOptions) => {
    marked.use(markedCuiping, markedEmoji, markedAnchor, markedKatex(options))
}

export const markedOption = {
    baseUrl: './FkLog/',
    highlight: (code: string, lang: string) => {
        lang ||= 'plain'
        return Prism.highlight(code, Prism.languages[lang], lang)
            .split('\n')
            .map((ln, i, lines, n = lines.length.toString().length) =>
                `<span class="prism-line-number">${
                    ' '.repeat(n - (i + 1).toString().length)
                }${i + 1}. </span>${ln}`
            )
            .join('\n')
    }
}

export {
    Prism,
    marked
}
