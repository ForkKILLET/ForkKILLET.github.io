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
            <p class="text"><i class="fa fa-fw fa-sign-in"></i></p>
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
	// Done: 解决页面过窄时 Copyright 显示不当的问题。

	// Note: 如果不是本地，token 登录。
	if (location.href.indexOf("localhost") === -1)
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

	// Note: Tex 公式配置
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

	// Note: Markdown 配置
	let MD = new marked.Renderer();
	marked.setOptions(
	{
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

	const md_$_labels =
	[
		{ from: /\$\$/g, to: "$dollar"},

		{ from: /\$\^/g, to: "<sup>" },
		{ from: /\^\$/g, to: "</sup>" },

		{ from: /\$_/g, to: "<sub>" },
		{ from: /_\$/g, to: "</sub>" },

		{ from: /\$fali/g, to: `<i class="li-icon fa fa-fw` },
		{ from: /\$fa/g, to: `<i class="fa ` },
		{ from: /fa\$/g, to: `"></i>` },

		{ from: /\$dollar/g, to: "$" }
	];

	const origin_marked = marked;
	marked = function(str)
	{
		for (let i = 0; i < md_$_labels.length; i++)
			str = str.replace(md_$_labels[i].from, md_$_labels[i].to);
		str = origin_marked(str);
		return str;
	};

	let md_areas = document.getElementsByClassName("md");
	function make_fn(i)    // Note: 闭包
	{
		return function (XHR)
		{
			md_areas[i].innerHTML = marked(XHR.responseText);
			// Note: 渲染 Tex 公式。
			// Done: 修好 Tex。
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, md_areas[i]]);
		};
	}

	// Note: 获取 Markdown 并解析显示。
	for (let i = 0; i < md_areas.length; i++)
	{
		if (md_areas[i].dataset.name == null)continue;
		AJAX("GET", "http://loli.icelava.ga/load_md.php?name=" + md_areas[i].dataset.name, "application/x-www-form- urlencoded", null, make_fn(i));
	}


});
