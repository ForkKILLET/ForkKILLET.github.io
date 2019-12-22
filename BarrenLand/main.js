if (!window.log) window.log = (msg) => console.log(msg);
if (!window.time) window.time = (if_hms, date) =>
{
	let d = date ? date : new Date(),
		Y = d.getFullYear(),
		M = d.getMonth() + 1,
		D = d.getDate(),
		h = d.getHours(),
		m = d.getMinutes(),
		s = d.getSeconds();
	if (M < 10) M = "0" + M;
	if (D < 10) D = "0" + D;
	if (h < 10) h = "0" + h;
	if (m < 10) m = "0" + m;
	if (s < 10) s = "0" + s;
	return `${Y}-${M}-${D}` + (if_hms ? ` ${h}:${m}:${s}` : "");
};
if (!Math.random_in_range) Math.random_in_range = (min, max, if_int) =>
{
	let r = Math.random() * (max - min + 1) + min;
	if (if_int) r = Math.trunc(r);
	return r;
};
if (!window.random_item) window.random_item = (arr) =>
{
	if (typeof(arr) === "object") return arr[Math.random_in_range(0, arr.length - 1, true)];
	else return null;
};

class BarrenLandSystem
{
	constructor(ExMD)
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ System\n${msg}`);
		this.warn = (code, msg) => console.warn(`[WARN: ${code}]: BarrenLand @ System\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ System\n${msg}`);
			console.error(e);
			throw e;
		};
		this.toString = () => "BarrenLandSystem";

		if (!$ || typeof($) !== "function") this.error_and_throw("R001", "Require JQuery but not found the correct $ function.");
		if (!window.script || !window.script.main) this.error_and_throw("R002", "Require [icelava.top/main.js] but didn't find.");
		if (!window.script || !window.script.ExtendedMarkdownParser) this.error_and_throw("R003", "Require [icelava.top/ExtendedMarkdownParser/main.js] but didn't find.");

		window.script.BarrenLandSystem = true;
		log("[LOAD]: icelava.top/BarrenLand/main.js @ System");

		$("#btn_toggle_guide").trigger("click"); // Note: 隐藏导航栏

		// Note: 绑定 ExMD
		if (typeof(ExMD) !== "object" || typeof(ExMD.render) !== "function")
			this.error_and_throw("C001", `Got an incorrect "ExMD" object.`);
		else this.ExMD = ExMD;

		// Note: 渲染模块选择模块
		this.info =
		{
			name:                 "BarrenLand",
			name_Chinese:         "蛮荒大陆",
			author:               "ForkKILLET",
			brief:                "一款更新缓慢的文字 RPG 游戏，适合放置 $i smile-wink i$",
			version:
			{
				era: "β",
				main: 0,
				sub: 2,
				upd: 3,
				toString: () => `[VER ${this.info.version.era}${this.info.version.main}.${this.info.version.sub}.${this.info.version.upd}]`
			},
			first_update_time:    new Date(2019, 12 - 1, 7, 0, 0, 0),
			last_update_time:     new Date(2019, 12 - 1, 21, 0, 0, 0),
			github_repo_URL: "https://github.com/ForkFG/ForkFG.github.io",
			github_repo_path: "/BarrenLand",
			toString: () => `
---

$c #3d942d;**${this.info.name}（${this.info.name_Chinese}）** c$，是${this.info.brief}  

本次重置编号 \`β\`，初次上传于 \`${time(false, this.info.first_update_time)}\`，  

目前版本：\`${this.info.version.toString()}\`；  

最近更新时间：\`${time(false, this.info.last_update_time)}\`。  

可以在 $ib github ib$ [Github repo](${this.info.github_repo_URL}) 的 \`${this.info.github_repo_path}\` 目录下看到游戏代码，  

求 star $c #efe942;$i star i$ c$ qwq  

---
			`
		};
		this.module_info =
		{
			log:        { fa_name: "scroll",        color: "#1eb6ff", available: true, position: 1, rank: 0 },
			info:       { fa_name: "info-circle",   color: "#ff2890", available: true, position: 2, rank: 1,
			callback: () =>
			{
				this.focus_tab_log("System");
				this.page_log("System", this.info.toString(), true, ExMD);
			}},
			setting:    { fa_name: "cog",           color: "#4d4d4d", available: true, position: 2, rank: 0,
			callback: () =>
			{
				this.toggle_module("setting");
			}}
		};
		this.repaint_module_change();

		// Note: 渲染日志模块
		this.log_info =
		{
			Diary:      { fa_name: "book",          color: "#009c0c",  rank: 0 },
			System:     { fa_name: "terminal",      color: "#4d4d4d",  rank: 233 },
		};
		this.repaint_module_log();
		this.toggle_module("log");
		this.focus_tab_log("System");

		// Note: 渲染设置模块
		this.setting_info =
		{
			if_log_animation:   { msg: "日志渐显特效",    type: "switch",     default: true,
			callback: (state) => this.if_log_animation = state },
			play_break:         { msg: "剧情显示间隔",    type: "num",        hint: "毫秒数",      default: 1000,
			callback: (value) => this.play_break = value }
		};
		this.repaint_module_setting();

		this.page_log("System", "**BarrenLand System** loaded.", true, ExMD);
	}

	repaint_module_change()
	{
		$("#module_change_1, #module_change_2").html("");
		for (let i in this.module_info)
		{
			if (!this.module_info[i].available) continue;
			$(`#module_change_${this.module_info[i].position}`).append(`<div id="btn_square_${i}" class="btn_square"></div>`);
			$(`#btn_square_${i}`)
			.attr("name", i)
			.addClass(this.module_info[i].position === 1 ? "btn_square_top" : "btn_square_bottom")
			.css("order", this.module_info[i].rank)
			.css("backgroundColor", this.module_info[i].color)
			.html(`<i class="fas fa-${this.module_info[i].fa_name}"></i>`)
			.click(() =>
			{
				if (typeof(this.module_info[i].callback) === "function") this.module_info[i].callback(this);
			});
		}
	}

	repaint_module_log()
	{
		$("#module_log").hide();
		let $head = $("#module_log_head");
		let $body = $("#module_log_body");
		$head.html("");
		$body.html("");
		for (let i in this.log_info)
		{
			$head.append(`<div id="tab_log_${i}" class="tab_log"></div>`);
			$(`#tab_log_${i}`)
			.append(`<i class="fas fa-${this.log_info[i].fa_name}"></i>&nbsp;<p>${i}</p>`)
			.click(() => this.focus_tab_log(i))
			.children("i").css("color", this.log_info[i].color);
			$body.append(`<div id="tav_log_${i}" class="tav_log"></div>`);
		}
		let $btn = $("#module_log>.btn_square");
		if ($btn.html() === "") $btn.addClass("btn_square").html(`<i class="fas fa-trash-alt"></i>`);
	}

	repaint_module_setting()
	{
		$("#module_setting").hide();
		$("#module_setting_head")
		.html(`<p>Setting</p>`)
		.after(`<div class="btn_square no_animation" name="close"><i class="fas fa-times-circle"></i></div>`);
		$("#module_setting>.btn_square").click(() => this.toggle_module("setting"));
		let $body = $("#module_setting_body");

		for (let i in this.setting_info)
		{
			let $i = $(`<div></div>`), $j;
			$i.append(`<p>${this.setting_info[i].msg} </p>`);
			switch (this.setting_info[i].type)
			{
			case "switch":
				$j = $(`<div class="switch"></div>`);
				$i.append($j);
				$body.append($i);
				$j.on("_switch", (e, state) => this.setting_info[i].callback(state));
				if (this.setting_info[i].default) $j.trigger("_switch", this.setting_info[i].default).addClass("switch_on");
				break;
			case "num":
				$j = $(`<input type="number" placeholder="${this.setting_info[i].hint}">`);
				$j.on("_input", (e, value) => this.setting_info[i].callback(value));
				$i.append($j);
				$body.append($i);
				if (this.setting_info[i].default) $j.val(this.setting_info[i].default).trigger("_input", this.setting_info[i].default);
				break;
			}
		}
	}

	toggle_module(name)
	{
		if (!this.module_info[name])
		{
			this.warn("C004", `"focus_module" method got an unknown module name "${name}"`);
			return;
		}

		$(`#module_${name}`).toggle();
	}

	focus_tab_log(name)
	{
		if (!this.log_info[name])
		{
			this.warn("C004", `"focus_tab_log" method got an unknown tab name "${name}"`);
			return;
		}

		$(".tab_log_focused").removeClass("tab_log_focused");
		$(".tav_log_focused").removeClass("tav_log_focused").hide();

		$(`#tab_log_${name}`).addClass("tab_log_focused").trigger("tab_focus");
		$(`#tav_log_${name}`).addClass("tav_log_focused").show();

		if (this.log_info[name].counter === undefined) this.log_info[name].counter = 0;
		else this.log_info[name].counter++;
	}

	page_log(tav, msg)
	{
		msg = msg.replace(/<\|/g, "<span class='btn_inline'>")
			     .replace(/\|>/g, "</span>");
		let $msg = $(`<p></p>`);
		$(`#tav_log_${tav}`).prepend($msg);
		if (!this.if_log_animation) $msg.addClass("no_animation");
		else setTimeout(() => $msg.css("opacity", 1), 200);

		if (this.ExMD) this.ExMD.render($msg[0], msg);
		else this.error_and_throw("C002", `"page_log" method require an "ExMD" object but didn't bind.`);

		let $btn_inline = $msg.find(".btn_inline");

		// Note: Currying!
		return (arr_callback) =>
		{
			if (typeof(arr_callback) !== "object") arr_callback = [arr_callback];
			for (let i = 0; i < $btn_inline.length; i++)
			{
				if (typeof(arr_callback[i]) !== "function")
				{
					this.warn("C003", `The BtnInline Units managing currying of "page_log" method expects an array of callbacks. But array item ${i} isn't a function.`);
					continue;
				}
				$($btn_inline[i]).click(arr_callback[i]);
			}
		};
	}

	page_log_with_time(tav, msg)
	{
		let page_log_currying = this.page_log(tav, `[${time(true, null)}] ${msg}`, this.ExMD);
		if (page_log_currying) return page_log_currying;
	}

	clear_log(name)
	{
		$(`#tav_log_${name}>p`).css("opacity", 0);
		setTimeout(() => $(`#tav_log_${name}`).html(""), 500);
	}

	clear_log_focused()
	{
		$(`.tav_log_focused`).html("");
	}
}

