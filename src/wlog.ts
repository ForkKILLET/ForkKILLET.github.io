// :: Import

import { Mix, Log, FromData } from "./mixins"

// :: Work

class Wlog extends Mix(
	Log("wlog", "cornflowerblue"),
	FromData("wlog/", ".md")
) {
	constructor(public text: string) {
		super()
    }
	parse(): string {
		this.log("Parsing wlog. name: `%s`", this.name)

		type replacer = [
			RegExp,
			string | ((...g: string[]) => string)
		]
		const syntaxWrap = (
			wrapper: string, inline: boolean,
			f: (text: string) => string
		): replacer => {
			wrapper = wrapper.replace(/[.*+?]/g, c => "\\" + c)
			const unescaped = String.raw`(?<!\\)((?:\\\\)*)` + wrapper
			const escaped = `\\\\([\\${ wrapper[0] }])`
			return [
				RegExp(unescaped + `(${ inline ? "[^\\n]" : "." }+?)` + unescaped, "g"),
				(_, __, text) => f(text.replace(RegExp(escaped, "g"), (_, withoutSlash) => withoutSlash))
			]
		}
		const syntax: replacer[] = [
			[ /^#! (\S+\/)+\n/m, (_, tags) =>
				tags.split("/").map(tag => tag
					? `<mark>${tag}</mark>` : ""
				).join("")
			],
			[ /^(#{1,6}) (.+)$/mg, (_, sharps, text) => {
				const hx = "h" + sharps.length
				return `<${hx}>${text}</${hx}>`
			} ],
			syntaxWrap("`", true, text => `<code>${text}</code>`),
			syntaxWrap("**", false, text => `<strong>${text}</strong>`),
			syntaxWrap("_", false, text => `<em>${text}</em>`),
			[ / {2}\n/g, "<br />" ]
		]
		const replaced: string[] = []
		return syntax.reduce((t, p: replacer) => t.replace(p[0], (...arg) => {
			replaced.push(typeof p[1] === "function" ? p[1](...arg) : p[1])
			return `@@${ replaced.length - 1 }@@`
		}), this.text).replace(/@@(\d+)@@/g, (_, id) => replaced[ + id ])
	}
}

// :: Export

export { Wlog }

