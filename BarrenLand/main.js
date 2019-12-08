class BarrenLandSystem
{
	constructor()
	{
		if (!window.log) window.log = (msg) => console.log(msg);
		if (!window.time) window.time = () =>
		{
			let d = new Date(),
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
			return `${Y}-${M}-${D}  ${h}:${m}:${s}`;
		};
		this.log = (msg) => log(`[INFO]: BarrenLand @ System\n${msg}`);
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: BarrenLand @ System\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!window.script || !window.script.main) this.error_and_throw("R001", "Need [icelava.top/main.js] but didn't find.");
		window.script.BarrenLand = true;
		log("[LOAD]: icelava.top/BarrenLand/main.js @ System");

		$("#btn_toggle_guide").trigger("click"); // Note: 隐藏导航栏

		// Note: 默认进入 mode 1
		this.game_mode = 0;
		this.change_game_mode();

		// Note: 渲染 module 选择栏
		this.module_info =
		{
			explore:    { fa_name: "running",       color: "#1eb6ff", available: true, position: 1, rank: 0 },
			info:       { fa_name: "info-circle",   color: "#ff2890", available: true, position: 2, rank: 1 },
			setting:    { fa_name: "cog",           color: "#4d4d4d", available: true, position: 2, rank: 0 }
		};
		this.repaint_module_change();

		// Note: 渲染日志
		this.log_info =
		{
			system:     { fa_name: "terminal",      rank: 233 }
		};
		this.repaint_module_log();
		this.focus_tab_log();
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
			$(`#module_change_${this.module_info[i].position}`).append(`<div id="btn_module_${i}" class="btn_module"></div>`);
			$(`#btn_module_${i}`).attr("name", i)
								 .addClass(this.module_info[i].position === 1 ? "btn_module_top" : "btn_module_bottom")
								 .css("order", this.module_info[i].rank)
								 .css("backgroundColor", this.module_info[i].color)
								 .append(`<i class="fas fa-${this.module_info[i].fa_name}"></i>`);
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
			$(`#tab_log_${i}`).append(`<i class="fas fa-${this.log_info[i].fa_name}"></i>&nbsp;<p>${i}</p>`)
			$body.append(`<div id="tav_log_${i}" class="tav_log"></div>`);
		}
	}

	focus_tab_log(name)
	{
		$(".tab_log_focus").removeClass("tab_log_focus");
		$(".tav_log").hide();
		if (name)
		{
			$(`#tab_log_${name}`).addClass("tab_log_focus");
			$(`#tav_log_${name}`).show();
		}
		else
		{
			$("#module_log_head>.tab_log:first-child").addClass("tab_log_focus");
			$("#module_log_body>.tav_log:first-child").show();
		}
	}

	page_log(tav, msg)
	{
		$(`#tav_log_${tav}`).append(`<p>${msg}</p>`);
	}
}

$(() =>
{
	window.BLS = new BarrenLandSystem();
	BLS.page_log("system", `[${time()}] System loaded.`);
});