import emoji from 'node-emoji'

type EmojiToken = {
    type: 'emoji',
    raw: string,
    name: string
}

export const emojiExt = {
    name: 'emoji',
    level: 'inline' as const,
    start(src: string) {
        return src.match(/:[a-z\d+\-_]+:/)?.index ?? -1
    },
    tokenizer(src: string): EmojiToken | void {
        const match = src.match(/^:([a-z\d+\-_]+):/)
        return match ? {
            type: 'emoji',
            raw: match[0],
            name: match[1]
        } : undefined
    },
    renderer(token: EmojiToken) {
        return emoji.emojify(token.raw)
    }
}

export default {
    extensions: [ emojiExt ]
}