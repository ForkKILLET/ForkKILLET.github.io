if (!window.log) window.log = msg => console.log(msg);
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
if (!window.is_empty) window.is_empty = (n) => (n === null || n === undefined);
if (!window.cb) window.cb = (str, color) => `$c ${color};「${str}」 c$`;

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

		if (!$ || typeof($) !== "function") this.error_and_throw("R001", `Require JQuery but not found the correct "$" function.`);
		if (!window.script || !window.script.main) this.error_and_throw("R002", "Require [icelava.top/main.js] but didn't find.");
		if (!window.script || !window.script.ExtendedMarkdownParser) this.error_and_throw("R003", "Require [icelava.top/ExtendedMarkdownParser/main.js] but didn't find.");

		window.script.BarrenLandSystem = true;
		log("[LOAD]: icelava.top/BarrenLand/main.js @ System");

		// Note: 隐藏导航栏
		$("#btn_toggle_guide").trigger("click");

		// Note: 绑定 ExMD
		if (!ExMD instanceof ExtendedMarkdownParser) this.error_and_throw("C001", `Got an incorrect "ExMD" object.`);
		else this.ExMD = ExMD;

		// Note: 渲染模块选择模块
		this.info =
		{
			name:                   "BarrenLand",
			name_Chinese:           "蛮荒大陆",
			author:                 "ForkKILLET",
			brief:                  "一款更新缓慢的文字 RPG 游戏，适合放置 $i smile-wink i$",
			version:
			{
				era:                "β",
				main:               0,
				sub:                2,
				upd:                6,
				toString:           () => `[VER ${this.info.version.era}${this.info.version.main}.${this.info.version.sub}.${this.info.version.upd}]`
			},
			first_update_time:      new Date(2019, 12 - 1, 7, 0, 0, 0),
			last_update_time:       new Date(2019, 12 - 1, 31, 0, 0, 0),
			github_repo_URL:        "https://github.com/ForkFG/ForkFG.github.io",
			github_repo_path:       "/BarrenLand",
			toString: () => `
---

$c #3d942d;**${this.info.name}（${this.info.name_Chinese}）** c$，是${this.info.brief}  

本次重置编号 \`β\`，初次上传于 \`${time(false, this.info.first_update_time)}\`，  

目前版本：\`${this.info.version.toString()}\`；  

最近更新时间：\`${time(false, this.info.last_update_time)}\`。  

可以在 $ib github ib$ [Github repo](${this.info.github_repo_URL}) 的 \`${this.info.github_repo_path}\` 目录下看到游戏代码，  

求 star $c #009c0c;$i star i$ c$ qwq  

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
				this.page_log("System", this.info.toString());
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
			if_log_animation:   { msg: "日志渐显特效",    unit: "Switch",     default: true,
			callback: (state) => this.if_log_animation = state },
			play_break:         { msg: "剧情显示间隔",    unit: "Input",      placeholder: "毫秒数", type: "number", default: 1000,
			callback: (value) => this.play_break = value },
			data_place:         { msg: "数据储存位置",    unit: "Select",     placeholder: "请选择", items: ["无", "localStorage"], default: 1,
			callback: (rank) => this.data_place = rank }
		};
		this.repaint_module_setting();

		this.log_data = {};
		this.page_log("System", "**BLS**: loaded.");
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
		$head.append($(`<div class="btn_square" name="clear"><i class="fas fa-trash-alt"></i></div>`));
		$("#module_log_head>.btn_square").click(this.clear_log_focused);
	}

	repaint_module_setting()
	{
		$("#module_setting").hide();
		let $head = $("#module_setting_head");
		$head.html(`<p>Setting</p>`)
			 .append(`<div class="btn_square no_animation" name="close"><i class="fas fa-times-circle"></i></div>`);
		$("#module_setting_head>.btn_square").click(() => this.toggle_module("setting"));
		let $body = $("#module_setting_body");
		$body.html("");

		for (let i in this.setting_info)
		{
			let value = this[i];
			if (is_empty(value)) value = this.setting_info[i].default;

			let $i = $(`<div></div>`), $j;
			$i.append(`<p>${this.setting_info[i].msg} </p>`);
			switch (this.setting_info[i].unit)
			{
			case "Switch":
				$j = $(`<div class="switch"></div>`);
				$i.append($j);
				$body.append($i);
				$j.on("_switch", (e, state) => this.setting_info[i].callback(state));
				if (value === true) $j.trigger("_switch", value).addClass("switch_on");
				break;
			case "Input":
				$j = $(`<input type="${this.setting_info[i].type}" placeholder="${this.setting_info[i].placeholder}">`);
				$j.on("_input", (e, value) =>
				{
					if (this.setting_info[i].type === "number") value = Number(value);
					this.setting_info[i].callback(value)
				});
				$i.append($j);
				$body.append($i);
				if (!is_empty(value)) $j.val(value).trigger("_input", value);
				break;
			case "Select":
				$j = $(`<div class="select"></div>`);
				$j
				.attr("placeholder", value ? `$${value}$` : this.setting_info[i].placeholder)
				.on("_select", () => this.setting_info[i].callback($j.data("itemChosen")));
				for (let j = 0; j < this.setting_info[i].items.length; j++) $j.data(`item${j + 1}`, this.setting_info[i].items[j]);
				$i.append($j);
				$body.append($i);
				if (!is_empty(value))
				{
					let item = this.setting_info[i].items[value - 1];
					$j.data("itemChosen", value).trigger("_select", value);
				}
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

		$(".tab_log.focused").removeClass("focused");
		$(".tav_log.focused").removeClass("focused").hide();

		$(`#tab_log_${name}`).addClass("focused").trigger("tab_focus");
		$(`#tav_log_${name}`).addClass("focused").show();

		if (this.log_info[name].counter === undefined) this.log_info[name].counter = 0;
		else this.log_info[name].counter++;
	}

	page_log(tav, msg, data, params)
	{
		this.focus_tab_log(tav);

		for (let l = /\${/, r = /}\$/, id, i, j, k = 0;; k = j + 2)
		{
			i = msg.substring(k).match(l);
			j = msg.substring(k).match(r);
			if (!i || !j) break;

			i = i.index;
			j = j.index;
			id = msg.substring(k + i + 2, j);
			if (!data || typeof(data[id]) !== "function")
				if (typeof(this.log_data[id]) !== "function")
					this.error_and_throw("C005", `"page_log" method expects a callback "${id}" in the "data" object but not found.`);
				else msg = msg.substring(k, i) + this.log_data[id]() + msg.substring(j + 2);
			else msg = msg.substring(k, i) + data[id]() + msg.substring(j + 2);
		}

		let $msg = $(`<p></p>`);
		$(`#tav_log_${tav}`).prepend($msg);
		if (!this.if_log_animation) $msg.addClass("no_animation");
		else setTimeout(() => $msg.css("opacity", 1), 200);

		if (this.ExMD) this.ExMD.render($msg, msg, params);
		else this.error_and_throw("C002", `"page_log" method require an "ExMD" object but didn't bind.`);
	}

	page_log_with_time(tav, msg, data, params) { this.page_log(tav, `${msg} $c #1eb6ff;[${time(true, null)}] c$`, data, params); }

	clear_log(name)
	{
		$(`#tav_log_${name}>p`).css("opacity", 0);
		setTimeout(() => $(`#tav_log_${name}`).html(""), 500);
	}

	clear_log_focused()
	{
		$(`.tav_log.focused`).html("");
	}

	message(type, msg, duration)
	{
		$("#module_message").append(`<div></div>`)
	}
}

