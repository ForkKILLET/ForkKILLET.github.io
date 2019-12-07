class ExtendedMarkdownParser
{
	constructor()
	{
		if (!window.log) window.log = (msg) => console.log(msg);
		this.log = (msg) => log(`[INFO]: ExtendedMarkdownParser\n${msg}`);
		this.warn = (code, msg) => console.warn(`[WARN: ${code}]: ExtendedMarkdownParser\n${msg}`)
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: ExtendedMarkdownParser\n${msg}`);
			console.error(e);
			throw e;
		};
		if (!$ || typeof($) !== "function") this.error_and_throw("R001", `Need JQuery but "$" function isn't correct.`);
		if (!window.script) window.script = {};
		window.script.ExtendedMarkdownParser = true;
		log("[LOAD]: icelava.top/ExtendedMarkdownParser/main.js");

		this.nMD = null;
		this.Maths = null;
		this.escape =
		[
			{ from: '\\$', temp: '$dlr', to: '$'},
			{ from: '\\\\', temp: '$sls', to: '\\' },
			{ from: '\\;', temp: '$smc', to: ';' },

			{ from: '&nbsp;', temp: '$nbsp', to: '&nbsp;' },
			{ from: '&amp;', temp: '$amp', to: '&amp;' },
			{ from: '&lt;', temp: '$lt', to: '&lt;' },
			{ from: '&gt;', temp: '$gt', to: '&gt;' },
			{ from: '&#39;', temp: '$sq', to: '&#39;' }
		];
		this.labels =
		[
			{ // Note: 目录生成标志 e.g. $contents$ $toc$
				name: ['contents', 'toc'],
				space: [false, false],
				begin: `<span class="contents_mark">`,
				end: `</span>`
			},
			{ // Note: 上标 e.g. $^awa^$
				name: ['sup', '^'],
				space: [true, false],
				begin: `<sup>`,
				end: `</sup>`
			},
			{ // Note: 下标 e.g. $_awa_$
				name: ["sub", "_", "-"],
				space: [true, false, false],
				begin: `<sub>`,
				end: `</sub>`
			},
			{ // Note: 图标 e.g. $fa font-awesome fa$ $i spin;fw;cogs i$
				name: ['font-awesome', 'fa', 'i'],
				space: [true, true, true],
				begin: `<i class="fa`,
				end: `"></i>`,
				param:
				[
					{
						begin: ' fa-',
						end: '',
						time: Infinity
					}
				]
			},
			{ // Note: 颜色 e.g. $color red;text here color$ $c #D0E4FE;BarrenLand c$
				name: ['color', 'c'],
				space: [true, true],
				begin: `<span`,
				end: `</span>`,
				param:
				[
					{
						begin: ' style="color: ',
						end: ';">',
						time: 1
					}
				]
			},
			{ // Note: 背景颜色 e.g. $background #C5C5C5;text here background$ $bc #FFE37C;Orange! bc$
				name: ['background', 'bc'],
				space: [true, true],
				begin: `<span`,
				end: `</span>`,
				param:
				[
					{
						begin: ' style="background-color: ',
						end: ';">',
						time: 1
					}
				]
			},
			{ // Note: 强调 e.g. $!text here!$
				name: ['important', 'im',  '!'],
				space: [true, true, false],
				begin: `<span class="important">`,
				end: `</span>`
			},
			{ // Note: 刮刮乐 e.g. $?hover on me!?$
				name: ['lottery', '?'],
				space: [true, false],
				begin: `<span class="lottery">`,
				end: `</span>`
			},
			{ // Note: 词汇盒子
				name: ['wordbox', 'w'],
				space: [true, true],
				begin: `<div class="wordbox">`,
				end: `</div>`,
				param:
				[
					{ // Note: 英文
						begin: `<strong>`,
						end: `$nbsp</strong>`,
						time: 1
					},
					{ // Note: 音标
						begin: `<p>/`,
						end: `/$nbsp</p>`,
						time: 1
					},
					{ // Note: 词性
						begin: `<em>`,
						end: `$nbsp</em>`,
						time: 1
					},
					{ // Note: 中文
						begin: `<p>`,
						end: `$nbsp</p>`,
						time: 1
					},
					{ // Note: 例句
						begin: `<a>@</a> <br> <div>`,
						end: `</div>`,
						time: 1
					}
				]
			}
		];
		this.modules =
		{
			wordbox: (e) =>
			{
				$(e).find(".wordbox>a:not(.ready)")
					.click(() => $(this).parent().children("a.ready~*").fadeToggle(500))
					.addClass("ready")
					.parent().children("a.ready~*").hide();
				let $p = $(e).find(".wordbox>p:nth-child(2)");
				for (let i = 0; i < $p.length; i++)
				{
					let $i = $($p[i]);
					if ($i.html() === "//&nbsp;")$i.remove();
				}
			},
			contents: (e) =>
			{
				let $m = $(e).find(".contents_mark");
				if ($m.length !== 1)return;

				let $titles = $m.parent().find("~ h1, ~ h2");
				let HTML = `<div class="contents"><h1>Contents <i class="fa fa-angle-right"></i></h1>`;
				for (let i = 0; i < $titles.length; i++)
				{
					let e = $titles[i];
					let s = e.innerHTML;
					s = s.replace(/<a.+?>/g, "")
						.replace(/<\/a>/g, "");
					if (e.tagName === "H1")
					{
						if (i > 0)HTML += `</ul>`;
						HTML += `<a href="#${e.id}">${s}</a> <ul>`;
					}
					else
					{
						HTML += `<li><a href="#${e.id}">${s}</a></li>`
					}
				}
				HTML += `</div>`;
				$(e).append($(HTML));

				HTML = `<div class="btn_contents"><i class="fa fa-angle-left"></div>`;
				$(HTML)
					.appendTo($(e))
					.hide()
					.click(() =>
					       {
						       $(this).fadeOut();
						       $(e).find(".contents").fadeIn();
					       });

				$(e).find(".contents>h1").click(() =>
				                                {
					                                $(this).parent().fadeOut();
					                                $(e).find(".btn_contents").fadeIn();
				                                });
			},
			Maths: function(e, ExMD)
			{
				if (typeof ExMD.Maths === "function")ExMD.Maths(e);
			}
		};
	}
	parse(str)
	{
		function RegExp_escape(str)
		{
			if (str)
			{
				let chars = ["\\\\", "\\/" , "\\(", "\\)", "\\[", "\\]", "\\{", "\\}", "\\*", "\\+", "\\?", "\\$",  "\\^", "\\."];
				for (let c in chars)
					str = str.replace(RegExp(chars[c], "g"), chars[c]);
			}
			return str;
		}

		if (!str) return undefined;

		// Note: 普通 MD 处理
		if (typeof this.nMD !== "function") this.warn("C001", "Didn't bind a normal Markdown parse function.");
		else str = this.nMD(str);

		// Note: 执行转义
		for (let i in this.escape)
			str = str.replace(RegExp(RegExp_escape(this.escape[i].from), "g"), this.escape[i].temp);

		// Note: ExtendedMarkdownParser
		function parse_label(rule, str) // Note: 传入标签规则和标签内的内容，返回解析后的字符串。
		{
			let arr_param = str.split(";");
			if (rule.param) for
			(
				let param_i = 0, param_type = 0, param_time = 0;
				param_i < arr_param.length;
				param_i++, param_time++
			)
			{
				if (param_time === rule.param[param_type].time)
				{
					param_time = 0;
					param_type++;
					if (!rule.param[param_type]) break;
				}
				arr_param[param_i] = rule.param[param_type].begin + arr_param[param_i] + rule.param[param_type].end;
			}
			return rule.begin + arr_param.join("") + rule.end;
		}

		for (let i in this.labels) // Note: 遍历标签规则。
		{
			let v = this.labels[i];

			for (let j in v.name) // Note: 遍历该标签的每个名称。
			{
				// Note: 获取标签的开关标记内容。
				let str_begin = "$" + v.name[j] + (v.space[j] ? " " : "");
				let str_end = (v.space[j] ? " " : "") + v.name[j] + "$";

				let k = str.length;
				while (1)
				{
					// Note:
					// 寻找标签。此处注意需要利用 "倒数第一个开标签" 来定位子串。
					// 因为对于形如 $label [A] $label [B] label$ label$ 的 ExtendedMarkdownParser 字符串，
					// 我们需要先解析 $label [B] label$ 的部分。若是直接正序匹配，我们会得到一个错误的字串
					// $label [A] $label [B] label$。
					let pos_begin = str.substring(0, k).lastIndexOf(str_begin);
					if (pos_begin === -1) break;
					let pos_label_end = str.substring(pos_begin).indexOf(str_end);
					if (pos_label_end === -1) break;
					pos_label_end += pos_begin;
					let pos_label_begin = pos_begin + str_begin.length;
					let pos_end = pos_label_end + str_end.length;
					k = pos_begin - 1;

					let label_str = str.substring(pos_label_begin, pos_label_end);

					// Note: 将原标签替换解析后的内容。
					str = str.substring(0, pos_begin) + parse_label(v, label_str) + str.substring(pos_end);
				}
			}
		}

		// Note: 还原转义
		for (let i in this.escape)
			str = str.replace(RegExp(RegExp_escape(this.escape[i].temp), "g"), this.escape[i].to);

		return str;
	}
	render(e, str)
	{
		e.innerHTML = this.parse(str);
		for (let i in this.modules) this.modules[i](e, this);
	}
	settings(s)
	{
		let names = ["nMD", "Maths"];
		for (let i in s) if (names.indexOf(i) !== -1)this[i] = s[i];
		else this.warn("C002", `"${i}" isn't an available setting.`);
	}
}