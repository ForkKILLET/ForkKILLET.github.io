// :: Import

import { Mix, Log } from "./mixins"
import { openUrl } from "./utils"
import { Icon } from "./icon"
import { Wlog } from "./wlog"

// :: Work

type NodeRenderCb = ({
	e, c: HTMLDivElement
}) => any

class Node extends Mix(
    Log("node", "forestgreen"),
) {
	static layerColor = [ "white", "white", "aliceblue", "cornflowerblue", "lightgrey" ]

	constructor(
		public parent: Node,
	) {
		super()
		if (this.parent) this.parent.children.push(this)
		this.layer = (parent?.layer ?? -1) + 1
	}

	private qRenderCb: NodeRenderCb[] = []
	private q(cb: NodeRenderCb) {
		this.qRenderCb.push(cb)
		return this
	}

	render() {
		if (this.parent && ! this.parent.e) this.err("Rendering without parent rendered.")

		this.e = document.createElement("div")
		this.e.classList.add("node")
		
		this.eContent = document.createElement("div")
		this.eContent.classList.add("node-content")
		this.e.appendChild(this.eContent)

		this.eChildren = document.createElement("div")
		this.eChildren.classList.add("node-children")
		this.e.appendChild(this.eChildren)

		this.e.style.backgroundColor = Node.layerColor[ this.layer ]

		this.qRenderCb.forEach(cb => cb({
			e: this.e, c: this.eContent
		}));

		(this.parent?.eChildren ?? document.body).appendChild(this.e)

		this.log(`Rendering node at layer ${ this.layer }. content:`, this.eContent.innerText)

		this.children.forEach(n => n.render())
	}

	e: HTMLDivElement
	eContent: HTMLDivElement
	eChildren: HTMLDivElement

	layer: number

	private children: Node[] = []

	// :::: Chain

	public title(t: string) {
		return this.q(({ c }) => {
			const eTitle = document.createElement("div")
			eTitle.classList.add("node-content-text")
			eTitle.innerText = t
			c.appendChild(eTitle)
		})
	}

	public link(url: string) {
		return this.class("link").q(({ e }) =>
			e.addEventListener("click", () => openUrl(url))
		)
	}

	public class(className: string) {
		return this.q(({ e }) => e.classList.add(className))
	}

	public async icon(icon: string | Icon) {
		const nIcon = await Icon.fromData(icon)
		return this.q(({ c }) => {
			const eIcon = document.createElement("canvas")
			eIcon.classList.add("node-content-icon")
			c.appendChild(eIcon)
			nIcon.paint(eIcon)
		})
	}

	public async wlog(wlog: string) {
		const nWlog = await Wlog.fromData(wlog)
		return this.q(({ c }) => {
			const eWlog = document.createElement("div")
            eWlog.innerHTML = nWlog.parse()
			eWlog.classList.add("node-content-wlog")
			c.appendChild(eWlog)
		})
	}
}

const $ = (parent: Node) => new Node(parent)
const $top = $(null).class("top")

// :: Export

export { $top, $ }

