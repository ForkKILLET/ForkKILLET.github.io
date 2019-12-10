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

class BarrenLandSystem
{
	constructor()
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

		// Note: 默认进入 mode 1
		this.game_mode = 0;
		this.change_game_mode();

		// Note: 渲染 module 选择栏
		this.info = function ()
		{
			this.name =                 "BarrenLand";
			this.name_Chinese =         "蛮荒大陆";
			this.author =               "ForkKILLET";
			this.brief =                "一款更新缓慢的文字 RPG 游戏，适合放置（手动滑稽）";
			this.version =              function ()
			{
				this.era = "β";
				this.main = 0;
				this.sub = 2;
				this.fix = 0;
				this.toString = () => `[VER ${this.era}${this.main}.${this.sub}.${this.fix}]`
			};
			this.first_update_time =    new Date(2019, 12 - 1, 7, 0, 0, 0);
			this.last_update_time =     new Date(2019, 12 - 1, 9, 0, 0, 0);
			this.github_repo_URL = "https://github.com/ForkFG/ForkFG.github.io";
			this.github_repo_path = "/BarrenLand";
			this.toString = () => `
==========================================================================================
$c #3d942d;**${this.name}（${this.name_Chinese}）** c$，是${this.brief}。
本次重置编号 \`β\`，初次上传于 \`${time(false, this.first_update_time)}\`，
目前版本：\`${(new this.version()).toString()}\`；
最近更新时间：\`${time(false, this.last_update_time)}\`。
可以在 [Github repo](${this.github_repo_URL}) 的 \`${this.github_repo_path}\` 目录下看到游戏代码，
求 star $c #efe942;$i star i$ c$ qwq
==========================================================================================
`;
		};
		this.module_info =
		{
			explore:    { fa_name: "running",       color: "#1eb6ff", available: true, position: 1, rank: 0 },
			info:       { fa_name: "info-circle",   color: "#ff2890", available: true, position: 2, rank: 1,
			callback: () =>
			{
				this.focus_tab_log("system");
				this.page_log("system", (new this.info()).toString(), true, ExMD);
			}},
			setting:    { fa_name: "cog",           color: "#4d4d4d", available: true, position: 2, rank: 0 }
		};
		this.repaint_module_change();

		// Note: 渲染日志
		this.log_info =
		{
			story:      { fa_name: "book",          color: "#3d942d",  rank: 0 },
			system:     { fa_name: "terminal",      color: "#000000",  rank: 233 },
		};
		this.repaint_module_log();
		this.focus_tab_log("system");

		this.page_log_with_time("system", "**BarrenLand System** loaded.", true, ExMD);
	}

	change_game_mode()
	{
		if (this.game_mode === 1)
		{
			$("#main_1").hide();
			$("#main_2").show();
			this.game_mode = 2;
		}
		else
		{
			$("#main_1").show();
			$("#main_2").hide();
			this.game_mode = 1;
		}
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
		let $btn = $("#btn_log_clear");
		if ($btn.html() === "") $btn.addClass("btn_square").html(`<i class="fas fa-trash-alt"></i>`);
	}

	focus_tab_log(name)
	{
		$(".tab_log_focused").removeClass("tab_log_focused");
		$(".tav_log").hide();

		$(`#tab_log_${name}`).addClass("tab_log_focused");
		$(`#tav_log_${name}`).addClass("tav_log_focused").show();
	}

	bind_ExMD_object(ExMD)
	{
		if (typeof(ExMD) !== "object" || typeof(ExMD.render) !== "function")
			this.error_and_throw("C001", `Got a instruction to render ExMD, but didn't find correct "ExMD" object with "render" method.`);
		this.ExMD = ExMD;
	}

	page_log(tav, msg, if_ExMD, ExMD)
	{
		msg += "\n";
		msg = msg.replace(/\n{2,}$/, "\n\n")
			     .replace(/\n/g, "<br>")
			     .replace(/\[\[/g, "<span class='btn_inline'>")
			     .replace(/]]/g, "</span>");
		$(`#tav_log_${tav}`).prepend(`<p>${msg}</p>`);
		let $msg = $(`#tav_log_${tav}>p:first-child`);
		setTimeout(() => $msg.css("opacity", 1), 200);

		if (if_ExMD)
		{
			if (this.ExMD) this.ExMD.render($msg[0], $msg.html());
			else if (typeof(ExMD) !== "object" || typeof(ExMD.render) !== "function")
				this.error_and_throw("C001", `Got a instruction to render ExMD, but didn't find correct "ExMD" object with "render" method.`);
			else ExMD.render($msg[0], $msg.html());
		}

		let $btn_inline = $msg.find(".btn_inline");
		return (arr_callback) =>
		{
			if (typeof(arr_callback) !== "object") arr_callback = [arr_callback];
			for (let i = 0; i < $btn_inline.length; i++)
			{
				$($btn_inline[i]).click(arr_callback[i]);
			}
		};
	}

	page_log_with_time(tav, msg, if_ExMD, ExMD)
	{
		this.page_log(tav, `[${time(true, null)}] ${msg}`, if_ExMD, ExMD);
	}

	clear_log(name)
	{
		$(`#tav_log_${name}>p`).css("opacity", 0);
		setTimeout(() => $(`#tav_log_${name}`).html(""), 500);
	}

	clear_log_focused()
	{
		$(`.tav_log_focused>p`).css("opacity", 0);
		setTimeout(() => $(`.tav_log_focused`).html(""), 500);
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
		log(`[LOAD]: icelava.top/BarrenLand/main.js @ Unit : ${name}`);

		this.name = name;
		this.rule = rule;

		if (typeof(reg_callback) !== "function") this.error_and_throw("C002", "Got an incorrect register callback.");
		else this.reg = reg_callback;

		BLS.page_log_with_time("system", `**BarrenLand Unit**: \`${name}\` loaded.`, true, ExMD);
	}

	register($sel)
	{
		this.reg($sel);
		$sel.data("registered", true);
	}

	all() { return $(this.rule); }

	register_all() { this.register(this.all()); }
}

class BarrenLandPlot
{
	constructor(BLS, name)
	{
		this.log = (msg) => log(`[INFO]: BarrenLand @ Plot : ${name}\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ Plot : ${name}\n${msg}`);
			console.error(e);
			throw e;
		};
	}

	add_milestone()
	{

	}
}

$(() =>
{
	window.BLS = new BarrenLandSystem();
	BLS.bind_ExMD_object(ExMD);

	window.BLU_BS = new BarrenLandUnit(BLS, "BtnSquare", ".btn_square", ($sel) =>
	{
		$sel.click((e) =>
		{
			let $this = $(e.currentTarget);
			$this.css("animation", "jelly 500ms")
				 .on("animationend", () => $this.css("animation", ""));
		});
	});
	BLU_BS.register_all();
	$("#btn_log_clear").click(BLS.clear_log_focused);

	window.BLU_BI = new BarrenLandUnit(BLS, "BtnInline", ".btn_inline", ($sel) => {});

	BLS.page_log("system", "暂未开放 **存/读档** 功能。请直接 [[开始游戏]]\n", true)(() =>
    {
        BLS.focus_tab_log("story");
        BLS.page_log("story", "剧情正在策划重置中……");
    });
});