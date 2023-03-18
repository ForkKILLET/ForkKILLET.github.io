import { marked } from 'marked'
import Prism from 'prismjs'

import markedEmoji from './markedEmojiExt'
import markedCuiping from './markedCuipingExt'
import markedKatex from './markedKatexExt'

import type { NotiManager } from '../components/views/Notifications.vue'

Prism.manual = true

export const loadMarked = (options: { notiManager: NotiManager }) => {
    marked.use(markedCuiping, markedEmoji, markedKatex(options))
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
