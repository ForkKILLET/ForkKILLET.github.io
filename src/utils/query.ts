// TODO: Use VueRouter

declare global {
    const query: Record<string, string>
    interface Window {
        query: Record<string, string>
    }
}

const write = (tar: URLSearchParams) => {
    location.hash = '#' + tar
    console.log('#' + tar)
}

const read = () => new URLSearchParams(location.hash.slice(1))

window.query = new Proxy({}, {
    get: (_, k: string) => read().get(k),
    set: (_, k: string, v) => {
        const q = read()
        q.set(k, v)
        write(q)
        return true
    },
    deleteProperty: (_, k: string) => {
        const q = read()
        if (q.has(k)) {
            q.delete(k)
            write(q)
        }
        return true
    },
    has: (_, k: string) => {
        return read().has(k)
    }
}) as unknown as Record<string, string>

export {}