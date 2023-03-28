import type { marked } from 'marked'

type AnchorToken = {
    type: 'anchor'
    raw: string
    content: string
    id: string
}

export const anchorExt = {
    name: 'anchor',
    level: 'inline' as const,
    start(src: string) {
        return src.match(/#\[.+?\]\(.+?\)/)?.index ?? -1
    },
    tokenizer(src: string): AnchorToken | void {
        const match = src.match(/^#\[(.+?)\]\((.+?)\)/)
        return match ? {
            type: 'anchor',
            raw: match[0],
            content: match[1],
            id: match[2]
        } : undefined
    },
    renderer(token: AnchorToken) {
        return `<span class="anchor" id="${token.id}">${token.content}</span>`
    }
}

export default {
    extensions: [ anchorExt ]
} as marked.MarkedExtension
