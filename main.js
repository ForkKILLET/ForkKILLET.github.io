// Note: 功能函数的定义

window.NF = () => {};
window.log = (msg) => console.log(msg);
window.AJAX = (type, url, MIME, value, fn_cb) =>
{
	let XHR = new XMLHttpRequest();
	XHR.open(type, url);
	XHR.setRequestHeader("Content-Type", MIME);
	XHR.withCredentials = true;
	XHR.onreadystatechange = () => { if (XHR.readyState === 4 && XHR.status === 200) fn_cb(XHR); }
	XHR.send(value);
};
window.is_local = () => location.href.indexOf("localhost") !== -1 || location.href.indexOf("file:///") !== -1;
window.get_URL_params = () =>
{
	let i = document.URL.indexOf("?");
	if (i === -1) return null;
	let p = document.URL.substring(i + 1).split("&");
	let r = {};
	for (let i in p)
	{
		let v = p[i];
		let j = v.indexOf("=");
		if (j === -1)r[v] = true;
		else r[v.split("=")[0]] = v.split("=")[1];
	}
	return r;
};

// Note: 开始干活

log("[LOAD]: icelava.top/main.js");
if (!window.script) window.script = {};
window.script.main = true;

$(document).ready(() =>
{
	// Note: 插入导航栏（侧边栏）
	let $body = $("body");
	$body.prepend(`<div id="guide"></div>`);
	$("#guide").html(`
        <h1 id="home"><a href="http://icelava.top/"><i class="fa fa-home"></i> Home</a></h1>
        <div id="user">
            <a href="http://icelava.top/sign_up">Sign up </a>
            <p><i class="fa fa-sign-in"></i></p>
            <a target="_blank" href="http://icelava.top/sign_in">in</a>
        </div> <hr>
        <a href="http://icelava.top/site_map"><i class="fa-fw fa fa-sitemap"></i> Site Map</a>
        <a href="http://icelava.top/friends"><i class="fa-fw fa fa-heart"></i> Friends</a>
        <a href="http://icelava.top/about_us"><i class="fa-fw fa fa-info-circle"></i> About us</a>
        <a href="http://icelava.top/log"><i class="fa-fw fa fa-file-text"></i> Log</a> <hr>
        <p><i class="fa-fw fa fa-rss-square"></i> Blogs</p>
        <a href="http://icelava.top/blogs/ForkKILLET"><i class="fa-fw fa fa-check"></i> ForkΨKILLET's</a> <hr>
        <img id="logo" alt="logo" src="https://s2.ax1x.com/2019/10/01/uNUSHg.md.jpg">
        <p>
            <span style="color: #ff5b5a">RED</span> ICE - WE<br>
            <span style="color: #0e61e1">blue</span> lava~world
        </p> <hr>
        <p>
            <i class="fa-fw fa fa-mouse-pointer"></i> Hits
            <img id="counter" alt="counter" src="http://www.cutercounter.com/hits.php?id=geqpdpp&nd=7&style=72"> 
        </p>
    `);

	// Note: 用户功能
	$body.prepend(`<div id="user_op"></div>`);
	$("#user_op").hide().html(`<a><i class="fa fa-sign-out"></i> Sign out</a>`);
	$("#user_op>a:first-child").click(() =>
	{
		AJAX("GET", "http://qwq.icelava.top/sign_out.php", "application/x-www-form-urlencoded", null,
		() => location.reload());
	});

	$("#user")
	.data("tourist", true)
	.click(() =>
	{
		if ($("#user").data("tourist") === false)
			$("#user_op").fadeToggle();
	});

	// Note: 亮闪闪的 5 毛钱特效。
	let $pos = $("#pos");
	$pos.css("left", "calc(100% - 50px - " + $pos.width() + "px)")
	    .animate({"left": "300px"}, 1000, "swing");

	// Note: 在 #main 下面写版权信息。
	$body.append(`<p id="copyright">Copyright© 2019 IceLava Dev Team. All Rights Reserved</p>`);

	// Note: 如果不是本地，token 登录。
	if (!is_local())
		AJAX("GET", "http://qwq.icelava.top/get_token.php", "application/x-www-form-urlencoded", null,
		(XHR) =>
		{
			let token = XHR.responseText;
			if (!token)return;
			let un = JSON.parse(token)["un"];
			let $user = $("#user");
			$user.data("tourist", false);
			$user.html(`<p><i class="fa-fw fa fa-user"></i>${un}</p>`);
		});

	// Note: MD 渲染的一系列操作。
	MathJax.Hub.Config(
	{
		messageStyle: "none",
		tex2jax:
		{
			inlineMath: [["$m ", " m$"]],
			displayMath: [["$M ", " M$"]],
			skipTags: ["script", "noscript", "style", "textarea", "pre", "code"]
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
				"GET", "http://qwq.icelava.top/load_md.php?name=" + $($md_areas[i]).data("name"),
				"application/x-www-form- urlencoded", null,
				mf_show_md(i)
			);
		}
	}

	window.FS = new ForkKILLETShape();
});