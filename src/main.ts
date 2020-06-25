import $ = require("jquery");

import {
    wGlobal, wColor, wLoc, wSize,
    WuicyIcon, WuicyPara, WuicyBadge, WuicyLink, WuicyNav, WuicyTogbar, WuicyTextList
} from "./Wuicy";

// Debug:
$.extend(window, {
    $,
    wGlobal, wColor, wLoc,
    WuicyIcon, WuicyPara, WuicyBadge, WuicyLink, WuicyNav
})

wGlobal.theme = "juice"

$(".w-root").doAppend("<div>").pour(new WuicyNav({
    items: [
        new WuicyPara({
            id: "home",
            text: "top", size: wSize("title"), color: wColor("snowpear", "ghfruit", true),
            leftIcon: new WuicyIcon({ name: "home" })
        }),
        new WuicyLink({
            target: WuicyPara.pick("home"),
            loc: "@", line: "ripple"
        })
    ]
})).doAppend("<div>").pour(new WuicyTextList({
   items: [
       ["ForkKILLET",   "arrow-up", "arrow-down"],
       ["Bohanjun",     "flag"],
       ["UCW",          "sun"]
   ]
}))

console.log(
    "%cIce%cLava%c!",
    "font-weight: bold; color: red;",
    "font-weight: bold; color: blue;",
    "color: black;"
)