class BarrenLandStorage
{
	constructor()
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ Storage\n${msg}`);
		this.warn = (code, msg) => console.warn(`[WARN: ${code}]: BarrenLand @ Storage\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ Storage\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!$ || typeof($) !== "function") this.error_and_throw("R001", "Require JQuery but not found the correct $ function.");
		if (!window.script || !window.script.main) this.error_and_throw("R002", "Require [icelava.top/main.js] but didn't find.");
		if (!BLS instanceof BarrenLandSystem) this.error_and_throw("C001", `Got an incorrect "BarrenLandSystem" object.`);

		if (!window.script.BarrenLandStorage) window.script.BarrenLandStorage = true;
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Storage`);

		this.load();
	}

	get(key)
	{
		return JSON.parse(localStorage.getItem(key));
	}

	set(key, value)
	{
		localStorage.setItem(key, JSON.stringify(value));
	}

	del(key)
	{
		localStorage.removeItem(key);
	}

	clear()
	{
		localStorage.clear();
	}

	save()
	{
		if (BLS.data_place === 1) return;
		for (let i in BLS.setting_info) this.set(i, BLS[i]);
		BLS.page_log_with_time("System", "**BLST**: settings saved.");
	}

	load()
	{
		if (BLS.data_place === 1 && (this.get("data_place") === 1 || this.get("data_place") === null)) return;
		for (let i in BLS.setting_info) BLS[i] = this.get(i);
	}
}

class BarrenLandUnit
{
	constructor(name, rule, init_callback)
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
		if (!BLS instanceof BarrenLandSystem) this.error_and_throw("C001", `Got an incorrect "BarrenLandSystem" object.`);

		if (!window.script.BarrenLandUnit) window.script.BarrenLandUnit = {};
		window.script.BarrenLandUnit[name] = true;
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Unit : ${name}`);

		this.name = name;
		this.rule = rule;
		this.all_objects = [];

		if (typeof(init_callback) !== "function") this.error_and_throw("C002", "Got an incorrect init callback.");
		else this.init = init_callback;
		this.binds = {};

		BLS.page_log("System", `**BLU**: \`${name}\` loaded.`);
	}

	update($sel)
	{
		let l = this.all_objects.length, i;
		for (i = 0; i < $sel.length; i++)
		{
			this.all_objects[l + i] = $($sel[i]);
			for (let j in this.binds) this.all_objects[l + i][j] = this.binds[j];
		}
		return [l, l + i];
	}

	all() { return $(":not(.inited)" + this.rule); }

	register($sel)
	{
		$sel.addClass("inited");
		this.init($sel);
		return this.update($sel);
	}

	register_all() { return this.register(this.all()); }

	bind_method(name, callback)
	{
		if (typeof(callback) !== "function")  this.error_and_throw("C003", "Got an incorrect bind callback.");
		this.binds[name] = callback;
	}
}

