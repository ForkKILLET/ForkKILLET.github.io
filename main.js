let md_values =
{
	home:
`
# $fa fa-flag fa$ 这里是 IceLava 团队的站点。  
蛤，你问 IceLava 是什么？  
就是一个开发东西的团队啦！  
我们目前刚刚搬家到这里（换域名），有些东西还没安置完毕……  

---

不过我们的一些项目还是可以使用的呢！
- $fali fa-gamepad fa$ [游戏：OI Nazo](OI-Nazo/index.html)  
- $fali fa-gamepad fa$ [游戏：蛮荒大陆](-Barren-Land-/index.html)  
- $fali fa-tag fa$ [工具：N $^ 2 ^$ ](N-2/index.html)  

---

此外 IceLava 团队的成员 ForkΨKILLET 也会将他的博客搭建在这里\\~   
其中有他的算法笔记、题解等内容，欢迎大佬指教！

---

。  

。  

。  

。  

。  

。  

。  

emmmm，有个事情忘了说，其实 IceLava 团队只有 ForkΨKILLET 一个人……  
是不是很假…… QAQ

---

_2019-08-22_
`
}

const log = console.log;

function init()
{
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
		{ from: /\$\^/g, to: "<sup>" },
		{ from: /\^\$/g, to: "</sup>" },

		{ from: /\$_/g, to: "<sub>" },
		{ from: /_\$/g, to: "</sub>" },

		{ from: /\$center/g, to: "<span style='text-align: center;'>" },
		{ from: /center\$/g, to: "</span>" },

		{ from: /\$style/g, to: "<span style='" },
		{ from: /style\$/g, to: "</span>" },

		{ from: / x\$/g, to: "'>" },
		{ from: / X\$/g, to: "</span>" },

		{ from: /\$fali/g, to: "<i class='li-icon fa fa-fw" },
		{ from: /\$fa/g, to: "<i class='fa " },
		{ from: /fa\$/g, to: "'></i>" }
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
		$i.innerHTML = marked(md_values[$i.dataset.name]);
	}
}