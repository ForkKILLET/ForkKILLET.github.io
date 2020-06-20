//////////////////// import & declare ////////////////////

import $ = require("jquery");

declare global {
    interface String {
        toWuciyClass(): string
        toColorClass(loc: "f" | "b"): string

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
    }
}

$.extend(String.prototype, {
    toWuciyClass(): string {
        return this.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`)
    },
    toColorClass(loc: "f" | "b"): string {
        return `w-color-${loc}-${this}`
    },
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
    }
})

type simpleFun = () => void

//////////////////// Tools & types ////////////////////

function $w(w: Wuicy) { return w.glass }

type wInit = simpleFun[]
type wCallback = (w: Wuicy) => void

type wTheme = "juice"
type wLineStyle = "normal" | "bold"

function wColor(fg: string = null, bg: string = null, useClass: boolean = true) {
    return new wColorT(fg, bg, useClass)
}
function wRoloc(bg: string = null, fg: string = null, useClass: boolean = true) {
    return new wColorT(fg, bg, useClass)
}
enum wColorLiteral {
    orange =    "#fbc555",
    grape =     "#ab09ee",
    litchi =    "#f6dcdc"
}
class wColorT {
    readonly fgName: wColorLiteral
    readonly bgName: wColorLiteral
    readonly fg: string
    readonly bg: string

    constructor(fg: string, bg: string, useClass: boolean) {
        this.fg = fg
        this.bg = bg
        if (useClass) {
            this.fgName = wColorLiteral[fg]
            this.bgName = wColorLiteral[bg]
        }
    }

    get colorClass(): string {
        return (this.fg ? "w-color-f-" + this.fg : "")
             + (this.fg && this.bg ? " " : "")
             + (this.bg ? "w-color-b-" + this.bg : "")
    }
}

function wSize(sz: string | number, useClass: boolean = true) {
    return new wSizeT(sz, useClass)
}
enum wSizeLiteral {
    title = 35,
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

//////////////////// Basic wuicies ////////////////////

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

    get class(): any { return Object.getPrototypeOf(this).constructor }
    static readonly type: string = "w"

    lateMake: boolean
    protected makes: wInit = []
    protected newMake(make: simpleFun, execWhenInited: boolean = null) {
        if (execWhenInited == null) this.makes.push(make)
        else if (execWhenInited == true)
            if (this.lateMake) this.newMake(make)
            else make()
    }
    make(): Wuicy {
        for (let i in this.makes) if (this.makes.hasOwnProperty(i)) (this.makes[i] as simpleFun)()
        return this
    }

    glass: JQuery
    theme: wTheme

    wCreate: wCallback

    protected assertLateMake(w: Wuicy, name: string): boolean {
        if (w != null && !w.lateMake) this.error(`${name} must be lateMake or null.`);
        return w != null
    }
    protected assertGlass(s: string) {
        if (!this.glass.isi(s)) this.error(`The glass must be: ${s}`);
    }
    protected error(msg: string): never {
        throw `[Wuicy : ${this.constructor.name}] ${msg}`
    }

    protected constructor(c: wConfig) {
        Wuicy.instances.push(this)

        if (c.glass == null) c.lateMake = true
        for (let i in c) if (c.hasOwnProperty(i)) this[i] = c[i]

        this.newMake(() => {
            let className = this.class.type.toWuciyClass()
            this.glass.addClass(className)
            if (this.theme) this.glass.addClass(`${className}-${this.theme}`)
            if (this.wCreate) this.wCreate(this)
            return this
        }, true)
    }
}

interface wIconConfig extends wConfig {
    name: string
    spin?: boolean
    pulse?: boolean
    fixWidth?: boolean
    color?: wColorT
}
class WuicyIcon extends Wuicy implements wIconConfig {
    static readonly type: string = "wIcon"

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

    constructor(c: wIconConfig) {
        super(c)

        this.newMake(() => {
            this.assertGlass("i,span")
            this.glass.addClass(this.FaClass).color(this.color)
        }, true)
    }
}

interface wParaConfig extends wConfig {
    text: string
    size?: wSizeT
    color?: wColorT

    leftIcon?: WuicyIcon
    rightIcon?: WuicyIcon
}
class WuicyPara extends Wuicy implements wParaConfig {
    static readonly type: string = "wPara"

    text: string
    size?: wSizeT
    color?: wColorT

    leftIcon?: WuicyIcon
    rightIcon?: WuicyIcon

    constructor(c: wParaConfig) {
        super(c)

        this.newMake(() => {
            this.assertGlass("p,b,i,em,strong")
            this.glass.text(this.text).color(this.color).size(this.size)
            for (let i of ["leftIcon", "rightIcon"])
                if (this.assertLateMake(this[i] as WuicyIcon, i)) {
                    this[i].glass = this.glass[i == "leftIcon" ? "doPrepend" : "doAppend"](`<i></i>`)
                        .addClass(`wPara-${i}`.toWuciyClass())
                    this[i].make()
                }
        }, true)
    }
}

interface wBadgeConfig extends wConfig {
    text: string
    color?: wColorT
    extraText?: string
    extraColor?: wColorT
    extraDisplay?: "fix" | "share" | "replace"

    icon?: WuicyIcon
}
class WuicyBadge extends Wuicy implements wBadgeConfig {
    static readonly type: string = "wBadge"

    text: string
    color: wColorT
    extraText: string
    extraColor: wColorT
    extraDisplay: "fix" | "share" | "replace"

    icon: WuicyIcon

    constructor(c: wBadgeConfig) {
        super(c)

        this.newMake(() => {
            this.assertGlass("span")
            let extra: boolean = this.extraText != null
            if (extra) this.glass.addClass(`w-badge-extra-${this.extraDisplay ?? "fix"}`)
            for (let i of ["", "extra"]) {
                if (i == "" || extra) {
                    let t = (i + "Text").toLowerCaseInitial()
                    this.glass.doAppend(`<span>${this[t]}</span>`)
                        .color(this[(i + "Color").toLowerCaseInitial()]).addClass(`w-badge-${t}`.toWuciyClass())
                }
            }
            if (this.assertLateMake(this.icon, "icon")) {
                this.icon.glass = this.glass.children(".w-badge-text").doPrepend("<i></i>").addClass("w-badge-icon")
                this.icon.make()
            }

            if (this.theme === "juice") {
                if (extra) switch (this.extraDisplay) {
                    case "share":
                        let originWidth: number
                        this.glass.hover(() => {
                                originWidth = this.glass.width()
                                this.glass.width(originWidth + this.glass.children(".w-badge-extra-text").width() + 5)
                            }, () => this.glass.width(originWidth)
                        )
                        break
                    case "replace":
                        // todo: complete this
                    case "fix":
                        break
                }
            }
        })
    }
}

//////////////////// Strawed wuicies ////////////////////

interface wStrawConfig extends wConfig {
    target?: JQuery
}
abstract class WuicyStraw extends Wuicy implements wStrawConfig {
    static readonly type: string = "wStraw"

    target: JQuery

    protected prepare(make: simpleFun) {
        this.makes.unshift(make)
    }

    protected constructor(c: wStrawConfig) {
        if (c.target == null) c.lateMake = true
        super(c)
    }
}

interface wLinkConfig extends wStrawConfig {
    loc?: string
    line?: wLineStyle

    wClick?: wCallback
}
class WuicyLink extends WuicyStraw implements wLinkConfig {
    static readonly type: string = "wLink"

    loc: string
    line: wLineStyle

    wClick: wCallback

    constructor(c: wLinkConfig) {
        super(c)

        this.prepare(() => {
            if (!this.glass) this.glass = this.target.doBefore(`<a></a>`)
        })
        this.newMake(() => {
            if (this.line) this.glass.addClass(`w-link-line-${this.line}`)
            if (this.wClick) this.glass.on("click", () => this.wClick(this))
            this.target.appendTo(this.glass.attr("href", this.loc))
        }, true)
    }
}

//////////////////// Form wuicies ////////////////////

interface wButtonConfig extends wConfig {
    wClick?: wCallback
}
class WuicyButton extends Wuicy implements wButtonConfig {
    static readonly type: string = "wButton"

    wClick?: wCallback

    constructor(c: wButtonConfig) {
        super(c)

        this.newMake(() => {
            if (c.wClick) c.glass.click(() => c.wClick(this))
        }, true)
    }
}

//////////////////// Export ////////////////////

export {
    $w,
    wColor, wRoloc, wSize, wInit, wTheme, wLineStyle,

    Wuicy, wConfig,
    WuicyIcon, wIconConfig,
    WuicyPara, wParaConfig,
    wBadgeConfig, WuicyBadge,

    wStrawConfig, WuicyStraw,
    WuicyLink, wLinkConfig,

    WuicyButton, wButtonConfig
}