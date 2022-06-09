export type FetchRes = {
    err?: any,
    data?: string
}

export default async (url: string, res: FetchRes) => {
    try {
        const resp = await fetch(url)
        if (! resp.ok) {
            res.err = `${resp.status} ${resp.statusText}`
            return
        }
        res.data = await resp.text()
    }
    catch (err) {
        res.err = err
    }
}