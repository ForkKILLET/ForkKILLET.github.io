function log(info)
{
	console.log(finfo);
}

function E(id)
{
	return document.getElementById(id);
}

function AJAX(type, url, MIME, value, fn_cb)
{
	let XHR = new XMLHttpRequest();
	XHR.open(type, url);
	XHR.setRequestHeader("Content-Type", MIME);
	XHR.onreadystatechange = 
	function()
	{
		if (XHR.readyState == 4 && XHR.status == 200)fn_cb(XHR);
	}
	XHR.send(value);
}

function init()
{
	E("guide").innerHTML =
	`
	<a href='http://icelava.ga/'><p id='home'>
		<i class='fa fa-home'></i> Home
	</p></a>
	<a href='http://icelava.ga/site_map'><p class='text'>
		<i class='li-icon fa-fw fa fa-sitemap'></i> Site Map
	</p></a>
	<a href='http://icelava.ga/friends'><p class='text'>
		<i class='li-icon fa-fw fa fa-heart'></i> Friends
	</p></a>
	<a href='http://icelava.ga/about_us'><p class='text'>
		<i class='li-icon fa-fw fa fa-info-circle'></i> About us
	</p></a> <hr>

	<p class='text'><i class='li-icon fa-fw fa fa-rss-square'></i> Blogs</p>
	<a href='http://icelava.ga/blog_forkkillet'><p class='text'>
		<i class='li-icon fa-fw fa fa-check'></i> ForkΨKILLET's
	</p></a> <hr>

	<img id='logo' src='http://icelava.ga/icelava.jpg' width='210px'>
	<p class='text'>
		<span style='color: #ff5b5a'>RED</span> ICE - WE<br>
		<span style='color: #0e61e1'>blue</span> lava - world
	</p> <hr>

	<p class='text'>
		<i class='li-icon fa-fw fa fa-mouse-pointer'></i> Hits
		<img id='counter' src='http://www.cutercounter.com/hits.php?id=geqpdpp&nd=7&style=72'> 
	</p>
	`

	MathJax.Hub.Config(
	{
		tex2jax:
		{
			inlineMath: [["$math ", " math$"]],
			displayMath: [["$Math ", " Math$"]],
			skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"]
		}
	});

	var MD = new marked.Renderer();
	marked.setOptions(
	{
		renderer: MD,
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false
	});
	
	const md_$_labels =
	[
		{ from: /\$\$/g, to: "$dollar"},

		{ from: /\$\^/g, to: "<sup>" },
		{ from: /\^\$/g, to: "</sup>" },

		{ from: /\$_/g, to: "<sub>" },
		{ from: /_\$/g, to: "</sub>" },

		{ from: /\$fali/g, to: "<i class='li-icon fa fa-fw" },
		{ from: /\$fa/g, to: "<i class='fa " },
		{ from: /fa\$/g, to: "'></i>" },

		{ from: /\$dollar/g, to: "$" }
	]

	const origin_marked = marked;
	marked = function(str)
	{
		for (let i = 0; i < md_$_labels.length; i++)
			str = str.replace(md_$_labels[i].from, md_$_labels[i].to);
		str = origin_marked(str);
		return str;
	}

	let md_areas = document.getElementsByClassName("md");
	let $i;
	for (let i = 0; i < md_areas.length; i++)
	{
		$i = md_areas[i];

		AJAX("GET", "http://loli.icelava.ga/load_md.php?name=" + $i.dataset.name, "application/x-www-form- urlencoded", null, 
		function(XHR)
		{
			$i.innerHTML = marked(XHR.responseText);
		});

		MathJax.Hub.Queue(["Typeset", MathJax.Hub, $i]);
	}
}