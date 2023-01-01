type CuipingToken = {
    type: 'cuiping',
    raw: string,
    molecule: string
}

export const cuipingExt = {
    name: 'cuiping',
    level: 'inline' as const,
    start(src: string) {
        return src.match(/%%.+?%%/)?.index ?? -1
    },
    tokenizer(src: string): CuipingToken | void {
        const match = src.match(/^%%(.+?)%%/)
        return match ? {
            type: 'cuiping',
            raw: match[0],
            molecule: match[1]
        } : undefined
    },
    renderer(token: CuipingToken) {
        const div = document.createElement('div')
        div.className = "cuiping"
        div.dataset.molecule = token.molecule
        return div.outerHTML
    }
}

export default {
    extensions: [ cuipingExt ]
}