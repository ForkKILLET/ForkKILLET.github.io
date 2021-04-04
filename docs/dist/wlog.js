import { Mix, Log, FromData } from "./mixins";
class Wlog extends Mix(Log("wlog", "cornflowerblue"), FromData("wlog/", ".md")) {
    constructor(text) {
        super();
        this.text = text;
    }
    parse() {
        this.log("Parsing wlog. name: `%s`", this.name);
        const syntaxWrap = (wrapper, inline, f) => {
            wrapper = wrapper.replace(/[.*+?]/g, c => "\\" + c);
            const unescaped = String.raw `(?<!\\)((?:\\\\)*)` + wrapper;
            const escaped = `\\\\([\\${wrapper[0]}])`;
            return [
                RegExp(unescaped + `(${inline ? "[^\\n]" : "."}+?)` + unescaped, "g"),
                (_, __, text) => f(text.replace(RegExp(escaped, "g"), (_, withoutSlash) => withoutSlash))
            ];
        };
        const syntax = [
            [/^#! (\S+\/)+\n/m, (_, tags) => tags.split("/").map(tag => tag
                    ? `<mark>${tag}</mark>` : "").join("")
            ],
            [/^(#{1,6}) (.+)$/mg, (_, sharps, text) => {
                    const hx = "h" + sharps.length;
                    return `<${hx}>${text}</${hx}>`;
                }],
            syntaxWrap("`", true, text => `<code>${text}</code>`),
            syntaxWrap("**", false, text => `<strong>${text}</strong>`),
            syntaxWrap("_", false, text => `<em>${text}</em>`),
            [/ {2}\n/g, "<br />"]
        ];
        const replaced = [];
        return syntax.reduce((t, p) => t.replace(p[0], (...arg) => {
            replaced.push(typeof p[1] === "function" ? p[1](...arg) : p[1]);
            return `@@${replaced.length - 1}@@`;
        }), this.text).replace(/@@(\d+)@@/g, (_, id) => replaced[+id]);
    }
}
export { Wlog };
//# sourceMappingURL=wlog.js.map