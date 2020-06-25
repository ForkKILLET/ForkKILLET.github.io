// :: Import & Declare

import $ = require("jquery")

declare global {
    interface String {
        toWuciyClass(): string
        toColorClass(loc: "f" | "b"): string

        toHtmlTag(): string
        toLowerCaseInitial(): string
        toUpperCaseInitial(): string
    }

    interface JQuery {
        pour(w: Wuicy): JQuery
        mix(w: WuicyStraw): JQuery

        color(c: wColorT): JQuery
        size(s: wSizeT): JQuery

        isi(p): boolean
        firstChild(): JQuery
        lastChild(): JQuery
        addClasses(classes: string[]): JQuery
        doPrepend(...p: any[]): JQuery
        doAppend(...p: any[]): JQuery
        doBefore(...p: any[]): JQuery
        doAfter(...p: any[]): JQuery
        ohtml(): string
    }
}

$.extend(String.prototype, {
    toWuciyClass(): string {
        return this.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`)
    },
    toColorClass(loc: "f" | "b"): string {
        return `w-color-${loc}-${this}`
    },

    toHtmlTag(): string { return `<${this}>` },
    toLowerCaseInitial(): string {
        return this[0].toLowerCase() + this.substring(1)
    },
    toUpperCaseInitial(): string {
        return this[0].toUpperCase() + this.substring(1)
    }
})

$.fn.extend({
    pour(w: Wuicy): JQuery {
        let that = this as JQuery
        w.glass = that
        w.make()
        return that
    },
    mix(w: WuicyStraw): JQuery {
        let that = this as JQuery
        w.target = that
        w.make()
        return that
    },

    color(c: wColorT): JQuery {
        let that = this as JQuery
        if (c == null) return that
        that.addClass(c.colorClass)
        if (!c.fgName) that.css("color", c.fg)
        if (!c.bgName) that.css("backgroundColor", c.bg)
        return that
    },
    size(s: wSizeT): JQuery {
        let that = this as JQuery
        if (s == null) return that
        that.addClass(s.sizeClass)
        if (s.name == null) that.css("fontSize", s.px + "px")
        return that
    },

    isi(p): boolean {
        let that = this as JQuery
        return that.length === 1 && that.is(p)
    },
    firstChild(): JQuery {
        return (this as JQuery).children(":first-child")
    },
    lastChild(): JQuery {
        return (this as JQuery).children(":last-child")
    },
    addClasses(classes: string[]): JQuery {
        let that = this as JQuery
        for (let c of classes) that.addClass(c)
        return that
    },
    doPrepend(...p: any[]): JQuery {
        let that = this as JQuery
        that.prepend(...p)
        return that.firstChild()
    },
    doAppend(...p: any[]): JQuery {
        let that = this as JQuery
        that.append(...p)
        return that.lastChild()
    },
    doBefore(...p: any[]): JQuery {
        let that = this as JQuery
        that.before(...p)
        return that.prev()
    },
    doAfter(...p: any[]): JQuery {
        let that = this as JQuery
        that.after(...p)
        return that.next()
    },
    ohtml(): string { return this.prop("outerHTML") }
})

type simpleFun = () => void

// :: Tools & types

function $w(w: Wuicy) { return w.glass }

type wInit = simpleFun[]
type wCallback = (w: Wuicy) => void

type wTheme = "juice"
class wGlobal {
    static theme: wTheme
}

type wLineStyle = "normal" | "bold" | "ripple" | "none"

function wColor(fg: string = "ghfruit", bg: string = null, fix: boolean = false, useClass: boolean = true) {
    return new wColorT(fg, bg, fix, useClass)
}
function wRoloc(bg: string = null, fg: string = "ghfruit", fix: boolean = false, useClass: boolean = true) {
    return new wColorT(fg, bg, fix, useClass)
}
enum wColorLiteral {
    snowpear =     "#ffffff",
    bowl = 		   "#f9f9f9",
    litchi =       "#ffecec",
    pomegranate =  "#ea4343",
    banana =       "#face80",
    orange =       "#fbc555",
    greengage =    "#6acb4a",
    blueberry =    "#5727f5",
    grape =        "#ab09ee",
    ghfruit =      "#171515"
}
class wColorT {
    readonly fgName: wColorLiteral
    readonly bgName: wColorLiteral
    readonly fg: string
    readonly bg: string

    constructor(fg: string, bg: string, public readonly fix: boolean, useClass: boolean) {
        this.fg = fg
        this.bg = bg
        if (useClass) {
            this.fgName = wColorLiteral[fg]
            this.bgName = wColorLiteral[bg]
        }
    }

    get colorClass(): string {
        return (wColorLiteral[this.fg] ? "w-color-f-" + this.fg : "")
            + (wColorLiteral[this.bg] ? " w-color-b-" + this.bg : "")
            + (this.fix ? " w-color-fix" : "")
    }
}

function wSize(sz: string | number, useClass: boolean = true) {
    return new wSizeT(sz, useClass)
}
enum wSizeLiteral {
    title = 34,
    subtitle = 27,
    normal = 16
}
class wSizeT {
    readonly px: number
    readonly name: string

    constructor(sz: string | number, useClass: boolean) {
        this.px = typeof sz === "string" ? wSizeLiteral[sz] : sz
        if (useClass && typeof sz !== "number") this.name = sz
    }

    get sizeClass(): string {
        return this.name ? `w-size-${this.name}` : ""
    }
}

function wLoc(loc: string) {
    if (loc.startsWith("@"))
        loc = (location.hostname === "localhost" ? "http://localhost:1627/IceLavaTop/dist/" : "/") + loc.substring(1)
    return loc
}

type wTriggerMode = "click" | "hover"

// :: Basic wuicies

interface wConfig {
    id?: string
    glass?: JQuery
    lateMake?: boolean
    theme?: wTheme
    wCreate?: wCallback
}
abstract class Wuicy implements wConfig {
    id: string
    static instances: Wuicy[] = []
    static pick(id: string): Wuicy {
        for (let w of this.instances) if (w.id === id) return w
        return null
    }
    static $pick(id: string): JQuery {
        return this.pick(id)?.glass
    }

    get W(): any { return Object.getPrototypeOf(this).constructor }
    static readonly type: string = "w"
    static readonly glassType: string[] = []

    lateMake: boolean
    protected makes: wInit = []
    protected newMake(make: simpleFun, execWhenInited: boolean = true) {
        if (!execWhenInited) this.makes.push(make)
        else if (this.lateMake) this.newMake(make, null)
        else make()
    }
    make(): Wuicy {
        this.assertGlass("")
        for (let i in this.makes) if (this.makes.hasOwnProperty(i)) (this.makes[i] as simpleFun)()
        this.lateMake = false
        return this
    }

    glass: JQuery
    theme: wTheme = wGlobal.theme

    wCreate: wCallback

    protected assertGlass(s: string) {
        for (let t of this.W.glassType) if (this.glass.isi(t + s)) return true
        return false
    }
    protected assertLateMake(w: Wuicy, name: string): boolean {
        if (w != null && !w.lateMake) this.error(`${name} must be lateMake or null.`)
        return w != null
    }
    protected error(msg: string): never {
        throw `[Wuicy : ${this.constructor.name}] ${msg}`
    }

    protected constructor(c: wConfig) {
        if (c.glass == null) c.lateMake = true
        for (let i in c) if (c.hasOwnProperty(i)) this[i] = c[i]
        this.W.instances.push(this)

        this.newMake(() => {
            let className = this.W.type.toWuciyClass()
            this.glass.addClass(className).addClass(`${className}-${this.theme}`)
            if (this.wCreate) this.wCreate(this)
            return this
        })
    }
}

// :: Packed wuicies

abstract class WuicyPack extends Wuicy {
    protected abstract decorate($sel: JQuery): string
    get pack(): string {
        let className = this.W.type.toWuciyClass()
        return this.decorate(
            $(this.W.glassType[0].toHtmlTag())
                .addClass(className).addClass(`${className}-${this.theme}`)
        )
    }
    toString(): string { return this.pack }

    protected constructor(c: wConfig) {
        super(c)
        this.newMake(() => this.decorate(this.glass))
    }
}

interface wIconConfig extends wConfig {
    name: string
    spin?: boolean
    pulse?: boolean
    fixWidth?: boolean
    color?: wColorT
}
class WuicyIcon extends WuicyPack implements wIconConfig {
    static instances: WuicyIcon[] = []

    static readonly type = "wIcon"
    static readonly glassType = ["i", "span"]

    name: string
    get FaClass(): string {
        let c = `fas fa-${this.name}`
        if (this.spin) c += " fa-spin"
        if (this.pulse) c += " fa-pulse"
        if (this.fixWidth) c += " fa-fw"
        return c
    }

    spin: boolean
    pulse: boolean
    fixWidth: boolean
    color: wColorT

    protected decorate($sel: JQuery): string {
        return $sel.addClass(this.FaClass).color(this.color).ohtml()
    }

    constructor(c: wIconConfig) { super(c) }
}

interface wBadgeConfig extends wConfig {
    text: string
    color?: wColorT
    extraText?: string
    extraColor?: wColorT
    extraDisplay?: "fix" | "share" | "replace"

    icon?: WuicyIcon
}
class WuicyBadge extends WuicyPack implements wBadgeConfig {
    static instances: WuicyBadge[] = []

    static readonly type = "wBadge"
    static readonly glassType = ["span"]

    text: string
    color: wColorT
    extraText: string
    extraColor: wColorT
    extraDisplay: "fix" | "share" | "replace" = "fix"

    icon: WuicyIcon

    protected decorate($sel: JQuery): string {
        let extra: boolean = this.extraText != null
        if (extra) $sel.addClass(`w-badge-extra-${this.extraDisplay}`)
        for (let i of ["", "extra"]) {
            if (i == "" || extra) {
                let t = (i + "Text").toLowerCaseInitial()
                $sel.doAppend(`<span>${this[t]}</span>`)
                    .color(this[(i + "Color").toLowerCaseInitial()])
                    .addClass(`w-badge-${t}`.toWuciyClass())
            }
        }
        if (this.assertLateMake(this.icon, "icon")) $sel.children(".w-badge-text").prepend(this.icon.pack)
        return $sel.ohtml()
    }

    constructor(c: wBadgeConfig) { super(c) }
}

interface wParaConfig extends wConfig {
    text: string
    size?: wSizeT
    color?: wColorT

    leftIcon?: WuicyIcon
    rightIcon?: WuicyIcon
}
class WuicyPara extends WuicyPack implements wParaConfig {
    static instances: WuicyPara[] = []

    static readonly type = "wPara"
    static readonly glassType = ["p", "b", "i", "em", "strong"]

    text: string
    size?: wSizeT
    color?: wColorT

    leftIcon?: WuicyIcon
    rightIcon?: WuicyIcon

    protected decorate($sel: JQuery): string {
        $sel.text(this.text).color(this.color).size(this.size)
        for (let n of ["leftIcon", "rightIcon"]) {
            let i: WuicyIcon = this[n]
            if (this.assertLateMake(i, n))
                $sel[n == "leftIcon" ? "doPrepend" : "doAppend"](i.pack).addClass(`wPara-${n}`.toWuciyClass())
        }
        return $sel.ohtml()
    }

    constructor(c: wParaConfig) { super(c) }
}

type wListItem = WuicyPara | WuicyLink | WuicyBadge
interface wListConfig extends wConfig {
    items: wListItem[]
}
class WuicyList <tListItem = wListItem> extends WuicyPack implements wListConfig {
    static instances: WuicyList[] = []

    static readonly type: string = "wList"
    static readonly glassType = ["div"]

    items: wListItem[]

    protected decorate($sel: JQuery): string {
        for (let i in this.items)
            $sel.doAppend((this.items[i] as WuicyPack).pack)
        return $sel.ohtml()
    }

    constructor(c: wListConfig) { super(c) }
}

interface wTextListConfig extends wConfig{
    items: [string, string?, string?][]
    size?: wSizeT
    textColor?: wColorT
    iconColor?: wColorT
}
class WuicyTextList extends WuicyPack implements wTextListConfig {
    static instances: WuicyTextList[] = []

    static readonly type: string = "wTextList"
    static readonly glassType = ["div"]

    items: [string, string?, string?][]
    size: wSizeT
    textColor: wColorT
    iconColor: wColorT

    protected decorate($sel: JQuery): string {
        let paras: WuicyPara[] = []
        for (let i of this.items)
            paras.push(new WuicyPara({
                text: i[0],
                color: this.textColor,
                size: this.size,
                leftIcon:   i[1] ? new WuicyIcon({ name: i[1], color: this.iconColor }) : undefined,
                rightIcon:  i[2] ? new WuicyIcon({ name: i[2], color: this.iconColor }) : undefined
            }))
        new WuicyList<WuicyPara> ({
            items: paras,
            glass: $sel
        })
        return $sel.ohtml()
    }

    constructor(c: wTextListConfig) { super(c) }
}

// :: Strawed wuicies

interface wStrawConfig extends wConfig {
    target?: JQuery | Wuicy
}
abstract class WuicyStraw extends Wuicy implements wStrawConfig {
    static readonly instances = null
    static readonly type: string = "wStraw"

    target: JQuery | Wuicy
    get $target(): JQuery {
        return this.target instanceof Wuicy ? this.target.glass : this.target
    }

    protected prepare(make: simpleFun) {
        this.makes.unshift(make)
    }

    protected constructor(c: wStrawConfig) {
        if (c.target == null) c.lateMake = true
        super(c)

        this.prepare(() => {
            if (!this.glass) this.glass = this.$target.doBefore(this.W.glassType[0].toHtmlTag())
        })
    }
}

interface wLinkConfig extends wStrawConfig {
    loc?: string
    line?: wLineStyle

    wClick?: wCallback
}
class WuicyLink extends WuicyStraw implements wLinkConfig {
    static instances: WuicyLink[] = []

    static readonly type = "wLink"
    static readonly glassType = ["a"]

    loc: string
    line: wLineStyle = "none"

    wClick: wCallback

    constructor(c: wLinkConfig) {
        super(c)

        this.newMake(() => {
            this.glass.addClass(`w-link-line-${this.line}`)
            if (this.wClick) this.glass.on("click", () => this.wClick(this))
            this.$target.appendTo(this.glass.attr("href", this.loc = wLoc(this.loc)))
        })
    }
}

interface wTogbarConfig extends wStrawConfig {
    wToggle?: wCallback,
    trigger?: wTriggerMode
}
class WuicyTogbar extends WuicyStraw implements wTogbarConfig {
    static instances: WuicyTogbar[] = []

    static readonly type = "wTogbar"
    static readonly glassType = ["div", "span"]

    wToggle: wCallback
    trigger: wTriggerMode = "click"

    constructor(c: wTogbarConfig) {
        super(c)

        this.newMake(() =>
            this.glass[this.trigger as string](() => {
                if (this.wToggle) this.wToggle(this)
                else this.$target.hide()
            })
        )
    }
}

// :: Structure wuicies

type wNavItem = WuicyPara | WuicyLink | WuicyBadge
interface wNavConfig extends wLinkConfig {
    items: wNavItem[]
}
class WuicyNav extends WuicyList<wNavItem> implements wNavConfig {
    static instances: WuicyNav[] = []

    static readonly type = "wNav"
    static readonly glassType = ["div"]

    items: wNavItem[]

    constructor(c: wNavConfig) { super(c) }
}

// :: Form wuicies

interface wButtonConfig extends wConfig {
    wClick?: wCallback
}
class WuicyButton extends Wuicy implements wButtonConfig {
    static instances: WuicyButton[] = []

    static readonly type = "wButton"

    wClick?: wCallback

    constructor(c: wButtonConfig) {
        super(c)

        this.newMake(() => { if (c.wClick) c.glass.click(() => c.wClick(this)) })
    }
}

// :: Export

export {
    wGlobal, $w,
    wColor, wRoloc, wSize, wLoc, wInit, wTheme,

    Wuicy, wConfig,
    WuicyIcon, wIconConfig,
    WuicyBadge, wBadgeConfig,
    WuicyPara, wParaConfig,
    WuicyList, wListConfig,
    WuicyTextList, wTextListConfig,

    WuicyStraw, wStrawConfig,
    WuicyLink, wLinkConfig, wLineStyle,
    WuicyTogbar, wTogbarConfig, wTriggerMode,

    WuicyNav, wNavConfig, wNavItem,

    WuicyButton, wButtonConfig
}
