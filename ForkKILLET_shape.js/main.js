// Note: need JQuery

class ForkKILLET_shape
{
	constructor()
	{
		Math.deg_rad = deg => deg * Math.PI / 180;
		Math.rad_deg = rad => rad / Math.PI * 180;
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
		if (y1 !== y2) // Note: tan(theta) = a / b, theta = atan(a / b).
			theta = Math.rad_deg(Math.atan((x2 - x1) / (y2 - y1)));

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
		$i.hover(function ()
		{
			$i.css("borderColor", i_color);
			$i.css("backgroundColor", s_color);
		}, function ()
		{
			$i.css("borderColor", s_color);
			$i.css("backgroundColor", i_color);
		});
	}

	link(pa, id, URL)
	{
		$(`#${pa}`).append($(`<a id="link_${id}" href="${URL}"></a>`));
	}

	layer(id, layer)
	{
		if (layer) $(`#${id}`).css("zIndex", layer.toString());
		else return $(`#${id}`).css("zIndex");
	}
}