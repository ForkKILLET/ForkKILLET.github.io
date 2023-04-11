import 'cuiping-component/dist/style.css'

export let cuiping: Promise<typeof import('cuiping-component')>

export const loadCuiping = async () => {
    cuiping = import('cuiping-component')
}
