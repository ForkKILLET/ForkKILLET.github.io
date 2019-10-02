// Note: 功能函数的定义

function NF(){}

function log(info)
{
	console.log(info);
}

function AJAX(type, url, MIME, value, fn_cb)
{
	let XHR = new XMLHttpRequest();
	XHR.open(type, url);
	XHR.setRequestHeader("Content-Type", MIME);
	XHR.withCredentials = true;
	XHR.onreadystatechange =
		function()
		{
			if (XHR.readyState === 4 && XHR.status === 200)
				fn_cb(XHR);
		};
	XHR.send(value);
}

function is_local()
{
	return location.href.indexOf("localhost") !== -1 || location.href.indexOf("file:///") !== -1;
}

// Note: 开始 JQuery 搞事。
$(document).ready(function()
{
	// Note: 插入导航栏（侧边栏）
	let $body = $("body");
	$body.prepend(`<div id="guide"></div>`);
	$("#guide").html([`
        <a href="http://icelava.ga/" class="title" id="home">
            <i class="fa fa-home"></i> Home
        </a>
        
        <div id="user">
            <a class="text" href="http://icelava.ga/sign_up">Sign up </a>
            <p class="text"><i class="fa fa-sign-in"></i></p>
            <a class="text" target="_blank" href="http://icelava.ga/sign_in">in</a>
        </div> <hr>
        
        <a href="http://icelava.ga/site_map" class="text">
            <i class="li-icon fa-fw fa fa-sitemap"></i> Site Map
        </a>
        
        <a href="http://icelava.ga/friends" class="text">
            <i class="li-icon fa-fw fa fa-heart"></i> Friends
        </a>
        
        <a href="http://icelava.ga/about_us" class="text">
            <i class="li-icon fa-fw fa fa-info-circle"></i> About us
        </a>
        
        <a href="http://icelava.ga/log" class="text">
            <i class="li-icon fa-fw fa fa-file-text"></i> Log
        </a> <hr>
    
        <p class="text"><i class="li-icon fa-fw fa fa-rss-square"></i> Blogs</p>
        <a href="http://icelava.ga/blogs/ForkKILLET" class="text">
            <i class="li-icon fa-fw fa fa-check"></i> ForkΨKILLET's
        </a> <hr>
    
        <img id="logo" alt="logo" src="https://s2.ax1x.com/2019/10/01/uNUSHg.md.jpg" width="210px">
        <p class="text">
            <span style="color: #ff5b5a">RED</span> ICE - WE<br>
            <span style="color: #0e61e1">blue</span> lava~world
        </p> <hr>
    
        <p class="text">
            <i class="li-icon fa-fw fa fa-mouse-pointer"></i> Hits
            <img id="counter" alt="counter" src="http://www.cutercounter.com/hits.php?id=geqpdpp&nd=7&style=72"> 
        </p>
    `][0]); // Note: 便于折叠代码。
	$body.prepend(`<div id="user_op"></div>`);

	// Note: 用户功能
	$("#user_op").hide().html(`<p class="text"><i class="fa fa-sign-out"></i> Sign out</p>`);
	$("#user_op>.text:first-child").click(function()
	{
		AJAX("GET", "http://loli.icelava.ga/sign_out.php", "application/x-www-form-urlencoded", null,
		function()
		{
			location.reload();
		});
	});
	$("#user>.text:first-child,#user>.text:last-child").click(function()
	{
		location.reload();
	});

	$("#user")
	.data("tourist", true)
	.click(function()
	{
		if ($("#user").data("tourist") === false)
			$("#user_op").toggle();
	});

	// Note: 亮闪闪的 5 毛钱特效。
	let $pos = $("#pos");
	$pos.css("left", "calc(100% - 50px - " + $pos.width() + "px)")
	    .animate({"left": "300px"}, 1000, "swing");

	// Note: 在 #main 下面写版权信息。
	$body.append(`<p id="copyright" class="text">Copyright© 2019 IceLava Dev Team. All Rights Reserved</p>`);

	// Note: 如果不是本地，token 登录。
	if (!is_local())
		AJAX("GET", "http://loli.icelava.ga/get_token.php", "application/x-www-form-urlencoded", null,
		function(XHR)
		{
			let token = XHR.responseText;
			if (!token)return;
			let un = JSON.parse(token)["un"];
			let $user = $("#user");
			$user.data("tourist", false);
			$user.html(`<p id="btn_user" class="text"><i class="li-icon fa-fw fa fa-user"></i> ` + un + `</p>`);
		});

	// Note: MD 渲染的一系列操作。
	class ExtendedMarkdownParser
	{
		constructor()
		{
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
				{ // Note: 上标 e.g. $^awa^$
					name: ['sup', '^'],
					space: [true, false],
					begin: `<sup>`,
					end: `</sup>`
				},
				{ // Note: 下标 e.g. $_awa_$
					name: [true, false],
					space: false,
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
				{ // Note: 颜色 e.g. $color red;text here color$ $c #D0E4FE;Barren Land c$
					name: ['color', 'c'],
					space: [true, true],
					begin: `<span`,
					end: `</span>`,
					param:
					[
						{
							begin: ' style="color: ',
							end: '">',
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
							begin: `<strong class="text">`,
							end: `$nbsp</strong>`,
							time: 1
						},
						{ // Note: 音标
							begin: `<p class="text">/`,
							end: `/$nbsp</p>`,
							time: 1
						},
						{ // Note: 词性
							begin: `<em class="text">`,
							end: `$nbsp</em>`,
							time: 1
						},
						{ // Note: 中文
							begin: `<p class="text">`,
							end: `$nbsp</p>`,
							time: 1
						},
						{ // Note: 例句
							begin: `<a class="text wordbox-stc-btn">@</a> <br> <div class="text wordbox-stc">`,
							end: `</div>`,
							time: 1
						}
					]
				}
			];
			this.callbacks =
			{
				wordbox: function(e)
				{
					$(e).find(".wordbox .wordbox-stc-btn:not(.ready)")
						.click(function()
						{
							$(this).parent().children(".text:last-child").fadeToggle(500);
						})
						.addClass("ready")
						.parent().children(".text:last-child").hide();
					let $p = $(e).find(".wordbox>.text:nth-child(2)");
					for (let i = 0; i < $p.length; i++)
					{
						let $i = $($p[i]);
						if ($i.html() === "//&nbsp;")$i.remove();
					}
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
			if (typeof this.nMD !== "function")console.warn("ExMD: Didn't bind a normal Markdown parse function.");
			else str = this.nMD(str);
			
			// Note: 执行转义
			for (let i in this.escape)
				str = str.replace(RegExp(RegExp_escape(this.escape[i].from), "g"), this.escape[i].temp);
			
			// Note: ExMD
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
						// 因为对于形如 $label [A] $label [B] label$ label$ 的 ExMD 字符串，
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
			for (let i in this.callbacks) this.callbacks[i](e);
			if (typeof this.Maths === "function")this.Maths(e);
		}
		settings(s)
		{
			let names = ["nMD", "Maths"];
			for (let i in s)
				if (names.indexOf(i) !== -1)this[i] = s[i];
				else console.warn("ExMD: '" + i + "' is not an available setting.");
		}
	}
	
	MathJax.Hub.Config(
	{
		messageStyle: "none",
		tex2jax:
		{
			inlineMath: [["$m ", " m$"]],
			displayMath: [["$M ", " M$"]],
			skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"]
		}
	});
	marked.setOptions(
	{
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false,
		highlight: function(code)
		{
			return hljs.highlightAuto(code).value;
		}
	});
	window.ExMD = new ExtendedMarkdownParser();
	ExMD.settings(
	{
		nMD: marked,
		Maths: function(e)
		{
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, e]);
		}
	});
	
	if (!is_local())
	{
		let $md_areas = $(".md");
		
		function mf_show_md(i)
		{
			return function(XHR)
			{
				ExMD.render($md_areas[i], XHR.responseText);
			};
		}
		
		// Note: 获取 Markdown 并解析显示。
		for (let i = 0; i < $md_areas.length; i++)
		{
			if ($($md_areas[i]).data("name") == null) continue;
			AJAX
			(
				"GET", "http://loli.icelava.ga/load_md.php?name=" + $($md_areas[i]).data("name"),
				"application/x-www-form- urlencoded", null,
				mf_show_md(i)
			);
		}
	}
});
