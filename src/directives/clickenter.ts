import { ObjectDirective } from 'vue'

export type ClickEnterEvent = (event: MouseEvent | KeyboardEvent) => void

const directive: ObjectDirective<HTMLElement, ClickEnterEvent> = {
    mounted: (el, binding) => {
        el.tabIndex = 0
        el.addEventListener('keypress', event => {
            if (event.key === 'Enter') binding.value(event)
        })
        el.addEventListener('click', binding.value)
    }
}

export default directive
