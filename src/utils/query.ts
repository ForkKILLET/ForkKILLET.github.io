// TODO: Use VueRouter

declare global {
    const query: Record<string, string>
    interface Window {
        query: Record<string, string>
    }
}

const update = (tar: URLSearchParams) => location.hash = '#' + tar
window.query = new Proxy(
    new URLSearchParams(location.hash.slice(1)), {
        get: (tar, k: string) => tar.get(k),
        set: (tar, k: string, v) => {
            tar.set(k, v)
            update(tar)
            return true
        },
        deleteProperty: (tar, k: string) => {
            const has = tar.has(k)
            if (has) {
                tar.delete(k)
                update(tar)
            }
            return has
        },
        has: (tar, k: string) => {
            return tar.has(k)
        }
    }
) as unknown as Record<string, string>

export {}