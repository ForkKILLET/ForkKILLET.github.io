VER Typed δ #dev 0.1.0 Try loader

MODIFY

| type   | description                |
| :----- | :------------------------- |
| add    | Fletcher's basic functions |  
| add    | jQuery                     |

RELEASE null

DOCUMENTS this

@2020.06.07

---

VER Typed δ #dev 1.0.0 Wuicy update

MODIFY

| type   | description                                                 |
| :----- | :---------------------------------------------------------- |
| rm     | Fletcher (that's a bad idea for TS)                         |
| add    | Wuicy! Now support some basic components: (called wuicies)
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

---

VER Typed δ #dev 1.0.3 Wuicy update: toggle

MODIFY

upg!:   `WuicyTogBar` is formally supported now. It can be connected to a `target`
        (like `WuicyLink`, they are both `WuicyStarw`), and when triggering the `glass`
        (click or hover, that's configurable), the `target` **toggles**! (by default, `$w(this).toggle()`)
        Passing callback `wToggle` is awesome, **but hide / show effect will disappear**.
upg!:   `WuicyTogList`, a crude collapse list realized by `WuicyList` and `WuicytogBar`.
upg!:   Use independent theme classes instead of Wuicy type hyphen theme name.
upg:    Now elements' (not wuicies now) theme change when setting `wGlobal.theme`.
        So it's easier to switch page theme!
fix:    `WuicyBadge`'s icon has correct right margin now. (to separate from text)
        Fix-style `WuicyBadge` has correct padding now.
fix:    Title-size `WuicyPara` aligns correctly now.
rm:     Use `wList` to generate `WuicyList` from string arrays instead of `WuicyTextList`.

add!:   `JQuery:.blend` append a default container element of the given wuicy to `this` and `make` it.
        return `this` and set `this.then` to the appended element.
add:    `$w.get:root` returns `$("body>.w-root")`. Will create one when not found.
add:    `Wuicy:.run` runs the callback with passing `this`.
fix:    Default configs won't cover custom ones now.
add:    Conventional console logs, but I like it.

style:  There are always spaces around generic arguments and inside array literal now.
style:  Removed unnecessary type casts.
style:  Merge several `Wuicy` (comment) zones into a big one.
style:  Use `$w(wuicy)` instead of `wuicy.glass`.
style:  `JQuery:.mix` -- `JQuery:.conn`
style:  `Wuicy.W` -- `T`
style:  (typo) `String:.toWuciyClass` -- `toWuicyClass`

@2020.07.12

---

VER Typed δ #dev 1.0.4 Wuicy update: picture

upg!:   `WuicyPicture`