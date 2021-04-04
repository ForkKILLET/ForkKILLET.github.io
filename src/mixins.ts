// :: Import

import { fetchData } from "./utils.js"

// :: Mixins

type Ctor<T> = new (...arg: any[]) => T
type Mixin<I, S = never> = <T> (B: Ctor<T>) => (Ctor<T | I> | S)

const MixWith = <T> (B: Ctor<T>, ...mixins: Mixin<any, any>[]) =>
	mixins.length
		? MixWith(mixins[0](B), ...mixins.slice(1))
		: B
const Mix = (...mixins: Mixin<any, any>[]) => MixWith(Object, ...mixins)

interface ILog {
	log(...msg: any[]): void
	err(...msg: any[]): void
}
const Log = (text: string, bgColor: string): Mixin<ILog> =>
	<T> (B: Ctor<T>) => class extends (B ?? Object) {
		log(format: string, ...msg: any[]) {
			console.log(
				`%c${text}%c ${format}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px white;
`, ``,
				...msg
			)
		}
		err(...msg: any[]) {
			console.error(
				`%c${text}`, `
border-radius: 7px;
padding: 1px 3px;
color: white;
background-color: ${bgColor};
box-shadow: 0 0 5px red;
`,
				...msg
			)
		}
	}

interface IFromData {
	name: string
}
interface SFromData {
	fromData(name: string): Promise<any>
}
const FromData = (prefix: string, postfix: string): Mixin<IFromData, SFromData> =>
	<T> (B: Ctor<T>) => class extends (B ?? Object) {
		name: string
		static async fromData(name: string) {
			const instance = new this(await fetchData(prefix + name + postfix))
			instance.name = name
			return instance
		}
	}

// :: Export

export { Mix, MixWith, Log, FromData }

