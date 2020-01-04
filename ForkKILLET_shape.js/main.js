if (!Object.prototype._am) Object.prototype._am = function (n, m)
{
	if (!this[n]) this[n] = m;
	return this;
};

window
._am("log", msg => console.log(msg))
._am("time", (if_hms, date) =>
{
	let d = date ? date : new Date(),
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
	return `${Y}-${M}-${D}` + (if_hms ? ` ${h}:${m}:${s}` : "");
})
._am("is_empty", n => n === null || n === undefined)
._am("is_array", n => typeof n === "object" && n.constructor.name === "Array")
._am("number_px", n => typeof n === "number" ? n + "px" : n);
Math
._am("deg_to_rad", (deg) => deg * Math.PI / 180)
._am("rad_to_deg", (rad) => rad / Math.PI * 180)
._am("random_in_range", (min, max, if_int) =>
{
	let r = Math.random() * (max - min + 1) + min;
	if (if_int) r = Math.trunc(r);
	return r;
})
._am("random_in_100", () => Math.random_in_range(0, 100, true));
window
._am("random_item", (arr) =>
{
	if (typeof arr === "object") return arr[Math.random_in_range(0, arr.length - 1, true)];
	else return null;
});

delete Object.prototype._am;

class ForkKILLETShape
{
	constructor()
	{
		this.error_and_throw = (code, msg) =>
		{
			let e = Error(`[ERROR: ${code}]: ForkKILLET_shape.js\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!$ || typeof $ !== "function") this.error_and_throw("R001", "Require JQuery but not found the correct $ function.");
		if (!window.script) window.script = {};
		window.script.ForkKILLET_shape = true;
		log("[LOAD]: icelava.top/ForkKILLET_shape.js/main.js");

		this.default_id =
		{
			line: 0,
			circle: 0,
			text: 0
		};
	}

	bind_canvas(id)
	{
		this.canvas = id;
	}

	line(pa, id, size, x1, y1, x2, y2, color)
	{
		if (is_empty(pa)) pa = this.canvas;
		if (is_empty(id)) id = `FS_default_${this.default_id.line++}`;
		size = number_px(size);

		if (x2 < x1)
		{
			[x1, x2] = [x2, x1];
			[y1, y2] = [y2, y1];
		}
		let len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		let top = y1;
		let left = x1;
		let theta = 0;
		if (x1 === x2) theta = y1 < y2 ? 90 : -90;
		else if (y1 !== y2) // Note: tan(theta) = y / x, theta = atan(y / x).
			theta = Math.rad_to_deg(Math.atan((y2 - y1) / (x2 - x1)));

		$(`#${pa}`).append($(`<div id="line_${id}" class="line"></div>`));
		let $i = $(`#line_${id}`);
		$i.css("top", `${top}px`);
		$i.css("left", `${left}px`);
		$i.width(len);
		$i.height(size);
		$i.css("backgroundColor", color);
		$i.css("transform", `rotate(${theta}deg)`);
		$i.css("transformOrigin", "top left");

		return $i;
	}

	circle(pa, id, s_size, x, y, r, s_color, i_color)
	{
		if (is_empty(pa)) pa = this.canvas;
		if (is_empty(id)) id = `FS_default_${this.default_id.circle++}`;
		if (typeof s_size === "number") s_size += "px";

		$(`#${pa}`).append($(`<div id="circle_${id}" class="circle"></div>`));
		let $i = $(`#circle_${id}`);
		$i
		.css("top", `${y - r}px`)
		.css("left", `${x - r}px`)
		.width(r * 2).height(r * 2)
		.css("borderWidth", s_size)
		.css("borderColor", s_color)
		.css("backgroundColor", i_color)
		.hover(() => $i.css("borderColor", i_color).css("backgroundColor", s_color),
		       () => $i.css("borderColor", s_color).css("backgroundColor", i_color));

		return $i;
	}

	link(id, URL)
	{
		let $i = $(`#${id}`);
		$i.before($(`<a id="link_${id}" href="${URL}"></a>`)).appendTo($(`#link_${id}`));

		return $i;
	}

	text_in_circle(circle, id, text, size, o_color, c_color, use_ExMD, ExMD)
	{
		if (is_empty(id)) id = `FS_default_${this.default_id.text++}`;

		let $c = $(`#circle_${circle}`);
		$c.append($(`<p id="${id}" class="text">${text}</p>`));
		let $i = $(`#${id}`);
		$i
		.css("fontSize", `${size}px`)
		.css("color", o_color)
		.parent().hover(() => $i.css("color", c_color),
		                () => $i.css("color", o_color));

		if (use_ExMD)
		{
			if (!ExMD instanceof ExtendedMarkdownParser) this.error_and_throw("R002", "Require ExtendedMarkdownParser but didn't get a correct ExtendedMarkdownParser object.");
			ExMD.render($i, $i.html());
		}

		return $i;
	}

	layer(id, layer)
	{
		if (layer) $(`#${id}`).css("zIndex", layer.toString());
		else return $(`#${id}`).css("zIndex");
	}
}