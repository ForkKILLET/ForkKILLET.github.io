// :: Init

import { $top, $ } from "./node"

const init = async () => {

const
	$about = await $($top).title("IceLavaTop").icon("il"),
	$games = $($top).title("Games"),
		$hwn = await $($games).title("HardWayNazo").link("/HardWayNazo").icon("hwn"),
		$tpe = await $($games).title("TrainProblemEmulator").link("/TrainProblemEmulator").icon("tpe"),
	$novels = $($top).title("Novels"),
		$xbqg = $($novels).title("TerminalXbqg").link("//github.com/ForkFG/TerminalXbqg"),
	$friends = $($top).title("Friends"),
	$OI = $($top).title("About OI"),
		$exlg = await $($OI).title("Extend Luogu").link("//github.com/optimize-2/extend-luogu").icon("exlg"),
	$wlog = $($top).title("ForkΨKILLET's wlog"),
		$home = await $($wlog).wlog("home")

$top.render()

}

window.addEventListener("load", init)

