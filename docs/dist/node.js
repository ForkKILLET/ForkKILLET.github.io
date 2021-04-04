import { Mix, Log } from "./mixins.js";
import { openUrl } from "./utils.js";
import { Icon } from "./icon.js";
import { Wlog } from "./wlog.js";
class Node extends Mix(Log("node", "forestgreen")) {
    constructor(parent) {
        super();
        this.parent = parent;
        this.qRenderCb = [];
        this.children = [];
        if (this.parent)
            this.parent.children.push(this);
        this.layer = (parent?.layer ?? -1) + 1;
    }
    q(cb) {
        this.qRenderCb.push(cb);
        return this;
    }
    render() {
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
        (this.parent?.eChildren ?? document.body).appendChild(this.e);
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
    async icon(icon) {
        const nIcon = await Icon.fromData(icon);
        return this.q(({ c }) => {
            const eIcon = document.createElement("canvas");
            eIcon.classList.add("node-content-icon");
            c.appendChild(eIcon);
            nIcon.paint(eIcon);
        });
    }
    async wlog(wlog) {
        const nWlog = await Wlog.fromData(wlog);
        return this.q(({ c }) => {
            const eWlog = document.createElement("div");
            eWlog.innerHTML = nWlog.parse();
            eWlog.classList.add("node-content-wlog");
            c.appendChild(eWlog);
        });
    }
}
Node.layerColor = ["white", "white", "aliceblue", "cornflowerblue", "lightgrey"];
const $ = (parent) => new Node(parent);
const $top = $(null).class("top");
export { $top, $ };
//# sourceMappingURL=node.js.map