class BarrenLandUnit
{
	constructor(BLS, name, rule, reg_callback)
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ Unit\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ Unit\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!$ || typeof($) !== "function") this.error_and_throw("R001", "Require JQuery but not found the correct $ function.");
		if (!window.script || !window.script.main) this.error_and_throw("R002", "Require [icelava.top/main.js] but didn't find.");
		if (typeof(BLS) !== "object" || BLS.toString() !== "BarrenLandSystem") this.error_and_throw("C001", `Got an incorrect "BarrenLandSystem" object.`);

		if (!window.script.BarrenLandUnit) window.script.BarrenLandUnit = {};
		window.script.BarrenLandUnit[name] = true;
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Unit : ${name}`);

		this.BLS = BLS;
		this.name = name;
		this.rule = rule;

		if (typeof(reg_callback) !== "function") this.error_and_throw("C002", "Got an incorrect register callback.");
		else this.reg = reg_callback;

		this.BLS.page_log("System", `**BarrenLand Unit**: \`${name}\` loaded.`, true);
	}

	register($sel)
	{
		this.reg($sel);
		$sel.data("registered", true);
	}

	all() { return $(":not(.registered)" + this.rule); }

	registered() { return $(".registered" + this.rule); }

	register_all() { this.register(this.all()); }
}

