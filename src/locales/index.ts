import { storageRef } from '../utils/storage'
import enUS from './langs/en-US.json'
import zhCN from './langs/zh-CN.json'

export type MessageSchema = [ typeof enUS, typeof zhCN ]
export const langs = [ 'zh-CN', 'en-US' ] as const
export type MessageLangs = (typeof langs)[number]

export const locale = storageRef<MessageLangs>('icelavaLocale', 'zh-CN')

export const messages = {
    'zh-CN': zhCN,
    'en-US': enUS
}
