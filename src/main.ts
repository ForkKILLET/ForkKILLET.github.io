import $ = require("jquery");

import {
    wColor, wRoloc, wSize,
    WuicyBadge, WuicyButton, WuicyIcon, WuicyLink, WuicyPara
} from "./Wuicy";

$(".w-root").doAppend("<span></span>").pour(new WuicyBadge({
    theme: "juice",

    text: "masnn",
    color: wColor("litchi", "orange"),
    extraText: "txdy",
    extraColor: wColor("litchi", "grape"),
    extraDisplay: "share",

    icon: new WuicyIcon({ name: "flag" })
})).mix(new WuicyLink({
    theme: "juice",

    line: "bold",
    loc: "https://www.luogu.com.cn/"
}))

console.log(
    "%cIce%cLava%c!",
    "font-weight: bold; color: red;",
    "font-weight: bold; color: blue;",
    "color: black;"
)

// Debug:
window["$"] = $
