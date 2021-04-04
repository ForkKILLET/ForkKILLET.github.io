// :: Utils

const fetchData = async (url: string, res: "text" | "json" = "text", opt?: any) =>
	await (await fetch("/FkData/" + url, opt))[res]()

const openUrl = (u: string) => {
	let external = false
	if (u.startsWith("//")) external = true
	else if (location.hostname === "localhost") {
		let dirs = u.split("/")
		if (
			! dirs[0] &&
			[ "HardWayNazo", "TrainProblemEmulator" ].includes(dirs[1])
		) dirs = [ ...dirs.slice(0, 2), "docs", ...dirs.slice(2) ]
		else dirs.unshift("docs")
		if (! dirs.slice(-1)[0].endsWith(".html")) dirs.push("index.html")
		u = dirs.join("/")
	}
	window.open(u, external ? "_blank" : "_self")
}

// :: Export

export { fetchData, openUrl }

