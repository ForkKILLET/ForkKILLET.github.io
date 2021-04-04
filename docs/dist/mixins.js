var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchData } from "./utils";
const MixWith = (B, ...mixins) => mixins.length
    ? MixWith(mixins[0](B), ...mixins.slice(1))
    : B;
const Mix = (...mixins) => MixWith(Object, ...mixins);
const Log = (text, bgColor) => (B) => class extends (B !== null && B !== void 0 ? B : Object) {
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
const FromData = (prefix, postfix) => (B) => class extends (B !== null && B !== void 0 ? B : Object) {
    static fromData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new this(yield fetchData(prefix + name + postfix));
            instance.name = name;
            return instance;
        });
    }
};
export { Mix, MixWith, Log, FromData };
//# sourceMappingURL=mixins.js.map