class BarrenLandPlot
{
	constructor(BLS, name, tav)
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ Plot : ${name}\n${msg}`);
		this.warn = (code, msg) => console.warn(`[WARN: ${code}]: BarrenLand @ Plot\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ Plot : ${name}\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!window.script.BarrenLandPlot) window.script.BarrenLandPlot = {};
		window.script.BarrenLandPlot[name] = true;
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Plot : ${name}`);

		this.BLS = BLS;
		this.name = name;
		this.tav = tav;

		BLS.start = () => {};
		this.play_num = 0;
		this.milestone_info =
		{
			start: (callback) =>
			{
				if (typeof(callback) !== "function")
					this.error_and_throw("C003", `The "start" type curring of "add_milestone" method expect a callback but didn't get a function.`);
				else
				{
					let old = this.BLS.start;
					this.BLS.start = () => { old(); callback(); };
					$("#tab_log_Diary").one("tab_focus", this.BLS.start);
				}
			},
			play_end: (play_rule, callback) =>
			{
				if (typeof(callback) !== "function")
					this.error_and_throw("C003", `The "start" type curring of "add_milestone" method expect a callback but didn't get a function.`);
				else $(document).on("playend", (e, play_info) =>
				{
					for (let i in play_rule) if (play_rule[i] !== play_info[i]) return;
					callback();
				});
			}
		};

		this.BLS.page_log("System", `**BarrenLand Plot**: \`${name}\` loaded.`, true);
	}

	play(msg)
	{
		let play_info = {};
		play_info.id = this.play_num++;

		setTimeout(() => $(document).trigger("_playend", play_info), 500);
		let page_log_currying = this.BLS.page_log(this.tav, msg);
		if (page_log_currying) return page_log_currying;
	}

	play_in_list(arr_play)
	{
		// Done: 每次使用不同的延迟
		if (typeof(arr_play) !== "object")
			this.error_and_throw("C001", `"play_in_list" method expect a play array but didn't get a correct object.`);
		let every_play = (i) =>
		{
			if (!arr_play[i]) return;
			let play_btn_currying = this.play(arr_play[i][0]);
			if (play_btn_currying) play_btn_currying(arr_play[i].slice(1));
			setTimeout(() => every_play(i + 1), BLS.play_break);
		};
		every_play(0);
	}

	add_milestone(type)
	{
		if (!this.milestone_info[type]) this.error_and_throw("C002", `"add_milestone" method got an unknown type "${type}".`);
		else return this.milestone_info[type];
	}
}

