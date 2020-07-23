// :: Import & Declare

import $ = require("jquery")

declare global {
    interface String {
        toWuicyClass(): string
        toColorClass(loc: "f" | "b"): string

        toHtmlTag(): string
        toLowerCaseInitial(): string
        toUpperCaseInitial(): string

        first(): string
        last(i?: number): string
    }

    interface Array <T> {
        first(): T
        last(i?: number): T
    }

    interface JQuery {
        then?: JQuery
        pour(w: Wuicy): JQuery
        blend(w: Wuicy | Wuicy[]): JQuery
        conn(w: WuicyStraw): JQuery

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

    interface $w {
        (w: Wuicy | wConfig): JQuery
        root?: JQuery
    }
}

Object.assign(String.prototype, {
    toWuicyClass(): string {
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

const arrayLikeExtension = {
    first(): any { return this[0] },
    last(i: number = 0): any { return this[this.length - 1 - i] }
}
Object.assign(Array.prototype, arrayLikeExtension)
Object.assign(String.prototype, arrayLikeExtension)

$.fn.extend({
    pour(w: Wuicy): JQuery {
        w.glass = this
        w.make()
        return this
    },
    blend(w: Wuicy | Wuicy[]): JQuery {
        let ws = w instanceof Array ? w : [ w ]
        for (let w of ws) this.doAppend(w.T.defaultGlass).pour(w)
        this.then = $w(ws.last())
        return this
    },
    conn(w: WuicyStraw): JQuery {
        w.target = this
        w.make()
        return this
    },

    color(c: wColorT): JQuery {
        if (c == null) return this
        this.addClass(c.colorClass)
        if (!c.fgName) this.css("color", c.fg)
        if (!c.bgName) this.css("backgroundColor", c.bg)
        return this
    },
    size(s: wSizeT): JQuery {
        if (s == null) return this
        this.addClass(s.sizeClass)
        if (s.name == null) this.css("fontSize", s.px + "px")
        return this
    },

    isi(p): boolean {
        return this.length === 1 && this.is(p)
    },
    firstChild(): JQuery {
        return this.children(":first-child")
    },
    lastChild(): JQuery {
        return this.children(":last-child")
    },
    addClasses(classes: string[]): JQuery {
        for (let c of classes) this.addClass(c)
        return this
    },
    doPrepend(...p: any[]): JQuery {
        this.prepend(...p)
        return this.firstChild()
    },
    doAppend(...p: any[]): JQuery {
        this.append(...p)
        return this.lastChild()
    },
    doBefore(...p: any[]): JQuery {
        this.before(...p)
        return this.prev()
    },
    doAfter(...p: any[]): JQuery {
        this.after(...p)
        return this.next()
    },
    ohtml(): string { return this.prop("outerHTML") }
})

type simpleFun = () => void

// :: Tools & types

const $w: $w = function (w: Wuicy | wConfig) { return w?.glass }
Object.defineProperty($w, "root", {
    get() {
        let $r = $(".w-root")
        return $r.length ? $r : $("body").doAppend("<div></div>").addClass("w-root")
    }
})

const dftConfig: {
    [index: string]: { [index: string]: any }
} = {}
function dft(val: any): (target: Wuicy, key: string) => void {
    return function (target: Wuicy, key: string) {
        const n = (target.constructor as typeof Wuicy).type
        if (dftConfig[n] == null) dftConfig[n] = {}
        dftConfig[n][key] = val
    }
}

const wInstances: Wuicy[] = []
function pick(id: string): Wuicy {
    for (let w of wInstances) if (w.id === id) return w
    return null
}
function $pick(id: string): JQuery {
    return $w(pick(id))
}

type wInit = simpleFun[]
type wCallback = (w: Wuicy) => void

type wTheme = "juice"
let wGlobal: {
    theme?: wTheme
} = {}
Object.defineProperty(wGlobal, "theme", {
    get(): wTheme { return wGlobal["_theme"] },
    set(t: wTheme) {
        $(`.${wGlobal.theme}`).removeClass(wGlobal.theme).addClass(t)
        wGlobal["_theme"] = t
    }
})

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
        loc = (location.hostname === "localhost" ? "http://localhost:1627/IceLavaTop/" : "/") + loc.substring(1)
    return loc
}

// :: Wuicies
// :::::: Basic

interface wConfig {
    id?: string
    glass?: JQuery
    lateMake?: boolean
    theme?: wTheme
    wCreate?: wCallback
}
abstract class Wuicy implements wConfig {
    id: string

    get T(): typeof Wuicy { return Object.getPrototypeOf(this).constructor }
    static get type(): string {
        return this.name.replace("Wuicy", "w")
    }
    static readonly glassType: string[] = []
    static get defaultGlass(): JQuery {
        return $(this.glassType[0].toHtmlTag())
    }

    run(cWork: (w?: Wuicy) => void) {
        cWork(this)
        return this
    }

    lateMake: boolean
    protected makes: wInit = []
    protected newMake(make: simpleFun, execWhenInited: boolean = true) {
        if (!execWhenInited) this.makes.push(make)
        else if (this.lateMake) this.newMake(make, null)
        else make()
    }
    make(): Wuicy {
        this.assertGlass("")
        for (let i in this.makes) this.makes[i]()
        this.lateMake = false
        return this
    }

    glass: JQuery
    theme: wTheme = wGlobal.theme

    wCreate: wCallback

    protected assertGlass(s: string) {
        for (let t of this.T.glassType) if ($w(this).isi(t + s)) return true
        return false
    }
    protected assertLateMake(w: Wuicy, name: string): boolean {
        if (w != null && !w.lateMake) this.except(`${name} must be lateMake or null.`)
        return w != null
    }

    protected say(type: string, msg: string, aloud: boolean = true): string {
        msg = `[Wuicy.UI] [${type} : ${this.T.name}] ${msg}`
        if (aloud && [ "log", "info", "warn", "error" ].includes(type)) console[type](msg)
        return msg
    }
    protected except(msg: string, aloud: boolean = false): never {
        throw this.say("Err", msg, aloud)
    }

    protected constructor(c: wConfig) {
        c = Object.assign({}, dftConfig[this.T.type], c)
        if (!$w(c)) c.lateMake = true
        for (let i in c) this[i] = c[i]
        wInstances.push(this)

        this.newMake(() => {
            $w(this).addClasses([ this.T.type.toWuicyClass(), this.theme ])
            if (this.wCreate) this.wCreate(this)
            return this
        })
    }
}

// :::::: Packed

abstract class WuicyPack extends Wuicy {
    protected abstract decorate($sel: JQuery): string
    get pack(): string {
        return this.decorate($w(this)
            ?? this.T.defaultGlass.addClasses([ this.T.type.toWuicyClass(), this.theme ]))
    }
    toString(): string { return this.pack }

    protected constructor(c: wConfig) {
        super(c)
        this.newMake(() => this.decorate($w(this)))
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
    static readonly glassType = [ "i", "span" ]

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
    static readonly glassType = [ "span" ]

    text: string
    color: wColorT
    extraText: string
    extraColor: wColorT
    @dft("fix") extraDisplay: "fix" | "share" | "replace"

    icon: WuicyIcon

    protected decorate($sel: JQuery): string {
        let extra: boolean = this.extraText != null
        if (extra) $sel.addClass(`w-badge-extra-${this.extraDisplay}`)
        for (let i of [ "", "extra" ]) {
            if (i == "" || extra) {
                let t = (i + "Text").toLowerCaseInitial()
                $sel.doAppend(`<span>${this[t]}</span>`)
                    .color(this[(i + "Color").toLowerCaseInitial()]).addClass(`w-badge-${t}`.toWuicyClass())
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

    leftIcon?, rightIcon?: WuicyIcon
}
class WuicyPara extends WuicyPack implements wParaConfig {
    static readonly glassType = [ "p", "b", "i", "em", "strong" ]

    text: string
    size?: wSizeT
    color?: wColorT

    leftIcon?: WuicyIcon
    rightIcon?: WuicyIcon

    protected decorate($sel: JQuery): string {
        $sel.text(this.text).color(this.color).size(this.size)
        for (let n of [ "leftIcon", "rightIcon" ]) {
            let i: WuicyIcon = this[n]
            if (this.assertLateMake(i, n))
                $sel[n == "leftIcon" ? "doPrepend" : "doAppend" ](i.pack).addClass(`wPara-${n}`.toWuicyClass())
        }
        return $sel.ohtml()
    }

    constructor(c: wParaConfig) { super(c) }
}

type wListItemLiteral = [string, string?, string?]
interface wLiteralListConfig {
    items: wListItemLiteral[]
    textColor?, iconColor?: wColorT
    size?: wSizeT
}
function wList(c: wLiteralListConfig) {
    let paras: WuicyPara[] = []
    for (let i of c.items)
        paras.push(new WuicyPara({
            text: i[0],
            color: c.textColor,
            size: c.size,
            leftIcon:   i[1] ? new WuicyIcon({ name: i[1], color: c.iconColor }) : undefined,
            rightIcon:  i[2] ? new WuicyIcon({ name: i[2], color: c.iconColor }) : undefined
        }))
    return new WuicyList({ items: paras })
}
type wListItem = WuicyPara | WuicyLink | WuicyBadge
interface wListConfig <tListItem extends Wuicy> extends wConfig {
    items: tListItem[]
}
class WuicyList <tListItem extends Wuicy = wListItem> extends WuicyPack implements wListConfig <tListItem> {
    static readonly glassType = [ "div" ]

    items: tListItem[]

    protected decorate($sel: JQuery): string {
        for (let w of this.items) $sel.blend(w)
        return $sel.ohtml()
    }

    constructor(c: wListConfig <tListItem>) { super(c) }
}

interface wPictureConfig extends wConfig {
    loc: string
}
class WuicyPicture extends WuicyPack implements wPictureConfig {
    static readonly glassType = [ "img", "div" ]

    loc: string

    protected decorate($sel: JQuery): string {
        if ($sel.is("img")) $sel.attr("src", wLoc(this.loc))
        else $sel.css("backgroundImage", `url(${wLoc(this.loc)})`)
        return $sel.ohtml()
    }

    constructor(c: wPictureConfig) { super(c) }
}

// :::::: Strawed

interface wStrawConfig extends wConfig {
    target?: JQuery | Wuicy
}
abstract class WuicyStraw extends Wuicy implements wStrawConfig {
    static readonly instances = null
    target: JQuery | Wuicy
    get $target(): JQuery {
        return this.target instanceof Wuicy ? $w(this.target) : this.target
    }

    protected prepare(make: simpleFun) {
        this.makes.unshift(make)
    }

    protected constructor(c: wStrawConfig) {
        if (c.target == null) c.lateMake = true
        super(c)

        this.prepare(() => {
            if (!$w(this)) this.glass = this.$target.doBefore(this.T.defaultGlass)
        })
    }
}

type wLineStyle = "normal" | "bold" | "ripple" | "none"

interface wLinkConfig extends wStrawConfig {
    loc?: string
    line?: wLineStyle

    wClick?: wCallback
}
class WuicyLink extends WuicyStraw implements wLinkConfig {
    static readonly glassType = [ "a" ]

    loc: string
    @dft("none") line: wLineStyle

    wClick: wCallback

    constructor(c: wLinkConfig) {
        super(c)

        this.newMake(() => {
            let $this = $w(this)
            $this.addClass(`w-link-line-${this.line}`)
            if (this.wClick) $this.on("click", () => this.wClick(this))
            this.$target.appendTo($this.attr("href", wLoc(this.loc)))
        })
    }
}

type wTriggerMode = "click" | "hover"

interface wTogBarConfig extends wStrawConfig {
    trigger?: wTriggerMode
    wToggle?: wCallback,
}
class WuicyTogBar extends WuicyStraw implements wTogBarConfig {
    static readonly glassType = [ "div", "span" ]

    wToggle: wCallback
    @dft("click") trigger: wTriggerMode

    constructor(c: wTogBarConfig) {
        super(c)

        this.newMake(() =>
            $w(this)[this.trigger as string](() => {
                if (this.wToggle) this.wToggle(this)
                else this.$target.toggle()
            })
        )
    }
}

// :::::: Structure

type wNavItem = WuicyPara | WuicyLink | WuicyBadge | WuicyList
interface wNavConfig extends wLinkConfig {
    items: wNavItem[]
}
class WuicyNav extends WuicyList <wNavItem> implements wNavConfig {
    static readonly glassType = [ "div" ]

    items: wNavItem[]

    constructor(c: wNavConfig) { super(c) }
}

interface wTogListConfig <tListItem extends Wuicy> extends wConfig {
    barText: string
    list: WuicyList <tListItem>
    trigger?: wTriggerMode
}
class WuicyTogList <tListItem extends Wuicy = wListItem> extends Wuicy implements wTogListConfig <tListItem> {
    static readonly glassType = [ "div" ]

    barText: string
    list: WuicyList <tListItem>
    @dft("click") trigger: wTriggerMode

    constructor(c: wTogListConfig <tListItem>) {
        super(c)
        this.newMake(() => {
            $w(this).blend(new WuicyPara({
                text: this.barText,
                rightIcon: new WuicyIcon({ name: "angle-down" }),
                wCreate: w =>
                    $w(w).pour(new WuicyTogBar({
                        trigger: this.trigger,
                        target: this.list,
                        wToggle: _ => {
                            $w(this.list).toggle()
                            $w(w).children(".w-icon").toggleClass("fa-angle-down").toggleClass("fa-angle-up")
                            // Todo: Edit WuicyPara dynamically.
                        }
                    }))
            })).blend(this.list)
        })
    }
}

// :::::: Form

interface wButtonConfig extends wConfig {
    wClick?: wCallback
}
class WuicyButton extends Wuicy implements wButtonConfig {
    static readonly glassType = [ "span", "div" ]

    wClick?: wCallback

    constructor(c: wButtonConfig) {
        super(c)

        this.newMake(() => { if (c.wClick) $w(c).click(() => c.wClick(this)) })
    }
}

const
    lowerCaseLetterTable = "abcdefghijklmnopqrstuvwxyz",
    upperCaseLetterTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    letterTable = lowerCaseLetterTable + upperCaseLetterTable,
    numberTable = "0123456789",
    identifierTable = numberTable + letterTable + "_$"

interface wInputConfig extends wConfig {
    hint?: string
    limit?: string
}
class WuicyInput extends Wuicy implements wInputConfig {
    static readonly glassType = [ "input" ]

    hint: string
    @dft(identifierTable) limit: string

    constructor(c: wInputConfig) {
        super(c)
    }
}

export function inputDiff(ori: string, chg: string, insertDetail: boolean) {
    let l = "", r = "", m1, m2: string,
        i, li, ri: number
    for (i = 0; ori[i] === chg[i] || ori.last(i) === chg.last(i); i++) {
        if (i * 2 >= ori.length - 1 || i * 2 >= chg.length - 1) break
        if (ori[i] === chg[i]) l += ori[i]
        else li = i
        if (ori.last(i) === chg.last(i)) r += ori.last(i)
        else ri = i
    }
    m1 = ori.substring(li, ori.length - ri - 1)
    m2 = chg.substring(li, chg.length - ri - 1)

    if (!m1.length) {
        if (!m2.length) return { type: "keep" }
        if (!l.length) return insertDetail
            ? { type: "prepend", chg: m2 }
            : { type: "insert", idx: 0, chg: m2 }
        if (!r.length) return insertDetail
            ? { type: "append", chg: m2 }
            : { type: "insert", idx: ori.length, chg: m2 }
        return { type: "insert", idx: li, chg: m2 }
    }
    if (!m2.length) return { type: "delete", idx: li, ori: m1 }
    return { type: "replace", idx: li, ori: m1, chg: m2 }
}

// :: Export & Extra

console.log(
    "%c[%cWuicy%c.%cUI%c] loaded !",
    `color: ${wColorLiteral.ghfruit};   background-color: ${wColorLiteral.snowpear};    border-radius: 5px 0 0 5px;`,
    `color: ${wColorLiteral.grape};     background-color: ${wColorLiteral.snowpear};    font-weight: bold;`,
    `color: ${wColorLiteral.ghfruit};   background-color: ${wColorLiteral.snowpear};`,
    `color: ${wColorLiteral.orange};    background-color: ${wColorLiteral.snowpear};    font-weight: bold;`,
    `color: ${wColorLiteral.ghfruit};   background-color: ${wColorLiteral.snowpear};    border-radius: 0 5px 5px 0;`
)

export {
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

    WuicyButton, wButtonConfig
}
