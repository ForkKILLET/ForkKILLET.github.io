import { fetchData } from "./utils.js";
const MixWith = (B, ...mixins) => mixins.length
    ? MixWith(mixins[0](B), ...mixins.slice(1))
    : B;
const Mix = (...mixins) => MixWith(Object, ...mixins);
const Log = (text, bgColor) => (B) => class extends (B ?? Object) {
    log(format, ...msg) {
        console.log(`%c${text}%c ${format}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px white;
`, ``, ...msg);
    }
    err(...msg) {
        console.error(`%c${text}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px red;
`, ...msg);
    }
};
const FromData = (prefix, postfix) => (B) => class extends (B ?? Object) {
    static async fromData(name) {
        const instance = new this(await fetchData(prefix + name + postfix));
        instance.name = name;
        return instance;
    }
};
export { Mix, MixWith, Log, FromData };
//# sourceMappingURL=mixins.js.map