class BarrenLandPlot
{
	constructor(name, tav, list)
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ Plot : ${name}\n${msg}`);
		this.warn = (code, msg) => console.warn(`[WARN: ${code}]: BarrenLand @ Plot\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ Plot : ${name}\n${msg}`);
			console.error(e);
			throw e;
		};
		if (!BLS instanceof BarrenLandSystem) this.error_and_throw("C001", `Got an incorrect "BarrenLandSystem" object.`);

		if (!window.script.BarrenLandPlot) window.script.BarrenLandPlot = {};
		window.script.BarrenLandPlot[name] = true;
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Plot : ${name}`);

		this.name = name;
		this.tav = tav;
		this.list = list;

		BLS.start = () => {};
		this.play_num = 0;
		this.milestone_info =
		{
			start: (callback) =>
			{
				if (typeof(callback) !== "function")
					this.error_and_throw("C004", `The "start" type curring of "add_milestone" method expect a callback but didn't get a function.`);
				else
				{
					let old = BLS.start;
					BLS.start = () => { old(); callback(); };
					$("#tab_log_Diary").one("tab_focus", BLS.start);
				}
			},
			play_end: (play_rule, callback) =>
			{
				if (typeof(callback) !== "function")
					this.error_and_throw("C004", `The "start" type curring of "add_milestone" method expect a callback but didn't get a function.`);
				else $(document).on("_playend", (e, play_info) =>
				{
					for (let i in play_rule) if (play_rule[i] !== play_info[i]) return;
					callback();
				});
			}
		};

		BLS.page_log("System", `**BLP**: \`${name}\` loaded.`);
	}

	play(msg, data, params)
	{
		let play_info = {};
		play_info.id = this.play_num++;
		setTimeout(() => $(document).trigger("_playend", play_info), 500);

		BLS.page_log(this.tav, msg, data, params);
	}

	play_in_list(group)
	{
		let arr_play = this.list[group];
		if (typeof(arr_play) !== "object")
			this.error_and_throw("C002", `"play_in_list" method expect a play array but didn't get a correct object.`);
		let every_play = (i) =>
		{
			if (!arr_play[i]) return;
			if (!arr_play[i]["m"]) this.error_and_throw("C005", `"play_in_list" method expects a "m" prop in the play list, but not found in item [${i}].`);
			this.play(arr_play[i]["m"], arr_play[i]["data"],
            {
            	BI: arr_play[i]["BI"],
	            IP: arr_play[i]["IP"],
	            SL: arr_play[i]["SL"]
            });
			setTimeout(() => every_play(i + 1), BLS.play_break);
		};
		every_play(0);
	}

	add_milestone(type)
	{
		if (!this.milestone_info[type]) this.error_and_throw("C003", `"add_milestone" method got an unknown type "${type}".`);
		else return this.milestone_info[type];
	}
}

