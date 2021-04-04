var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetchData = (url, res = "text", opt) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield fetch("/FkData/" + url, opt))[res](); });
const openUrl = (u) => {
    let external = false;
    if (u.startsWith("//"))
        external = true;
    else if (location.hostname === "localhost") {
        let dirs = u.split("/");
        if (!dirs[0] &&
            ["HardWayNazo", "TrainProblemEmulator"].includes(dirs[1]))
            dirs = [...dirs.slice(0, 2), "docs", ...dirs.slice(2)];
        else
            dirs.unshift("docs");
        if (!dirs.slice(-1)[0].endsWith(".html"))
            dirs.push("index.html");
        u = dirs.join("/");
    }
    window.open(u, external ? "_blank" : "_self");
};
export { fetchData, openUrl };
//# sourceMappingURL=utils.js.map