# $i file-alt i$ 本站更新日志

---
$toc$

## 2020-01-15
1. `BarrenLand/` `[VER β0.5.3]`  
   `feat(Keyboard):` 现在可以用上下方向键在选择框列表中移动，`Enter` 键选择项目并确认了。  
   `upd(Keyboard):` `Alt` 键聚焦功能更加智能了：如果聚焦目标不是在日志模块，将会滚动到它。

---

## 2020-01-10
1. `BarrenLand/` `[VER β0.5.1]`  
   `upd(Odule : INFO):` 添加了新的帮助：快捷键列表。并且可以在游戏信息之间选择了。  
   `upd(Keyboard):` 现在仅在 PC 端启用键盘操作了。  
   `abd(Module : SETTING):` 去除快捷键设置项，因为这似乎没什么用。  
   `upd(Odule : SETTING):` 侧模块的设置按钮不再只能显示设置模块，当设置模块已经展示时，再点击此按钮将会隐藏设置模块。  
2. `BarrenLand/` `[VER β0.5.2]:` `fix(Storage):` 去除不必要的数据储存项。

---

## 2020-01-09
1. `BarrenLand/` `[VER β0.5.0]`
   `feat(Keyboard : Global):` 加入了快捷键功能。  
   - 当玩家按下 `Alt` 键时，会在已启用的表单组件（行内按钮，输入框及选择框）下方显示标记的数字（`0-9`），此时按住 `Alt` 键不放，再按下对应数字，即可聚焦到对应组件。
   - 为大多数方形按钮添加了快捷键。（由于将来会多个模块都会有关闭按钮，设置的关闭按钮暂时没有添加）
   - 添入了日志标签切换的快捷键。
   `upd(Module : SETTING):` 添入了相关设置。

---

## 2020-01-05
1. `BarrenLand/` `[VER β0.4.0]`  
   `feat(Module : BAG):` 添入了背包模块。目前是空的。  
   `upd(Plot : MainStory):` 推进主线：拿到了背包（其实没几行字）。  
   `upd(Plot : start):` 游戏开始前做了更多的引导。比如设置。  
   `feat(Module : SETTING):` 添入了新的设置：是否仅单独显示模块——对于设置和将完善的背包模块，启用此项设置时，将不再位于页面右侧（与日志模块各占一半的空间），而是占满整个主要页面。侧模块不在此列。

---

## 2020-01-04
1. `BarrenLand/` `[VER β0.3.0]`  
   `feat(Module : CANVAS, MESSAGE):` 添入覆盖整个游戏界面的画布，可用于绘制特效。预留了消息提示的位置。  
   `feat(Animation : Transmit):` 添入传送特效。  
   `style:` 移出 `typeof` 后的括号。  
   `upd(Module : INFO):` 添入新年快落的文字。
2. `ExMD/` `fix(contents):` 修复目录隐藏后，小按钮不显示的 bug。

---

## 2020-01-03
1. `fix(guide):` 微调导航栏样式：点击量换行显示。

---

