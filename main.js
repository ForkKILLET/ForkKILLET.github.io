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
- $fali fa-tag fa$ [工具：N $^ 2 ^$](N-2/index.html)  

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

_2019-08-23_
`,
	site_map:
`
# $fa fa-sitemap fa$ 这是本站的导航地图。
_注：不是用于浏览器抓取的那种。_  

---

$fali fa-home fa$ [主页：Mushouse 蘑菇树屋](https://icelava.ga/)
- $fali fa-book fa$ 文章列表
  - $fali fa-check fa$ [本页：站点地图 Site map](#)
  - $fali fa-check fa$ [特殊：友链 Friends](https://icelava.ga/frineds)
  - $fali fa-check fa$ [特殊：关于我们 About us](https://icelava.ga/about_us)
- $fali fa-gamepad fa$ [游戏：OI Nazo](https://icelava.ga/OI-Nazo/index.html)
  - $fali fa-warning fa$ _因为本子站点是网址解密游戏，故其中页面不予展示 QAQ_
- $fali fa-gamepad fa$ [游戏：Barren Land 蛮荒大陆](https://icelava.ga/-Barren-Land-/index.html)
- $fali fa-tag fa$ [工具：N $^ 2 ^$](https://icelava.ga/N-2/index.html)

---

_2019-08-23_
`,
	friends:
`
# $fa fa-heart fa$ 这里是 IceLava 团队的友链专区！
想要互换友链我们 100% 欢迎！可以在 [About us 页面](http://icelava.ga/about_us) 找到联系我们的方式哦！  
当然，您的网站必须要符合中华人民共和国法律法规才行呐~

---

$fali fa-commenting fa$ [蒟扯官网](https://jc-juche.github.io/website/)：致力于专业扯淡的、富有亲和力的网站。  

---

_2019-08-23_
`,
	about_us:
`
# $fa fa-info-circle fa$ 这里是关于 IceLava 的一些信息和联系方式等……
本网站是由 IceLava 团队开发的，并且 IceLava 团队目前只有 ForkΨKILLET 一个人。
本网站搭建于——  
$fa fa-github fa$ [Github](http://github.com/ForkFG/ForkFG.github.io)，点击链接可前往本站的 Github Repo。  
IceLava 团队在这里对 Github 表示衷心感谢，他们为我们提供了免费的静态页面储存库，使得我们的页面得以展示！

---

本网站的域名来自 [freenom](https://freenom.com/)，虽然 ForkΨKILLET 出于某种原因废了好大一番周折才搞定……（笑）  
IceLava 团队在这里也要感谢 freenom，我们敢说这是唯一一个有免费域名提供的网站了！没有他们，我们就不会有一个好记的域名。  
并且，如果 IceLava 团队有了足够的“经费”，我们会第一时间在 freenom 换成付费域名！  
此外我们还必须感谢 [CloudFlare](https://cloudflare.com) 提供的域名解析服务——真的非常快！

---

本网站的计数器来自 [CuterCounter](https://www.cutercounter.com/)，不过我们没有听从警告，擅自去掉了计数器上的链接。  
于是我们在这里补上链接，同时感谢 CuterCounter 为我们提供的免费网站计数器！

---

本网站中各种图标都来自于 $fa fa-flag fa$ [Font Awesome](https://fontawesome.dashgame.com/)，这些图标都非常可爱，并且免费！  
IceLava 团队再此感谢 Font Awesome，那里真的是一个有爱的地方 :)

---

如果您愿意加入 IceLava 团队，或者希望与我们互换友链（见 [Friends 页面](https://icelava.ga/friends)），或者愿意在本站发表博客……  
你可以用以下的方式联系我们：

$fali fa-qq fa$ ForkKΨILLET 的 QQ：[1096694717](http://wpa.qq.com/msgrd?v=3&uin=1096694717&site=qq&menu=yes)  
$fali fa-qq fa$ IceLava 的 QQ 群：[774225409](https://shang.qq.com/wpa/qunwpa?idkey=5177bf62ef83439d98cc73e2c0a12a75d9543b9a9c22b045c50babe1d2b4fb32)  
$fali fa-envelope fa$ ForkΨKILLET 的邮箱： fork_killet@qq.com  
$fali fa-envelope fa$ ForkΨKILLET 的另一个邮箱： lx16302@163.com  
$fali fa-github fa$ ForkΨKILLET 的 Github 账号：[ForkFG](https://github.com/ForkFG/)  
$fali fa-terminal fa$ ForkΨKILLET 的 洛谷 online judge 账号：[ForkΨKILLET](https://www.luogu.org/space/show?uid=125210)

---

_2019-08-23_
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
		{ from: /\$\$/g, to: "$dollar"},

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
		$i.innerHTML = marked(md_values[$i.dataset.name]);
	}
}