class BarrenLandCharacter // Note: 目前是个摆设……
{
	constructor()
	{
		this.name = "Anonymous";
	}
}

$(() =>
{
// Section: ExtendMarkdownParser Config
	let ExMD_new_labels =
	[
		{
			name: ["BLU_BI", "+"],
			space: [true, false],
			begin: `<span class="btn_inline">`,
			end: `</span>`
		},
		{
			name: ["BLU_IP", "="],
			space: [true, false],
			begin: `<input`,
			end: `>`,
			param:
			[
				{
					begin: ` placeholder="`,
					end: `"`,
					time: 1
				},
				{
					begin: ` type="`,
					end: `"`,
					time: 1
				}
			]
		},
		{
			name: ["BLU_SL", "#"],
			space: [true, false],
			begin: `<span class="select"`,
			end: `></span>`,
			param:
			[
				{
					begin: ` placeholder="`,
					end: `"`,
					time: 1
				},
				{
					begin: ` data-item$cnt$="`,
					end: `"`,
					time: Infinity
				}
			]
		}
	];
	ExMD.labels.push(...ExMD_new_labels);
	let ExMD_new_modules =
	{
		BI: ($sel, self, params) =>
		{
			let $btn = $sel.find(".btn_inline");
			if ($btn.length) for (let [j, k] = BLU_BI.register_all($btn), i = j, $i; i < k; i++)
			{
				$i = BLU_BI.all_objects[i];
				$i.click(() =>
				{
					params["BI"][i - j]();
					$i.disable($i);
				});
			}
		},
		IP: ($sel, self, params) =>
		{
			let $input = $sel.find("input");
			if ($input.length) for (let [j, k] = BLU_IP.register_all($input), i = j, $i; i < k; i++)
			{
				$i = BLU_IP.all_objects[i];
				$i.on("_input", () =>
				{
					if (params["IP"][i - j]($i.val())) $i.disable($i);
				})
			}
		},
		SL: ($sel, self, params) =>
		{
			let $select = $sel.find(".select");
			if ($select.length) for (let [j, k] = BLU_SL.register_all($select), i = j, $i; i < k; i++)
			{
				$i = BLU_SL.all_objects[i];
				$i.on("_select", () =>
				{
					let rank = $i.data("itemChosen"), item;
					if (rank === undefined)
					{
						rank = 0;
						item = $i.attr("placeholder");
					}
					else item = $i.data(`item${rank}`);
					if (params["SL"][i - j](rank, item)) $i.disable($i);
				})
			}
		}
	};
	Object.assign(ExMD.modules, ExMD_new_modules);

// Section: BarrenLandSystem
	window.BLS = new BarrenLandSystem(ExMD);

// Section: BarrenLandStorage
	window.BLST = new BarrenLandStorage();
	for (let i in BLS.setting_info)
	{
		let origin_callback = BLS.setting_info[i].callback;
		BLS.setting_info[i].callback = (p) =>
		{
			origin_callback(p);
			BLST.save();
		}
	}
	BLS.repaint_module_setting(); // Todo: Optimize this

// Section: BarrenLandUnit : BtnSquare
	window.BLU_BS = new BarrenLandUnit("BtnSquare", ".btn_square:not(.no_animation)", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.css("animation", "jelly 500ms")
			 .on("animationend", () => $this.css("animation", ""));
	}));
	BLU_BS.register_all();