class BarrenLandCharacter
{
	constructor()
	{

	}
}

$(() =>
{
	// Note: BarrenLandSystem
	window.BLS = new BarrenLandSystem(ExMD);

	// Note: BarrenLandUnit : BtnSquare
	window.BLU_BS = new BarrenLandUnit(BLS, "BtnSquare", ".btn_square:not(.no_animation)", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.css("animation", "jelly 500ms")
			 .on("animationend", () => $this.css("animation", ""));
	}));
	$("#module_log_head").after(`<div class="btn_square" name="clear"><i class="fas fa-trash-alt"></i></div>`);
	$("#module_log>.btn_square").click(BLS.clear_log_focused);
	BLU_BS.register_all();

	// Note: BarrenLandUnit : BtnInline
	window.BLU_BI = new BarrenLandUnit(BLS, "BtnInline", ".btn_inline", ($sel) => $sel.click((e) =>
	{
		let $i = $(e.currentTarget).parents(), $msg;
		for (let i = 0; i < $i.length; i++) if ($($i[i]).hasClass("tav_log"))
		{
			$msg = $($i[i - 1]);
			break;
		}
		$msg.find(".btn_inline").unbind("click").addClass("btn_inline_used");
	}));

	// Note: Override BarrenLandSystem . "page_log" method
	BLS.origin_page_log = BLS.page_log;
	BLS.page_log = (tav, msg) =>
	{
		let page_log_currying = BLS.origin_page_log(tav, msg);
		BLU_BI.register_all();
		return page_log_currying;
	};

	// Note: BarrenLandUnit : Switch
	window.BLU_SW = new BarrenLandUnit(BLS, "Switch", ".switch", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.toggleClass("switch_on").trigger("_switch", $this.hasClass("switch_on"));
	}));
	BLU_SW.register_all();

	// Note: BarrenLandUnit : Input
	window.BLU_IP = new BarrenLandUnit(BLS, "Input", "input", ($sel) =>
	{
		let $btn = $(`<div class="btn_micro btn_micro_for_input"><i class="fas fa-check"></i></div>`);
		$sel.after($btn);
		$sel.parent().on("click", ".btn_micro_for_input", (e) =>
		{
			let $i = $(e.currentTarget).prev("input");
			$i.trigger("_input", $i.val());
		});
		$sel.keydown((e) =>
		{
			if (e.which === 13)
			{
				let $i = $(e.currentTarget);
				$i.next(".btn_micro_for_input").trigger("click");
			}
		});
	});
	BLU_IP.register_all();

	// Note: BarrenLandUnit : BtnSmall
	window.BLU_BM = new BarrenLandUnit(BLS, "BtnMicro", ".btn_micro", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.css("animation", "jelly 500ms")
			 .on("animationend", () => $this.css("animation", ""));
	}));
	BLU_BM.register_all();

	// Note: BarrenLandPlot : MainStory
	window.BLP_MS = new BarrenLandPlot(BLS, "MainStory", "Diary");
	BLS.page_log("System", "暂未开放 **存/读档** 功能。请直接<|开始游戏|>") (() => BLS.focus_tab_log("Diary"));

	BLP_MS.default_list =
	[
		[`作为一个租房住的大学生，你结束了一天的**刻苦**学习，走回家，放下书包，熟练地打开你的 Macbook Pro。`],
		[`「干什么呢？」你想了想，随后` + random_item(
		[
			`玩起了 $i cubes i$ Minecraft，打算继续做昨天的红石机器人。`,
			`开始看[《诡秘之主》](https://book.qidian.com/info/1010868264)的新章节，乌贼又断章了，难受。`,
			`愉快地刷起了朋友圈。`,
			`瞄了一眼 [slay.one](https://slay.one)，发现还不能玩。`
		]
		)],
		[`**「啪——嗒」**，你听到了什么东西掉落的声音。`],
		[`你回头一看，只见地面上躺着一块黑色的纸片。`],
		[`你疑惑地捡起了它。`],
		[`看起来很薄的 “纸片”，拎在手里却并不轻，或许比一个鼠标还重。`],
		[`正当你观察它时，上面亮起了白色的文字：`],
		[`「世界那么**多**，你不想去看看嘛？」`],
		[`你心想：「什么叫 “多” 啊……这是同学无聊做的整人道具？我来研究一下——」`],
		[`“纸片” 上又亮起了文字「研究你 $i horse-head i$ 哦，我问你要不要去**异世界**玩！」`],
		[`「笑死老子了」你正在思考是哪个沙雕同学做的，突然发现了一个问题：`],
		[`「这个纸片怎么知道我要研究它？！」`],
		[`「我是**域牌**当然知道你在想什么，傻X，再问你最后一遍要不要去别的世界！」`],
		[`「似乎这个什么域牌，在邀请我穿越？它为什么要这么做？是不是要骗我去……」`],
		[`「谁骗你啊，这么好的机会别人都是抢着要的真搞不懂你——我倒数了啊，3、」`],
		[`「感觉这玩意很神奇但是……」`],
		[`「2、」`],
		[`「就算穿越之后回不来，嗯，不对，这东西似乎是可以双向的吧？是的吧？」`],
		[`「1、$i angry i$」`],
		[`你做出了决定<|我要去！|><|算了吧|>`,
		 () => BLP_MS.play("剧情正在~~咕咕~~策划中，敬请期待！"),
		 () => BLP_MS.play("剧情正在~~咕咕~~策划中，敬请期待！说起来你的选择很不正常诶！")]
	];
	BLP_MS.add_milestone("start") (() =>
	{
		BLP_MS.play_in_list(BLP_MS.default_list);
	});
});