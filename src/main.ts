import $ = require("jquery");
import {
    $w, pick, $pick, wGlobal, dftConfig,
    wInit, wTheme, wColor, wRoloc, wSize, wLoc, wList,

    Wuicy, wConfig,
    WuicyIcon, wIconConfig,
    WuicyBadge, wBadgeConfig,
    WuicyPara, wParaConfig,
    WuicyList, wListConfig,
    WuicyPicture, wPictureConfig,

    WuicyStraw, wStrawConfig,
    WuicyLink, wLinkConfig, wLineStyle,
    WuicyTogBar, wTogBarConfig, wTriggerMode,

    WuicyNav, wNavConfig, wNavItem,
    WuicyTogList, wTogListConfig,

    WuicyButton, wButtonConfig,

    inputDiff
} from "./Wuicy";

// Debug:
$.extend(window, {
    $,

    $w, pick, $pick, wGlobal, dftConfig,
    wColor, wRoloc, wSize, wLoc, wList,

    Wuicy, WuicyIcon, WuicyBadge, WuicyPara, WuicyList, WuicyPicture,
    WuicyStraw, WuicyLink, WuicyTogBar, WuicyNav, WuicyTogList, WuicyButton,

    inputDiff
})

wGlobal.theme = "juice"

$w.root.blend(new WuicyNav({
    items: [
        new WuicyPara({
            id: "home", size: wSize("title"),
            text: "top", color: wColor("snowpear", "ghfruit", true),
            leftIcon: new WuicyIcon({ name: "home" })
        }),
        new WuicyLink({
            target: pick("home"),
            loc: "#", line: "ripple"
        })
    ]
})).then.blend([
    new WuicyBadge({
        id: "test", icon: new WuicyIcon({ name: "dice-d20" }),
        text: "Ice", color: wColor("snowpear", "pomegranate"),
        extraText: "Lava", extraColor: wColor("snowpear", "blueberry")
    }), new WuicyPara({
        text: "Click me!",
        wCreate: w => $w(w).pour(new WuicyTogBar({
            target: pick("test")
        }))
    }), new WuicyTogList({
        barText: "IceLava",
        list: wList({
            items: [
                [ "ForkKILLET"   , "arrow-up"    , "arrow-down"   ],
                [ "Bohanjun"     , "flag"        ,                ],
                [ "UCW"          , "sun"         ,                ]
            ]
        })
    }), new WuicyPicture({
        loc: "@res/icelava.jpg"
    })
])
