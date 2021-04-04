var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Mix, Log } from "./mixins";
import { openUrl } from "./utils";
import { Icon } from "./icon";
import { Wlog } from "./wlog";
class Node extends Mix(Log("node", "forestgreen")) {
    constructor(parent) {
        var _a;
        super();
        this.parent = parent;
        this.qRenderCb = [];
        this.children = [];
        if (this.parent)
            this.parent.children.push(this);
        this.layer = ((_a = parent === null || parent === void 0 ? void 0 : parent.layer) !== null && _a !== void 0 ? _a : -1) + 1;
    }
    q(cb) {
        this.qRenderCb.push(cb);
        return this;
    }
    render() {
        var _a, _b;
        if (this.parent && !this.parent.e)
            this.err("Rendering without parent rendered.");
        this.e = document.createElement("div");
        this.e.classList.add("node");
        this.eContent = document.createElement("div");
        this.eContent.classList.add("node-content");
        this.e.appendChild(this.eContent);
        this.eChildren = document.createElement("div");
        this.eChildren.classList.add("node-children");
        this.e.appendChild(this.eChildren);
        this.e.style.backgroundColor = Node.layerColor[this.layer];
        this.qRenderCb.forEach(cb => cb({
            e: this.e, c: this.eContent
        }));
        ((_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.eChildren) !== null && _b !== void 0 ? _b : document.body).appendChild(this.e);
        this.log(`Rendering node at layer ${this.layer}. content:`, this.eContent.innerText);
        this.children.forEach(n => n.render());
    }
    title(t) {
        return this.q(({ c }) => {
            const eTitle = document.createElement("div");
            eTitle.classList.add("node-content-text");
            eTitle.innerText = t;
            c.appendChild(eTitle);
        });
    }
    link(url) {
        return this.class("link").q(({ e }) => e.addEventListener("click", () => openUrl(url)));
    }
    class(className) {
        return this.q(({ e }) => e.classList.add(className));
    }
    icon(icon) {
        return __awaiter(this, void 0, void 0, function* () {
            const nIcon = yield Icon.fromData(icon);
            return this.q(({ c }) => {
                const eIcon = document.createElement("canvas");
                eIcon.classList.add("node-content-icon");
                c.appendChild(eIcon);
                nIcon.paint(eIcon);
            });
        });
    }
    wlog(wlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const nWlog = yield Wlog.fromData(wlog);
            return this.q(({ c }) => {
                const eWlog = document.createElement("div");
                eWlog.innerHTML = nWlog.parse();
                eWlog.classList.add("node-content-wlog");
                c.appendChild(eWlog);
            });
        });
    }
}
Node.layerColor = ["white", "white", "aliceblue", "cornflowerblue", "lightgrey"];
const $ = (parent) => new Node(parent);
const $top = $(null).class("top");
export { $top, $ };
//# sourceMappingURL=node.js.map