// Section: BarrenLandUnit : BtnInline
	window.BLU_BI = new BarrenLandUnit("BtnInline", ".btn_inline", ($sel) => {});
	BLU_BI.bind_method("disable", ($sel) =>
	{
		let $pa = $sel.parents(), $msg;
		for (let i = 0; i < $pa.length; i++) if ($($pa[i]).hasClass("tav_log"))
		{
			$msg = $($pa[i - 1]);
			break;
		}
		$msg.find(".btn_inline").off("click").addClass("disabled");
	});

// Section: BarrenLandUnit : Switch
	window.BLU_SW = new BarrenLandUnit("Switch", ".switch", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.toggleClass("switch_on").trigger("_switch", $this.hasClass("switch_on"));
	}));
	BLU_SW.register_all();

// Section: BarrenLandUnit : BtnMicro
	window.BLU_BM = new BarrenLandUnit("BtnMicro", ".btn_micro", ($sel) => $sel.click((e) =>
	{
		let $this = $(e.currentTarget);
		$this.css("animation", "jelly 500ms")
			 .on("animationend", () => $this.css("animation", ""));
	}));

// Section: BarrenLandUnit : Input
	window.BLU_IP = new BarrenLandUnit("Input", "input", ($sel) =>
	{
		let $btn = $(`<div class="btn_micro btn_micro_submit"><i class="fas fa-check"></i></div>`);
		$sel.after($btn);
		BLU_BM.register($btn);
		$btn.click(() => $sel.trigger("_input", $sel.val()));
		$sel.keydown((e) =>
		{
			if (e.which === 13 || e.keyCode === 13) $btn.click();
		});
	});
	BLU_IP.bind_method("disable", ($sel) =>
	{
		$sel.addClass("disabled")
			.next(".btn_micro_submit")
			.addClass("disabled")
			.html(`<i class="fas fa-times"></i>`)
			.off("click")
	});
	BLU_IP.register_all();

