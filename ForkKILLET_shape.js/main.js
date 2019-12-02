// Note: need JQuery

class ForkKILLET_shape
{
	line(pa, id, size, x1, y1, x2, y2, color)
	{
		let c = x2 > x1;
		let len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		let top = c ? Math.max(y1, y2) : Math.min(y1, y2);
		let left = Math.max(x1, x2) - len + 2;
		let theta = (c ? 1 : -1)
		            * (Math.abs(x2 - x1)
		               ? (Math.atan(Math.abs(y2 - y1) / Math.abs(x2 - x1)) * 180 / Math.PI)
		               : 90);

		$(`#${pa}`).append($(`<div id='line_${id}' class='line'></div>`));
		let $i = $(`#line_${id}`);
		$i.css('top', `${top}px`);
		$i.css('left', `${left}px`);
		$i.width(len);
		$i.height(size);
		$i.css('backgroundColor', color);
		$i.css('transform', `rotate(${theta}deg)`);
	}

	circle(pa, id, s_size, x, y, r, s_color, i_color)
	{
		$(`#${pa}`).append($(`<div id='circle_${id}' class='circle'></div>`));
		let $i = $(`#circle_${id}`);
		$i.css('top', `${y - r}px`);
		$i.css('left', `${x - r}px`);
		$i.width(r * 2);
		$i.height(r * 2);
		$i.css('borderWidth', `${s_size}px`);
		$i.css('borderColor', s_color);
		$i.css('backgroundColor', i_color);

		// Note: 悬停动画
		$i.hover(function()
		{
			$i.css('borderColor', i_color);
			$i.css('backgroundColor', s_color);
		}, function ()
		{
			$i.css('borderColor', s_color);
			$i.css('backgroundColor', i_color);
		});
	}

	link(pa, id, URL)
	{
		$(`#${pa}`).append($(`<a id='link_${id}' href='${URL}'></a>`));
	}

	layer(id, layer)
	{
		if (layer) $(`#${id}`).css('zIndex', layer.toString());
		else return $(`#${id}`).css('zIndex');
	}
}