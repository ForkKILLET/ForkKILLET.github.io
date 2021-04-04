var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $top, $ } from "./node";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const $about = yield $($top).title("IceLavaTop").icon("il"), $games = $($top).title("Games"), $hwn = yield $($games).title("HardWayNazo").link("/HardWayNazo").icon("hwn"), $tpe = yield $($games).title("TrainProblemEmulator").link("/TrainProblemEmulator").icon("tpe"), $novels = $($top).title("Novels"), $xbqg = $($novels).title("TerminalXbqg").link("//github.com/ForkFG/TerminalXbqg"), $friends = $($top).title("Friends"), $OI = $($top).title("About OI"), $exlg = yield $($OI).title("Extend Luogu").link("//github.com/optimize-2/extend-luogu").icon("exlg"), $wlog = $($top).title("ForkΨKILLET's wlog"), $home = yield $($wlog).wlog("home");
    $top.render();
});
window.addEventListener("load", init);
//# sourceMappingURL=init.js.map