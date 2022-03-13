// :: Init

import { $top, $ } from "./node.js"

const init = async () => {

const
	$about = await $($top).title("IceLavaTop").icon("il"),
	$games = $($top).title("Games"),
		$hwn = await $($games).title("HardWayNazo").link("/HardWayNazo").icon("hwn"),
		$tpe = await $($games).title("TrolleyProblemEmulator").link("/TrolleyProblemEmulator").icon("tpe"),
		$som = await $($games).title("SudoerOfMyself").link("/SudoerOfMyself").icon("som"),
	$novels = $($top).title("Novels"),
		$xbqg = $($novels).title("TerminalXbqg").link("//github.com/ForkKILLET/TerminalXbqg"),
	$friends = $($top).title("Friends"),
	$OI = $($top).title("About OI"),
		$exlg = await $($OI).title("Extend Luogu").link("//github.com/optimize-2/extend-luogu").icon("exlg"),
	$wlog = $($top).title("ForkΨKILLET's wlog"),
		$home = await $($wlog).wlog("home")

$top.render()

}

window.addEventListener("load", init)

