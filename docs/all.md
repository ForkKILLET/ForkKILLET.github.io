VER Typed δ #dev 0.1.0 Try loader

MODIFY

add:    Fletcher's basic functions
add:    jQuery

RELEASE null

DOCUMENTS this

@2020.06.07

---

VER Typed δ #dev 1.0.0 Wuicy update

MODIFY

rm:     Fletcher (that's a bad idea for TS)
add:    Wuicy! Now support some basic components: (called wuicies)
        Icon, Para, Badge, Link, Button.
        Several garish colors. (fruits' and gems' names)

RELEASE null

DOCUMENTS this

@2020.06.20

---

VER Typed δ #dev 1.0.1 Wuicy update: better badge

THANK

@bohanjun: He gives the prototype of the new badge style.

MODIFY

upg:    Better badge made by whole CSS.
style:  Add newlines to each EOF.

RELEASE null

DOCUMENTS this

@2020.06.21

---

VER Typed δ #dev 1.0.2 Wuicy update: list

MODIFY

add!:   `wGlobal` supported. Don't need config theme for each wuicy any longer.
upg!:   `WuicyIcon`, `WuicyBadge` & `WuicyPara` are PACKABLE now. Getter `pack` returns a simple HTML of the wuicy.
        e.g. `new WuicyIcon({ "name": "flag", "color": wColor("#114514") }).pack` returns
        `"<i class="w-icon w-icon-juice fas fa-flag" style="color: rgb(17, 69, 20);"></i>"`.
add!:   2 pack wuicies `WuicyList` & `WuicyTextList`.
add!:   `WuicyNav`, as a special list.
add!:   `ripple` line style for `WuicyLink`.
add:    `WuicyLink` now creates a `a` element out of its target when the glass is null.
add?:   `WuicyTogbar`, developing, not tested.
        
upg:    `wColorT` has a `fix` field now. This prevents the color from changing when hovering or in other situations.
upg:    `pick` wuicy instances by ID. And `$pick` their glasses.
upg:    Wuicies now has glass type and lateMake assertions.
add:    `wLoc`, its only use is replace the initial `@` of a URL to `/` and `http://localhost:1627/IceLavaTop/dist/`
        when the page is running on localhost.
upg:    Slightly smaller title size to 34px.
upg:    Have more and less garish colors.
        
style:  New comment format for code zone:
        e.g. `// :: Zone name`, `// :::::: Sub zone name`
style:  Remove all semicolons and unnecessary `??` operators.

RELEASE null

DOCUMENTS this

@2020.06.25
