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
const log = (text, bgColor) => (tarClass), T;
;
{
    tarClass.prototype.log = (...msg) => console.log(`%c${text}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px white;
`, ...msg);
    tarClass.prototype.err = (...msg) => {
        console.error(`%c${text}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px red;
`, ...msg);
        throw Error(msg.map(m => { var _a; return (_a = m.toString) === null || _a === void 0 ? void 0 : _a.call(m); }).join(" "));
    };
}
const data = (prefix, postfix, filter) => (tarClass) => {
    tarClass.fromData = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const instance = new tarClass(yield fetchData(prefix + name + postfix));
    });
};
export { log };
//# sourceMappingURL=decorators.js.map