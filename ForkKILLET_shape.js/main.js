// Note: need JQuery

class ForkKILLETShape
{
	constructor()
	{
		Math.deg_to_rad = (deg) => deg * Math.PI / 180;
		Math.rad_to_deg = (rad) => rad / Math.PI * 180;
		Math.random_in_range = (min, max) => Math.random() * (max - min + 1) + min;
		Math.random_in_100 = () => Math.round(Math.random_in_range(0, 100));
		console.error_and_throw = (code, msg) =>
		{
			let e = Error(`[${code}] ForkKILLET_shape.js\n${msg}`);
			console.error(e);
			throw e;
		};

		if (!$ || typeof($) !== "function") console.error_and_throw("R001", "Need JQuery but not found the correct $ function.");
	}
	line(pa, id, size, x1, y1, x2, y2, color)
	{
		if (x2 < x1)
		{
			[x1, x2] = [x2, x1];
			[y1, y2] = [y2, y1];
		}
		let len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		let top = y1;
		let left = x1;
		let theta = 0;
		if (x1 === x2) theta = y1 < y2 ? -90 : 90;
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
	}

	circle(pa, id, s_size, x, y, r, s_color, i_color)
	{
		$(`#${pa}`).append($(`<div id="circle_${id}" class="circle"></div>`));
		let $i = $(`#circle_${id}`);
		$i.css("top", `${y - r}px`);
		$i.css("left", `${x - r}px`);
		$i.width(r * 2);
		$i.height(r * 2);
		$i.css("borderWidth", `${s_size}px`);
		$i.css("borderColor", s_color);
		$i.css("backgroundColor", i_color);

		// Note: 悬停动画
		$i.hover(() =>
		{
			$i.css("borderColor", i_color);
			$i.css("backgroundColor", s_color);
		}, () =>
		{
			$i.css("borderColor", s_color);
			$i.css("backgroundColor", i_color);
		});
	}

	link(id, URL)
	{
		let $i = $(`#${id}`);
		$i.before($(`<a id="link_${id}" href="${URL}"></a>`));
		$i.appendTo($(`#link_${id}`));
	}

	text_in_circle(circle, id, text, size, o_color, c_color, use_ExMD, ExMD)
	{
		let $c = $(`#circle_${circle}`);
		$c.append($(`<p id="${id}" class="text">${text}</p>`));
		let $i = $(`#${id}`);
		$i.css("fontSize", `${size}px`);
		$i.css("color", o_color);
		$i.parent().hover(() =>
		{
			$i.css("color", c_color);
		}, () =>
		{
			$i.css("color", o_color);
		});
		if (use_ExMD)
		{
			if (typeof(ExMD.render) !== "function") console.error_and_throw("R002", "Need ExMD but got a wrong ExMD object.");
			ExMD.render($i[0], $i.html());
		}
	}

	layer(id, layer)
	{
		if (layer) $(`#${id}`).css("zIndex", layer.toString());
		else return $(`#${id}`).css("zIndex");
	}
}