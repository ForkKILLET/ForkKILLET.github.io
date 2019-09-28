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
	let $guide = $("#guide");
	$guide.html(
		`
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
    
        <img id="logo" alt="logo" src="http://icelava.ga/icelava.jpg" width="210px">
        <p class="text">
            <span style="color: #ff5b5a">RED</span> ICE - WE<br>
            <span style="color: #0e61e1">blue</span> lava~world
        </p> <hr>
    
        <p class="text">
            <i class="li-icon fa-fw fa fa-mouse-pointer"></i> Hits
            <img id="counter" alt="counter" src="http://www.cutercounter.com/hits.php?id=geqpdpp&nd=7&style=72"> 
        </p>
    `);
	$body.prepend(`<div id="user_op"></div>`);

	// Note: 用户面板（目前只有注销功能）
	$("#user_op").hide().html(`<p class="text"><i class="fa fa-sign-out"></i> Sign out</p>`);
	$("#user_op>p").click(function()
	{
		AJAX("GET", "http://loli.icelava.ga/sign_out.php", "application/x-www-form-urlencoded", null,
			function()
			{
				location.reload();
			});
	});
	$("#user:nth-child(3)").click(function()
	{
		location.reload();
	});

	let $user = $("#user");
	$user.data("tourist", true);
	$user.click(function()
	{
		if ($("#user").data("tourist") === false)
			$("#user_op").toggle();
	});

	// Note: 亮闪闪的 5 毛钱特效。
	let $pos = $("#pos");
	$pos.css("left", "calc(100% - 50px - " + $pos.width() + "px)");
	$pos.animate({"left": "300px"}, 1000, "swing");

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

	// Note: MathJax 配置
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
	// Note: Marked 配置
	let MD = new marked.Renderer();
	marked.setOptions
	({
		renderer: MD,
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false,
		highlight:
			function(code)
			{
				return hljs.highlightAuto(code).value;
			}
	});
	const ExMD_escape =
	[
		{ origin: '$$', temp: '$dol' },
		{ origin: '??', temp: '$que' },
		{ origin: ';;', temp: '$sem' }
	];
	const ExMD_labels =
	[
		{ // Note: 上标 e.g. $^awa^$
			name: ['^'],
			space: false,
			begin: `<sup>`,
			end: `</sup>`
		},
		{ // Note: 下标 e.g. $_awa_$
			name: ['_'],
			space: false,
			begin: `<sub>`,
			end: `</sub>`
		},
		{ // Note: 图标 e.g. $fa font-awesome fa$ $i spin;fw;cogs i$
			name: ['fa', 'i'],
			space: true,
			begin: `<span class="fa`,
			end: `"></span>`,
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
			space: true,
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
		{ // Note: 刮刮乐 e.g. $?hover on me!?$
			name: ['?'],
			space: false,
			begin: `<span class="lottery">`,
			end: `</span>`
		}
	];

	const origin_marked = marked;
	marked = function(str)
	{
		if (!str)return undefined;

		// Note: 执行转义
		for (let i in ExMD_escape)
			str = str.replace(RegExp(RegExp_escape(ExMD_escape[i].origin), "g"), ExMD_escape[i].temp);

		// Note: ExMD
		function calc_label(rule, str) // Note: 传入标签规则和标签内的内容，返回解析后的字符串。
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
					if (!rule.param[param_type])break;
				}
				arr_param[param_i] = rule.param[param_type].begin + arr_param[param_i] + rule.param[param_type].end;
			}
			return rule.begin + arr_param.join("") + rule.end;
		}
		
		for (let i in ExMD_labels) // Note: 遍历标签规则。
		{
			let v = ExMD_labels[i];

			for (let j in v.name) // Note: 遍历该标签的每个名称。
			{
				// Note: 获取标签的开关标记内容。
				let str_begin = "$" + v.name[j] + (v.space ? " " : "");
				let str_end = (v.space ? " " : "") + v.name[j] + "$";

				let k = str.length;
				while (1)
				{
					// Note:
					// 寻找标签。此处注意需要利用 "倒数第一个开标签" 来定位子串。
					// 因为对于形如 $label [A] $label [B] label$ label$ 的 ExMD 字符串，
					// 我们需要先解析 $label [B] label$ 的部分。若是直接正序匹配，我们会得到一个错误的字串
					// $label [A] $label [B] label$。
					let pos_begin = str.substring(0, k).lastIndexOf(str_begin);
					if (pos_begin === -1)break;
					let pos_label_end = str.substring(pos_begin).indexOf(str_end);
					if (pos_label_end === -1)break;
					pos_label_end += pos_begin;
					let pos_label_begin = pos_begin + str_begin.length;
					let pos_end = pos_label_end + str_end.length;
					k = pos_begin - 1;
					
					let label_str = str.substring(pos_label_begin, pos_label_end);
					
					// Note: 将原标签替换解析后的内容。
					str = str.substring(0, pos_begin) + calc_label(v, label_str) + str.substring(pos_end);
				}
			}
		}

		// Note: 还原转义
		for (let i in ExMD_escape)
			str = str.replace(RegExp(RegExp_escape(ExMD_escape[i].temp)), ExMD_escape[i].origin);

		// Note: 普通 MD 处理
		str = origin_marked(str);
		return str;
	};

	if (!is_local())
	{
		let md_areas = document.getElementsByClassName("md");
		
		function mf_show_md(i)
		{
			return function (XHR)
			{
				md_areas[i].innerHTML = marked(XHR.responseText);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, md_areas[i]]);
			};
		}
		
		// Note: 获取 Markdown 并解析显示。
		for (let i = 0; i < md_areas.length; i++)
		{
			if (md_areas[i].dataset.name == null) continue;
			AJAX
			(
				"GET", "http://loli.icelava.ga/load_md.php?name=" + md_areas[i].dataset.name,
				"application/x-www-form- urlencoded", null,
				mf_show_md(i)
			);
		}
	}
});
