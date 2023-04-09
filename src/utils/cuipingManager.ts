import 'cuiping-component/dist/style.css'

export let Cuiping: typeof import('cuiping-component').Cuiping

export const loadCuiping = async () => {
    ({ Cuiping } = await import('cuiping-component'))
}