// Section: BarrenLandUnit : Select
	window.BLU_SL = new BarrenLandUnit("Select", ".select", ($sel) =>
	{
		let $btn_2 = $(`<div class="btn_micro btn_micro_select"><i class="fas fa-angle-double-down"></i></div>`);
		$sel.after($btn_2);
		// Note: Needn't register because it's just a hint

		let $btn_1 = $(`<div class="btn_micro btn_micro_submit"><i class="fas fa-check"></i></div>`);
		$sel.after($btn_1);
		BLU_BM.register($btn_1);
		$btn_1.click((e) => $sel.trigger("_select", $sel.data("itemChosen")));

		let $select_list = $(`<div class="select_list"></div>`);
		let placeholder = $sel.attr("placeholder"), if_default_item = /^\$\d+\$$/.test(placeholder), default_rank;
		if (if_default_item)
		{
			default_rank = parseInt(placeholder.substring(1, placeholder.length - 1));
			placeholder = $sel.data(`item${default_rank}`);
		}
		$sel.append(`<p${if_default_item ? "" : ` class="placeholder"` }>${placeholder}</p>`).append($select_list);
		for (let i = 1, item, $item;; i++)
		{
			item = $sel.data(`item${i}`);
			if (!item) break;
			$item = $(`<div class="select_item" data-rank="${i}"></div>`);
			$select_list.append($item);
			$item.html(item).click(() =>
			{
				$sel.data("itemChosen", i).children("p:first-child").html(item);
				$select_list.find(".select_item_chosen").removeClass("select_item_chosen");
				$item.addClass("select_item_chosen");
			});
		}

		if (!if_default_item) $sel.find(".select_item").one("click", () => $sel.children("p:first-child").removeClass("placeholder"));
		else $sel.find(`.select_item:nth-child(${default_rank})`).addClass("select_item_chosen");

		$sel.click(() =>
		{
			if ($select_list.css("visibility") === "visible")
			{
				$sel.removeClass("focused");
				$select_list.css("opacity", 0);
				setTimeout(() => $select_list.css("visibility", "hidden"), 500);
			}
			else
			{
				$sel.addClass("focused");
				$select_list.css("visibility", "visible").css("opacity", 1);
			}
			$btn_2.children("i").toggleClass("fa-angle-double-down").toggleClass("fa-angle-double-up");
		});
	});
	BLU_SL.bind_method("disable", ($sel) =>
	{
		$sel.removeClass("focused").addClass("disabled")
			.off("click")
			.next(".btn_micro_submit")
			.addClass("disabled")
			.html(`<i class="fas fa-times"></i>`)
			.next(".btn_micro_select").remove()
			.off("click")
	});
	BLU_SL.register_all();