## 2020-01-02
1. [`[AUT @wangxinhe2006]`]((https://github.com/wangxinhe2006))  
   `style:` 去除 `CRLF`，统一使用 `LF`。  
   `upd(path):` `icelava.top` 改为 `/`。

---

## NEW YEAR
1. $c #ff2222;新年快落哦！ c$
2. [洛谷冬日绘版](https://luogu.com.cn/paintBoard) 来年再战！
3. 广大学生群体快要放寒假了啊……祝你们寒假快落！

---

## 2019-12-31
1. `BarrenLand/` `[VER β0.2.6]`  
   `feat(Unit : Select):` 加入了选择框组件！  
   `upd(Plot : MainStory):` `done:` 选择携带的物品。 `todo:` 穿越后的世界观讲解。  
   `upd(Unit : Input, BtnInline):` `done:` 封装了禁用方法。并且封装进了 `ExMD` 中，调用更方便了。 `todo:` 以此为基础加入消息弹框组件。  
   `feat(Module : setting):` 加入数据储存位置的选择，现在可以把设置数据保存在 `localStorage` 中了！
2. `ExMD/` `refactor:` 全部使用了 JQuery，更加统一了。并且优化了模块调用，更易于添加新的模块了。
3. `BarrenLand/` `[VER β0.2.7]` `fix(Unit : Select):` 修复了禁用选择框组件后其确认按钮仍会触发点击事件的 bug。
4. `BarrenLand/` `[VER β0.2.8]`  
   `upd(Module : setting):` 添加了新的设置：打印日志时是否自动切换到目标标签。并且分类了设置项。  
   `upd(Plot : MainStory):` 优化少量文案。  
   `refactor(Storage : Setting):` 数据分类存储。
    
---

## 2019-12-30
1. `upd(font):` 增加了微软雅黑的字体，中文显示在较多的设备上更好康了。
2. `OI-Nazo/` `upd:` 修复大量被主站覆盖的样式。

---

## 2019-12-24
1. `BarrenLand/` `[VER β0.2.5]` `refactor(Unit):` 优化组件的操作方式。
2. `ForkKILLET_blog/` `fix:` 修复某次重构引起的若干问题。

---

## 2019-12-23
1. `BarrenLand/` `[VER β0.2.4]`  
   `upd(Plot : MainStory):` 推进主线：名字获取。`todo:`  选择携带的物品。 
   `upd(Unit : Input):` 可以禁用输入框了。`todo:` 封装禁用方法。  
   `upd(Module : info):` 优化配色。

---

## 2019-12-21
1. `BarrenLand/` `[VER β0.2.3]`  
   `feat(Unit : Input, BtnMicro):` 添入了输入框以及配套使用的小型按钮组件。  
   `feat(Module : settings):` 添入新设置：可调整日志显示的间隔时间。  
   `upd(Unit : BtnInline):` 优化了日志行内按钮的样式。  
   `upd(Module : log):` 优化了标签页的配色。
 
2. `fix(guide):` 似乎修复了页面初始动画的一些 bug。

---

## 2019-12-15
1. `BarrenLand/` `[VER β0.2.1]`  
   `feat(Units : SplitLine):` 加入了分割线组件。  
   `feat(Units : BtnInline, used):` 修复了行内按钮可以点击多次的 bug，并稍微更改其样式。  
   `feat(Plot : MainStory):` 加入小段剧情.  
2. `BarrenLand/` `[VER β0.2.2]`  
   `feat(Unit : Switch):` 加入开关组件。  
   `feat(setting):` 添入设置模块，允许关闭日志渐显特效。  
   `fix(clear log):` 修复清楚日志按钮会清除所有日志（而非当前日志标签页）的 bug.

---

## 2019-12-14
1. `feat(UI, iOS):` 干掉了长按有点击事件元素时出现的灰色蒙版。
2. `BarrenLand/` `[VER β0.2.1]`  
   `feat(Units : SplitLine):` 加入了分割线组件。  
   `feat(Units : BtnInline, used):` 修复了行内按钮可以点击多次的 bug，并稍微更改其样式。  
   `feat(Plot : MainStory):` 加入小段剧情。

---

## 2019-12-10
1. `fix:` 修复了点击计数器不能显示的 bug
2. `ExMD/` `fix(FontAwesome):` 修复了 `FontAwesome` 中商标图标显示不正确的 bug

---

## 2019-12-09
1. `BarrenLand/` `[VER β0.2.0]`  
   `feat(Units : BtnSquare, BtnInline):` 完善了方形按钮的组件，并为其加入了动画；填入了日志行内按钮组件。  
   `feat(clear log):` 添入了清楚当前标签页日志的按钮。  
   `feat(info):` 添入了显示游戏信息的功能。  
   `feat(pigeon):` 添入了剧情正在策划中的咕咕行为（滑稽）。
2. `BarrenLand/` `fix(clear log):` 修复了 `clear log` 按钮悬停提示显示不正常的 bug。
3. `fix:` 补回了一些误删的浏览器标题。

---

## 2019-12-07
1. `refactor(path):` 大肆整改目录结构完毕！
2. `[VER 0.3.2]` `feat(guide):` 增加了显示/隐藏导航栏的功能！还优化了标题特效。
3. `fix:` 修复了一堆改用箭头函数引起的 `JQuery` bug。原因：箭头函数没 `this`，`$.click` 中，可使用 `(event) => event.currentTarget` 代替。
4. `feat(require, FontAwesome)`: 将 `FontAwesome` 从 `V4` 升级到了 `V5`，并修复因此产生的若干 bug。
5. `BarrenLand/` `[VER β0.0.0]` `feat: 重置后第一次提交！有了一个最最基本的架构。`。

---

## 2019-12-06
1. `[VER 0.3.1]` `refactor(path):` 大肆整改目录结构开始！

---

## 2019-12-04
1. `ForkKILLET_shape.js/` `[VER 0.0.2]` `fix(line):` 修复了画线的若干 bug。原因：ForkKILLET 三角函数没学~~好~~（过）。

---

## 2019-12-03
1. `refactor(require)`: 删去了重复引入的 JS。

---

## 2019-12-02
1. `ForkKILLET_shape.js/` `[VER 0.0.1]` `feat(link, text_in_circle):` 支持链接以及在圆内写字的功能，并修复若干 bug。
2. `style:` 采用箭头函数替换匿名函数（`function ()`）。

---

## 2019-12-01
1. `fix(style):` 新的一月！修改了许多样式的 bug。
2. `[VER 0.0.0]` `ForkKILLET_shape.js/` `feat(line, circle):` 加入了 `ForkKILLET` 的图形类！想了好多名字都重复（包括 `shape.js`），只好加了前缀……目前可以画线和圆。

---

## 2019-11-29
1. `[VER 1.3.0]` `config(domain):` 完成了更换域名的工作！（原域名 `icelava.ga`）感谢免费赞助新域名的大佬 `0xsf`！

---

## AN ACCIDENT
1. ForkKILLET 由于 `CSP` 考试，暂时停止本站的开发。
2. 已于 2019-12-07 恢复。

---

## 2019-10-05
1. `ExMD/` `fix(Maths, contents):` 修复了目录中数学公式不解析的 bug。
2. `blogs/ForkKILLET/` `feat:` 跳转页面时会取消 `URL` 中锚点部分。
3. `ExMD/` `feat(contents):` 采用 `\$contents\$ / \$toc\$` 标签来判定是否显示目录。（而非 `ExMD.settings`）

---

## 2019-10-04
1. `blogs/ForkKILLET/` `[VER 1.2.1]` `feat:` 可以通过 `http://icelava.top/blogs/ForkKILLET/?name={文章编号}` 的方式直接进入文章了！
2. `ExMD/` `feat(atc add document):` 添加了 [`ExMD` 文档](http://icelava.top/ForkKILLET_blog/?name=N1902)
3. `blogs/ForkKILLET/` `[VER 1.2.2]` `feat(contents):` 添入目录模块！！（可控制是否展示目录，目录根据 `Markdown` 中的 `#` 和 `##` 自动抓取）

---

## 2019-10-03
1. `[VER 1.3.4]` `refactor:` 重构样式表！爽死。
2. `feat(highlight):` 终于正确地使用了代码高亮。
3. `feat(UI, guide):` 第 $m N m$ 次优化侧边栏样式。

---

## 2019-10-02
1. `fix(user):` 解决了用户登录不正常的问题。
2. `fix(UI):` 日常调整一波样式。

---

## 2019-10-01
1. `ExMD/` `[VER 1.2.1]` `fix(ExMD):` 解决了 `ExMD` 与 `nMD`（普通 `Markdown`） 冲突的问题。
2. `config(logo):` 使用了图床，加载更快了！
3. `config(highlight):` 换用了 `Bootstrap` 的 CDN，原先的 `Cloudflare` 的不知何故不能用了。
4. `feat(user):` 登录 / 注册后会刷新页面。

---

## 2019-09-29
1. `ExMD/` `[VER 1.1.0]` `feat(ExMD):` 加入了 `wordbox` 标签。（用于 ForkKILLET 的英语作业）
2. `feat(UI):` 优化了小号标题的样式。
3. `ExMD/` `[VER 1.1.1]` `feat(ExMD):` 优化 `wordbox` 标签的样式若干。
4. `ExMD/` `[VER 1.2.0]` `refactor(ExMD):` 进行封装（`class ExtendedMarkdownParser`）！
5. 你知道吗：$c #ff2222;今天是 IceLava 的 1 岁生日哦！ c$

---

## 2019-09-28
1. `ExMD/` `[VER 1.0.0]` `feat(MD):` `ExMD` 全面升级！支持更好的语法和展现能力！
2. `config(AJAX):` 为了方便调试，`AJAX` 请求不会在本地发起。

---

## 2019-09-25
1. `OI-Nazo/` `fix(level tree):` 修正了判断关卡是否展示的算法。
2. `OI-Nazo/` `refactor(level map):` 考虑到 "树" 的定义，将 `level_tree` 页面更名为 `level_map`。
3. `OI-Nazo/` `feat(UI, level map):` 优化其样式若干。
4. `OI-Nazo/` `feat(level tree):` 404 页面将。

---

## 2019-09-24
1. `OI-Nazo/` `[VER 2.0.0]` `feat(user, level tree):` 成功接入 `Mushouse` 账户，`level tree` 关卡树页面完工！！

---

## AN ACCIDENT
1. ForkKILLET 忘了写日志。
2. 已于 2019-09-24 恢复。

---

## 2019-09-17
1. `blogs/ForkKILLET/` `[VER 1.2.0]` `feat(tag):` 加入标签系统！！

---

## 2019-09-16

1. `feat(UI):` 调大了代码块的字号，阅读更舒畅！
2. `feat(atc upd friends)`: 添加了 `Jelly_Goat` 与 `Amor_Hucsy` 的友链。
3. `blogs/ForkKILLET/` `fix(contents):` 修正了无法搜索标签的 bug。
4. `blogs/ForkKILLET/` `feat(contents):` 将文章按照时间从新到旧排序了。

---

## 2019-09-15  
1. `blogs/ForkKILLET/` `feat(security):` 做了一些数据库安全方面的工作。
2. `[VER 1.3.3]` `feat(highlight, MD):` 支持了代码高亮！
3. `feat(UI):` 优化了链接的样式（尤其是是否独占一行的判断），并且弄了个特效。
4. `feat(UI):` 优化了表格的样式（尤其是边框的添加，与字号的修正）。
5. `style:` 决定按照时间从新到旧的方式排列此日志。
6. `feat(UI):` 把 `Copyright` 的字号调小了，免得页面过窄时挤到上面。

---

## 2019-09-14  
1. `config:` 修正了判断环境是否在线的逻辑。
2. `feat(blog/ForkKILLET/, UI):` 搞定了筛选文章的 UI。
3. `style:` 决定给博客等子站赋予不同的版本号。
4. `blogs/ForkKILLET/` `[VER 1.0.0]` `feat(contents)` 完成目录显示系统，支持了搜索，但是标签的搜索并不完善（弄一个可供选择的标签列表会更好）下一步：显示具体的文章。
5. `blogs/ForkKILLET/` `[VER 1.1.0]` `feat(contents)` 可以阅读博客具体文章了！下一步：优化标签。

---

## 2019-09-13  
1. `[VER 1.3.3]` `feat(security, user):` 根据 **无限 UCW** 的建议，用户密码存入数据库时加了一层 `md5`，更加安全了！

---

## AN ACCIDENT  

1. 由于 ForkKILLET 的计算机出了点问题，（固态盘坏了）网站有 3 天没有任何更新。  
2. 已于 2019-09-13 恢复正常更新！

---

## 2019-09-09  
1. `feat(UI):` 继续美化 UI：给标题（`pos`）加上了五毛钱特效；优化了导航栏鼠标悬停特效；优化了表单特效（包括按钮的特效更改）；优化了用户界面若干……
2. `feat(atc upd friends):` 添加了 无限 UCW 的友链，以及感谢！
3. `blog/ForkKILLET/` `test(contents):` 初步完成筛选文章的界面，后台内容并没有实装……
4. `[VER 1.3.2]` `feat:` 添入了页面底部的 `Copyright` 信息。~~逼格瞬间上去了有木有~~
5. `config(MathJax):` 关闭其加载消息。（页面底部那个灰色的框，遮住 Copyright 了）

---

## 2019-09-08  
1. `[VER 1.2.0]` `refactor:` 使用 `JQuery` 重构，优化了部分 `DOM` 操作。
2. `[VER 1.3.0]` `feat(user):` 支持了用户注销（`Sign out`）。
3. `[VER 1.3.1]` `feat(UI):` 美化 UI 若干：修改字体为 `Consolas (SansSerif)`；列表优化（包括修复了有序列表没数字的 bug）；开始添加动画与特效……

---

## 2019-09-07  
1. `[VER 1.1.1]` `fix(MD):` 修复了 `Tex` 数学公式不能正常展示的 bug。
2. `[VER 1.1.2]` `fix(UI):` 修复了页面高度不够时侧边栏显示不正常的 bug，现在可以滚动侧边栏了。

---

## 2019-09-06  
1. `style:` 决定按照 `Git Commit` 规范来编写本日志。
2. `feat(upd atc):` 更新了 `site map` 页面，加入了注册登录页面的索引。
3. `feat(add atc):` 添入了一张 `404` 页面。
3. `[VER 1.1.0]` `feat(user):`  增加了记住登录状态的功能！登录后会在原先 `Sign up / Sign in` 处显示用户名。

---

## 2019-09-05  
1. 发现了 `AJAX` 错误的原因。
2. 又导致了跨域的问题。
3. 解决了跨域的问题，出现了数据库操作的问题。
4. `[VER 1.0.0]` 注册功能正式上线！
5. `[VER 1.0.1]` 添加了邮箱判重的功能。（一个邮箱一个号）
6. 将本页面上线。

---

## 2019-09-04  
1. 浏览器访问 `verify.php` 正常。

---


## 2019-09-03  
1. 完成了验证功能，开始测试。
2. 成功地获取了正确的 `token`！

---


## THE ANCIENT  
1. `[VER 0.0.0]` 远古版本（2019-09-03 以前）。

---

## THE END  
[qwq](#一个彩蛋，还没想好要放什么……)