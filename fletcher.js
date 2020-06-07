// Zone: Basic wheels
class FileLoc {
    constructor(loc) {
        [, this.name, this.type] = loc.match(/([^\\/.]+)([^\\/]+)/);
    }
}
class FetchInfo {
    constructor(type, path, ...params) {
        this.type = type;
        this.path = path;
        this.params = params;
    }
    get arrowName() {
        if (this.type !== "Arrow")
            return null;
        return this.params[0] == null ? new FileLoc(this.path).name : this.params[0];
    }
}
class FetchRes {
    constructor(info) {
        this.info = info;
        this.state = "WAIT";
    }
    get state() { return this.state_; }
    set state(state) {
        if (state !== "WAIT") {
            if (this.target == null)
                throw "[Fletcher] Fetching target element not found when changing state.";
            this.target.dispatchEvent(new CustomEvent("arrowArrive", {
                detail: { state: state }
            }));
        }
        this.state_ = state;
    }
}
class Fletcher {
    constructor(config) {
        this.config = config;
        this.fetchQueue = [];
        console.log("[Fletcher] inited.");
        let info;
        for (let f of config.fletchList) {
            info = Array.isArray(f) ? new FetchInfo(f[0], f[1], f[2]) : f;
            this.fetch(info, res => this.fletch(res));
        }
        if (config.debugMode)
            this.test();
    }
    static init(config) {
        delete this.init;
        return Fletcher.instance = new Fletcher(config);
    }
    test() {
        this.fetch(new FetchInfo("Arrow", "qwq.js"), (res) => this.fletch(res));
        this.fetch(new FetchInfo("Arrow", "jquery-3.5.1.js", "jQuery"), (res) => this.fletch(res));
    }
    selectArrowInQueue(arrowName) {
        for (let res of this.fetchQueue)
            if (res.info.type === "Arrow" && res.info.arrowName === arrowName)
                return res;
        return null;
    }
    selectAPI(arrowName) {
        let res = this.selectArrowInQueue(arrowName);
        if (res == null)
            throw `[Fletcher] Fletching API of ${arrowName} not found.`;
        return {
            stash(names, entrance) {
                if (!Array.isArray(names))
                    names = [names];
                entrance._alias = names;
                res.entrance = entrance;
                return this;
            },
            finish() {
                res.state = "SUCCEED";
                return this;
            },
            except(exception) {
                res.state = "FAIL";
                throw `[Arrow: ${arrowName}] ${exception}`;
            }
        };
    }
    fetch(info, callback = null) {
        let res = new FetchRes(info);
        res.id = this.fetchQueue.length;
        this.fetchQueue.push(res);
        let scriptNode = document.createElement("script");
        scriptNode.type = "application/javascript";
        switch (info.type) {
            case "Arrow":
                let name = info.arrowName;
                res.target = scriptNode;
                if (name[0] === "_")
                    throw `[Fletcher] Illegal arrow name "${name} starting with "_".`;
                scriptNode.src = info.path;
                document.head.appendChild(scriptNode);
                let lis = (evt) => {
                    switch (evt.detail.state) {
                        case "SUCCEED":
                            if (typeof callback === "function")
                                callback(res);
                            scriptNode.removeEventListener("arrowArrive", lis);
                            break;
                        case "CANCEL":
                        case "FAIL":
                        case "TIMEOUT":
                            scriptNode.removeEventListener("arrowArrive", lis);
                            break;
                    }
                };
                scriptNode.addEventListener("arrowArrive", lis);
                break;
            default:
                throw `[Fletcher]: Unknown type ${info.type}`;
        }
        return res;
    }
    fletch(res) {
        if (res.entrance) {
            let arrow = res.entrance;
            if (arrow == null)
                return false;
            for (let a of res.entrance._alias)
                _[a] = arrow;
            if (typeof arrow._init === "function") {
                arrow._init();
                console.log(`[Arrow: ${res.info.arrowName}] inited.`);
            }
            return true;
        }
    }
}
const _ = {
    fletcher: Fletcher.init({
        fletchList: [
            ["Arrow", "jquery-3.5.1.js", "jQuery"]
        ],
        debugMode: false
    })
};
//# sourceMappingURL=fletcher.js.map