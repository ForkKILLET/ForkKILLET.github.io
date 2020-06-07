// Zone: Basic wheels

class FileLoc {
    name: string
    type: string
    constructor(loc: string) {
        [, this.name, this.type] = loc.match(/([^\\/.]+)([^\\/]+)/)
    }
}

// Zone: Fletch ready

interface ArrowSet {
    [index: string]: ArrowEntrance
}

interface ArrowEntrance {
    _alias?: string[]
    _init?: () => void
}

class FetchInfo {
    params: string[]
    constructor(public type: string, public path: string, ...params: string[]) {
        this.params = params
    }

    get arrowName(): string {
        if (this.type !== "Arrow") return null
        return this.params[0] == null ? new FileLoc(this.path).name : this.params[0]
    }
}

type FetchState = "WAIT" | "SUCCEED" | "FAIL" | "TIMEOUT" | "CANCEL"
class FetchRes {
    id: number
    target: HTMLElement

    private state_: FetchState
    get state(): FetchState { return this.state_ }
    set state(state: FetchState) {
        if (state !== "WAIT") {
            if (this.target == null) throw "[Fletcher] Fetching target element not found when changing state."
            this.target.dispatchEvent(new CustomEvent("arrowArrive", {
                detail: {state: state}
            }))
        }
        this.state_ = state
    }

    entrance: ArrowEntrance

    constructor(public info: FetchInfo) {
        this.state = "WAIT"
    }
}

interface FetchCallback { (res: FetchRes): void }

interface FletchAPI {
    stash: (names: string | string[], entrance: ArrowEntrance) => FletchAPI
    finish: () => FletchAPI
    except: (exception: string) => never
}

interface FletchConfig {
    fletchList: FetchInfo[] | string[][]
    debugMode?: boolean
}

class Fletcher {
    static instance: Fletcher
    static init(config: FletchConfig): Fletcher {
        delete this.init
        return Fletcher.instance = new Fletcher(config)
    }
    private constructor(public config: FletchConfig) {
        this.fetchQueue = []
        console.log("[Fletcher] inited.")

        let info: FetchInfo
        for (let f of config.fletchList) {
            info = Array.isArray(f) ? new FetchInfo(f[0], f[1], f[2]) : f
            this.fetch(info, res => this.fletch(res))
        }

        if (config.debugMode) this.test()
    }

    private test() {
        this.fetch(new FetchInfo("Arrow", "qwq.js"), (res: FetchRes) => this.fletch(res))
        this.fetch(new FetchInfo("Arrow", "jquery-3.5.1.js", "jQuery"), (res: FetchRes) => this.fletch(res))
    }

    public fetchQueue: FetchRes[]
    selectArrowInQueue(arrowName: string): FetchRes {
        for (let res of this.fetchQueue)
            if (res.info.type === "Arrow" && res.info.arrowName === arrowName) return res
        return null
    }
    selectAPI(arrowName: string): FletchAPI {
        let res = this.selectArrowInQueue(arrowName)
        if (res == null) throw `[Fletcher] Fletching API of ${arrowName} not found.`
        return {
            stash(names: string | string[], entrance: ArrowEntrance): FletchAPI {
                if (!Array.isArray(names)) names = [names]
                entrance._alias = names
                res.entrance = entrance
                return this
            },
            finish(): FletchAPI {
                res.state = "SUCCEED"
                return this
            },
            except(exception: string): never {
                res.state = "FAIL"
                throw `[Arrow: ${arrowName}] ${exception}`
            }
        }
    }

    fetch(info: FetchInfo, callback: FetchCallback = null): FetchRes {
        let res = new FetchRes(info)
        res.id = this.fetchQueue.length
        this.fetchQueue.push(res)

        let scriptNode: HTMLElementTagNameMap["script"] = document.createElement("script")
        scriptNode.type = "application/javascript"
        switch (info.type) {
            case "Arrow":
                let name = info.arrowName
                res.target = scriptNode
                if (name[0] === "_") throw `[Fletcher] Illegal arrow name "${name} starting with "_".`
                scriptNode.src = info.path
                document.head.appendChild(scriptNode)
                let lis = (evt: CustomEvent) => {
                    switch (evt.detail.state as FetchState) {
                        case "SUCCEED":
                            if (typeof callback === "function") callback(res)
                            scriptNode.removeEventListener("arrowArrive", lis)
                            break
                        case "CANCEL":
                        case "FAIL":
                        case "TIMEOUT":
                            scriptNode.removeEventListener("arrowArrive", lis)
                            break
                    }
                }
                scriptNode.addEventListener("arrowArrive", lis)
                break
            default:
                throw `[Fletcher]: Unknown type ${info.type}`
        }
        return res
    }
    fletch(res: FetchRes): boolean {
        if (res.entrance) {
            let arrow: any = res.entrance
            if (arrow == null) return false
            for (let a of res.entrance._alias) _[a] = arrow
            if (typeof arrow._init === "function") {
                arrow._init()
                console.log(`[Arrow: ${res.info.arrowName}] inited.`)
            }
            return true
        }
    }
}

const
    _: ArrowSet = {
        fletcher: Fletcher.init({
            fletchList: [
                ["Arrow", "jquery-3.5.1.js", "jQuery"]
            ],
            debugMode: false
        }) as ArrowEntrance
    }