// Section: BarrenLandPlot : MainStory
	window.BLP_MS = new BarrenLandPlot("MainStory", "Diary",
	{
		"0": [
			{   m: "作为一个租房住的大学生，你结束了一天的**刻苦**学习，走回家，放下书包，熟练地打开你的 Macbook Pro。" },
			{   m: "“干什么呢？”你想了想，随后" + random_item(
				[
					"玩起了 $i cubes i$ Minecraft，打算继续做昨天的红石机器人。",
					"开始看[《诡秘之主》](https://book.qidian.com/info/1010868264)的新章节，乌贼又断章了，难受。",
					"愉快地刷起了朋友圈。",
					"瞄了一眼 [slay.one](https://slay.one)，发现还是不能玩。"
				]
			)},
			{   m: "**“啪——嗒”**，你听到了什么东西掉落的声音。" },
			{   m: "你回头一看，只见地面上躺着一块漆黑的纸片状物品。" },
			{   m: "你疑惑地捡起了它。" },
			{   m: "看起来很薄的 “纸片”，拎在手里却并不轻，或许比一个鼠标还重。" },
			{   m: "正当你观察它时，上面亮起了白色的文字：" },
			{   m: "“世界那么**多**，你不想去看看嘛？”" },
			{   m: "你心想：“什么叫 ‘多’ 啊……这是同学无聊做的整人道具？我来研究一下——”" },
			{   m: "“纸片” 上又亮起了文字：“研究你 $i horse-head i$ 哦，我问你要不要去**异世界**！”" },
			{   m: "“异世界？笑死老子了……” 你正在思考是哪个沙雕同学做的，突然发现了一个问题：" },
			{   m: "“这个纸片怎么知道我要研究它？！”" },
			{   m: "“我是**「域牌」**当然知道你在想什么，傻 X，再问你最后一遍要不要去别的世界！”" },
			{   m: "“似乎这个什么「域牌」，在邀请我穿越？它为什么要这么做？是不是要骗我去……”" },
			{   m: "“谁骗你啊，这么好的机会别人都是抢着要的真搞不懂你——我倒数了啊，**3、**”" },
			{   m: "“感觉这玩意很神奇但是……”" },
			{   m: "“**2、**”" },
			{   m: "“就算穿越之后回不来，嗯，不对，这东西似乎是可以双向的吧？是的吧？”" },
			{   m: "“**1！**$i angry i$”" },
			{   m: "你做出了决定$+我要去！+$ $+算了吧+$",
				BI:
				[
					() => BLP_MS.play_in_list("0A0"),
					() => BLP_MS.play_in_list("0B0")
				]
			}
		],
		"0A0": [
			{   m: "你手中「域牌」亮起新的文字：“很好。那么，你的名字是？”" },
			{   m: "你正要回答，「域牌」打断了你：“你可以为自己取个新的名字。”" },
			{   m: "“为啥？”" },
			{   m: "“**如果**异世界的人都叫" + random_item(
				[
					"“克莱恩”", cb("空白", "#d0d0d0"), "“艾默丝”", "“安娜”", "“威尔逊”"
				]
				) + "一类的名字，你原先的名字可能就会比较奇怪——" },
			{   m: "当然，行不改名坐不改姓也是比较**方便**的做法。”" },
			{   m: "域牌上文字消失，亮起了一个方框。 $=你的名字=$",
				IP:
				[
					(value) =>
					{
						if (value.length < 2 || value.length > 16) return false;
						BLC_P.name = value;
						BLP_MS.play_in_list("0A1");
						return true;
					}
				]
			}
		],
		"0B0": [
			{   m: "选这个对你有好处吗，，剧情策划中……" }
		],
		"0A1": [
			{	m: "域牌：“${name}$，在离开这里之前，你可以带点东西……说不定有什么用处呢？或者当个纪念也行哦。" },
			{	m: "“但是必须能放进 2dm x 2dm x 2dm 的立方体空间里面。”" },
			{	m: "你环顾左右，适合带的物品有 4 件。你选择了 $#不拿;拉菲手办;华为手机;绿萝盆栽;便当盒子#$。",
				SL:
				[
					(rank, item) =>
					{
						if (rank === 0)
						{
							BLP_MS.play_in_list("0A1A0");
							return false;
						}
						else
						{
							BLC_P.origin = { id: rank, name: item };
							BLP_MS.play_in_list("0A1A1");
							return true;
						}
					}
				]
			}
		],
		"0A1A0": [
			{   m: "域牌：“不不，不能不拿。这很重要的。你还是拿个什么吧？”" }
		],
		"0A1A1": [
			{	m: "“准备好了吗，${name}$？”" },
			{	m: "你毫无犹豫地回答：“是的船长！”" },
			{   m: "「域牌」：“那么，带上你的${origin_name}$，出发吧！”" },
			{	m: "你手上的「域牌」突然抖动起来。" },
			{	m: "抖动得越来越剧烈。" },
			{	m: "这时，有数根不可名状的深蓝色线条从「域牌」的中心处凭空 “生长” 出来。" },
			{	m: "线条迅速地在空中延伸，一下子就从你身边穿过。" },
			{	m: "你急忙转过身去，发现众多深蓝线条已经把你团团围住。" },
			{	m: "于此同时，另外一些颜色较浅的蓝色线条则是 “框起” 了你的${origin_name}$。" },
			{	m: "你的周围逐渐被纯粹的蓝色占据……" },
			{   m: "剧情策划中……" }
		]
	});

	BLS.page_log("System", "暂未开放 **存/读档** 功能。请直接 $+开始游戏+$", null, { BI: [() => BLS.focus_tab_log("Diary")] });
	BLP_MS.add_milestone("start") (() => BLP_MS.play_in_list("0"));

// Section: BarrenLandCharacter : Player
	window.BLC_P = new BarrenLandCharacter();
	BLS.log_data =
	{
		name: () => cb(BLC_P.name, "#009c0c"),
		origin_name: () => cb(BLC_P.origin.name, "#ff2890")
	};
});